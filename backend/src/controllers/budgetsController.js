import { sql } from "../config/db.js";

export async function getBudgetsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const budgets = await sql`
      SELECT * FROM budgets WHERE user_id = ${userId} ORDER BY category ASC
    `;

    res.status(200).json(budgets);
  } catch (error) {
    console.log("Error getting the budgets", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBudget(req, res) {
  try {
    const { user_id, category, amount, period } = req.body;

    if (!user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "user_id, category, and amount are required" });
    }

    const budget = await sql`
      INSERT INTO budgets(user_id, category, amount, period)
      VALUES (${user_id}, ${category}, ${amount}, ${period || "monthly"})
      ON CONFLICT (user_id, category, period)
      DO UPDATE SET amount = ${amount}, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    res.status(201).json(budget[0]);
  } catch (error) {
    console.log("Error creating the budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBudget(req, res) {
  try {
    const { id } = req.params;
    const { amount, period } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid budget ID" });
    }

    if (!amount && !period) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    const existingBudget = await sql`
      SELECT * FROM budgets WHERE id = ${id}
    `;

    if (existingBudget.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const updatedBudget = await sql`
      UPDATE budgets
      SET
        amount = ${amount !== undefined ? amount : existingBudget[0].amount},
        period = ${period !== undefined ? period : existingBudget[0].period},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json(updatedBudget[0]);
  } catch (error) {
    console.log("Error updating the budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteBudget(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid budget ID" });
    }

    const result = await sql`
      DELETE FROM budgets WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.log("Error deleting the budget", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBudgetAnalytics(req, res) {
  try {
    const { userId } = req.params;

    // Get all budgets for user
    const budgets = await sql`
      SELECT * FROM budgets WHERE user_id = ${userId}
    `;

    // Calculate spending for each budget category in current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const budgetAnalytics = await Promise.all(
      budgets.map(async (budget) => {
        // Get spending for this category in current period (month)
        const spending = await sql`
          SELECT COALESCE(SUM(ABS(amount)), 0) as spent
          FROM transactions
          WHERE user_id = ${userId}
            AND category = ${budget.category}
            AND amount < 0
            AND created_at >= ${monthStart.toISOString()}
        `;

        const spent = parseFloat(spending[0].spent);
        const budgetAmount = parseFloat(budget.amount);
        const remaining = budgetAmount - spent;
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

        return {
          id: budget.id,
          category: budget.category,
          budget: budgetAmount,
          spent: spent,
          remaining: remaining,
          percentage: percentage,
          isOverBudget: spent > budgetAmount,
          period: budget.period,
        };
      })
    );

    res.status(200).json(budgetAnalytics);
  } catch (error) {
    console.log("Error getting budget analytics", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

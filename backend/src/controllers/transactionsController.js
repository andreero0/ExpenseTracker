import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const { category, startDate, endDate } = req.query;

    // Build dynamic WHERE clause based on filters
    let conditions = [sql`user_id = ${userId}`];

    if (category) {
      conditions.push(sql`category = ${category}`);
    }

    if (startDate) {
      conditions.push(sql`created_at >= ${startDate}`);
    }

    if (endDate) {
      // Add 1 day to include the entire end date
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      conditions.push(sql`created_at < ${endDateTime.toISOString()}`);
    }

    // Combine conditions with AND
    const whereClause = conditions.reduce((acc, condition, index) => {
      if (index === 0) return condition;
      return sql`${acc} AND ${condition}`;
    });

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE ${whereClause}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transactions", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    // Validate ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // Validate that at least one field is being updated
    if (!title && amount === undefined && !category) {
      return res.status(400).json({ message: "At least one field must be provided for update" });
    }

    // Check if transaction exists
    const existingTransaction = await sql`
      SELECT * FROM transactions WHERE id = ${id}
    `;

    if (existingTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push(`title = $${updates.length + 1}`);
      values.push(title);
    }
    if (amount !== undefined) {
      updates.push(`amount = $${updates.length + 1}`);
      values.push(amount);
    }
    if (category !== undefined) {
      updates.push(`category = $${updates.length + 1}`);
      values.push(category);
    }

    // Use Neon's tagged template for safe query
    const updatedTransaction = await sql`
      UPDATE transactions
      SET
        title = ${title !== undefined ? title : existingTransaction[0].title},
        amount = ${amount !== undefined ? amount : existingTransaction[0].amount},
        category = ${category !== undefined ? category : existingTransaction[0].category}
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json(updatedTransaction[0]);
  } catch (error) {
    console.log("Error updating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

import { sql } from "../config/db.js";

// Helper function to calculate next occurrence based on frequency
function calculateNextOccurrence(currentDate, frequency) {
  const date = new Date(currentDate);

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1); // default to monthly
  }

  return date.toISOString();
}

// Get all recurring transactions for a user
export async function getRecurringTransactions(req, res) {
  const { userId } = req.params;

  try {
    const recurring = await sql`
      SELECT * FROM recurring_transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json(recurring);
  } catch (error) {
    console.error("Error fetching recurring transactions:", error);
    res.status(500).json({ message: "Failed to fetch recurring transactions" });
  }
}

// Create a new recurring transaction
export async function createRecurringTransaction(req, res) {
  const { user_id, title, amount, category, frequency, start_date, end_date } = req.body;

  if (!user_id || !title || !amount || !category || !frequency || !start_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const validFrequencies = ["daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"];
  if (!validFrequencies.includes(frequency)) {
    return res.status(400).json({ message: "Invalid frequency" });
  }

  try {
    const startDate = new Date(start_date);
    const nextOccurrence = calculateNextOccurrence(startDate, frequency);

    const result = await sql`
      INSERT INTO recurring_transactions (
        user_id, title, amount, category, frequency, start_date, end_date, next_occurrence, is_active
      ) VALUES (
        ${user_id}, ${title}, ${amount}, ${category}, ${frequency}, ${startDate.toISOString()},
        ${end_date || null}, ${nextOccurrence}, true
      )
      RETURNING *
    `;

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating recurring transaction:", error);
    res.status(500).json({ message: "Failed to create recurring transaction" });
  }
}

// Update a recurring transaction
export async function updateRecurringTransaction(req, res) {
  const { id } = req.params;
  const { title, amount, category, frequency, start_date, end_date, is_active } = req.body;

  try {
    // Fetch current recurring transaction
    const existing = await sql`
      SELECT * FROM recurring_transactions WHERE id = ${id}
    `;

    if (existing.length === 0) {
      return res.status(404).json({ message: "Recurring transaction not found" });
    }

    // Calculate new next_occurrence if frequency or start_date changed
    let nextOccurrence = existing[0].next_occurrence;
    if (frequency && frequency !== existing[0].frequency) {
      nextOccurrence = calculateNextOccurrence(new Date(), frequency);
    }

    const result = await sql`
      UPDATE recurring_transactions
      SET
        title = ${title || existing[0].title},
        amount = ${amount !== undefined ? amount : existing[0].amount},
        category = ${category || existing[0].category},
        frequency = ${frequency || existing[0].frequency},
        start_date = ${start_date ? new Date(start_date).toISOString() : existing[0].start_date},
        end_date = ${end_date !== undefined ? (end_date ? new Date(end_date).toISOString() : null) : existing[0].end_date},
        is_active = ${is_active !== undefined ? is_active : existing[0].is_active},
        next_occurrence = ${nextOccurrence},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error updating recurring transaction:", error);
    res.status(500).json({ message: "Failed to update recurring transaction" });
  }
}

// Delete a recurring transaction
export async function deleteRecurringTransaction(req, res) {
  const { id } = req.params;

  try {
    await sql`DELETE FROM recurring_transactions WHERE id = ${id}`;
    res.status(200).json({ message: "Recurring transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting recurring transaction:", error);
    res.status(500).json({ message: "Failed to delete recurring transaction" });
  }
}

// Toggle active status
export async function toggleRecurringTransaction(req, res) {
  const { id } = req.params;

  try {
    const result = await sql`
      UPDATE recurring_transactions
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Recurring transaction not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error toggling recurring transaction:", error);
    res.status(500).json({ message: "Failed to toggle recurring transaction" });
  }
}

// Process due recurring transactions (called by cron job)
export async function processRecurringTransactions(req, res) {
  try {
    const now = new Date();

    // Get all active recurring transactions that are due
    const dueTransactions = await sql`
      SELECT * FROM recurring_transactions
      WHERE is_active = true
        AND next_occurrence <= ${now.toISOString()}
        AND (end_date IS NULL OR end_date >= ${now.toISOString()})
    `;

    let processedCount = 0;
    let createdTransactions = [];

    for (const recurring of dueTransactions) {
      // Create the actual transaction
      const transaction = await sql`
        INSERT INTO transactions (user_id, title, amount, category, created_at)
        VALUES (
          ${recurring.user_id},
          ${recurring.title},
          ${recurring.amount},
          ${recurring.category},
          ${now.toISOString()}
        )
        RETURNING *
      `;

      createdTransactions.push(transaction[0]);

      // Calculate next occurrence
      const nextOccurrence = calculateNextOccurrence(now, recurring.frequency);

      // Update recurring transaction
      await sql`
        UPDATE recurring_transactions
        SET
          next_occurrence = ${nextOccurrence},
          last_processed = ${now.toISOString()},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${recurring.id}
      `;

      processedCount++;
    }

    console.log(`Processed ${processedCount} recurring transactions`);
    res.status(200).json({
      message: "Recurring transactions processed successfully",
      processed: processedCount,
      transactions: createdTransactions,
    });
  } catch (error) {
    console.error("Error processing recurring transactions:", error);
    res.status(500).json({ message: "Failed to process recurring transactions" });
  }
}

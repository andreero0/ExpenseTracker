import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    // Create table with improved schema
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title  VARCHAR(255) NOT NULL,
      amount  DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    // Migrate existing tables: Change DATE to TIMESTAMP if needed
    // This will only affect existing databases, new ones already have TIMESTAMP
    await sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'transactions'
          AND column_name = 'created_at'
          AND data_type = 'date'
        ) THEN
          ALTER TABLE transactions
          ALTER COLUMN created_at TYPE TIMESTAMP
          USING created_at::TIMESTAMP;

          ALTER TABLE transactions
          ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `;

    // Create index on user_id for faster queries
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`;

    // Create composite index for user_id + created_at (optimizes sorted queries)
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC)`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}

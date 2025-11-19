import cron from "cron";
import fetch from "node-fetch";

const API_URL = process.env.API_URL || "http://localhost:3000";

export function initCronJobs() {
  // Process recurring transactions every day at midnight
  const recurringTransactionJob = new cron.CronJob(
    "0 0 * * *", // Run at midnight every day
    async function () {
      console.log("Running recurring transactions cron job...");
      try {
        const response = await fetch(`${API_URL}/api/recurring/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        console.log("Recurring transactions processed:", data);
      } catch (error) {
        console.error("Error processing recurring transactions:", error);
      }
    },
    null, // onComplete
    true, // Start job immediately
    "America/New_York" // Timezone
  );

  // Also run every hour for testing/development
  const hourlyJob = new cron.CronJob(
    "0 * * * *", // Run every hour
    async function () {
      console.log("Running hourly recurring transactions check...");
      try {
        const response = await fetch(`${API_URL}/api/recurring/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (data.processed > 0) {
          console.log("Recurring transactions processed:", data);
        }
      } catch (error) {
        console.error("Error in hourly recurring transaction check:", error);
      }
    },
    null,
    true,
    "America/New_York"
  );

  console.log("Cron jobs initialized successfully");
  console.log("- Daily recurring transactions: midnight");
  console.log("- Hourly check: every hour");

  return {
    recurringTransactionJob,
    hourlyJob,
  };
}

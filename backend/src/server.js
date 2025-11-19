import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { validateEnv } from "./utils/validateEnv.js";

import transactionsRoute from "./routes/transactionsRoute.js";
import budgetsRoute from "./routes/budgetsRoute.js";
import statementRoute from "./routes/statementRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";
import recurringRoute from "./routes/recurringRoute.js";
import job from "./config/cron.js";
import { initCronJobs } from "./services/cronService.js";

dotenv.config();
validateEnv();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// middleware
app.use(cors()); // Enable CORS for all origins
app.use(rateLimiter);
app.use(express.json());

// our custom simple middleware
// app.use((req, res, next) => {
//   console.log("Hey we hit a req, the method is", req.method);
//   next();
// });

const PORT = process.env.PORT || 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);
app.use("/api/budgets", budgetsRoute);
app.use("/api/statement", statementRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/recurring", recurringRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);

    // Initialize cron jobs for recurring transactions
    if (process.env.NODE_ENV === "production" || process.env.ENABLE_CRON === "true") {
      initCronJobs();
    }
  });
});

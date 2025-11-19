import express from "express";
import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  toggleRecurringTransaction,
  processRecurringTransactions,
} from "../controllers/recurringController.js";
import { validateUserId } from "../middleware/auth.js";

const router = express.Router();

// Get all recurring transactions for a user
router.get("/:userId", validateUserId, getRecurringTransactions);

// Create a new recurring transaction
router.post("/", validateUserId, createRecurringTransaction);

// Update a recurring transaction
router.put("/:id", updateRecurringTransaction);

// Delete a recurring transaction
router.delete("/:id", deleteRecurringTransaction);

// Toggle active status
router.patch("/:id/toggle", toggleRecurringTransaction);

// Process recurring transactions (internal endpoint for cron)
router.post("/process", processRecurringTransactions);

export default router;

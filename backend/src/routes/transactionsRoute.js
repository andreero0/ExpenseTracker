import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";
import { validateUserId } from "../middleware/auth.js";

const router = express.Router();

// Specific routes must come before generic parameterized routes
router.get("/summary/:userId", validateUserId, getSummaryByUserId);
router.get("/:userId", validateUserId, getTransactionsByUserId);
router.post("/", validateUserId, createTransaction);
router.delete("/:id", deleteTransaction);

export default router;

import express from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetAnalytics,
  getBudgetsByUserId,
  updateBudget,
} from "../controllers/budgetsController.js";
import { validateUserId } from "../middleware/auth.js";

const router = express.Router();

// Specific routes must come before generic parameterized routes
router.get("/analytics/:userId", validateUserId, getBudgetAnalytics);
router.get("/:userId", validateUserId, getBudgetsByUserId);
router.post("/", validateUserId, createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;

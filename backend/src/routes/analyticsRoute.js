import express from "express";
import {
  getCategoryBreakdown,
  getSpendingTrends,
  getAnalyticsStats,
  getDailySpending,
} from "../controllers/analyticsController.js";
import { validateUserId } from "../middleware/auth.js";

const router = express.Router();

// Analytics endpoints
router.get("/categories/:userId", validateUserId, getCategoryBreakdown);
router.get("/trends/:userId", validateUserId, getSpendingTrends);
router.get("/stats/:userId", validateUserId, getAnalyticsStats);
router.get("/daily/:userId", validateUserId, getDailySpending);

export default router;

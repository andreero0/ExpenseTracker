import express from "express";
import { processStatement, batchImportTransactions } from "../controllers/statementController.js";
import { upload } from "../middleware/upload.js";
import { validateUserId } from "../middleware/auth.js";

const router = express.Router();

// Upload and process statement (returns parsed transactions for preview)
router.post("/process", upload.single("statement"), processStatement);

// Batch import reviewed transactions
router.post("/import", validateUserId, batchImportTransactions);

export default router;

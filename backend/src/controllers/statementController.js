import { extractTextFromPDF, cleanStatementText } from "../services/pdfService.js";
import { parseStatementWithLLM, parseStatementFallback } from "../services/llmService.js";
import { sql } from "../config/db.js";

/**
 * Process uploaded bank statement (PDF or image)
 * Extracts transactions and returns them for preview
 */
export async function processStatement(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const file = req.file;
    let extractedText = "";

    // Extract text based on file type
    if (file.mimetype === "application/pdf") {
      console.log("Processing PDF file...");
      const pdfResult = await extractTextFromPDF(file.buffer);
      extractedText = cleanStatementText(pdfResult.text);
    } else if (file.mimetype.startsWith("image/")) {
      // For images, we would use OCR here (Google Vision API or Tesseract)
      // For now, return error asking user to use PDF
      return res.status(400).json({
        message: "Image OCR not yet implemented. Please upload PDF statements for now.",
      });
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    if (!extractedText || extractedText.length < 50) {
      return res.status(400).json({
        message: "Could not extract text from file. Please ensure it's a valid bank statement.",
      });
    }

    console.log(`Extracted ${extractedText.length} characters from statement`);

    // Parse transactions using LLM
    let parseResult;
    try {
      if (process.env.OPENAI_API_KEY) {
        console.log("Parsing with GPT-4-mini...");
        parseResult = await parseStatementWithLLM(extractedText);
      } else {
        console.log("OpenAI API key not found, using fallback parser");
        parseResult = parseStatementFallback(extractedText);
      }
    } catch (llmError) {
      console.error("LLM parsing failed, using fallback:", llmError);
      parseResult = parseStatementFallback(extractedText);
    }

    if (!parseResult.transactions || parseResult.transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions found in statement. Please check the file format.",
      });
    }

    // Check for duplicates against existing transactions
    const existingTransactions = await sql`
      SELECT title, amount, created_at
      FROM transactions
      WHERE user_id = ${userId}
      AND created_at >= ${new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()}
    `;

    // Mark potential duplicates
    const transactionsWithDuplicateFlag = parseResult.transactions.map((t) => {
      const isDuplicate = existingTransactions.some((existing) => {
        const existingDate = new Date(existing.created_at).toISOString().split("T")[0];
        const sameDate = existingDate === t.date;
        const sameAmount = Math.abs(parseFloat(existing.amount) - t.amount) < 0.01;
        const similarTitle =
          existing.title.toLowerCase().includes(t.description.toLowerCase()) ||
          t.description.toLowerCase().includes(existing.title.toLowerCase());

        return sameDate && sameAmount && similarTitle;
      });

      return {
        ...t,
        isDuplicate,
      };
    });

    res.status(200).json({
      success: true,
      transactions: transactionsWithDuplicateFlag,
      count: parseResult.transactions.length,
      duplicates: transactionsWithDuplicateFlag.filter((t) => t.isDuplicate).length,
      isFallback: parseResult.isFallback || false,
    });
  } catch (error) {
    console.error("Error processing statement:", error);
    res.status(500).json({
      message: "Failed to process statement",
      error: error.message,
    });
  }
}

/**
 * Batch import transactions from processed statement
 */
export async function batchImportTransactions(req, res) {
  try {
    const { userId, transactions } = req.body;

    if (!userId || !transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (transactions.length === 0) {
      return res.status(400).json({ message: "No transactions to import" });
    }

    // Validate and prepare transactions
    const validTransactions = transactions.filter((t) => {
      return (
        t.description &&
        t.amount !== undefined &&
        !isNaN(parseFloat(t.amount)) &&
        t.date &&
        t.category
      );
    });

    if (validTransactions.length === 0) {
      return res.status(400).json({ message: "No valid transactions to import" });
    }

    // Insert transactions in batch
    const insertedTransactions = [];
    for (const transaction of validTransactions) {
      try {
        const result = await sql`
          INSERT INTO transactions(user_id, title, amount, category, created_at)
          VALUES (
            ${userId},
            ${transaction.description},
            ${parseFloat(transaction.amount)},
            ${transaction.category},
            ${transaction.date}
          )
          RETURNING *
        `;
        insertedTransactions.push(result[0]);
      } catch (error) {
        console.error(`Failed to insert transaction: ${transaction.description}`, error);
        // Continue with other transactions even if one fails
      }
    }

    res.status(201).json({
      success: true,
      imported: insertedTransactions.length,
      total: validTransactions.length,
      transactions: insertedTransactions,
    });
  } catch (error) {
    console.error("Error batch importing transactions:", error);
    res.status(500).json({
      message: "Failed to import transactions",
      error: error.message,
    });
  }
}

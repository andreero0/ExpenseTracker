import OpenAI from "openai";

// Initialize OpenAI client (will use environment variable OPENAI_API_KEY)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse bank statement text using GPT-4-mini
 * Extracts transactions with date, description, amount, and auto-categorizes
 */
export async function parseStatementWithLLM(statementText) {
  try {
    const prompt = `You are a bank statement parser. Extract ALL transactions from this bank statement text.

For each transaction, extract:
- date (in YYYY-MM-DD format)
- description (merchant/payee name, cleaned up)
- amount (positive for deposits/income, negative for withdrawals/expenses)
- category (auto-categorize into one of: Food & Drinks, Shopping, Transportation, Entertainment, Bills, Income, Other)

Rules:
1. Convert all dates to YYYY-MM-DD format
2. Clean merchant names (remove extra info, locations, reference numbers)
3. Amounts should be negative for expenses, positive for income
4. Be smart about categorization based on merchant names
5. Skip balance lines, fees statements, and non-transaction items
6. Return ONLY valid transactions

Return a JSON array of transactions in this EXACT format:
[
  {
    "date": "2024-01-15",
    "description": "Starbucks Coffee",
    "amount": -5.50,
    "category": "Food & Drinks"
  }
]

Bank Statement Text:
${statementText}

Return ONLY the JSON array, no other text.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast and cost-effective
      messages: [
        {
          role: "system",
          content: "You are a precise financial data extraction system. Return only valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistency
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content.trim();

    // Extract JSON from response (handle cases where LLM adds markdown code blocks)
    let jsonString = content;
    if (content.startsWith("```")) {
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      }
    }

    const transactions = JSON.parse(jsonString);

    // Validate transactions
    const validTransactions = transactions.filter((t) => {
      return (
        t.date &&
        t.description &&
        t.amount !== undefined &&
        t.category &&
        !isNaN(parseFloat(t.amount))
      );
    });

    console.log(`Parsed ${validTransactions.length} valid transactions from statement`);

    return {
      success: true,
      transactions: validTransactions,
      count: validTransactions.length,
    };
  } catch (error) {
    console.error("LLM parsing error:", error);
    throw new Error(`Failed to parse statement: ${error.message}`);
  }
}

/**
 * Fallback: Simple rule-based parser for common bank statement formats
 * Used when LLM is not available or fails
 */
export function parseStatementFallback(statementText) {
  // This is a simple fallback - you can enhance this with regex patterns
  // for specific bank formats (Chase, BoA, Wells Fargo, etc.)
  const lines = statementText.split("\n");
  const transactions = [];

  // Simple pattern: date amount description
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
  const amountPattern = /\$?-?\d+\.\d{2}/;

  for (const line of lines) {
    const dateMatch = line.match(datePattern);
    const amountMatch = line.match(amountPattern);

    if (dateMatch && amountMatch) {
      const date = parseDateString(dateMatch[0]);
      const amount = parseFloat(amountMatch[0].replace("$", ""));
      const description = line
        .replace(dateMatch[0], "")
        .replace(amountMatch[0], "")
        .trim();

      if (description.length > 3) {
        transactions.push({
          date: date,
          description: description,
          amount: amount,
          category: "Other", // Default category
        });
      }
    }
  }

  return {
    success: true,
    transactions: transactions,
    count: transactions.length,
    isFallback: true,
  };
}

function parseDateString(dateStr) {
  // Convert MM/DD/YYYY or MM/DD/YY to YYYY-MM-DD
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    let year = parts[2];
    if (year.length === 2) {
      year = "20" + year; // Assume 2000s
    }
    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split("T")[0]; // Fallback to today
}

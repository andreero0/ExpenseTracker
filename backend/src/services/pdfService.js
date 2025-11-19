import pdfParse from "pdf-parse";

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return {
      success: true,
      text: data.text,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Clean and normalize extracted text
 */
export function cleanStatementText(rawText) {
  // Remove excessive whitespace
  let cleaned = rawText.replace(/\s+/g, " ");

  // Remove common PDF artifacts
  cleaned = cleaned.replace(/[^\x00-\x7F]/g, ""); // Remove non-ASCII characters

  // Normalize line breaks
  cleaned = cleaned.replace(/\r\n/g, "\n");

  // Remove page headers/footers (common patterns)
  cleaned = cleaned.replace(/Page \d+ of \d+/gi, "");
  cleaned = cleaned.replace(/Statement Period:.*?\n/gi, "");

  return cleaned.trim();
}

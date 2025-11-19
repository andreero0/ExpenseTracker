# 📊 Bank Statement Import Feature - Setup Guide

## Overview

The Bank Statement Import feature allows users to upload PDF bank statements and automatically extract all transactions using AI. The system can parse statements from all major banks and automatically categorize transactions.

## Features

✅ **PDF Upload**: Upload bank statements in PDF format
✅ **AI-Powered Extraction**: Uses GPT-4-mini to parse transactions
✅ **Auto-Categorization**: Automatically assigns categories based on merchant names
✅ **Duplicate Detection**: Identifies potential duplicate transactions
✅ **Batch Import**: Import multiple transactions at once
✅ **Preview & Edit**: Review and modify transactions before importing
✅ **Fallback Parser**: Works without AI (basic parsing) if OpenAI key not configured

## Installation

### Backend Dependencies

Install the required npm packages:

```bash
cd backend
npm install multer pdf-parse openai
```

**Packages:**
- `multer@^1.4.5-lts.1` - File upload middleware
- `pdf-parse@^1.1.1` - PDF text extraction
- `openai@^4.0.0` - OpenAI GPT-4-mini integration

### Mobile Dependencies

Install Expo document picker:

```bash
cd mobile
npx expo install expo-document-picker
```

## Configuration

### 1. Environment Variables

Add to `backend/.env`:

```env
# Optional - For AI-powered statement parsing
# Without this, basic fallback parser will be used
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Get OpenAI API Key (Optional but Recommended)

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file
4. Add billing method (pay-as-you-go)

**Cost**: ~$0.01-0.05 per statement (GPT-4-mini is very cost-effective)

### 3. Without OpenAI API Key

The feature will still work using a basic fallback parser that uses regex patterns. However, AI parsing provides:
- Better accuracy
- Automatic categorization
- Support for more bank formats
- Cleaner merchant names

## Usage

### From Mobile App

1. **Navigate to Import**: Tap the cloud upload icon in the home screen header
2. **Upload Statement**: Choose a PDF bank statement from your device
3. **Review Transactions**: AI extracts and categorizes all transactions
4. **Edit if Needed**: Modify categories or amounts before importing
5. **Import**: Select transactions to import (duplicates are flagged)

### Supported Banks

Works with statements from:
- Chase
- Bank of America
- Wells Fargo
- Citibank
- Capital One
- And most other major banks

## API Endpoints

### POST `/api/statement/process`

Upload and process a bank statement.

**Request**: `multipart/form-data`
- `statement`: PDF file (max 10MB)
- `userId`: User ID

**Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "Starbucks Coffee",
      "amount": -5.50,
      "category": "Food & Drinks",
      "isDuplicate": false
    }
  ],
  "count": 25,
  "duplicates": 2,
  "isFallback": false
}
```

### POST `/api/statement/import`

Batch import reviewed transactions.

**Request**:
```json
{
  "userId": "user_123",
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "Starbucks",
      "amount": -5.50,
      "category": "Food & Drinks"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "imported": 25,
  "total": 25
}
```

## Architecture

### Backend Flow

1. **Upload** → `upload.js` middleware (multer)
2. **Extract Text** → `pdfService.js` (pdf-parse)
3. **Parse Transactions** → `llmService.js` (GPT-4-mini or fallback)
4. **Detect Duplicates** → Compare with existing transactions
5. **Return for Review** → Send to mobile app
6. **Batch Import** → Insert reviewed transactions

### Mobile Flow

1. **Document Picker** → Select PDF file
2. **Upload** → Send to backend with FormData
3. **Display Preview** → Show extracted transactions
4. **User Review** → Edit categories, deselect duplicates
5. **Batch Import** → Send selected transactions
6. **Refresh** → Update transaction list

## Cost Estimation

**With OpenAI (Recommended)**:
- GPT-4-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
- Average statement: ~2,000 input tokens, ~500 output tokens
- **Cost per statement**: ~$0.01 - $0.05

**Without OpenAI**:
- Free (uses basic regex parser)
- Lower accuracy

## Troubleshooting

### "No transactions found"
- Ensure PDF is a bank statement (not a scanned image)
- Try a different statement format
- Check that PDF text is selectable (not image-only)

### "Image OCR not yet implemented"
- Currently only PDF files are supported
- Convert images to PDF using online tools

### "Failed to process statement"
- Check backend logs for errors
- Verify OpenAI API key is valid
- Ensure file is under 10MB

### Low parsing accuracy (fallback mode)
- Add OpenAI API key for AI-powered parsing
- Fallback parser works best with standard formats

## Future Enhancements

Planned improvements:
- [ ] Image OCR support (Google Vision API)
- [ ] CSV statement import
- [ ] QFX/OFX file support
- [ ] Multiple file upload
- [ ] Scheduled auto-import
- [ ] Bank connection integration (Plaid)

## Security Notes

- Files are processed in memory (not saved to disk)
- OpenAI API calls are made server-side only
- Bank statements are never stored permanently
- User authentication required for all operations

## Files Modified

**Backend**:
- `src/middleware/upload.js` - NEW
- `src/services/llmService.js` - NEW
- `src/services/pdfService.js` - NEW
- `src/controllers/statementController.js` - NEW
- `src/routes/statementRoute.js` - NEW
- `src/server.js` - Updated
- `src/utils/validateEnv.js` - Updated
- `.env.example` - Updated

**Mobile**:
- `app/(root)/import.jsx` - NEW
- `app/(root)/index.jsx` - Updated (added import button)
- `assets/styles/import.styles.js` - NEW
- `assets/styles/home.styles.js` - Updated

## Support

For issues or questions:
1. Check backend logs for error details
2. Verify all dependencies are installed
3. Test with sample bank statement PDF
4. Check OpenAI API key and billing status

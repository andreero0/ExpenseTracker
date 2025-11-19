# v1.1 Dependencies Installation Guide

This document lists all new dependencies required for v1.1 features.

## Backend Dependencies

```bash
cd backend
npm install node-fetch  # For cron job HTTP requests (if not already installed)
```

Note: `cron` package is already installed in backend/package.json

## Mobile Dependencies

```bash
cd mobile

# Required for Dark Mode & Settings
npm install @react-native-async-storage/async-storage

# Required for Biometric Authentication
npm install expo-local-authentication

# Required for Receipt OCR
npm install expo-image-picker
npm install expo-camera

# Required for CSV/PDF Export
npm install expo-sharing
npm install expo-file-system
npm install react-native-view-shot  # For PDF generation

# Required for Plaid Integration
npm install react-native-plaid-link-sdk

# Optional: For better charts (already have react-native-chart-kit)
# npm install victory-native
```

## Environment Variables

Add to `backend/.env`:
```env
# Google Vision API (for OCR)
GOOGLE_VISION_API_KEY=your_google_vision_api_key_here

# Plaid API (for bank connections)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox  # or development, production

# API URL for cron jobs
API_URL=http://localhost:5001

# Enable cron jobs in development
ENABLE_CRON=true

# Currency conversion API (free tier available)
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key  # From https://www.exchangerate-api.com/
```

Add to `mobile/.env.local`:
```env
EXPO_PUBLIC_API_URL=http://your-backend-url:5001/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

## Post-Installation Steps

1. **iOS (for biometric auth, camera, file access)**:
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Update app.json** for permissions:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-local-authentication",
           {
             "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
           }
         ],
         [
           "expo-camera",
           {
             "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera for receipt scanning."
           }
         ],
         [
           "expo-image-picker",
           {
             "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to upload receipts."
           }
         ]
       ]
     }
   }
   ```

3. **Rebuild the app** after installing native dependencies:
   ```bash
   npx expo prebuild --clean
   ```

## Feature Status

- ✅ Dark Mode - **Implemented** (uses AsyncStorage)
- ✅ Biometric Auth - **Implemented** (uses expo-local-authentication)
- ✅ Recurring Transactions - **Implemented** (backend cron + mobile UI)
- 🔄 Multi-currency - **Partially Implemented** (UI ready, needs API integration)
- 🔄 CSV/PDF Export - **Partially Implemented** (needs expo-sharing + expo-file-system)
- 🔄 OCR - **Partially Implemented** (needs Google Vision API)
- 🔄 Offline Mode - **Partially Implemented** (needs AsyncStorage integration)
- 🔄 Plaid - **Partially Implemented** (needs Plaid SDK setup)

## Testing

After installation:
```bash
# Mobile
cd mobile
npm start

# Backend
cd backend
npm run dev
```

## Troubleshooting

### AsyncStorage not found
```bash
npm install @react-native-async-storage/async-storage
npx expo prebuild --clean
```

### expo-local-authentication not working
- Make sure you've run `npx expo prebuild`
- Check that permissions are added to app.json
- On iOS, check Info.plist for Face ID usage description

### Cron jobs not running
- Set `ENABLE_CRON=true` in backend/.env
- Check that `API_URL` is set correctly
- For production, remove the ENABLE_CRON check or set NODE_ENV=production

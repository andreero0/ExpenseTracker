# 💰 ExpenseTracker

**AI-Powered Personal Finance Management**

A modern, feature-rich expense tracking application with artificial intelligence, beautiful analytics, and smart automation.

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-black.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![Demo App](/mobile/assets/images/screenshot-for-readme.png)

---

## ✨ Features

### 🤖 AI-Powered
- **Smart Statement Import**: Upload bank PDFs → AI extracts all transactions automatically
- **Auto-Categorization**: Intelligent categorization using GPT-4-mini
- **Duplicate Detection**: Prevents double-entry with smart matching
- **Cost**: ~$0.01-0.05 per statement

### 📊 Beautiful Analytics
- **Interactive Charts**: Pie charts, line graphs, trend analysis
- **Real-time Insights**: Category breakdowns, spending patterns
- **Comparisons**: Month-over-month analysis
- **6-Month Trends**: Visualize spending over time

### 💵 Smart Budgeting
- **Category Budgets**: Set limits per spending category
- **Progress Tracking**: Visual progress bars
- **Over-Budget Alerts**: Red indicators when exceeding limits
- **Monthly Periods**: Auto-reset each month

### 🔍 Advanced Filtering
- **Category Filters**: View specific spending categories
- **Date Ranges**: Today, Week, Month, 30 Days, All Time
- **Custom Periods**: Flexible date selection
- **Active Indicators**: See when filters are applied

### ✏️ Full Transaction Management
- **CRUD Operations**: Create, Read, Update, Delete
- **Edit Anytime**: Modify past transactions
- **Rich Details**: Amount, description, category, date
- **Instant Sync**: Real-time updates across features

### 🔐 Secure Authentication
- **Email Verification**: 6-digit code verification
- **Clerk Integration**: Enterprise-grade auth
- **Protected Routes**: Secure API endpoints
- **Rate Limiting**: DDoS protection with Redis
- **Biometric Auth**: Face ID / Touch ID support (v1.1)

### 🎨 Customization (v1.1)
- **Dark Mode**: Beautiful dark variants for all 4 themes
- **Multi-Currency**: Support for 12 major global currencies
- **Theme Persistence**: Your preferences saved automatically
- **Adaptive UI**: Status bar and colors adjust to theme

### 🔄 Automation (v1.1)
- **Recurring Transactions**: Auto-create regular expenses/income
- **Flexible Schedules**: Daily, weekly, bi-weekly, monthly, quarterly, yearly
- **Smart Processing**: Cron jobs handle scheduling automatically
- **Pause/Resume**: Full control over recurring items

### 📴 Offline Support (v1.1)
- **Work Offline**: Create transactions without internet
- **Auto-Sync**: Automatic sync when connection restored
- **Local Storage**: Secure on-device data persistence
- **Sync Management**: Manual sync trigger and pending counter

### 📤 Data Export (v1.1)
- **CSV Export**: Download all transactions
- **Share Anywhere**: Native share sheet integration
- **Formatted Data**: Ready for Excel, Google Sheets
- **PDF Coming Soon**: Formatted reports

### 📸 Smart Capture (v1.1)
- **Receipt Scanning**: OCR-ready with Google Vision integration
- **Camera & Gallery**: Take photos or select existing
- **Auto-Fill**: Extracted data pre-fills transaction form
- **Setup Guide Included**: Complete integration documentation

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+
node --version

# npm
npm --version

# Git
git --version
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ExpenseTracker.git
cd ExpenseTracker

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### Configuration

#### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@host/database

# Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# OpenAI (Optional - for AI features)
OPENAI_API_KEY=sk-your-key-here

# Server
PORT=5001
NODE_ENV=development
```

See [.env.example](backend/.env.example) for complete configuration options.

#### Mobile (update constants/api.js)

```javascript
export const API_URL = "http://localhost:5001/api";
// or production: "https://your-api.onrender.com/api"
```

### Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Mobile
cd mobile
npx expo start
```

Scan QR code with Expo Go app on your phone!

---

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **Cache/Rate Limiting**: Redis (Upstash)
- **AI**: OpenAI GPT-4-mini
- **PDF Processing**: pdf-parse
- **File Upload**: multer
- **Authentication**: Clerk

### Mobile
- **Framework**: React Native
- **Platform**: Expo SDK 54
- **Router**: Expo Router (file-based)
- **Charts**: react-native-chart-kit
- **Auth**: @clerk/clerk-expo
- **Language**: JavaScript/JSX

---

## 📂 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Cron
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, Upload, Rate limiting
│   │   ├── routes/          # API routes
│   │   ├── services/        # LLM, PDF processing
│   │   └── server.js        # Entry point
│   └── package.json
│
├── mobile/
│   ├── app/
│   │   ├── (auth)/         # Sign in/up screens
│   │   ├── (root)/         # Protected screens
│   │   └── _layout.jsx     # Root layout
│   ├── assets/
│   ├── components/         # Reusable components
│   ├── constants/          # API URLs, colors, themes
│   └── package.json
│
├── DEPLOYMENT.md           # Deployment guide
├── USER_GUIDE.md           # User documentation
├── STATEMENT_IMPORT_SETUP.md # Statement import setup
└── README.md               # This file
```

---

## 🔌 API Endpoints

### Transactions
```
GET    /api/transactions/:userId          # Get all transactions
GET    /api/transactions/summary/:userId  # Get balance summary
POST   /api/transactions                  # Create transaction
PUT    /api/transactions/:id              # Update transaction
DELETE /api/transactions/:id              # Delete transaction
```

### Budgets
```
GET    /api/budgets/:userId               # Get all budgets
GET    /api/budgets/analytics/:userId     # Get budget analytics
POST   /api/budgets                       # Create/update budget
PUT    /api/budgets/:id                   # Update budget
DELETE /api/budgets/:id                   # Delete budget
```

### Analytics
```
GET    /api/analytics/categories/:userId  # Category breakdown
GET    /api/analytics/trends/:userId      # Spending trends
GET    /api/analytics/stats/:userId       # Statistics
GET    /api/analytics/daily/:userId       # Daily spending
```

### Statement Import
```
POST   /api/statement/process             # Process PDF statement
POST   /api/statement/import              # Batch import transactions
```

### Recurring Transactions (v1.1)
```
GET    /api/recurring/:userId             # Get all recurring transactions
POST   /api/recurring                     # Create recurring transaction
PUT    /api/recurring/:id                 # Update recurring transaction
DELETE /api/recurring/:id                 # Delete recurring transaction
PATCH  /api/recurring/:id/toggle          # Toggle active status
POST   /api/recurring/process             # Process due transactions (cron)
```

---

## 📚 Documentation

- **[User Guide](USER_GUIDE.md)** - Complete user documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment steps
- **[Statement Import Setup](STATEMENT_IMPORT_SETUP.md)** - AI import configuration
- **[v1.1 Release Notes](V1.1_RELEASE_NOTES.md)** - What's new in v1.1
- **[Installation Guide](INSTALL_DEPENDENCIES.md)** - v1.1 dependencies setup
- **[Plaid Integration](PLAID_INTEGRATION.md)** - Bank connections guide

---

## 🛣️ Roadmap

### ✅ Completed (v1.0)
- [x] User authentication with Clerk
- [x] Transaction CRUD operations
- [x] Category and date filtering
- [x] Budget management with analytics
- [x] Analytics dashboard with charts
- [x] AI-powered statement import
- [x] Duplicate detection

### ✅ Completed (v1.1) - **NEW!**
- [x] 🌙 **Dark Mode** - 4 beautiful dark theme variants
- [x] 🔐 **Biometric Authentication** - Face ID / Touch ID support
- [x] 🔄 **Recurring Transactions** - Automated regular expenses
- [x] 💱 **Multi-Currency Support** - 12 major currencies
- [x] 📊 **CSV/PDF Export** - Export transaction history
- [x] 📸 **OCR Receipt Scanning** - Google Vision integration ready
- [x] 📴 **Offline Mode** - Work without internet connection
- [x] 🏦 **Plaid Integration Guide** - Bank connections documentation

**See [V1.1_RELEASE_NOTES.md](V1.1_RELEASE_NOTES.md) for details**

### 📅 Planned (v1.2)
- [ ] Shared budgets (family accounts)
- [ ] Push notifications for alerts
- [ ] Savings goals tracking
- [ ] Bill payment reminders
- [ ] Tax category tagging
- [ ] Investment portfolio tracking
- [ ] Custom categories
- [ ] Receipt attachment storage
- [ ] Advanced AI insights

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Clerk](https://clerk.com) for authentication
- [Neon](https://neon.tech) for PostgreSQL hosting
- [Upstash](https://upstash.com) for Redis
- [OpenAI](https://openai.com) for GPT-4-mini
- [Expo](https://expo.dev) for React Native platform
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) for charts

---

## ⭐ Star This Repo!

If you find this project helpful, please give it a star! It helps others discover it too.

---

<p align="center">Made with ❤️ and ☕</p>
<p align="center">© 2025 ExpenseTracker. All rights reserved.</p>

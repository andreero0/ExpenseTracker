# 🚀 ExpenseTracker Deployment Guide

Complete guide for deploying your ExpenseTracker application to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Cost Estimates](#cost-estimates)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

### Required Accounts

1. **Neon Database** (PostgreSQL)
   - Sign up: https://neon.tech
   - Free tier: 10GB storage, 0.5 GB RAM

2. **Upstash Redis** (Rate Limiting)
   - Sign up: https://upstash.com
   - Free tier: 10K requests/day

3. **Clerk** (Authentication)
   - Sign up: https://clerk.com
   - Free tier: 10K monthly active users

4. **OpenAI** (Optional - AI Features)
   - Sign up: https://platform.openai.com
   - Pay-as-you-go: ~$0.01-$0.05 per statement

5. **Render/Railway/Fly.io** (Backend Hosting)
   - Or any Node.js hosting platform

6. **Expo** (Mobile App Distribution)
   - Sign up: https://expo.dev
   - Free tier available

### Required Tools

```bash
# Node.js (LTS version)
node --version  # v18+ recommended

# npm
npm --version   # v9+

# Git
git --version   # v2.30+

# Expo CLI
npm install -g expo-cli
```

---

## 🖥️ Backend Deployment

### Step 1: Prepare Database (Neon)

1. **Create Neon Account**
   ```
   Visit: https://neon.tech
   Sign up with GitHub/Email
   ```

2. **Create New Project**
   ```
   Project Name: ExpenseTracker
   Region: Choose closest to your users
   Postgres Version: 15+
   ```

3. **Get Connection String**
   ```
   Dashboard → Connection Details → Connection String
   Copy: postgresql://user:password@host/database
   ```

### Step 2: Setup Redis (Upstash)

1. **Create Upstash Account**
   ```
   Visit: https://upstash.com
   Sign up
   ```

2. **Create Database**
   ```
   Type: Redis
   Name: expensetracker-ratelimit
   Region: Choose closest to backend
   ```

3. **Get Credentials**
   ```
   UPSTASH_REDIS_REST_URL
   UPSTASH_REDIS_REST_TOKEN
   ```

### Step 3: Deploy to Render (Recommended)

#### Option A: Deploy via Dashboard

1. **Create Render Account**
   ```
   Visit: https://render.com
   Sign up with GitHub
   ```

2. **New Web Service**
   ```
   Dashboard → New → Web Service
   Connect GitHub repository
   Root Directory: backend
   ```

3. **Configure Service**
   ```yaml
   Name: expensetracker-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free (or Starter $7/mo)
   ```

4. **Add Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=postgresql://... (from Neon)
   UPSTASH_REDIS_REST_URL=https://... (from Upstash)
   UPSTASH_REDIS_REST_TOKEN=... (from Upstash)
   OPENAI_API_KEY=sk-... (optional)
   ```

5. **Deploy**
   ```
   Click "Create Web Service"
   Wait for deployment (~2-3 minutes)
   Note your API URL: https://expensetracker-api.onrender.com
   ```

#### Option B: Deploy via CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Navigate to backend
cd backend

# Create render.yaml
cat > render.yaml << EOF
services:
  - type: web
    name: expensetracker-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: UPSTASH_REDIS_REST_URL
        sync: false
      - key: UPSTASH_REDIS_REST_TOKEN
        sync: false
      - key: OPENAI_API_KEY
        sync: false
EOF

# Deploy
render deploy
```

### Step 4: Alternative Hosting Options

#### Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Add environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=postgresql://...

# Deploy
railway up
```

#### Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Initialize
cd backend
fly launch
  # Name: expensetracker-api
  # Region: Choose closest
  # PostgreSQL: No (using Neon)
  # Redis: No (using Upstash)

# Set secrets
fly secrets set NODE_ENV=production
fly secrets set DATABASE_URL=postgresql://...
fly secrets set UPSTASH_REDIS_REST_URL=https://...
fly secrets set UPSTASH_REDIS_REST_TOKEN=...
fly secrets set OPENAI_API_KEY=sk-...

# Deploy
fly deploy
```

### Step 5: Verify Backend Deployment

```bash
# Test health endpoint
curl https://your-api-url.com/api/health

# Expected response:
{"status":"ok"}

# Test with authentication
# Use your mobile app to create account and transaction
```

---

## 📱 Mobile App Deployment

### Step 1: Configure API URL

```bash
cd mobile

# Update API URL in constants/api.js
# Change from localhost to your production API
```

```javascript
// constants/api.js
export const API_URL = "https://expensetracker-api.onrender.com/api";
```

### Step 2: Configure Clerk Authentication

1. **Clerk Dashboard**
   ```
   Visit: https://dashboard.clerk.com
   Create Application
   Name: ExpenseTracker
   ```

2. **Get API Keys**
   ```
   Dashboard → API Keys
   Copy:
   - Publishable Key
   - Secret Key (for backend, optional)
   ```

3. **Update app.json**
   ```json
   {
     "expo": {
       "extra": {
         "clerkPublishableKey": "pk_test_..."
       }
     }
   }
   ```

### Step 3: Build for Production

#### iOS (TestFlight / App Store)

```bash
# Install dependencies
cd mobile
npm install

# Configure EAS Build
npm install -g eas-cli
eas login
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store (after build completes)
eas submit --platform ios
```

**Requirements**:
- Apple Developer Account ($99/year)
- App Store Connect setup
- App icons and screenshots

#### Android (Play Store)

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Play Store (after build completes)
eas submit --platform android
```

**Requirements**:
- Google Play Developer Account ($25 one-time)
- Play Console setup
- App icons and screenshots

### Step 4: OTA Updates (Expo)

For quick updates without app store review:

```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# Users get update automatically!
```

---

## ⚙️ Environment Configuration

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5001

# Database
DATABASE_URL=postgresql://user:pass@host.neon.tech/database?sslmode=require

# Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# OpenAI (Optional)
OPENAI_API_KEY=sk-your-key

# CORS (Optional - if needed)
ALLOWED_ORIGINS=https://yourdomain.com

# Clerk (Optional - for backend JWT verification)
CLERK_SECRET_KEY=sk_test_...
```

### Mobile (app.json)

```json
{
  "expo": {
    "name": "ExpenseTracker",
    "slug": "expensetracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.expensetracker"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcompany.expensetracker"
    },
    "extra": {
      "clerkPublishableKey": "pk_live_...",
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

---

## 💾 Database Setup

### Initial Migration

The app will automatically create tables on first run. To verify:

```bash
# Connect to Neon database
psql postgresql://user:pass@host.neon.tech/database

# Check tables
\dt

# Expected tables:
# - transactions
# - budgets

# Check indexes
\di

# Expected indexes:
# - idx_transactions_user_id
# - idx_transactions_user_created
# - idx_budgets_user_id

# Exit
\q
```

### Manual Migration (if needed)

```sql
-- Transactions table
CREATE TABLE IF NOT EXISTS transactions(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at DESC);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  period VARCHAR(50) NOT NULL DEFAULT 'monthly',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, period)
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Set up monitoring
# Option 1: UptimeRobot (free)
Visit: https://uptimerobot.com
Add Monitor: https://your-api.com/api/health
Interval: 5 minutes

# Option 2: Better Uptime
Visit: https://betteruptime.com
Add Monitor with same settings
```

### Logging

**Render** (built-in):
```bash
# View logs
render logs -s expensetracker-api

# Tail logs
render logs -s expensetracker-api --tail
```

**Railway** (built-in):
```bash
# View logs
railway logs
```

### Performance Monitoring

Consider adding:
- **Sentry** (Error tracking)
- **LogRocket** (Session replay)
- **DataDog** (Full monitoring suite)

### Database Backups

Neon provides automatic backups:
- Point-in-time recovery (7 days)
- Branch/snapshot support

**Manual backup**:
```bash
pg_dump postgresql://user:pass@host/db > backup.sql
```

---

## 💰 Cost Estimates

### Free Tier (Getting Started)

```
Backend (Render Free):        $0/month
Database (Neon Free):         $0/month
Redis (Upstash Free):         $0/month
Auth (Clerk Free):            $0/month
Mobile (Expo):                $0/month
OpenAI (50 statements/month): ~$2.50/month
--------------------------------
TOTAL:                        ~$2.50/month
```

### Production (Paid Tier)

```
Backend (Render Starter):     $7/month
Database (Neon Pro):          $19/month
Redis (Upstash Pro):          $10/month
Auth (Clerk Pro):             $25/month (or free if <10K users)
Mobile (Expo):                $0/month
OpenAI (500 statements/month): ~$25/month
--------------------------------
TOTAL:                        ~$86/month
```

### Enterprise (High Traffic)

```
Backend (Render Standard):    $25/month
Database (Neon Scale):        $69/month
Redis (Upstash Scale):        $30/month
Auth (Clerk Business):        $99/month
Mobile (Expo):                $0/month
OpenAI (2000 statements):     ~$100/month
--------------------------------
TOTAL:                        ~$323/month
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Verify SSL mode
# Neon requires: ?sslmode=require
```

**Error: Redis connection failed**
```bash
# Check credentials
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# Test with curl
curl -X POST $UPSTASH_REDIS_REST_URL/ping \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

**Error: OpenAI API error**
```bash
# Verify API key
echo $OPENAI_API_KEY | head -c 10

# Check billing
Visit: https://platform.openai.com/account/billing

# Test API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Mobile Issues

**Error: Network request failed**
```javascript
// Check API URL
console.log(API_URL)

// Ensure HTTPS (not HTTP)
// iOS blocks HTTP in production

// Test API from browser
fetch('https://your-api.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

**Error: Clerk authentication failed**
```javascript
// Verify publishable key
console.log(clerkPublishableKey)

// Check environment
// Use pk_live_... for production
// Use pk_test_... for development
```

### Database Issues

**Slow queries**
```sql
-- Check for missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';

-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM transactions WHERE user_id = 'user_123';
```

**Connection limit reached**
```
Error: too many connections

Solution:
1. Upgrade Neon plan
2. Implement connection pooling
3. Close connections properly
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: |
          curl -X POST https://api.render.com/deploy/...

  deploy-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Setup Expo
        uses: expo/expo-github-action@v8
      - name: Publish update
        run: |
          cd mobile
          eas update --branch production --non-interactive
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database migrations completed
- [ ] Redis connected and working
- [ ] Health check endpoint returns 200
- [ ] Environment variables configured
- [ ] Clerk authentication working
- [ ] Mobile app connected to production API
- [ ] Test user can sign up
- [ ] Test transaction creation
- [ ] Test statement import (with sample PDF)
- [ ] Test analytics charts
- [ ] Test budget creation
- [ ] Set up monitoring/alerts
- [ ] Configure backups
- [ ] Document API URL for team
- [ ] Update app store listings (if applicable)

---

## 🎉 You're Live!

Your ExpenseTracker app is now deployed and ready for users!

**Next Steps**:
1. Test thoroughly in production
2. Monitor error rates
3. Collect user feedback
4. Iterate and improve

**Support**:
- Backend Logs: Check Render/Railway dashboard
- Mobile Logs: Check Expo dashboard
- Database: Check Neon dashboard
- Errors: Check Sentry (if configured)

---

*Last Updated: January 2025*
*Deployment Guide Version: 1.0.0*

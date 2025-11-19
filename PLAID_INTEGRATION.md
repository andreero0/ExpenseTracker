# Plaid Bank Connections Integration Guide

This guide explains how to integrate Plaid for automatic bank transaction sync.

## Overview

Plaid enables users to securely connect their bank accounts and automatically import transactions.

## Setup Steps

### 1. Create a Plaid Account

1. Sign up at [https://plaid.com/](https://plaid.com/)
2. Create a new application
3. Get your credentials:
   - Client ID
   - Secret (Sandbox/Development/Production)
4. Set up redirect URIs for your mobile app

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install plaid
```

#### Environment Variables

Add to `backend/.env`:
```env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_secret_here
PLAID_ENV=sandbox  # or development, production
```

#### Create Plaid Controller

Create `backend/src/controllers/plaidController.js`:

```javascript
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export async function createLinkToken(req, res) {
  const { userId } = req.body;

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: "ExpenseTracker",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
    res.status(500).json({ error: "Failed to create link token" });
  }
}

export async function exchangePublicToken(req, res) {
  const { public_token, userId } = req.body;

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;

    // Store access_token in database associated with userId
    await sql`
      INSERT INTO bank_connections (user_id, access_token, item_id)
      VALUES (${userId}, ${accessToken}, ${response.data.item_id})
    `;

    res.json({ success: true });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    res.status(500).json({ error: "Failed to exchange public token" });
  }
}

export async function syncTransactions(req, res) {
  const { userId } = req.params;

  try {
    // Get user's access tokens
    const connections = await sql`
      SELECT * FROM bank_connections WHERE user_id = ${userId}
    `;

    let allTransactions = [];

    for (const connection of connections) {
      const response = await plaidClient.transactionsSync({
        access_token: connection.access_token,
      });

      const transactions = response.data.added;

      // Insert transactions into database
      for (const txn of transactions) {
        await sql`
          INSERT INTO transactions (user_id, title, amount, category, created_at, plaid_id)
          VALUES (
            ${userId},
            ${txn.name},
            ${-txn.amount},  // Plaid uses negative for expenses
            ${txn.category ? txn.category[0] : "Other"},
            ${txn.date},
            ${txn.transaction_id}
          )
          ON CONFLICT (plaid_id) DO NOTHING
        `;
      }

      allTransactions.push(...transactions);
    }

    res.json({
      synced: allTransactions.length,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("Error syncing transactions:", error);
    res.status(500).json({ error: "Failed to sync transactions" });
  }
}
```

#### Create Routes

Create `backend/src/routes/plaidRoute.js`:

```javascript
import express from "express";
import {
  createLinkToken,
  exchangePublicToken,
  syncTransactions,
} from "../controllers/plaidController.js";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.get("/sync/:userId", syncTransactions);

export default router;
```

#### Update server.js

```javascript
import plaidRoute from "./routes/plaidRoute.js";

app.use("/api/plaid", plaidRoute);
```

#### Update Database Schema

Add to `backend/src/config/db.js`:

```javascript
await sql`CREATE TABLE IF NOT EXISTS bank_connections(
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  institution_name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)`;

// Add plaid_id to transactions table
await sql`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'transactions'
      AND column_name = 'plaid_id'
    ) THEN
      ALTER TABLE transactions ADD COLUMN plaid_id VARCHAR(255) UNIQUE;
    END IF;
  END $$;
`;
```

### 3. Mobile Setup

#### Install Dependencies

```bash
cd mobile
npm install react-native-plaid-link-sdk
```

#### iOS Configuration

For iOS, add to `ios/Podfile`:
```ruby
pod 'Plaid', '~> 4.1'
```

Run:
```bash
cd ios
pod install
cd ..
```

#### Create Plaid Screen

Create `mobile/app/(root)/bank-connections.jsx`:

```javascript
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { PlaidLink } from "react-native-plaid-link-sdk";
import { useUser } from "@clerk/clerk-expo";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BankConnectionsScreen() {
  const { user } = useUser();
  const [linkToken, setLinkToken] = useState(null);

  const createLinkToken = async () => {
    const response = await fetch(`${API_URL}/plaid/create-link-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  };

  const onSuccess = async (publicToken) => {
    await fetch(`${API_URL}/plaid/exchange-public-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_token: publicToken,
        userId: user.id,
      }),
    });

    Alert.alert("Success", "Bank account connected successfully!");
  };

  return (
    <View>
      <TouchableOpacity onPress={createLinkToken}>
        <Text>Connect Bank Account</Text>
      </TouchableOpacity>

      {linkToken && (
        <PlaidLink
          token={linkToken}
          onSuccess={({ publicToken }) => onSuccess(publicToken)}
          onExit={() => setLinkToken(null)}
        >
          {/* Trigger Plaid Link */}
        </PlaidLink>
      )}
    </View>
  );
}
```

### 4. Testing

#### Sandbox Test Credentials

In Plaid Sandbox mode, use these test credentials:
- **Institution**: Any US bank
- **Username**: `user_good`
- **Password**: `pass_good`
- **MFA**: `1234` (if prompted)

#### Test Flow

1. Click "Connect Bank Account"
2. Select a test institution
3. Enter test credentials
4. Complete MFA if prompted
5. Approve account access
6. Transactions will sync automatically

### 5. Production Checklist

Before going to production:

- [ ] Move from Sandbox to Development environment
- [ ] Complete Plaid's compliance questionnaire
- [ ] Request Production access
- [ ] Update `PLAID_ENV` to `production`
- [ ] Implement webhook handlers for account updates
- [ ] Add error handling for expired access tokens
- [ ] Implement re-authentication flow
- [ ] Add bank connection management UI (disconnect, reconnect)
- [ ] Set up automatic daily transaction syncs

### 6. Security Considerations

- ✅ Never store Plaid credentials in code
- ✅ Use environment variables for secrets
- ✅ Encrypt access tokens in database
- ✅ Implement proper user authentication
- ✅ Use HTTPS for all API calls
- ✅ Validate webhook signatures
- ✅ Implement rate limiting

## Resources

- [Plaid Quickstart](https://plaid.com/docs/quickstart/)
- [Plaid API Reference](https://plaid.com/docs/api/)
- [React Native Plaid SDK](https://github.com/plaid/react-native-plaid-link-sdk)
- [Plaid Dashboard](https://dashboard.plaid.com/)

## Costs

- **Sandbox**: Free (for development)
- **Development**: Free (limited to 100 items)
- **Production**: Pay-as-you-go pricing
  - $0.25 per linked account/month
  - $0.05 per transaction sync request

## Support

For implementation help:
- Plaid Support: https://plaid.com/contact/
- Community: https://community.plaid.com/

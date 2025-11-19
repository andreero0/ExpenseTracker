# 🚀 App Scaffold - Production-Ready React Native Template

A modern, production-ready scaffold for building React Native apps with **Supabase**, **NativeWind**, **React Query**, and **FastAPI**.

Stop rebuilding authentication, onboarding, and infrastructure for every new app. Start with a solid foundation and focus on building features!

---

## ✨ Features

### Frontend (React Native + Expo)
- ✅ **Supabase Authentication** - Email/password, OAuth, magic links
- ✅ **Biometric Authentication** - Face ID / Touch ID
- ✅ **Modern State Management** - Zustand + React Query
- ✅ **Type-Safe Development** - Full TypeScript support
- ✅ **Beautiful UI** - NativeWind (Tailwind) + NativeBase
- ✅ **Form Handling** - React Hook Form with validation
- ✅ **Navigation** - Expo Router (file-based routing)
- ✅ **Testing** - Jest + React Native Testing Library
- ✅ **Error Monitoring** - Sentry integration
- ✅ **Push Notifications** - Expo Notifications
- ✅ **Camera & Image Upload** - Expo Camera + Cloudinary
- ✅ **Internationalization** - Expo Localization

### Backend (FastAPI + Python)
- ✅ **FastAPI** - Modern, fast Python framework
- ✅ **Supabase** - PostgreSQL database with RLS
- ✅ **SQLAlchemy** - Python ORM
- ✅ **Background Jobs** - Redis + RQ
- ✅ **Image Processing** - Cloudinary integration
- ✅ **AI Features** - OpenAI API integration
- ✅ **Docker** - Containerized deployment
- ✅ **Railway** - Easy deployment

### DevOps
- ✅ **EAS Build** - Cloud builds for iOS/Android
- ✅ **GitHub Actions** - CI/CD pipeline
- ✅ **Sentry** - Error tracking
- ✅ **Environment Management** - .env.example files

---

## 🎯 Quick Start

### Using the CLI (Recommended)

```bash
# Run the CLI tool to create a new app
npx github:andreero0/app-scaffold my-awesome-app

# Or use it locally
git clone <your-repo-url>
cd app-scaffold
cd cli
npm install
npm link
create-app-scaffold my-awesome-app
```

The CLI will guide you through setup with interactive prompts!

### Manual Setup

```bash
# Clone this repository
git clone <your-repo-url> my-new-app
cd my-new-app

# Install mobile dependencies
cd mobile
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys
```

---

## 📁 Project Structure

```
my-app/
├── mobile/                    # React Native app
│   ├── app/                   # Expo Router
│   ├── components/           # Reusable components
│   ├── stores/               # Zustand stores
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   ├── theme/                # Design tokens
│   └── package.json
│
├── backend/                   # FastAPI backend (optional)
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   └── models/
│   └── requirements.txt
│
├── cli/                       # Scaffolding CLI tool
│   ├── index.js
│   ├── prompts.js
│   └── setup.js
│
└── ARCHITECTURE.md           # Full documentation
```

---

## 🛠️ Tech Stack

### Frontend
- React Native (0.81.5) via Expo (SDK 54)
- TypeScript (5.8.3)
- Supabase (2.49) - Auth + Database
- Zustand (5.0) - Global state
- React Query (5.62) - Server state
- NativeWind (4.1) - Tailwind CSS
- NativeBase (3.4) - UI components

### Backend
- FastAPI (Python)
- Supabase - PostgreSQL
- SQLAlchemy - ORM
- Redis + RQ - Background jobs
- Cloudinary - Image storage
- OpenAI API - AI features

---

## 🚀 Development

### Run Mobile App

```bash
cd mobile
npm start          # Start Expo
npm run ios        # Run on iOS
npm run android    # Run on Android
npm test           # Run tests
```

### Run Backend (Optional)

```bash
cd backend
python -m uvicorn app.main:app --reload
```

---

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture guide
- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

---

## 🎉 What's Next?

After scaffolding:
1. Set up Supabase and configure .env
2. Customize theme in `theme/tokens.ts`
3. Set up EAS Build for deployments
4. Build your features! 🚀

---

**Happy Building!** 🎊

# App Scaffold Architecture

This document outlines the complete tech stack and architecture for your reusable app scaffold.

## Overview

This scaffold provides a production-ready foundation for building mobile apps with:
- ✅ Complete authentication (Supabase Auth + Biometrics)
- ✅ Modern state management (Zustand + React Query)
- ✅ Type-safe development (TypeScript)
- ✅ Scalable backend (FastAPI + Supabase)
- ✅ Professional styling (NativeWind + NativeBase)
- ✅ CI/CD ready (GitHub Actions + Sentry)

---

## Frontend Stack

### Core Framework
- **React Native** via **Expo SDK 54+**
- **TypeScript** (strict mode enabled)
- **EAS Build** for production builds

### Navigation
- **Expo Router** (file-based routing)
- **React Navigation** v7 (underlying navigation)
- **Expo Linking** (deep linking support)

### Data Flow & State Management
- **Zustand** - Global client state (user preferences, UI state)
- **React Query** - Server state, caching, synchronization
- **React Hook Form** - Form state and validation

### UI, Styling & Interactivity
- **NativeBase** - Core component library (buttons, inputs, cards, etc.)
- **NativeWind** - Tailwind CSS for React Native
- **Custom Design Tokens** - Centralized theme system
- **React Native Reanimated** v3 - Animations
- **React Native Gesture Handler** - Touch gestures
- **Expo Haptics** - Haptic feedback
- **Expo Vector Icons** - Icon library

### Networking & Data
- **Fetch API** - HTTP requests
- **GraphQL** - GraphQL client for Supabase
- **Supabase Client** - Real-time subscriptions, database queries

### Data Storage
- **Expo SecureStore** - Sensitive data (tokens, keys)
- **Supabase** - Primary PostgreSQL database (remote)
- **React Query Cache** - In-memory server state cache

### Authentication & Authorization
- **Supabase Auth** - Email/password, OAuth, magic links
- **Expo LocalAuthentication** - Biometric authentication (Face ID, Touch ID)
- **Row Level Security (RLS)** - Database-level authorization via Supabase

### Media & Camera
- **Expo Camera** - Camera access
- **Expo Image** - Optimized image component
- **Expo ImageManipulator** - Image editing/resizing
- **Cloudinary** (via backend) - Cloud image storage and transformations

### Notifications & Localization
- **Expo Notifications** - Push notifications
- **Expo Localization** - Internationalization (i18n)

### Testing
- **Jest** - Unit testing framework
- **React Native Testing Library** - Component testing
- **MSW (Mock Service Worker)** - API mocking

### Error Monitoring
- **Sentry** - Error tracking and performance monitoring

---

## Backend Stack

### Core API
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation and serialization

### Database
- **Supabase** - PostgreSQL database (hosted)
- **SQLAlchemy** - Python ORM
- **Alembic** - Database migrations

### Image Processing
- **Cloudinary** - Cloud image storage and CDN
- **Pillow (PIL)** - Python image processing

### LLM Integrations
- **OpenAI API** - GPT models for AI features
- **Langchain** (optional) - LLM orchestration

### Authentication & Security
- **Supabase Auth** - Centralized auth (shared with frontend)
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling

### Background Jobs
- **Redis** - In-memory data store
- **RQ (Redis Queue)** - Background job processing
- **Cron** (optional) - Scheduled tasks

### Testing
- **Pytest** - Python testing framework
- **Pytest-asyncio** - Async test support

### Error Monitoring
- **Sentry** - Error tracking (shared with frontend)

### Deployment
- **Docker** - Containerization
- **Railway** - Hosting platform
- **GitHub Actions** - CI/CD pipeline

---

## Project Structure

```
app-scaffold/
├── cli/                           # CLI tool for scaffolding
│   ├── index.js                   # Main CLI entry
│   ├── prompts.js                 # Interactive setup
│   ├── setup.js                   # Template customization
│   └── package.json
│
├── mobile/                        # React Native app
│   ├── app/                       # Expo Router (file-based routing)
│   │   ├── (auth)/               # Public auth routes
│   │   │   ├── sign-in.tsx       # Sign in screen
│   │   │   ├── sign-up.tsx       # Sign up screen
│   │   │   ├── forgot-password.tsx
│   │   │   └── _layout.tsx       # Auth layout
│   │   ├── (root)/               # Protected app routes
│   │   │   ├── (tabs)/           # Bottom tab navigation
│   │   │   │   ├── index.tsx     # Home screen
│   │   │   │   ├── profile.tsx   # Profile screen
│   │   │   │   └── _layout.tsx   # Tab layout
│   │   │   ├── settings.tsx
│   │   │   └── _layout.tsx       # Root layout
│   │   ├── onboarding/           # First-time user flow
│   │   │   ├── welcome.tsx
│   │   │   ├── permissions.tsx
│   │   │   └── _layout.tsx
│   │   └── _layout.tsx           # Root layout (providers)
│   │
│   ├── components/               # Reusable components
│   │   ├── ui/                   # UI components (NativeBase wrappers)
│   │   ├── forms/                # Form components (with React Hook Form)
│   │   ├── layout/               # Layout components
│   │   └── shared/               # Shared utilities
│   │
│   ├── lib/                      # Core utilities
│   │   ├── supabase.ts           # Supabase client
│   │   ├── graphql/              # GraphQL queries/mutations
│   │   ├── api/                  # API client functions
│   │   └── utils/                # Helper functions
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── auth.store.ts         # Auth state
│   │   ├── user.store.ts         # User preferences
│   │   └── ui.store.ts           # UI state
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Auth hook
│   │   ├── useBiometric.ts       # Biometric auth hook
│   │   ├── queries/              # React Query hooks
│   │   └── mutations/            # React Query mutations
│   │
│   ├── theme/                    # Design system
│   │   ├── tokens.ts             # Design tokens
│   │   ├── nativebase.ts         # NativeBase theme
│   │   └── tailwind.config.js    # NativeWind config
│   │
│   ├── types/                    # TypeScript types
│   │   ├── database.types.ts     # Supabase generated types
│   │   ├── api.types.ts          # API types
│   │   └── models.ts             # Data models
│   │
│   ├── constants/                # App constants
│   │   └── config.ts             # App configuration
│   │
│   ├── assets/                   # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   ├── __tests__/                # Tests
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── .env.example              # Environment variables template
│   ├── app.json                  # Expo configuration
│   ├── eas.json                  # EAS Build configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── jest.config.js
│
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── main.py               # FastAPI app entry
│   │   ├── config.py             # Configuration
│   │   ├── database.py           # Database setup
│   │   │
│   │   ├── api/                  # API routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Auth endpoints
│   │   │   ├── users.py          # User endpoints
│   │   │   └── health.py         # Health check
│   │   │
│   │   ├── models/               # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── base.py
│   │   │
│   │   ├── schemas/              # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── auth.py
│   │   │
│   │   ├── services/             # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth.service.py
│   │   │   ├── cloudinary.service.py
│   │   │   ├── openai.service.py
│   │   │   └── supabase.service.py
│   │   │
│   │   ├── middleware/           # Middleware
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Auth middleware
│   │   │   └── rate_limit.py     # Rate limiting
│   │   │
│   │   ├── workers/              # Background jobs (RQ)
│   │   │   ├── __init__.py
│   │   │   └── tasks.py          # Job definitions
│   │   │
│   │   └── utils/                # Utilities
│   │       ├── __init__.py
│   │       └── helpers.py
│   │
│   ├── migrations/               # Alembic migrations
│   │   └── versions/
│   │
│   ├── tests/                    # Pytest tests
│   │   ├── test_api/
│   │   └── test_services/
│   │
│   ├── .env.example              # Environment variables
│   ├── Dockerfile                # Docker configuration
│   ├── requirements.txt          # Python dependencies
│   ├── pyproject.toml            # Python project config
│   └── pytest.ini                # Pytest configuration
│
├── .github/                       # GitHub configuration
│   └── workflows/
│       ├── mobile-ci.yml         # Mobile CI/CD
│       └── backend-ci.yml        # Backend CI/CD
│
├── docs/                          # Documentation
│   ├── SETUP.md                  # Setup guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── CONTRIBUTING.md           # Contributing guide
│
├── .gitignore
├── README.md
└── package.json                   # Root workspace config
```

---

## Key Features Included

### Authentication Flow
1. **Email/Password Sign Up** with email verification
2. **Social OAuth** (Google, Apple, GitHub via Supabase)
3. **Magic Link** authentication
4. **Biometric** authentication (Face ID/Touch ID) for quick login
5. **Password Reset** flow
6. **Session Management** with automatic token refresh

### Onboarding Flow
1. **Welcome Screen** with app introduction
2. **Permissions Request** (Camera, Notifications, Location)
3. **Profile Setup** (avatar upload, preferences)
4. **Tutorial/Walkthrough** (optional)

### Core App Features
- **Protected Routes** (automatic redirect if not authenticated)
- **Profile Management** (edit profile, upload avatar via Cloudinary)
- **Settings** (theme toggle, notifications, biometric toggle)
- **Error Boundaries** (graceful error handling)
- **Loading States** (skeleton screens, spinners)
- **Pull to Refresh** (on data screens)
- **Infinite Scroll** (for lists)
- **Image Upload** (with compression and Cloudinary)
- **Push Notifications** (local and remote)
- **Deep Linking** (handle app URLs)

### Backend Features
- **RESTful API** with FastAPI
- **GraphQL API** via Supabase (optional)
- **Real-time Subscriptions** via Supabase
- **File Upload** handling with Cloudinary
- **Background Jobs** (email sending, image processing)
- **Rate Limiting** per endpoint
- **API Documentation** (auto-generated with FastAPI)
- **Health Checks** for monitoring
- **Database Migrations** with Alembic

---

## Environment Variables

### Mobile (.env)
```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx

# App Config
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:8000

# Sentry
SENTRY_DSN=xxx

# EAS
EAS_PROJECT_ID=xxx
```

### Backend (.env)
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Database
DATABASE_URL=postgresql://xxx

# Redis
REDIS_URL=redis://localhost:6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# OpenAI
OPENAI_API_KEY=xxx

# Sentry
SENTRY_DSN=xxx

# App Config
ENVIRONMENT=development
SECRET_KEY=xxx
```

---

## Development Workflow

### Initial Setup
```bash
# Clone with CLI
npx github:andreero0/app-scaffold my-new-app
cd my-new-app

# Install dependencies (done automatically by CLI)
cd mobile && npm install
cd ../backend && pip install -r requirements.txt

# Set up environment variables (guided by CLI)
cp mobile/.env.example mobile/.env
cp backend/.env.example backend/.env

# Start development servers
npm run dev  # Starts both mobile and backend
```

### Mobile Development
```bash
cd mobile
npm start              # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm test              # Run tests
npm run type-check    # TypeScript check
```

### Backend Development
```bash
cd backend
python -m uvicorn app.main:app --reload  # Start FastAPI
pytest                                    # Run tests
alembic upgrade head                      # Run migrations
```

### Building for Production
```bash
# Mobile (EAS Build)
cd mobile
eas build --platform ios
eas build --platform android

# Backend (Docker)
cd backend
docker build -t my-app-backend .
docker push registry.railway.app/xxx
```

---

## CLI Tool Usage

The scaffold comes with a CLI tool that sets up new projects:

```bash
# Create new app
npx github:andreero0/app-scaffold my-new-app

# Interactive prompts
? App name: My Awesome App
? Package identifier: com.mycompany.awesomeapp
? Include example screens? (Y/n): n
? Select features:
  ✓ Authentication (Supabase + Biometrics)
  ✓ Onboarding flow
  ✓ Profile management
  ✓ Push notifications
  ✓ Image upload (Cloudinary)
  ✓ AI features (OpenAI)
? Select theme:
  ❯ Light
    Dark
    System

✔ Setting up project structure...
✔ Installing dependencies...
✔ Configuring Supabase...
✔ Setting up environment variables...
✔ Initializing git repository...

🎉 Your app is ready!

Next steps:
  cd my-new-app
  npm run dev
```

---

## Design Decisions

### Why Supabase over Firebase?
- Open source and self-hostable
- PostgreSQL (more powerful than Firestore)
- Built-in auth, real-time, and storage
- Row Level Security (RLS) for authorization
- GraphQL support
- Better pricing for scale

### Why FastAPI over Express?
- Modern Python framework (async/await)
- Auto-generated API documentation
- Built-in data validation with Pydantic
- Better performance than Flask/Django
- Type hints and IDE support
- Easy integration with AI/ML libraries

### Why NativeWind over styled-components?
- Tailwind utility classes (faster development)
- Consistent with web development
- Better performance (no runtime styling)
- Easier to maintain
- Auto-completion in IDE

### Why Zustand over Redux?
- Much simpler API
- Less boilerplate
- Better TypeScript support
- Smaller bundle size
- Sufficient for most apps

### Why React Query over SWR?
- More features (mutations, optimistic updates)
- Better devtools
- Built-in pagination and infinite queries
- Larger community

---

## Testing Strategy

### Mobile Testing
- **Unit Tests**: Utility functions, hooks (Jest)
- **Component Tests**: UI components (React Native Testing Library)
- **Integration Tests**: User flows (Detox - optional)

### Backend Testing
- **Unit Tests**: Service functions (Pytest)
- **API Tests**: Endpoint testing (Pytest + TestClient)
- **Integration Tests**: Database operations (Pytest)

---

## CI/CD Pipeline

### Mobile (GitHub Actions)
1. **Lint & Type Check** on every PR
2. **Run Tests** on every PR
3. **EAS Build** on main branch merge
4. **Submit to App Store** (manual approval)

### Backend (GitHub Actions)
1. **Lint & Type Check** on every PR
2. **Run Tests** on every PR
3. **Build Docker Image** on main branch merge
4. **Deploy to Railway** (automatic)

---

## Monitoring & Analytics

### Error Monitoring
- **Sentry** for error tracking (frontend + backend)
- **Sentry Performance** for performance monitoring

### Analytics (Optional)
- **Expo Analytics** (basic usage stats)
- **PostHog** (open source, self-hostable)
- **Supabase Analytics** (built-in)

---

## Security Best Practices

1. **Never commit .env files** (use .env.example)
2. **Use Expo SecureStore** for sensitive data
3. **Implement Row Level Security (RLS)** in Supabase
4. **Validate all inputs** (Pydantic on backend, react-hook-form on frontend)
5. **Rate limit API endpoints**
6. **Use HTTPS** in production
7. **Keep dependencies updated** (Dependabot)
8. **Scan for vulnerabilities** (npm audit, safety)

---

## Performance Optimizations

### Mobile
- **React.memo** for expensive components
- **useMemo/useCallback** for expensive calculations
- **FlatList** with pagination for long lists
- **Image optimization** (Expo Image with blurhash)
- **Code splitting** with dynamic imports
- **Bundle size optimization** (metro bundler config)

### Backend
- **Database indexing** for common queries
- **Redis caching** for frequently accessed data
- **Background jobs** for slow operations
- **CDN** for static assets (Cloudinary)
- **Connection pooling** for database

---

## Next Steps After Scaffolding

1. **Customize branding** (colors, fonts, logo)
2. **Set up Supabase project** (create tables, enable RLS)
3. **Configure third-party services** (Cloudinary, OpenAI, Sentry)
4. **Set up EAS** (eas init, eas build:configure)
5. **Deploy backend** to Railway
6. **Build your features!** 🚀

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Railway Documentation](https://docs.railway.app/)

---

## Support

For issues or questions:
- Check the [docs/](./docs) folder
- Open an issue on GitHub
- Join our Discord community

---

**Happy Building! 🎉**

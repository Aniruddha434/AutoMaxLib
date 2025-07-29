# AutoMaxLib 🚀

A full-stack web application for automated GitHub commits with free and premium features.

## 🧑‍💻 Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Authentication**: Clerk
- **Payments**: Razorpay
- **Database**: MongoDB
- **Scheduling**: Node-Cron

- **Hosting**: Vercel (Frontend), Render (Backend)

## 🔐 Features

### Free Features

- Daily GitHub auto-commit (10 AM IST)
- Connect GitHub using Personal Access Token
- Select one repo and file path
- Preset commit messages
- View last 7 days' commit log
- Basic GitHub repo info
- Manual commit button (once per day)
- Retry on failed commit
- Dark mode toggle
- Public badge link

### Premium Features

- Multiple repo support
- Custom commit scheduling
- Smart file generator
- AI-generated commit messages
- **AI-Powered Profile README Generation** (NEW)
- GitHub contribution booster
- Email alerts and monthly summary
- Backup and restore settings
- Public shareable streak profile
- GitHub OAuth support

## 📁 Project Structure

```
AutoMaxLib/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Clerk account
- Razorpay account

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd AutoMaxLib
```

2. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables (see .env.example files)

4. Start development servers

```bash
# Start both services (from root directory)
npm run dev

# Or start individually
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

## 🚀 Production Deployment

AutoMaxLib is production-ready with comprehensive security, monitoring, and deployment features.

### Quick Production Deploy

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Using deployment script (Linux/macOS)
chmod +x deploy.sh
./deploy.sh deploy production

# Test production deployment
chmod +x test-production.sh
./test-production.sh -u https://your-domain.com
```

### Production Features

- ✅ **Security**: Rate limiting, input validation, security headers, CORS protection
- ✅ **Monitoring**: Health checks, performance metrics, structured logging
- ✅ **Scalability**: PM2 process management, Redis caching, database optimization
- ✅ **Reliability**: Error handling, graceful shutdowns, automatic restarts
- ✅ **DevOps**: Docker containers, CI/CD pipeline, automated testing

### Documentation

- [Production Deployment Guide](PRODUCTION_DEPLOYMENT.md) - Comprehensive production setup
- [Environment Configuration](backend/.env.example) - Environment variables reference
- [API Documentation](docs/API.md) - API endpoints and usage
- [Security Guide](docs/SECURITY.md) - Security best practices

## 📊 Monitoring & Health

Once deployed, monitor your application:

- **Health Check**: `https://your-domain.com/health`
- **Detailed Health**: `https://your-domain.com/monitoring/health/detailed`
- **Metrics**: `https://your-domain.com/monitoring/metrics`
- **System Info**: `https://your-domain.com/monitoring/info`

## 🔧 Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Production
npm run build           # Build frontend for production
npm run start           # Start backend in production mode
npm run production      # Start with PM2 in production

# Testing
npm run test            # Run all tests
npm run test:frontend   # Run frontend tests
npm run test:backend    # Run backend tests

# Deployment
./deploy.sh deploy production    # Deploy to production
./deploy.sh backup              # Create database backup
./deploy.sh logs production     # View production logs
./test-production.sh            # Test production deployment
```

## 📝 License

MIT License

# AutoMaxLib ✨

Never break your coding streak again! AutoMaxLib is a powerful tool that helps developers maintain consistent GitHub activity by automating commits and providing intelligent coding assistance.

## 🚀 Features

### Core Features
- **Automated GitHub Commits**: Never miss a day of coding activity
- **Smart Commit Messages**: AI-generated meaningful commit messages
- **Streak Protection**: Intelligent backup commits to maintain your streak
- **GitHub Integration**: Seamless connection with your GitHub repositories
- **Real-time Analytics**: Track your coding patterns and productivity

### Premium Features
- **Advanced Pattern Generation**: Create complex coding patterns and templates
- **AI-Powered README Generator**: Generate professional README files instantly
- **Priority Support**: Get help when you need it most
- **Custom Automation Rules**: Set up personalized commit schedules

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive design
- **React Router** for seamless navigation
- **Clerk** for authentication and user management
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose for data persistence
- **Clerk** for user authentication and webhooks
- **GitHub API** integration for repository management
- **Razorpay** for payment processing

### Deployment
- **Frontend**: Vercel for fast, global CDN deployment
- **Backend**: Render for reliable API hosting
- **Database**: MongoDB Atlas for cloud database
- **Authentication**: Clerk for secure user management

## 📦 Clean Project Structure

```
AutoMaxLib/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── vercel.json         # Vercel deployment config
├── backend/                 # Node.js backend API
│   ├── routes/             # API route handlers
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   ├── package.json        # Backend dependencies
│   └── server.js           # Entry point
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- GitHub account for API access
- Clerk account for authentication

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Environment Variables

**Frontend (.env.local)**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend (.env)**
```env
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret_here
MONGODB_URI=your_mongodb_connection_string
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🌐 Fresh Deployment Guide

### Step 1: Delete Old Deployments
1. **Vercel**: Delete old project from dashboard
2. **Render**: Delete old backend service
3. **Clerk**: Keep existing app (update URLs after deployment)

### Step 2: Deploy Frontend (Vercel)
1. Create new Vercel project
2. Import from GitHub: `AutoMaxLib` repository
3. **Root Directory**: `frontend`
4. **Framework**: `Vite`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Add environment variables
8. Deploy

### Step 3: Deploy Backend (Render)
1. Create new Render web service
2. Connect GitHub repository
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add environment variables
7. Deploy

### Step 4: Update Clerk Configuration
1. Update domains in Clerk dashboard
2. Update webhook URLs
3. Test authentication flow

## 🔧 Development

### Available Scripts

**Frontend**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## ✨ What's New in This Clean Version

### Removed Clutter
- ✅ Deleted 18+ unnecessary documentation files
- ✅ Removed all debug/test scripts (25+ files)
- ✅ Cleaned up temporary and duplicate files
- ✅ Simplified Clerk integration to official standards
- ✅ Removed complex authentication wrappers

### Simplified Architecture
- ✅ Clean main.jsx following official Clerk guide
- ✅ Streamlined project structure
- ✅ Proper separation of frontend/backend
- ✅ Clear deployment configurations

### Official Clerk Integration
- ✅ Uses `@clerk/clerk-react@latest`
- ✅ Proper `VITE_CLERK_PUBLISHABLE_KEY` environment variable
- ✅ Simple `<ClerkProvider>` setup in main.jsx
- ✅ Follows current Clerk documentation standards

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: Report bugs on GitHub Issues
- **Email**: support@automaxlib.com

---

Made with ❤️ by the AutoMaxLib team

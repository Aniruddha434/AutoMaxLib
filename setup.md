# AutoGitPilot Setup Guide

This guide will help you set up the AutoGitPilot application locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Clerk account for authentication
- Razorpay account for payments
- GitHub Personal Access Token

## Environment Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Variables

#### Frontend (.env)

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_here
```

#### Backend (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/autogitpilot

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Razorpay Payment
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# OpenAI (for premium features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Email Configuration (for premium features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 3. Database Setup

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# The application will automatically create the database and collections
```

### 4. Clerk Setup

1. Create a Clerk application at https://clerk.com
2. Get your publishable and secret keys
3. Configure OAuth providers (Google, GitHub) if needed
4. Set up webhooks for user events

### 5. Razorpay Setup

1. Create a Razorpay account at https://razorpay.com
2. Get your API keys from the dashboard
3. Set up webhooks for payment events
4. Configure payment methods

## Running the Application

### Development Mode

```bash
# Terminal 1: Start the backend
cd backend
npm run dev

# Terminal 2: Start the frontend
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/health

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## Features to Test

### Free Features

1. Sign up/Sign in with Clerk
2. Connect GitHub repository with Personal Access Token
3. Configure commit settings
4. View dashboard with commit stats
5. Manual commit button (once per day)
6. Dark mode toggle

### Premium Features (after payment)

1. Custom commit scheduling
2. Multiple repository support
3. AI-generated commit messages
4. Email notifications

5. Public profile sharing

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in .env

2. **Clerk Authentication Issues**

   - Verify API keys are correct
   - Check Clerk dashboard for application settings

3. **GitHub API Errors**

   - Ensure Personal Access Token has correct permissions
   - Check rate limits

4. **Payment Issues**
   - Verify Razorpay keys and webhook configuration
   - Test with Razorpay test mode first

### Logs

Check application logs for detailed error information:

```bash
# Backend logs
cd backend
npm run dev

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Configure build and start commands
4. Set up MongoDB Atlas for production database

### Environment Variables for Production

- Update all URLs to production domains
- Use production API keys for Clerk and Razorpay
- Set up proper SMTP configuration for emails
- Configure proper CORS origins

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review application logs
3. Check GitHub issues
4. Contact support team

## Security Notes

- Never commit .env files to version control
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regularly rotate API keys
- Monitor for suspicious activity

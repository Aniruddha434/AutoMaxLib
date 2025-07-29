# 🚀 AutoMaxLib Production Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **GitHub Repository**
- [x] Code uploaded to: https://github.com/Aniruddha434/AutoMaxLib.git
- [x] All sensitive files excluded via .gitignore
- [x] Production environment files created
- [x] README and documentation updated

### 🔧 **Required Services Setup**

#### **1. Domain & Hosting**
- [ ] Purchase domain: `automaxlib.com`
- [ ] Frontend hosting: Vercel/Netlify
- [ ] Backend hosting: Railway/Render/Heroku
- [ ] SSL certificate (automatic with hosting providers)

#### **2. Database - MongoDB Atlas**
- [ ] Create MongoDB Atlas account
- [ ] Create production cluster
- [ ] Configure IP whitelist (0.0.0.0/0 for cloud hosting)
- [ ] Get connection string for production

#### **3. Authentication - Clerk**
- [ ] Upgrade Clerk to production plan
- [ ] Configure production domain
- [ ] Get live API keys
- [ ] Set up OAuth providers (GitHub)

#### **4. Payments - Razorpay**
- [ ] Complete KYC verification
- [ ] Submit live API key request
- [ ] Configure webhooks for production domain
- [ ] Test payment flow with live keys

#### **5. AI Services**
- [ ] Gemini API production key
- [ ] Set up usage monitoring
- [ ] Configure rate limits

## 🌐 **Frontend Deployment (Vercel)**

### **Step 1: Connect GitHub Repository**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `Aniruddha434/AutoMaxLib`
4. Select `frontend` as root directory

### **Step 2: Configure Build Settings**
```bash
# Build Command
npm run build

# Output Directory
dist

# Install Command
npm install
```

### **Step 3: Environment Variables**
Add these in Vercel dashboard:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key
VITE_APP_NAME=AutoMaxLib
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_AI_FEATURES=true
```

### **Step 4: Custom Domain**
1. Add custom domain: `automaxlib.com`
2. Configure DNS records as instructed
3. Enable automatic HTTPS

## 🖥️ **Backend Deployment (Railway)**

### **Step 1: Connect Repository**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create new project from GitHub
3. Select `Aniruddha434/AutoMaxLib`
4. Set root directory to `backend`

### **Step 2: Configure Environment Variables**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/automaxlib
CLERK_SECRET_KEY=sk_live_your_production_key
RAZORPAY_KEY_ID=rzp_live_your_live_key
RAZORPAY_KEY_SECRET=your_live_secret
FRONTEND_URL=https://automaxlib.com
GEMINI_API_KEY=your_production_key
```

### **Step 3: Deploy**
1. Railway will auto-deploy from main branch
2. Get deployment URL
3. Update frontend API_BASE_URL

## 📧 **Email Configuration**

### **Gmail SMTP Setup**
1. Enable 2-factor authentication
2. Generate app-specific password
3. Use in production environment:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=supportautomaxlib@gmail.com
SMTP_PASS=your_app_specific_password
```

## 🔒 **Security Configuration**

### **SSL/HTTPS**
- [x] Automatic with Vercel/Railway
- [x] Force HTTPS redirects
- [x] HSTS headers enabled

### **CORS Configuration**
```javascript
// Update backend CORS for production
const corsOptions = {
  origin: [
    'https://automaxlib.com',
    'https://www.automaxlib.com'
  ],
  credentials: true
}
```

### **Environment Security**
- [ ] All production keys different from development
- [ ] No sensitive data in repository
- [ ] Regular key rotation schedule

## 📊 **Monitoring & Analytics**

### **Error Tracking - Sentry**
1. Create Sentry account
2. Add DSN to environment variables
3. Configure error reporting

### **Analytics - Google Analytics**
1. Create GA4 property
2. Add tracking ID to frontend
3. Configure conversion tracking

## 🧪 **Testing Production**

### **Pre-Launch Tests**
- [ ] User registration/login flow
- [ ] GitHub OAuth integration
- [ ] Payment processing (test mode first)
- [ ] AI README generation
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Page load speeds
- [ ] SEO meta tags

### **Payment Testing**
1. Test with Razorpay test cards
2. Verify webhook delivery
3. Check subscription management
4. Test refund process (if applicable)

## 🚀 **Go Live Checklist**

### **Final Steps**
- [ ] Switch Razorpay to live mode
- [ ] Update all API endpoints
- [ ] Test complete user journey
- [ ] Monitor error logs
- [ ] Set up backup procedures
- [ ] Configure monitoring alerts

### **Post-Launch**
- [ ] Submit to Google Search Console
- [ ] Set up social media accounts
- [ ] Create support documentation
- [ ] Monitor performance metrics
- [ ] Plan marketing strategy

## 📞 **Support & Maintenance**

### **Contact Information**
- **Email**: supportautomaxlib@gmail.com
- **Phone**: +91 8624829427
- **Address**: Nimbhora MIDC Road, Amravati, Maharashtra, India

### **Backup Strategy**
- Daily database backups
- Code repository backups
- Environment configuration backups
- Regular disaster recovery testing

## 🔄 **Continuous Deployment**

### **Auto-Deploy Setup**
- Main branch → Production
- Staging branch → Staging environment
- Feature branches → Preview deployments

### **Monitoring**
- Uptime monitoring
- Performance tracking
- Error rate monitoring
- User analytics

---

## 🎯 **Quick Deploy Commands**

```bash
# Frontend (Vercel)
vercel --prod

# Backend (Railway)
railway up

# Database Migration
npm run migrate:prod

# Health Check
curl https://automaxlib.com/api/health
```

**🎉 Your AutoMaxLib platform is ready for production deployment!**

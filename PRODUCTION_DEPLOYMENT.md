# AutoGitPilot Production Deployment Guide

This guide provides comprehensive instructions for deploying AutoGitPilot to production environments.

## 📋 Prerequisites

### System Requirements
- **Server**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 50GB SSD
- **CPU**: 2+ cores
- **Network**: Static IP address, Domain name configured

### Software Requirements
- Docker 24.0+
- Docker Compose 2.0+
- Git
- SSL Certificate (recommended)

### External Services
- MongoDB Atlas (recommended) or self-hosted MongoDB
- Redis (optional, for caching)
- Clerk account (authentication)
- Razorpay account (payments)
- OpenAI/Gemini API keys (AI features)
- SMTP service (email notifications)

## 🚀 Quick Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

### 2. Clone Repository

```bash
git clone https://github.com/your-username/autogitpilot.git
cd autogitpilot
```

### 3. Environment Configuration

```bash
# Copy production environment files
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Edit environment files with your production values
nano backend/.env
nano frontend/.env
```

### 4. SSL Certificate Setup (Recommended)

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Copy your SSL certificates
cp your-cert.pem nginx/ssl/cert.pem
cp your-key.pem nginx/ssl/key.pem

# Or use Let's Encrypt (example)
sudo apt install certbot
sudo certbot certonly --standalone -d autogitpilot.com -d www.autogitpilot.com
cp /etc/letsencrypt/live/autogitpilot.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/autogitpilot.com/privkey.pem nginx/ssl/key.pem
```

### 5. Deploy Application

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh deploy production
```

## 🔧 Detailed Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Security
JWT_SECRET=your_production_jwt_secret_32_chars_min
SESSION_SECRET=your_production_session_secret_32_chars_min
ENCRYPTION_KEY=your_production_encryption_key_32_chars

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autogitpilot?retryWrites=true&w=majority

# Redis (Optional)
REDIS_URL=redis://redis:6379

# Authentication
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret
CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key

# Payment Processing
RAZORPAY_KEY_ID=rzp_live_your_production_key
RAZORPAY_KEY_SECRET=your_production_razorpay_secret

# AI Services
OPENAI_API_KEY=sk-your_production_openai_key
GEMINI_API_KEY=your_production_gemini_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_production_email@gmail.com
SMTP_PASS=your_production_app_password

# Frontend URL
FRONTEND_URL=https://autogitpilot.com
ALLOWED_ORIGINS=https://autogitpilot.com,https://www.autogitpilot.com

# Logging
LOG_LEVEL=warn
LOG_FILE=logs/app.log

# Monitoring
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
```

#### Frontend (.env)
```bash
# Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key

# API Configuration
VITE_API_BASE_URL=https://autogitpilot.com/api

# Payment Processing
VITE_RAZORPAY_KEY_ID=rzp_live_your_production_key

# Feature Flags
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Monitoring
VITE_SENTRY_DSN=https://your_frontend_sentry_dsn@sentry.io/project_id
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🔒 Security Checklist

### Pre-Deployment Security
- [ ] Change all default passwords and secrets
- [ ] Use strong, unique passwords (32+ characters)
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up fail2ban for SSH protection
- [ ] Enable automatic security updates

### Application Security
- [ ] Environment variables properly configured
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Database access restricted
- [ ] API endpoints protected

### Infrastructure Security
- [ ] SSH key-based authentication
- [ ] Non-root user for application
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Network segmentation
- [ ] Monitoring and alerting

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Check application health
curl https://autogitpilot.com/health

# Check detailed health
curl https://autogitpilot.com/monitoring/health/detailed

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### Log Management
```bash
# View application logs
./deploy.sh logs production

# View specific service logs
./deploy.sh logs production backend

# PM2 logs (if using PM2)
docker-compose exec backend pm2 logs
```

### Database Backup
```bash
# Create backup
./deploy.sh backup

# Restore from backup
./deploy.sh restore backups/mongodb_backup_20231201_120000.gz
```

### Performance Monitoring
```bash
# Check system resources
docker stats

# Monitor PM2 processes
docker-compose exec backend pm2 monit

# Check application metrics
curl https://autogitpilot.com/monitoring/metrics
```

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
./deploy.sh deploy production

# Zero-downtime deployment (if using load balancer)
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
```

### Database Maintenance
```bash
# MongoDB maintenance
docker-compose exec mongodb mongosh
# Run maintenance commands in MongoDB shell

# Redis maintenance
docker-compose exec redis redis-cli
# Run Redis commands
```

### SSL Certificate Renewal
```bash
# Renew Let's Encrypt certificates
sudo certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/autogitpilot.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/autogitpilot.com/privkey.pem nginx/ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml restart frontend
```

## 🚨 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
./deploy.sh logs production

# Check environment variables
docker-compose exec backend env | grep -E "(NODE_ENV|MONGODB_URI|CLERK_)"

# Verify database connection
docker-compose exec backend npm run test:db
```

#### High Memory Usage
```bash
# Check memory usage
docker stats

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Scale down if needed
docker-compose -f docker-compose.prod.yml up -d --scale backend=1
```

#### SSL Issues
```bash
# Test SSL configuration
openssl s_client -connect autogitpilot.com:443

# Check certificate expiry
openssl x509 -in nginx/ssl/cert.pem -text -noout | grep "Not After"
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Stop current deployment
./deploy.sh stop production

# Checkout previous version
git checkout HEAD~1

# Deploy previous version
./deploy.sh deploy production
```

#### Database Recovery
```bash
# Stop application
./deploy.sh stop production

# Restore from backup
./deploy.sh restore backups/latest_backup.gz

# Start application
./deploy.sh deploy production
```

## 📞 Support & Monitoring

### Monitoring Endpoints
- Health Check: `https://autogitpilot.com/health`
- Detailed Health: `https://autogitpilot.com/monitoring/health/detailed`
- Metrics: `https://autogitpilot.com/monitoring/metrics`
- System Info: `https://autogitpilot.com/monitoring/info`

### Log Locations
- Application Logs: `backend/logs/`
- Nginx Logs: `nginx/logs/`
- PM2 Logs: `backend/logs/pm2-*.log`

### Performance Metrics
- Response Time: < 500ms (95th percentile)
- Uptime: > 99.9%
- Error Rate: < 0.1%
- Memory Usage: < 80%
- CPU Usage: < 70%

## 🔐 Security Contacts

For security issues, please contact:
- Email: security@autogitpilot.com
- Emergency: +1-XXX-XXX-XXXX

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Clerk Documentation](https://clerk.dev/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

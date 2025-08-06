# Production Webhook Fix Guide

## 🚨 Current Issue
Your Clerk webhooks are failing in production with "No matching signature found" errors because the webhook secret in your environment variables doesn't match the actual secret configured in Clerk Dashboard.

## ✅ Quick Fix Steps

### Step 1: Run Diagnostic Script
```bash
node fix-clerk-webhook-production.js
```

This will show you exactly what needs to be fixed.

### Step 2: Get Correct Webhook Secret

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Select your production application**
3. **Navigate to "Webhooks"** in the left sidebar
4. **Find your webhook**: `https://automaxlib.onrender.com/api/webhook/clerk`
5. **Copy the "Signing Secret"** (starts with `whsec_`)

### Step 3: Update Production Environment

**For Render.com deployment:**

1. Go to your Render dashboard
2. Select your backend service (`automaxlib-backend` or similar)
3. Click on "Environment" tab
4. Find `CLERK_WEBHOOK_SECRET` or add it if missing
5. Update the value with the secret from Clerk Dashboard:
   ```
   CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_FROM_CLERK_DASHBOARD
   ```
6. Click "Save Changes"
7. Render will automatically redeploy your service

### Step 4: Verify Fix

Wait for deployment to complete, then run:
```bash
node fix-clerk-webhook-production.js
```

You should see:
- ✅ Webhook endpoint accessible
- ✅ Secret configured correctly
- ✅ Signature validation working

## 🔍 Detailed Troubleshooting

### Issue: Webhook Secret Not Found
**Symptoms**: Script shows "CLERK_WEBHOOK_SECRET not found"
**Solution**: Add the environment variable in Render dashboard

### Issue: Wrong Secret Format
**Symptoms**: Secret doesn't start with `whsec_`
**Solution**: Copy the correct "Signing Secret" from Clerk Dashboard, not the publishable key

### Issue: Webhook Still Failing
**Symptoms**: Correct secret but still getting signature errors
**Solutions**:
1. Check Clerk Dashboard webhook logs
2. Verify webhook URL is exactly: `https://automaxlib.onrender.com/api/webhook/clerk`
3. Ensure webhook is enabled/active in Clerk Dashboard
4. Check if webhook events are configured correctly

### Issue: Environment Variable Not Loading
**Symptoms**: Old secret still showing after update
**Solutions**:
1. Verify the environment variable was saved in Render
2. Check deployment logs for any errors
3. Manually trigger a redeploy if needed

## 📋 Production Checklist

### Clerk Dashboard Configuration
- [ ] Webhook URL: `https://automaxlib.onrender.com/api/webhook/clerk`
- [ ] Webhook is enabled/active
- [ ] Events are selected (user.created, user.updated, etc.)
- [ ] Signing secret is copied correctly

### Render Environment Variables
- [ ] `CLERK_WEBHOOK_SECRET` is set
- [ ] Secret starts with `whsec_`
- [ ] Secret matches Clerk Dashboard
- [ ] Service has been redeployed

### Testing
- [ ] Webhook endpoint returns 200 on GET request
- [ ] Diagnostic script shows all green checkmarks
- [ ] Test webhook from Clerk Dashboard works
- [ ] User registration/updates trigger webhooks correctly

## 🚀 Next Steps After Fix

1. **Monitor webhook processing**: Check your application logs for successful webhook events
2. **Test user flows**: Create a test user to verify webhooks work end-to-end
3. **Set up monitoring**: Consider adding webhook failure alerts
4. **Remove debug logging**: Clean up any temporary debug logs once confirmed working

## 📞 Still Having Issues?

If you're still experiencing problems after following this guide:

1. **Check application logs** for detailed error messages
2. **Review Clerk Dashboard webhook logs** for delivery attempts
3. **Verify network connectivity** between Clerk and your server
4. **Check for any proxy/CDN** that might be modifying webhook requests

## 🔧 Useful Commands

```bash
# Test webhook endpoint
curl https://automaxlib.onrender.com/api/webhook/clerk

# Run comprehensive diagnostics
node fix-clerk-webhook-production.js

# Check environment variables (if you have server access)
env | grep CLERK

# View recent logs (Render dashboard)
# Go to Render > Your Service > Logs
```

## 📚 Related Documentation

- [CLERK_WEBHOOK_TROUBLESHOOTING.md](./CLERK_WEBHOOK_TROUBLESHOOTING.md) - Detailed troubleshooting guide
- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Complete production setup guide
- [Clerk Webhook Documentation](https://clerk.dev/docs/webhooks) - Official Clerk webhook docs

---

**Remember**: Always use the "Signing Secret" from Clerk Dashboard, not the publishable key or secret key. The webhook secret is specifically for webhook signature verification.

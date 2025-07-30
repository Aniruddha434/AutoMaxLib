# Clerk Webhook Troubleshooting Guide

## Current Issue
Getting "No matching signature found" error when Clerk sends webhooks to your endpoint.

## Root Cause
The webhook secret in your environment variables doesn't match the actual secret configured in Clerk Dashboard.

## Solution Steps

### 1. Get Correct Webhook Secret from Clerk Dashboard

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com
2. **Select your application** (should be your production app)
3. **Navigate to Webhooks** in the left sidebar
4. **Find your webhook endpoint**: `https://automaxlib.onrender.com/api/webhook/clerk`
5. **Click on the webhook** to view details
6. **Copy the "Signing Secret"** - it should start with `whsec_`

### 2. Update Environment Variable

Replace the current secret in `backend/.env.production`:

```bash
# Current (incorrect):
CLERK_WEBHOOK_SECRET=whsec_KY5BvDzBPfTG//dS3fm+tOs1JRf0eAIS

# Replace with actual secret from Clerk Dashboard:
CLERK_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_FROM_CLERK_DASHBOARD
```

### 3. Verify Webhook Configuration in Clerk Dashboard

Make sure your webhook is configured correctly:

- **Endpoint URL**: `https://automaxlib.onrender.com/api/webhook/clerk`
- **HTTP Method**: POST
- **Status**: Active/Enabled
- **Events**: Select the events you want to receive (user.created, user.updated, etc.)

### 4. Restart Your Application

After updating the environment variable:
1. Restart your application/server
2. Check the logs to ensure the new secret is loaded

### 5. Test the Webhook

You can test the webhook from Clerk Dashboard:
1. Go to your webhook configuration
2. Click "Send test event" or similar option
3. Check your server logs for successful processing

## Debugging Commands

Run these scripts to help debug:

```bash
# Test environment variables
node test-env-vars.js

# Full webhook diagnostics
node debug-clerk-webhook.js
```

## Common Issues

### Issue: "Missing CLERK_WEBHOOK_SECRET environment variable"
- **Cause**: Environment file not loaded or variable not set
- **Solution**: Check `.env.production` file and restart application

### Issue: "Missing svix headers"
- **Cause**: Request not coming from Clerk or headers stripped
- **Solution**: Check webhook URL and ensure no proxy is stripping headers

### Issue: "Invalid webhook signature"
- **Cause**: Wrong webhook secret
- **Solution**: Get correct secret from Clerk Dashboard

## Verification Checklist

- [ ] Webhook secret starts with `whsec_`
- [ ] Webhook secret matches Clerk Dashboard
- [ ] Webhook URL is correct in Clerk Dashboard
- [ ] Webhook is enabled/active in Clerk Dashboard
- [ ] Application has been restarted after environment changes
- [ ] Server logs show webhook secret is loaded
- [ ] No proxy/CDN is modifying webhook requests

## Expected Log Output (Success)

```
Webhook headers: {
  'svix-id': 'msg_...',
  'svix-timestamp': '1234567890',
  'svix-signature': 'present',
  'user-agent': 'Svix-Webhooks/1.68.0'
}
Webhook body length: 123
Webhook verification successful
Received Clerk webhook: user.created
```

## Expected Log Output (Failure)

```
Webhook headers: {
  'svix-id': 'msg_...',
  'svix-timestamp': '1234567890',
  'svix-signature': 'present',
  'user-agent': 'Svix-Webhooks/1.68.0'
}
Webhook body length: 123
Error verifying webhook: No matching signature found
Webhook secret length: 38
Webhook secret starts with whsec_: true
```

## Next Steps After Fix

1. Monitor logs for successful webhook processing
2. Test user registration/updates to ensure webhooks work
3. Remove debug logging once confirmed working
4. Consider setting up webhook retry logic for failed events

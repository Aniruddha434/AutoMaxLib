# Clerk Webhook Configuration Verification

## Your Current Configuration

**Endpoint ID**: `ep_30aolcgSH91FEPVDHedSWbdngcH`
**Webhook Secret**: `whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie`
**Webhook URL**: `https://automaxlib.onrender.com/api/webhook/clerk`

## Verification Checklist

### ✅ Completed
- [x] Webhook endpoint is accessible
- [x] Application is processing webhooks
- [x] Signature validation is working
- [x] Environment variables are loaded
- [x] Webhook secret updated in .env.production

### 🔍 To Verify in Clerk Dashboard

#### 1. Webhook URL Configuration
- [ ] URL is exactly: `https://automaxlib.onrender.com/api/webhook/clerk`
- [ ] No trailing slash (/)
- [ ] Uses HTTPS (not HTTP)
- [ ] No extra parameters or query strings

#### 2. Webhook Secret
- [ ] Secret matches: `whsec_ZBysbrLyJU3zrW7ud+20O3fccgyc54Ie`
- [ ] No extra spaces or characters
- [ ] Copied correctly from Clerk Dashboard

#### 3. Webhook Status
- [ ] Webhook is "Active" or "Enabled"
- [ ] Not in "Paused" or "Disabled" state
- [ ] No error indicators in Clerk Dashboard

#### 4. Event Configuration
- [ ] At least one event is selected
- [ ] Common events to enable:
  - `user.created`
  - `user.updated`
  - `user.deleted`
  - `session.created`
  - `session.ended`

#### 5. Render Service
- [ ] Environment variable `CLERK_WEBHOOK_SECRET` is set in Render
- [ ] Service has been restarted after environment variable update
- [ ] No deployment errors in Render logs

## Testing Steps

### 1. Test from Clerk Dashboard
1. Go to Clerk Dashboard → Webhooks
2. Find your webhook (endpoint ID: `ep_30aolcgSH91FEPVDHedSWbdngcH`)
3. Click "Send test event" or similar
4. Check the response/status

### 2. Check Server Logs
After testing from Clerk Dashboard, check your Render logs for:

**Expected Success Logs:**
```
Webhook headers: {
  'svix-id': 'msg_...',
  'svix-timestamp': '...',
  'svix-signature': 'present',
  'user-agent': 'Svix-Webhooks/1.68.0'
}
Webhook body length: [number]
Webhook verification successful
Received Clerk webhook: [event_type]
```

**If Still Failing:**
```
Error verifying webhook: No matching signature found
```

## Common Issues & Solutions

### Issue: "Connection refused" or "Timeout"
**Cause**: Webhook URL is incorrect or service is down
**Solution**: 
- Verify URL is exactly `https://automaxlib.onrender.com/api/webhook/clerk`
- Check if your Render service is running

### Issue: "Invalid webhook signature" 
**Cause**: Webhook secret mismatch
**Solution**:
- Copy the exact secret from Clerk Dashboard
- Ensure no extra spaces or characters
- Restart Render service after updating

### Issue: "Webhook endpoint not found"
**Cause**: URL path is incorrect
**Solution**:
- Ensure path is `/api/webhook/clerk` (not `/webhook/clerk` or other variations)

### Issue: "SSL/TLS errors"
**Cause**: HTTPS configuration issues
**Solution**:
- Ensure URL uses `https://` not `http://`
- Check if Render service has SSL enabled

## Manual Verification Commands

Run these to test your endpoint:

```bash
# Test endpoint accessibility
curl -X GET https://automaxlib.onrender.com/api/webhook/clerk

# Test webhook processing (should return 400 - missing headers)
curl -X POST https://automaxlib.onrender.com/api/webhook/clerk \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Next Steps After Verification

1. **If all checks pass but still failing**:
   - Contact Clerk support with your endpoint ID
   - Provide them with your webhook URL and any error messages

2. **If webhook starts working**:
   - Test user registration/login to ensure events are processed
   - Monitor logs for any processing errors
   - Consider removing debug logging once stable

3. **For production monitoring**:
   - Set up alerts for webhook failures
   - Monitor webhook processing times
   - Implement retry logic for failed webhook processing

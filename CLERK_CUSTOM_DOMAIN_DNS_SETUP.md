# Clerk Custom Domain DNS Configuration Guide

## Overview
You're setting up `clerk.automaxlib.online` as your custom Clerk domain. This will fix the deployment error you encountered.

## DNS Records Required

Clerk typically requires these CNAME records for custom domains:

### Primary CNAME Record
```
Type: CNAME
Name: clerk
Host: clerk.automaxlib.online
Value: clerk.com (or the value provided by Clerk)
TTL: 300 (or your DNS provider's minimum)
```

### Additional Records (if required by Clerk)
Clerk may also require additional CNAME records for:
- `accounts.automaxlib.online` → `accounts.clerk.com`
- `api.automaxlib.online` → `api.clerk.com`

## Step-by-Step DNS Configuration

### Step 1: Access Your DNS Provider
Go to your domain registrar or DNS provider dashboard for `automaxlib.online`

### Step 2: Add CNAME Records
1. **Create new CNAME record**:
   - **Type**: CNAME
   - **Name/Host**: `clerk` (this creates clerk.automaxlib.online)
   - **Value/Target**: The value provided in your Clerk dashboard
   - **TTL**: 300 seconds (5 minutes)

2. **Save the record**

### Step 3: Verify DNS Propagation
```bash
# Check if the CNAME is resolving
nslookup clerk.automaxlib.online

# Or use dig
dig clerk.automaxlib.online CNAME

# Online tools
# Use https://dnschecker.org/ to check global propagation
```

### Step 4: Complete Clerk Verification
1. Return to your Clerk Dashboard
2. Click "Verify" or "Check DNS" button
3. Wait for verification to complete (can take up to 48 hours)

## Common DNS Provider Instructions

### Cloudflare
1. Go to DNS → Records
2. Add record:
   - Type: CNAME
   - Name: clerk
   - Target: [value from Clerk]
   - Proxy status: DNS only (gray cloud)

### GoDaddy
1. Go to DNS Management
2. Add record:
   - Type: CNAME
   - Host: clerk
   - Points to: [value from Clerk]

### Namecheap
1. Go to Advanced DNS
2. Add record:
   - Type: CNAME Record
   - Host: clerk
   - Value: [value from Clerk]

### Google Domains
1. Go to DNS
2. Add custom record:
   - Type: CNAME
   - Name: clerk
   - Data: [value from Clerk]

## Verification Process

### What Clerk Checks
- DNS record exists and points correctly
- SSL certificate can be provisioned
- Domain is accessible via HTTPS

### Timeline
- **DNS Propagation**: 5 minutes to 48 hours
- **SSL Certificate**: 10-30 minutes after DNS verification
- **Full Verification**: Up to 48 hours total

## Troubleshooting

### Issue: DNS not propagating
**Solutions**:
- Wait longer (up to 48 hours)
- Clear local DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Try different DNS servers (8.8.8.8, 1.1.1.1)

### Issue: Clerk verification failing
**Solutions**:
- Double-check CNAME value matches exactly
- Ensure no extra spaces or characters
- Try removing and re-adding the DNS record
- Contact your DNS provider support

### Issue: SSL certificate errors
**Solutions**:
- Wait for automatic SSL provisioning
- Ensure CNAME points to correct Clerk endpoint
- Check if your DNS provider has SSL/proxy settings interfering

## After DNS Verification

### Update Your Application
Once verified, your Clerk keys will work with the custom domain:

1. **Keep your existing production keys** - they should now work
2. **Test the authentication flow**
3. **Monitor for any remaining errors**

### Test Commands
```bash
# Test if custom domain is working
curl -I https://clerk.automaxlib.online

# Test your application
# Your original error should be resolved
```

## Important Notes

1. **Don't change your Clerk keys** - the same production keys will work once DNS is configured
2. **DNS changes take time** - be patient with propagation
3. **SSL is automatic** - Clerk handles SSL certificate provisioning
4. **Backup plan** - you can always revert to standard Clerk domain if needed

## Next Steps

1. ✅ Add the CNAME record to your DNS
2. ⏳ Wait for DNS propagation
3. ✅ Verify in Clerk dashboard
4. ✅ Test your deployed application
5. ✅ Monitor for successful authentication

Your deployment error should be resolved once this DNS configuration is complete!

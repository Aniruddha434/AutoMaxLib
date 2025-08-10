# Production Fix Guide

## Current Production Issues

### 1. **AI Service Configuration Missing**
- ❌ OpenRouter API key not configured in production
- ❌ OpenAI API key not configured in production  
- ✅ Gemini API key configured (but hitting quota limits)

### 2. **Mermaid Diagram Syntax Errors**
- Generated diagrams contain invalid syntax
- Special characters causing rendering failures
- Node IDs with spaces and special characters

### 3. **API Error Rate**
- Current error rate: 17.86%
- Authentication and AI service failures

## Immediate Fixes Required

### Step 1: Update Production Environment Variables

Add these environment variables to your Render.com deployment:

```bash
# OpenRouter API Key (Primary AI Provider)
OPENROUTER_API_KEY=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

# Optional: OpenAI API Key (Additional Fallback)
OPENAI_API_KEY=your_openai_key_here
```

**How to add in Render.com:**
1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add the environment variables above
5. Click "Save Changes"
6. The service will automatically redeploy

### Step 2: Verify Production Deployment

After adding the environment variables, check:

```bash
# Check service configuration
curl https://automaxlib.onrender.com/monitoring/services

# Should show:
# "openrouter": {"status": "configured"}
# "openai": {"status": "configured"} (if added)
```

### Step 3: Test AI Services

Test the repository analysis endpoint:

```bash
# This should work after authentication
curl -X POST https://automaxlib.onrender.com/api/repository/readme/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"repositoryUrl": "https://github.com/user/repo"}'
```

## Code Fixes Applied

### 1. **Updated AI Model Names**
- ✅ OpenRouter: `claude-3.5-sonnet`, `gpt-4o`, `gpt-4o-mini`
- ✅ Gemini: `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`
- ✅ Removed deprecated models

### 2. **Enhanced Retry Logic**
- ✅ Exponential backoff for rate limits
- ✅ Smart error detection (429, 503, 502)
- ✅ Permanent error handling (402, 404)

### 3. **Improved Mermaid Syntax Cleaning**
- ✅ Fixed node IDs with spaces and special characters
- ✅ Enhanced label cleaning
- ✅ Better subgraph name handling
- ✅ Fallback diagram on syntax errors

## Expected Results After Fix

### 1. **Improved Success Rate**
- Error rate should drop from 17.86% to <5%
- Better AI model availability
- Reduced quota exhaustion

### 2. **Working Architecture Diagrams**
- Proper Mermaid syntax generation
- Successful diagram rendering
- Fallback mechanisms working

### 3. **Better User Experience**
- Faster response times
- Fewer authentication errors
- More reliable AI generation

## Monitoring & Verification

### Check Production Status:
```bash
# Overall health
curl https://automaxlib.onrender.com/monitoring/health

# Service configuration
curl https://automaxlib.onrender.com/monitoring/services

# Database status
curl https://automaxlib.onrender.com/monitoring/database
```

### Monitor Error Rates:
- Watch the error rate in monitoring endpoint
- Should see improvement within 10-15 minutes
- Check logs for any remaining issues

## Rollback Plan

If issues persist:

1. **Revert Environment Variables:**
   - Remove the newly added API keys
   - Service will fall back to Gemini only

2. **Check Logs:**
   - Review Render logs for specific errors
   - Look for authentication or API key issues

3. **Contact Support:**
   - If OpenRouter API key issues persist
   - Check OpenRouter account credits and status

## Next Steps

1. **Add Environment Variables** (Priority 1)
2. **Monitor Error Rates** (Priority 2)  
3. **Test Architecture Generation** (Priority 3)
4. **Update Documentation** (Priority 4)

## Support Information

- **OpenRouter Dashboard:** https://openrouter.ai/settings/credits
- **Render Dashboard:** https://dashboard.render.com
- **Production Health:** https://automaxlib.onrender.com/monitoring/health

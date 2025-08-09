# OpenRouter Integration for Repository README Generation

## Overview

This document describes the OpenRouter API integration implemented for repository README generation in AutoGitPilot. OpenRouter serves as the primary AI provider with Gemini as a fallback.

## Features

- **Primary Provider**: OpenRouter API with high-quality models (Claude 3 Sonnet, GPT-4 Turbo)
- **Fallback Provider**: Gemini AI for reliability
- **Seamless Switching**: Automatic fallback when OpenRouter fails
- **Isolated Impact**: Only affects repository README generation, not profile README generation
- **Maintained Limits**: Preserves existing freemium model (2 free repository READMEs for free users, 10/month for premium)

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# OpenRouter API Configuration
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here
```

### API Key Setup

1. Sign up at [OpenRouter.ai](https://openrouter.ai)
2. Generate an API key
3. Add it to your environment configuration
4. Restart the backend service

## Implementation Details

### AI Service Architecture

The `aiService.js` now includes:

1. **OpenRouter Client**: Initialized using OpenAI SDK with OpenRouter base URL
2. **Primary/Fallback Logic**: Tries OpenRouter first, falls back to Gemini
3. **Model Selection**: Uses high-quality models for repository README generation
4. **Error Handling**: Comprehensive error handling and logging

### Model Priority

**OpenRouter Models (Primary):**
- `anthropic/claude-3-sonnet` (preferred for technical writing)
- `openai/gpt-4-turbo`
- `openai/gpt-4`

**Gemini Models (Fallback):**
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-1.0-pro`
- `gemini-pro`

### Provider Selection Logic

```javascript
// 1. Try OpenRouter if configured
if (this.openRouterConfigured) {
  try {
    return await this.generateRepositoryReadmeWithOpenRouter(...)
  } catch (error) {
    console.warn('OpenRouter failed, falling back to Gemini')
  }
}

// 2. Fallback to Gemini
if (this.isConfigured) {
  return await this.generateWithGemini(...)
}

// 3. Error if no providers available
throw new Error('No AI providers configured')
```

## API Response Format

The response now includes provider information:

```json
{
  "success": true,
  "content": "# Repository README content...",
  "template": "web-application",
  "wordCount": 150,
  "modelUsed": "OpenRouter:anthropic/claude-3-sonnet",
  "provider": "openrouter",
  "quality": { "score": 95, "issues": [] }
}
```

## Monitoring and Logging

### Success Logging
- `✅ Repository README generated successfully with OpenRouter model: anthropic/claude-3-sonnet`
- `🔄 Using Gemini as fallback provider for repository README generation`

### Error Handling
- OpenRouter failures are logged but don't interrupt user experience
- Automatic fallback ensures high availability
- Provider performance is tracked for optimization

## Testing

The integration includes comprehensive tests:

1. **Primary Provider Test**: Verifies OpenRouter is used when available
2. **Fallback Test**: Ensures Gemini fallback works when OpenRouter fails
3. **Limit Tests**: Confirms freemium limits are maintained
4. **Error Handling**: Tests various failure scenarios

## Backward Compatibility

- **No Breaking Changes**: Existing functionality remains intact
- **Optional Configuration**: Works without OpenRouter API key (Gemini only)
- **Profile README**: Continues to use Gemini exclusively
- **Freemium Model**: All existing limits and features preserved

## Benefits

1. **Higher Quality**: Claude 3 Sonnet excels at technical documentation
2. **Reliability**: Dual-provider setup ensures high availability
3. **Performance**: OpenRouter often provides faster response times
4. **Flexibility**: Easy to adjust model preferences and add new providers

## Troubleshooting

### Common Issues

1. **OpenRouter API Key Invalid**
   - Check API key format: `sk-or-v1-...`
   - Verify account has sufficient credits
   - Ensure API key has correct permissions

2. **Fallback to Gemini**
   - Normal behavior when OpenRouter is unavailable
   - Check logs for specific error messages
   - Verify Gemini API key is configured

3. **No AI Providers Available**
   - Ensure at least one API key is configured
   - Check environment variable names
   - Restart backend service after configuration changes

### Monitoring

Check the monitoring endpoint for provider status:
```bash
GET /api/monitoring/health
```

Response includes:
```json
{
  "services": {
    "openrouter": { "status": "configured" },
    "gemini": { "status": "configured" }
  }
}
```

## Future Enhancements

- **Model Performance Analytics**: Track success rates and response times
- **Dynamic Model Selection**: Choose models based on repository type
- **Cost Optimization**: Balance quality and cost across providers
- **Additional Providers**: Easy integration of new AI providers

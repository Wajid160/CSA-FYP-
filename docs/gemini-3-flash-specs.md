# Gemini 3 Flash - Technical Specifications

**Last Updated**: February 2, 2026  
**Source**: Google DeepMind & Google AI Studio

## Model Overview

**Model Name**: `gemini-3-flash`  
**Release Date**: December 2025  
**Status**: General Availability  
**Default Model**: Gemini App, Google AI Overviews (as of Jan 27, 2026)

## Performance

- **15% improvement** in overall accuracy vs Gemini 2.5 Flash
- Optimized for:
  - Complex reasoning
  - Multimodal understanding
  - Agentic tasks
  - Low latency
  - Cost efficiency

## Key Features

### Agentic Vision (Jan 27, 2026)
- Active image manipulation using Python code
- Enhanced image understanding capabilities
- Available via Gemini API

### Multimodal Capabilities
- Text input/output
- Image understanding
- Code generation and execution
- Multi-turn conversations

## API Access

### Platforms
- **Google AI Studio**: ai.google.dev
- **Vertex AI**: For enterprise use
- **Gemini API**: Direct API access

### Model Selection in N8N
- Node: "Google Gemini Chat Model" or "AI Agent"
- Model identifier: `gemini-3-flash`
- Alternative: `gemini-*-flash` pattern

## Free Tier Limits

> **Note**: Specific quota details for Gemini 3 Flash to be confirmed  
> Based on previous Gemini models, expect similar free tier structure:

| Metric | Estimated Limit |
|--------|----------------|
| Requests Per Day | 250 (preview models) |
| Requests Per Minute | 15 |
| Tokens Per Minute | 250,000 |
| Context Window | 1M tokens |

**Free tier includes**:
- ✅ Free input tokens
- ✅ Free output tokens
- ⚠️ Usage may be used by Google to improve products

## Integration with N8N

### Setup Steps
1. Get API key from Google AI Studio
2. Create "Google Gemini Chat Model" credential in N8N
3. Select `gemini-3-flash` as model
4. Configure system prompts and tools

### Supported N8N Features
- ✅ AI Agent orchestration
- ✅ PostgreSQL Chat Memory
- ✅ Redis Chat Memory
- ✅ MongoDB Chat Memory
- ✅ Tool calling / function calling
- ✅ Multi-turn conversations
- ✅ System prompts

## Best Practices for FYP

### Optimize for Free Tier
1. **Efficient Prompts**: Keep system prompts concise
2. **Context Management**: Use conversation memory wisely
3. **Rate Limiting**: Implement exponential backoff
4. **Caching**: Cache frequent responses (FAQs)
5. **Batching**: Group similar queries when possible

### Agent Configuration
```
Model: gemini-3-flash
Temperature: 0.7 (balanced creativity/consistency)
Max Tokens: 1024 (adjust per use case)
Top P: 0.95
System Prompt: < 500 tokens recommended
```

### Use Cases for CSA Project
- ✅ Product search queries (fast response needed)
- ✅ FAQ answering (good reasoning)
- ✅ Order status summaries
- ✅ Conversation routing (agentic capabilities)
- ✅ Sentiment analysis
- ✅ Multi-language support

## Comparison to Other Models

| Feature | Gemini 3 Flash | Gemini 2.5 Flash | Gemini Pro |
|---------|----------------|------------------|------------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ |
| Accuracy | 📊📊📊 | 📊📊 | 📊📊📊📊 |
| Cost (Free) | ✅ | ✅ | Limited |
| Agentic Tasks | ✅✅ | ✅ | ✅✅✅ |
| Best For | **Production** | Development | Complex tasks |

## Monitoring & Limits

### Track Usage
- Monitor via Google AI Studio dashboard
- Quotas reset at midnight Pacific Time
- Per-project limits (not per API key)

### Error Handling
```javascript
// Example error codes
- 429: Rate limit exceeded → Retry with backoff
- 400: Invalid request → Check prompt format
- 401: Authentication failed → Verify API key
- 500: Server error → Retry after delay
```

## Resources

- **Official Docs**: https://ai.google.dev/
- **API Reference**: https://ai.google.dev/api
- **Pricing**: https://ai.google.dev/pricing
- **N8N Integration**: https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.lmchatgooglegemini/

## Notes for FYP

1. **Use Gemini 3 Flash** (not 2.0 Flash which is being discontinued March 3, 2026)
2. **Model is stable** (GA since Dec 2025, not experimental)
3. **Optimized for agents** (perfect for multi-agent N8N architecture)
4. **Free tier sufficient** for development and testing
5. **Supports N8N natively** (built-in nodes available)

---

**Reference**: Research conducted February 2, 2026  
**Status**: ✅ Confirmed for use in Customer Support Agent FYP project

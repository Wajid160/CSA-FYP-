# ClothyMax Chat Widget

A modern, responsive chat widget that connects to the N8N FAQ Agent for customer support automation.

## Files

| File | Purpose |
|------|---------|
| `widget.js` | Main JavaScript logic |
| `widget.css` | Styling (separate file) |
| `index.html` | Local test page |
| `shopify-embed.js` | **Self-contained version for Shopify** |

## Quick Start

### Option 1: Test Locally
1. Open `index.html` in your browser
2. Click the chat button (bottom right)
3. Test the webhook connection

### Option 2: Add to Shopify

1. Go to your Shopify Admin
2. Navigate to **Online Store → Themes → Actions → Edit code**
3. Open `theme.liquid`
4. Paste this code just before `</body>`:

```html
<script src="https://YOUR-HOSTING-URL/shopify-embed.js"></script>
```

Or paste the entire contents of `shopify-embed.js` directly:

```html
<script>
// Paste contents of shopify-embed.js here
</script>
```

## Configuration

Edit the `CONFIG` object in `widget.js` or `shopify-embed.js`:

```javascript
const CONFIG = {
    webhookUrl: 'https://wajid8.app.n8n.cloud/webhook-test/faq-agent',
    botName: 'ClothyMax Assistant',
    welcomeMessage: "Hi there! 👋 I'm your ClothyMax shopping assistant.",
    quickReplies: [
        "What's your return policy?",
        "Track my order",
        "Size guide",
        "Contact support"
    ]
};
```

## N8N Webhook Expected Format

The widget sends POST requests with:
```json
{
    "message": "User's message text",
    "sessionId": "session_12345_abc",
    "timestamp": "2026-02-09T02:00:00.000Z",
    "source": "clothymax-widget"
}
```

Expected response format:
```json
{
    "output": "Bot response text"
}
```

## Features

- ✅ Floating chat button
- ✅ Smooth animations
- ✅ Typing indicator
- ✅ Session persistence
- ✅ Quick reply buttons
- ✅ Mobile responsive
- ✅ Works with N8N webhooks

## Styling

Colors can be customized via CSS variables:
- Primary: `#1a1a2e` (dark navy)
- Accent: `#e94560` (coral red)

# N8N Workflow - Order Status Agent

**Workflow Name**: `Order Status Agent`  
**File**: `order-status-agent.json`  
**Purpose**: Look up order status from Shopify by order number or email

---

## Workflow Overview

```
Webhook (POST /order-status)
    └── Parse Order Request (Code)
            └── Has Order Number? (If)
                    ├── YES → Lookup Order by Number (HTTP)
                    │               └── Format Order Response
                    └── NO → Has Email? (If)
                            ├── YES → Lookup Orders by Email (HTTP)
                            │               └── Format Order Response
                            └── NO → No Identifier Response
                                          └── Merge → Format Final Response
```

---

## API Endpoint

**URL**: `http://localhost:5678/webhook/order-status`  
**Method**: `POST`  
**Content-Type**: `application/json`

### Request Body
```json
{
  "question": "What's the status of order #1001?",
  "sessionId": "user-123"
}
```

**Alternative formats supported**:
- `"What's the status of my order 1001?"`
- `"Track order #1001"`
- `"Check my order with email john@example.com"`
- Direct fields: `{"orderNumber": "1001", "email": "john@example.com"}`

---

## Response Format

### Success (Order Found)
```json
{
  "success": true,
  "output": "✅ Order #1001 (February 9, 2026)\n\nStatus: Delivered\nTotal: 59.99 USD\nItems: 2x Classic Polo Shirt\n\nTracking: FedEx - 794644790132",
  "orders": [{
    "orderNumber": "#1001",
    "orderDate": "February 9, 2026",
    "status": "Delivered",
    "emoji": "✅",
    "total": "59.99 USD",
    "items": [{"name": "Classic Polo Shirt", "quantity": 2}],
    "tracking": {"number": "794644790132", "company": "FedEx"}
  }],
  "orderCount": 1,
  "sessionId": "user-123",
  "timestamp": "2026-02-09T15:00:00.000Z",
  "agent": "order-status"
}
```

### Error (Order Not Found)
```json
{
  "success": false,
  "output": "I couldn't find any orders matching that information...",
  "orders": [],
  "orderCount": 0
}
```

### Error (No Identifier)
```json
{
  "success": false,
  "output": "I couldn't find an order number or email in your message..."
}
```

---

## Order Status Mapping

| Shopify Status | Display | Emoji |
|----------------|---------|-------|
| `cancelled_at` set | Cancelled | ❌ |
| `fulfillment_status: fulfilled` | Delivered | ✅ |
| `fulfillment_status: partial` | Partially Shipped | 📦 |
| `financial_status: paid` | Processing | ⏳ |
| `financial_status: pending` | Payment Pending | 💳 |
| Default | In Progress | 📋 |

---

## Shopify API Setup

### Required Credential: `Shopify Header Auth`

Create an HTTP Header Auth credential in N8N:
- **Name**: `Shopify Header Auth`
- **Header Name**: `X-Shopify-Access-Token`
- **Header Value**: Your Shopify Admin Access Token

### Required Scopes
- `read_orders`
- `read_fulfillments`

---

## Integration with Orchestrator

To add this as a tool to the main orchestrator, you can either:

### Option 1: HTTP Request Tool (Simpler)
Add an HTTP Request Tool node to the AI Agent that calls this webhook.

### Option 2: Call Workflow (Better for complex logic)
Use "Call Workflow" node to invoke this workflow directly.

---

## Test Queries

| Query | Expected Behavior |
|-------|-------------------|
| "What's the status of order #1001?" | Lookup by order number |
| "Track my order 1001" | Extract number, lookup |
| "Check orders for john@email.com" | Lookup by email (returns up to 5) |
| "Where is my order?" | Return "need more info" response |

---

## Error Handling

1. **Invalid Order Number**: Returns friendly "order not found" message
2. **Shopify API Error**: Workflow has 10s timeout, returns error message
3. **No Identifier**: Prompts user to provide order number or email

---

## Next Steps

1. ✅ Import workflow into N8N
2. ⬜ Create Shopify Header Auth credential
3. ⬜ Test with real orders
4. ⬜ Add as tool to Orchestrator Agent

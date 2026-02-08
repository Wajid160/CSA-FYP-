# N8N Workflow Design - Main Orchestrator Agent

**Workflow Name**: `orchestrator-agent`  
**Purpose**: Main entry point that receives user messages, classifies intent, routes to specialist agents, and returns responses.

---

## Workflow Structure

### 1. Chat Trigger (Webhook)
**Node Type**: Webhook  
**Method**: POST  
**Path**: `/webhook/chat`

**Expected Input**:
```json
{
  "message": "user message text",
  "sessionId": "unique-session-id",
  "customerId": "shopify-customer-id",
  "isAuthenticated": true
}
```

---

### 2. Load Customer Data
**Node Type**: Postgres  
**Operation**: Select  
**Table**: `customers`

**Query**:
```sql
SELECT * FROM customers 
WHERE shopify_customer_id = {{ $json.customerId }}
LIMIT 1;
```

**Purpose**: Get customer profile, preferences, language

---

### 3. Load Conversation History
**Node Type**: Postgres Chat Memory  
**Configuration**:
- Session ID: `{{ $json.sessionId }}`
- Context window length: 10 messages
- Table: `messages`

**Purpose**: Provide context for the agent

---

### 4. Intent Classification
**Node Type**: AI Agent  
**Model**: Google Gemini Chat Model (gemini-3-flash)

**System Prompt**:
```
You are an intent classifier for a customer support agent.

Analyze the user's message and classify it into ONE of these intents:
- product_search: User wants to find or browse products
- order_status: User wants to check their order
- inventory_check: User wants to know if something is in stock
- faq: User has a general question (shipping, returns, policies)
- style_advice: User wants fashion/styling recommendations
- chitchat: Casual conversation, greetings, thank you
- escalate: Request for human support, complaint

Respond with ONLY the intent name, nothing else.

User message: {{ $json.message }}
Previous context: {{ $('Load Conversation History').item.json.history }}
```

**Output Example**: `product_search`

---

### 5. Route to Sub-Agent
**Node Type**: Switch  
**Mode**: Rules

**Rules**:
- `{{ $json.intent }}` equals `product_search` → Product Search Agent
- `{{ $json.intent }}` equals `order_status` → Order Status Agent
- `{{ $json.intent }}` equals `inventory_check` → Inventory Check Agent
- `{{ $json.intent }}` equals `faq` → FAQ Agent
- `{{ $json.intent }}` equals `style_advice` → Style Agent
- `{{ $json.intent }}` equals `chitchat` → Chitchat Handler
- `{{ $json.intent }}` equals `escalate` → Escalation Handler

---

### 6. Aggregate Results
**Node Type**: Code (JavaScript)

**Purpose**: Collect responses from all sub-agents and prepare final response

**Code**:
```javascript
const intent = $input.item.json.intent;
const agentResponse = $input.item.json.response;
const sessionId = $input.item.json.sessionId;

return {
  json: {
    message: agentResponse,
    intent: intent,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  }
};
```

---

### 7. Store Message in Database
**Node Type**: Postgres  
**Operation**: Insert  
**Table**: `messages`

**Insert Data**:
```json
{
  "conversation_id": "{{ $json.conversationId }}",
  "role": "agent",
  "content": "{{ $json.message }}",
  "agent_name": "orchestrator",
  "created_at": "{{ $json.timestamp }}"
}
```

---

### 8. Update Conversation Metadata
**Node Type**: Postgres  
**Operation**: Update  
**Table**: `conversations`

**Update**:
```sql
UPDATE conversations 
SET 
  total_messages = total_messages + 1,
  updated_at = NOW()
WHERE session_id = {{ $json.sessionId }};
```

---

### 9. Send Response
**Node Type**: Respond to Webhook  
**Response Body**:
```json
{
  "success": true,
  "message": "{{ $json.message }}",
  "intent": "{{ $json.intent }}",
  "timestamp": "{{ $json.timestamp }}"
}
```

---

## Error Handling

**Node Type**: Error Handler  
**Trigger**: On workflow error

**Action**:
1. Log error to database
2. Send graceful error message to user: "I'm having trouble right now. Let me connect you to support."
3. Create escalation ticket

---

## Testing the Workflow

### Test Input 1: Product Search
```json
{
  "message": "Do you have blue t-shirts?",
  "sessionId": "test-session-123",
  "customerId": "12345",
  "isAuthenticated": true
}
```

**Expected Flow**: 
1. Intent classified as `product_search`
2. Routes to Product Search Agent
3. Returns products matching "blue t-shirts"

### Test Input 2: Order Status
```json
{
  "message": "Where is my order #1234?",
  "sessionId": "test-session-124",
  "customerId": "12345",
  "isAuthenticated": true
}
```

**Expected Flow**:
1. Intent classified as `order_status`
2. Routes to Order Status Agent
3. Returns order tracking info

---

## Performance Targets

- **Response Time**: < 2 seconds average
- **Intent Accuracy**: > 90%
- **Error Rate**: < 5%

---

## Next Steps

1. Build this workflow in N8N
2. Test with sample inputs
3. Build each sub-agent workflow
4. Connect all workflows
5. Deploy and monitor

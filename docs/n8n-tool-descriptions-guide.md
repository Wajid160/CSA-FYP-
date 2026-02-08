# Adding Tool Descriptions in N8N AI Agent Workflows

## Why Tool Descriptions Matter

When you add a **Vector Store Retriever** or any other tool to an AI Agent, you need to tell the LLM (Gemini 3 Flash) **what this tool does** and **when to use it**. This is because:

1. The AI Agent needs to decide autonomously when to call the tool
2. A good description helps the L LM produce expected results
3. Without a description, the LLM may misuse or ignore the tool

---

## Where to Add the Description

### In N8N UI:

1. **Click** on the "Vector Store Retriever" node
2. **Find** the "Description" field (usually at the top of parameters)
3. **Enter** a clear, specific description

![Vector Store Retriever Description](file:///C:/Users/wajid/.gemini/antigravity/brain/79dcb4de-480c-4d61-b4fa-d0ce3a47d510/uploaded_media_1770061206397.png)

### In JSON (for import):

The `description` field goes inside the `parameters` object:

```json
{
  "parameters": {
    "topK": 3,
    "description": "Your tool description here",
    "options": {
      "searchType": "hybrid",
      "scoreThreshold": 0.7
    }
  },
  "id": "vector-store-retriever",
  "name": "Vector Store Retriever",
  "type": "@n8n/n8n-nodes-langchain.retrieverVectorStore"
}
```

---

## What Makes a Good Tool Description?

### ✅ Good Description (Specific & Actionable):

```
Search the FAQ knowledge base to find answers to customer questions 
about store policies, shipping, returns, payments, sizing, and general 
inquiries. Use this tool whenever a customer asks a question that might 
be answered in the FAQ database. Returns the top 3 most relevant FAQ 
entries with confidence scores above 0.7.
```

**Why it's good**:
- ✅ Explains **what** it does (searches FAQ knowledge base)
- ✅ Lists **specific topics** it covers (policies, shipping, etc.)
- ✅ Indicates **when** to use it (customer questions)
- ✅ Describes **output** (top 3 entries, scores >0.7)

### ❌ Bad Description (Vague):

```
Retrieves documents
```

**Why it's bad**:
- ❌ No context on what documents
- ❌ No guidance on when to use
- ❌ No information about output

---

## Best Practices for Tool Descriptions

### 1. Be Specific About Purpose
```
"Search the FAQ knowledge base..." ✅
vs
"Retrieve information" ❌
```

### 2. List Specific Use Cases
```
"...questions about store policies, shipping, returns, payments, sizing..." ✅
vs
"...general questions" ❌
```

### 3. Indicate When to Use
```
"Use this tool whenever a customer asks a question..." ✅
vs
"Use this tool" ❌
```

### 4. Describe Output
```
"Returns the top 3 most relevant FAQ entries with confidence scores..." ✅
vs
"Returns results" ❌
```

### 5. Set Expectations
```
"...confidence scores above 0.7" ✅ (tells LLM what to expect)
```

---

## Example Descriptions for Different Tools

### Vector Store Retriever (FAQ)
```
Search the FAQ knowledge base to find answers to customer questions 
about store policies, shipping, returns, payments, sizing, and general 
inquiries. Use this tool whenever a customer asks a question that might 
be answered in the FAQ database. Returns the top 3 most relevant FAQ 
entries with confidence scores above 0.7.
```

### Vector Store Retriever (Products)
```
Search the product catalog to find clothing items matching customer 
criteria. Use when customers ask about specific products, colors, sizes, 
styles, or want product recommendations. Returns top 5 matching products 
with names, descriptions, prices, and availability.
```

### Shopify Order Lookup Tool
```
Retrieve order details from Shopify using an order number. Use when 
customers ask about order status, tracking, delivery estimates, or order 
details. Returns order status, items, shipping info, and estimated delivery 
date. Requires order number.
```

### Inventory Check Tool
```
Check real-time stock availability for specific products and variants 
(size/color). Use when customers ask "Is X in stock?" or "Do you have 
size Y available?". Returns current inventory levels and restock dates 
if out of stock.
```

---

## How the AI Agent Uses Tool Descriptions

### User Query:
```
"What is your return policy?"
```

### Agent's Decision Process:
1. **Reads tool description**: "Search FAQ knowledge base... about store policies, shipping, **returns**..."
2. **Matches intent**: User asked about "return policy" → matches "returns" in description
3. **Calls tool**: Executes Vector Store Retriever
4. **Uses results**: Retrieved FAQ content → generates natural response

### Without Description:
- Agent might not know when to use the tool
- Could ignore the tool entirely
- Might use it incorrectly

---

## Testing Your Tool Description

### Good Test: Ask Questions Explicitly Covered

**Description says**: "...questions about shipping, returns, payments..."

**Test Queries**:
- ✅ "What is your return policy?" → Should use tool
- ✅ "How long does shipping take?" → Should use tool
- ✅ "What payment methods do you accept?" → Should use tool

### Edge Case Test: Ambiguous Questions

**Test Queries**:
- "Can I cancel my order?" → Should it use FAQ or Order tool?
- "Do you have hoodies?" → FAQ or Product Search?

**Solution**: Make descriptions mutually exclusive:
- FAQ: "...general policies and information"
- Order Tool: "...specific order actions requiring order number"
- Product Search: "...find specific products in catalog"

---

## N8N-Specific Configuration

### In the Vector Store Retriever Node Parameters:

```yaml
Description Field:
  Location: Top of node parameters
  Field Name: "Description"
  Character Limit: ~500 characters (no hard limit)
  Markdown: Not supported (plain text)
  Required: No (but HIGHLY recommended)
```

### Connection Setup:

The **Vector Store Retriever** must be connected to:
1. **AI Agent** via `ai_tool` connection
2. **Qdrant Vector Store** via `ai_vectorStore` connection

```
AI Agent
  └─ ai_tool → Vector Store Retriever
                  └─ ai_vectorStore → Qdrant Vector Store
                                        └─ ai_embedding → Embeddings Node
```

---

## Updated Workflow Configuration

Your workflow should now have:

```json
{
  "nodes": [
    {
      "name": "AI Agent - FAQ Responder",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "text": "={{ $json.question }}",
        "options": {
          "systemMessage": "You are a helpful customer support assistant..."
        }
      }
    },
    {
      "name": "Vector Store Retriever",
      "type": "@n8n/n8n-nodes-langchain.retrieverVectorStore",
      "parameters": {
        "topK": 3,
        "description": "Search the FAQ knowledge base to find answers...", // ← THIS!
        "options": {
          "searchType": "hybrid",
          "scoreThreshold": 0.7
        }
      }
    },
    {
      "name": "Qdrant Vector Store - FAQ",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
      "parameters": {
        "qdrantCollection": "faqs",
        "mode": "retrieve",
        "options": {
          "topK": 3
        }
      }
    }
  ]
}
```

---

## Verification Checklist

After adding the description:

- [ ] Description clearly states what the tool does
- [ ] Description lists specific topics/use cases
- [ ] Description indicates when to use the tool
- [ ] Description describes expected output
- [ ] Vector Store Retriever connected to AI Agent via `ai_tool`
- [ ] Vector Store Retriever connected to Qdrant via `ai_vectorStore`
- [ ] Qdrant connected to Embeddings node
- [ ] Test with sample questions to verify tool is called

---

## Common Mistakes to Avoid

### ❌ Mistake 1: No Description
```json
{
  "parameters": {
    "topK": 3
  }
}
```
**Problem**: Agent doesn't know when to use the tool

### ❌ Mistake 2: Vague Description
```json
{
  "parameters": {
    "description": "Searches for stuff"
  }
}
```
**Problem**: Not specific enough for LLM to decide

### ❌ Mistake 3: Wrong Connection Type
```
Vector Store Retriever → main → AI Agent ❌
```
**Correct**:
```
Vector Store Retriever → ai_tool → AI Agent ✅
```

---

## Summary

**Key Takeaways**:
1. ✅ Always add a `description` field to tools used by AI Agents
2. ✅ Be specific: what, when, and what output
3. ✅ List concrete use cases
4. ✅ Connect via `ai_tool` connection type
5. ✅ Test to verify the LLM calls the tool appropriately

**Your Updated Workflow**:
- Description added ✅
- Proper connections ✅
- Ready to import and test ✅


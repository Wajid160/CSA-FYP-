---
name: N8N Workflow Expert
description: Expert rules for creating import-ready N8N workflow JSON files
version: 1.0
created: 2026-02-09
source: czlonkowski/n8n-skills, haunchen/n8n-skills
---

# N8N Workflow Expert Skill

## 🚨 CRITICAL: Webhook Data Structure

**Most Common Mistake**: Webhook data is **NOT** at the root!

```javascript
// Webhook Node Output Structure:
{
  "headers": {...},
  "params": {...},
  "query": {...},
  "body": {           // ⚠️ USER DATA IS HERE!
    "name": "John",
    "message": "Hello"
  }
}
```

**Correct Access:**
```javascript
❌ WRONG: {{$json.name}}
✅ CORRECT: {{$json.body.name}}

// In expressions:
={{ $json.body.question }}
={{ $json.body.sessionId }}
```

---

## Expression Syntax Rules

### Format
```
={{ $json.field }}           // Current node data
={{ $('NodeName').item.json.field }}  // Other node data
```

### Core Variables
- `$json` - Current node output
- `$node["NodeName"]` - Access other nodes
- `$now` - Current timestamp
- `$env.VAR_NAME` - Environment variables

### Common Mistakes
| Wrong | Correct |
|-------|---------|
| `{{$json.name}}` | `={{ $json.body.name }}` |
| `$json.name` (no braces) | `={{ $json.name }}` |
| `{{$node.NodeName}}` | `={{ $('NodeName').item.json }}` |

---

## AI Agent Connection Types

N8N AI Agent uses 4 special connection types:

| Type | Purpose | Example Nodes |
|------|---------|---------------|
| `ai_languageModel` | LLM connection | Gemini, OpenAI, Anthropic |
| `ai_memory` | Conversation memory | Window Buffer Memory, Postgres Memory |
| `ai_tool` | Tools for agent | Vector Store Retriever, HTTP Request Tool |
| `ai_vectorStore` | Vector database | Qdrant, Pinecone, Supabase |
| `ai_embedding` | Embedding model | Google Gemini Embeddings |

### AI Agent Workflow Example
```
Webhook
    └── AI Agent
            ├── LLM (ai_languageModel)
            ├── Memory (ai_memory)
            ├── Tool 1 (ai_tool)
            ├── Tool 2 (ai_tool)
            └── Vector Store Retriever (ai_tool)
                    └── Qdrant (ai_vectorStore)
                            └── Embeddings (ai_embedding)
```

---

## Node Configuration Patterns

### Pattern 1: Webhook Node
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "my-endpoint",
    "responseMode": "lastNode",
    "options": {}
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2
}
```

### Pattern 2: AI Agent Node
```json
{
  "parameters": {
    "agent": "conversationalAgent",
    "promptType": "define",
    "text": "={{ $json.body.question }}",
    "hasOutputParser": false,
    "options": {
      "systemMessage": "Your system prompt here"
    }
  },
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7
}
```

### Pattern 3: Gemini LLM Node
```json
{
  "parameters": {
    "model": "models/gemini-1.5-flash",
    "options": {
      "temperature": 0.3,
      "maxOutputTokens": 200
    }
  },
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "typeVersion": 1.1
}
```

### Pattern 4: Window Buffer Memory
```json
{
  "parameters": {
    "sessionIdType": "customKey",
    "sessionKey": "={{ $('Webhook').item.json.body.sessionId || 'default' }}",
    "contextWindowLength": 5
  },
  "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
  "typeVersion": 1.3
}
```

### Pattern 5: Vector Store Retriever
```json
{
  "parameters": {
    "topK": 3,
    "options": {
      "scoreThreshold": 0.6
    }
  },
  "type": "@n8n/n8n-nodes-langchain.retrieverVectorStore",
  "typeVersion": 1
}
```

### Pattern 6: Qdrant Vector Store
```json
{
  "parameters": {
    "qdrantCollection": "faqs",
    "options": {}
  },
  "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
  "typeVersion": 1
}
```

### Pattern 7: Google Embeddings
```json
{
  "parameters": {
    "model": "models/text-embedding-004",
    "options": {}
  },
  "type": "@n8n/n8n-nodes-langchain.embeddingsGoogleGemini",
  "typeVersion": 1
}
```

### Pattern 8: Code Node
```json
{
  "parameters": {
    "jsCode": "// Your JavaScript code here\\nreturn { json: { result: 'value' } };"
  },
  "type": "n8n-nodes-base.code",
  "typeVersion": 2
}
```

---

## Connection Format

### Main Flow (data flow)
```json
"connections": {
  "NodeA": {
    "main": [[{"node": "NodeB", "type": "main", "index": 0}]]
  }
}
```

### AI Connections
```json
"connections": {
  "Gemini Model": {
    "ai_languageModel": [[{"node": "AI Agent", "type": "ai_languageModel", "index": 0}]]
  },
  "Memory": {
    "ai_memory": [[{"node": "AI Agent", "type": "ai_memory", "index": 0}]]
  },
  "Tool": {
    "ai_tool": [[{"node": "AI Agent", "type": "ai_tool", "index": 0}]]
  },
  "Qdrant": {
    "ai_vectorStore": [[{"node": "Retriever", "type": "ai_vectorStore", "index": 0}]]
  },
  "Embeddings": {
    "ai_embedding": [[{"node": "Qdrant", "type": "ai_embedding", "index": 0}]]
  }
}
```

---

## Workflow JSON Structure

```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "pinData": {},
  "settings": {"executionOrder": "v1"},
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "updatedAt": "2026-02-09T00:00:00.000Z",
  "versionId": "1"
}
```

---

## Best Practices

### ✅ DO
- Access webhook data via `$json.body.field`
- Use `={{ }}` for all expressions
- Match exact node names in references
- Generate unique UUIDs for node IDs
- Set proper typeVersion for each node
- Use `ai_` connection types for AI nodes

### ❌ DON'T
- Access webhook data at root (`$json.field`)
- Use expressions in Code nodes (use JS variables)
- Use `{{}}` without `=` prefix
- Leave node IDs as placeholders
- Mix up main vs ai_* connection types

---

## Debug Tips

1. **Expression errors**: Check webhook data structure
2. **Node not found**: Verify exact node name spelling
3. **AI Agent not responding**: Check ai_languageModel connection
4. **Memory not working**: Verify sessionId expression
5. **Vector search fails**: Check ai_embedding → ai_vectorStore chain

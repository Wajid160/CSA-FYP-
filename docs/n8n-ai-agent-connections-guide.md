# N8N AI Agent Node Connections - Complete Guide

## 📚 Table of Contents
1. [Understanding AI Agent Architecture](#understanding-ai-agent-architecture)
2. [Connection Types Explained](#connection-types-explained)
3. [Connection Direction (Critical!)](#connection-direction-critical)
4. [Visual Connection Map](#visual-connection-map)
5. [JSON Structure Breakdown](#json-structure-breakdown)
6. [Step-by-Step Connection Guide](#step-by-step-connection-guide)
7. [Common Mistakes & Fixes](#common-mistakes--fixes)
8. [Complete Working Example](#complete-working-example)

---

## 1. Understanding AI Agent Architecture

### What is an AI Agent Node?

The **AI Agent** node (`@n8n/n8n-nodes-langchain.agent`) is a **central orchestrator** that:
- 🧠 Uses an LLM (Large Language Model) for reasoning
- 💾 Maintains conversation memory
- 🔧 Can use external tools to gather information
- 🤖 Makes autonomous decisions about when to use tools

### The Agent Ecosystem

An AI Agent doesn't work alone. It needs **sub-nodes** that provide:
1. **Language Model** - The "brain" (e.g., Gemini, GPT-4)
2. **Memory** - Conversation history storage
3. **Tools** - Functions the agent can call (e.g., vector search, API calls)

```
        Sub-Nodes                     AI Agent (Hub)
    
    [Language Model] ─────────────►  ┌─────────────┐
                                     │             │
    [Memory]         ─────────────►  │  AI Agent   │  ────► Main Output
                                     │             │
    [Tool 1]         ─────────────►  │ (Orchestr.) │
    [Tool 2]         ─────────────►  │             │
                                     └─────────────┘
```

---

## 2. Connection Types Explained

N8N uses **special connection types** for AI nodes. These are **different from regular data flow** connections.

### 2.1 Regular Connection
- **Type**: `main`
- **Appearance**: Solid black line
- **Direction**: Left to right (data flow)
- **Example**: Webhook → AI Agent

### 2.2 AI-Specific Connections

| Connection Type | Purpose | Sub-Node Example | Required? |
|----------------|---------|------------------|-----------|
| `ai_languageModel` | Provides the LLM | Google Gemini Chat Model | ✅ Yes |
| `ai_memory` | Stores conversation history | Window Buffer Memory | ⚠️ Optional |
| `ai_tool` | External function/API | Vector Store Retriever | ⚠️ Optional |
| `ai_vectorStore` | Vector database | Qdrant Vector Store | Only if using retriever |
| `ai_embedding` | Embedding model | Embeddings Google Gemini | Only if using vector store |

**Visual Appearance**: Purple/blue dashed lines in N8N UI

---

## 3. Connection Direction (Critical!)

### ⚠️ THIS IS THE MOST IMPORTANT CONCEPT ⚠️

**In N8N AI connections, the connection ALWAYS goes FROM the sub-node TO the AI Agent.**

### Visual Representation:

```
CORRECT ✅:
[Google Gemini]  ──ai_languageModel──►  [AI Agent]

WRONG ❌:
[AI Agent]  ──ai_languageModel──►  [Google Gemini]
```

### JSON Representation:

**✅ CORRECT:**
```json
{
  "connections": {
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**❌ WRONG:**
```json
{
  "connections": {
    "AI Agent": {
      "ai_languageModel": [
        [
          {
            "node": "Google Gemini Chat Model",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### Why This Direction?

Think of it as **"Who provides what to whom"**:
- The **Chat Model provides** language capabilities **to the AI Agent**
- The **Memory provides** context **to the AI Agent**
- The **Tool provides** functionality **to the AI Agent**

So connections always point **TO** the AI Agent.

---

## 4. Visual Connection Map

### Complete FAQ Agent Connection Diagram:

```
┌──────────────────────────────────────────────────────────────┐
│                     N8N Canvas View                          │
└──────────────────────────────────────────────────────────────┘

[Webhook]  ──(main, black)──►  [AI Agent]  ──(main, black)──►  [Format Response]
        
                                    ▲
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        │ (ai_languageModel)        │ (ai_memory)              │ (ai_tool)
        │ purple dashed             │ purple dashed            │ purple dashed
        │                           │                           │
   [Gemini Chat]            [Window Buffer]           [Vector Retriever]
                                                              ▲
                                                              │
                                                              │ (ai_vectorStore)
                                                              │ purple dashed
                                                              │
                                                      [Qdrant Vector Store]
                                                              ▲
                                                              │
                                                              │ (ai_embedding)
                                                              │ purple dashed
                                                              │
                                                   [Embeddings Gemini]
```

### Connection Summary:

1. **Gemini Chat Model** → `ai_languageModel` → **AI Agent**
2. **Window Buffer Memory** → `ai_memory` → **AI Agent**
3. **Vector Store Retriever** → `ai_tool` → **AI Agent**
4. **Qdrant Vector Store** → `ai_vectorStore` → **Vector Store Retriever**
5. **Embeddings Gemini** → `ai_embedding` → **Qdrant Vector Store**

---

## 5. JSON Structure Breakdown

### 5.1 Node Definition

Each node has this structure:

```json
{
  "parameters": { /* node-specific config */ },
  "id": "unique-uuid",
  "name": "Display Name",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 1.7,
  "position": [x, y]
}
```

### 5.2 Connection Structure

Connections are defined in the `connections` object at the root level:

```json
{
  "name": "My Workflow",
  "nodes": [ /* array of nodes */ ],
  "connections": {
    "Source Node Name": {
      "connection_type": [
        [
          {
            "node": "Target Node Name",
            "type": "connection_type",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### 5.3 Complete AI Agent Connection Block

```json
{
  "connections": {
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    },
    "Window Buffer Memory": {
      "ai_memory": [
        [
          {
            "node": "AI Agent",
            "type": "ai_memory",
            "index": 0
          }
        ]
      ]
    },
    "Vector Store Retriever": {
      "ai_tool": [
        [
          {
            "node": "AI Agent",
            "type": "ai_tool",
            "index": 0
          }
        ]
      ]
    },
    "Qdrant Vector Store": {
      "ai_vectorStore": [
        [
          {
            "node": "Vector Store Retriever",
            "type": "ai_vectorStore",
            "index": 0
          }
        ]
      ]
    },
    "Embeddings Google Gemini": {
      "ai_embedding": [
        [
          {
            "node": "Qdrant Vector Store",
            "type": "ai_embedding",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

## 6. Step-by-Step Connection Guide

### Scenario: Connecting Google Gemini Chat Model to AI Agent

#### Step 1: Create Both Nodes

**AI Agent Node:**
```json
{
  "id": "agent-123",
  "name": "AI Agent",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "parameters": {
    "agent": "conversationalAgent",
    "promptType": "define",
    "text": "={{ $json.question }}"
  }
}
```

**Google Gemini Chat Model Node:**
```json
{
  "id": "gemini-456",
  "name": "Google Gemini Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "parameters": {
    "model": "models/gemini-1.5-flash",
    "options": {
      "temperature": 0.3
    }
  }
}
```

#### Step 2: Define Connection

**Connection goes FROM Gemini TO AI Agent:**

```json
{
  "connections": {
    "Google Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "AI Agent",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

#### Step 3: Verify Structure

**Key points to check:**
- ✅ Source node name matches exactly: `"Google Gemini Chat Model"`
- ✅ Connection type is: `"ai_languageModel"`
- ✅ Target node name matches exactly: `"AI Agent"`
- ✅ Type inside the connection object also states: `"ai_languageModel"`
- ✅ Index is `0` (first connection of this type)

---

## 7. Common Mistakes & Fixes

### Mistake 1: Wrong Connection Direction

**❌ WRONG:**
```json
"AI Agent": {
  "ai_tool": [[{"node": "Vector Store Retriever"}]]
}
```

**✅ CORRECT:**
```json
"Vector Store Retriever": {
  "ai_tool": [[{"node": "AI Agent"}]]
}
```

**Why it's wrong**: AI connections represent "provides to", not "receives from"

---

### Mistake 2: Using `main` Instead of AI Connection Type

**❌ WRONG:**
```json
"Google Gemini Chat Model": {
  "main": [[{"node": "AI Agent"}]]
}
```

**✅ CORRECT:**
```json
"Google Gemini Chat Model": {
  "ai_languageModel": [[{"node": "AI Agent"}]]
}
```

**Why it's wrong**: `main` is for data flow, not AI component connections

---

### Mistake 3: Missing Second `type` Field

**❌ WRONG:**
```json
"Google Gemini Chat Model": {
  "ai_languageModel": [
    [
      {
        "node": "AI Agent",
        "index": 0
      }
    ]
  ]
}
```

**✅ CORRECT:**
```json
"Google Gemini Chat Model": {
  "ai_languageModel": [
    [
      {
        "node": "AI Agent",
        "type": "ai_languageModel",  // ← This is required!
        "index": 0
      }
    ]
  ]
}
```

**Why it's wrong**: The `type` field inside the connection object is mandatory

---

### Mistake 4: Node Name Mismatch

**❌ WRONG:**
```json
// Node defined as:
{"name": "Google Gemini Chat Model"}

// But connection uses:
"Gemini Chat Model": {
  "ai_languageModel": [[{"node": "AI Agent"}]]
}
```

**✅ CORRECT:**
```json
// Node defined as:
{"name": "Google Gemini Chat Model"}

// Connection uses exact same name:
"Google Gemini Chat Model": {
  "ai_languageModel": [[{"node": "AI Agent"}]]
}
```

**Why it's wrong**: Node names must match **exactly** including spaces and capitalization

---

### Mistake 5: Connecting Vector Store Directly to AI Agent

**❌ WRONG:**
```json
"Qdrant Vector Store": {
  "ai_tool": [[{"node": "AI Agent"}]]
}
```

**✅ CORRECT:**
```json
// Qdrant connects to Retriever
"Qdrant Vector Store": {
  "ai_vectorStore": [[{"node": "Vector Store Retriever"}]]
},
// Retriever connects to AI Agent
"Vector Store Retriever": {
  "ai_tool": [[{"node": "AI Agent"}]]
}
```

**Why it's wrong**: AI Agent uses **Retriever** as a tool, not the vector store directly

---

## 8. Complete Working Example

### Full FAQ Agent JSON Structure

```json
{
  "name": "FAQ Agent - RAG with Gemini",
  "nodes": [
    {
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {"httpMethod": "POST", "path": "faq"},
      "position": [240, 300]
    },
    {
      "id": "agent-1",
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "parameters": {
        "agent": "conversationalAgent",
        "text": "={{ $json.question }}"
      },
      "position": [460, 300]
    },
    {
      "id": "gemini-chat-1",
      "name": "Google Gemini Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
      "parameters": {"model": "models/gemini-1.5-flash"},
      "position": [680, 140]
    },
    {
      "id": "memory-1",
      "name": "Window Buffer Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      "parameters": {"contextWindowLength": 5},
      "position": [680, 220]
    },
    {
      "id": "retriever-1",
      "name": "Vector Store Retriever",
      "type": "@n8n/n8n-nodes-langchain.retrieverVectorStore",
      "parameters": {"topK": 3, "description": "Search FAQ database"},
      "position": [680, 380]
    },
    {
      "id": "qdrant-1",
      "name": "Qdrant Vector Store",
      "type": "@n8n/n8n-nodes-langchain.vectorStoreQdrant",
      "parameters": {"qdrantCollection": "faqs", "mode": "retrieve"},
      "position": [900, 300]
    },
    {
      "id": "embeddings-1",
      "name": "Embeddings Google Gemini",
      "type": "@n8n/n8n-nodes-langchain.embeddingsGoogleGemini",
      "parameters": {"model": "text-embedding-004"},
      "position": [900, 460]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "AI Agent", "type": "main", "index": 0}]]
    },
    "Google Gemini Chat Model": {
      "ai_languageModel": [[{"node": "AI Agent", "type": "ai_languageModel", "index": 0}]]
    },
    "Window Buffer Memory": {
      "ai_memory": [[{"node": "AI Agent", "type": "ai_memory", "index": 0}]]
    },
    "Vector Store Retriever": {
      "ai_tool": [[{"node": "AI Agent", "type": "ai_tool", "index": 0}]]
    },
    "Qdrant Vector Store": {
      "ai_vectorStore": [[{"node": "Vector Store Retriever", "type": "ai_vectorStore", "index": 0}]]
    },
    "Embeddings Google Gemini": {
      "ai_embedding": [[{"node": "Qdrant Vector Store", "type": "ai_embedding", "index": 0}]]
    }
  }
}
```

---

## 📋 Quick Reference Checklist

When creating AI Agent connections:

- [ ] Chat Model → `ai_languageModel` → AI Agent
- [ ] Memory → `ai_memory` → AI Agent (optional)
- [ ] Tool → `ai_tool` → AI Agent (optional, can have multiple)
- [ ] Vector Store → `ai_vectorStore` → Retriever (if using RAG)
- [ ] Embeddings → `ai_embedding` → Vector Store (if using RAG)
- [ ] All node names match exactly (case-sensitive)
- [ ] Both `type` fields are present in connection objects
- [ ] Connections go FROM sub-node TO AI Agent/parent
- [ ] Index is 0 for first connection (increment for multiple tools)

---

## 🎯 Connection Flow for Different Agent Types

### 1. Simple Chat Agent (Minimum)

```
[Chat Model] ──ai_languageModel──► [AI Agent]
```

Minimum requirement: Just a language model.

### 2. Conversational Agent (With Memory)

```
[Chat Model] ──ai_languageModel──► [AI Agent]
[Memory]     ──ai_memory─────────► [AI Agent]
```

Remembers conversation history.

### 3. RAG Agent (With Tool)

```
[Chat Model]  ──ai_languageModel──► [AI Agent]
[Retriever]   ──ai_tool───────────► [AI Agent]
  ↑
  └── [Vector Store] ──ai_vectorStore──
         ↑
         └── [Embeddings] ──ai_embedding──
```

Can search knowledge base.

### 4. Full Featured Agent (Everything)

```
[Chat Model]  ──ai_languageModel──► [AI Agent]
[Memory]      ──ai_memory─────────► [AI Agent]
[Tool 1]      ──ai_tool───────────► [AI Agent]
[Tool 2]      ──ai_tool───────────► [AI Agent]
  ↑
  └── [Vector Store] ──ai_vectorStore──
         ↑
         └── [Embeddings] ──ai_embedding──
```

Conversational + Multiple tools.

---

## 💡 Pro Tips

### Tip 1: Multiple Tools
You can connect multiple tools to one AI Agent:

```json
"Vector Store Retriever": {
  "ai_tool": [[{"node": "AI Agent", "type": "ai_tool", "index": 0}]]
},
"Shopify API Tool": {
  "ai_tool": [[{"node": "AI Agent", "type": "ai_tool", "index": 1}]]
},
"Calculator Tool": {
  "ai_tool": [[{"node": "AI Agent", "type": "ai_tool", "index": 2}]]
}
```

The AI Agent will decide which tool to use based on the question.

### Tip 2: Debugging Connections
If your workflow doesn't work after import:
1. Open N8N workflow editor
2. Click on AI Agent node
3. Look at the LEFT side for connection circles
4. If empty, connections didn't import - rebuild manually
5. If present, verify each connection by clicking nodes

### Tip 3: Export to Verify
After manually building, export your workflow and compare the JSON to see the correct structure for future reference.

---

## 📞 Summary

**Remember the Golden Rule**:
> AI connections always go **FROM the provider TO the consumer**

**Connection Hierarchy**:
```
Embeddings  →  Vector Store  →  Retriever  →  AI Agent
             ↖                              ↗
               Memory  →  ─────────────────
             ↗
Chat Model  →
```

**All arrows point toward the AI Agent** (directly or indirectly).

---

**Created**: February 3, 2026  
**For**: N8N AI Agent Workflow Development  
**Status**: Complete Reference Guide ✅

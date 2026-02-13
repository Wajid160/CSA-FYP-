# Autonomous AI Customer Support Agent (CSA) for E-commerce

> **Final Year Project (FYP) | 2026**
> An intelligent, autonomous agent that transforms customer support for clothing brands using Multi-Agent Architecture and Retrieval-Augmented Generation (RAG).

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-N8N%20%7C%20Gemini%20%7C%20Supabase%20%7C%20Qdrant-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Project Overview

This project is a fully autonomous AI agent designed to handle end-to-end customer support for e-commerce platforms (specifically Shopify). Unlike traditional rule-based chatbots, this agent "thinks" and takes actions. It can search for products with semantic understanding, check real-time inventory, manage orders, process returns, and answer policy questions using your specific business knowledge.

### ✨ Key Capabilities

- **🧠 Intelligent Reasoning**: Uses **Google Gemini 3 Flash** to understand complex user intent and context.
- **🛍️ Semantic Product Search**: Finds "red summer dress under $50" using **Qdrant** vector search, not just keyword matching.
- **📦 Autonomous Order Management**: Can look up orders, check status, and even process refunds autonomously (under a set dollar threshold).
- **📚 RAG Knowledge Base**: Instantly answers FAQs about shipping, returns, and sizing by retrieving relevant policy documents.
- **💬 Human-Like Conversation**: Maintains long-term memory of customer interactions using **PostgreSQL** and **Redis** strategies.
- **🔌 Shopify Integration**: Deep integration with Shopify API for real-time data on products, customers, and orders.

---

## 🏗️ System Architecture

The project now uses a **Single Unified Workflow** in N8N that handles all agent capabilities (Orchestration, Product Search, Order Status, FAQs, Returns) in one robust pipeline.

![N8N Workflow Diagram](n8n-workflows/workflow-diagram.png)

---

## 🛠️ Technology Stack

| Component | Technology | Role |
|-----------|------------|------|
| **LLM** | **Google Gemini 3 Flash** | Core reasoning & response generation |
| **Orchestration** | **N8N** | Workflow automation & agent routing |
| **Vector DB** | **Qdrant Cloud** | Storing product & FAQ embeddings for RAG |
| **Database** | **Supabase (PostgreSQL)** | Conversation history & customer data |
| **Embedding** | **Google text-embedding-004** | Generating vector embeddings |
| **E-commerce** | **Shopify** | Product catalog & order management platform |
| **Frontend** | **HTML/JS/CSS** | Embedding chat widget for Shopify storefront |

---

## 📂 Repository Structure

```
My FYP (CSA)/
├── .agent/                 # Agent skills & context
├── chat-widget/            # Frontend chat widget (Vanilla JS/CSS)
│   ├── index.html          # Local testing file
│   ├── widget.js           # Widget logic
│   └── widget.css          # Widget styling
├── database/               # Database management
│   ├── migrations/         # Supabase SQL schemas
│   └── scripts/            # Node.js scripts for seeding & syncing
├── docs/                   # Detailed documentation
│   ├── architecture.md     # System architecture deep-dive
│   ├── database-schema.md  # SQL schema reference
│   └── setup-guide.md      # Full setup walkthrough
├── n8n-workflows/          # N8N Workflows
│   ├── main-workflow.json  # ✅ MAIN WORKFLOW (Import this)
│   └── workflow-diagram.png
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- N8N (Self-hosted or Cloud)
- Supabase Account
- Qdrant Cloud Account
- Google AI Studio API Key (Gemini)

### 1. Clone & Setup
```bash
git clone https://github.com/Wajid160/CSA-FYP-.git
cd "CSA-FYP-"
npm install
```

### 2. Configure Environment
Rename `.env.example` to `.env` and add your API keys:
```bash
cp .env.example .env
# Edit .env with your credentials for Supabase, Qdrant, Gemini, etc.
```

### 3. Database Setup
Run the SQL migrations in your Supabase SQL editor from `database/migrations/001_initial_schema.sql`.

### 4. Seed Knowledge Base
```bash
# detailed instructions in docs/setup-guide.md
npm run setup:qdrant   # Create vector collections
npm run setup:faqs     # Upload FAQ embeddings
npm run sync:products  # Sync Shopify products to Qdrant
```

### 5. Import N8N Workflows
Import `n8n-workflows/main-workflow.json` into your N8N instance. This single file contains the entire agent logic. Configure credentials as described in `docs/setup-guide.md`.

---

## 🧪 Testing

You can test the system locally using the chat widget:
1. Open `chat-widget/index.html` in your browser.
2. Ensure your N8N webhook URL is updated in `chat-widget/widget.js`.
3. Start chatting!

**Example queries:**
- *"Do you have any red hoodies?"* (Product Search)
- *"Where is my order #1001?"* (Order Status)
- *"What is your return policy?"* (RAG FAQ)

---

## 📄 Documentation

- [**Setup Guide**](docs/setup-guide.md): Step-by-step installation instructions.
- [**Architecture**](docs/architecture.md): Technical deep-dive.
- [**Database Schema**](docs/database-schema.md): ERD and table definitions.

---

## 👨‍💻 Authors

**Wajid Javed** & **Naveed Soomro**  
*University of Sindh, Jamshoro*  
Computer Science Final Year Project (FYP)  
*Building the future of autonomous e-commerce support.*

---
*License: MIT*

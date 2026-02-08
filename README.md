# Customer Support Agent - FYP Project

> **An autonomous AI agent for clothing e-commerce customer support**  
> Final Year Project | Started: February 2, 2026

## 🎯 Project Vision

Build a **living autonomous AI agent** that handles all customer support tasks for a clothing web store with full access and capabilities - not just a traditional chatbot.

## ✨ Key Features

- 🤖 **Autonomous Decision Making** (up to $100 threshold)
- 🔍 **Intelligent Product Search** with semantic understanding
- 📦 **Order Management** (tracking, modifications, cancellations)
- 💰 **Returns & Refunds** processing
- 🌍 **Multilingual Support** (English, Urdu, auto-detect)
- 🧠 **Conversation Memory** with context awareness
- 🎨 **Style Recommendations** based on preferences
- 📧 **Proactive Engagement** (abandoned carts, follow-ups)
- 🎤 **Voice Support** (future phase)

## 🛠️ Tech Stack

| Component | Technology | Free Tier |
|-----------|-----------|-----------|
| **LLM** | Gemini 3 Flash | ✅ |
| **Backend** | N8N Multi-Agent | ✅ (self-hosted) |
| **Database** | PostgreSQL (Supabase) | ✅ 10GB |
| **Vector DB** | Qdrant Cloud | ✅ 1M vectors |
| **E-commerce** | Shopify Custom App | ✅ Partner |
| **Chat UI** | React + Shopify Bridge | - |
| **Admin** | Next.js | - |
| **Embeddings** | Google Embedding API | ✅ 20K/min |

## 📁 Project Structure

```
My FYP (CSA)/
├── .agent/                 # Project documentation & skills
│   ├── README.md          # Project overview
│   └── skills/
│       └── csa_context/   # Master context skill
├── n8n-workflows/         # N8N agent workflows
├── shopify-app/           # Shopify custom app
├── chat-widget/           # React chat interface
├── admin-dashboard/       # Next.js admin panel
├── database/              # Schemas and migrations
│   ├── schemas/
│   └── migrations/
├── docs/                  # Documentation
├── tests/                 # Test scenarios
├── .env.example          # Environment template
└── README.md             # This file
```

## 🚀 Development Phases

### Phase 1: MVP - Read-Only Agent (1 week) 🔄
- [x] Project setup and research
- [ ] Product search & recommendations
- [ ] FAQ answering (RAG)
- [ ] Order status lookup
- [ ] Inventory checking

### Phase 2: Autonomous Actions
- [ ] Auto-approve returns (<$100)
- [ ] Send discount codes
- [ ] Modify orders
- [ ] Process refunds

### Phase 3: Proactive Features
- [ ] Abandoned cart recovery
- [ ] Post-purchase follow-ups
- [ ] Personalized recommendations

### Phase 4: Voice Capabilities
- [ ] Speech-to-Text integration
- [ ] Text-to-Speech responses
- [ ] Live voice chat

### Phase 5: Admin Dashboard
- [ ] Real-time monitoring
- [ ] Analytics & metrics
- [ ] Human takeover
- [ ] Agent training

## 🏗️ Architecture

### Multi-Agent System
```
Main Orchestrator Agent
├── Product Search Agent (semantic search + filtering)
├── Order Management Agent (CRUD operations)
├── Returns/Refunds Agent (autonomous <$100)
└── Style Recommendation Agent (personalization)
```

### Memory Strategy
- **PostgreSQL**: Long-term conversation history
- **Redis**: Real-time session context
- **Qdrant**: RAG knowledge base (products, FAQs, policies)

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (via Supabase)
- N8N instance (self-hosted or cloud)
- Shopify Partner account
- Google AI API access

### Installation

1. **Clone and setup**
   ```bash
   cd "C:\Users\wajid\Desktop\My FYP (CSA)"
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Set up Supabase**
   - Create project at supabase.com
   - Copy connection details to `.env`
   - Run database migrations

3. **Set up Qdrant**
   - Create cluster at qdrant.tech
   - Copy API key and URL to `.env`

4. **Configure Shopify**
   - Join Shopify Partner Program
   - Create/modify custom app
   - Set up OAuth scopes

5. **Set up N8N**
   - Install N8N (self-hosted or cloud trial)
   - Import workflows from `n8n-workflows/`
   - Configure Gemini credentials

### Running the Project

```bash
# Start N8N
n8n start

# Start chat widget (development)
cd chat-widget
npm install
npm run dev

# Start admin dashboard
cd admin-dashboard
npm install
npm run dev
```

## 📊 Key Metrics

- **Auto-Resolution Rate**: Target 80%+
- **Response Time**: < 2 seconds
- **Customer Satisfaction**: Thumbs up/down feedback
- **Escalation Rate**: Monitor human intervention needs

## 🧪 Testing

50+ comprehensive test scenarios covering:
- Product search accuracy
- Order management flows
- Return/refund processing
- Multilingual conversations
- Edge cases and error handling

```bash
# Run tests
cd tests
npm test
```

## 📚 Documentation

- [Architecture Guide](docs/architecture.md) *(TBD)*
- [API Reference](docs/api-reference.md) *(TBD)*
- [Database Schema](docs/database-schema.md) *(TBD)*
- [N8N Workflows](docs/n8n-workflows.md) *(TBD)*
- [Deployment Guide](docs/deployment.md) *(TBD)*

## 🎓 Academic Deliverables

- ✅ **Code**: GitHub repository
- ✅ **Documentation**: Complete technical docs
- ✅ **Demo**: Live demonstration
- ✅ **Presentation**: Project presentation
- ✅ **Report**: FYP final report

## 🔐 Free Tier Limits

| Service | Limit | Usage Strategy |
|---------|-------|----------------|
| Gemini 3 | *TBD* | Optimize prompts |
| Supabase | 10GB storage | Efficient schemas |
| Qdrant | 1M vectors | Selective embedding |
| Shopify | Unlimited dev stores | Development only |
| ElevenLabs | 10K chars/month | Phase 4 only |

## 🤝 Contributing

This is an academic FYP project. Feedback and suggestions welcome!

## 📄 License

MIT License (for academic purposes)

## 👨‍💻 Author

**Wajid** - Final Year Project  
Computer Science Student  
*Building autonomous AI agents for e-commerce*

---

**Last Updated**: February 2, 2026  
**Status**: Phase 1 - Initial Setup & Research  
**Next Milestone**: Complete N8N workflow setup

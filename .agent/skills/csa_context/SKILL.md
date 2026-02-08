---
name: Customer Support Agent Project Context
description: Master knowledge base for the FYP Customer Support Agent project
version: 1.0
created: 2026-02-02
---

# Customer Support Agent (CSA) - Project Context Skill

This skill maintains comprehensive context and knowledge about the Customer Support Agent FYP project.

## Quick Reference

### Project Type
- **FYP (Final Year Project)** - Academic requirement
- **Focus**: Autonomous AI Agent for clothing e-commerce customer support
- **Key Principle**: Living agent with full access, not a traditional chatbot

### Tech Stack (Confirmed)

#### AI & Backend
- **LLM**: `gemini-3-flash` (Google Gemini 3 Flash)
  - Released: December 2025
  - Performance: 15% improvement over Gemini 2.5 Flash
  - Features: Agentic capabilities, multimodal, low latency
  - Available via: Google AI Studio, Vertex AI
  
- **Orchestration**: N8N (multi-agent workflows)
  - Architecture: Multiple specialized workflows
  - Features: PostgreSQL Chat Memory, Redis Chat Memory, HITL support
  
- **Database**: PostgreSQL (via Supabase)
  - Free tier: 10GB storage, 500MB database
  - Extensions: pgvector for embeddings
  
- **Vector DB**: Qdrant Cloud
  - Free tier: 1M vectors, 1GB cluster
  - Forever free, no credit card required
  
- **Embeddings**: Google Embedding API (text-embedding-004)
  - Free tier: 20,000 tokens/min

#### Frontend & E-commerce
- **Platform**: Shopify Custom App (via Partner Account)
  - Type: Private/Custom App
  - Setup: Shopify CLI or Dev Dashboard (post-Jan 2026 requirement)
  - Existing App: User has app from 2025 (assess viability)
  
- **Chat Widget**: React + Shopify App Bridge
  - Placement: Floating widget on all pages + dedicated support page
  
- **Admin Dashboard**: Next.js (decided by agent)
  - Features: TBD based on Phase 5 requirements

#### Voice (Future)
- **STT**: Google Speech-to-Text (60 min/month free)
- **TTS**: Web Speech API (browser native) → ElevenLabs (10K chars/month)

## Project Architecture

### Multi-Agent System
```
Main Orchestrator Agent
├── Product Search Agent
├── Order Management Agent
├── Returns/Refunds Agent
└── Style Recommendation Agent
```

### Memory Strategy
- **PostgreSQL Chat Memory**: Long-term conversation history
- **Redis Chat Memory**: Real-time session context
- **Vector DB (Qdrant)**: RAG knowledge base

### RAG Knowledge Base
1. Product catalog (titles, descriptions, materials, sizes)
2. Store policies (return, shipping, payment)
3. FAQ knowledge base
4. Past successful conversation resolutions

### Authentication Flow
**Hybrid Approach**:
- Anonymous users: FAQ and general product browsing
- Authenticated users: Order details, personalized recommendations

## Development Phases

### Phase 1: MVP - Read-Only Agent (1 week)
**Capabilities**:
- Product search & recommendations
- FAQ answering (RAG-based)
- Order status lookup
- Inventory checking
- Multilingual support (English primary, auto-detect Urdu)

**Deliverables**:
- N8N workflows (orchestrator + 4 specialist agents)
- React chat widget embedded in Shopify
- PostgreSQL schema + Qdrant collections
- 50+ test scenarios

### Phase 2: Autonomous Actions
**Capabilities**:
- Auto-approve returns under **$100**
- Send discount codes for complaints
- Modify orders (size changes, cancellations)
- Process refunds

**Escalation Rules**:
- Amount > $100 → Human approval required
- Agent unable to resolve → Create support ticket
- Low customer sentiment → Human takeover

### Phase 3: Proactive Features
**Capabilities**:
- Abandoned cart recovery
- Post-purchase follow-up
- Personalized style recommendations based on browsing history

**Tracking Method**: (Agent to decide - Shopify webhooks/analytics)

### Phase 4: Voice Capabilities
**Implementation**: (TBD - deferred decision)
- Web-based voice chat
- Speech-to-Text → Agent → Text-to-Speech

### Phase 5: Advanced Features
**Admin Dashboard**:
- Real-time conversation monitoring
- Analytics & metrics
- Human takeover capability
- Agent training/feedback system

**Note**: Live takeover feature only if not significant additional effort

## Key Decisions Made

### Free Tier Strategy
- ✅ All services must have free tier or free quota
- ✅ Supabase for PostgreSQL
- ✅ Qdrant Cloud for vectors
- ✅ Shopify Partner for dev stores
- ✅ Google APIs for AI (Gemini + Embeddings)

### Autonomous Decision Thresholds
- **Financial**: $100 (returns, refunds, discounts)
- **Escalation**: Amount exceeded, agent stuck, sentiment low

### Testing Requirements
- **50+ test scenarios** for comprehensive validation
- **Focus**: What matters for FYP demonstration

### Timeline
- **Phase 1 Target**: 1 week
- **Overall**: User manages deadline independently

## Academic Deliverables
1. **Documentation**: Architecture, API, database schemas, workflows
2. **Code**: GitHub repository with all source code
3. **Presentation**: Demo and project presentation
4. **Demo**: Live demonstration with test scenarios

## Important Notes

### Shopify App (2025 Creation)
- User has existing app created in 2025
- **Action Required**: Assess if it can be modified for this project
- **Fallback**: Create new app via Shopify CLI if needed
- **Context**: Post-Jan 1, 2026 - custom apps require CLI/Dev Dashboard

### Admin Dashboard Decision
- **Simple Implementation**: Include in Phase 1/2
- **Complex Implementation**: Defer to Phase 5
- **Live Takeover**: Only if not significant extra effort

### Voice Integration
- **Deferred**: User will decide implementation details later
- **Strategy**: Start with basic web speech, upgrade to ElevenLabs if needed

### Learning/Training System
- **FYP Focus**: Implement what demonstrates agent capabilities
- **Avoid**: Over-engineering features that don't showcase core functionality

## Project Files & Structure

### Directory Layout
```
My FYP (CSA)/
├── .agent/
│   ├── README.md (project overview)
│   └── skills/
│       └── csa_context.md (this file)
├── n8n-workflows/
├── shopify-app/
├── chat-widget/
├── admin-dashboard/
├── database/
│   ├── schemas/
│   └── migrations/
├── docs/
└── tests/
```

### Key Documentation Files
- `.agent/README.md`: High-level project overview
- `task.md`: Master task checklist (artifact)
- `implementation_plan.md`: Detailed technical plan (to be created)

## Next Steps (After Initial Research)

1. ✅ Verify Gemini 3 Flash specifications
2. Create detailed implementation plan
3. Set up all required accounts
4. Design database schemas
5. Create N8N workflow diagrams
6. Begin Phase 1 development

## Reference Links

### Official Documentation
- Gemini API: https://ai.google.dev/
- N8N Docs: https://docs.n8n.io/
- Shopify Dev: https://shopify.dev/
- Supabase: https://supabase.com/docs
- Qdrant: https://qdrant.tech/documentation/

### Free Tier Resources
- Shopify Partner: Free unlimited dev stores
- Supabase: 10GB storage, 500MB DB
- Qdrant Cloud: 1M vectors forever free
- Google Gemini 3: (to be confirmed after research)
- Google Embeddings: 20K tokens/min

---

**Last Updated**: February 2, 2026  
**Project Status**: Initial Research & Planning Phase

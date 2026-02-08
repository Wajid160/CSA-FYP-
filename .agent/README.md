# Customer Support Agent (CSA) - FYP Project

## Project Overview
**Title**: Customer Support Agent for Clothing Web Store  
**Type**: Final Year Project (FYP)  
**Date Started**: February 2, 2026

## Project Vision
Build a **living autonomous AI agent** (not a traditional chatbot) that can handle all customer support tasks for a clothing e-commerce store with full access and capabilities.

## Core Principles
- ✅ Use **FREE** or free-tier services only
- ✅ Multi-phase development (start simple, add complexity)
- ✅ Focus on what matters for FYP demonstration
- ✅ Build a true autonomous agent, not just a chatbot

## Technology Stack

### AI & Backend
- **LLM**: Gemini 3 Flash (research in progress)
- **Backend Orchestration**: N8N (multi-agent system)
- **Database**: PostgreSQL (Supabase free tier)
- **Vector Database**: Qdrant Cloud (1M vectors free)
- **Embeddings**: Google Embedding API

### Frontend & Integration
- **E-commerce Platform**: Shopify (Custom App via Partner Account)
- **Chat Widget**: React + Shopify App Bridge
- **Admin Dashboard**: Next.js (to be decided)

### Voice (Future Phase)
- **STT**: Google Speech-to-Text
- **TTS**: Web Speech API → ElevenLabs later

## Project Phases

### Phase 1: MVP - Read-Only Agent (1 week)
- Product search & recommendations
- FAQ answering
- Order status lookup
- Inventory checking
- RAG implementation with vector DB

### Phase 2: Autonomous Actions
- Auto-approve returns under $100
- Send discount codes
- Modify orders (size changes)
- Process refunds

### Phase 3: Proactive Features
- Abandoned cart recovery
- Post-purchase follow-ups
- Personalized recommendations

### Phase 4: Voice Capabilities
- Text-to-Speech
- Speech-to-Text
- Live voice chat

### Phase 5: Advanced Features
- Admin dashboard with live takeover
- Analytics & metrics
- Multi-agent orchestration

## Key Features Confirmed

### Agent Capabilities
✅ Access and search Shopify product catalog  
✅ Check real-time inventory  
✅ Process returns/refunds autonomously (under $100)  
✅ Modify orders (change size, cancel, etc.)  
✅ Create support tickets for human escalation  
✅ Send emails/notifications  
✅ Proactive engagement (cart abandonment, follow-ups)  
✅ Multilingual support (English primary, auto-detect others like Urdu)

### User Experience
- Floating chat widget on all Shopify pages
- Dedicated support page
- Hybrid authentication (anonymous FAQs, login for personal data)
- Text chat first, voice later

### Agent Architecture
- Main Orchestrator Agent
- Specialist Sub-Agents:
  - Product Search Agent
  - Order Management Agent
  - Returns/Refunds Agent
  - Style Recommendation Agent

### Memory & Context
- PostgreSQL Chat Memory (long-term persistence)
- Redis Chat Memory (real-time sessions)
- Conversation history tracking
- Customer profiles and preferences

### RAG Knowledge Base
- Product catalog (titles, descriptions, materials, sizes)
- Store policies (return, shipping, payment)
- FAQ knowledge base
- Past successful conversation resolutions

### Escalation Rules
- Financial threshold: >$100 requires human approval
- Agent stuck/unable to resolve
- Customer sentiment below threshold

## Academic Deliverables
- ✅ Documentation
- ✅ Code (GitHub repository)
- ✅ Presentation
- ✅ Demo (50+ test scenarios)

## Free Tier Limits

### Gemini API
- To be confirmed after research

### Supabase (PostgreSQL)
- 10GB storage
- 500MB database
- 2 concurrent connections

### Qdrant Cloud
- 1M vectors
- 1GB cluster
- Forever free

### Shopify Partner
- Free developer account
- Unlimited test stores

### Google Embedding API
- 20,000 tokens/min free

### ElevenLabs (Future)
- 10,000 characters/month (~5-10 min audio)

## Project Status
🔄 **Current Phase**: Initial Setup & Research  
📅 **Last Updated**: February 2, 2026

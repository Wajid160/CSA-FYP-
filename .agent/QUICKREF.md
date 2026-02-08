# Project Quick Reference

**Last Updated**: February 2, 2026

## 🔑 Key Files

### Documentation
- [`README.md`](../README.md) - Project overview
- [`docs/architecture.md`](../docs/architecture.md) - System architecture
- [`docs/database-schema.md`](../docs/database-schema.md) - Database design
- [`docs/setup-guide.md`](../docs/setup-guide.md) - Setup instructions
- [`docs/gemini-3-flash-specs.md`](../docs/gemini-3-flash-specs.md) - AI model specs

### Planning
- [`task.md`](../../task.md) (Artifact) - Master checklist
- [`implementation_plan.md`](../../implementation_plan.md) (Artifact) - Phase 1 plan

### Code
- [`database/migrations/001_initial_schema.sql`](../database/migrations/001_initial_schema.sql) - SQL setup
- [`.env.example`](../.env.example) - Environment template

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd "C:\Users\wajid\Desktop\My FYP (CSA)"

# Copy environment template
cp .env.example .env
# Then edit .env with your credentials

# Start N8N
n8n start

# Chat widget (when ready)
cd chat-widget
npm install
npm run dev

# Admin dashboard (when ready)
cd admin-dashboard
npm install
npm run dev
```

---

## 📊 Project Status

**Current Phase**: Phase 1 - Initial Setup ✅  
**Next Phase**: Account Setup & N8N Workflows

**Progress**:
- [x] Research complete
- [x] Documentation complete
- [x] Project structure created
- [ ] Accounts setup
- [ ] Database migrated
- [ ] N8N workflows built
- [ ] Chat widget deployed

---

## 🔗 Important Links

### Development
- **N8N**: http://localhost:5678
- **Shopify Dev Store**: (to be set up)
- **Supabase Dashboard**: (to be set up)
- **Qdrant Dashboard**: (to be set up)

### Documentation
- [Google AI Studio](https://aistudio.google.com)
- [Shopify Partners](https://partners.shopify.com)
- [Supabase](https://supabase.com)
- [Qdrant Cloud](https://qdrant.tech)
- [N8N Docs](https://docs.n8n.io)

---

## 💡 Common Tasks

### Run Database Migration
1. Open Supabase SQL Editor
2. Paste contents of `database/migrations/001_initial_schema.sql`
3. Click "Run"

### Test Gemini API
```bash
node test-gemini.js
```

### Test Database Connection
```bash
node test-db.js
```

### Import N8N Workflow
1. Open N8N (http://localhost:5678)
2. Click "+" → "Import Workflow"
3. Select workflow JSON from `n8n-workflows/`

---

## 🎯 Phase 1 Goals

**Timeline**: 1 week

1. **Days 1-2**: Setup all accounts
2. **Days 3-4**: Build N8N workflows
3. **Day 5**: RAG implementation
4. **Day 6**: Chat widget
5. **Day 7**: Testing & demo prep

**Success Criteria**:
- 45/50 test scenarios pass
- Response time < 2 seconds
- Demo-ready

---

## 📞 Need Help?

1. Check [`docs/setup-guide.md`](../docs/setup-guide.md) for troubleshooting
2. Review [`docs/architecture.md`](../docs/architecture.md) for system design
3. Read skill context: [`.agent/skills/csa_context/SKILL.md`](skills/csa_context/SKILL.md)

---

**Project Type**: FYP (Final Year Project)  
**Focus**: Autonomous AI Customer Support Agent  
**Tech Stack**: N8N + Gemini 3 Flash + Shopify + PostgreSQL + Qdrant

# Next Steps Guide

**After completing account setup**, follow these steps in order:

---

## ✅ Step 1: Verify All Connections (5 min)

```bash
# Make sure you're in the project directory
cd "C:\Users\wajid\Desktop\My FYP (CSA)"

# Test all API connections
npm run test:gemini
npm run test:db
npm run test:qdrant
```

**Expected**: All three tests should pass ✅

**If any fail**: Double-check your `.env` file credentials

---

## ✅ Step 2: Initialize Git Repository (5 min)

```bash
# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial FYP project setup - Phase 1"

# Optional: Push to GitHub
# git remote add origin https://github.com/YOUR-USERNAME/csa-fyp.git
# git push -u origin main
```

---

## ✅ Step 3: Create Qdrant Collections (2 min)

```bash
# Create vector database collections
npm run setup:qdrant
```

**Expected**: See confirmation that `products` and `faqs` collections were created

---

## ✅ Step 4: Generate FAQ Embeddings (5 min)

```bash
# Generate and upload FAQ embeddings
npm run setup:faqs
```

**Expected**: See progress as each FAQ is embedded and uploaded to Qdrant

**Note**: This uses Google Embedding API. Rate limits are respected automatically.

---

## ✅ Step 5: Add Products to Shopify (30 min)

**Manual step**:
1. Log into your Shopify development store
2. Go to **Products** → **Add product**
3. Add at least 10 clothing items:
   - T-Shirts (multiple sizes/colors)
   - Jeans (sizes 28-36)
   - Dresses (S, M, L)
   - Hoodies
   - Accessories

**OR** Use sample products:
- Settings → Add sample products

**Important**: Make sure products have:
- Descriptive titles
- Detailed descriptions
- Multiple variants (sizes/colors)
- Images (if possible)
- Prices

---

## ✅ Step 6: Sync Products to Vector DB (5 min)

```bash
# Fetch products from Shopify and generate embeddings
npm run sync:products
```

**Expected**: See each product being embedded and uploaded

**Note**: The current script has mock data. You'll need to implement Shopify API calls after setting up the Shopify app.

---

## ✅ Step 7: Start N8N (2 min)

```bash
# Start N8N in a separate terminal
n8n start
```

**Then**:
1. Open browser: http://localhost:5678
2. Log in with your credentials
3. Verify N8N is running

---

## ✅ Step 8: Configure N8N Credentials (10 min)

In N8N interface:
1. Click **"Credentials"** (top menu)
2. Add **"Google Gemini"**:
   - Name: `Gemini_CSA`
   - API Key: (from `.env`)
3. Add **"Postgres"**:
   - Name: `Supabase_CSA`
   - Connection String: (from `.env`)
4. Add **"HTTP Header Auth"** (for Qdrant):
   - Name: `Qdrant_CSA`
   - Header Name: `api-key`
   - Header Value: (Qdrant API key from `.env`)

---

## ✅ Step 9: Build First N8N Workflow (2 hours)

### Start with FAQ Agent (simplest):

1. In N8N, click **"+ Add Workflow"**
2. Name it: `faq-agent`
3. Follow guide: `n8n-workflows/README-faq.md` (to be created next)

### Then build Orchestrator:

1. New workflow: `orchestrator-agent`
2. Follow: `n8n-workflows/README-orchestrator.md`

---

## ✅ Step 10: Test the Workflow (30 min)

### Test inputs for FAQ Agent:

```json
{
  "query": "What is your return policy?",
  "sessionId": "test-123"
}
```

**Expected**: Agent returns relevant FAQ answer

### Test inputs for Orchestrator:

```json
{
  "message": "Do you have blue t-shirts?",
  "sessionId": "test-123",
  "customerId": "12345",
  "isAuthenticated": true
}
```

**Expected**: Routes to product search agent and returns products

---

## 🎯 Success Criteria

You're ready for the next phase when:
- ✅ All API connections tested
- ✅ Git repository initialized
- ✅ Qdrant collections created
- ✅ FAQ embeddings uploaded
- ✅ Products synced to vector DB
- ✅ N8N running
- ✅ N8N credentials configured
- ✅ At least one workflow built and tested

---

## 📅 Recommended Timeline

| Step | Time | When |
|------|------|------|
| Verify connections | 5 min | Right after account setup |
| Git init | 5 min | Same time |
| Qdrant setup | 2 min | Same time |
| FAQ embeddings | 5 min | Same time |
| Add Shopify products | 30 min | Manual, can do later |
| Sync products | 5 min | After adding products |
| Start N8N | 2 min | When ready to build workflows |
| N8N credentials | 10 min | Same time |
| Build FAQ workflow | 1 hour | Next session |
| Build Orchestrator | 1 hour | Same session |
| Test workflows | 30 min | Same session |

**TOTAL**: ~4 hours (excluding Shopify product creation)

---

## 💡 Tips

1. **Keep N8N running** in a separate terminal while working
2. **Test incrementally** - don't wait until all workflows are built
3. **Use N8N's test feature** - click "Test workflow" button
4. **Check N8N execution logs** if something fails
5. **Save workflows frequently** in N8N

---

## 🆘 Common Issues

### Issue: `npm run setup:faqs` fails
**Solution**: Make sure Supabase migration was run and FAQs table is populated

### Issue: Qdrant returns 401 Unauthorized
**Solution**: Check `QDRANT_API_KEY` in `.env` is correct

### Issue: N8N can't connect to Gemini
**Solution**: Verify API key in N8N credentials matches `.env`

### Issue: Product sync fails
**Solution**: You need to implement Shopify API integration first (use mock data for now)

---

**Ready to continue?** Start with Step 1 after completing account setup! 🚀

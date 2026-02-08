# Account Setup Checklist

**Date**: February 2, 2026  
**Phase**: 1 - Infrastructure Setup (Days 1-2)

Follow this guide step-by-step to set up all required accounts.

---

## ✅ Account Setup Progress

### 1. Shopify Partner Account
- [ ] Create Partner account at [partners.shopify.com](https://partners.shopify.com)
- [ ] Verify email
- [ ] Create development store
- [ ] Store URL: `_____________________.myshopify.com`
- [ ] Add 10+ sample products (clothing items)

**Notes**:
- _______________________________________________________
- _______________________________________________________

---

### 2. Shopify Custom App
- [ ] Check if 2025 app can be used (verify scopes)
- [ ] OR create new app via Shopify CLI
- [ ] Configure scopes: `read_products,read_orders,write_orders,read_customers,write_customers`
- [ ] Get API credentials:
  - API Key: `_____________________________________`
  - API Secret: `_____________________________________`
  - Access Token: `_____________________________________`

**Notes**:
- _______________________________________________________
- _______________________________________________________

---

### 3. Google AI Studio (Gemini API)
- [ ] Go to [aistudio.google.com](https://aistudio.google.com)
- [ ] Sign in with Google account
- [ ] Create API key
- [ ] API Key: `_____________________________________`
- [ ] Test API with sample request

**Notes**:
- _______________________________________________________

---

### 4. Supabase (PostgreSQL)
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project: `csa-fyp-db`
- [ ] Region: `_____________________________________`
- [ ] Database Password: `_____________________________________`
- [ ] Get credentials:
  - Project URL: `_____________________________________`
  - Anon Key: `_____________________________________`
  - Service Role Key: `_____________________________________`
  - Connection String: `_____________________________________`
- [ ] Enable pgvector extension
- [ ] Run migration: `001_initial_schema.sql`

**Notes**:
- _______________________________________________________
- _______________________________________________________

---

### 5. Qdrant Cloud (Vector Database)
- [ ] Create account at [qdrant.tech](https://qdrant.tech)
- [ ] Create free cluster: `csa-knowledge`
- [ ] Region: `_____________________________________`
- [ ] Get credentials:
  - Cluster URL: `_____________________________________`
  - API Key: `_____________________________________`
- [ ] Create collections:
  - [ ] `products` (768 dimensions, Cosine)
  - [ ] `faqs` (768 dimensions, Cosine)

**Notes**:
- _______________________________________________________

---

### 6. N8N Installation
- [ ] Install N8N: `npm install -g n8n`
- [ ] Start N8N: `n8n start`
- [ ] Access: http://localhost:5678
- [ ] Create local account
- [ ] Configure credentials:
  - [ ] Google Gemini
  - [ ] PostgreSQL
  - [ ] Shopify

**Notes**:
- _______________________________________________________

---

### 7. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all credentials
- [ ] Test connections using test scripts

---

## 🧪 Verification Tests

### Test Gemini API
```bash
npm install @google/generative-ai
node test-gemini.js
```
- [ ] Test passed: `_____________________________________`

### Test Supabase Connection
```bash
npm install @supabase/supabase-js
node test-db.js
```
- [ ] Test passed: `_____________________________________`

### Test Qdrant Connection
```bash
npm install @qdrant/js-client-rest
node test-qdrant.js
```
- [ ] Test passed: `_____________________________________`

---

## 📝 Credentials Summary

Once all accounts are set up, update `.env` file:

```env
# Gemini
GOOGLE_GEMINI_API_KEY=paste_your_key_here

# Supabase
SUPABASE_URL=paste_your_url_here
SUPABASE_ANON_KEY=paste_your_key_here
DATABASE_URL=paste_your_connection_string_here

# Qdrant
QDRANT_URL=paste_your_url_here
QDRANT_API_KEY=paste_your_key_here

# Shopify
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_KEY=paste_your_key_here
SHOPIFY_API_SECRET=paste_your_secret_here
SHOPIFY_ACCESS_TOKEN=paste_your_token_here
```

---

## ✅ Completion Criteria

All accounts set up when:
- [x] All checkboxes above are marked
- [x] All test scripts pass
- [x] `.env` file is complete
- [x] N8N is running and accessible

---

**Estimated Time**: 2-3 hours  
**Next Step**: Run database migrations and populate vector databases

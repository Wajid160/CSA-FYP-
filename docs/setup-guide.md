# Setup Guide - Getting Started

**Project**: Customer Support Agent for Clothing Web Store  
**Prerequisites**: Basic command line knowledge, text editor, web browser  
**Time Required**: ~2 hours

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Google account (for Gemini API)
- [ ] Active email address

---

## 🚀 Step-by-Step Setup

### 1. Shopify Partner Account & Development Store

#### Create Shopify Partner Account
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click "Sign Up" (it's FREE)
3. Fill in your details
4. Verify your email

#### Create Development Store
1. Log into Partner Dashboard
2. Click "Stores" → "Add store"
3. Select "Development store"
4. Choose "Create a store for testing"
5. Fill in store details:
   - Store name: `csa-clothing-test`
   - Store type: Choose any template
6. Click "Create development store"
7. Save your store URL (e.g., `csa-clothing-test.myshopify.com`)

#### Add Sample Products
1. Log into your development store
2. Go to "Products" → "Add product"
3. Add at least 10 clothing items:
   - T-Shirts (various sizes and colors)
   - Jeans (with size chart)
   - Dresses
   - Hoodies
   - Accessories

**OR** Use Shopify's sample data:
- Settings → "Shopify Admin" → Import sample products

---

### 2. Create Custom Shopify App

#### Using Shopify CLI (Required post-Jan 2026)
1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/app
   ```

2. Navigate to your project:
   ```bash
   cd "C:\Users\wajid\Desktop\My FYP (CSA)\shopify-app"
   ```

3. Create app:
   ```bash
   shopify app init
   ```
   - Choose "Custom app"
   - App name: `customer-support-agent`
   - App type: `none` (we'll build custom)

4. Configure app scopes in `shopify.app.toml`:
   ```toml
   scopes = "read_products,read_orders,write_orders,read_customers,write_customers"
   ```

5. Deploy app to development store:
   ```bash
   shopify app deploy
   ```

6. Save your API credentials (displayed in terminal)

#### Alternative: Use Existing App (2025)
If you have an app from 2025:
1. Go to Partner Dashboard →"Apps"
2. Select your existing app
3. Update scopes if needed
4. Get API key and secret

---

### 3. Set Up Supabase (PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (FREE)
3. Sign up with GitHub/Google
4. Create new project:
   - Name: `csa-fyp-db`
   - Database password: (generate strong password)
   - Region: Choose closest to you
   - Pricing plan: FREE
5. Wait for project to provision (~2 minutes)

6. Get your credentials:
   - Go to "Settings" → "API"
   - Copy:
     - Project URL
     - Anon key
     - Service role key
   - Go to "Settings" → "Database"
   - Copy connection string

7. Enable pgvector extension:
   - Go to "Database" → "Extensions"
   - Search for "vector"
   - Enable it

8. Run migrations:
   - Go to "SQL Editor"
   - Click "New query"
   - Paste contents of `database/migrations/001_initial_schema.sql`
   - Click "Run"

---

### 4. Set Up Qdrant Cloud (Vector Database)

1. Go to [qdrant.tech](https://qdrant.tech)
2. Click "Get Started Free"
3. Sign up with GitHub/Google
4. Create cluster:
   - Cluster name: `csa-knowledge`
   - Type: **Free** (1GB, 1M vectors)
   - Region: Choose closest
5. Create collections:
   - Click "Collections" → "Create collection"
   - Name: `products`, Vectors: 768 dimensions
   - Name: `faqs`, Vectors: 768 dimensions
6. Get API credentials:
   - Click on cluster name
   - Copy "Cluster URL" and "API Key"

---

### 5. Get Google AI API Keys

#### Gemini API
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google account
3. Click "Get API Key"
4. Click "Create API key"
5. Copy and save the key

#### Google Embedding API
- Same API key works for both Gemini and Embedding APIs!

---

### 6. Install and Configure N8N

#### Option A: Self-Hosted (Recommended for development)
1. Install N8N globally:
   ```bash
   npm install -g n8n
   ```

2. Start N8N:
   ```bash
   n8n start
   ```

3. Open browser: `http://localhost:5678`

4. Create account (stored locally)

#### Option B: N8N Cloud (Free trial)
1. Go to [n8n.io](https://n8n.io/cloud)
2. Sign up for free trial
3. Create workspace

#### Configure Credentials in N8N
1. Open N8N web interface
2. Go to "Credentials" (top menu)
3. Add credentials for:
   - **Google Gemini**: Paste your API key
   - **PostgreSQL**: Use Supabase connection string
   - **Shopify**: Use your app credentials

---

### 7. Set Up Project Environment

1. Navigate to project directory:
   ```bash
   cd "C:\Users\wajid\Desktop\My FYP (CSA)"
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your credentials:
   ```env
   # Gemini
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
   
   # Supabase
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   DATABASE_URL=postgresql://...
   
   # Qdrant
   QDRANT_URL=https://xxxxx.qdrant.io
   QDRANT_API_KEY=your_qdrant_key
   
   # Shopify
   SHOPIFY_STORE_URL=your-store.myshopify.com
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   ```

4. Save the file

---

### 8. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial FYP project setup"
```

(Optional) Create GitHub repository and push:
```bash
git remote add origin https://github.com/your-username/csa-fyp.git
git push -u origin main
```

---

### 9. Verify Setup

#### Test Database Connection
Create file `test-db.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.from('faqs').select('*').limit(1);
  if (error) console.error('Error:', error);
  else console.log('✅ Database connected!', data);
}

test();
```

Run:
```bash
node test-db.js
```

#### Test Gemini API
Create file `test-gemini.js`:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
  const result = await model.generateContent('Say hello!');
  console.log('✅ Gemini API working!', result.response.text());
}

test();
```

Run:
```bash
npm install @google/generative-ai
node test-gemini.js
```

---

## ✅ Setup Complete!

You should now have:
- ✅ Shopify development store with products
- ✅ Custom Shopify app
- ✅ Supabase PostgreSQL database
- ✅ Qdrant vector database
- ✅ Google Gemini API access
- ✅ N8N instance running
- ✅ Environment variables configured
- ✅ Git repository initialized

---

## 🎯 Next Steps

1. **Read the Architecture docs**: `docs/architecture.md`
2. **Review Database schema**: `docs/database-schema.md`
3. **Build first N8N workflow**: Start with FAQ agent
4. **Create chat widget**: Basic React component
5. **Test end-to-end**: Customer asks FAQ → Agent responds

---

## 🆘 Troubleshooting

### Can't install Shopify CLI
- Ensure Node.js 18+ is installed
- Run `npm install -g @shopify/cli` with admin privileges

### Supabase migration failed
- Check SQL syntax
- Ensure pgvector extension is enabled
- Try running migrations one table at a time

### N8N won't start
- Check if port 5678 is already in use
- Try: `n8n start --port 5679`

### Gemini API errors
- Verify API key is correct
- Check you're using `gemini-3-flash` (not `gemini-2.0-flash-preview`)
- Ensure you haven't exceeded free tier quota

---

## 📚 Useful Links

- [Shopify CLI Docs](https://shopify.dev/docs/api/shopify-cli)
- [Supabase Docs](https://supabase.com/docs)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [N8N Docs](https://docs.n8n.io/)
- [Gemini API Docs](https://ai.google.dev/)

---

**Need help?** Check the FYP documentation or review error logs.

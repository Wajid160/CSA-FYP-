# Step-by-Step Account Setup Guide

**Follow these instructions in order. Complete each step before moving to the next.**

---

## 🚀 Step 1: Install Prerequisites

### Install Node.js (if not already installed)
1. Go to [nodejs.org](https://nodejs.org)
2. Download LTS version (18 or higher)
3. Run installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Install Project Dependencies
```bash
cd "C:\Users\wajid\Desktop\My FYP (CSA)"
npm install
```

✅ **Checkpoint**: You should see `@google/generative-ai`, `@supabase/supabase-js`, and `@qdrant/js-client-rest` installed.

---

## 📝 Step 2: Get Google Gemini API Key

### Instructions:
1. **Open browser** and go to: https://aistudio.google.com
2. **Sign in** with your Google account
3. **Click "Get API key"** (top-right or in left sidebar)
4. **Click "Create API key"**
5. **Copy the API key** (it looks like: `AIzaSy...`)

### Update .env file:
```bash
# Open .env file in your editor
notepad .env
```

Add your key:
```env
GOOGLE_GEMINI_API_KEY=paste_your_actual_key_here
```

### Test connection:
```bash
npm run test:gemini
```

✅ **Checkpoint**: You should see "SUCCESS! Gemini API is working!" and a greeting from Gemini 3 Flash.

---

## 💾 Step 3: Set Up Supabase (PostgreSQL)

### Create Account:
1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with **GitHub** or **Google**

### Create Project:
1. Click **"New Project"**
2. Fill in:
   - **Project name**: `csa-fyp-db`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you (e.g., US East, EU West)
   - **Pricing Plan**: **FREE**
3. Click **"Create new project"**
4. Wait ~2 minutes for provisioning

### Get Credentials:
1. Go to **Settings** → **API** (in sidebar)
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (under "Project API keys")
   - **service_role key** (scroll down, reveal and copy)

3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Copy **Connection string** (select "Nodejs" format)

### Update .env file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Enable pgvector Extension:
1. In Supabase, go to **Database** → **Extensions**
2. Search for **"vector"**
3. Toggle it **ON**

### Run Database Migration:
1. Go to **SQL Editor** (in Supabase sidebar)
2. Click **"New query"**
3. Open file: `C:\Users\wajid\Desktop\My FYP (CSA)\database\migrations\001_initial_schema.sql`
4. Copy ALL contents
5. Paste into Supabase SQL Editor
6. Click **"Run"**
7. You should see "Success. No rows returned"

### Test Connection:
```bash
npm run test:db
```

✅ **Checkpoint**: You should see "SUCCESS! Database connection working!" and sample FAQs listed.

---

## 🔍 Step 4: Set Up Qdrant (Vector Database)

### Create Account:
1. Go to: https://qdrant.tech
2. Click **"Get Started Free"**
3. Sign up with **GitHub** or **Google**

### Create Cluster:
1. After login, click **"Create Cluster"**
2. Fill in:
   - **Cluster name**: `csa-knowledge`
   - **Type**: **Free** (1GB, forever free)
   - **Region**: Choose closest to you
3. Click **"Create"**
4. Wait ~1 minute for provisioning

### Get Credentials:
1. Click on your cluster name
2. Copy:
   - **Cluster URL** (looks like: `https://xxxxx.qdrant.io`)
   - **API Key** (click "Reveal" then copy)

### Update .env file:
```env
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_api_key_here
```

### Test Connection:
```bash
npm run test:qdrant
```

✅ **Checkpoint**: You should see "SUCCESS! Qdrant connection working!"

### Create Collections:
We'll create these in the next step using a script.

---

## 🛍️ Step 5: Set Up Shopify Development Store

### Create Shopify Partner Account:
1. Go to: https://partners.shopify.com
2. Click **"Sign up"** (it's FREE)
3. Fill in your details
4. Verify your email

### Create Development Store:
1. In Partner Dashboard, go to **"Stores"**
2. Click **"Add store"**
3. Select **"Development store"**
4. Choose **"Create a store for testing and development"**
5. Fill in:
   - **Store name**: `csa-clothing-test` (or any name you like)
   - **Store purpose**: Testing and development
6. Click **"Create development store"**
7. Your store URL will be: `csa-clothing-test.myshopify.com`

### Add Sample Products:
1. Log into your development store (click "Log in" from Partner Dashboard)
2. Go to **Settings** → **Apps and sales channels**
3. Click **"Develop apps"** → **"Allow custom app development"**
4. Now go to **Products**
5. Add at least 10 clothing products:
   - T-Shirts (Small, Medium, Large, XL)
   - Jeans (sizes 28-36)
   - Dresses (S, M, L)
   - Hoodies
   - Accessories

**OR** Use Shopify's built-in sample products:
- In admin, click **Settings** → **Store details**
- Scroll down to **"Sample products"**
- Click **"Add sample products"**

---

## 🔧 Step 6: Check Your Existing Shopify App (2025)

### Instructions:
1. In Partner Dashboard, go to **"Apps"**
2. Do you see an app from 2025?
   - **YES**: Click on it and check:
     - Does it have these API scopes?
       - `read_products`
       - `read_orders`
       - `write_orders`
       - `read_customers`
       - `write_customers`
     - If YES, you can use this app! Get the credentials:
       - Go to **"API credentials"** tab
       - Copy **API key** and **API secret key**
     - If NO, we'll create a new one
   
   - **NO**: We'll create a new app using Shopify CLI in next step

### Update .env file (if using existing app):
```env
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_ACCESS_TOKEN=your_access_token
```

✅ **Checkpoint**: If you have an existing app with correct scopes, you're good! Otherwise, continue to Step 7.

---

## 🛠️ Step 7: Install Shopify CLI & Create App (if needed)

### Install Shopify CLI:
```bash
npm install -g @shopify/cli @shopify/app
```

### Verify installation:
```bash
shopify version
```

### Create New App (if needed):
```bash
cd "C:\Users\wajid\Desktop\My FYP (CSA)\shopify-app"
shopify app init
```

Follow prompts:
- App template: **Custom**
- App name: `customer-support-agent`

### Configure Scopes:
Edit `shopify.app.toml`:
```toml
scopes = "read_products,read_orders,write_orders,read_customers,write_customers"
```

### Deploy to Development Store:
```bash
shopify app deploy
```

Save the API credentials displayed!

---

## 📦 Step 8: Install N8N

### Install N8N globally:
```bash
npm install -g n8n
```

### Start N8N:
```bash
n8n start
```

### Access N8N:
Open browser: http://localhost:5678

### Create Account:
- Email: your_email@example.com
- Password: (choose a strong password)

### Configure Credentials in N8N:
1. Click **"Credentials"** (top menu)
2. Click **"+ Add Credential"**
3. Add these:
   - **Google Gemini**: Paste your API key
   - **Postgres**: Use DATABASE_URL from .env
   - **HTTP Header Auth** (for Qdrant): Use QDRANT_API_KEY

✅ **Checkpoint**: N8N is running at localhost:5678 and credentials are saved.

---

## ✅ Final Verification

### Run All Tests:
```bash
npm run test:gemini
npm run test:db
npm run test:qdrant
```

### All tests should pass! ✅

---

## 📝 Summary Checklist

- [ ] Node.js installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Gemini API key obtained and tested
- [ ] Supabase project created
- [ ] Database migration successful
- [ ] Qdrant cluster created and tested
- [ ] Shopify development store created
- [ ] Sample products added
- [ ] Shopify app configured (existing or new)
- [ ] N8N installed and running
- [ ] All `.env` values filled in
- [ ] All test scripts pass

---

**Next Steps**: 
1. Create Qdrant collections
2. Generate and upload embeddings
3. Build N8N workflows

**Estimated Time**: 2-3 hours for complete setup

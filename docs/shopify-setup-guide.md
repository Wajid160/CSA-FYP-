# Shopify Setup Guide for FYP Project

**Date**: February 2, 2026  
**Purpose**: Set up Shopify Partner account, development store, and custom app for Customer Support Agent integration

---

## 📋 Overview

We need:
1. Shopify Partner account (FREE)
2. Development store (FREE, unlimited for partners)
3. Custom app with API access
4. Sample clothing products for testing

**Total Cost**: $0 (all free for development)

---

## Step 1: Create Shopify Partner Account (15 min)

### Instructions:

1. **Go to**: https://partners.shopify.com/signup

2. **Fill in the form**:
   - Email: Your email address
   - Password: Create a strong password
   - First name & Last name
   - Phone number (optional but recommended)

3. **Business Information**:
   - **Are you a developer?**: Yes
   - **What will you build?**: Custom apps
   - **How many stores?**: 1-5 (for learning/testing)
   - **Company name**: Your name or "FYP Project" (can be anything)

4. **Verification**:
   - Check your email for verification link
   - Click the link to verify
   - You'll be redirected to Partner Dashboard

5. **Complete Profile** (optional but recommended):
   - Add profile picture
   - Add company details
   - Skip payment info (not needed for dev stores)

✅ **Success**: You should now see the Shopify Partner Dashboard

---

## Step 2: Create Development Store (10 min)

### Instructions:

1. **In Partner Dashboard**:
   - Click **"Stores"** in left sidebar
   - Click **"Add store"** button

2. **Select Store Type**:
   - Choose **"Development store"**
   - Click **"Create a store to test and build"**

3. **Store Details**:
   - **Store name**: `csa-clothing-test` (or any name you like)
   - **Store purpose**: Testing apps and themes
   - **Login information**:
     - Email: (auto-filled with your partner email)
     - Password: Create a strong password (save this!)
   - **Location**: Your country
   - **Store industry**: Apparel & Accessories
   - **Store currency**: Your preferred currency (USD, PKR, etc.)

4. **Development Store Settings**:
   - **Data**: Start with test data ✓ (recommended - gives you sample products)
   - Click **"Create development store"**

5. **Wait** (~30-60 seconds for store to be created)

6. **Access Your Store**:
   - Your store URL will be: `csa-clothing-test.myshopify.com`
   - Click **"Log in to store"** to access admin

✅ **Success**: You should now see your Shopify Admin Dashboard

---

## Step 3: Add Sample Products (30 min)

### Option A: Use Test Data (Quick - 2 min)

If you selected "Start with test data" during store creation, you already have products! Skip to verification.

### Option B: Manual Product Entry (30 min)

1. **In Shopify Admin**:
   - Go to **Products** → **Add product**

2. **Add These Products**:

#### Product 1: Classic White T-Shirt
- **Title**: Classic White T-Shirt
- **Description**: 
  ```
  Made from 100% premium cotton, this classic white t-shirt is a wardrobe essential. 
  Perfect for casual wear or layering. Comfortable, breathable, and easy to care for.
  ```
- **Price**: $29.99
- **Variants**:
  - Option 1: Size (S, M, L, XL)
  - Option 2: (leave empty for now)
- **Inventory**: Set 10+ for each size
- **Images**: Use placeholder or stock photos
- **Tags**: casual, basic, cotton, summer
- **Category**: Clothing → Shirts

#### Product 2: Blue Denim Jeans
- **Title**: Blue Denim Jeans
- **Description**:
  ```
  Classic blue denim jeans with a comfortable fit. Made from durable denim fabric 
  with a hint of stretch for all-day comfort. Perfect for everyday wear.
  ```
- **Price**: $59.99
- **Variants**: Sizes 28, 30, 32, 34, 36
- **Inventory**: 10+ each
- **Tags**: denim, jeans, casual, basics

#### Product 3: Summer Floral Dress
- **Title**: Summer Floral Dress
- **Description**:
  ```
  Light and breezy summer dress with a beautiful floral print. Perfect for warm days. 
  Features a flattering silhouette and comfortable fit.
  ```
- **Price**: $49.99
- **Variants**: S, M, L, XL
- **Inventory**: 10+ each
- **Tags**: dress, floral, summer, feminine

#### Product 4: Navy Blue Hoodie
- **Title**: Navy Blue Hoodie
- **Description**:
  ```
  Cozy navy blue hoodie made from soft cotton blend. Features a drawstring hood 
  and front pocket. Perfect for layering in cooler weather.
  ```
- **Price**: $44.99
- **Variants**: S, M, L, XL, XXL
- **Inventory**: 10+ each
- **Tags**: hoodie, casual, winter, layering

#### Product 5: Black Leather Belt
- **Title**: Black Leather Belt
- **Description**:
  ```
  Quality black leather belt with a sleek metal buckle. Versatile accessory 
  that complements any outfit.
  ```
- **Price**: $24.99
- **Variants**: Sizes 30, 32, 34, 36, 38
- **Inventory**: 10+ each
- **Tags**: accessories, leather, belt, formal

**Minimum**: Add at least 10 products total for good testing

---

## Step 4: Create Custom App (15 min)

### Instructions:

1. **In Shopify Admin**:
   - Go to **Settings** (bottom left)
   - Click **"Apps and sales channels"**

2. **Enable Custom App Development**:
   - Click **"Develop apps"**
   - Click **"Allow custom app development"**
   - Read the warning and click **"Allow custom app development"** again

3. **Create New App**:
   - Click **"Create an app"**
   - **App name**: `Customer Support Agent`
   - **App developer**: Your email
   - Click **"Create app"**

4. **Configure API Scopes**:
   - Click **"Configure Admin API scopes"**
   - Search and select these scopes:
     - ✅ `read_products` - Read products
     - ✅ `read_orders` - Read orders
     - ✅ `write_orders` - Modify orders
     - ✅ `read_customers` - Read customer data
     - ✅ `write_customers` - Modify customer data
     - ✅ `read_inventory` - Read inventory
   - Click **"Save"**

5. **Install App**:
   - Click **"Install app"** at top right
   - Click **"Install"** to confirm

6. **Get API Credentials**:
   - Go to **"API credentials"** tab
   - You'll see:
     - **Admin API access token**: Click "Reveal" and COPY THIS ⭐
     - **API key**: Copy this
     - **API secret key**: Copy this
   
7. **Save Credentials Securely**:
   ```
   SHOPIFY_STORE_URL=csa-clothing-test.myshopify.com
   SHOPIFY_API_KEY=[paste API key]
   SHOPIFY_API_SECRET=[paste API secret]
   SHOPIFY_ACCESS_TOKEN=[paste Admin API access token]
   ```

⚠️ **IMPORTANT**: The Admin API access token is shown only ONCE. Save it immediately!

---

## Step 5: Verify Setup (5 min)

### Check Products:
1. Go to **Products** in Shopify Admin
2. You should see all your products listed
3. Click on a product to verify variants and inventory

### Check App:
1. Go to **Settings** → **Apps and sales channels**
2. You should see "Customer Support Agent" listed
3. Status should be "Installed"

### Test API Access (Optional):
You can test API access using Shopify's GraphiQL explorer:
1. In your app, go to **API credentials**
2. Click **"Admin API"** section
3. Try a test query

---

## Step 6: Add to .env File

Open your `.env` file and add/update these lines:

```env
# Shopify Configuration
SHOPIFY_STORE_URL=csa-clothing-test.myshopify.com
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_ACCESS_TOKEN=your_admin_api_access_token_here
SHOPIFY_API_VERSION=2024-01
```

---

## 📊 Verification Checklist

- [ ] Partner account created and verified
- [ ] Development store created (`[name].myshopify.com`)
- [ ] At least 10 products added with variants
- [ ] Custom app created and installed
- [ ] API scopes configured (read_products, read_orders, write_orders, etc.)
- [ ] API credentials copied and saved
- [ ] Credentials added to `.env` file

---

## 🎯 What You'll Have

After completing this setup:

✅ **Shopify Store**: Fully functional development store  
✅ **Products**: 10+ clothing items with variants (sizes, colors)  
✅ **API Access**: Custom app with full read/write permissions  
✅ **Free Forever**: Development stores never expire  

---

## 🔄 Next Steps

Once Shopify is set up:

1. **Test Shopify API**: Run the product sync script
   ```bash
   npm run sync:products
   ```

2. **Build N8N Workflows**: Start with product search agent
   - Use Shopify node in N8N
   - Connect to your store using API credentials

3. **Test End-to-End**: Query products via agent → Shopify → Vector DB → Response

---

## 💡 Tips

1. **Sample Data**: Use Shopify's sample products to save time
2. **Product Quality**: Add realistic descriptions for better embedding quality
3. **Variants**: Make sure products have size/color variants for testing
4. **Inventory**: Keep inventory > 5 for each variant to test "in stock" checks
5. **Images**: Images aren't required for AI testing but nice to have

---

## 🆘 Common Issues

### Issue: Can't find "Develop apps" option
**Solution**: You might need to be the store owner. Make sure you're logged in with the account that created the development store.

### Issue: API credentials not showing
**Solution**: Make sure you clicked "Install app" before trying to view credentials.

### Issue: Forgot to copy access token
**Solution**: You'll need to create a new app or reinstall the existing one.

---

**Ready to start?** Follow Step 1 to create your Partner account!

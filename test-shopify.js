// Test Shopify API Connection
// Run: node test-shopify.js

require('dotenv').config();

async function testShopifyConnection() {
    console.log('🧪 Testing Shopify Connection...\n');

    try {
        // Check environment variables
        if (!process.env.SHOPIFY_STORE_URL) {
            throw new Error('SHOPIFY_STORE_URL not found in .env file');
        }
        if (!process.env.SHOPIFY_ACCESS_TOKEN) {
            throw new Error('SHOPIFY_ACCESS_TOKEN not found in .env file');
        }

        console.log('✓ Environment variables found');
        console.log(`  Store: ${process.env.SHOPIFY_STORE_URL}`);

        // Prepare API request
        const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
        const shopUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/${apiVersion}/products.json?limit=5`;

        console.log('✓ API endpoint configured');
        console.log('📡 Fetching products from Shopify...\n');

        // Fetch products
        const response = await fetch(shopUrl, {
            method: 'GET',
            headers: {
                'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shopify API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const products = data.products;

        console.log('✅ SUCCESS! Shopify connection working!\n');
        console.log(`Found ${products.length} products:\n`);

        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title}`);
            console.log(`   Price: $${product.variants[0].price}`);
            console.log(`   Variants: ${product.variants.length}`);
            console.log(`   Status: ${product.status}`);
            console.log('');
        });

        console.log('---');
        console.log('Store: Shopify Development Store');
        console.log('Status: Connected ✓');
        console.log(`API Version: ${apiVersion}`);

        return true;
    } catch (error) {
        console.error('❌ ERROR: Shopify connection failed\n');
        console.error('Error message:', error.message);

        if (error.message.includes('not found')) {
            console.error('\n💡 Fix: Update .env file with Shopify credentials');
        } else if (error.message.includes('401')) {
            console.error('\n💡 Fix: Check your SHOPIFY_ACCESS_TOKEN is correct');
        } else if (error.message.includes('404')) {
            console.error('\n💡 Fix: Verify SHOPIFY_STORE_URL (should be: yourstore.myshopify.com)');
        }

        return false;
    }
}

// Run test
testShopifyConnection()
    .then(success => {
        process.exit(success ? 0 : 1);
    });

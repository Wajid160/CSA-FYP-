// Fetch Products from Shopify and Generate Embeddings
// Run: node database/scripts/sync-shopify-products.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
});
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function fetchShopifyProducts() {
    console.log('📦 Fetching products from Shopify...');

    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';
    const shopUrl = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/${apiVersion}/products.json?limit=250`;

    const response = await fetch(shopUrl, {
        method: 'GET',
        headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();
    const products = data.products;

    // Transform to our format
    const transformedProducts = products
        .filter(p => p.status === 'active') // Only active products
        .map(product => ({
            id: product.id,
            title: product.title,
            description: product.body_html?.replace(/<[^>]*>/g, '') || '', // Strip HTML tags
            price: parseFloat(product.variants[0]?.price || 0),
            category: product.product_type || 'general',
            sizes: product.variants
                .filter(v => v.option1 && v.option1.match(/^(XS|S|M|L|XL|XXL|\d+)$/i))
                .map(v => v.option1)
                .filter((v, i, arr) => arr.indexOf(v) === i), // Unique sizes
            colors: product.variants
                .filter(v => v.option2)
                .map(v => v.option2)
                .filter((v, i, arr) => arr.indexOf(v) === i), // Unique colors
            tags: product.tags ? product.tags.split(', ') : [],
            vendor: product.vendor || '',
            image_url: product.image?.src || product.images?.[0]?.src || '',
        }));

    console.log(`  ✓ Found ${transformedProducts.length} active products`);
    return transformedProducts;
}

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function syncProducts() {
    console.log('🔄 Syncing Shopify Products...\n');

    try {
        // Fetch products from Shopify
        const products = await fetchShopifyProducts();

        const points = [];

        // Generate embeddings for each product
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            console.log(`[${i + 1}/${products.length}] Processing: "${product.title}"`);

            // Create rich text description for embedding
            const embeddingText = `
        Product: ${product.title}
        Description: ${product.description}
        Category: ${product.category}
        Price: $${product.price}
        Sizes: ${product.sizes.join(', ')}
        Colors: ${product.colors.join(', ')}
        Tags: ${product.tags.join(', ')}
      `.trim();

            // Generate embedding
            const embedding = await generateEmbedding(embeddingText);

            // Prepare point for Qdrant
            points.push({
                id: product.id.toString(),
                vector: embedding,
                payload: {
                    shopify_product_id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    category: product.category,
                    sizes: product.sizes,
                    colors: product.colors,
                    tags: product.tags,
                },
            });

            // Store in PostgreSQL
            const { error: dbError } = await supabase
                .from('product_embeddings')
                .upsert({
                    shopify_product_id: product.id,
                    product_title: product.title,
                    product_description: product.description,
                    embedding: `[${embedding.join(',')}]`, // Store as array string
                    metadata: {
                        price: product.price,
                        category: product.category,
                        sizes: product.sizes,
                        colors: product.colors,
                        tags: product.tags,
                    },
                });

            if (dbError) {
                console.log(`  ⚠️  PostgreSQL error: ${dbError.message}`);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log('\n📤 Uploading to Qdrant...');

        // Upload to Qdrant
        if (points.length > 0) {
            await qdrant.upsert('products', {
                wait: true,
                points: points,
            });
            console.log('  ✓ Upload complete');
        }

        console.log('\n✅ Product sync complete!');
        console.log(`   Total products: ${points.length}`);

    } catch (error) {
        console.error('❌ Error syncing products:', error.message);
        process.exit(1);
    }
}

// Run
syncProducts();

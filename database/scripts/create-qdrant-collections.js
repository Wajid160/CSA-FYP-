// Create Qdrant Collections for Vector Search
// Run: node database/scripts/create-qdrant-collections.js

const { QdrantClient } = require('@qdrant/js-client-rest');
require('dotenv').config();

const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
    checkCompatibility: false,
});

async function createCollections() {
    console.log('🔧 Creating Qdrant Collections...\n');

    try {
        // Create 'products' collection
        console.log('Creating "products" collection...');

        try {
            await client.createCollection('products', {
                vectors: {
                    size: 768, // Google Embedding API dimension
                    distance: 'Cosine',
                },
                optimizers_config: {
                    indexing_threshold: 10000,
                },
            });
            console.log('✅ "products" collection created successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️  "products" collection already exists');
            } else {
                throw error;
            }
        }

        // Create 'faqs' collection
        console.log('\nCreating "faqs" collection...');

        try {
            await client.createCollection('faqs', {
                vectors: {
                    size: 768,
                    distance: 'Cosine',
                },
                optimizers_config: {
                    indexing_threshold: 1000,
                },
            });
            console.log('✅ "faqs" collection created successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('ℹ️  "faqs" collection already exists');
            } else {
                throw error;
            }
        }

        // Verify collections
        console.log('\n📊 Verifying collections...');
        const collections = await client.getCollections();

        console.log('\nAvailable collections:');
        collections.collections.forEach(col => {
            console.log(`  ✓ ${col.name}`);
        });

        console.log('\n✅ All collections ready!');

    } catch (error) {
        console.error('❌ Error creating collections:', error.message);
        process.exit(1);
    }
}

// Run
createCollections();

// Test Qdrant Connection
// Run: node test-qdrant.js

const { QdrantClient } = require('@qdrant/js-client-rest');
require('dotenv').config();

async function testQdrantConnection() {
    console.log('🧪 Testing Qdrant Connection...\n');

    try {
        // Check environment variables
        if (!process.env.QDRANT_URL) {
            throw new Error('QDRANT_URL not found in .env file');
        }
        if (!process.env.QDRANT_API_KEY) {
            throw new Error('QDRANT_API_KEY not found in .env file');
        }

        console.log('✓ Environment variables found');

        // Initialize Qdrant client
        const client = new QdrantClient({
            url: process.env.QDRANT_URL,
            apiKey: process.env.QDRANT_API_KEY,
            checkCompatibility: false, // Skip version check
        });

        console.log('✓ Qdrant client initialized');
        console.log('📡 Checking collections...\n');

        // List all collections
        const collections = await client.getCollections();

        console.log('✅ SUCCESS! Qdrant connection working!\n');
        console.log(`Found ${collections.collections.length} collections:`);

        if (collections.collections.length === 0) {
            console.log('  (No collections yet - create them after setup)');
        } else {
            collections.collections.forEach(col => {
                console.log(`  • ${col.name}`);
            });
        }

        console.log('\n---');
        console.log('Vector DB: Qdrant Cloud');
        console.log('Status: Connected ✓');

        return true;
    } catch (error) {
        console.error('❌ ERROR: Qdrant connection failed\n');
        console.error('Error message:', error.message);

        if (error.message.includes('not found')) {
            console.error('\n💡 Fix: Update .env file with Qdrant credentials');
        } else if (error.message.includes('401') || error.message.includes('403')) {
            console.error('\n💡 Fix: Check your Qdrant API key is correct');
        }

        return false;
    }
}

// Run test
testQdrantConnection()
    .then(success => {
        process.exit(success ? 0 : 1);
    });

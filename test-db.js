// Test Supabase PostgreSQL Connection
// Run: node test-db.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
    console.log('🧪 Testing Supabase Connection...\n');

    try {
        // Check environment variables
        if (!process.env.SUPABASE_URL) {
            throw new Error('SUPABASE_URL not found in .env file');
        }
        if (!process.env.SUPABASE_ANON_KEY) {
            throw new Error('SUPABASE_ANON_KEY not found in .env file');
        }

        console.log('✓ Environment variables found');

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        console.log('✓ Supabase client initialized');
        console.log('📡 Querying database...\n');

        // Test query - get FAQs
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .limit(3);

        if (error) {
            throw error;
        }

        console.log('✅ SUCCESS! Database connection working!\n');
        console.log(`Found ${data.length} FAQs in database:`);
        data.forEach((faq, index) => {
            console.log(`\n${index + 1}. ${faq.question}`);
            console.log(`   Category: ${faq.category}`);
        });

        console.log('\n---');
        console.log('Database: PostgreSQL (Supabase)');
        console.log('Status: Connected ✓');

        return true;
    } catch (error) {
        console.error('❌ ERROR: Database connection failed\n');
        console.error('Error message:', error.message);

        if (error.message.includes('not found')) {
            console.error('\n💡 Fix: Update .env file with Supabase credentials');
        } else if (error.code === '42P01') {
            console.error('\n💡 Fix: Run database migrations first (001_initial_schema.sql)');
        }

        return false;
    }
}

// Run test
testSupabaseConnection()
    .then(success => {
        process.exit(success ? 0 : 1);
    });

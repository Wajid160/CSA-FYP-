// Generate FAQ Embeddings and Upload to Qdrant
// Run: node database/scripts/generate-faq-embeddings.js

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

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function generateFAQEmbeddings() {
    console.log('🧠 Generating FAQ Embeddings...\n');

    try {
        // Fetch all FAQs from database
        console.log('📖 Fetching FAQs from database...');
        const { data: faqs, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;

        console.log(`✓ Found ${faqs.length} FAQs\n`);

        const points = [];

        // Generate embeddings for each FAQ
        for (let i = 0; i < faqs.length; i++) {
            const faq = faqs[i];
            console.log(`[${i + 1}/${faqs.length}] Processing: "${faq.question.substring(0, 50)}..."`);

            // Combine question and answer for better semantic search
            const combinedText = `Question: ${faq.question}\nAnswer: ${faq.answer}`;

            // Generate embedding
            const embedding = await generateEmbedding(combinedText);

            // Prepare point for Qdrant
            points.push({
                id: faq.id,
                vector: embedding,
                payload: {
                    question: faq.question,
                    answer: faq.answer,
                    category: faq.category,
                    keywords: faq.keywords,
                },
            });

            // Also store in PostgreSQL faq_embeddings table
            const { error: embedError } = await supabase
                .from('faq_embeddings')
                .upsert({
                    faq_id: faq.id,
                    question_embedding: embedding,
                    answer_embedding: embedding, // Using same for now
                });

            if (embedError) {
                console.log(`  ⚠️  Warning: Could not store in PostgreSQL: ${embedError.message}`);
            }

            // Rate limiting - wait 100ms between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n📤 Uploading embeddings to Qdrant...');

        // Upload to Qdrant in batches
        const batchSize = 100;
        for (let i = 0; i < points.length; i += batchSize) {
            const batch = points.slice(i, i + batchSize);
            await qdrant.upsert('faqs', {
                wait: true,
                points: batch,
            });
            console.log(`  ✓ Uploaded batch ${Math.floor(i / batchSize) + 1}`);
        }

        console.log('\n✅ All FAQ embeddings generated and uploaded!');
        console.log(`   Total: ${points.length} FAQs`);

    } catch (error) {
        console.error('❌ Error generating embeddings:', error.message);
        process.exit(1);
    }
}

// Run
generateFAQEmbeddings();

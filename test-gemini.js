// Test Google Gemini API Connection
// Run: node test-gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Connection...\n');

  try {
    // Check if API key exists
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not found in .env file');
    }

    console.log('✓ API key found in environment');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    console.log('✓ Gemini client initialized');
    console.log('📡 Sending test request...\n');

    // Test request
    const result = await model.generateContent('Say "Hello from Gemini 3 Flash Preview!" and nothing else.');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Gemini API is working!\n');
    console.log('Response:', text);
    console.log('\n---');
    console.log('Model: gemini-3-flash-preview');
    console.log('Status: Connected ✓');

    return true;
  } catch (error) {
    console.error('❌ ERROR: Gemini API test failed\n');
    console.error('Error message:', error.message);

    if (error.message.includes('API key')) {
      console.error('\n💡 Fix: Make sure GOOGLE_GEMINI_API_KEY is set in .env file');
    }

    return false;
  }
}

// Run test
testGeminiAPI()
  .then(success => {
    process.exit(success ? 0 : 1);
  });

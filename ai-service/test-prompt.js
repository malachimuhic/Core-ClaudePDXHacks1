/**
 * Standalone test script for the Claude AI service.
 * Run: node test-prompt.js
 *
 * Make sure you have a .env file with ANTHROPIC_API_KEY set.
 */
require('dotenv').config();

const { chat } = require('./claude-client');

async function runTests() {
  console.log('=== FixIt Bot AI Service Test ===\n');

  // Test 1: Simple text query
  console.log('--- Test 1: Dripping faucet ---');
  try {
    const response1 = await chat({
      message: "My kitchen faucet won't stop dripping. It's a single-handle type.",
      history: [],
    });
    console.log(response1);
    console.log('\n');
  } catch (err) {
    console.error('Test 1 failed:', err.message);
  }

  // Test 2: Follow-up conversation
  console.log('--- Test 2: Follow-up question ---');
  try {
    const response2 = await chat({
      message: 'What tools do I need for that?',
      history: [
        { role: 'user', content: "My kitchen faucet won't stop dripping." },
        { role: 'assistant', content: 'You likely have a worn cartridge or O-ring...' },
      ],
    });
    console.log(response2);
    console.log('\n');
  } catch (err) {
    console.error('Test 2 failed:', err.message);
  }

  // Test 3: Safety scenario
  console.log('--- Test 3: Electrical safety ---');
  try {
    const response3 = await chat({
      message: 'I see sparks when I plug things into my kitchen outlet. What should I do?',
      history: [],
    });
    console.log(response3);
  } catch (err) {
    console.error('Test 3 failed:', err.message);
  }

  console.log('\n=== Tests complete ===');
}

runTests();

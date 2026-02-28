/**
 * Standalone test script for the Claude AI service.
 * Run: node test-prompt.js
 *
 * Make sure you have a .env file with ANTHROPIC_API_KEY set.
 *
 * What to look for:
 *  Test 1 — Full repair guide: diagnosis, tools list, numbered steps, YouTube searches, cost
 *  Test 2 — Conversational reply (no full format, just a direct answer)
 *  Test 3 — Safety warning first, Electrical/Severe, recommend pro = Yes
 */
require('dotenv').config();

const { chat } = require('./claude-client');

async function runTests() {
  console.log('=== FixIt Bot AI Service Test ===\n');

  // Test 1: Simple repair problem — expect full structured guide
  console.log('--- Test 1: Dripping faucet ---');
  console.log('Expect: Full repair guide with tools, steps, YouTube links, cost estimate\n');
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

  // Test 2: Follow-up question — expect conversational reply, no full format
  console.log('--- Test 2: Follow-up question ---');
  console.log('Expect: Short conversational answer (not the full repair guide format)\n');
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

  // Test 3: Safety scenario — expect safety warning first, recommend pro = Yes
  console.log('--- Test 3: Electrical safety scenario ---');
  console.log('Expect: Safety warning at top, Electrical/Severe or Emergency, Hire a Pro = Yes\n');
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

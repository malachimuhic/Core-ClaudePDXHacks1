# AI Service — System Prompt & Claude API (Person 3)

## Your Role
Craft the system prompt that makes Claude act as a handyman expert, and build the Claude API integration module. Your code gets imported by the backend.

## What to Build
- **System prompt** — The handyman expert persona (in `system-prompt.txt`)
- **Claude client module** — `claude-client.js` exports a function the backend calls
- **Message formatting** — Build text content blocks, image content blocks for Claude's vision
- **Structured output** — Diagnosis, severity, cost estimate format
- **Test script** — `test-prompt.js` to verify the prompt works without needing the backend

## Tech Stack
- **Anthropic SDK** (`@anthropic-ai/sdk`)
- **Claude Sonnet** — model with vision capability
- **dotenv** — for API key in standalone testing

## API Contract (Your Export)

The backend imports your module like this:

```javascript
const { chat } = require('../ai-service/claude-client');

const response = await chat({
  message: "My faucet is dripping",
  history: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ],
  image: "data:image/jpeg;base64,..."  // optional
});
// response is a string with the diagnosis
```

## Getting Started

```bash
cd ai-service
cp ../backend/.env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm install
node test-prompt.js
```

This tests the system prompt and Claude integration standalone — no backend needed.

## File Overview
- `system-prompt.txt` — The handyman expert system prompt (edit this to improve responses)
- `claude-client.js` — Module that calls Claude API, exported for backend to import
- `test-prompt.js` — Standalone test script
- `package.json` — Dependencies

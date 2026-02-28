# Backend — API Server (Person 2)

## Your Role
Build the Express server that sits between the frontend and the AI service. You own the API endpoint, request validation, error handling, and CORS.

## What to Build
- Express server on port 3001
- Single `POST /api/chat` endpoint
- Accept `{ message, history, image? }` from frontend
- Forward to the AI service (import `claude-client.js` from `../ai-service/`)
- Return `{ response }` to frontend
- CORS setup so frontend on port 5173 can call you
- `.env` handling for `ANTHROPIC_API_KEY`

## Tech Stack
- **Node.js + Express**
- **cors** — cross-origin requests
- **dotenv** — load `.env` file
- Imports from `../ai-service/claude-client.js` for Claude API calls

## API Contract

### `POST /api/chat`

**Request body:**
```json
{
  "message": "My faucet is dripping",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "image": "data:image/jpeg;base64,/9j/4AAQ..."  // optional
}
```

**Response:**
```json
{
  "response": "Issue: Dripping faucet\nSeverity: Minor\n..."
}
```

**Error response:**
```json
{
  "error": "Something went wrong"
}
```

## Getting Started

```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm install
node server.js
```

Server starts on `http://localhost:3001`.

## File Overview
- `server.js` — Express server with `/api/chat` route (start here)
- `package.json` — Dependencies
- `.env.example` — Template for environment variables

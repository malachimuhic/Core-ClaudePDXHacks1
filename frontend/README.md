# Frontend — Chat UI (Person 1)

## Your Role
Build the React chat interface that users interact with. Everything the user sees and touches is yours.

## What to Build
- Text input for typing repair questions
- Photo upload button (`<input type="file" accept="image/*" capture="environment">`) for camera/gallery
- Image preview before sending
- Message list with auto-scroll
- Send button with loading state
- Calls `POST /api/chat` on the backend

## Tech Stack
- **React** (via Vite for fast dev server)
- **CSS** (plain CSS — no framework needed for hackathon)
- Vite dev server proxies `/api` requests to `http://localhost:3001`

## API Contract

### `POST /api/chat`

**Request:**
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

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

This starts the Vite dev server on `http://localhost:5173`. API calls are proxied to `http://localhost:3001` (the backend).

## File Overview
- `index.html` — Vite HTML entry point
- `src/main.jsx` — React entry point
- `src/App.jsx` — Main chat component (start here)
- `src/App.css` — Styles
- `vite.config.js` — Vite config with API proxy
- `package.json` — Dependencies

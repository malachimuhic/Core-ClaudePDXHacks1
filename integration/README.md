# Integration — Config, Demo & Glue (Person 4)

## Your Role
Make sure all 3 pieces (frontend, backend, ai-service) connect and work together. Own the demo prep, shared documentation, and deployment scripts.

## What to Build
- **API contract docs** — Keep `api-contract.md` as the single source of truth
- **Demo scenarios** — 3 prepared prompts to show off the app
- **Run script** — `run-all.sh` to start frontend + backend together
- **Environment setup** — Make sure `.env.example` and `.gitignore` are correct
- **Wiring** — Help connect backend to ai-service, frontend to backend
- **Polish** — Final testing, bug fixes, demo rehearsal

## Responsibilities
- You're the glue person — unblock others, test integrations, prepare the demo
- If someone is stuck, pair with them
- Keep the API contract doc updated if the interface changes
- Test the full flow: user types → frontend sends → backend processes → AI responds → frontend displays

## Getting Started

### Quick Start (run everything)
```bash
# From project root:
bash integration/run-all.sh
```

### Manual Start
```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env  # add your API key
npm install
node server.js

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## File Overview
- `api-contract.md` — Shared API spec everyone codes against
- `demo-scenarios.md` — 3 demo prompts ready to go
- `run-all.sh` — Script to start both frontend and backend

'use strict';

// Load .env.backend before anything else so all process.env reads below succeed.
require('dotenv').config({ path: require('path').join(__dirname, '.env.backend') });

// --- Fail fast: environment validation ---
// The Anthropic SDK reads ANTHROPIC_API_KEY automatically via new Anthropic().
// If the key is missing the first chat request would produce a confusing SDK
// error deep inside claude-client.js. Checking here surfaces the problem the
// moment the server starts, before any request is accepted.
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Add your key to backend/.env.backend.');
  process.exit(1);
}

const express      = require('express');
const cors         = require('cors');
const chatRouter   = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3001;

// FRONTEND_URL defaults to the Vite dev server. In production, set this env
// var to the deployed frontend origin. Restricting to a specific origin
// (instead of '*') prevents arbitrary websites from making requests to the API.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- Global middleware ---

// cors() must come before route handlers so preflight OPTIONS requests are
// answered before they reach any route or body-parsing logic.
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// 10 MB body limit to accommodate base64-encoded images from the frontend.
app.use(express.json({ limit: '10mb' }));

// --- Routes ---
// All routes are namespaced under /api inside chatRouter, so the full paths
// are /api/health and /api/chat.
app.use('/api', chatRouter);

// --- 404 handler ---
// Registered after all valid routes. Express falls through here only when no
// earlier route matched. Returns JSON (not Express's default HTML) so clients
// always receive a consistent error shape.
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// --- Centralized error handler ---
// Must be last and must have exactly 4 parameters so Express recognises it as
// an error-handling middleware. See middleware/errorHandler.js for details.
app.use(errorHandler);

// --- Start server ---
app.listen(PORT, () => {
  console.log(`FixIt Bot backend running on http://localhost:${PORT}`);
  console.log(`Accepting requests from: ${FRONTEND_URL}`);
});

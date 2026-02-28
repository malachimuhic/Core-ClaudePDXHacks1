'use strict';

const express          = require('express');
const { chat }         = require('../../ai-service/claude-client');
const { validateChat } = require('../middleware/validate');

const router = express.Router();

/**
 * GET /api/health
 *
 * Lightweight liveness probe. No I/O — returns immediately so it's always
 * fast even when the AI service is slow or unavailable.
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * POST /api/chat
 *
 * Forwards a validated chat request to the AI service and returns its response.
 *
 * Request body (validated by validateChat middleware):
 *   message {string}   - The user's text. Optional if image is provided.
 *   history {Array}    - Previous conversation turns [{role, content}]. Optional.
 *   image   {string}   - Base64 data URL (e.g. "data:image/jpeg;base64,..."). Optional.
 *
 * Response:
 *   200  { response: string }  - Claude's reply text
 *   400  { error: string }     - Validation failure (caught by validateChat)
 *   500  { error: string }     - AI service error (forwarded to errorHandler)
 */
router.post('/chat', validateChat, async (req, res, next) => {
  try {
    const { message, history, image } = req.body;

    // history defaults to [] when absent; validateChat ensures that if history
    // IS provided it is already an array, so this fallback is always safe.
    const response = await chat({ message, history: history || [], image });

    res.json({ response });
  } catch (err) {
    // Don't handle the error here — forward it to the centralized errorHandler
    // in middleware/errorHandler.js so formatting stays in one place.
    next(err);
  }
});

module.exports = router;

'use strict';

/**
 * errorHandler
 *
 * Centralized Express error-handling middleware. Every next(err) call in the
 * app lands here — validation errors, AI service errors, and anything else.
 *
 * IMPORTANT: Express identifies error handlers by their 4-argument signature.
 * The `next` parameter must be present even if unused — do not remove it.
 *
 * Error properties read:
 *   err.status   {number}  HTTP status code to send (defaults to 500)
 *   err.isClient {boolean} If true, err.message is safe to expose to the client.
 *                          If false/absent, a generic message is sent instead so
 *                          stack traces and internal details never leak over the wire.
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = typeof err.status === 'number' ? err.status : 500;

  // Log the real error internally so developers can debug.
  // console.error for 5xx so monitoring systems can alert on it;
  // console.warn for 4xx because those are client mistakes, not server bugs.
  if (status >= 500) {
    console.error('[errorHandler] Unhandled server error:', err);
  } else {
    console.warn(`[errorHandler] Client error ${status}:`, err.message);
  }

  // Expose the message only for errors that were deliberately crafted for the
  // client (isClient=true, set by validate.js). For everything else, use a
  // generic string so internal details never reach the browser.
  const clientMessage = err.isClient
    ? err.message
    : 'Something went wrong. Please try again.';

  res.status(status).json({ error: clientMessage });
}

module.exports = errorHandler;

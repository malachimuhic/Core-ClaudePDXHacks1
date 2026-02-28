'use strict';

/**
 * validateChat
 *
 * Route-level middleware for POST /api/chat.
 * Rejects malformed requests with a 400 before any AI API call is attempted.
 * Calls next() if the body is valid, or next(err) with a 400 error if not.
 *
 * Rules (matching the API contract in integration/api-contract.md):
 *   - At least one of `message` (non-empty string) or `image` (string) required.
 *   - `message`, if provided, must be a string.
 *   - `history`, if provided, must be an array.
 *   - `image`, if provided, must be a string (data URL format validated by ai-service).
 */
function validateChat(req, res, next) {
  const { message, history, image } = req.body;

  // A whitespace-only message is treated the same as no message.
  const hasMessage = typeof message === 'string' && message.trim().length > 0;
  const hasImage   = typeof image === 'string'   && image.length > 0;

  if (!hasMessage && !hasImage) {
    return next(validationError(
      'message or image is required. Provide a non-empty message string, an image data URL, or both.'
    ));
  }

  if (message !== undefined && typeof message !== 'string') {
    return next(validationError('message must be a string.'));
  }

  if (history !== undefined && !Array.isArray(history)) {
    return next(validationError('history must be an array.'));
  }

  // Only check type here — the data URL format (data:image/...;base64,...) is
  // parsed and validated inside ai-service/claude-client.js to avoid duplication.
  if (image !== undefined && typeof image !== 'string') {
    return next(validationError('image must be a base64 data URL string.'));
  }

  next();
}

/**
 * Creates a validation error with the HTTP status and isClient flag attached.
 * errorHandler.js reads these properties to build the response.
 *
 * @param {string} message - User-readable description of what went wrong.
 * @returns {Error}
 */
function validationError(message) {
  const err    = new Error(message);
  err.status   = 400;
  err.isClient = true; // safe to expose this message directly to the client
  return err;
}

module.exports = { validateChat };

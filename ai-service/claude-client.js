const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Load system prompt from file
const systemPrompt = fs.readFileSync(
  path.join(__dirname, 'system-prompt.txt'),
  'utf-8'
);

/**
 * Send a chat message to Claude and get a response.
 *
 * @param {Object} options
 * @param {string} options.message - The user's text message
 * @param {Array} options.history - Previous conversation messages [{role, content}]
 * @param {string} [options.image] - Optional base64 data URL (e.g. "data:image/jpeg;base64,...")
 * @returns {Promise<string>} Claude's response text
 */
async function chat({ message, history = [], image }) {
  const client = new Anthropic();

  // Build conversation messages from history
  const messages = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Build the current user message content blocks
  const content = [];

  // Add image block if provided
  if (image) {
    // Parse data URL: "data:image/jpeg;base64,/9j/4AAQ..."
    const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: matches[1],
          data: matches[2],
        },
      });
    }
  }

  // Add text block
  if (message) {
    content.push({
      type: 'text',
      text: message,
    });
  }

  // Add the current user message
  messages.push({
    role: 'user',
    content: content,
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages,
  });

  // Extract text from response
  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : 'No response generated.';
}

module.exports = { chat };

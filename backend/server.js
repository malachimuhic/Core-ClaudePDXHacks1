const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import the AI service client
const { chat } = require('../ai-service/claude-client');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // large limit for base64 images

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'Message or image is required' });
    }

    const response = await chat({ message, history, image });

    res.json({ response });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

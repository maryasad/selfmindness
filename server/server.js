require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const authRoutes = require('./auth');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, voiceSettings, systemPrompt } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt || `You are a ${voiceSettings?.gender || 'female'} therapist specializing in ${voiceSettings?.category || 'general'}. 
                   Respond in ${voiceSettings?.language === 'en' ? 'English' : 'Persian'} with empathy and professional insight.
                   Keep responses concise and supportive.`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    res.json({ response });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      error: voiceSettings?.language === 'en'
        ? 'An unexpected error occurred. Please try again.'
        : 'یک خطای غیرمنتظره رخ داد. لطفا دوباره تلاش کنید.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database status: Connected');
});

// api/index.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables 
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint to check if the API is running
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Sportlink API is running', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint to verify Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sports').select('*').limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        error: 'Database connection error', 
        details: error.message 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Supabase connection successful',
      data
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ 
      error: 'Server error', 
      details: err.message 
    });
  }
});

// Export the Express API
module.exports = app; 
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

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV || 'not set',
    supabaseUrlExists: !!process.env.SUPABASE_URL,
    supabaseKeyExists: !!process.env.SUPABASE_KEY,
    timestamp: new Date().toISOString(),
    envKeys: Object.keys(process.env).join(', ')
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Sportlink API is running', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// No Supabase initialization at the module level
// We'll initialize it on demand in the test endpoint

// Test endpoint for Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    // Get credentials from environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    
    // Check if credentials exist
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Missing Supabase credentials',
        urlExists: !!supabaseUrl,
        keyExists: !!supabaseKey
      });
    }
    
    // Log the URL for debugging (first few chars only)
    console.log('Supabase URL format:', supabaseUrl.substring(0, 12) + '...');
    
    // Try to create client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to query the database
    const { data, error } = await supabase.from('sports').select('*').limit(1);
    
    if (error) {
      return res.status(500).json({ 
        error: 'Database query error', 
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
      details: err.message,
      stack: err.stack
    });
  }
});

// Export the Express API
module.exports = app; 
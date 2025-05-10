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
  // Güvenlik için sadece kısmen göster
  const supabaseUrlPartial = process.env.SUPABASE_URL 
    ? `${process.env.SUPABASE_URL.substring(0, 8)}...` 
    : 'not set';
  
  const supabaseKeyExists = process.env.SUPABASE_KEY ? 'exists' : 'not set';
  
  res.status(200).json({
    environment: process.env.NODE_ENV || 'not set',
    supabaseUrl: supabaseUrlPartial,
    supabaseKeyExists: supabaseKeyExists,
    timestamp: new Date().toISOString(),
    allEnvKeys: Object.keys(process.env).filter(key => !key.includes('SECRET')).join(', ')
  });
});

// Create Supabase client only if URL and key are available
let supabase = null;
try {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (supabaseUrl && supabaseKey) {
    // Validate URL format
    new URL(supabaseUrl); // This will throw if URL is invalid
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Missing Supabase URL or key. Client not initialized.');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'not set',
    supabaseInitialized: !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint to check if the API is running
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Sportlink API is running', 
    version: '1.0.0',
    supabaseInitialized: !!supabase,
    timestamp: new Date().toISOString()
  });
});

// Simple test endpoint to verify Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error: 'Supabase client not initialized',
        message: 'Environment variables may be missing or invalid'
      });
    }
    
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
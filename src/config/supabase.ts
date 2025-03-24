import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase URL ve API anahtarları için env değişkenlerini kontrol et
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Eksik env değişkenleri için hata fırlat
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Eksik Supabase ortam değişkenleri. SUPABASE_URL ve SUPABASE_ANON_KEY gerekli.');
}

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

// Ortam değişkenlerini kontrol et
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Gerekli ortam değişkenlerini kontrol et
if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
  throw new Error(
    'Eksik Supabase ortam değişkenleri. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ve SUPABASE_ANON_KEY gerekli.'
  );
}

// Admin işlemleri için service_role key ile client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Normal işlemler için anon key ile client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
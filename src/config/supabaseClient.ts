import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Admin işlemleri için service_role key ile client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Normal işlemler için anon key ile client
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
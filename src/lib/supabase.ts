import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Normal client (anon key ile)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (service role key ile)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); 
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid (non-placeholder) environment variables
const isValidUrl = supabaseUrl && 
  supabaseUrl.startsWith('https://') && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseUrl.includes('placeholder');

const isValidKey = supabaseAnonKey && 
  supabaseAnonKey.length > 20 &&
  !supabaseAnonKey.includes('your-anon-key') &&
  !supabaseAnonKey.includes('placeholder');

// Only create client if we have valid environment variables
export const supabase = isValidUrl && isValidKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if user is admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!supabase) return false;
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  
  return profile?.role === 'admin';
};
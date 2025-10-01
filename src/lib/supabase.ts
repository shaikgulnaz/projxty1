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

// Admin email addresses - these users get full admin access
const ADMIN_EMAILS = [
  'admin@projxty.com',
  'projxty@gmail.com',
  // Add more admin emails here
];

// Auth helper functions
export const signInWithGoogle = async () => {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });
  
  return { success: !error, data, error };
};

export const signOut = async () => {
  if (!supabase) return { success: false, error: 'Supabase not configured' };
  
  const { error } = await supabase.auth.signOut();
  return { success: !error, error };
};

export const getCurrentUser = async () => {
  if (!supabase) return { user: null, session: null };
  
  const { data: { user }, error } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  
  return { user, session, error };
};

export const isAdmin = (userEmail: string | undefined): boolean => {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
};

export const getUserRole = (userEmail: string | undefined): 'admin' | 'user' | 'guest' => {
  if (!userEmail) return 'guest';
  return isAdmin(userEmail) ? 'admin' : 'user';
};

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  
  return supabase.auth.onAuthStateChange(callback);
};
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Gets the singleton instance of the Supabase client.
 * This function initializes the client on its first call and returns the existing instance on subsequent calls.
 * Environment variables are accessed from the globally available `process.env`.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Access environment variables from the globally available `process.env`.
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // This error is caught by the top-level check in index.tsx before this function is called.
    // This is a safeguard against unexpected direct calls.
    throw new Error('CRITICAL: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Cannot initialize Supabase client.');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};
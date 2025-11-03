import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Gets the singleton instance of the Supabase client.
 * This function initializes the client on its first call and returns the existing instance on subsequent calls.
 * It accesses secrets from `window.process.env` which is appropriate for this browser-based environment.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  // Safely access environment variables from the window object.
  const env = (window as any).process?.env;
  const supabaseUrl = env?.SUPABASE_URL;
  const supabaseAnonKey = env?.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // This error is caught by the top-level check in index.tsx before this function is called.
    // This is a safeguard against unexpected direct calls.
    throw new Error('CRITICAL: Supabase URL or Anon Key is missing. Cannot initialize Supabase client.');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};
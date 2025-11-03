import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Gets the singleton instance of the Supabase client.
 * This function initializes the client on its first call and returns the existing instance on subsequent calls.
 * It will throw an error if the required Supabase environment variables are not configured.
 * This lazy initialization prevents the app from crashing on load if the environment is not set up correctly.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // This error should be caught by the top-level check in App.tsx before this function is ever called.
    // It's included here as a safeguard to ensure the app fails loudly if called unexpectedly.
    throw new Error('CRITICAL: Supabase URL or Anon Key is missing from environment variables. Cannot initialize Supabase client.');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
};

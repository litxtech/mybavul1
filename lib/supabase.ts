import { createClient } from '@supabase/supabase-js';

// These variables are expected to be injected by the environment.
// Do not hardcode them here.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = "Supabase URL or Anon Key is missing. Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.";
    // Log to console for developers
    console.error(errorMessage);
    // Throw an error to stop the application from running in a broken state.
    throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
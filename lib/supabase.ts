// Fix: Removed reference to "vite/client" which was causing a type definition error.
import { createClient } from '@supabase/supabase-js';

// These variables are expected to be injected by the Vite build process.
// Do not hardcode them here. Ensure they are prefixed with VITE_ in your .env file or hosting provider.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage = "CRITICAL: Supabase URL or Anon Key is missing. The application will not be able to connect to the database. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.";
    // Log a prominent error for developers
    console.error(errorMessage);
}

// Pass empty strings if the env variables are not set.
// This prevents the client from crashing on initialization and allows the UI to render.
// The error will occur gracefully on the first database call instead.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
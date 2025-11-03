/// <reference types="vite/client" />

// This file defines global types for environment variables accessed via `window.process.env`.
// The execution environment injects secrets into the window object for client-side access.

declare global {
  interface Window {
    process?: {
      env: {
        SUPABASE_URL: string;
        SUPABASE_ANON_KEY: string;
        STRIPE_PUBLISHABLE_KEY: string;
        API_KEY: string;
        // Add index signature to allow dynamic access in index.tsx
        [key: string]: string | undefined;
      }
    }
  }
}

// This export makes the file a module, preventing potential global scope conflicts.
export {};

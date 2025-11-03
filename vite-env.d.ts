/// <reference types="vite/client" />

// This file defines global types for environment variables accessed via `process.env`.
// The execution environment makes these available on `process.env` instead of Vite's `import.meta.env`.

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      STRIPE_PUBLISHABLE_KEY: string;
      API_KEY: string;
      // Add index signature to allow dynamic access in index.tsx
      [key: string]: string | undefined;
    }
  }
}

// This export makes the file a module, preventing potential global scope conflicts.
export {};

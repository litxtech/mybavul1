/// <reference types="vite/client" />

// This file provides TypeScript definitions for Vite's `import.meta.env`.
// It ensures type safety and autocompletion for your environment variables.
// All client-side environment variables must be prefixed with `VITE_`.

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
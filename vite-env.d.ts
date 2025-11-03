/// <reference types="vite/client" />

// This file provides TypeScript definitions for environment variables
// accessed via `import.meta.env`.

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_API_KEY: string;
  // Add other client-side environment variables here.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

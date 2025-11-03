/// <reference types="vite/client" />

// This file provides TypeScript definitions for environment variables
// exposed globally via `process.env`. This setup is specific to the
// platform environment and overrides standard Vite `import.meta.env` behavior.

declare namespace NodeJS {
  interface ProcessEnv {
    readonly SUPABASE_URL: string;
    readonly SUPABASE_ANON_KEY: string;
    readonly STRIPE_PUBLISHABLE_KEY: string;
    readonly API_KEY: string;
  }
}

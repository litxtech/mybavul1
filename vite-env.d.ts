/// <reference types="vite/client" />

// This file provides TypeScript definitions for environment variables.
// It ensures type safety and autocompletion.

// Since the execution environment provides variables via `process.env` instead of `import.meta.env`,
// we define the types for `process.env` here.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    readonly VITE_API_KEY: string;
  }
}

/// <reference types="vite/client" />

// This file provides type definitions for environment variables
// that are expected to be available on `process.env` in the browser.
// The execution environment is responsible for polyfilling `process.env`.

// Fix: Extend the global NodeJS.ProcessEnv interface to add type definitions
// for environment variables, preventing redeclaration errors with @types/node.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      VITE_STRIPE_PUBLISHABLE_KEY: string;
      VITE_API_KEY: string;
    }
  }
}

// Fix: Add an empty export to treat this file as a module, which allows for global augmentation.
export {};

/// <reference types="vite/client" />

// This file provides TypeScript definitions for environment variables
// accessed via `process.env`. The platform this runs on makes these available.

declare namespace NodeJS {
  interface ProcessEnv {
    readonly SUPABASE_URL: string;
    readonly SUPABASE_ANON_KEY: string;
    readonly STRIPE_PUBLISHABLE_KEY: string;
    readonly API_KEY: string;
    // Add other environment variables here as needed.
  }
}

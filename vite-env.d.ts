/// <reference types="vite/client" />

// This file provides TypeScript definitions for environment variables
// accessed via `process.env`. In a Vite project, only variables
// prefixed with VITE_ are exposed to the client-side code.

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
    // FIX: Use API_KEY for Gemini API key as per guidelines.
    readonly API_KEY: string;
    // Add other client-side environment variables here.
  }
}

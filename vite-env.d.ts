// This file provides TypeScript definitions for environment variables exposed by Vite.
// It ensures type safety and autocompletion when using `import.meta.env`.

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_CAMREF?: string;
  readonly VITE_PUBREF?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
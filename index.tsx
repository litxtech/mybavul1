import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ConfigurationError from './components/ConfigurationError';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// For Vite projects, client-side env vars must be prefixed with VITE_ to be exposed.
// The platform makes them available on `process.env`.
const env = process.env;

// Check for required environment variables at the top level to prevent crashes.
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLISHABLE_KEY',
  // FIX: Use API_KEY for Gemini API key as per guidelines.
  'API_KEY'
];

const missingVars = requiredVars.filter(varName => !env[varName as keyof NodeJS.ProcessEnv]);

if (missingVars.length > 0) {
  // Map back to the unprefixed names for the user-facing error message to match the README.
  const missingDisplayNames = missingVars.map(v => v.replace(/^VITE_/, ''));
  root.render(
    <React.StrictMode>
      <ConfigurationError missingVars={missingDisplayNames} />
    </React.StrictMode>
  );
} else {
  // Otherwise, render the full application.
  root.render(
    <React.StrictMode>
      <LanguageProvider>
        <AuthProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </AuthProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
}

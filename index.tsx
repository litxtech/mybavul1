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

// In this environment, variables are exposed on `process.env`.
const env = process.env;

// Check for required environment variables at the top level to prevent crashes.
// This platform's environment does not use the VITE_ prefix for client-side variables.
const requiredVars: string[] = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'API_KEY'
];

const missingVars = requiredVars.filter(varName => !env[varName]);

if (missingVars.length > 0) {
  root.render(
    <React.StrictMode>
      <ConfigurationError missingVars={missingVars} />
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
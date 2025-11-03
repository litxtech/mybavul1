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

// Check for required environment variables at the top level to prevent crashes.
// This is the earliest point of execution, ensuring no other code runs if config is missing.
const missingVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'API_KEY'
].filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  // If variables are missing, render only the error component.
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

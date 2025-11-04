import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { GoogleIcon, EnvelopeIcon } from './icons';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { signInWithMagicLink, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signInWithMagicLink(email);

    if (error) {
      setError(error.message);
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
        setError(error.message);
        setLoading(false);
    }
    // Don't setLoading(false) on success because the page will redirect
  }

  const handleClose = () => {
    // Reset state on close
    setEmail('');
    setError('');
    setEmailSent(false);
    setLoading(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">{t('auth.title')}</h2>
        
        {emailSent ? (
            <div className="text-center">
                <EnvelopeIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">{t('auth.checkEmail')}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{t('auth.magicLinkSent', { email })}</p>
                <button onClick={handleClose} className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                    Close
                </button>
            </div>
        ) : (
            <>
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    <GoogleIcon className="w-5 h-5 me-3" />
                    Continue with Google
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">OR</span>
                    </div>
                </div>
                
                <form onSubmit={handleMagicLinkSignIn}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('auth.email')}</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-slate-700"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm mb-4">{t('auth.error', { message: error })}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400"
                  >
                    {loading ? t('auth.signingIn') : t('auth.continue')}
                  </button>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default Auth;
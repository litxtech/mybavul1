import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const Auth: React.FC<AuthProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const action = isLoginView ? signIn : signUp;
    const { error } = await action({ email, password });

    if (error) {
      setError(error.message);
    } else {
      onClose(); // Close modal on success
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? t('auth.login.title') : t('auth.signup.title')}</h2>
        
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{t('auth.error', { message: error })}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400"
          >
            {loading ? (isLoginView ? t('auth.loggingIn') : t('auth.signingUp')) : (isLoginView ? t('auth.login.button') : t('auth.signup.button'))}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm">
          {isLoginView ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-red-600 hover:text-red-500">
            {isLoginView ? t('auth.signup.button') : t('auth.login.button')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
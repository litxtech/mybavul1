import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../i18n';
import { GlobeIcon, LogoutIcon, CurrencyDollarIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (langCode: string) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
                <GlobeIcon className="w-6 h-6" />
                <span className="font-medium text-sm">{language.code.toUpperCase()}</span>
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-full text-start px-4 py-2 text-sm flex items-center space-x-2 ${language.code === lang.code
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CurrencySwitcher = () => {
    const { currency, setCurrency, currencies } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleSelect = (currencyCode: string) => {
        setCurrency(currencyCode);
        setIsOpen(false);
    };

    return (
         <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
                <CurrencyDollarIcon className="w-6 h-6" />
                <span className="font-medium text-sm">{currency.code}</span>
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5">
                    <ul className="py-1">
                        {currencies.map((curr) => (
                            <li key={curr.code}>
                                <button
                                    onClick={() => handleSelect(curr.code)}
                                    className={`w-full text-start px-4 py-2 text-sm flex items-center space-x-2 ${currency.code === curr.code
                                            ? 'bg-red-50 text-red-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span>{curr.symbol}</span>
                                    <span>{curr.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}


const Header: React.FC<{ onNavigate: (view: 'HOME' | 'RESERVATIONS') => void, onAuthClick: () => void }> = ({ onNavigate, onAuthClick }) => {
  const { t } = useLanguage();
  const { session, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button className="flex-shrink-0" onClick={() => onNavigate('HOME')}>
            <h1 className="text-2xl font-bold tracking-tight text-red-600">
              mybavul
            </h1>
          </button>
          
          <div className="flex items-center space-x-4">
            <CurrencySwitcher />
            <LanguageSwitcher />
            {session ? (
                <div className="flex items-center space-x-4">
                    <button onClick={() => onNavigate('RESERVATIONS')} className="hidden sm:block text-sm font-medium text-gray-700 hover:text-red-600">{t('header.myReservations')}</button>
                    <button onClick={signOut} className="flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                        <LogoutIcon className="w-5 h-5 me-1" />
                        {t('header.logout')}
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <button onClick={onAuthClick} className="text-sm font-medium text-red-600 hover:text-red-800">{t('header.login')}</button>
                    <button onClick={onAuthClick} className="text-sm font-medium text-white bg-red-600 px-3 py-1 rounded-md hover:bg-red-700">{t('header.signup')}</button>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
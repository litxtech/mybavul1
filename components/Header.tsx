import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, languages } from '../i18n';
import { GlobeIcon, LogoutIcon, CurrencyDollarIcon, SunIcon, BuildingOfficeIcon, HomeModernIcon, MountainIcon, HeartIcon, UserCircleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

const BrandLogo = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => (
    <a href="#/" className="flex-shrink-0" aria-label="MyBavul Homepage">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-600">
            mybavul
        </h1>
    </a>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-1.6.5 5.25h16.5" />
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const DarkModeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('color-theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="Toggle theme">
            {theme === 'light' ? <SunIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    )
}


const Header: React.FC<{ onNavigate: (view: 'HOME' | 'RESERVATIONS' | 'ADMIN' | 'PARTNER' | 'WISHLIST' | 'PROFILE') => void, onAuthClick: () => void }> = ({ onNavigate, onAuthClick }) => {
  const { t } = useLanguage();
  const { session, signOut, profile } = useAuth();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <BrandLogo />
              {/* Desktop Mega Menu */}
              <nav className="hidden md:flex items-center space-x-6">
                {['Stays', 'Experiences', 'Deals', 'Guides'].map(item => (
                  <button key={item} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-500">
                    {t(`header.${item.toLowerCase()}`)}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <LanguageSwitcher />
                <CurrencySwitcher />
              </div>
              <DarkModeToggle />

              {session ? (
                  <div className="hidden md:flex items-center space-x-4">
                      {profile?.role === 'admin' && <button onClick={() => onNavigate('ADMIN')} className="text-sm font-medium text-slate-700 hover:text-primary-600">{t('admin.title')}</button>}
                      {profile?.role === 'partner' && <button onClick={() => onNavigate('PARTNER')} className="text-sm font-medium text-slate-700 hover:text-primary-600">{t('partner.title')}</button>}
                      <button onClick={() => onNavigate('WISHLIST')} className="p-2 rounded-full text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white" aria-label={t('header.myWishlist')}><HeartIcon className="w-5 h-5"/></button>
                      <button onClick={() => onNavigate('RESERVATIONS')} className="text-sm font-medium text-slate-700 hover:text-primary-600">{t('header.myReservations')}</button>
                      <button onClick={() => onNavigate('PROFILE')} className="text-sm font-medium text-slate-700 hover:text-primary-600">{t('header.myProfile')}</button>
                      <button onClick={signOut} className="flex items-center text-sm font-medium text-slate-700 hover:text-primary-600">
                          <LogoutIcon className="w-5 h-5 me-1" />
                          {t('header.logout')}
                      </button>
                  </div>
              ) : (
                  <div className="hidden md:flex items-center space-x-2">
                      <button onClick={onAuthClick} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">{t('header.signIn')}</button>
                  </div>
              )}
               {/* Mobile Menu Button */}
               <div className="md:hidden">
                    <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Open menu">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </header>
      <MobileDrawer isOpen={isDrawerOpen} setIsOpen={setDrawerOpen} onNavigate={onNavigate} onAuthClick={onAuthClick} />
    </>
  );
};


const MobileDrawer: React.FC<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onNavigate: (view: 'HOME' | 'RESERVATIONS' | 'ADMIN' | 'PARTNER' | 'WISHLIST' | 'PROFILE') => void;
    onAuthClick: () => void;
}> = ({ isOpen, setIsOpen, onNavigate, onAuthClick }) => {
    const { t } = useLanguage();
    const { session, signOut, profile } = useAuth();
    
    const handleNavigation = (view: 'HOME' | 'RESERVATIONS' | 'ADMIN' | 'PARTNER' | 'WISHLIST' | 'PROFILE') => {
        onNavigate(view);
        setIsOpen(false);
    }
    const handleAuthClick = () => {
        onAuthClick();
        setIsOpen(false);
    }

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Overlay */}
            <div onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/50"></div>
            
            {/* Drawer */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
                    <BrandLogo />
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu">
                        <XIcon className="h-6 w-6 text-slate-500"/>
                    </button>
                </div>
                <div className="p-4">
                    {session ? (
                        <div className="space-y-2">
                            {profile?.role === 'admin' && <button onClick={() => handleNavigation('ADMIN')} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('admin.title')}</button>}
                            {profile?.role === 'partner' && <button onClick={() => handleNavigation('PARTNER')} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('partner.title')}</button>}
                            <button onClick={() => handleNavigation('PROFILE')} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('header.myProfile')}</button>
                            <button onClick={() => handleNavigation('WISHLIST')} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('header.myWishlist')}</button>
                            <button onClick={() => handleNavigation('RESERVATIONS')} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('header.myReservations')}</button>
                            <button onClick={signOut} className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('header.logout')}</button>
                        </div>
                    ) : (
                         <div className="space-y-2">
                            <button onClick={handleAuthClick} className="w-full text-left p-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">{t('header.signIn')}</button>
                         </div>
                    )}
                    <div className="border-t dark:border-slate-800 my-4"></div>
                    <div className="flex justify-between items-center p-2">
                        <LanguageSwitcher />
                        <CurrencySwitcher />
                    </div>
                    <div className="border-t dark:border-slate-800 my-4"></div>
                     <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <a href="#/policy/privacy" onClick={() => setIsOpen(false)} className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('policy.privacy.title')}</a>
                        <a href="#/policy/terms" onClick={() => setIsOpen(false)} className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">{t('policy.terms.title')}</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

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
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-500"
            >
                <GlobeIcon className="w-5 h-5" />
                <span className="font-medium text-sm">{language.code.toUpperCase()}</span>
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 dark:ring-slate-700">
                    <ul className="py-1">
                        {languages.map((lang) => (
                            <li key={lang.code}>
                                <button
                                    onClick={() => handleSelect(lang.code)}
                                    className={`w-full text-start px-4 py-2 text-sm flex items-center space-x-2 ${language.code === lang.code
                                            ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-white'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-500"
            >
                <CurrencyDollarIcon className="w-5 h-5" />
                <span className="font-medium text-sm">{currency.code}</span>
            </button>
            {isOpen && (
                <div className="absolute end-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 dark:ring-slate-700">
                    <ul className="py-1">
                        {currencies.map((curr) => (
                            <li key={curr.code}>
                                <button
                                    onClick={() => handleSelect(curr.code)}
                                    className={`w-full text-start px-4 py-2 text-sm flex items-center space-x-2 ${currency.code === curr.code
                                            ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-white'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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

export default Header;
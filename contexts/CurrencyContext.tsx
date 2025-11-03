import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Currency, FxRate } from '../types';
import { useLanguage } from '../i18n';

interface CurrencyContextType {
  currency: Currency;
  currencies: Currency[];
  setCurrency: (currencyCode: string) => void;
  formatCurrency: (amountMinor: number, currencyOverride?: Currency) => string;
  convertFromUSD: (amountUsdMinor: number) => number;
  getCurrencyByCode: (code: string) => Currency;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const defaultCurrencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
];

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [fxRates, setFxRates] = useState<FxRate[]>([]);
  const [currencyCode, setCurrencyCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mybavul-currency') || 'USD';
    }
    return 'USD';
  });

  useEffect(() => {
    const fetchCurrenciesAndRates = async () => {
      const { data: currencyData, error: currencyError } = await supabase.from('currencies').select('*');
      if (!currencyError && currencyData.length > 0) {
        setCurrencies(currencyData);
      } else if (currencyError) {
        console.error("Error fetching currencies, using default.", currencyError);
      }

      const { data: ratesData, error: ratesError } = await supabase.from('fx_rates').select('*').eq('base', 'USD');
       if (!ratesError) {
        setFxRates(ratesData);
      } else {
        console.error("Error fetching exchange rates", ratesError);
      }
    };
    fetchCurrenciesAndRates();
  }, []);

  const setCurrency = (newCode: string) => {
    if (currencies.some(c => c.code === newCode)) {
      setCurrencyCode(newCode);
      localStorage.setItem('mybavul-currency', newCode);
    }
  };
  
  const getCurrencyByCode = useCallback((code: string): Currency => {
    return currencies.find(c => c.code === code) || currencies[0];
  }, [currencies]);

  const currency = getCurrencyByCode(currencyCode);

  const convertFromUSD = useCallback((amountUsdMinor: number): number => {
    if (currency.code === 'USD') return amountUsdMinor;
    const rate = fxRates.find(r => r.quote === currency.code)?.rate;
    if (rate) {
      return Math.round(amountUsdMinor * rate);
    }
    return amountUsdMinor; // Fallback to USD amount if no rate
  }, [currency, fxRates]);

  const formatCurrency = useCallback((amountMinor: number, currencyOverride?: Currency): string => {
    const targetCurrency = currencyOverride || currency;
    const rate = fxRates.find(r => r.quote === targetCurrency.code)?.rate || 1;
    
    // If the input is not already in the target currency, convert it
    // This assumes the input `amountMinor` is in USD if no override is given.
    const displayAmountMinor = currencyOverride ? amountMinor : convertFromUSD(amountMinor);
    
    const displayAmount = displayAmountMinor / 100;

    return new Intl.NumberFormat(language.code, {
      style: 'currency',
      currency: targetCurrency.code,
    }).format(displayAmount);

  }, [language.code, currency, fxRates, convertFromUSD]);

  const value = {
    currency,
    currencies,
    setCurrency,
    formatCurrency,
    convertFromUSD,
    getCurrencyByCode,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
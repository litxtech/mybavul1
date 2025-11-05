import React, { useState, useEffect, useRef } from 'react';
import { SearchParams } from '../types';
import { LocationIcon, CalendarIcon, UsersIcon } from './icons';
import { useLanguage } from '../i18n';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

const supportedCities = [
  { key: 'barcelona', value: 'Barcelona' },
  { key: 'madrid', value: 'Madrid' },
  { key: 'palma', value: 'Palma' },
  { key: 'istanbul', value: 'Istanbul' },
];

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [destination, setDestination] = useState(t('city.barcelona') || 'Barcelona');
  const [destinationKey, setDestinationKey] = useState('barcelona');
  const [suggestions, setSuggestions] = useState<{ key: string, value: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  
  const allSearchableDestinations = supportedCities.map(c => ({
    key: c.key,
    value: t(`city.${c.key}`) || c.value,
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDestination(query);
    if (query.length > 0) {
      const filtered = allSearchableDestinations.filter(
        (item) => item.value.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: { key: string, value: string }) => {
    setDestination(suggestion.value);
    setDestinationKey(suggestion.key);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city: destinationKey, checkin, checkout, guests });
  };
  
  const inputBaseClasses = "block w-full rounded-xl border-transparent ps-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-12 text-slate-900 placeholder-slate-400 dark:bg-white";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-left">
      <div className="col-span-1 md:col-span-2 lg:col-span-2" ref={searchContainerRef}>
        <label htmlFor="city" className="block text-sm font-medium text-white/90">{t('search.destination')}</label>
        <div className="mt-1 relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
            <LocationIcon className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            id="city"
            value={destination}
            onChange={handleDestinationChange}
            onFocus={() => destination.length > 0 && setShowSuggestions(true)}
            placeholder={t('search.placeholder')}
            autoComplete="off"
            className={inputBaseClasses}
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.key}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    {suggestion.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="col-span-1">
        <label htmlFor="checkin" className="block text-sm font-medium text-white/90">{t('search.checkin')}</label>
         <div className="mt-1 relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
               <CalendarIcon className="h-5 w-5 text-slate-500" />
             </div>
            <input
              type="date"
              id="checkin"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              min={today}
              className={inputBaseClasses}
              required
            />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="checkout" className="block text-sm font-medium text-white/90">{t('search.checkout')}</label>
        <div className="mt-1 relative rounded-xl shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
               <CalendarIcon className="h-5 w-5 text-slate-500" />
             </div>
            <input
              type="date"
              id="checkout"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              min={checkin || today}
              className={inputBaseClasses}
              required
            />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
        <div className="col-span-1">
            <label htmlFor="guests" className="block text-sm font-medium text-white/90">{t('search.guests')}</label>
            <div className="mt-1 relative rounded-xl shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
                    <UsersIcon className="h-5 w-5 text-slate-500" />
                </div>
                <input
                    type="number"
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    min="1"
                    className={inputBaseClasses}
                    required
                />
            </div>
        </div>
        <button
            type="submit"
            disabled={isLoading}
            className="col-span-1 self-end w-full h-12 inline-flex items-center justify-center rounded-xl border border-transparent bg-primary-600 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-transform duration-200 hover:scale-105 active:scale-98"
          >
           {isLoading ? '...' : t('search.button')}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;

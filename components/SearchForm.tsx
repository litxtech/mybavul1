import React, { useState } from 'react';
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
]

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [city, setCity] = useState('barcelona');
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city, checkin, checkout, guests });
  };
  
  const inputBaseClasses = "block w-full rounded-xl border-transparent ps-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm h-12 text-slate-900 placeholder-slate-400";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-left">
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <label htmlFor="city" className="block text-sm font-medium text-white/90">{t('search.destination')}</label>
        <div className="mt-1 relative rounded-xl shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
            <LocationIcon className="h-5 w-5 text-slate-500" />
          </div>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputBaseClasses}
            required
          >
            {supportedCities.map(c => (
              <option key={c.key} value={c.key}>{t(`city.${c.key}`) || c.value}</option>
            ))}
          </select>
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
import React, { useState } from 'react';
import { SearchParams } from '../types';
import { LocationIcon, CalendarIcon, UsersIcon } from './icons';
import { useLanguage } from '../i18n';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const [city, setCity] = useState('');
  const [checkin, setCheckin] = useState(today);
  const [checkout, setCheckout] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ city, checkin, checkout, guests });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <label htmlFor="city" className="block text-sm font-medium text-gray-200">{t('search.destination')}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
            <LocationIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full rounded-md border-gray-300 ps-10 focus:border-red-500 focus:ring-red-500 sm:text-sm h-12"
            placeholder={t('search.placeholder')}
            required
          />
        </div>
      </div>
      
      <div className="col-span-1">
        <label htmlFor="checkin" className="block text-sm font-medium text-gray-200">{t('search.checkin')}</label>
         <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
               <CalendarIcon className="h-5 w-5 text-gray-400" />
             </div>
            <input
              type="date"
              id="checkin"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              min={today}
              className="block w-full rounded-md border-gray-300 ps-10 focus:border-red-500 focus:ring-red-500 sm:text-sm h-12"
              required
            />
        </div>
      </div>

      <div className="col-span-1">
        <label htmlFor="checkout" className="block text-sm font-medium text-gray-200">{t('search.checkout')}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
               <CalendarIcon className="h-5 w-5 text-gray-400" />
             </div>
            <input
              type="date"
              id="checkout"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              min={checkin || today}
              className="block w-full rounded-md border-gray-300 ps-10 focus:border-red-500 focus:ring-red-500 sm:text-sm h-12"
              required
            />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 gap-4">
        <div className="col-span-1">
            <label htmlFor="guests" className="block text-sm font-medium text-gray-200">{t('search.guests')}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3">
                    <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="number"
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))}
                    min="1"
                    className="block w-full rounded-md border-gray-300 ps-10 focus:border-red-500 focus:ring-red-500 sm:text-sm h-12"
                    required
                />
            </div>
        </div>
        <button
            type="submit"
            disabled={isLoading}
            className="col-span-1 self-end w-full h-12 inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
           {isLoading ? '...' : t('search.button')}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
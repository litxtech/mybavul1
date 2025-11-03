import React, { useState, useEffect, useRef } from 'react';
import { Property, RoomType, RatePlan, SearchParams } from '../types';
import { StarIcon, UsersIcon, ArrowLeftIcon, SparklesIcon, ShieldCheckIcon } from './icons';
import { getAIAssistantResponse } from '../services/geminiService';
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { createBookingAndCheckout } from '../services/bookingService';
import { useCurrency } from '../contexts/CurrencyContext';

interface PropertyDetailsProps {
  property: Property;
  searchParams: SearchParams;
  onBack: () => void;
  openAuthModal: () => void;
}

// Utility to calculate the number of nights
const getDurationInNights = (checkin: string, checkout: string): number => {
    const startDate = new Date(checkin);
    const endDate = new Date(checkout);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
};


const AIAssistant: React.FC<{ property: Property }> = ({ property }) => {
  const { t, language } = useLanguage();
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const streamingTextRef = useRef('');

  const handleAskAI = async () => {
    if (isLoading) return;
    setIsOpen(true);
    setIsLoading(true);
    setResponse('');
    streamingTextRef.current = '';

    const stream = getAIAssistantResponse(property.title, property.location_city, language.code, language.name);
    try {
      for await (const chunk of stream) {
        streamingTextRef.current += chunk;
        setResponse(streamingTextRef.current);
      }
    } catch (error) {
      console.error(error);
      setResponse("An error occurred while fetching the AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="text-start">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <SparklesIcon className="w-8 h-8 me-3 text-red-500" />
            {t('ai.title')}
          </h3>
          <p className="text-gray-600 mt-1">{t('ai.subtitle')}</p>
        </div>
        <button
          onClick={handleAskAI}
          disabled={isLoading}
          className="mt-4 sm:mt-0 flex-shrink-0 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? t('ai.button.loading') : t('ai.button')}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-inner prose prose-sm max-w-none text-start">
          {response ? (
            <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }} />
          ) : (
            <p className="text-gray-500 animate-pulse">{t('ai.loadingMessage')}</p>
          )}
        </div>
      )}
    </div>
  );
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, searchParams, onBack, openAuthModal }) => {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { currency, formatCurrency, convertFromUSD } = useCurrency();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedRate, setSelectedRate] = useState<RatePlan | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const durationNights = getDurationInNights(searchParams.checkin, searchParams.checkout);

  const handleBookNow = async () => {
    if (!session?.user || !selectedRoom || !selectedRate) return;

    setBookingStatus('loading');
    setErrorMessage('');

    try {
      await createBookingAndCheckout({
        userId: session.user.id,
        property,
        room: selectedRoom,
        rate: selectedRate,
        searchParams,
        displayCurrency: currency
      });
      // The user will be redirected to Stripe by the service
    } catch (error) {
      console.error(error);
      setBookingStatus('error');
      setErrorMessage(t('booking.error'));
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center text-red-600 hover:text-red-800 font-medium mb-4">
        <ArrowLeftIcon className="w-5 h-5 me-2 transform rtl:scale-x-[-1]" />
        {t('details.backToResults')}
      </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <img className="h-96 w-full object-cover" src={property.photos[0]} alt={property.title} />
          </div>
          <div className="hidden md:grid grid-cols-1 gap-1">
             <img className="h-48 w-full object-cover" src={property.photos[1]} alt={property.title} />
             <img className="h-48 w-full object-cover" src={property.photos[2]} alt={property.title} />
          </div>
        </div>
        
        <div className="p-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{property.title}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
                {[...Array(property.star_rating)].map((_, i) => (
                  <StarIcon key={i} className="h-6 w-6 text-yellow-400" />
                ))}
            </div>
            <span className="ms-4 text-gray-600">{property.location_city}, {property.location_country}</span>
          </div>
          <p className="mt-4 text-lg text-gray-600">{property.description}</p>
          
          <AIAssistant property={property} />

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-800">{t('details.chooseRoom')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {property.room_types && property.room_types.map((room) => (
              <div key={room.id} className={`border-2 p-4 rounded-lg cursor-pointer transition-all ${selectedRoom?.id === room.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`} onClick={() => { setSelectedRoom(room); setSelectedRate(null); }}>
                <img src={room.photos[0]} alt={room.name} className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <div className="flex items-center text-gray-500 mt-1">
                  <UsersIcon className="w-5 h-5 me-2" />
                  <span>{t('details.guestsUpTo', {count: room.capacity})}</span>
                </div>
                {selectedRoom?.id === room.id && (
                  <div className="mt-4 space-y-3">
                    {room.rate_plans && room.rate_plans.map(rate => (
                       <div key={rate.id} className={`p-3 rounded-md cursor-pointer transition-colors ${selectedRate?.id === rate.id ? 'bg-red-200 shadow-inner' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={(e) => { e.stopPropagation(); setSelectedRate(rate); }}>
                         <div className="flex justify-between items-center">
                           <span className="font-medium">{rate.name}</span>
                           <span className="font-bold text-lg text-red-700">{formatCurrency(rate.price_per_night_usd_minor)}</span>
                         </div>
                         <div className={`flex items-center text-sm mt-1 ${rate.refundable ? 'text-green-600' : 'text-gray-500'}`}>
                            {rate.refundable && <ShieldCheckIcon className="w-4 h-4 me-1" />}
                            <span>{rate.refundable ? t('details.refundable') : t('details.nonRefundable')}</span>
                         </div>
                         <p className="text-sm text-gray-600">{rate.cancellation_policy}</p>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {selectedRoom && selectedRate && (
            <div className="mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-center mb-4">{t('details.yourSelection')}</h3>
              <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                      <span className="text-gray-600">{t('details.room')}:</span>
                      <span className="font-semibold text-gray-900">{selectedRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-600">{t('details.plan')}:</span>
                      <span className="font-semibold text-gray-900">{selectedRate.name}</span>
                  </div>
                   <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="text-gray-600">{t('details.nights', {count: durationNights})}:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(selectedRate.price_per_night_usd_minor)} x {durationNights}</span>
                  </div>
                   <div className="flex justify-between items-baseline border-t pt-3 mt-3">
                      <span className="text-2xl font-bold text-gray-900">{t('details.total')}:</span>
                      <span className="text-3xl font-extrabold text-red-600">{formatCurrency(selectedRate.price_per_night_usd_minor * durationNights)}</span>
                  </div>
              </div>
              <div className="mt-6 text-center">
                {session ? (
                  <button 
                    onClick={handleBookNow}
                    disabled={bookingStatus === 'loading'}
                    className="w-full max-w-sm bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition-colors disabled:bg-gray-400">
                    {bookingStatus === 'loading' ? t('booking.redirectingToPayment') : t('details.bookNow')}
                  </button>
                ) : (
                  <button 
                    onClick={openAuthModal}
                    className="w-full max-w-sm bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-red-700 transition-colors">
                    {t('details.loginToBook')}
                  </button>
                )}
              </div>
               {bookingStatus === 'error' && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
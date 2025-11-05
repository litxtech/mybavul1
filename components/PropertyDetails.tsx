import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Property, RoomType, RatePlan, SearchParams, Review, AvailabilityResponse } from '../types';
import { StarIcon, UsersIcon, ArrowLeftIcon, SparklesIcon, ShieldCheckIcon, TagIcon, ChatBubbleLeftRightIcon, HeartIcon, HeartIconOutline } from './icons';
import { Chat } from "@google/genai";
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { createBookingAndCheckout } from '../services/bookingService';
import { useCurrency } from '../contexts/CurrencyContext';
import PhotoGalleryModal from './PhotoGalleryModal';
import { getSupabaseClient } from '../lib/supabase';
import { useWishlist } from '../contexts/WishlistContext';
import { createAIAssistantChat } from '../services/geminiService';

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

const AvailabilityStatus: React.FC<{ status: 'loading' | 'available' | 'unavailable' | 'error' }> = ({ status }) => {
    const { t } = useLanguage();
    
    if (status === 'loading') {
        return <div className="p-4 bg-blue-50 dark:bg-slate-700/50 text-blue-800 dark:text-blue-200 rounded-lg text-center animate-pulse">{t('details.availability.checking')}</div>;
    }
    if (status === 'available') {
        return <div className="p-4 bg-green-50 dark:bg-slate-700/50 text-green-800 dark:text-green-200 rounded-lg text-center font-semibold">{t('details.availability.available')}</div>;
    }
    if (status === 'unavailable') {
         return <div className="p-4 bg-red-50 dark:bg-slate-700/50 text-red-800 dark:text-red-200 rounded-lg text-center font-semibold">{t('details.availability.unavailable')}</div>;
    }
    return null;
}

const ConversationalAIAssistant: React.FC<{ property: Property }> = ({ property }) => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model' | 'system', content: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // FIX: Imported 'useRef' from react to resolve 'Cannot find name' error.
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            const chat = createAIAssistantChat(property.title, property.location_city, language.name);
            if (chat) {
                chatRef.current = chat;
                setMessages([{ role: 'system', content: `Hi! I'm your AI assistant. Ask me anything about the area around ${property.title}!` }]);
            } else {
                setMessages([{ role: 'system', content: "Sorry, the AI Assistant is not available due to a configuration issue." }]);
            }
        }
    }, [isOpen, property, language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!userInput.trim() || isLoading || !chatRef.current) return;

        const newUserMessage = { role: 'user' as const, content: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const responseStream = await chatRef.current.sendMessageStream({ message: userInput });
            
            let currentModelMessage = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of responseStream) {
                currentModelMessage += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = currentModelMessage;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setMessages(prev => [...prev, { role: 'system', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-30 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-transform hover:scale-110"
                aria-label={t('ai.title')}
            >
                <SparklesIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-md h-[70vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        <header className="p-4 bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <SparklesIcon className="w-6 h-6 text-primary-600" />
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{t('ai.title')}</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </header>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                                        msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 
                                        msg.role === 'system' ? 'bg-amber-100 text-amber-800 text-sm' : 
                                        'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-4 py-2">
                                        <span className="animate-pulse">...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <footer className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={e => setUserInput(e.target.value)}
                                    placeholder="Ask about local food..."
                                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700"
                                    disabled={isLoading || !chatRef.current}
                                />
                                <button type="submit" className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 disabled:bg-slate-400" disabled={isLoading || !userInput.trim() || !chatRef.current}>
                                    &uarr;
                                </button>
                            </form>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, searchParams, onBack, openAuthModal }) => {
  const { t, formatDate } = useLanguage();
  const { session } = useAuth();
  const { formatCurrency, currency: displayCurrency } = useCurrency();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedRate, setSelectedRate] = useState<RatePlan | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  
  // State for real-time availability check
  const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  const isWishlisted = useMemo(() => wishlist.some(item => item.property_id === property.id), [wishlist, property.id]);

  useEffect(() => {
    const fetchReviews = async () => {
        setIsLoadingReviews(true);
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(raw_user_meta_data)')
            .eq('property_id', property.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching reviews:", error);
        } else {
            setReviews(data as Review[]);
        }
        setIsLoadingReviews(false);
    };
    
    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.functions.invoke('check-availability', {
        body: {
          propertyId: property.id,
          checkin: searchParams.checkin,
          checkout: searchParams.checkout,
          guests: searchParams.guests,
        }
      });
      if (error) {
        console.error("Error checking availability:", error);
        setAvailabilityData({ isAvailable: false, rates: [] }); // Assume unavailable on error
      } else {
        setAvailabilityData(data);
        // Pre-select the first available room and rate
        if (data.isAvailable && data.rates.length > 0) {
            const firstAvailableRate = data.rates[0];
            const room = property.room_types?.find(r => r.id === firstAvailableRate.room_type_id);
            const rate = room?.rate_plans?.find(p => p.id === firstAvailableRate.rate_plan_id);
            if (room && rate) {
                setSelectedRoom(room);
                setSelectedRate(rate);
            }
        }
      }
      setIsCheckingAvailability(false);
    };

    fetchReviews();
    checkAvailability();
  }, [property.id, searchParams]);
  
  const { averageRating, reviewCount } = useMemo(() => {
    if (reviews.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
        averageRating: totalRating / reviews.length,
        reviewCount: reviews.length,
    };
  }, [reviews]);


  const handleBookNow = async () => {
    if (!session?.user) {
        openAuthModal();
        return;
    }
    if (!selectedRoom || !selectedRate) return;

    setIsBooking(true);
    setBookingError('');
    try {
      await createBookingAndCheckout({
        userId: session.user.id,
        property,
        room: selectedRoom,
        rate: selectedRate,
        searchParams,
        displayCurrency
      });
    } catch (error: any) {
      setBookingError(error.message || t('booking.error'));
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const handleWishlistClick = () => {
    if (!session) {
      openAuthModal();
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property.id);
    }
  };

  const openGallery = (index: number) => {
    setGalleryStartIndex(index);
    setGalleryOpen(true);
  }

  const durationNights = getDurationInNights(searchParams.checkin, searchParams.checkout);
  const totalCost = selectedRate ? selectedRate.price_per_night_usd_minor * durationNights : 0;
  
  const getUrgencyMessage = (ratePlanId: string): string | null => {
      const rateInfo = availabilityData?.rates.find(r => r.rate_plan_id === ratePlanId);
      if (rateInfo?.rooms_left && rateInfo.rooms_left <= 3) {
          return t('details.availability.onlyXLeft', { count: rateInfo.rooms_left });
      }
      return null;
  }

  return (
    <>
      <PhotoGalleryModal isOpen={isGalleryOpen} onClose={() => setGalleryOpen(false)} images={property.photos} startIndex={galleryStartIndex} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="flex items-center text-primary-600 font-medium mb-6">
          <ArrowLeftIcon className="w-5 h-5 me-2" />
          {t('details.backToResults')}
        </button>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{property.title}</h1>
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                  {[...Array(5)].map((_, i) => <React.Fragment key={i}><StarIcon className={`h-5 w-5 ${i < property.star_rating ? 'text-yellow-400' : 'text-slate-300'}`} /></React.Fragment>)}
              </div>
              <span className="ms-2 text-slate-600 dark:text-slate-400">({reviewCount} {t('card.reviews', { count: reviewCount })})</span>
            </div>
          </div>
          {session && (
            <button 
              onClick={handleWishlistClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isWishlisted ? <HeartIcon className="w-6 h-6 text-red-500"/> : <HeartIconOutline className="w-6 h-6"/>}
              <span className="font-semibold hidden sm:inline">{isWishlisted ? "Favorilerde" : "Favorilere Ekle"}</span>
            </button>
          )}
        </div>
        
        {/* Photo Gallery */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 h-[400px]">
            <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openGallery(0)}>
                <img src={property.photos[0]} alt="Main view" className="w-full h-full object-cover rounded-l-xl"/>
            </div>
            {property.photos.slice(1, 5).map((photo, index) => (
                <div key={index} className={`cursor-pointer ${index === 1 ? 'rounded-tr-xl' : ''} ${index === 3 ? 'rounded-br-xl' : ''} overflow-hidden`} onClick={() => openGallery(index + 1)}>
                    <img src={photo} alt={`View ${index + 2}`} className="w-full h-full object-cover"/>
                </div>
            ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <p className="text-slate-600 dark:text-slate-300">{property.description}</p>
            
            {/* Room Selection */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">{t('details.chooseRoom')}</h2>
              <div className="mb-4">
                  <AvailabilityStatus status={isCheckingAvailability ? 'loading' : (availabilityData?.isAvailable ? 'available' : 'unavailable')} />
              </div>
              <div className="space-y-4">
                {property.room_types?.map(room => (
                  <div key={room.id} className={`p-4 border rounded-lg ${selectedRoom?.id === room.id ? 'border-primary-500 ring-2 ring-primary-500' : 'border-slate-300 dark:border-slate-700'}`}>
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center"><UsersIcon className="w-4 h-4 me-1"/>{t('details.guestsUpTo', {count: room.capacity})}</p>
                    
                    <div className="mt-4 space-y-2">
                      {room.rate_plans?.map(rate => {
                        const isAvailable = availabilityData?.rates.some(r => r.rate_plan_id === rate.id) ?? false;
                        const urgencyMessage = getUrgencyMessage(rate.id);

                        return (
                          <div key={rate.id} 
                               onClick={() => isAvailable && (setSelectedRoom(room), setSelectedRate(rate))}
                               className={`flex justify-between items-center p-3 rounded-md ${
                                   !isAvailable 
                                   ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                                   : selectedRate?.id === rate.id 
                                   ? 'bg-primary-50 dark:bg-slate-700 ring-2 ring-primary-400' 
                                   : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'
                                }`}>
                            <div>
                              <p className="font-semibold">{rate.name}</p>
                              <p className="text-xs text-slate-500">{rate.cancellation_policy}</p>
                               {urgencyMessage && <p className="text-xs font-bold text-red-500 mt-1">{urgencyMessage}</p>}
                            </div>
                            <p className="font-bold text-lg">{formatCurrency(rate.price_per_night_usd_minor)} <span className="text-sm font-normal text-slate-500">{t('card.perNight')}</span></p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">{t('reviews.title')}</h2>
                {isLoadingReviews ? <p>{t('loading')}</p> : reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b pb-4 dark:border-slate-700">
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center">
                                        {/* FIX: Wrapped StarIcon in a React.Fragment to correctly handle the `key` prop, which is reserved by React for list reconciliation and should not be passed to child components. */}
                                        {[...Array(5)].map((_, i) => <React.Fragment key={i}><StarIcon className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} /></React.Fragment>)}
                                    </div>
                                    <p className="ml-4 font-semibold">{review.profiles?.raw_user_meta_data?.name || 'Anonymous'}</p>
                                </div>
                                <p className="text-gray-600 dark:text-slate-300">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>{t('reviews.noReviews')}</p>}
            </div>
            
          </div>
          
          {/* Booking Widget */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border dark:border-slate-700">
                {selectedRate && availabilityData?.isAvailable ? (
                    <>
                        <p className="text-2xl font-bold">{formatCurrency(totalCost)} <span className="text-base font-normal text-slate-500">({durationNights} {durationNights > 1 ? t('details.nights_other', { count: durationNights }) : t('details.nights_one')})</span></p>
                        <hr className="my-4 dark:border-slate-600" />
                        <h3 className="font-bold mb-2">{t('details.yourSelection')}</h3>
                        <p><span className="font-semibold">{t('details.room')}:</span> {selectedRoom?.name}</p>
                        <p><span className="font-semibold">{t('details.plan')}:</span> {selectedRate.name}</p>
                        <p><span className="font-semibold">{t('search.checkin')}:</span> {formatDate(searchParams.checkin)}</p>
                        <p><span className="font-semibold">{t('search.checkout')}:</span> {formatDate(searchParams.checkout)}</p>
                        <p><span className="font-semibold">{t('search.guests')}:</span> {searchParams.guests}</p>
                        <hr className="my-4 dark:border-slate-600" />
                        <button onClick={handleBookNow} disabled={isBooking || isCheckingAvailability} className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 disabled:bg-slate-400">
                           {!session ? t('details.loginToBook') : isBooking ? t('booking.redirectingToPayment') : t('details.bookNow')}
                        </button>
                        {bookingError && <p className="text-red-500 text-sm mt-2">{bookingError}</p>}
                    </>
                ) : <p>{t(isCheckingAvailability ? 'details.availability.checking' : 'details.availability.unavailable')}</p>}
            </div>
          </aside>
        </div>
      </div>
      <ConversationalAIAssistant property={property} />
    </>
  );
};

export default PropertyDetails;
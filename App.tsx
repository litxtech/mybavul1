import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PropertyDetails from './components/PropertyDetails';
import HomePage from './components/HomePage';
import { Property, SearchParams, Booking } from './types';
import { useLanguage } from './i18n';
import Auth from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import MyReservations from './components/MyReservations';
import PropertyCard from './components/PropertyCard';
import { useCurrency } from './contexts/CurrencyContext';

type View = 'HOME' | 'RESULTS' | 'DETAILS' | 'RESERVATIONS' | 'BOOKING_SUCCESS' | 'BOOKING_CANCELLED';

const parseHash = () => {
    const hash = window.location.hash.substring(2); // remove #/
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString);
    const pathParts = path.split('/');
    
    return { path, params, pathParts };
}

const BookingSuccess: React.FC<{ bookingId: string }> = ({ bookingId }) => {
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('bookings')
                .select(`*, properties(title, location_city, photos), room_types(name)`)
                .eq('id', bookingId)
                .single();
            
            if (error) {
                console.error("Error fetching confirmed booking", error);
            } else {
                setBooking(data as Booking);
            }
            setLoading(false);
        };
        fetchBooking();
    }, [bookingId]);

    return (
        <div className="text-center py-20 max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-green-600">{t('booking.success.title')}</h2>
            <p className="mt-4">{t('booking.success.message')}</p>
            
            {loading ? <p className='mt-6'>{t('loading')}</p> : booking && (
                <div className="mt-8 text-left bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-xl font-bold mb-4">{booking.properties?.title}</h3>
                    <img src={booking.properties?.photos?.[0]} alt={booking.properties?.title} className="w-full h-48 object-cover rounded-md mb-4"/>
                    <p><strong>{t('details.room')}:</strong> {booking.room_types?.name}</p>
                    <p><strong>{t('search.checkin')}:</strong> {formatDate(booking.checkin_date)}</p>
                    <p><strong>{t('search.checkout')}:</strong> {formatDate(booking.checkout_date)}</p>
                    <p className="text-2xl font-bold mt-4 text-right">
                        {t('details.total')}: {formatCurrency(booking.total_price_display_minor, getCurrencyByCode(booking.display_currency))}
                    </p>
                </div>
            )}

            <a href="#/reservations" className="inline-block mt-8 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700">
                {t('booking.success.button')}
            </a>
        </div>
    );
};

const SearchResults: React.FC<{ properties: Property[], searchParams: SearchParams }> = ({ properties, searchParams }) => {
    const { t } = useLanguage();
    const [sortBy, setSortBy] = useState('price');
    const [filterFreeCancellation, setFilterFreeCancellation] = useState(false);

    const filteredAndSortedProperties = useMemo(() => {
        let processedProperties = [...properties];

        // Filtering
        if (filterFreeCancellation) {
            processedProperties = processedProperties.filter(p => 
                p.room_types?.some(rt => rt.rate_plans?.some(rp => rp.refundable))
            );
        }
        
        // Sorting
        processedProperties.sort((a, b) => {
            if (sortBy === 'price') {
                const priceA = Math.min(...a.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);
                const priceB = Math.min(...b.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);
                return priceA - priceB;
            }
            if (sortBy === 'stars') {
                return b.star_rating - a.star_rating;
            }
            return 0;
        });

        return processedProperties;
    }, [properties, sortBy, filterFreeCancellation]);
    
    return (
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <a href="#/" className="text-red-600 hover:text-red-800 font-medium mb-6 inline-block">
              &larr; {t('results.backToHome')}
            </a>
            <h2 className="text-3xl font-bold mb-2">{t('results.title', { city: searchParams?.city || t('results.allDestinations') })}</h2>
            
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 my-6 p-4 bg-white rounded-lg shadow">
                {/* Sorting */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="sort" className="font-medium">{t('results.sort.title')}</label>
                    <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                        <option value="price">{t('results.sort.price')}</option>
                        <option value="stars">{t('results.sort.stars')}</option>
                    </select>
                </div>
                {/* Filtering */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="freeCancellation" className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" id="freeCancellation" checked={filterFreeCancellation} onChange={e => setFilterFreeCancellation(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <span className="font-medium">{t('results.filter.freeCancellation')}</span>
                    </label>
                </div>
            </div>

            {filteredAndSortedProperties.length > 0 ? (
                <div className="space-y-6">
                    {filteredAndSortedProperties.map(property => (
                        <PropertyCard key={property.id} property={property} onSelect={() => window.location.hash = `#/property/${property.id}?${new URLSearchParams(searchParams as any).toString()}`} />
                    ))}
                </div>
            ) : (
                <p>{t('results.noResults')}</p>
            )}
          </div>
        </div>
      );
}

const App: React.FC = () => {
  const { t } = useLanguage();
  const [route, setRoute] = useState(parseHash());
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    
    let query = supabase
      .from('properties')
      .select('*, room_types(*, rate_plans(*))');

    if (params.city) {
      query = query.ilike('location_city', `%${params.city}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching properties:', error);
      setSearchResults([]);
    } else {
      setSearchResults(data || []);
    }
    
    window.location.hash = `#/search?${new URLSearchParams(params as any).toString()}`;
    setIsLoading(false);
  }, []);

  const handleBackToResults = useCallback(() => {
    const { params } = route;
    window.location.hash = `#/search?city=${params.get('city')}&checkin=${params.get('checkin')}&checkout=${params.get('checkout')}&guests=${params.get('guests')}`;
  }, [route]);

  // Fetch single property if needed (e.g., direct navigation)
  useEffect(() => {
    const { pathParts } = route;
    if (pathParts[0] === 'property' && pathParts[1]) {
      const propertyId = pathParts[1];
      // Find from existing search results if possible
      const found = searchResults.find(p => p.id === propertyId);
      if (found) {
        setSelectedProperty(found);
      } else {
        // Fetch from DB
        const fetchProperty = async () => {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('properties')
            .select('*, room_types(*, rate_plans(*))')
            .eq('id', propertyId)
            .single();
          if (error) console.error("Error fetching property details", error);
          else setSelectedProperty(data);
          setIsLoading(false);
        };
        fetchProperty();
      }
    }
  }, [route, searchResults]);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const renderContent = () => {
    const { path, params, pathParts } = route;
    
    const searchParams = {
        city: params.get('city') || '',
        checkin: params.get('checkin') || '',
        checkout: params.get('checkout') || '',
        guests: parseInt(params.get('guests') || '1', 10)
    };
    
    if (path === 'search') {
      return <SearchResults properties={searchResults} searchParams={searchParams} />;
    }
    
    if (path.startsWith('property/')) {
        if (isLoading) return <p className="p-8 text-center">{t('loading')}</p>
        if (selectedProperty) {
            return <PropertyDetails property={selectedProperty} searchParams={searchParams} onBack={handleBackToResults} openAuthModal={() => setAuthModalOpen(true)} />;
        }
        return <p className="p-8 text-center">{t('loading')}</p>;
    }
    
    if (path === 'reservations') {
        return <MyReservations />;
    }

    if (path.startsWith('booking/success')) {
        const bookingId = params.get('booking_id');
        return bookingId ? <BookingSuccess bookingId={bookingId} /> : <p>Error: No booking ID.</p>;
    }
    
    if (path.startsWith('booking/cancelled')) {
         return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold text-red-600">{t('booking.cancelled.title')}</h2>
                <p className="mt-4">{t('booking.cancelled.message')}</p>
                <a href="#/" className="inline-block mt-6 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
                    {t('booking.cancelled.button')}
                </a>
            </div>
        );
    }
    
    // Default to home
    return <HomePage onSearch={handleSearch} isLoading={isLoading} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={(view) => {
          if (view === 'HOME') window.location.hash = '#/';
          if (view === 'RESERVATIONS') window.location.hash = '#/reservations';
      }} onAuthClick={() => setAuthModalOpen(true)}/>
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Auth isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;
import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import { Property, SearchParams, Booking } from './types';
import { useLanguage } from './i18n';
import Auth from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { getSupabaseClient } from './lib/supabase';
import { useCurrency } from './contexts/CurrencyContext';
import PropertyCardSkeleton from './components/PropertyCardSkeleton';

// --- Lazy Loaded Components ---
const PropertyDetails = lazy(() => import('./components/PropertyDetails'));
const MyReservations = lazy(() => import('./components/MyReservations'));
const SearchResultsPage = lazy(() => import('./components/SearchResultsPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const PolicyPage = lazy(() => import('./components/PolicyPage'));
const PartnerPortal = lazy(() => import('./components/PartnerPortal'));
const WishlistPage = lazy(() => import('./components/WishlistPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const SupportPage = lazy(() => import('./components/SupportPage'));
// --- End Lazy Loaded Components ---

const parseHash = () => {
    const hash = window.location.hash.substring(2); // remove #/
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString);
    const pathParts = path.split('/');
    
    return { path, params, pathParts };
}

const CenteredLoader: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex justify-center items-center h-96">
            <p>{t('loading')}</p>
        </div>
    );
}

const BookingSuccess: React.FC<{ bookingId: string }> = ({ bookingId }) => {
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            const supabase = getSupabaseClient();
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

            <a href="#/reservations" className="inline-block mt-8 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700">
                {t('booking.success.button')}
            </a>
        </div>
    );
};

const AccessDenied = () => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20 max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-red-600">{t('admin.accessDenied.title')}</h2>
            <p className="mt-4">{t('admin.accessDenied.message')}</p>
             <a href="#/" className="inline-block mt-8 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
                {t('booking.cancelled.button')}
            </a>
        </div>
    );
}

// Function to augment property data with mock types for filtering demonstration
const augmentPropertyData = (properties: Property[]): Property[] => {
    const propertyTypes = ['Hotel', 'Resort', 'Apartment', 'Villa'];
    const allAmenities = ['Pool', 'WiFi', 'Parking', 'Gym', 'Pet-Friendly', 'Spa', 'Restaurant'];
    return properties.map(p => ({
        ...p,
        propertyType: propertyTypes[p.id.charCodeAt(0) % propertyTypes.length],
        amenities: allAmenities.filter((_, index) => (p.id.charCodeAt(1) + index) % 3 === 0), // pseudo-random amenities
    }));
};

const App: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
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
    setSelectedProperty(null); // Clear any selected property
    
    // Construct the search hash
    const searchUrlParams = new URLSearchParams({
        city: params.city,
        checkin: params.checkin,
        checkout: params.checkout,
        guests: params.guests.toString()
    });
    window.location.hash = `#/search?${searchUrlParams.toString()}`;

    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.functions.invoke('search-hotels', {
            body: params
        });

        if (error) {
            throw error;
        }

        const augmentedData = augmentPropertyData(data.properties);
        setSearchResults(augmentedData);
        
    } catch (error: any) {
        console.error("Error during hotel search:", error);
        alert(`Search failed: ${error.message}`);
        setSearchResults([]); // Clear results on error
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleVisualSearch = useCallback((properties: Property[]) => {
    setIsLoading(true);
    setSelectedProperty(null);
    setSearchResults(properties);
    window.location.hash = '#/search?type=visual';
    // The search results page will manage its own loading state based on props.
    // We can turn this off after navigation.
    setTimeout(() => setIsLoading(false), 300);
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
      const found = searchResults.find(p => p.id === propertyId);
      if (found) {
        setSelectedProperty(found);
      } else {
        const fetchProperty = async () => {
          const supabase = getSupabaseClient();
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
    
    const searchParams: SearchParams = {
        city: params.get('city') || '',
        checkin: params.get('checkin') || '',
        checkout: params.get('checkout') || '',
        guests: parseInt(params.get('guests') || '1', 10),
        type: params.get('type') || undefined
    };
    
    if (path === 'search') {
      if (isLoading) {
        // Show skeleton loaders while fetching
        return (
          <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                  {/* Skeleton for filter box */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-6"></div>
                    <div className="space-y-6">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </aside>
                <main className="lg:col-span-3 space-y-6">
                  {Array.from({ length: 5 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                </main>
              </div>
            </div>
          </div>
        );
      }
      return <SearchResultsPage properties={searchResults} searchParams={searchParams} />;
    }
    
    if (path.startsWith('property/')) {
        if (isLoading) return <CenteredLoader />;
        if (selectedProperty) {
            return <PropertyDetails property={selectedProperty} searchParams={searchParams} onBack={handleBackToResults} openAuthModal={() => setAuthModalOpen(true)} />;
        }
        return <CenteredLoader />;
    }
    
    if (path === 'reservations') {
        return <MyReservations />;
    }
    if (path === 'wishlist') {
        return <WishlistPage />;
    }
     if (path === 'profile') {
        return <ProfilePage />;
    }
    if (path === 'support') {
      return <SupportPage />;
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
    
    if (path === 'admin') {
      if (profile?.role !== 'admin') {
        return <AccessDenied />;
      }
      return <AdminDashboard />;
    }

    if (path === 'partner') {
        return <PartnerPortal openAuthModal={() => setAuthModalOpen(true)} />;
    }

    if (path.startsWith('policy/')) {
      const slug = pathParts[1];
      return <PolicyPage slug={slug} />;
    }
    
    // Default to home
    return <HomePage onSearch={handleSearch} isLoading={isLoading} onVisualSearch={handleVisualSearch} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={(view) => {
          const viewMap = {
              HOME: '#/',
              RESERVATIONS: '#/reservations',
              ADMIN: '#/admin',
              PARTNER: '#/partner',
              WISHLIST: '#/wishlist',
              PROFILE: '#/profile'
          };
          window.location.hash = viewMap[view];
      }} onAuthClick={() => setAuthModalOpen(true)}/>
      <main className="flex-grow">
        <Suspense fallback={<CenteredLoader />}>
            {renderContent()}
        </Suspense>
      </main>
      <Auth isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;

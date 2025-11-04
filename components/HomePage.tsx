import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import { Property, SearchParams } from '../types';
import { useLanguage } from '../i18n';
import { SparklesIcon, TagIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, SunIcon, HomeModernIcon, MountainIcon, MercuryIcon, StripeIcon, PayPalIcon } from './icons';
import { getSupabaseClient } from '../lib/supabase';
import PropertyCard from './PropertyCard';


// ==================================
// SUB-COMPONENTS for HomePage
// ==================================

const HeroSection: React.FC<{ onSearch: (params: SearchParams) => void; isLoading: boolean; }> = ({ onSearch, isLoading }) => {
    const { t } = useLanguage();
    return (
        <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-white dark:text-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
            <img 
                src="https://images.unsplash.com/photo-1507525428034-b723a9ce6890?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1800&fit=max" 
                alt="Tropical beach background" 
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
            />
            <div className="relative z-20 text-center p-4 max-w-7xl mx-auto w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white animate-fade-in-up" style={{ animationDelay: '100ms', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {t('home.title')}
                </h1>
                <div className="mt-8 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <SearchForm onSearch={onSearch} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

const PopularDestinations: React.FC<{ onDestinationClick: (city: string) => void; }> = ({ onDestinationClick }) => {
    const { t } = useLanguage();
    const destinations = [
      { nameKey: 'city.istanbul', name: 'Istanbul', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
      { nameKey: 'Antalya', name: 'Antalya', image: 'https://images.unsplash.com/photo-1616837993519-c5b43343a419?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
      { nameKey: 'Cappadocia', name: 'Cappadocia', image: 'https://images.unsplash.com/photo-1583885611333-38257045b843?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
      { nameKey: 'city.barcelona', name: 'Barcelona', image: 'https://images.unsplash.com/photo-1523531294919-467a05d1d455?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
    ];
    
    return (
        <div className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{t('home.destinations.title')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {destinations.map(dest => (
                    <div key={dest.name} onClick={() => onDestinationClick(dest.name)} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      <img src={dest.image} alt={dest.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <h3 className="absolute bottom-5 left-5 rtl:right-5 text-2xl font-bold text-white" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.7)' }}>{t(dest.nameKey) || dest.name}</h3>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    );
};

const WhyChooseUs: React.FC = () => {
    const { t } = useLanguage();
    const features = [
      { name: 'home.features.ai.title', description: 'home.features.ai.desc', icon: <SparklesIcon className="w-8 h-8 text-primary-700" /> },
      { name: 'home.features.price.title', description: 'home.features.price.desc', icon: <TagIcon className="w-8 h-8 text-primary-700" /> },
      { name: 'home.features.support.title', description: 'home.features.support.desc', icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-700" /> },
    ];
    return (
         <div className="py-16 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">{t('home.features.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {features.map((feature, index) => (
                        <div key={feature.name} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${150 * index}ms`}}>
                             <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-primary-100 dark:bg-primary-900/50">
                                    {feature.icon}
                                </div>
                             </div>
                             <div className="mt-5">
                              <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">{t(feature.name)}</h3>
                              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">{t(feature.description)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PaymentPartnersStrip: React.FC = () => (
    <div className="py-8 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-4">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure Payments With:</h3>
                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
                    <StripeIcon className="h-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                    <PayPalIcon className="h-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                    <MercuryIcon className="h-8 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />
                </div>
            </div>
        </div>
    </div>
);


// ==================================
// MAIN HomePage COMPONENT
// ==================================

const HomePage: React.FC<{
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('properties')
        .select('*, room_types(*, rate_plans(*))')
        .order('review_score', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error("Error fetching featured properties:", error);
      } else {
        setFeaturedProperties(data || []);
      }
    };
    fetchFeatured();
  }, []);

  const handleDestinationClick = (city: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    onSearch({ city: city.toLowerCase(), checkin: today, checkout: tomorrow, guests: 2 });
  };
  
  const handlePropertySelect = (property: Property) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const params = new URLSearchParams({
        city: property.location_city.toLowerCase(),
        checkin: today,
        checkout: tomorrow,
        guests: '2'
    });
    window.location.hash = `#/property/${property.id}?${params.toString()}`;
  };

  return (
    <>
      <HeroSection onSearch={onSearch} isLoading={isLoading} />
      <PaymentPartnersStrip />
      <PopularDestinations onDestinationClick={handleDestinationClick} />
      
      {featuredProperties.length > 0 && (
        <div className="py-16 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{t('home.featured.title')}</h2>
            <div className="space-y-6">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} onSelect={handlePropertySelect} />
              ))}
            </div>
          </div>
        </div>
      )}
      
      <WhyChooseUs />
    </>
  );
};

export default HomePage;
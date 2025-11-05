import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import SearchForm from './SearchForm';
import { Property, SearchParams } from '../types';
import { useLanguage } from '../i18n';
import { SparklesIcon, TagIcon, ChatBubbleLeftRightIcon } from './icons';
import { getSupabaseClient } from '../lib/supabase';
import PropertyCard from './PropertyCard';
import ExpediaSearch from './ExpediaSearch';

const AIPlannerModal = lazy(() => import('./AIPlannerModal'));


// ==================================
// SUB-COMPONENTS for HomePage
// ==================================

const HeroSection: React.FC<{ onSearch: (params: SearchParams) => void; isLoading: boolean; onOpenAIPlanner: () => void; }> = ({ onSearch, isLoading, onOpenAIPlanner }) => {
    const { t } = useLanguage();
    return (
        <div className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-white dark:text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-10"></div>
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center animate-ken-burns"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528747045269-390a33c2a666?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
            ></div>
            <div className="relative z-20 text-center p-4 max-w-7xl mx-auto w-full">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {t('home.title')}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-4 max-w-2xl mx-auto text-lg text-white/90" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.5)'}}>
                    {t('home.subtitle')}
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-8 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
                    <SearchForm onSearch={onSearch} isLoading={isLoading} />
                </motion.div>
                 <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    onClick={onOpenAIPlanner}
                    className="mt-6 inline-flex items-center gap-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold hover:bg-white/30 transition-all duration-300"
                >
                    <SparklesIcon className="w-5 h-5" />
                    {t('ai.planner.button')}
                </motion.button>
            </div>
        </div>
    );
};

const PopularDestinations: React.FC<{ onDestinationClick: (city: string) => void; }> = ({ onDestinationClick }) => {
    const { t } = useLanguage();
    const destinations = [
      { nameKey: 'city.istanbul', name: 'Istanbul', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
      { nameKey: 'destination.antalya', name: 'Antalya', image: 'https://images.unsplash.com/photo-1601134883921-9e11523316f0?q=80&w=800&auto=format&fit=crop' },
      { nameKey: 'destination.cappadocia', name: 'Cappadocia', image: 'https://images.unsplash.com/photo-1577522501398-3d5f99facf39?q=80&w=800&auto=format&fit=crop' },
      { nameKey: 'city.barcelona', name: 'Barcelona', image: 'https://images.unsplash.com/photo-1523531294919-467a05d1d445?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
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

const CountryDestinations: React.FC<{ onCountryClick: (city: string) => void; }> = ({ onCountryClick }) => {
    const { t } = useLanguage();
    const countries = [
        { nameKey: 'country.turkey', name: 'Turkey', city: 'istanbul', image: 'https://images.unsplash.com/photo-1596328330953-2b963a4d3315?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.italy', name: 'Italy', city: 'rome', image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.spain', name: 'Spain', city: 'madrid', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.france', name: 'France', city: 'paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.greece', name: 'Greece', city: 'athens', image: 'https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.usa', name: 'United States', city: 'new york', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.uk', name: 'United Kingdom', city: 'london', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.japan', name: 'Japan', city: 'tokyo', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.thailand', name: 'Thailand', city: 'bangkok', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.uae', name: 'U.A.E.', city: 'dubai', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.germany', name: 'Germany', city: 'berlin', image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=80&w=800&auto=format&fit=crop' },
        { nameKey: 'country.netherlands', name: 'Netherlands', city: 'amsterdam', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800&auto=format&fit=crop' },
    ];

    return (
        <div className="py-16 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">{t('home.countries.title')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {countries.map(country => (
                        <div 
                            key={country.name} 
                            onClick={() => onCountryClick(country.city)} 
                            className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg transform hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <img src={country.image} alt={country.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <h3 className="absolute bottom-4 left-4 rtl:right-4 text-xl font-bold text-white" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.7)' }}>{t(country.nameKey) || country.name}</h3>
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

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
      }
    };
    
    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    return (
         <div className="py-16 bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">{t('home.features.title')}</h2>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                >
                    {features.map((feature) => (
                        <motion.div variants={itemVariants} key={feature.name} className="flex flex-col items-center">
                             <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-primary-100 dark:bg-primary-900/50">
                                    {feature.icon}
                                </div>
                             </div>
                             <div className="mt-5">
                              <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">{t(feature.name)}</h3>
                              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">{t(feature.description)}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const ListPropertyCTA: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-primary-700">
            <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">{t('home.cta.title')}</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-primary-200">
                    {t('home.cta.subtitle')}
                </p>
                <a
                    href="#/partner"
                    className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
                >
                    {t('home.cta.button')}
                </a>
            </div>
        </div>
    );
};


// ==================================
// MAIN HomePage COMPONENT
// ==================================

const HomePage: React.FC<{
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isAIPlannerOpen, setAIPlannerOpen] = useState(false);

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
  
  const handleCountryClick = (city: string) => {
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

  const handleAISearch = (params: SearchParams) => {
    setAIPlannerOpen(false);
    onSearch(params);
  };

  return (
    <>
      <HeroSection onSearch={onSearch} isLoading={isLoading} onOpenAIPlanner={() => setAIPlannerOpen(true)} />
      <Suspense fallback={null}>
        <AIPlannerModal 
          isOpen={isAIPlannerOpen}
          onClose={() => setAIPlannerOpen(false)}
          onSearch={handleAISearch}
        />
      </Suspense>
      <PopularDestinations onDestinationClick={handleDestinationClick} />
      <CountryDestinations onCountryClick={handleCountryClick} />
      
      <div className="py-8 bg-slate-50 dark:bg-slate-950">
        <ExpediaSearch />
      </div>
      
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
      <ListPropertyCTA />
    </>
  );
};

export default HomePage;

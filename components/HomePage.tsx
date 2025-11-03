import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import { Property, SearchParams } from '../types';
import { useLanguage } from '../i18n';
import { SparklesIcon, TagIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, SunIcon, HomeModernIcon, MountainIcon } from './icons';
import { getSupabaseClient } from '../lib/supabase';
import PropertyCard from './PropertyCard';


interface HomePageProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const destinations = [
  { name: 'Istanbul', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
  { name: 'Antalya', image: 'https://images.unsplash.com/photo-1616837993519-c5b43343a419?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
  { name: 'Cappadocia', image: 'https://images.unsplash.com/photo-1583885611333-38257045b843?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
  { name: 'Ankara', image: 'https://images.unsplash.com/photo-1621288419143-3c35b6c32104?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&fit=max' },
];

const propertyTypes = [
  { name: 'home.propertyTypes.boutique', icon: <BuildingOfficeIcon className="w-10 h-10 text-red-600" /> },
  { name: 'home.propertyTypes.resorts', icon: <SunIcon className="w-10 h-10 text-red-600" /> },
  { name: 'home.propertyTypes.villas', icon: <HomeModernIcon className="w-10 h-10 text-red-600" /> },
  { name: 'home.propertyTypes.cave', icon: <MountainIcon className="w-10 h-10 text-red-600" /> },
];

const features = [
  {
    name: 'home.features.ai.title',
    description: 'home.features.ai.desc',
    icon: <SparklesIcon className="w-8 h-8 text-red-700" />,
  },
  {
    name: 'home.features.price.title',
    description: 'home.features.price.desc',
    icon: <TagIcon className="w-8 h-8 text-red-700" />,
  },
  {
    name: 'home.features.support.title',
    description: 'home.features.support.desc',
    icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-red-700" />,
  },
]


const HomePage: React.FC<HomePageProps> = ({ onSearch, isLoading }) => {
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
    onSearch({ city, checkin: today, checkout: tomorrow, guests: 2 });
  };
  
  const handlePropertySelect = (property: Property) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    const params = new URLSearchParams({
        city: property.location_city,
        checkin: today,
        checkout: tomorrow,
        guests: '2'
    });
    window.location.hash = `#/property/${property.id}?${params.toString()}`;
  };

  return (
    <>
      <div className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img src="https://images.unsplash.com/photo-1507525428034-b723a9ce6890?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1800&fit=max" alt="Tropical beach background" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 text-center p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{t('home.title')}</h1>
          <p className="mt-4 text-lg md:text-xl font-light opacity-90">{t('home.subtitle')}</p>
          <div className="mt-8 bg-black/40 backdrop-blur-lg p-6 rounded-xl border border-white/20">
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t('home.destinations.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map(dest => (
                <div key={dest.name} onClick={() => handleDestinationClick(dest.name)} className="relative h-72 rounded-lg overflow-hidden group cursor-pointer shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 rtl:right-4 text-2xl font-bold text-white">{t(dest.name) || dest.name}</h3>
                </div>
              ))}
            </div>
        </div>
      </div>

      {featuredProperties.length > 0 && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t('home.featured.title')}</h2>
            <div className="space-y-6">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} onSelect={handlePropertySelect} />
              ))}
            </div>
          </div>
        </div>
      )}
      
       <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t('home.propertyTypes.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {propertyTypes.map(type => (
                <div key={type.name} className="bg-white p-6 rounded-lg text-center flex flex-col items-center hover:shadow-xl hover:bg-red-50 transition-all duration-300 cursor-pointer border hover:border-red-200">
                  {type.icon}
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">{t(type.name)}</h3>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="bg-red-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-center">
                 <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white">
                        {feature.icon}
                    </div>
                 </div>
                 <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-6 text-white">{t(feature.name)}</h3>
                  <p className="mt-2 text-base text-red-100">{t(feature.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default HomePage;
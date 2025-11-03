import React from 'react';
import SearchForm from './SearchForm';
import { SearchParams } from '../types';
import { useLanguage } from '../i18n';
import { SparklesIcon, ShieldCheckIcon, TagIcon, ChatBubbleLeftRightIcon, BuildingOfficeIcon, SunIcon, HomeModernIcon, MountainIcon } from './icons';

interface HomePageProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const destinations = [
  { name: 'Istanbul', image: 'https://picsum.photos/seed/dest_ist/800/600' },
  { name: 'Antalya', image: 'https://picsum.photos/seed/dest_ant/800/600' },
  { name: 'Cappadocia', image: 'https://picsum.photos/seed/dest_cap/800/600' },
  { name: 'Ankara', image: 'https://picsum.photos/seed/dest_ank/800/600' },
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
    icon: <SparklesIcon className="w-8 h-8 text-white" />,
  },
  {
    name: 'home.features.price.title',
    description: 'home.features.price.desc',
    icon: <TagIcon className="w-8 h-8 text-white" />,
  },
  {
    name: 'home.features.support.title',
    description: 'home.features.support.desc',
    icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />,
  },
]


const HomePage: React.FC<HomePageProps> = ({ onSearch, isLoading }) => {
  const { t } = useLanguage();

  const handleDestinationClick = (city: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    onSearch({ city, checkin: today, checkout: tomorrow, guests: 2 });
  };
  
  return (
    <>
      <div className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img src="https://picsum.photos/seed/homebg/1800/1200" alt="Travel background" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 text-center p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{t('home.title')}</h1>
          <p className="mt-4 text-lg md:text-xl font-light opacity-90">{t('home.subtitle')}</p>
          <div className="mt-8 bg-white/20 backdrop-blur-md p-4 rounded-xl">
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
      
       <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{t('home.propertyTypes.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {propertyTypes.map(type => (
                <div key={type.name} className="bg-gray-50 p-6 rounded-lg text-center flex flex-col items-center hover:shadow-xl hover:bg-red-50 transition-all duration-300 cursor-pointer">
                  {type.icon}
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">{t(type.name)}</h3>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">{t('home.features.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-center">
                 <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-600">
                        {feature.icon}
                    </div>
                 </div>
                 <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-6 text-white">{t(feature.name)}</h3>
                  <p className="mt-2 text-base text-gray-300">{t(feature.description)}</p>
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
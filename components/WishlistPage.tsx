import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../i18n';
import PropertyCard from './PropertyCard';
import { Property, SearchParams } from '../types';

const WishlistPage: React.FC = () => {
    const { t } = useLanguage();
    const { wishlist, loading } = useWishlist();

    const handlePropertySelect = (property: Property) => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
        const params: SearchParams = {
            city: property.location_city.toLowerCase(),
            checkin: today,
            checkout: tomorrow,
            guests: 2
        };
        window.location.hash = `#/property/${property.id}?${new URLSearchParams(params as any).toString()}`;
    };
    
    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><p>{t('loading')}</p></div>;
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">{t('wishlist.title')}</h1>
                {wishlist.length > 0 ? (
                    <div className="space-y-6">
                        {wishlist.map(item => item.properties && (
                             <PropertyCard 
                                key={item.property_id} 
                                property={item.properties} 
                                onSelect={handlePropertySelect} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">{t('wishlist.empty')}</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('wishlist.empty.prompt')}</p>
                        <a href="#/" className="mt-6 inline-block bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700">
                            {t('header.stays')}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
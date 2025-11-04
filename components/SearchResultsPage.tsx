import React, { useState, useMemo } from 'react';
import { Property, SearchParams } from '../types';
import { useLanguage } from '../i18n';
import { useCurrency } from '../contexts/CurrencyContext';
import PropertyCard from './PropertyCard';
import MapView from './MapView';
import { MapIcon, ListBulletIcon, StarIcon } from './icons';

interface SearchResultsPageProps {
    properties: Property[];
    searchParams: SearchParams;
}

const allAmenities = ['Pool', 'WiFi', 'Parking', 'Gym', 'Pet-Friendly', 'Spa', 'Restaurant'];
const propertyTypes = ['Hotel', 'Resort', 'Apartment', 'Villa'];

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ properties, searchParams }) => {
    const { t } = useLanguage();
    const { convertFromUSD } = useCurrency();
    const [sortBy, setSortBy] = useState('price_asc');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    
    // Filter states
    const [filterFreeCancellation, setFilterFreeCancellation] = useState(false);
    const [filterStarRating, setFilterStarRating] = useState(0); // 0 means all
    const [filterPriceRange, setFilterPriceRange] = useState({ min: 0, max: 1000 });
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

    const handleAmenityChange = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handlePropertyTypeChange = (type: string) => {
        setSelectedPropertyTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    }


    const filteredAndSortedProperties = useMemo(() => {
        let processedProperties = [...properties];

        // --- FILTERING LOGIC ---
        // Free Cancellation
        if (filterFreeCancellation) {
            processedProperties = processedProperties.filter(p => 
                p.room_types?.some(rt => rt.rate_plans?.some(rp => rp.refundable))
            );
        }
        
        // Star Rating
        if (filterStarRating > 0) {
            processedProperties = processedProperties.filter(p => p.star_rating >= filterStarRating);
        }

        // Price Range
        processedProperties = processedProperties.filter(p => {
            const minPriceUsdMinor = Math.min(...p.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);
            const minPriceDisplay = convertFromUSD(minPriceUsdMinor) / 100; // Convert to major unit for comparison
            return minPriceDisplay >= filterPriceRange.min && minPriceDisplay <= filterPriceRange.max;
        });

        // Amenities
        if (selectedAmenities.length > 0) {
            processedProperties = processedProperties.filter(p =>
                selectedAmenities.every(a => p.amenities?.includes(a))
            );
        }

        // Property Type
        if (selectedPropertyTypes.length > 0) {
             processedProperties = processedProperties.filter(p =>
                p.propertyType && selectedPropertyTypes.includes(p.propertyType)
            );
        }
        
        // --- SORTING LOGIC ---
        processedProperties.sort((a, b) => {
            const priceA = Math.min(...a.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);
            const priceB = Math.min(...b.room_types?.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]) || [Infinity]);

            if (sortBy === 'price_asc') return priceA - priceB;
            if (sortBy === 'price_desc') return priceB - priceA;
            if (sortBy === 'stars') return b.star_rating - a.star_rating;
            if (sortBy === 'reviews') return b.review_score - a.review_score;
            return 0;
        });

        return processedProperties;
    }, [properties, sortBy, filterFreeCancellation, filterStarRating, filterPriceRange, selectedAmenities, selectedPropertyTypes, convertFromUSD]);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <a href="#/" className="text-primary-600 hover:text-primary-800 font-medium mb-6 inline-block">
                    &larr; {t('results.backToHome')}
                </a>
                <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{t('results.title', { city: searchParams?.city || t('results.allDestinations') })}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{filteredAndSortedProperties.length} properties found.</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Column */}
                    <aside className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg self-start sticky top-24">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{t('results.filter.title')}</h3>
                            <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium">
                                {viewMode === 'list' ? <><MapIcon className="w-5 h-5"/> <span>{t('results.view.map')}</span></> : <><ListBulletIcon className="w-5 h-5"/> <span>{t('results.view.list')}</span></>}
                            </button>
                        </div>

                        <div className="space-y-6">
                             {/* Star Rating Filter */}
                            <div>
                                <h4 className="font-semibold mb-2">{t('results.filter.starRating')}</h4>
                                <div className="flex space-x-1">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <button key={star} onClick={() => setFilterStarRating(star)} className={`flex-1 p-2 rounded-md border-2 flex items-center justify-center ${filterStarRating === star ? 'bg-primary-500 text-white border-primary-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-primary-400'}`}>
                                            {star} <StarIcon className="w-4 h-4 ms-1 text-yellow-400"/>
                                        </button>
                                    ))}
                                </div>
                                {filterStarRating > 0 && <button onClick={() => setFilterStarRating(0)} className="text-xs text-primary-600 mt-2">Clear</button>}
                            </div>

                             {/* Price Range Filter */}
                            <div>
                                <h4 className="font-semibold mb-2">{t('results.filter.priceRange')}</h4>
                                <div className="flex items-center space-x-2">
                                    <input type="number" placeholder={t('results.filter.minPrice')} value={filterPriceRange.min || ''} onChange={e => setFilterPriceRange(p => ({...p, min: Number(e.target.value)}))} className="w-full p-2 rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                                    <span>-</span>
                                    <input type="number" placeholder={t('results.filter.maxPrice')} value={filterPriceRange.max || ''} onChange={e => setFilterPriceRange(p => ({...p, max: Number(e.target.value)}))} className="w-full p-2 rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600" />
                                </div>
                            </div>

                            {/* Property Type Filter */}
                            <div>
                                <h4 className="font-semibold mb-2">{t('results.filter.propertyType')}</h4>
                                <div className="space-y-2">
                                    {propertyTypes.map(type => (
                                        <label key={type} htmlFor={`type-${type}`} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" id={`type-${type}`} checked={selectedPropertyTypes.includes(type)} onChange={() => handlePropertyTypeChange(type)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Amenities Filter */}
                             <div>
                                <h4 className="font-semibold mb-2">{t('results.filter.amenities')}</h4>
                                <div className="space-y-2">
                                    {allAmenities.map(amenity => (
                                         <label key={amenity} htmlFor={`amenity-${amenity}`} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" id={`amenity-${amenity}`} checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                             {/* Other Filters */}
                             <div>
                                <label htmlFor="freeCancellation" className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" id="freeCancellation" checked={filterFreeCancellation} onChange={e => setFilterFreeCancellation(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                                    <span className="font-medium">{t('results.filter.freeCancellation')}</span>
                                </label>
                            </div>
                        </div>
                    </aside>
                    
                    {/* Results Column */}
                    <main className="lg:col-span-3">
                        <div className="flex justify-end items-center mb-4">
                             <div className="flex items-center space-x-2">
                                <label htmlFor="sort" className="font-medium text-sm">{t('results.sort.title')}</label>
                                <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-md border-gray-300 dark:bg-slate-800 dark:border-slate-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
                                    <option value="price_asc">{t('results.sort.price')} (asc)</option>
                                    <option value="price_desc">{t('results.sort.price')} (desc)</option>
                                    <option value="stars">{t('results.sort.stars')}</option>
                                    <option value="reviews">Reviews</option>
                                </select>
                            </div>
                        </div>
                        
                        {filteredAndSortedProperties.length > 0 ? (
                            viewMode === 'list' ? (
                                <div className="space-y-6">
                                    {filteredAndSortedProperties.map(property => (
                                        <PropertyCard key={property.id} property={property} onSelect={() => window.location.hash = `#/property/${property.id}?${new URLSearchParams(searchParams as any).toString()}`} />
                                    ))}
                                </div>
                            ) : (
                                <MapView properties={filteredAndSortedProperties} searchParams={searchParams} />
                            )
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg">
                                <h3 className="text-xl font-semibold">No properties found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters or searching for a different destination.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default SearchResultsPage;
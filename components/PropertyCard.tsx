import React from 'react';
import { Property } from '../types';
import { StarIcon, LocationIcon, ShieldCheckIcon } from './icons';
import { useLanguage } from '../i18n';
import { useCurrency } from '../contexts/CurrencyContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  const cheapestPriceUsdMinor = property.room_types
    ? Math.min(...property.room_types.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]))
    : 9900; // Placeholder in cents

  const hasFreeCancellation = property.room_types?.some(rt => rt.rate_plans?.some(rp => rp.refundable));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.02] transition-transform duration-300 ease-in-out cursor-pointer" onClick={() => onSelect(property)}>
      <div className="md:w-1/3">
        <img className="h-48 w-full object-cover md:h-full" src={property.photos[0]} alt={property.title} />
      </div>
      <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(property.star_rating)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
              {[...Array(5 - property.star_rating)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-gray-300" />
              ))}
            </div>
          </div>
          <p className="flex items-center mt-2 text-sm text-gray-500">
            <LocationIcon className="h-4 w-4 me-1"/>
            {property.location_city}, {property.location_country}
          </p>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{property.description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
             <div className="flex items-center">
               <span className="text-gray-900 font-semibold">{property.review_score.toFixed(1)}</span>
               <span className="text-gray-600 text-sm ms-1">{t('card.reviews', { count: property.review_count })}</span>
             </div>
             {hasFreeCancellation && (
                <div className="flex items-center mt-1 text-sm text-green-600 font-medium">
                  <ShieldCheckIcon className="w-4 h-4 me-1" />
                  {t('card.freeCancellation')}
                </div>
              )}
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">{t('card.from')}</span>
            <p className="text-2xl font-bold text-red-600">{isFinite(cheapestPriceUsdMinor) ? formatCurrency(cheapestPriceUsdMinor) : 'N/A'}</p>
            <span className="text-sm text-gray-600">{t('card.perNight')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
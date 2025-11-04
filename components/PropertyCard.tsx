import React from 'react';
import { Property } from '../types';
import { StarIcon, LocationIcon, ShieldCheckIcon, HeartIcon, HeartIconOutline } from './icons';
import { useLanguage } from '../i18n';
import { useCurrency } from '../contexts/CurrencyContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { session } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlist.some(item => item.property_id === property.id);

  const cheapestPriceUsdMinor = property.room_types
    ? Math.min(...property.room_types.flatMap(rt => rt.rate_plans?.map(rp => rp.price_per_night_usd_minor) || [Infinity]))
    : 9900; // Placeholder in cents

  const hasFreeCancellation = property.room_types?.some(rt => rt.rate_plans?.some(rp => rp.refundable));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (!session) {
      // Optionally, prompt user to log in
      alert("Please sign in to add properties to your wishlist.");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property.id);
    }
  };

  return (
    <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row cursor-pointer" 
        onClick={() => onSelect(property)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(property)}
        aria-label={`View details for ${property.title}`}
    >
      <div className="md:w-1/3 relative">
        <img className="h-48 w-full object-cover md:h-full" src={property.photos[0]} alt={property.title} loading="lazy" decoding="async" />
        {session && (
          <button 
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? <HeartIcon className="w-6 h-6 text-red-500"/> : <HeartIconOutline className="w-6 h-6"/>}
          </button>
        )}
      </div>
      <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{property.title}</h3>
          <div className="flex items-center mt-1">
            {/* FIX: Wrapped StarIcon in a React.Fragment to correctly handle the `key` prop in a loop, resolving a TypeScript error. */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                  <StarIcon className={`h-5 w-5 ${ i < property.star_rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} />
                </React.Fragment>
              ))}
            </div>
          </div>
          <p className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
            <LocationIcon className="h-4 w-4 me-1"/>
            {property.location_city}, {property.location_country}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{property.description}</p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div>
             <div className="flex items-center space-x-2">
               <span className="bg-primary-600 text-white font-bold text-sm px-2 py-1 rounded-md">{property.review_score.toFixed(1)}</span>
               <span className="text-slate-600 dark:text-slate-300 text-sm">{t('card.reviews', { count: property.review_count })}</span>
             </div>
             {hasFreeCancellation && (
                <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  <ShieldCheckIcon className="w-4 h-4 me-1" />
                  {t('card.freeCancellation')}
                </div>
              )}
          </div>
          <div className="text-right">
            <span className="text-sm text-slate-600 dark:text-slate-400">{t('card.from')}</span>
            <p className="text-2xl font-bold text-primary-600">{isFinite(cheapestPriceUsdMinor) ? formatCurrency(cheapestPriceUsdMinor) : 'N/A'}</p>
            <span className="text-sm text-slate-600 dark:text-slate-400">{t('card.perNight')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
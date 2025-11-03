import React, { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { Booking } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
import { cancelBooking } from '../services/bookingService';
import { ShieldCheckIcon } from './icons';

const CancelBookingModal: React.FC<{
    booking: Booking | null;
    onClose: () => void;
    onSuccess: (bookingId: string) => void;
}> = ({ booking, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success' | 'non-refundable'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCancel = async () => {
        if (!booking) return;
        if (!booking.rate_plans?.refundable) {
            setStatus('non-refundable');
            return;
        }

        setStatus('loading');
        try {
            await cancelBooking(booking.id);
            setStatus('success');
            onSuccess(booking.id);
            setTimeout(onClose, 2000); // Close modal after 2 seconds
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || t('reservations.cancelModal.error'));
        }
    };
    
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">{t('reservations.cancelModal.title')}</h2>
                {status === 'idle' && (
                    <>
                        <p className="mb-6">{t('reservations.cancelModal.body')}</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium">{t('reservations.cancelModal.goBack')}</button>
                            <button onClick={handleCancel} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium">{t('reservations.cancelModal.confirm')}</button>
                        </div>
                    </>
                )}
                 {status === 'loading' && <p>{t('reservations.cancelModal.cancelling')}</p>}
                 {status === 'success' && <p className="text-green-600">{t('reservations.cancelModal.success')}</p>}
                 {status === 'error' && <p className="text-red-500">{errorMessage}</p>}
                 {status === 'non-refundable' && <p className="text-yellow-600 font-bold">{t('reservations.cancelModal.nonRefundable')}</p>}
            </div>
        </div>
    );
};


const MyReservations: React.FC = () => {
    const { user } = useAuth();
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    const fetchBookings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                properties (title, location_city, photos),
                room_types (name),
                rate_plans (*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching bookings:", error);
        } else {
            setBookings(data as Booking[]);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);
    
    const handleCancellationSuccess = (bookingId: string) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    };

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><p>{t('loading')}</p></div>;
    }

    return (
        <>
            {bookingToCancel && <CancelBookingModal booking={bookingToCancel} onClose={() => setBookingToCancel(null)} onSuccess={handleCancellationSuccess} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-6">{t('reservations.title')}</h1>
                {bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                                <img 
                                    src={booking.properties?.photos?.[0] || 'https://picsum.photos/seed/default/400/300'} 
                                    alt={booking.properties?.title} 
                                    className="h-48 w-full md:w-1/4 object-cover"
                                />
                                <div className="p-4 flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="text-xl font-bold">{booking.properties?.title}</h3>
                                        <p className="text-sm text-gray-500">{booking.properties?.location_city}</p>
                                        <p className="mt-2 font-semibold">{t('details.room')}: {booking.room_types?.name}</p>
                                        {booking.rate_plans?.refundable && (
                                            <div className="flex items-center mt-1 text-sm text-green-600 font-medium">
                                                <ShieldCheckIcon className="w-4 h-4 me-1" />
                                                {t('card.freeCancellation')}
                                            </div>
                                        )}
                                        <div className='text-sm text-gray-600 mt-2 space-y-1'>
                                            <p><span className='font-medium'>{t('search.checkin')}:</span> {formatDate(booking.checkin_date)}</p>
                                            <p><span className='font-medium'>{t('search.checkout')}:</span> {formatDate(booking.checkout_date)}</p>
                                            <p><span className='font-medium'>{t('reservations.bookedOn')}:</span> {formatDate(booking.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-4 justify-between items-center">
                                       <div>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'cancelled' || booking.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {t(`reservations.status.${booking.status}`)}
                                            </span>
                                            <div className="text-lg font-bold mt-1">
                                                {formatCurrency(booking.total_price_display_minor, getCurrencyByCode(booking.display_currency))}
                                            </div>
                                       </div>
                                       {booking.status === 'confirmed' && (
                                            <button 
                                                onClick={() => setBookingToCancel(booking)}
                                                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors">
                                                {t('reservations.cancel')}
                                            </button>
                                       )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>{t('reservations.noReservations')}</p>
                )}
            </div>
        </>
    );
};

export default MyReservations;
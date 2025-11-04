import React, { useState } from 'react';
import { Booking } from '../types';
import { useLanguage } from '../i18n';
import { useAuth } from '../contexts/AuthContext';
import { addReview } from '../services/reviewService';
import { StarIcon, StarIconOutline } from './icons';

interface ReviewModalProps {
    booking: Booking;
    onClose: () => void;
    onSuccess: () => void;
}

const StarRatingInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex justify-center" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                >
                    {star <= (hoverRating || rating) ? (
                        <StarIcon className="w-10 h-10 text-yellow-400" />
                    ) : (
                        <StarIconOutline className="w-10 h-10 text-yellow-400" />
                    )}
                </button>
            ))}
        </div>
    );
};


const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || rating === 0) return;

        setStatus('loading');
        setErrorMessage('');

        const { error } = await addReview({
            booking_id: booking.id,
            property_id: booking.property_id,
            user_id: user.id,
            rating,
            comment
        });

        if (error) {
            setStatus('error');
            setErrorMessage(error.message || t('reviews.error'));
        } else {
            setStatus('success');
            onSuccess();
            setTimeout(onClose, 2000); // Close after 2 seconds
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-2 text-center">{t('reviews.leaveReview')}</h2>
                <p className="text-center text-gray-600 dark:text-slate-300 mb-6">{booking.properties?.title}</p>
                
                {status === 'success' ? (
                    <div className="text-center py-8">
                        <p className="text-xl text-green-600">{t('reviews.success')}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-center font-medium text-gray-700 dark:text-slate-200 mb-2">{t('reviews.yourRating')}</label>
                            <StarRatingInput rating={rating} setRating={setRating} />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="comment" className="block font-medium text-gray-700 dark:text-slate-200 mb-2">{t('reviews.comment')} (Optional)</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={4}
                                className="w-full p-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:border-slate-600"
                                placeholder="Share details of your own experience at this place"
                            />
                        </div>
                        
                        {status === 'error' && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 font-medium">{t('admin.cancel')}</button>
                            <button
                                type="submit"
                                disabled={status === 'loading' || rating === 0}
                                className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? t('reviews.submitting') : t('reviews.submit')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;
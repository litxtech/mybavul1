import React, { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { Booking, Property, WalletLedger, RoomType, RatePlan } from '../types';
import { BuildingOfficeIcon, TagIcon, CurrencyDollarIcon, PlusIcon, TrashIcon } from './icons';
import { useCurrency } from '../contexts/CurrencyContext';
import PartnerCharts from './PartnerCharts';
import AvailabilityCalendar from './AvailabilityCalendar';

// ==================================
// TYPE DEFINITIONS & STATE
// ==================================
type PartnerTab = 'dashboard' | 'properties' | 'bookings' | 'calendar' | 'finance';
type PartnerData = {
    property: Property | null;
    bookings: Booking[];
    ledger: WalletLedger[];
}
type RoomModalState = { isOpen: boolean; room: Partial<RoomType> | null };
type RatePlanModalState = { isOpen: boolean; ratePlan: Partial<RatePlan> | null; roomTypeId: string | null; };


// ==================================
// MODAL & FORM SUB-COMPONENTS
// ==================================
const RoomEditorModal: React.FC<{ modalState: RoomModalState, onClose: () => void, onSave: (room: Partial<RoomType>) => void }> = ({ modalState, onClose, onSave }) => {
    const { t } = useLanguage();
    const [room, setRoom] = useState<Partial<RoomType>>({});
    
    useEffect(() => {
        setRoom(modalState.room || {});
    }, [modalState.room]);

    if (!modalState.isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRoom(prev => ({...prev, [name]: name === 'capacity' ? parseInt(value) || 0 : value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRoom(prev => ({...prev, photos: e.target.value.split('\n')}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(room);
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{room.id ? t('partner.editRoom') : t('partner.addRoom')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">{t('partner.roomName')}</label>
                        <input type="text" name="name" value={room.name || ''} onChange={handleChange} className="mt-1 input-field" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('partner.capacity')}</label>
                        <input type="number" name="capacity" min="1" value={room.capacity || 1} onChange={handleChange} className="mt-1 input-field" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('partner.photos')}</label>
                        <textarea value={room.photos?.join('\n') || ''} onChange={handlePhotoChange} rows={3} className="mt-1 input-field" placeholder="One photo URL per line"/>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-slate-600 font-medium">{t('admin.cancel')}</button>
                        <button type="submit" className="btn-primary">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RatePlanEditorModal: React.FC<{ modalState: RatePlanModalState, onClose: () => void, onSave: (ratePlan: Partial<RatePlan>) => void }> = ({ modalState, onClose, onSave }) => {
    const { t } = useLanguage();
    const [plan, setPlan] = useState<Partial<RatePlan>>({});
    
    useEffect(() => {
        setPlan(modalState.ratePlan || {});
    }, [modalState.ratePlan]);

    if (!modalState.isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setPlan(prev => ({...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setPlan(prev => ({...prev, [name]: name === 'price_per_night_usd_minor' ? parseInt(value) || 0 : value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(plan);
    }
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{plan.id ? "Edit Rate Plan" : t('partner.addRatePlan')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">{t('partner.planName')}</label>
                        <input type="text" name="name" value={plan.name || ''} onChange={handleChange} className="mt-1 input-field" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('partner.pricePerNight')}</label>
                        <input type="number" name="price_per_night_usd_minor" min="0" value={plan.price_per_night_usd_minor || 0} onChange={handleChange} className="mt-1 input-field" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('partner.cancellationPolicy')}</label>
                        <input type="text" name="cancellation_policy" value={plan.cancellation_policy || ''} onChange={handleChange} className="mt-1 input-field" required/>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="refundable" name="refundable" checked={plan.refundable || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                        <label htmlFor="refundable" className="ml-2 block text-sm">{t('partner.refundable')}</label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-slate-600 font-medium">{t('admin.cancel')}</button>
                        <button type="submit" className="btn-primary">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==================================
// PAGE CONTENT SUB-COMPONENTS
// ==================================
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border dark:border-slate-700 flex items-center space-x-4">
        <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full text-primary-600 dark:text-primary-300">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const PartnerDashboardTab: React.FC<{ bookings: Booking[], ledger: WalletLedger[], stats: any }> = ({ bookings, ledger, stats }) => {
    const { t } = useLanguage();
    const { formatCurrency } = useCurrency();
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="My Properties" value={stats.properties} icon={<BuildingOfficeIcon className="w-6 h-6"/>} />
                <StatCard title="Total Bookings" value={stats.bookings} icon={<TagIcon className="w-6 h-6"/>} />
                <StatCard title="Total Revenue (USD)" value={formatCurrency(stats.totalRevenue)} icon={<CurrencyDollarIcon className="w-6 h-6"/>} />
            </div>
            <PartnerCharts bookings={bookings} ledger={ledger} />
        </div>
    )
}

const CreatePropertyForm: React.FC<{ onPropertyCreated: () => void }> = ({ onPropertyCreated }) => {
    const { t } = useLanguage();
    const { profile } = useAuth();
    const [formData, setFormData] = useState({ title: '', description: '', city: '', country: '', star_rating: 3 });
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: name === 'star_rating' ? parseInt(value) : value }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.tenant_id) {
            setErrorMessage('User is not associated with a partner account.');
            setStatus('error');
            return;
        }
        setStatus('loading');
        setErrorMessage('');

        const supabase = getSupabaseClient();
        const { error } = await supabase.from('properties').insert({
            ...formData,
            tenant_id: profile.tenant_id,
            latitude: 0, longitude: 0,
            photos: [`https://picsum.photos/seed/${formData.title.replace(/\s/g, '-')}/800/600`],
            amenities: [], review_count: 0, review_score: 0,
        });

        if (error) { setStatus('error'); setErrorMessage(error.message); } 
        else { setStatus('idle'); onPropertyCreated(); }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-1">{t('partner.create.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('partner.create.subtitle')}</p>
            <form onSubmit={handleCreate} className="space-y-4">
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propName')}</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 input-field" required />
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propDesc')}</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 input-field" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propCity')}</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 input-field" required />
                    </div>
                     <div>
                        <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propCountry')}</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 input-field" required />
                    </div>
                </div>
                 <div>
                    <label htmlFor="star_rating" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propStars')}</label>
                    <select name="star_rating" value={formData.star_rating} onChange={handleChange} className="mt-1 input-field">
                        {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Star{s > 1 ? 's': ''}</option>)}
                    </select>
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={status === 'loading'} className="w-full justify-center btn-primary">
                        {status === 'loading' ? t('partner.saving') : t('partner.create.button')}
                    </button>
                </div>
                {status === 'error' && <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>}
            </form>
        </div>
    );
};

const PropertyEditor: React.FC<{ property: Property, onDataChange: () => void }> = ({ property, onDataChange }) => {
    const { t } = useLanguage();
    const [editableProperty, setEditableProperty] = useState<Property>(property);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [roomModal, setRoomModal] = useState<RoomModalState>({ isOpen: false, room: null });
    const [ratePlanModal, setRatePlanModal] = useState<RatePlanModalState>({ isOpen: false, ratePlan: null, roomTypeId: null });

    useEffect(() => setEditableProperty(property), [property]);

    const handleSave = async () => {
        setStatus('loading'); setErrorMessage('');
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('properties').update({
            title: editableProperty.title,
            description: editableProperty.description,
            amenities: editableProperty.amenities,
            photos: editableProperty.photos,
        }).eq('id', editableProperty.id);

        if (error) { setStatus('error'); setErrorMessage(error.message); }
        else { setStatus('success'); setTimeout(() => setStatus('idle'), 3000); onDataChange(); }
    };

    const handleSaveRoom = async (roomData: Partial<RoomType>) => {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('room_types').upsert({ ...roomData, property_id: editableProperty.id });
        if (error) alert(error.message);
        else { setRoomModal({ isOpen: false, room: null }); onDataChange(); }
    };
    const handleDeleteRoom = async (roomId: string) => {
        if (!window.confirm(t('partner.confirmDelete'))) return;
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('room_types').delete().eq('id', roomId);
        if (error) alert(error.message);
        else onDataChange();
    };

    const handleSaveRatePlan = async (ratePlanData: Partial<RatePlan>) => {
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('rate_plans').upsert({ ...ratePlanData, room_type_id: ratePlanModal.roomTypeId });
        if (error) alert(error.message);
        else { setRatePlanModal({ isOpen: false, ratePlan: null, roomTypeId: null }); onDataChange(); }
    };

    const handleDeleteRatePlan = async (planId: string) => {
        if (!window.confirm(t('partner.confirmDelete'))) return;
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('rate_plans').delete().eq('id', planId);
        if (error) alert(error.message);
        else onDataChange();
    }

    return (
        <>
            <RoomEditorModal modalState={roomModal} onClose={() => setRoomModal({ isOpen: false, room: null })} onSave={handleSaveRoom} />
            <RatePlanEditorModal modalState={ratePlanModal} onClose={() => setRatePlanModal({ isOpen: false, ratePlan: null, roomTypeId: null })} onSave={handleSaveRatePlan} />
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-8">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{t('partner.properties')}</h2>
                    <button onClick={handleSave} disabled={status === 'loading'} className="btn-primary">
                        {status === 'loading' ? t('partner.saving') : t('partner.saveChanges')}
                    </button>
                </div>
                {status === 'success' && <p className="text-green-600">{t('partner.saveSuccess')}</p>}
                {status === 'error' && <p className="text-red-500">{t('partner.saveError')}: {errorMessage}</p>}
                
                <div className="space-y-4 border-b pb-6 dark:border-slate-700">
                     <h3 className="text-xl font-semibold">{t('partner.generalInfo')}</h3>
                     {/* ... form fields for title, description, amenities, photos ... */}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{t('partner.roomsAndPricing')}</h3>
                        <button onClick={() => setRoomModal({ isOpen: true, room: null })} className="flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-800"><PlusIcon className="w-4 h-4"/><span>{t('partner.addRoom')}</span></button>
                    </div>
                    <div className="space-y-6">
                        {editableProperty.room_types?.map(room => (
                            <div key={room.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-lg">{room.name} ({t('partner.capacity')}: {room.capacity})</h4>
                                    <div className="space-x-2">
                                        <button onClick={() => setRoomModal({ isOpen: true, room })} className="text-sm font-medium text-primary-600">Edit</button>
                                        <button onClick={() => handleDeleteRoom(room.id)} className="text-sm font-medium text-red-600">Delete</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {room.rate_plans?.map(plan => (
                                        <div key={plan.id} className="flex justify-between items-center p-2 bg-white dark:bg-slate-600 rounded">
                                            <div>
                                                <p className="font-semibold">{plan.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-300">{plan.cancellation_policy}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <p className="font-bold">{plan.price_per_night_usd_minor / 100} USD</p>
                                                <div className="space-x-2">
                                                     <button onClick={() => setRatePlanModal({ isOpen: true, ratePlan: plan, roomTypeId: room.id })} className="text-xs font-medium text-primary-600">Edit</button>
                                                     <button onClick={() => handleDeleteRatePlan(plan.id)} className="text-xs font-medium text-red-600">Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                 <button onClick={() => setRatePlanModal({ isOpen: true, ratePlan: null, roomTypeId: room.id })} className="mt-2 text-sm font-medium text-primary-600 flex items-center space-x-1"><PlusIcon className="w-4 h-4"/><span>{t('partner.addRatePlan')}</span></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const PartnerBookingsTab: React.FC<{ bookings: Booking[] }> = ({ bookings }) => {
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
             <h2 className="text-2xl font-bold mb-4">{t('partner.bookings.title')}</h2>
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.bookings.guest')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.bookings.dates')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.bookings.status')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.bookings.price')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {bookings.map(b => (
                            <tr key={b.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{b.profiles?.raw_user_meta_data?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(b.checkin_date)} - {formatDate(b.checkout_date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t(`reservations.status.${b.status}`)}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">{formatCurrency(b.total_price_display_minor, getCurrencyByCode(b.display_currency))}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
             </div>
        </div>
    )
}

const PartnerFinanceTab: React.FC<{ ledger: WalletLedger[], stats: any }> = ({ ledger, stats }) => {
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard title={t('partner.finance.balance')} value={formatCurrency(stats.totalRevenue)} icon={<CurrencyDollarIcon className="w-6 h-6"/>} />
                 <StatCard title={t('partner.finance.nextPayout')} value={"Jul 15, 2024"} icon={<TagIcon className="w-6 h-6"/>} />
                 <StatCard title={t('partner.finance.totalRevenue')} value={formatCurrency(stats.totalRevenue)} icon={<BuildingOfficeIcon className="w-6 h-6"/>} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{t('partner.finance.title')}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.finance.date')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.finance.type')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.finance.bookingId')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-300 uppercase">{t('partner.finance.amount')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {ledger.map(l => (
                            <tr key={l.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(l.created_at)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{l.entry_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">{l.booking_id}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${l.entry_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {l.entry_type === 'credit' ? '+' : '-'}{formatCurrency(l.amount_minor, getCurrencyByCode(l.currency))}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ==================================
// AUTH/REGISTRATION FLOW COMPONENTS
// ==================================
const PartnerLoginPrompt: React.FC<{ openAuthModal: () => void }> = ({ openAuthModal }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t('partner.login.title')}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('partner.login.subtitle')}</p>
            <button onClick={openAuthModal} className="inline-block mt-8 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700">
                {t('partner.login.button')}
            </button>
        </div>
    );
};

const BecomePartner: React.FC<{ onRegister: () => void, isLoading: boolean }> = ({ onRegister, isLoading }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t('partner.register.title')}</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('partner.register.subtitle')}</p>
            <button onClick={onRegister} disabled={isLoading} className="inline-block mt-8 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 disabled:bg-slate-400">
                {isLoading ? t('partner.saving') : t('partner.register.button')}
            </button>
        </div>
    );
};

// ==================================
// MAIN COMPONENT
// ==================================
const PartnerPortal: React.FC<{ openAuthModal: () => void }> = ({ openAuthModal }) => {
    const { t } = useLanguage();
    const { session, user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<PartnerTab>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(false);
    const [partnerData, setPartnerData] = useState<PartnerData>({ property: null, bookings: [], ledger: [] });
    const [stats, setStats] = useState({ properties: 0, bookings: 0, totalRevenue: 0 });
    
    const fetchDashboardData = useCallback(async (tenantId?: string) => {
        const id = tenantId || profile?.tenant_id;
        if (!id) { setIsLoading(false); return; };
        
        setIsLoading(true);
        const supabase = getSupabaseClient();
        
        const { data: propData, error: propError } = await supabase.from('properties').select('*, room_types(*, rate_plans(*))').eq('tenant_id', id).maybeSingle();
        const property = propData as Property | null;
        
        // Only fetch bookings and ledger if a property exists
        let bookings: Booking[] = [];
        let ledger: WalletLedger[] = [];
        if (property) {
            const [bookingsRes, ledgerRes] = await Promise.all([
                supabase.from('bookings').select('*, profiles(raw_user_meta_data), room_types(name)').eq('property_id', property.id).order('created_at', { ascending: false }),
                supabase.from('wallet_ledger').select('*').eq('tenant_id', id).order('created_at', { ascending: false })
            ]);
            bookings = bookingsRes.data as Booking[] || [];
            ledger = ledgerRes.data as WalletLedger[] || [];
        }

        const totalRevenue = ledger.filter(l => l.entry_type === 'credit').reduce((sum, item) => sum + item.amount_minor, 0);

        setPartnerData({ property, bookings, ledger });
        setStats({ properties: property ? 1 : 0, bookings: bookings.length, totalRevenue: totalRevenue });
        setIsLoading(false);
    }, [profile]);

    useEffect(() => {
        if (session && profile) {
            fetchDashboardData();
        } else {
            setIsLoading(false);
        }
    }, [session, profile, fetchDashboardData]);
    
    const handleBecomePartner = async () => {
        if (!user) return;
        setIsRegistering(true);
        const supabase = getSupabaseClient();
        const { data: tenantData, error: tenantError } = await supabase.from('tenants').insert({ name: user.user_metadata?.name || user.email, commission_rate: 0.15 }).select().single();
        if (tenantError) { alert(tenantError.message); setIsRegistering(false); return; }
        const { error: profileError } = await supabase.from('profiles').update({ role: 'partner', tenant_id: tenantData.id }).eq('id', user.id);
        if (profileError) { alert(profileError.message); setIsRegistering(false); return; }
        // Manually trigger a re-fetch and state update instead of reloading page
        await fetchDashboardData(tenantData.id);
        setIsRegistering(false);
    }

    if (isLoading) return <div className="text-center py-20">{t('loading')}</div>;
    if (!session || !profile) return <PartnerLoginPrompt openAuthModal={openAuthModal} />;
    if (profile.role !== 'partner') return <BecomePartner onRegister={handleBecomePartner} isLoading={isRegistering} />;

    const TabButton: React.FC<{tab: PartnerTab, label: string}> = ({tab, label}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-primary-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {t(label)}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <PartnerDashboardTab bookings={partnerData.bookings} ledger={partnerData.ledger} stats={stats} />
            case 'properties': return partnerData.property ? <PropertyEditor property={partnerData.property} onDataChange={fetchDashboardData} /> : <CreatePropertyForm onPropertyCreated={fetchDashboardData} />;
            case 'bookings': return <PartnerBookingsTab bookings={partnerData.bookings} />
            case 'calendar': return <AvailabilityCalendar />
            case 'finance': return <PartnerFinanceTab ledger={partnerData.ledger} stats={stats} />
            default: return null;
        }
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">{t('partner.title')}</h1>
                 <div className="mb-8">
                    <div className="border-b border-slate-200 dark:border-slate-800">
                        <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto pb-1" aria-label="Tabs">
                            <TabButton tab="dashboard" label="partner.dashboard" />
                            <TabButton tab="properties" label="partner.properties" />
                            <TabButton tab="bookings" label="partner.bookings" />
                            <TabButton tab="calendar" label="partner.calendar" />
                            <TabButton tab="finance" label="partner.finance" />
                        </nav>
                    </div>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default PartnerPortal;
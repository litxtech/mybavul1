import React, { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { Booking, Property, WalletLedger } from '../types';
import { BuildingOfficeIcon, TagIcon, CurrencyDollarIcon, PlusIcon, TrashIcon } from './icons';
import { useCurrency } from '../contexts/CurrencyContext';
import PartnerCharts from './PartnerCharts';
import AvailabilityCalendar from './AvailabilityCalendar';

// ==================================
// TYPE DEFINITIONS
// ==================================
type PartnerTab = 'dashboard' | 'properties' | 'bookings' | 'calendar' | 'finance';
type PartnerData = {
    property: Property | null;
    bookings: Booking[];
    ledger: WalletLedger[];
}

// ==================================
// SUB-COMPONENTS
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

const PartnerPropertiesTab: React.FC<{ property: Property | null, onSave: () => void }> = ({ property: initialProperty, onSave }) => {
    const { t } = useLanguage();
    const [property, setProperty] = useState<Property | null>(initialProperty);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setProperty(initialProperty);
    }, [initialProperty]);

    if (!property) {
        return <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg"><p>No property associated with this account. Contact support.</p></div>
    }

    const handleFieldChange = (field: keyof Property, value: any) => {
        setProperty(p => p ? { ...p, [field]: value } : null);
    }

    const handlePhotoChange = (index: number, value: string) => {
        const newPhotos = [...property.photos];
        newPhotos[index] = value;
        handleFieldChange('photos', newPhotos);
    }
    const addPhoto = () => handleFieldChange('photos', [...property.photos, '']);
    const removePhoto = (index: number) => handleFieldChange('photos', property.photos.filter((_, i) => i !== index));

    const handleSave = async () => {
        setStatus('loading');
        setErrorMessage('');
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('properties')
            .update({
                title: property.title,
                description: property.description,
                amenities: property.amenities,
                photos: property.photos,
            })
            .eq('id', property.id);

        if (error) {
            setStatus('error');
            setErrorMessage(error.message);
        } else {
            // Here you would also save rooms and rate plans if they were editable
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
            onSave();
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('partner.properties')}</h2>
                <button 
                    onClick={handleSave} 
                    disabled={status === 'loading'}
                    className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-slate-400"
                >
                    {status === 'loading' ? t('partner.saving') : t('partner.saveChanges')}
                </button>
            </div>
            {status === 'success' && <p className="text-green-600">{t('partner.saveSuccess')}</p>}
            {status === 'error' && <p className="text-red-500">{t('partner.saveError')}: {errorMessage}</p>}
            
            {/* General Info */}
            <div className="space-y-4 border-b pb-6 dark:border-slate-700">
                 <h3 className="text-xl font-semibold">{t('partner.generalInfo')}</h3>
                 <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propName')}</label>
                    <input type="text" id="title" value={property.title} onChange={e => handleFieldChange('title', e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600" />
                 </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.propDesc')}</label>
                    <textarea id="description" value={property.description} onChange={e => handleFieldChange('description', e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600" />
                 </div>
                 <div>
                    <label htmlFor="amenities" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('partner.amenities')}</label>
                    <input type="text" id="amenities" value={property.amenities.join(', ')} onChange={e => handleFieldChange('amenities', e.target.value.split(',').map(s => s.trim()))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600" />
                    <p className="mt-1 text-xs text-slate-500">{t('partner.amenitiesHint')}</p>
                 </div>
            </div>
            {/* Photos */}
            <div className="space-y-4 border-b pb-6 dark:border-slate-700">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{t('partner.photos')}</h3>
                    <button onClick={addPhoto} className="flex items-center space-x-2 text-sm font-medium text-primary-600 hover:text-primary-800"><PlusIcon className="w-4 h-4"/><span>{t('partner.addPhoto')}</span></button>
                </div>
                <p className="mt-1 text-xs text-slate-500">{t('partner.photosHint')}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.photos.map((photo, index) => (
                        <div key={index} className="flex items-center space-x-2">
                             <input type="url" value={photo} onChange={e => handlePhotoChange(index, e.target.value)} className="flex-grow block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600 text-sm" />
                             <button onClick={() => removePhoto(index)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
            </div>
             {/* Rooms & Pricing */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t('partner.roomsAndPricing')}</h3>
                <p>Room and rate plan editing coming soon.</p>
            </div>
        </div>
    )
}

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
// MAIN COMPONENT
// ==================================

const PartnerPortal: React.FC = () => {
    const { t } = useLanguage();
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState<PartnerTab>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [partnerData, setPartnerData] = useState<PartnerData>({ property: null, bookings: [], ledger: [] });
    const [stats, setStats] = useState({ properties: 0, bookings: 0, totalRevenue: 0 });
    
    const fetchDashboardData = useCallback(async () => {
        if (!profile?.tenant_id) {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        const supabase = getSupabaseClient();
        
        const [propRes, bookingsRes, ledgerRes] = await Promise.all([
            supabase.from('properties').select('*, room_types(*, rate_plans(*))').eq('tenant_id', profile.tenant_id).maybeSingle(),
            supabase.from('bookings').select('*, profiles(raw_user_meta_data), room_types(name)').eq('properties.tenant_id', profile.tenant_id).order('created_at', { ascending: false }),
            supabase.from('wallet_ledger').select('*').eq('tenant_id', profile.tenant_id).order('created_at', { ascending: false })
        ]);

        const property = propRes.data as Property | null;
        const bookings = bookingsRes.data as Booking[] || [];
        const ledger = ledgerRes.data as WalletLedger[] || [];
        const totalRevenue = ledger.filter(l => l.entry_type === 'credit').reduce((sum, item) => sum + item.amount_minor, 0);

        setPartnerData({ property, bookings, ledger });
        setStats({
            properties: property ? 1 : 0,
            bookings: bookings.length,
            totalRevenue: totalRevenue,
        });

        setIsLoading(false);
    }, [profile]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const TabButton: React.FC<{tab: PartnerTab, label: string}> = ({tab, label}) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-primary-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
            {t(label)}
        </button>
    );

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-8">{t('loading')}</div>
        }
        
        switch (activeTab) {
            case 'dashboard':
                return <PartnerDashboardTab bookings={partnerData.bookings} ledger={partnerData.ledger} stats={stats} />
            case 'properties':
                return <PartnerPropertiesTab property={partnerData.property} onSave={fetchDashboardData} />
            case 'bookings':
                 return <PartnerBookingsTab bookings={partnerData.bookings} />
            case 'calendar':
                return <AvailabilityCalendar />
            case 'finance':
                 return <PartnerFinanceTab ledger={partnerData.ledger} stats={stats} />
            default:
                return null;
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
                <div>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default PartnerPortal;
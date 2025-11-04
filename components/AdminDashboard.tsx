import React, { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { PolicyDocument, Booking, WalletLedger, Property } from '../types';
import { useLanguage } from '../i18n';
import { BuildingOfficeIcon, TagIcon, CurrencyDollarIcon } from './icons';
import { useCurrency } from '../contexts/CurrencyContext';

const PolicyEditorModal: React.FC<{
    doc: Partial<PolicyDocument> | null;
    onClose: () => void;
    onSave: () => void;
}> = ({ doc, onClose, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<Partial<PolicyDocument>>(
        doc || { slug: '', title_key: '', content_key: '', is_active: true, sort_order: 0 }
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = getSupabaseClient();
        const { error } = await supabase.from('policy_documents').upsert(formData);
        if (error) {
            alert(error.message);
        } else {
            onSave();
            onClose();
        }
        setLoading(false);
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{doc?.id ? t('admin.policies.edit') : t('admin.policies.new')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title_key">{t('admin.policies.form.titleKey')}</label>
                        <input name="title_key" value={formData.title_key || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                     <div>
                        <label htmlFor="content_key">{t('admin.policies.form.contentKey')}</label>
                        <textarea name="content_key" value={formData.content_key || ''} onChange={handleChange} className="w-full p-2 border rounded" rows={3} required />
                        <p className="text-xs text-gray-500">Note: The actual content is stored in i18n.tsx. Add new keys there first.</p>
                    </div>
                     <div>
                        <label htmlFor="slug">{t('admin.policies.form.slug')}</label>
                        <input name="slug" value={formData.slug || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="sort_order">{t('admin.policies.form.sortOrder')}</label>
                            <input type="number" name="sort_order" value={formData.sort_order || 0} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                         <div className="flex items-center pt-6">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
                            <label htmlFor="is_active" className="ms-2">{t('admin.policies.form.isActive')}</label>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">{t('admin.cancel')}</button>
                        <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded disabled:bg-gray-400">{t('admin.save')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-primary-500 p-3 rounded-full text-white">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

type AdminTab = 'overview' | 'properties' | 'ledger' | 'policies';

const AdminDashboard: React.FC = () => {
    const { t, formatDate } = useLanguage();
    const { formatCurrency, getCurrencyByCode } = useCurrency();
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    
    const [policies, setPolicies] = useState<PolicyDocument[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [ledgerEntries, setLedgerEntries] = useState<WalletLedger[]>([]);
    
    const [stats, setStats] = useState({ properties: 0, bookings: 0, totalRevenue: 0 });
    const [editingDoc, setEditingDoc] = useState<Partial<PolicyDocument> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        const supabase = getSupabaseClient();
        
        // Parallel fetching
        const [
            propertiesCount, 
            bookingsCount,
            revenueData,
            bookingsRes,
            policiesRes,
            propertiesRes,
            ledgerRes
        ] = await Promise.all([
            supabase.from('properties').select('*', { count: 'exact', head: true }),
            supabase.from('bookings').select('*', { count: 'exact', head: true }),
            supabase.from('wallet_ledger').select('amount_minor').eq('entry_type', 'credit'),
            supabase.from('bookings').select('*, properties(title)').order('created_at', { ascending: false }).limit(5),
            supabase.from('policy_documents').select('*').order('sort_order'),
            supabase.from('properties').select('*').order('created_at', { ascending: false }),
            supabase.from('wallet_ledger').select('*').order('created_at', { ascending: false }).limit(25)
        ]);

        const totalRevenue = revenueData.data?.reduce((sum, item) => sum + item.amount_minor, 0) || 0;
        
        setStats({
            properties: propertiesCount.count || 0,
            bookings: bookingsCount.count || 0,
            totalRevenue: totalRevenue
        });

        setRecentBookings(bookingsRes.data as Booking[] || []);
        setPolicies(policiesRes.data || []);
        setProperties(propertiesRes.data || []);
        setLedgerEntries(ledgerRes.data || []);

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    
    const handleDeletePolicy = async (id: string) => {
        if (window.confirm(t('admin.deleteConfirm'))) {
            const supabase = getSupabaseClient();
            const { error } = await supabase.from('policy_documents').delete().eq('id', id);
            if (error) alert(error.message);
            else fetchDashboardData();
        }
    }
    
    const renderLedgerEntryType = (type: WalletLedger['entry_type']) => {
        const styles: Record<string, string> = {
            credit: 'bg-green-100 text-green-800',
            debit: 'bg-yellow-100 text-yellow-800',
            fee: 'bg-blue-100 text-blue-800',
            refund: 'bg-gray-100 text-gray-800',
            fee_refund: 'bg-gray-100 text-gray-800',
            chargeback: 'bg-red-100 text-red-800',
            chargeback_fee: 'bg-red-100 text-red-800',
            payout: 'bg-purple-100 text-purple-800',
            stripe_fee: 'bg-indigo-100 text-indigo-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
                {type}
            </span>
        );
    }
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({tab, label}) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tab ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        if (isLoading) return <p>{t('loading')}</p>;
        
        switch(activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Total Properties" value={stats.properties} icon={<BuildingOfficeIcon className="w-6 h-6"/>} />
                            <StatCard title="Total Bookings" value={stats.bookings} icon={<TagIcon className="w-6 h-6"/>} />
                            <StatCard title="Total Revenue (USD)" value={formatCurrency(stats.totalRevenue)} icon={<CurrencyDollarIcon className="w-6 h-6"/>} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
                            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentBookings.map(booking => (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{booking.properties?.title || 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.checkin_date)} - {formatDate(booking.checkout_date)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(booking.total_price_display_minor, getCurrencyByCode(booking.display_currency))}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {t(`reservations.status.${booking.status}`)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'properties':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {properties.map(prop => (
                                    <tr key={prop.id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{prop.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prop.location_city}, {prop.location_country}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{prop.star_rating} Stars</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(prop.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'ledger':
                 return (
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {ledgerEntries.map(entry => (
                                    <tr key={entry.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{formatDate(entry.created_at, { dateStyle: 'short', timeStyle: 'short'})}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{entry.booking_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{renderLedgerEntryType(entry.entry_type)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">{formatCurrency(entry.amount_minor, getCurrencyByCode(entry.currency))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'policies':
                 return (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{t('admin.policies.title')}</h2>
                            <button onClick={() => setEditingDoc({})} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700">{t('admin.policies.new')}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.title')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.slug')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.active')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.policies.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {policies.map(doc => (
                                        <tr key={doc.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{t(doc.title_key)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">/policy/{doc.slug}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {doc.is_active ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => setEditingDoc(doc)} className="text-indigo-600 hover:text-indigo-900">{t('admin.policies.edit')}</button>
                                                <button onClick={() => handleDeletePolicy(doc.id)} className="text-red-600 hover:text-red-900">{t('admin.delete')}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }


    return (
        <>
        {editingDoc !== null && <PolicyEditorModal doc={editingDoc} onClose={() => setEditingDoc(null)} onSave={fetchDashboardData} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-8">{t('admin.title')}</h1>
            
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <TabButton tab="overview" label="Overview" />
                        <TabButton tab="properties" label="Properties" />
                        <TabButton tab="ledger" label="Wallet Ledger" />
                        <TabButton tab="policies" label="Policies" />
                    </nav>
                </div>
            </div>
            
            <div>
                {renderContent()}
            </div>

        </div>
        </>
    );
};

export default AdminDashboard;
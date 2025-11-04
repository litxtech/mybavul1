import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { getSupabaseClient } from '../lib/supabase';
import { Booking, Review } from '../types';
import { IdentificationIcon, CreditCardIcon, BriefcaseIcon, LockClosedIcon, BellIcon, TrophyIcon, StarIcon, TrashIcon, PlusIcon, UsersIcon } from './icons';

type ProfileTab = 'personal' | 'security' | 'notifications' | 'travelers' | 'reviews' | 'loyalty';

interface FrequentTraveler {
    name: string;
    dateOfBirth: string;
}

const ProfilePage: React.FC = () => {
    const { t, formatDate } = useLanguage();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
    
    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <p>Please sign in to view your profile.</p>
            </div>
        );
    }
    
    const TabButton: React.FC<{ tab: ProfileTab, label: string, icon: React.ReactNode }> = ({ tab, label, icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-primary-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'personal': return <PersonalInformationTab />;
            case 'security': return <SecurityTab />;
            case 'notifications': return <NotificationsTab />;
            case 'travelers': return <TravelersTab />;
            case 'reviews': return <MyReviewsTab />;
            case 'loyalty': return <LoyaltyProgramTab />;
            default: return null;
        }
    };

    return (
         <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center space-x-6 mb-8">
                    <img 
                        src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.name || user.email || 'A')}&background=random&color=fff`} 
                        alt="User avatar" 
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{user.user_metadata?.name || 'New User'}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                </div>

                <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
                    <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
                        <TabButton tab="personal" label={t('profile.tabs.personal')} icon={<IdentificationIcon className="w-5 h-5"/>} />
                        <TabButton tab="security" label={t('profile.tabs.security')} icon={<LockClosedIcon className="w-5 h-5"/>} />
                        <TabButton tab="notifications" label={t('profile.tabs.notifications')} icon={<BellIcon className="w-5 h-5"/>} />
                        <TabButton tab="travelers" label={t('profile.tabs.travelers')} icon={<UsersIcon className="w-5 h-5"/>} />
                        <TabButton tab="reviews" label={t('profile.tabs.reviews')} icon={<StarIcon className="w-5 h-5"/>} />
                        <TabButton tab="loyalty" label={t('profile.tabs.loyalty')} icon={<TrophyIcon className="w-5 h-5"/>} />
                    </nav>
                </div>
                
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

// ==========================
// TAB COMPONENTS
// ==========================

const PersonalInformationTab: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.name || '',
        dateOfBirth: user?.user_metadata?.date_of_birth || '',
        hometown: user?.user_metadata?.hometown || '',
        address: user?.user_metadata?.address || { line1: '', city: '', postalCode: '', country: '' }
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            data: {
                name: formData.name,
                date_of_birth: formData.dateOfBirth,
                hometown: formData.hometown,
                address: formData.address,
            }
        });
        if (error) { setStatus('error'); setMessage(t('profile.error')); } 
        else { setStatus('success'); setMessage(t('profile.success')); }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <h2 className="text-2xl font-bold">{t('profile.tabs.personal')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                        <label className="block text-sm font-medium">{t('profile.personal.name')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('profile.personal.dob')}</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="mt-1 input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('profile.personal.hometown')}</label>
                        <input type="text" name="hometown" value={formData.hometown} onChange={handleInputChange} className="mt-1 input-field" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('profile.personal.country')}</label>
                        <input type="text" name="country" value={formData.address.country} onChange={handleAddressChange} className="mt-1 input-field" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">{t('profile.personal.address')}</label>
                        <input type="text" name="line1" value={formData.address.line1} onChange={handleAddressChange} className="mt-1 input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('profile.personal.city')}</label>
                        <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className="mt-1 input-field"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">{t('profile.personal.postalCode')}</label>
                        <input type="text" name="postalCode" value={formData.address.postalCode} onChange={handleAddressChange} className="mt-1 input-field"/>
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4">
                    {message && <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                    <button type="submit" disabled={status === 'loading'} className="btn-primary">
                        {status === 'loading' ? t('profile.updating') : t('profile.update')}
                    </button>
                </div>
            </form>
        </div>
    );
}

const SecurityTab: React.FC = () => {
    const { t } = useLanguage();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus('error');
            setMessage('New passwords do not match.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        setStatus('loading');
        setMessage('');
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
        
        if (error) { setStatus('error'); setMessage(t('profile.security.passwordError')); }
        else { setStatus('success'); setMessage(t('profile.security.passwordChanged')); setPasswords({ newPassword: '', confirmPassword: '' }); }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-1">{t('profile.security.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{t('profile.security.changePassword')}</p>
                <form onSubmit={handleChangePassword} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium">{t('profile.security.newPassword')}</label>
                        <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="mt-1 input-field" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">{t('profile.security.confirmPassword')}</label>
                        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="mt-1 input-field" required />
                    </div>
                     <div className="flex items-center justify-end space-x-4 pt-2">
                        {message && <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                        <button type="submit" disabled={status === 'loading'} className="btn-primary">
                            {status === 'loading' ? t('profile.updating') : t('profile.update')}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-1">{t('profile.security.sessionsTitle')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('profile.security.sessionsDesc')}</p>
            </div>
        </div>
    )
}

const NotificationsTab: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [prefs, setPrefs] = useState({
        email: user?.user_metadata?.notification_prefs?.email ?? true,
        sms: user?.user_metadata?.notification_prefs?.sms ?? false
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleToggle = (key: 'email' | 'sms') => {
        setPrefs(p => ({ ...p, [key]: !p[key] }));
    }

    const handleSave = async () => {
        setStatus('loading');
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ data: { notification_prefs: prefs } });
        if (error) { setStatus('error'); setMessage(t('profile.error')); } 
        else { setStatus('success'); setMessage(t('profile.success')); }
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-1">{t('profile.notifications.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('profile.notifications.desc')}</p>
            <div className="space-y-6 divide-y dark:divide-slate-700">
                <div className="flex justify-between items-center pt-6">
                    <div>
                        <h3 className="font-semibold">{t('profile.notifications.email')}</h3>
                        <p className="text-sm text-slate-500">{t('profile.notifications.emailDesc')}</p>
                    </div>
                    <button onClick={() => handleToggle('email')} className={`w-14 h-8 rounded-full p-1 transition-colors ${prefs.email ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${prefs.email ? 'translate-x-6' : ''}`}></span>
                    </button>
                </div>
                 <div className="flex justify-between items-center pt-6">
                    <div>
                        <h3 className="font-semibold">{t('profile.notifications.sms')}</h3>
                        <p className="text-sm text-slate-500">{t('profile.notifications.smsDesc')}</p>
                    </div>
                     <button onClick={() => handleToggle('sms')} className={`w-14 h-8 rounded-full p-1 transition-colors ${prefs.sms ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${prefs.sms ? 'translate-x-6' : ''}`}></span>
                    </button>
                </div>
            </div>
             <div className="flex items-center justify-end space-x-4 pt-8">
                {message && <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                <button onClick={handleSave} disabled={status === 'loading'} className="btn-primary">
                    {status === 'loading' ? t('profile.updating') : t('profile.update')}
                </button>
            </div>
        </div>
    )
}

const TravelersTab: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [travelers, setTravelers] = useState<FrequentTraveler[]>(user?.user_metadata?.frequent_travelers || []);
    const [newTraveler, setNewTraveler] = useState({ name: '', dateOfBirth: '' });

    const handleAddTraveler = async () => {
        if (!newTraveler.name || !newTraveler.dateOfBirth) return;
        const updatedTravelers = [...travelers, newTraveler];
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ data: { frequent_travelers: updatedTravelers } });
        if (!error) {
            setTravelers(updatedTravelers);
            setNewTraveler({ name: '', dateOfBirth: '' });
        }
    }

    const handleRemoveTraveler = async (index: number) => {
        const updatedTravelers = travelers.filter((_, i) => i !== index);
        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({ data: { frequent_travelers: updatedTravelers } });
        if (!error) setTravelers(updatedTravelers);
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-1">{t('profile.travelers.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t('profile.travelers.desc')}</p>
            <div className="space-y-4">
                {travelers.length > 0 ? travelers.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                        <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-sm text-slate-500">DoB: {t.dateOfBirth}</p>
                        </div>
                        <button onClick={() => handleRemoveTraveler(i)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                )) : <p className="text-slate-500">{t('profile.travelers.noTravelers')}</p>}
            </div>
            <div className="mt-6 pt-6 border-t dark:border-slate-700 space-y-4">
                <h3 className="font-semibold">{t('profile.travelers.add')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder={t('profile.travelers.name')} value={newTraveler.name} onChange={e => setNewTraveler(p => ({...p, name: e.target.value}))} className="input-field"/>
                    <input type="date" placeholder={t('profile.travelers.dob')} value={newTraveler.dateOfBirth} onChange={e => setNewTraveler(p => ({...p, dateOfBirth: e.target.value}))} className="input-field"/>
                    <button onClick={handleAddTraveler} className="btn-primary flex items-center justify-center"><PlusIcon className="w-5 h-5 me-2"/>{t('profile.travelers.add')}</button>
                </div>
            </div>
        </div>
    )
}

const MyReviewsTab: React.FC = () => {
    const { t, formatDate } = useLanguage();
    const { user } = useAuth();
    const [reviews, setReviews] = useState<(Review & { properties: { title: string, location_city: string } | null })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!user) return;
            setLoading(true);
            const supabase = getSupabaseClient();
            const { data, error } = await supabase
                .from('reviews')
                .select('*, properties(title, location_city)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Error fetching user reviews:", error);
                setReviews([]);
            } else {
                setReviews(data || []);
            }
            setLoading(false);
        };
        fetchReviews();
    }, [user]);

    if (loading) return <p>{t('loading')}</p>;

    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">{t('profile.reviews.title')}</h2>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b dark:border-slate-700 pb-4">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{review.properties?.title}</h3>
                                    <p className="text-sm text-slate-500">{review.properties?.location_city}</p>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} />)}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">{review.comment}</p>
                            <p className="text-xs text-slate-400 mt-2">{t('profile.reviews.reviewedOn', { date: formatDate(review.created_at) })}</p>
                        </div>
                    ))}
                </div>
            ) : <p className="text-slate-500">{t('profile.reviews.noReviews')}</p>}
        </div>
    )
}

const LoyaltyProgramTab: React.FC = () => {
    const { t } = useLanguage();
    return (
         <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
            <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
            <h2 className="text-2xl font-bold mb-1">{t('profile.loyalty.title')}</h2>
            <p className="font-semibold text-primary-600 mb-2">{t('profile.loyalty.status')}</p>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{t('profile.loyalty.points')}</p>
            <p className="max-w-md mx-auto mb-6">{t('profile.loyalty.desc')}</p>
            <button className="btn-primary">{t('profile.loyalty.cta')}</button>
        </div>
    )
}

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { getSupabaseClient } from '../lib/supabase';
import { Booking } from '../types';
import { IdentificationIcon, CreditCardIcon, BriefcaseIcon } from './icons';

interface ProfileData {
    name: string;
    avatarUrl: string;
    dateOfBirth: string;
    hometown: string;
    address: {
        line1: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

const ProfilePage: React.FC = () => {
    const { t, formatDate } = useLanguage();
    const { user } = useAuth();
    
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '', avatarUrl: '', dateOfBirth: '', hometown: '',
        address: { line1: '', city: '', postalCode: '', country: '' }
    });
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const verificationStatus = user?.user_metadata?.verification_status || 'not_verified';


    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.user_metadata?.name || '',
                avatarUrl: user.user_metadata?.avatar_url || '',
                dateOfBirth: user.user_metadata?.date_of_birth || '',
                hometown: user.user_metadata?.hometown || '',
                address: user.user_metadata?.address || { line1: '', city: '', postalCode: '', country: '' }
            });

            const fetchRecentBookings = async () => {
                setLoadingBookings(true);
                const supabase = getSupabaseClient();
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*, properties(title, location_city, photos)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(3);
                
                if (data) setRecentBookings(data as Booking[]);
                setLoadingBookings(false);
            };
            fetchRecentBookings();
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            data: {
                name: profileData.name,
                avatar_url: profileData.avatarUrl,
                date_of_birth: profileData.dateOfBirth,
                hometown: profileData.hometown,
                address: profileData.address,
            }
        });

        if (error) {
            setStatus('error');
            setMessage(t('profile.error'));
            console.error(error);
        } else {
            setStatus('success');
            setMessage(t('profile.success'));
        }
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <p>Please sign in to view your profile.</p>
            </div>
        );
    }
    
    return (
         <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">{t('profile.title')}</h1>
                
                <div className="space-y-8">
                    {/* Personal Information Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <img 
                                    src={profileData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || user.email || 'A')}&background=random&color=fff`} 
                                    alt="User avatar" 
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold">{profileData.name || 'New User'}</h2>
                                    <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">İsim Soyisim</label>
                                    <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="mt-1 input-field" />
                                </div>
                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Doğum Tarihi</label>
                                    <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleInputChange} className="mt-1 input-field" />
                                </div>
                                <div>
                                    <label htmlFor="hometown" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Memleket</label>
                                    <input type="text" name="hometown" value={profileData.hometown} onChange={handleInputChange} className="mt-1 input-field" />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ülke</label>
                                    <input type="text" name="country" value={profileData.address.country} onChange={handleAddressChange} className="mt-1 input-field" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="line1" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Adres</label>
                                    <input type="text" name="line1" value={profileData.address.line1} onChange={handleAddressChange} className="mt-1 input-field" placeholder="Sokak ve kapı no"/>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Şehir</label>
                                    <input type="text" name="city" value={profileData.address.city} onChange={handleAddressChange} className="mt-1 input-field"/>
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Posta Kodu</label>
                                    <input type="text" name="postalCode" value={profileData.address.postalCode} onChange={handleAddressChange} className="mt-1 input-field"/>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-4">
                                {message && <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
                                <button type="submit" disabled={status === 'loading'} className="btn-primary">
                                    {status === 'loading' ? t('profile.updating') : t('profile.update')}
                                </button>
                            </div>
                        </form>
                    </div>

                     {/* Identity & Payments Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex items-start space-x-4">
                            <IdentificationIcon className="w-8 h-8 text-primary-600 mt-1"/>
                            <div>
                                <h3 className="text-xl font-bold">Kimlik Doğrulama</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Durum: <span className={`font-semibold ${verificationStatus === 'verified' ? 'text-green-500' : 'text-yellow-500'}`}>{verificationStatus}</span></p>
                                <button onClick={() => alert('Kimlik doğrulama özelliği yakında eklenecektir.')} className="btn-secondary text-sm mt-4">Doğrulamayı Başlat</button>
                            </div>
                        </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex items-start space-x-4">
                            <CreditCardIcon className="w-8 h-8 text-primary-600 mt-1"/>
                            <div>
                                <h3 className="text-xl font-bold">Ödeme Yöntemleri</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Güvenliğiniz için kredi kartı bilgilerinizi saklamıyoruz. Ödemeler güvenli ortağımız Stripe tarafından işlenir.</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Bookings Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-2xl font-bold">Son Rezervasyonlar</h2>
                             <a href="#/reservations" className="font-semibold text-primary-600 hover:text-primary-700">Hepsini Gör</a>
                        </div>
                       
                        {loadingBookings ? <p>{t('loading')}</p> : (
                            <div className="space-y-4">
                                {recentBookings.length > 0 ? recentBookings.map(booking => (
                                    <div key={booking.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <img src={booking.properties?.photos?.[0]} alt={booking.properties?.title} className="w-20 h-16 object-cover rounded-md"/>
                                        <div className="flex-grow">
                                            <p className="font-bold">{booking.properties?.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(booking.checkin_date)} - {formatDate(booking.checkout_date)}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{t(`reservations.status.${booking.status}`)}</span>
                                    </div>
                                )) : <p>Henüz rezervasyon yapmadınız.</p>}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
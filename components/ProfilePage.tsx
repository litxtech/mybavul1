import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n';
import { getSupabaseClient } from '../lib/supabase';

const ProfilePage: React.FC = () => {
    const { t } = useLanguage();
    const { user, session } = useAuth();
    
    const [name, setName] = useState(user?.user_metadata?.name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setName(user?.user_metadata?.name || '');
        setAvatarUrl(user?.user_metadata?.avatar_url || '');
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            data: {
                name: name,
                avatar_url: avatarUrl,
            }
        });

        if (error) {
            setStatus('error');
            setMessage(t('profile.error'));
            console.error(error);
        } else {
            setStatus('success');
            setMessage(t('profile.success'));
            // The onAuthStateChange listener in AuthContext will handle updating the profile state globally.
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
                
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <img 
                                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || user.email || 'A')}&background=random`} 
                                alt="User avatar" 
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{name || 'New User'}</h2>
                                <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.name')}</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.avatar')}</label>
                            <input
                                type="url"
                                id="avatarUrl"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        
                        <div className="flex items-center justify-end space-x-4">
                             {message && (
                                <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {message}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-slate-400"
                            >
                                {status === 'loading' ? t('profile.updating') : t('profile.update')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

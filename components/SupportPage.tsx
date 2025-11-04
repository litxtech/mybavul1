import React from 'react';
import { useLanguage } from '../i18n';
import { EnvelopeIcon, PhoneIcon, LocationIcon } from './icons';

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    contact: string;
    href: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, contact, href }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border dark:border-slate-700 flex flex-col items-center text-center">
            <div className="flex-shrink-0 mb-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{description}</p>
            <a href={href} className="font-semibold text-primary-600 hover:text-primary-700 break-all">
                {contact}
            </a>
        </div>
    );
};

const SupportPage: React.FC = () => {
    const { t } = useLanguage();

    const contactDetails = {
        email: "support@litxtech.com",
        phone: "+1 (307) 271-5151",
        address: "15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403"
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">{t('support.title')}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                        {t('support.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InfoCard
                        icon={<EnvelopeIcon className="w-8 h-8" />}
                        title={t('support.email')}
                        description={t('support.email.desc')}
                        contact={contactDetails.email}
                        href={`mailto:${contactDetails.email}`}
                    />
                    <InfoCard
                        icon={<PhoneIcon className="w-8 h-8" />}
                        title={t('support.phone')}
                        description={t('support.phone.desc')}
                        contact={contactDetails.phone}
                        href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
                    />
                    <InfoCard
                        icon={<LocationIcon className="w-8 h-8" />}
                        title={t('support.address')}
                        description={t('support.address.desc')}
                        contact={contactDetails.address}
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.address)}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
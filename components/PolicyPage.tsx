import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n';
import { PolicyDocument } from '../types';

const PolicyPage: React.FC<{ slug: string }> = ({ slug }) => {
    const { t } = useLanguage();
    const [doc, setDoc] = useState<PolicyDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoc = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('policy_documents')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();
            
            if (error) {
                console.error(`Error fetching policy page for slug "${slug}":`, error);
            }
            setDoc(data);
            setLoading(false);
        };
        fetchDoc();
    }, [slug]);

    if (loading) {
        return <div className="max-w-4xl mx-auto px-4 py-12 text-center">{t('loading')}</div>;
    }

    if (!doc) {
        return <div className="max-w-4xl mx-auto px-4 py-12 text-center">{t('policy.notFound')}</div>;
    }

    return (
        <div className="bg-white py-16">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="prose prose-lg lg:prose-xl max-w-none text-gray-800">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 border-b pb-4 mb-8">{t(doc.title_key)}</h1>
                    <div dangerouslySetInnerHTML={{ __html: t(doc.content_key).replace(/\n/g, '<br />') }}></div>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;

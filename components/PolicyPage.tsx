import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { useLanguage } from '../i18n';
import { PolicyDocument } from '../types';

const PolicyPage: React.FC<{ slug: string }> = ({ slug }) => {
    const { t } = useLanguage();
    const [doc, setDoc] = useState<PolicyDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoc = async () => {
            // Bypass DB for core policies since their content is hardcoded in i18n.
            // This ensures they always work even if the DB is not seeded.
            if (slug === 'privacy' || slug === 'terms') {
                const mockDoc: PolicyDocument = {
                    id: slug,
                    slug: slug,
                    title_key: `policy.${slug}.title`,
                    content_key: `policy.${slug}.content`,
                    is_active: true,
                    sort_order: slug === 'privacy' ? 1 : 2,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                setDoc(mockDoc);
                setLoading(false);
                return;
            }

            setLoading(true);
            const supabase = getSupabaseClient();
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
                    <div dangerouslySetInnerHTML={{ __html: t(doc.content_key) }}></div>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;

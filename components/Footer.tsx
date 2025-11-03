import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import { StripeIcon, VisaIcon, MastercardIcon, AmexIcon, PayPalIcon } from './icons';
import { getSupabaseClient } from '../lib/supabase';
import { PolicyDocument } from '../types';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [policyDocs, setPolicyDocs] = useState<PolicyDocument[]>([]);

  useEffect(() => {
    const fetchPolicyDocs = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error("Error fetching policy documents for footer:", error);
      } else {
        setPolicyDocs(data);
      }
    };
    fetchPolicyDocs();
  }, []);

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 rtl:space-x-reverse mb-4">
            {policyDocs.map(doc => (
                <a key={doc.id} href={`#/policy/${doc.slug}`} className="text-sm text-gray-400 hover:text-white">
                    {t(doc.title_key)}
                </a>
            ))}
        </div>
        <div className="text-center text-sm space-y-2">
            <p>
                © {currentYear} MyBavul.com – An affiliate of LitxTech LLC | <a href="tel:+13072715151" className="hover:text-white">+1 (307) 271-5151</a> | <a href="mailto:support@litxtech.com" className="hover:text-white">support@litxtech.com</a>
            </p>
            <p>
                15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 9403 | D-U-N-S®: 144849529 | Governed by Wyoming Law.
            </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 rtl:space-x-reverse">
            <p className="text-xs text-gray-400">{t('footer.weAccept')}</p>
            <div className='flex items-center space-x-4'>
                <VisaIcon className="h-6 w-auto text-gray-400 hover:text-white transition-colors" />
                <MastercardIcon className="h-6 w-auto text-gray-400 hover:text-white transition-colors" />
                <AmexIcon className="h-6 w-auto text-gray-400 hover:text-white transition-colors" />
                <PayPalIcon className="h-5 w-auto text-gray-400 hover:text-white transition-colors" />
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" aria-label="Stripe">
                    <StripeIcon className="h-5 w-auto text-gray-400 hover:text-white transition-colors" />
                </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
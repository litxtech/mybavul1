import React from 'react';
import { useLanguage } from '../i18n';
import { MercuryIcon } from './icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm space-y-2">
            <p>
                © {currentYear} MyBavul.com – An affiliate of LitxTech LLC | <a href="tel:+13072715151" className="hover:text-white">+1 (307) 271-5151</a> | <a href="mailto:support@litxtech.com" className="hover:text-white">support@litxtech.com</a>
            </p>
            <p>
                15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403 | D-U-N-S®: 144849529 | Governed by Wyoming Law.
            </p>
        </div>
        <div className="mt-6 flex justify-center items-center space-x-6 rtl:space-x-reverse">
            <p className="text-xs text-gray-400">{t('footer.poweredBy')}</p>
            <div className='flex items-center space-x-4'>
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe" className="h-7 bg-white rounded-md px-1"/>
                </a>
                 <a href="https://mercury.com" target="_blank" rel="noopener noreferrer">
                    <MercuryIcon className="h-7 w-7 text-gray-200" />
                 </a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
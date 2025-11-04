import React from 'react';
import { useLanguage } from '../i18n';

const BrandLogo = () => (
    <a href="#/" className="flex-shrink-0" aria-label="MyBavul Homepage">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-600">
            mybavul
        </h1>
    </a>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"></path></svg>
);


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
      company: [
          { label: 'About', href: '#/about' },
          { label: 'Careers', href: '#/careers' },
          { label: 'Press', href: '#/press' },
          { label: 'Contact', href: '#/contact' },
      ],
      explore: [
          { label: 'Destinations', href: '#/destinations' },
          { label: 'Property Types', href: '#/property-types' },
          { label: 'Deals', href: '#/deals' },
          { label: 'Guides', href: '#/guides' },
      ],
      support: [
          { label: 'Help Center', href: '#/support' },
          { label: 'Booking Policy', href: '#/policy/booking' },
          { label: 'Refunds', href: '#/policy/refund' },
          { label: 'Report Issue', href: '#/report' },
      ],
      legal: [
          { label: t('policy.privacy.title'), href: '#/policy/privacy' },
          { label: t('policy.terms.title'), href: '#/policy/terms' },
          { label: t('policy.dpa.title'), href: '#/policy/dpa' },
          { label: t('policy.cookie.title'), href: '#/policy/cookie' },
          { label: t('policy.refund.title'), href: '#/policy/refund' },
          { label: 'Data Security', href: '#/policy/security' },
      ]
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
                <BrandLogo />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    {t('home.subtitle')}
                </p>
                <div className="mt-6 flex space-x-4">
                    <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-white"><TwitterIcon className="h-6 w-6"/></a>
                    <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-white"><InstagramIcon className="h-6 w-6"/></a>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-2">
                    {footerLinks.company.map(link => <li key={link.label}><a href={link.href} className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600">{link.label}</a></li>)}
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Explore</h3>
                <ul className="mt-4 space-y-2">
                    {footerLinks.explore.map(link => <li key={link.label}><a href={link.href} className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600">{link.label}</a></li>)}
                </ul>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-2">
                    {footerLinks.support.map(link => <li key={link.label}><a href={link.href} className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600">{link.label}</a></li>)}
                </ul>
            </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
             <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Legal</h3>
                    <ul className="mt-4 space-y-2 sm:columns-2">
                       {footerLinks.legal.map(link => <li key={link.label}><a href={link.href} className="text-base text-slate-500 dark:text-slate-400 hover:text-primary-600">{link.label}</a></li>)}
                    </ul>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 md:text-right">
                    <p>
                        © {currentYear} MyBavul.com – An affiliate of LitxTech LLC
                    </p>
                    <p>
                        <a href="tel:+13072715151" className="hover:text-primary-600">+1 (307) 271-5151</a> | <a href="mailto:support@litxtech.com" className="hover:text-primary-600">support@litxtech.com</a>
                    </p>
                    <p>
                        15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403
                    </p>
                    <p>
                        D-U-N-S®: 144849529 | Governed by Wyoming Law.
                    </p>
                </div>
             </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
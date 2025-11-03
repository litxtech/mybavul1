import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

type Direction = 'ltr' | 'rtl';

interface Language {
  code: string;
  name: string;
  flag: string;
  dir: Direction;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

const enTranslations = {
  'loading': 'Loading...',
  'header.stays': 'Stays', 'header.flights': 'Flights', 'header.carRentals': 'Car Rentals', 'header.attractions': 'Attractions',
  'header.myReservations': 'My Reservations', 'header.login': 'Log In', 'header.signup': 'Sign Up', 'header.logout': 'Log Out',
  'home.title': 'Find your next stay', 'home.subtitle': 'Search deals on hotels, homes, and much more...',
  'search.destination': 'Destination', 'search.checkin': 'Check-in', 'search.checkout': 'Check-out', 'search.guests': 'Guests', 'search.button': 'Search', 'search.button.loading': 'Searching...', 'search.placeholder': 'e.g. Istanbul',
  'results.title': 'Results for "{city}"', 'results.noResults': 'No properties found for your search.', 'results.backToHome': 'New Search', 'results.allDestinations': 'All Destinations',
  'results.sort.title': 'Sort by:', 'results.sort.price': 'Price (low to high)', 'results.sort.stars': 'Stars (high to low)',
  'results.filter.title': 'Filter by:', 'results.filter.freeCancellation': 'Free Cancellation',
  'card.from': 'from', 'card.perNight': '/night', 'card.reviews': '({count} reviews)', 'card.freeCancellation': 'Free cancellation',
  'details.backToResults': 'Back to Results', 'details.chooseRoom': 'Choose your room', 'details.yourSelection': 'Your Selection', 'details.room': 'Room', 'details.plan': 'Plan', 'details.bookNow': 'Reserve and Pay', 'details.guestsUpTo': 'Up to {count} guests', 'details.loginToBook': 'Log in to book', 'details.nights_one': 'night', 'details.nights_other': '{count} nights', 'details.total': 'Total', 'details.refundable': 'Refundable', 'details.nonRefundable': 'Non-refundable',
  'ai.title': 'Bavul AI Assistant', 'ai.subtitle': 'Discover local gems and plan your trip!', 'ai.button': 'Ask about this area', 'ai.button.loading': 'Thinking...', 'ai.loadingMessage': 'Your personal guide is on its way...',
  'footer.poweredBy': 'Payments and banking powered by',
  'home.destinations.title': 'Popular Destinations',
  'home.propertyTypes.title': 'Browse by Property Type', 'home.propertyTypes.boutique': 'Boutique Hotels', 'home.propertyTypes.resorts': 'Beach Resorts', 'home.propertyTypes.villas': 'Private Villas', 'home.propertyTypes.cave': 'Cave Suites',
  'home.features.title': 'Why Choose MyBavul?', 'home.features.ai.title': 'AI-Powered Travel', 'home.features.ai.desc': 'Get personalized tips and local guides with our integrated AI assistant.', 'home.features.price.title': 'Best Price Guarantee', 'home.features.price.desc': 'We find the best deals from thousands of properties so you don\'t have to.', 'home.features.support.title': '24/7 Customer Support', 'home.features.support.desc': 'Our team is here to help you anytime, anywhere during your travels.',
  'auth.login.title': 'Log in to your account', 'auth.signup.title': 'Create an account', 'auth.email': 'Email address', 'auth.password': 'Password', 'auth.login.button': 'Log In', 'auth.signup.button': 'Sign Up', 'auth.noAccount': 'Don\'t have an account?', 'auth.haveAccount': 'Already have an account?', 'auth.loggingIn': 'Logging in...', 'auth.signingUp': 'Signing up...', 'auth.error': 'Error: {message}',
  'reservations.title': 'My Reservations', 'reservations.noReservations': 'You have no reservations yet.', 'reservations.status.pending': 'Pending', 'reservations.status.confirmed': 'Confirmed', 'reservations.status.cancelled': 'Cancelled', 'reservations.status.refunded': 'Refunded', 'reservations.status.partially_refunded': 'Partially Refunded', 'reservations.status.chargeback': 'Chargeback', 'reservations.status.no_show': 'No-Show', 'reservations.bookedOn': 'Booked on', 'reservations.cancel': 'Cancel Reservation',
  'reservations.cancelModal.title': 'Confirm Cancellation', 'reservations.cancelModal.body': 'Are you sure you want to cancel this booking? This action cannot be undone.', 'reservations.cancelModal.confirm': 'Yes, Cancel', 'reservations.cancelModal.goBack': 'Go Back', 'reservations.cancelModal.cancelling': 'Cancelling...', 'reservations.cancelModal.error': 'Could not cancel booking. Please contact support.', 'reservations.cancelModal.success': 'Booking successfully cancelled.', 'reservations.cancelModal.nonRefundable': 'This booking is non-refundable and cannot be cancelled.',
  'booking.success.title': 'Booking Confirmed!', 'booking.success.message': 'Your payment was successful and your reservation is confirmed. You can view it in "My Reservations".', 'booking.success.button': 'View My Reservations',
  'booking.cancelled.title': 'Booking Cancelled', 'booking.cancelled.message': 'Your payment was cancelled. You can try booking again.', 'booking.cancelled.button': 'Back to Home',
  'booking.error': 'An error occurred during booking. Please try again.', 'booking.redirectingToPayment': 'Redirecting to payment...',
  'admin.title': 'Admin Dashboard', 'admin.policies.title': 'Manage Policy Documents', 'admin.policies.new': 'New Document', 'admin.policies.edit': 'Edit Document', 'admin.policies.table.title': 'Title', 'admin.policies.table.slug': 'Slug (URL)', 'admin.policies.table.active': 'Active', 'admin.policies.table.actions': 'Actions', 'admin.policies.form.titleKey': 'Title Key (i18n)', 'admin.policies.form.contentKey': 'Content Key (i18n)', 'admin.policies.form.slug': 'URL Slug', 'admin.policies.form.sortOrder': 'Sort Order', 'admin.policies.form.isActive': 'Is Active?', 'admin.save': 'Save', 'admin.cancel': 'Cancel', 'admin.delete': 'Delete', 'admin.deleteConfirm': 'Are you sure?',
  'admin.accessDenied.title': 'Access Denied', 'admin.accessDenied.message': 'You do not have permission to view this page. Please contact an administrator.',
  'policy.notFound': 'The requested document could not be found.',
  'policy.privacy.title': 'Privacy & Cookie Policy',
  'policy.privacy.content': `
    <p class="text-sm text-gray-500">Effective Date: 03 November 2025</p>
    <p class="text-sm text-gray-500">© 2025 MyBavul.com – an affiliate of LitxTech LLC</p>
    <p class="text-sm text-gray-500">support@litxtech.com | +1 (307) 271-5151</p>
    <p class="text-sm text-gray-500 mb-6">15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403, USA</p>

    <h3>1. Purpose</h3>
    <p>This Privacy & Cookie Policy explains how MyBavul.com (“we”, “us”, or “our”) collects, uses, stores, shares, and protects your personal data when you use our website, app, or related services (collectively, the “Platform”). By using the Platform, you agree to the terms described below.</p>

    <h3>2. What Data We Collect</h3>
    <p>We collect information in the following categories:</p>
    <h4>(a) Data you provide directly</h4>
    <ul>
        <li>Name, surname, email address, phone number, and billing details</li>
        <li>Booking or reservation information</li>
        <li>Messages or reviews you submit</li>
        <li>Documents or identification (where required by law or Provider policy)</li>
    </ul>
    <h4>(b) Data collected automatically</h4>
    <ul>
        <li>Device information (browser type, OS, language, IP address)</li>
        <li>Usage data (pages visited, time spent, referring links)</li>
        <li>Cookies and analytics data (see Section 8)</li>
        <li>Location data (if you allow location access in your browser or app)</li>
    </ul>
    <h4>(c) Data received from partners</h4>
    <p>We may receive limited personal data from:</p>
    <ul>
        <li>Travel Providers (e.g., hotels, airlines, car rentals)</li>
        <li>Payment processors (Stripe, etc.)</li>
        <li>Analytics, advertising, and fraud-prevention partners</li>
    </ul>

    <h3>3. How We Use Your Data</h3>
    <p>We use your personal data to:</p>
    <ul>
        <li>Operate, improve, and personalize the Platform</li>
        <li>Process and confirm bookings, payments, or refunds</li>
        <li>Provide customer support and respond to your requests</li>
        <li>Detect and prevent fraud or security incidents</li>
        <li>Send booking confirmations, updates, and service-related messages</li>
        <li>Send marketing communications (only with your consent)</li>
        <li>Comply with legal obligations and tax/audit requirements</li>
    </ul>

    <h3>4. Legal Basis for Processing</h3>
    <p>Depending on your region, processing may rely on:</p>
    <ul>
        <li><strong>Contractual necessity:</strong> To provide booked services or manage your Account</li>
        <li><strong>Legal obligation:</strong> For invoicing, tax, or regulatory compliance</li>
        <li><strong>Legitimate interest:</strong> To prevent fraud, improve services, or secure systems</li>
        <li><strong>Consent:</strong> For marketing communications or cookies</li>
    </ul>

    <h3>5. Data Sharing</h3>
    <p>We share personal data only as necessary and with appropriate safeguards:</p>
    <table>
        <thead>
            <tr>
                <th>Recipient</th>
                <th>Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Providers (Hotels, Airlines, etc.)</td>
                <td>To fulfill your bookings</td>
            </tr>
            <tr>
                <td>Payment processors (e.g., Stripe)</td>
                <td>To process transactions</td>
            </tr>
            <tr>
                <td>Service vendors (email, analytics, hosting)</td>
                <td>To operate the Platform</td>
            </tr>
            <tr>
                <td>Legal authorities</td>
                <td>Where required by law</td>
            </tr>
            <tr>
                <td>Corporate affiliates (LitxTech LLC, LitxTech LTD)</td>
                <td>For administrative and operational purposes</td>
            </tr>
        </tbody>
    </table>
    <p>We do not sell or rent your personal data to third parties.</p>

    <h3>6. International Data Transfers</h3>
    <p>Your data may be processed or stored in the United States, the United Kingdom, or the European Union, depending on operational needs. We apply Standard Contractual Clauses (SCCs) or equivalent safeguards when transferring data internationally.</p>

    <h3>7. Data Retention</h3>
    <p>We retain your personal data only as long as needed for:</p>
    <ul>
        <li>Active bookings or customer accounts</li>
        <li>Legal, tax, and accounting obligations (usually up to 7 years)</li>
        <li>Dispute resolution or fraud prevention</li>
    </ul>
    <p>When data is no longer required, it is securely deleted or anonymized.</p>

    <h3>8. Cookies & Tracking</h3>
    <p>Cookies are small files placed on your device to help websites function efficiently.</p>
    <h4>Types of cookies we use:</h4>
    <ul>
        <li><strong>Essential cookies</strong> – required for login, checkout, and security</li>
        <li><strong>Analytics cookies</strong> – help us understand usage and improve design</li>
        <li><strong>Preference cookies</strong> – remember language or region</li>
        <li><strong>Marketing cookies</strong> – personalize offers and measure ad performance</li>
    </ul>
    <p>You can manage or delete cookies through your browser settings. Refusing cookies may affect some Platform functions.</p>

    <h3>9. Your Rights</h3>
    <p>Depending on your location, you may have the right to:</p>
    <ul>
        <li>Access, correct, or delete your data</li>
        <li>Withdraw consent for marketing</li>
        <li>Object to or restrict processing</li>
        <li>Request a copy of your data (data portability)</li>
    </ul>
    <p>To exercise your rights, email privacy@litxtech.com or contact us through support@litxtech.com.</p>

    <h3>10. Data Security</h3>
    <p>We use industry-standard security measures, including:</p>
    <ul>
        <li>Encryption (HTTPS/TLS)</li>
        <li>Access controls and authentication</li>
        <li>Secure cloud infrastructure</li>
        <li>Regular audits and vulnerability assessments</li>
    </ul>
    <p>While no system is completely secure, we work continuously to minimize risks.</p>

    <h3>11. Children’s Privacy</h3>
    <p>The Platform is not directed to anyone under 18 years old. We do not knowingly collect data from minors. If we become aware of such collection, we delete it promptly.</p>

    <h3>12. Links to Other Websites</h3>
    <p>Our Platform may link to third-party websites. We are not responsible for their privacy practices — please review their policies.</p>

    <h3>13. Changes to This Policy</h3>
    <p>We may update this Policy from time to time. If changes are material, we will notify you by email or through the Platform. The latest version will always be available at www.mybavul.com/privacy.</p>

    <h3>14. Contact Us</h3>
    <p>MyBavul / LitxTech LLC (Affiliate)<br>15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403<br>📞 +1 (307) 271-5151<br>✉️ support@litxtech.com</p>
    <p>We typically respond within 2 business days.</p>
  `,
  'policy.terms.title': 'Terms of Service',
  'policy.terms.content': `
    <p class="text-sm text-gray-500">Effective date: 03 November 2025</p>
    <p class="text-sm text-gray-500">© 2025 MyBavul.com – An affiliate of LitxTech LLC</p>
    <p class="text-sm text-gray-500">+1 (307) 271-5151 | support@litxtech.com</p>
    <p class="text-sm text-gray-500">15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403</p>
    <p class="text-sm text-gray-500 mb-6">D-U-N-S®: 144849529 | Governing law: Wyoming, USA</p>

    <h3>Quick summary (not legally binding)</h3>
    <p>These Terms explain how you may use MyBavul’s website/app (the “Platform”), how reservations work, what you pay, when you can cancel, and what happens if something goes wrong. By using the Platform or completing a booking, you accept these Terms, our How We Operate notice, and our Content Standards & Rules (together, the “Agreement”).</p>
    
    <h3>A. All Travel Experiences</h3>
    <h4>A1. Definitions</h4>
    <ul>
      <li><strong>Account:</strong> your user account on the Platform.</li>
      <li><strong>Travel Experience:</strong> any travel-related product or service listed on the Platform, including Accommodation, Attractions, Car Rentals, Flights, and Private or Public Transportation.</li>
      <li><strong>Provider:</strong> the business that supplies a Travel Experience.</li>
      <li><strong>Booking:</strong> a confirmed order for a Travel Experience.</li>
      <li><strong>Rewards Wallet:</strong> your digital wallet where MyBavul may credit incentives, credits, or coupons.</li>
    </ul>
    
    <h4>A2. About these Terms</h4>
    <p>When you create an Account, browse, or complete a Booking, you agree to this Agreement.</p>
    <p>If any clause is found unlawful, the rest still applies.</p>
    <p>Section A applies to all Travel Experiences. Sections B–F add product-specific terms that prevail if there’s a conflict.</p>
    
    <h4>A3. About MyBavul</h4>
    <p>MyBavul.com (an affiliate of LitxTech LLC) operates the Platform and customer support. We do not supply the Travel Experiences; Providers do. We act as an online marketplace and, in some cases, a limited payment collection agent.</p>
    
    <h4>A4. The Platform</h4>
    <p>Providers supply descriptions, prices, availability, policies, fees, and taxes. We use reasonable care to operate the Platform but cannot guarantee content is error-free or uninterrupted. We correct issues we discover.</p>
    <p>Listings are not endorsements. Search, rankings, and recommendations are explained in How We Operate.</p>
    <p>You may need an Account to book. Keep credentials secure and data accurate. You must be 18+ to use the Platform.</p>
    <p>We may personalize your experience (including marketing) per your settings and our Privacy & Cookie Notice.</p>
    
    <h4>A5. Your responsibilities</h4>
    <p>Follow the law, our Content Standards & Rules, and fair-use expectations. Do not misuse the Platform, make fraudulent Bookings, or behave abusively toward anyone. Cooperate with fraud/AML checks when required.</p>
    
    <h4>A6. Prices & fees</h4>
    <p>You agree to pay the displayed price plus applicable fees/taxes. Some figures may show rounded values; the charge is based on the unrounded amount.</p>
    <p>Obvious pricing mistakes are not binding. If a clear error occurs, we or the Provider may cancel and refund.</p>
    
    <h4>A7. Payments</h4>
    <p>Payment may be (a) processed by MyBavul (or an affiliate as collection agent) or (b) charged directly by the Provider. Timing (prepayment, deposit, pay-at-stay, pay-at-pickup) is shown during checkout.</p>
    <p>If your payment method currency differs from the charge currency, your bank may add fees.</p>
    <p>If prepayment fails on the due date, the Provider may cancel the Booking without notice; any non-refundable amounts may be lost. Ensure funds and details are correct.</p>
    <p>Where offered, Pay in Your Currency uses rates set at checkout and may include a service fee disclosed at purchase.</p>
    
    <h4>A8. Cancellations, changes, no-shows</h4>
    <p>Provider policies control cancellations, changes, refunds, deposits, minimum age, security deposits, pets, meals, extras, and other rules. They are shown at checkout and in your confirmation.</p>
    <p>If you arrive late, fail to meet requirements, or do not show up, refunds are subject to the Provider’s policy.</p>
    <p>Group booker responsibility: if you book for others, you warrant you’re authorized and will share all terms with them.</p>
    
    <h4>A9. Privacy & cookies</h4>
    <p>We process personal data as described in our Privacy & Cookie Notice. Communication about your Bookings may be sent by email, SMS, push, or in-app.</p>
    
    <h4>A10. Accessibility requests</h4>
    <p>For Platform accessibility, contact Support. For property/vehicle/venue accessibility (e.g., step-free access), contact the Provider directly.</p>
    
    <h4>A11. Insurance</h4>
    <p>Insurance products (if any) are provided by third parties and governed by their own terms.</p>
    
    <h4>A12. Rewards, Credits & Wallet</h4>
    <p>MyBavul may grant Rewards at its discretion subject to this Section and any Offer-Specific Criteria. We may correct display errors.</p>
    <p>Rewards appear in your Rewards Wallet when earned and can be used only on eligible Travel Experiences that accept Wallet payments.</p>
    <p>Types: Travel Credit, Cashback to Card (where available), and Coupons.</p>
    <p>Expiry and usage limits are shown in your Wallet. Rewards are non-transferable, non-assignable, and may be revoked for abuse or fraud.</p>
    <p>If a Rewarded Booking is canceled under Provider policy, unused Rewards may be removed or reinstated per that policy.</p>
    <p>We may modify, suspend, or end the Rewards program with reasonable notice; unexpired Rewards may continue for up to 12 months unless stated otherwise.</p>
    
    <h4>A13. Intellectual property & acceptable use</h4>
    <p>The Platform (software, design, text, trademarks, content) is owned by MyBavul or its licensors. You may use it only as intended and may not copy, scrape, spider, or use automated tools to access or book without our written permission.</p>
    <p>If you upload reviews/photos, you confirm you have rights to share them, they are accurate, non-infringing, virus-free, and you grant MyBavul a worldwide, royalty-free license to use, host, display, and adapt them for Platform operations and promotion. We may remove content that breaches our rules.</p>
    
    <h4>A14. If something goes wrong</h4>
    <p>Contact support@litxtech.com with your booking number, summary of the issue, and any evidence. We prioritize urgent cases and aim to resolve them quickly.</p>
    
    <h4>A15. Liability</h4>
    <p>Nothing limits liability for death or personal injury caused by negligence, fraud, or other liability that cannot be excluded by law.</p>
    <p>To the fullest extent permitted, MyBavul is not liable for: (i) indirect, incidental, special, exemplary, or consequential losses; (ii) events beyond our reasonable control; (iii) errors in your contact/payment details; or (iv) the performance of Travel Experiences supplied by Providers.</p>
    <p>Our total liability arising out of or relating to a Booking is limited to the reasonably foreseeable losses not exceeding the total amounts you paid us for that Booking.</p>
    
    <h4>A16. Governing law & venue</h4>
    <p>This Agreement is governed by the laws of Wyoming, USA, without regard to conflict-of-law rules. Except where local consumer law requires otherwise, you agree to the exclusive jurisdiction and venue of the state and federal courts located in Wyoming for any dispute not subject to informal resolution. Nothing prevents either party from seeking injunctive relief to protect intellectual property or Platform integrity.</p>
    
    <h4>A17. Changes to these Terms</h4>
    <p>We may update these Terms. Material changes will be notified in advance when required by law. Continued use after the effective date means you accept the revised Terms. Existing Bookings remain under the Terms in effect when made.</p>
    
    <h3>B. Accommodations (hotels, homes, etc.)</h3>
    <p>Your contract for the stay is with the Accommodation Provider. MyBavul confirms your Booking and may provide customer support but is not the operator of the property.</p>
    <p>Read house rules, deposits, damage policies, taxes/resort fees, and check-in/out times before booking.</p>
    <p>If a Provider requests a post-stay damage claim through the Platform, we may facilitate collection on the Provider’s behalf within their stated limits; you’ll have the chance to respond before any charge is made. Normal wear/tear and routine cleaning are excluded unless the policy states otherwise.</p>
    
    <h3>C. Attractions (tours, tickets, activities)</h3>
    <p>Your contract is with the Attraction Provider (or an authorized reseller). Admission rules, age limits, schedule changes, and refundability are per the Provider’s terms.</p>
    <p>Some tickets are fixed-date and non-refundable; others allow changes. Details appear at checkout.</p>
    
    <h3>D. Car Rentals</h3>
    <p>The rental contract is between you and the Rental Provider you pick up the car from.</p>
    <p>Usual requirements include a valid driver’s license, minimum age, a credit card in the main driver’s name for deposit, and required documents.</p>
    <p>If you arrive late or without required documents/payment capacity, the Provider may refuse hand-over without refund under their policy.</p>
    <p>One-way fees, cross-border permissions, young/senior driver fees, fuel and extras vary by Provider/location and are shown before you book.</p>
    
    <h3>E. Flights</h3>
    <p>Flight bookings are contracts with the Air Carrier (sometimes arranged through a licensed travel intermediary). The carrier’s Conditions of Carriage govern changes, cancellations, and refunds.</p>
    <p>Ancillary services (bags, seats, meals) may carry extra fees set by the carrier.</p>
    <p>Use flight segments in order; missing segments may cancel the remainder per airline policy.</p>
    
    <h3>F. Private & Public Transportation</h3>
    <p>Private transfers and scheduled transport are supplied by Transport Providers. Pickup windows, waiting times, luggage allowances, and contact rules are shown in your confirmation.</p>
    <p>If your plans change, update the Provider per the timelines in your confirmation. On-the-spot changes may incur fees or be unavailable.</p>
    
    <h3>Content Standards & Rules (summary)</h3>
    <p>Be respectful; no illegal, hateful, or harmful content.</p>
    <p>No false reviews or incentivized manipulation.</p>
    <p>No spam, scraping, automated booking, or security probing.</p>
    <p>We may suspend or terminate Accounts that breach these rules.</p>
    
    <h3>How We Operate (summary)</h3>
    <p>We list Providers with whom we have commercial arrangements.</p>
    <p>Rankings may consider price, popularity, conversion, content quality, availability, location, personalization settings, and MyBavul promotional programs.</p>
    <p>We may earn compensation from Providers or partners; this may influence placement but not your legal rights.</p>
    
    <h3>Contact</h3>
    <p>MyBavul / LitxTech LLC (Affiliate)<br>15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403<br>Support: +1 (307) 271-5151 | support@litxtech.com</p>
  `,
};

const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  tr: {
    ...enTranslations, // Basic fallback
    'loading': 'Yükleniyor...',
    'header.myReservations': 'Rezervasyonlarım', 'header.login': 'Giriş Yap', 'header.signup': 'Kayıt Ol', 'header.logout': 'Çıkış Yap',
    'home.title': 'Bir sonraki konaklamanızı bulun', 'home.subtitle': 'Oteller, evler ve çok daha fazlası için fırsatları arayın...',
    'search.destination': 'Destinasyon', 'search.checkin': 'Giriş', 'search.checkout': 'Çıkış', 'search.guests': 'Misafirler', 'search.button': 'Ara', 'search.placeholder': 'örn. İstanbul',
    'results.title': '"{city}" için sonuçlar', 'results.noResults': 'Aramanız için tesis bulunamadı.', 'results.backToHome': 'Yeni Arama',
    'results.sort.title': 'Sırala:', 'results.sort.price': 'Fiyat (düşükten yükseğe)', 'results.sort.stars': 'Yıldız (yüksekten düşüğe)',
    'results.filter.title': 'Filtrele:', 'results.filter.freeCancellation': 'Ücretsiz İptal',
    'card.from': 'başlayan', 'card.perNight': '/gece', 'card.reviews': '({count} yorum)', 'card.freeCancellation': 'Ücretsiz iptal',
    'details.backToResults': 'Sonuçlara Geri Dön', 'details.chooseRoom': 'Odanızı seçin', 'details.yourSelection': 'Seçiminiz', 'details.room': 'Oda', 'details.plan': 'Plan', 'details.bookNow': 'Rezerve Et ve Öde', 'details.guestsUpTo': '{count} misafire kadar', 'details.loginToBook': 'Rezervasyon için giriş yapın', 'details.nights_one': 'gece', 'details.nights_other': '{count} gece', 'details.total': 'Toplam', 'details.refundable': 'İade Edilebilir', 'details.nonRefundable': 'İade Edilemez',
    'ai.title': 'Bavul AI Asistanı', 'ai.subtitle': 'Yerel harikaları keşfedin ve seyahatinizi planlayın!', 'ai.button': 'Bölge hakkında sor',
    'home.destinations.title': 'Popüler Destinasyonlar',
    'home.propertyTypes.title': 'Tesis Türüne Göre Göz Atın', 'home.propertyTypes.boutique': 'Butik Oteller', 'home.propertyTypes.resorts': 'Sahil Otelleri', 'home.propertyTypes.villas': 'Özel Villalar', 'home.propertyTypes.cave': 'Mağara Süitleri',
    'home.features.title': 'Neden MyBavul?', 'home.features.ai.title': 'Yapay Zekâ Destekli Seyahat',
    'auth.login.title': 'Hesabınıza giriş yapın', 'auth.signup.title': 'Hesap oluşturun', 'auth.email': 'E-posta adresi', 'auth.password': 'Şifre', 'auth.login.button': 'Giriş Yap', 'auth.signup.button': 'Kayıt Ol', 'auth.noAccount': 'Hesabınız yok mu?', 'auth.haveAccount': 'Zaten bir hesabınız var mı?',
    'reservations.title': 'Rezervasyonlarım', 'reservations.noReservations': 'Henüz hiç rezervasyonunuz yok.', 'reservations.status.pending': 'Beklemede', 'reservations.status.confirmed': 'Onaylandı', 'reservations.status.cancelled': 'İptal Edildi', 'reservations.status.refunded': 'İade Edildi', 'reservations.status.partially_refunded': 'Kısmen İade Edildi', 'reservations.status.chargeback': 'Ters İbraz', 'reservations.status.no_show': 'Gelmeme', 'reservations.bookedOn': 'Rezervasyon tarihi', 'reservations.cancel': 'Rezervasyonu İptal Et',
    'reservations.cancelModal.title': 'İptali Onayla', 'reservations.cancelModal.body': 'Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.', 'reservations.cancelModal.confirm': 'Evet, İptal Et', 'reservations.cancelModal.goBack': 'Geri Dön', 'reservations.cancelModal.cancelling': 'İptal ediliyor...', 'reservations.cancelModal.error': 'Rezervasyon iptal edilemedi. Lütfen destek ile iletişime geçin.', 'reservations.cancelModal.success': 'Rezervasyon başarıyla iptal edildi.', 'reservations.cancelModal.nonRefundable': 'Bu rezervasyon iade edilemez ve iptal edilemez.',
    'booking.success.title': 'Rezervasyon Onaylandı!', 'booking.success.message': 'Ödemeniz başarılı oldu ve rezervasyonunuz onaylandı. "Rezervasyonlarım" bölümünde görüntüleyebilirsiniz.', 'booking.success.button': 'Rezervasyonlarımı Görüntüle',
    'booking.cancelled.title': 'Rezervasyon İptal Edildi', 'booking.cancelled.message': 'Ödemeniz iptal edildi. Tekrar rezervasyon yapmayı deneyebilirsiniz.', 'booking.cancelled.button': 'Ana Sayfaya Dön',
    'booking.error': 'Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'booking.redirectingToPayment': 'Ödemeye yönlendiriliyor...',
    'footer.poweredBy': 'Ödeme ve bankacılık altyapısı',
    'admin.title': 'Yönetim Paneli', 'admin.policies.title': 'Politika Belgelerini Yönet', 'admin.policies.new': 'Yeni Belge', 'admin.policies.edit': 'Belgeyi Düzenle', 'admin.policies.table.title': 'Başlık', 'admin.policies.table.slug': 'Link (URL)', 'admin.policies.table.active': 'Aktif', 'admin.policies.table.actions': 'Eylemler', 'admin.policies.form.titleKey': 'Başlık Anahtarı (i18n)', 'admin.policies.form.contentKey': 'İçerik Anahtarı (i18n)', 'admin.policies.form.slug': 'URL Kısaltması', 'admin.policies.form.sortOrder': 'Sıralama', 'admin.policies.form.isActive': 'Aktif mi?', 'admin.save': 'Kaydet', 'admin.cancel': 'İptal', 'admin.delete': 'Sil', 'admin.deleteConfirm': 'Emin misiniz?',
    'admin.accessDenied.title': 'Erişim Engellendi', 'admin.accessDenied.message': 'Bu sayfayı görüntüleme yetkiniz yok. Lütfen bir yönetici ile iletişime geçin.',
    'policy.notFound': 'İstenen belge bulunamadı.',
    'policy.privacy.title': 'Gizlilik ve Çerez Politikası', 
    'policy.privacy.content': 'Gizlilik Politikası içeriği buraya gelecek. Bu içerik Yönetim Panelinden yönetilebilir.',
    'policy.terms.title': 'Hizmet Şartları', 
    'policy.terms.content': 'Hizmet şartları içeriği buraya gelecek. Bu içerik Yönetim Panelinden yönetilebilir.',
  },
  de: { ...enTranslations }, // Fallback
  fr: { ...enTranslations }, // Fallback
  es: { ...enTranslations }, // Fallback
  ar: {
    ...enTranslations, // Basic fallback
    'loading': 'جار التحميل...',
    'header.myReservations': 'حجوزاتي', 'header.login': 'تسجيل الدخول', 'header.signup': 'التسجيل', 'header.logout': 'تسجيل الخروج',
    'home.title': 'ابحث عن إقامتك التالية', 'home.subtitle': 'ابحث عن عروض على الفنادق والمنازل وأكثر من ذلك بكثير...',
    'search.destination': 'الوجهة', 'search.checkin': 'تسجيل الوصول', 'search.checkout': 'تسجيل المغادرة', 'search.guests': 'الضيوف', 'search.button': 'بحث', 'search.placeholder': 'مثال: اسطنبول',
    'results.title': 'نتائج البحث عن "{city}"', 'results.noResults': 'لم يتم العثور على عقارات لبحثك.', 'results.backToHome': 'بحث جديد',
    'results.sort.title': 'ترتيب حسب:', 'results.sort.price': 'السعر (من الأقل إلى الأعلى)', 'results.sort.stars': 'النجوم (من الأعلى إلى الأقل)',
    'results.filter.title': 'تصفية حسب:', 'results.filter.freeCancellation': 'إلغاء مجاني',
    'card.from': 'من', 'card.perNight': '/ليلة', 'card.reviews': '({count} تقييم)', 'card.freeCancellation': 'إلغاء مجاني',
    'details.backToResults': 'العودة إلى النتائج', 'details.chooseRoom': 'اختر غرفتك', 'details.yourSelection': 'اختيارك', 'details.room': 'غرفة', 'details.plan': 'خطة', 'details.bookNow': 'احجز وادفع', 'details.guestsUpTo': 'حتى {count} ضيوف', 'details.loginToBook': 'سجل الدخول للحجز', 'details.nights_one': 'ليلة', 'details.nights_other': '{count} ليالٍ', 'details.total': 'المجموع', 'details.refundable': 'قابل للاسترداد', 'details.nonRefundable': 'غير قابل للاسترداد',
    'ai.title': 'مساعد الذكاء الاصطناعي من BAVUL', 'ai.subtitle': 'اكتشف الجواهر المحلية وخطط لرحلتك!', 'ai.button': 'اسأل عن هذه المنطقة',
    'reservations.title': 'حجوزاتي', 'reservations.noReservations': 'ليس لديك حجوزات بعد.', 'reservations.status.pending': 'قيد الانتظار', 'reservations.status.confirmed': 'مؤكد', 'reservations.status.cancelled': 'ملغي', 'reservations.status.refunded': 'مسترد', 'reservations.status.partially_refunded': 'مسترد جزئيا', 'reservations.status.chargeback': 'رد المبالغ المدفوعة', 'reservations.status.no_show': 'عدم الحضور', 'reservations.bookedOn': 'تم الحجز في', 'reservations.cancel': 'إلغاء الحجز',
    'reservations.cancelModal.title': 'تأكيد الإلغاء', 'reservations.cancelModal.body': 'هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.', 'reservations.cancelModal.confirm': 'نعم، إلغاء', 'reservations.cancelModal.goBack': 'عودة', 'reservations.cancelModal.cancelling': 'جاري الإلغاء...',
    'booking.success.title': 'تم تأكيد الحجز!', 'booking.success.message': 'لقد تمت عملية الدفع بنجاح وتم تأكيد حجزك. يمكنك عرضه في "حجوزاتي".', 'booking.success.button': 'عرض حجوزاتي',
    'booking.cancelled.title': 'تم إلغاء الحجز', 'booking.cancelled.message': 'تم إلغاء دفعتك. يمكنك محاولة الحجز مرة أخرى.', 'booking.cancelled.button': 'العودة إلى الصفحة الرئيسية',
    'policy.privacy.title': 'سياسة الخصوصية وملفات تعريف الارتباط',
    'policy.privacy.content': 'محتوى سياسة الخصوصية سيأتي هنا. يمكن إدارة هذا المحتوى من لوحة الإدارة.',
    'policy.terms.title': 'شروط الخدمة',
    'policy.terms.content': 'محتوى شروط الخدمة سيأتي هنا. يمكن إدارة هذا المحتوى من لوحة الإدارة.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (langCode: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mybavul-lang') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    const selectedLang = languages.find(l => l.code === langCode) || languages[0];
    document.documentElement.lang = selectedLang.code;
    document.documentElement.dir = selectedLang.dir;
    localStorage.setItem('mybavul-lang', selectedLang.code);
  }, [langCode]);

  const setLanguage = (newLangCode: string) => {
    if (languages.some(l => l.code === newLangCode)) {
      setLangCode(newLangCode);
    }
  };

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const langTranslations = translations[langCode] || translations['en'];
    let translation = langTranslations[key] || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return translation;
  }, [langCode]);

  const formatDate = useCallback((date: string | Date, options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) => {
    return new Intl.DateTimeFormat(langCode, options).format(new Date(date));
  }, [langCode]);

  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(langCode, options).format(num);
  }, [langCode]);

  const value = useMemo(() => ({
    language: languages.find(l => l.code === langCode) || languages[0],
    setLanguage,
    t,
    formatDate,
    formatNumber,
  }), [langCode, setLanguage, t, formatDate, formatNumber]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

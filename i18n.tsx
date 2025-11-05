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
  'header.myReservations': 'My Reservations', 'header.myWishlist': 'My Wishlist', 'header.myProfile': 'My Profile', 'header.signIn': 'Sign In', 'header.logout': 'Log Out', 'header.policies': 'Policies',
  'home.title': 'Find your next stay', 'home.subtitle': 'Search deals on hotels, homes, and much more...',
  'search.destination': 'Destination', 'search.checkin': 'Check-in', 'search.checkout': 'Check-out', 'search.guests': 'Guests', 'search.button': 'Search', 'search.button.loading': 'Searching...', 'search.placeholder': 'e.g. Istanbul',
  'city.barcelona': 'Barcelona', 'city.madrid': 'Madrid', 'city.palma': 'Palma', 'city.istanbul': 'Istanbul',
  'results.title': 'Results for "{city}"', 'results.noResults': 'No properties found for your search.', 'results.backToHome': 'New Search', 'results.allDestinations': 'All Destinations',
  'results.sort.title': 'Sort by:', 'results.sort.price': 'Price (low to high)', 'results.sort.stars': 'Stars (high to low)',
  'results.filter.title': 'Filter by:', 'results.filter.freeCancellation': 'Free Cancellation', 'results.filter.starRating': 'Star Rating', 'results.filter.priceRange': 'Price Range', 'results.filter.minPrice': 'Min', 'results.filter.maxPrice': 'Max', 'results.filter.amenities': 'Amenities', 'results.filter.propertyType': 'Property Type',
  'results.view.list': 'List View', 'results.view.map': 'Map View',
  'card.from': 'from', 'card.perNight': '/night', 'card.reviews': '({count} reviews)', 'card.freeCancellation': 'Free cancellation',
  'details.backToResults': 'Back to Results', 'details.chooseRoom': 'Choose your room', 'details.yourSelection': 'Your Selection', 'details.room': 'Room', 'details.plan': 'Plan', 'details.bookNow': 'Reserve and Pay', 'details.guestsUpTo': 'Up to {count} guests', 'details.loginToBook': 'Sign in to book', 'details.nights_one': 'night', 'details.nights_other': '{count} nights', 'details.total': 'Total', 'details.refundable': 'Refundable', 'details.nonRefundable': 'Non-refundable', 'details.cancellationPolicy': 'Cancellation Policy', 'details.rateComments': 'Important Information', 'details.freeCancellationUntil': 'Free cancellation before {date}.', 'details.cancellationFee': 'A fee of {amount} applies if you cancel after {date}.',
  'details.availability.checking': 'Checking availability for your dates...',
  'details.availability.available': 'Great news! We have rooms available for your dates.',
  'details.availability.unavailable': 'Sorry, this property is sold out for your selected dates.',
  'details.availability.onlyXLeft': 'Only {count} rooms left at this price!',
  'ai.title': 'Bavul AI Assistant', 'ai.subtitle': 'Discover local gems and plan your trip!', 'ai.button': 'Ask about this area', 'ai.button.loading': 'Thinking...', 'ai.loadingMessage': 'Your personal guide is on its way...',
  'ai.planner.title': 'AI Travel Planner',
  'ai.planner.button': 'Plan with AI',
  'ai.planner.welcome': 'Tell me what kind of trip you\'re looking for! For example: "A romantic 5-day trip to Barcelona next month for 2 people."',
  'ai.planner.placeholder': 'Describe your ideal trip...',
  'footer.weAccept': 'Secure Payments With:',
  'footer.company.about': 'About Us',
  'home.destinations.title': 'Popular Destinations',
  'home.countries.title': 'Explore by Country',
  'country.turkey': 'Turkey', 'country.italy': 'Italy', 'country.spain': 'Spain', 'country.france': 'France', 'country.greece': 'Greece', 'country.usa': 'United States', 'country.uk': 'United Kingdom', 'country.japan': 'Japan', 'country.thailand': 'Thailand', 'country.uae': 'U.A.E.', 'country.germany': 'Germany', 'country.netherlands': 'Netherlands',
  'home.featured.title': 'Top-Rated Stays',
  'home.propertyTypes.title': 'Browse by Property Type', 'home.propertyTypes.boutique': 'Boutique Hotels', 'home.propertyTypes.resorts': 'Beach Resorts', 'home.propertyTypes.villas': 'Private Villas', 'home.propertyTypes.cave': 'Cave Suites',
  'home.features.title': 'Why Choose MyBavul?', 'home.features.ai.title': 'AI-Powered Travel', 'home.features.ai.desc': 'Get personalized tips and local guides with our integrated AI assistant.', 'home.features.price.title': 'Best Price Guarantee', 'home.features.price.desc': 'We find the best deals from thousands of properties so you don\'t have to.', 'home.features.support.title': '24/7 Customer Support', 'home.features.support.desc': 'Our team is here to help you anytime, anywhere during your travels.',
  'home.expedia.title': 'MyBavul Hotel Search',
  'auth.title': 'Sign In or Create an Account', 'auth.email': 'Email address', 'auth.continue': 'Continue with Email', 'auth.checkEmail': 'Check your email', 'auth.magicLinkSent': 'We\'ve sent a magic link to {email}. Click the link to sign in or create your account.', 'auth.signingIn': 'Sending link...', 'auth.error': 'Error: {message}',
  'reservations.title': 'My Reservations', 'reservations.noReservations': 'You have no reservations yet.', 'reservations.status.pending': 'Pending', 'reservations.status.confirmed': 'Confirmed', 'reservations.status.cancelled': 'Cancelled', 'reservations.status.refunded': 'Refunded', 'reservations.status.partially_refunded': 'Partially Refunded', 'reservations.status.chargeback': 'Chargeback', 'reservations.status.no_show': 'No-Show', 'reservations.bookedOn': 'Booked on', 'reservations.cancel': 'Cancel Reservation',
  'reservations.cancelModal.title': 'Confirm Cancellation', 'reservations.cancelModal.body': 'Are you sure you want to cancel this booking? This action cannot be undone.', 'reservations.cancelModal.confirm': 'Yes, Cancel', 'reservations.cancelModal.goBack': 'Go Back', 'reservations.cancelModal.cancelling': 'Cancelling...', 'reservations.cancelModal.error': 'Could not cancel booking. Please contact support.', 'reservations.cancelModal.success': 'Booking successfully cancelled.', 'reservations.cancelModal.nonRefundable': 'This booking is non-refundable and cannot be cancelled.',
  'booking.success.title': 'Booking Confirmed!', 'booking.success.message': 'Your payment was successful and your reservation is confirmed. You can view it in "My Reservations".', 'booking.success.button': 'View My Reservations',
  'booking.cancelled.title': 'Booking Cancelled', 'booking.cancelled.message': 'Your payment was cancelled. You can try booking again.', 'booking.cancelled.button': 'Back to Home',
  'booking.error': 'An error occurred during booking. Please try again.', 'booking.redirectingToPayment': 'Redirecting to payment...',
  'admin.title': 'Admin Dashboard', 'admin.policies.title': 'Manage Policy Documents', 'admin.policies.new': 'New Document', 'admin.policies.edit': 'Edit Document', 'admin.policies.table.title': 'Title', 'admin.policies.table.slug': 'Slug (URL)', 'admin.policies.table.active': 'Active', 'admin.policies.table.actions': 'Actions', 'admin.policies.form.titleKey': 'Title Key (i18n)', 'admin.policies.form.contentKey': 'Content Key (i18n)', 'admin.policies.form.slug': 'URL Slug', 'admin.policies.form.sortOrder': 'Sort Order', 'admin.policies.form.isActive': 'Is Active?', 'admin.save': 'Save', 'admin.cancel': 'Cancel', 'admin.delete': 'Delete', 'admin.deleteConfirm': 'Are you sure?',
  'admin.accessDenied.title': 'Access Denied', 'admin.accessDenied.message': 'You do not have permission to view this page. Please contact an administrator.',
  'partner.title': 'Partner Portal',
  'partner.dashboard': 'Dashboard',
  'partner.properties': 'My Properties',
  'partner.bookings': 'Bookings',
  'partner.promotions': 'Promotions',
  'partner.finance': 'Finance',
  'partner.calendar': 'Calendar',
  'partner.charts.revenue': 'Revenue (Last 30 Days)',
  'partner.charts.roomTypes': 'Bookings by Room Type',
  'partner.finance.balance': 'Current Balance',
  'partner.finance.nextPayout': 'Next Payout',
  'partner.finance.totalRevenue': 'Total Revenue',
  'partner.saveChanges': 'Save Changes',
  'partner.saving': 'Saving...',
  'partner.saveSuccess': 'Changes saved successfully!',
  'partner.saveError': 'Error saving changes. Please try again.',
  'partner.generalInfo': 'General Information',
  'partner.propName': 'Property Name',
  'partner.propDesc': 'Description',
  'partner.amenities': 'Amenities',
  'partner.amenitiesHint': 'List amenities separated by commas (e.g., Wifi, Pool, Parking)',
  'partner.photos': 'Photos',
  'partner.photosHint': 'Enter direct URLs for your images.',
  'partner.addPhoto': 'Add Photo',
  'partner.roomsAndPricing': 'Rooms & Pricing',
  'partner.addRoom': 'Add New Room',
  'partner.editRoom': 'Edit Room',
  'partner.roomName': 'Room Name',
  'partner.capacity': 'Capacity (guests)',
  'partner.deleteRoom': 'Delete Room',
  'partner.ratePlans': 'Rate Plans',
  'partner.addRatePlan': 'Add Rate Plan',
  'partner.planName': 'Plan Name',
  'partner.pricePerNight': 'Price per night (USD cents)',
  'partner.refundable': 'Refundable',
  'partner.cancellationPolicy': 'Cancellation Policy',
  'partner.deletePlan': 'Delete Plan',
  'partner.confirmDelete': 'Are you sure you want to delete this? This cannot be undone.',
  'partner.bookings.title': 'Recent Bookings',
  'partner.bookings.guest': 'Guest',
  'partner.bookings.dates': 'Dates',
  'partner.bookings.room': 'Room',
  'partner.bookings.status': 'Status',
  'partner.bookings.price': 'Price',
  'partner.finance.title': 'Financial Ledger',
  'partner.finance.date': 'Date',
  'partner.finance.type': 'Type',
  'partner.finance.bookingId': 'Booking ID',
  'partner.finance.amount': 'Amount',
  'policy.notFound': 'The requested document could not be found.',
  'policy.privacy.title': 'Privacy & Cookie Policy',
  'policy.privacy.content': `
    <p class="text-sm text-gray-500">Effective Date: January 1, 2024</p>
    <p class="text-sm text-gray-500">MyBavul.com is an affiliated product of LitxTech LLC, a limited liability company registered in the State of Wyoming, USA (D-U-N-S®: 144849529).</p>
    
    <h3 class="mt-8">1. Purpose</h3>
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
    <table class="w-full text-left border-collapse mt-4">
        <thead>
            <tr>
                <th class="border p-2">Recipient</th>
                <th class="border p-2">Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="border p-2">Providers (Hotels, Airlines, etc.)</td>
                <td class="border p-2">To fulfill your bookings</td>
            </tr>
            <tr>
                <td class="border p-2">Payment processors (e.g., Stripe)</td>
                <td class="border p-2">To process transactions</td>
            </tr>
            <tr>
                <td class="border p-2">Service vendors (email, analytics, hosting)</td>
                <td class="border p-2">To operate the Platform</td>
            </tr>
            <tr>
                <td class="border p-2">Legal authorities</td>
                <td class="border p-2">Where required by law</td>
            </tr>
            <tr>
                <td class="border p-2">Corporate affiliates (LitxTech LLC)</td>
                <td class="border p-2">For administrative and operational purposes</td>
            </tr>
        </tbody>
    </table>
    <p class="mt-4">We do not sell or rent your personal data to third parties.</p>

    <h3>6. International Data Transfers</h3>
    <p>Your data may be processed or stored in the United States, where our company is headquartered. We apply Standard Contractual Clauses (SCCs) or equivalent safeguards when transferring data internationally to ensure its protection.</p>

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
    <p>Depending on your location (e.g., GDPR, CCPA), you may have the right to:</p>
    <ul>
        <li>Access, correct, or delete your data</li>
        <li>Withdraw consent for marketing</li>
        <li>Object to or restrict processing</li>
        <li>Request a copy of your data (data portability)</li>
    </ul>
    <p>To exercise your rights, email our Data Controller at support@litxtech.com.</p>

    <h3>10. Data Security</h3>
    <p>We use industry-standard security measures, including encryption (HTTPS/TLS), access controls, and secure cloud infrastructure to protect your data.</p>

    <h3>11. Children’s Privacy</h3>
    <p>The Platform is not directed to anyone under 18 years old. We do not knowingly collect data from minors.</p>

    <h3>12. Changes to This Policy</h3>
    <p>We may update this Policy from time to time. The latest version will always be available on our Platform.</p>

    <h3>13. Contact Us & Corporate Disclosure</h3>
    <p>Data Controller: LitxTech LLC (Wyoming, USA)<br>
    Headquarters: 15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403<br>
    📞 +1 (307) 271-5151<br>
    ✉️ support@litxtech.com</p>
  `,
  'policy.terms.title': 'Terms of Service',
  'policy.terms.content': `
    <p class="text-sm text-gray-500">Effective date: January 1, 2024</p>
    <p class="text-sm text-gray-500">This service is operated by MyBavul, an affiliate of LitxTech LLC.</p>

    <h3>1. Acceptance of Terms</h3>
    <p>By accessing or using MyBavul.com (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Platform. These Terms constitute a legally binding agreement between you and LitxTech LLC.</p>
    
    <h3>2. Our Role</h3>
    <p>MyBavul acts as an intermediary marketplace. We connect you with third-party providers of travel services like hotels, car rentals, and attractions ("Providers"). Your contract for the actual travel service is directly with the Provider, and their terms and conditions will apply to your booking.</p>
    
    <h3>3. Use of the Platform</h3>
    <p>You must be at least 18 years old to make a booking. You are responsible for the accuracy of the information you provide and for keeping your account credentials confidential. You agree not to use the Platform for any fraudulent, speculative, or illegal activities.</p>
    
    <h3>4. Bookings, Payments, and Cancellations</h3>
    <p><strong>Prices:</strong> All prices are displayed as provided by our partners and are subject to change. We are not responsible for pricing errors.</p>
    <p><strong>Payments:</strong> Payments are processed securely through our partner, Stripe, Inc. By making a booking, you authorize us or the Provider to charge your payment method for the total amount. Some bookings may require a pre-payment or deposit.</p>
    <p><strong>Cancellations & Refunds:</strong> Cancellation and refund policies are set by the Provider and are displayed during the booking process and in your confirmation email. Non-refundable bookings cannot be cancelled or changed. It is your responsibility to review the policy before booking.</p>
    
    <h3>5. Intellectual Property</h3>
    <p>All content on the Platform, including text, graphics, logos, and software, is the property of LitxTech LLC or its licensors and is protected by international copyright and trademark laws.</p>
    
    <h3>6. Disclaimers and Limitation of Liability</h3>
    <p>The Platform is provided on an "as is" and "as available" basis. To the fullest extent permitted by law, LitxTech LLC disclaims all warranties, express or implied. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform or from any travel service booked through it. Our total liability in connection with any booking shall not exceed the total commission we earned from that booking.</p>
    
    <h3>7. Indemnification</h3>
    <p>You agree to indemnify and hold harmless LitxTech LLC, its affiliates, and their respective officers and employees from any claim or demand arising out of your breach of these Terms or your violation of any law or the rights of a third party.</p>
    
    <h3>8. Governing Law and Jurisdiction</h3>
    <p>This Agreement shall be governed by the laws of the State of Wyoming, United States, without regard to its conflict of law principles. Any disputes arising from or related to this Agreement shall be subject to the exclusive jurisdiction of the courts located in Wyoming.</p>
    
    <h3>9. Changes to Terms</h3>
    <p>We reserve the right to modify these Terms at any time. We will post the revised Terms on the Platform, and your continued use of the Platform will signify your acceptance of the changes.</p>
    
    <h3>10. Corporate Disclosure</h3>
    <p>MyBavul.com operates under LitxTech LLC, registered in the State of Wyoming (D-U-N-S®: 144849529), headquartered at 15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403. Official contact: support@litxtech.com, +1 (307) 271-5151.</p>
  `,
  'policy.dpa.title': 'Data Processing Agreement',
  'policy.dpa.content': `
    <p class="text-sm text-gray-500">Effective Date: November 2025</p>
    <p class="text-sm text-gray-500">
        <strong>Between:</strong><br>
        LitxTech LLC, a company registered in Wyoming, United States, operating the platform MyBavul.com (“Data Controller”),<br>
        <strong>and</strong><br>
        Partner Hotels / Accommodation Providers (“Data Processor”).
    </p>

    <hr class="my-6">

    <h3>1. Purpose</h3>
    <p>This Agreement governs the collection, storage, and processing of personal and booking-related data shared between MyBavul.com and Partner Hotels in connection with reservations, payments, and related hospitality services.</p>

    <h3>2. Data Processed</h3>
    <p>The Processor may access and process the following categories of data:</p>
    <ul>
        <li>Guest identification data (name, surname, email, phone number).</li>
        <li>Reservation details (dates, room type, booking source, price).</li>
        <li>Payment reference identifiers (Stripe transaction ID, booking ID).</li>
        <li>Property information (hotel name, address, contact).</li>
    </ul>
    <p>No sensitive data (such as passport numbers or financial credentials) shall be stored outside the Controller’s secure systems.</p>

    <h3>3. Data Processing Obligations</h3>
    <p>The Processor (Partner Hotel) agrees to:</p>
    <ol class="list-decimal list-inside space-y-2">
        <li>Process data only for the purpose of managing guest reservations.</li>
        <li>Maintain strict confidentiality and prevent unauthorized access.</li>
        <li>Delete or anonymize guest data within 30 days after checkout unless required by law.</li>
        <li>Not share or resell data to any third party.</li>
        <li>Immediately report any data breach or unauthorized access to LitxTech LLC within 24 hours.</li>
    </ol>

    <h3>4. Controller’s Responsibilities</h3>
    <p>LitxTech LLC will:</p>
    <ul>
        <li>Ensure all data collection complies with GDPR, CCPA, and other applicable privacy regulations.</li>
        <li>Use Stripe for secure payment processing and Supabase for encrypted data storage.</li>
        <li>Maintain internal access controls and audit logs for all user data interactions.</li>
        <li>Provide a dedicated data deletion and export process upon user request.</li>
    </ul>

    <h3>5. International Transfers</h3>
    <p>Data may be transferred and stored securely on servers located in the United States, the European Union, or other jurisdictions where LitxTech LLC’s service providers operate. All transfers will comply with the EU Standard Contractual Clauses or equivalent frameworks.</p>

    <h3>6. Data Retention</h3>
    <p>Booking and financial transaction records shall be retained for up to five (5) years for accounting and compliance purposes, unless a shorter period is required by local law.</p>

    <h3>7. Data Subject Rights</h3>
    <p>Guests have the right to:</p>
    <ul>
        <li>Request a copy of their data.</li>
        <li>Request correction or deletion.</li>
        <li>Withdraw consent for marketing communications.</li>
    </ul>
    <p>Requests can be submitted to privacy@mybavul.com and will be processed within 30 days.</p>

    <h3>8. Subprocessors</h3>
    <p>LitxTech LLC may use trusted third-party subprocessors for operational tasks such as:</p>
    <ul>
        <li>Stripe Inc. – Payment processing</li>
        <li>Supabase Inc. – Database and hosting</li>
        <li>AWS / Vercel – Cloud infrastructure</li>
    </ul>
    <p>All subprocessors are bound by equivalent data protection obligations.</p>

    <h3>9. Security Measures</h3>
    <p>Both parties agree to implement appropriate technical and organizational measures, including:</p>
    <ul>
        <li>SSL/TLS encryption for data transmission</li>
        <li>Encrypted database storage</li>
        <li>Multi-factor authentication for admin accounts</li>
        <li>Regular access reviews and data minimization policies</li>
    </ul>

    <h3>10. Liability</h3>
    <p>Each party shall be responsible for any breach of this Agreement that occurs within their respective systems or due to their negligence.</p>

    <h3>11. Termination</h3>
    <p>Upon termination of partnership, the Processor must delete or return all guest data within 15 days and confirm deletion in writing to LitxTech LLC.</p>

    <h3>12. Contact</h3>
    <p>For all data protection matters, contact:<br>
    LitxTech LLC – Data Protection Officer<br>
    📧 privacy@mybavul.com<br>
    📍 15442 Ventura Blvd, Suite 201-1834, Sherman Oaks, CA 91403, USA</p>

    <hr class="my-6">

    <p><strong>Signed on behalf of:</strong><br>
    LitxTech LLC – Controller<br>
    Partner Hotel – Processor</p>
    <p class="mt-4">Signature: ____________________<br>Date: _________________________</p>
  `,
  'policy.cookie.title': 'Cookie Policy',
  'policy.cookie.content': `
    <p class="text-sm text-gray-500">Effective Date: November 2025<br>Last Updated: November 2025</p>
    <p>This Cookie Policy explains how MyBavul.com, operated by LitxTech LLC, uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control their use.</p>

    <hr class="my-6">

    <h3>1. What Are Cookies?</h3>
    <p>Cookies are small data files stored on your computer or mobile device when you visit a website. Cookies are widely used by online service providers to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>

    <h3>2. Why Do We Use Cookies?</h3>
    <p>We use cookies for several reasons:</p>
    <ul>
        <li>To ensure the website operates correctly.</li>
        <li>To remember your preferences (such as language and location).</li>
        <li>To analyze website traffic and usage patterns.</li>
        <li>To provide a personalized booking and browsing experience.</li>
        <li>To improve security and prevent fraudulent activity.</li>
    </ul>
    <p>Some cookies are required for technical reasons (“essential cookies”), while others are used for analytics or personalization.</p>

    <h3>3. Types of Cookies We Use</h3>
    <ul>
        <li><strong>Essential Cookies:</strong> These are necessary to provide you with services available through MyBavul.com.</li>
        <li><strong>Performance and Analytics Cookies:</strong> These help us understand how our website is being used and improve it over time.</li>
        <li><strong>Functional Cookies:</strong> Used to remember your preferences and enhance your experience.</li>
        <li><strong>Advertising Cookies:</strong> We may partner with third parties to display relevant ads and offers based on your interests.</li>
    </ul>

    <h3>4. How You Can Control Cookies</h3>
    <p>You have the right to decide whether to accept or reject cookies. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.</p>
    <p>If you disable cookies, some parts of our website may become inaccessible or not function properly.</p>

    <h3>5. Third-Party Cookies</h3>
    <p>We may allow third-party service providers (e.g., Google Analytics, Facebook Pixel, or Stripe) to use cookies through our site for analytics or marketing purposes. These third parties may collect information about your online activities over time and across different websites.</p>

    <h3>6. Updates to This Policy</h3>
    <p>We may update this Cookie Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. Please revisit this page regularly to stay informed.</p>

    <h3>7. Contact Us</h3>
    <p>If you have any questions about our use of cookies or this policy, please contact us at:</p>
    <p>
        📧 support@litxtech.com<br>
        📍 LitxTech LLC<br>
        15442 Ventura Blvd, Suite 201-1834<br>
        Sherman Oaks, CA 91403, United States
    </p>
  `,
  'policy.refund.title': 'Refund & Cancellation Policy',
  'policy.refund.content': `
    <p class="text-sm text-gray-500">Last updated: July 1, 2024</p>
    <p>At MyBavul.com, operated by LITXTECH LLC, we act as an intermediary between travelers and accommodation providers. All reservations, cancellations, and refund rules are determined by the individual hotel or travel partner (e.g., Expedia, Hotelbeds, or other suppliers) and displayed before booking confirmation.</p>

    <h3 class="mt-8">1. General Policy</h3>
    <p>Cancellation and refund conditions vary depending on the selected hotel, room type, and rate plan.</p>
    <p>Some bookings may be non-refundable, while others may allow free cancellation up to a specific date.</p>
    <p>The applicable policy is clearly stated on each booking page before payment.</p>
    <p>By completing a reservation, you acknowledge and agree to the refund terms displayed during checkout.</p>

    <h3 class="mt-8">2. Requesting a Cancellation</h3>
    <p>To cancel a booking, use the link provided in your confirmation email or contact our support team at support@litxtech.com.</p>
    <p>Cancellation requests are processed according to the supplier’s policy, and confirmation will be sent via email.</p>
    <p>If your reservation is eligible for a refund, it will be processed through the original payment method.</p>

    <h3 class="mt-8">3. Refund Processing</h3>
    <p>Refunds (if applicable) are initiated within 5–10 business days after supplier confirmation.</p>
    <p>Transaction fees or exchange rate differences may affect the final refunded amount.</p>
    <p>Refunds can only be issued to the same card or payment account used for the original booking.</p>

    <h3 class="mt-8">4. Non-Refundable Bookings</h3>
    <p>“Non-refundable” or “special rate” bookings cannot be changed or cancelled without penalty.</p>
    <p>In case of no-show or late cancellation, the full booking amount may be charged.</p>

    <h3 class="mt-8">5. Force Majeure</h3>
    <p>In events beyond control (e.g., natural disasters, pandemics, travel restrictions), we will follow the refund or rebooking policies provided by the accommodation partner.</p>

    <h3 class="mt-8">6. Customer Support</h3>
    <p>If you need help with a cancellation or refund, please contact:<br>
    📧 support@litxtech.com<br>
    📞 +1 307 271 5151</p>
  `,
  'policy.booking.title': 'Travel & Booking Terms',
  'policy.booking.content': `
    <p class="text-sm text-gray-500">Last updated: 05.11.2025<br>Operated by: LITXTECH LLC — MyBavul.com</p>
    
    <h3>1. Scope</h3>
    <p>These Travel & Booking Terms govern all hotel and accommodation reservations made through MyBavul.com. By completing a booking, you agree to these terms along with our Privacy Policy, Refund Policy, and Terms of Service.</p>
    
    <h3>2. Role of MyBavul</h3>
    <p>MyBavul acts solely as an intermediary platform connecting travelers with accommodation providers (hotels, partners, or distributors such as Expedia or Hotelbeds). The final contract for accommodation is between you (the traveler) and the hotel or supplier providing the service.</p>
    
    <h3>3. Reservation and Confirmation</h3>
    <p>A booking is considered confirmed only after full payment or deposit is successfully processed.</p>
    <p>Confirmation details, including hotel name, check-in/check-out dates, and rate conditions, are sent by email.</p>
    <p>MyBavul is not responsible for errors caused by incorrect contact details provided by the user.</p>
    
    <h3>4. Pricing and Taxes</h3>
    <p>Prices are displayed in the selected currency and include all mandatory taxes unless stated otherwise.</p>
    <p>Hotels may charge additional local taxes, resort fees, or deposits upon arrival.</p>
    <p>MyBavul is not responsible for differences due to exchange rates or currency conversions.</p>
    
    <h3>5. Modifications and Cancellations</h3>
    <p>All modifications or cancellations are subject to the hotel’s or supplier’s policy.</p>
    <p>Some bookings are non-changeable and non-refundable.</p>
    <p>Requests for modification or cancellation must be sent to support@litxtech.com.</p>
    
    <h3>6. No-Show Policy</h3>
    <p>Failure to arrive at the hotel on the scheduled date (“no-show”) may result in the full charge of the reservation, with no refund.</p>
    
    <h3>7. Hotel Responsibility</h3>
    <p>All hotel descriptions, facilities, and photos are provided by the accommodation partner. MyBavul is not liable for differences between the published information and actual experience unless caused by gross negligence.</p>
    
    <h3>8. Liability</h3>
    <p>MyBavul is not responsible for delays, cancellations, overbookings, or other service failures by the hotel or supplier. In such cases, refund or rebooking will follow the supplier’s policy.</p>
    
    <h3>9. Payment Security</h3>
    <p>All payments are processed via Stripe or other PCI-compliant gateways using SSL encryption and 3D Secure protocols. MyBavul does not store any credit card information.</p>
    
    <h3>10. Governing Law</h3>
    <p>These terms are governed by the laws of Wyoming, United States, without regard to conflict of law principles. Disputes shall be handled through amicable negotiation or, if necessary, through the competent courts of Wyoming, USA.</p>
  `,
  'policy.affiliate.title': 'Affiliate & Commission Disclosure',
  'policy.affiliate.content': `
    <p class="text-sm text-gray-500">Last updated: July 2, 2024<br>Operated by: LITXTECH LLC — MyBavul.com</p>
    
    <p>At MyBavul.com, transparency and trust are fundamental to how we operate. Some of the links or listings on our website may direct you to our trusted travel partners such as Expedia Group, Hotelbeds, or other booking platforms. When you make a reservation or purchase through these links, we may earn a commission or referral fee — at no additional cost to you.</p>
    
    <p>These commissions help us maintain and improve our services, develop new travel tools, and keep the platform free for users. However, our recommendations are never influenced by commissions. All listings and results are shown based on availability, price, and user relevance, not by payment priority.</p>
    
    <p>If you have questions about how commissions or partnerships work on MyBavul, please contact us at:<br>
    📧 support@litxtech.com<br>
    📞 +1 307 271 5151</p>
  `,
  'policy.contact.title': 'Contact & Legal Notice',
  'policy.contact.content': `
    <p class="text-sm text-gray-500">Last updated: July 3, 2024</p>
    <h3>Website operator:</h3>
    <p>
        LITXTECH LLC<br>
        Registered in the State of Wyoming, USA<br>
        D-U-N-S® Number: 144849529<br>
        Business address: 30 N Gould St Ste 4000, Sheridan, WY 82801, United States<br>
        Email: support@litxtech.com<br>
        Phone: +1 307 271 5151
    </p>

    <h3>Legal Responsibility</h3>
    <p>MyBavul.com is operated by LITXTECH LLC, acting as an intermediary platform for accommodation and travel services. All hotel and booking information is provided by third-party suppliers and partners such as Expedia Group, Hotelbeds, and other travel providers. LITXTECH LLC is not the accommodation provider and cannot be held responsible for errors or cancellations caused by partner systems.</p>

    <h3>Data Protection Contact</h3>
    <p>For inquiries related to data privacy or GDPR compliance, please contact:<br>
    📧 privacy@litxtech.com (or support@litxtech.com if unified)</p>

    <h3>Intellectual Property</h3>
    <p>All trademarks, logos, and content on this site are the property of their respective owners. Any reproduction, scraping, or unauthorized use of MyBavul’s data, design, or content is strictly prohibited.</p>

    <h3>Jurisdiction</h3>
    <p>All legal relationships arising from the use of this website are governed by the laws of the State of Wyoming, USA, without regard to its conflict-of-law rules.</p>
  `,
  'policy.about.title': 'About MyBavul.com',
  'policy.about.content': `
    <p class="text-sm text-gray-500">Travel made simple — powered by LITXTECH LLC</p>
    <p class="mt-4">MyBavul.com is an independent hotel and travel booking platform founded by Soner Toprak and operated by LITXTECH LLC (USA). Our mission is to make travel planning fast, secure, and affordable for everyone.</p>
    <p class="mt-4">The platform is designed to integrate with global travel data and hotel distribution systems, allowing users to access a wide range of accommodation options in one place. MyBavul aims to connect travelers with data sources and suppliers such as Expedia Group, Hotelbeds, and other trusted partners, providing real-time hotel information and competitive rates. All payments are securely processed through Stripe.</p>
    
    <h3 class="mt-8">Our Values</h3>
    <ul>
        <li><strong>Transparency:</strong> Prices, taxes, and booking terms are clearly displayed — no hidden fees.</li>
        <li><strong>Security:</strong> SSL encryption and trusted payment gateways protect every transaction.</li>
        <li><strong>Global Access:</strong> MyBavul connects travelers in Turkey and around the world to thousands of hotels.</li>
        <li><strong>Customer Focus:</strong> 24/7 support and clear communication at every stage of your journey.</li>
    </ul>

    <h3 class="mt-8">Company Information</h3>
    <p>
        LITXTECH LLC<br>
        Registered in the State of Wyoming, USA<br>
        D-U-N-S® Number: 144849529<br>
        Email: support@litxtech.com<br>
        Phone: +1 307 271 5151<br>
        Website: https://www.mybavul.com
    </p>
  `,
  'reviews.title': 'Reviews',
  'reviews.leaveReview': 'Leave a Review',
  'reviews.noReviews': 'No reviews yet.',
  'reviews.rating': 'Rating',
  'reviews.comment': 'Comment',
  'reviews.submit': 'Submit Review',
  'reviews.submitting': 'Submitting...',
  'reviews.success': 'Review submitted successfully!',
  'reviews.error': 'Failed to submit review. Please try again.',
  'reviews.yourRating': 'Your Rating',
  'reviews.basedOn': 'Based on {count} reviews',
  'reviews.overallRating': 'Overall Rating',
  'wishlist.title': 'My Wishlist',
  'wishlist.empty': 'Your wishlist is empty.',
  'wishlist.empty.prompt': 'Start exploring and add your favorite properties by clicking the heart icon.',
  'profile.title': 'My Account',
  'profile.update': 'Save Changes',
  'profile.updating': 'Saving...',
  'profile.success': 'Profile updated successfully!',
  'profile.error': 'Failed to update profile. Please try again.',
  'profile.tabs.personal': 'Personal Information',
  'profile.tabs.security': 'Security',
  'profile.tabs.notifications': 'Notifications',
  'profile.tabs.travelers': 'Travelers',
  'profile.tabs.reviews': 'My Reviews',
  'profile.tabs.loyalty': 'Loyalty Program',
  'profile.personal.name': 'Full Name',
  'profile.personal.dob': 'Date of Birth',
  'profile.personal.hometown': 'Hometown',
  'profile.personal.country': 'Country',
  'profile.personal.address': 'Address Line',
  'profile.personal.city': 'City',
  'profile.personal.postalCode': 'Postal Code',
  'profile.security.title': 'Password',
  'profile.security.changePassword': 'Change Password',
  'profile.security.currentPassword': 'Current Password',
  'profile.security.newPassword': 'New Password',
  'profile.security.confirmPassword': 'Confirm New Password',
  'profile.security.passwordChanged': 'Password changed successfully!',
  'profile.security.passwordError': 'Error changing password. Please try again.',
  'profile.security.sessionsTitle': 'Active Sessions',
  'profile.security.sessionsDesc': 'This feature is coming soon.',
  'profile.notifications.title': 'Communication Preferences',
  'profile.notifications.desc': 'Choose how you want to hear from us.',
  'profile.notifications.email': 'Email Notifications',
  'profile.notifications.emailDesc': 'Receive booking confirmations, updates, and newsletters.',
  'profile.notifications.sms': 'SMS Alerts',
  'profile.notifications.smsDesc': 'Get critical booking alerts and updates via text message.',
  'profile.travelers.title': 'Frequent Travelers',
  'profile.travelers.desc': 'Add details for people you often travel with to speed up bookings.',
  'profile.travelers.add': 'Add Traveler',
  'profile.travelers.name': 'Full Name',
  'profile.travelers.dob': 'Date of Birth',
  'profile.travelers.noTravelers': 'No travelers added yet.',
  'profile.reviews.title': 'Reviews You\'ve Written',
  'profile.reviews.noReviews': 'You haven\'t written any reviews yet.',
  'profile.reviews.reviewedOn': 'Reviewed on {date}',
  'profile.loyalty.title': 'MyBavul Loyalty Program',
  'profile.loyalty.status': 'Your Status: Gold Member',
  'profile.loyalty.points': 'You have 4,500 points.',
  'profile.loyalty.desc': 'You are enjoying exclusive benefits like late check-outs, room upgrades, and special discounts.',
  'profile.loyalty.cta': 'View All Benefits',
  'support.title': 'Support Center',
  'support.subtitle': "Have questions or need help with your booking? We're here for you.",
  'support.email': 'Email Support',
  'support.email.desc': 'Best for non-urgent inquiries. We aim to respond within 24 hours.',
  'support.phone': 'Phone Support',
  'support.phone.desc': 'For urgent matters, please call us directly for immediate assistance.',
  'support.address': 'Mailing Address',
  'support.address.desc': 'Our corporate headquarters for official correspondence.',
};

const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  tr: {
    ...enTranslations, // Basic fallback
    'loading': 'Yükleniyor...',
    'header.myReservations': 'Rezervasyonlarım', 'header.myWishlist': 'İstek Listem', 'header.myProfile': 'Hesabım', 'header.signIn': 'Giriş Yap', 'header.logout': 'Çıkış Yap', 'header.policies': 'Politikalar',
    'home.title': 'Bir sonraki konaklamanızı bulun', 'home.subtitle': 'Oteller, evler ve çok daha fazlası için fırsatları arayın...',
    'search.destination': 'Destinasyon', 'search.checkin': 'Giriş', 'search.checkout': 'Çıkış', 'search.guests': 'Misafirler', 'search.button': 'Ara', 'search.placeholder': 'örn. İstanbul',
    'city.barcelona': 'Barselona', 'city.madrid': 'Madrid', 'city.palma': 'Palma', 'city.istanbul': 'İstanbul',
    'results.title': '"{city}" için sonuçlar', 'results.noResults': 'Aramanız için tesis bulunamadı.', 'results.backToHome': 'Yeni Arama',
    'results.sort.title': 'Sırala:', 'results.sort.price': 'Fiyat (düşükten yükseğe)', 'results.sort.stars': 'Yıldız (yüksekten düşüğe)',
    'results.filter.title': 'Filtrele:', 'results.filter.freeCancellation': 'Ücretsiz İptal', 'results.filter.starRating': 'Yıldız Puanı', 'results.filter.priceRange': 'Fiyat Aralığı', 'results.filter.minPrice': 'Min', 'results.filter.maxPrice': 'Maks', 'results.filter.amenities': 'Olanaklar', 'results.filter.propertyType': 'Tesis Tipi',
    'results.view.list': 'Liste Görünümü', 'results.view.map': 'Harita Görünümü',
    'card.from': 'başlayan', 'card.perNight': '/gece', 'card.reviews': '({count} yorum)', 'card.freeCancellation': 'Ücretsiz iptal',
    'details.backToResults': 'Sonuçlara Geri Dön', 'details.chooseRoom': 'Odanızı seçin', 'details.yourSelection': 'Seçiminiz', 'details.room': 'Oda', 'details.plan': 'Plan', 'details.bookNow': 'Rezerve Et ve Öde', 'details.guestsUpTo': '{count} misafire kadar', 'details.loginToBook': 'Rezervasyon için giriş yapın', 'details.nights_one': 'gece', 'details.nights_other': '{count} gece', 'details.total': 'Toplam', 'details.refundable': 'İade Edilebilir', 'details.nonRefundable': 'İade Edilemez', 'details.cancellationPolicy': 'İptal Politikası', 'details.rateComments': 'Önemli Bilgiler', 'details.freeCancellationUntil': '{date} tarihine kadar ücretsiz iptal.', 'details.cancellationFee': '{date} tarihinden sonra iptal ederseniz {amount} tutarında bir ücret uygulanır.',
    'details.availability.checking': 'Tarihleriniz için müsaitlik kontrol ediliyor...',
    'details.availability.available': 'Harika haber! Bu tarihler için odalarımız mevcut.',
    'details.availability.unavailable': 'Üzgünüz, seçtiğiniz tarihler için bu tesiste yer kalmadı.',
    'details.availability.onlyXLeft': 'Bu fiyata son {count} oda!',
    'ai.title': 'Bavul AI Asistanı', 'ai.subtitle': 'Yerel harikaları keşfedin ve seyahatinizi planlayın!', 'ai.button': 'Bölge hakkında sor',
    'ai.planner.title': 'Yapay Zeka Seyahat Planlayıcı',
    'ai.planner.button': 'AI ile Planla',
    'ai.planner.welcome': 'Nasıl bir seyahat aradığınızı anlatın! Örneğin: "Gelecek ay 2 kişi için Barselona\'da 5 günlük romantik bir gezi."',
    'ai.planner.placeholder': 'Hayalinizdeki seyahati anlatın...',
    'footer.company.about': 'Hakkımızda',
    'home.destinations.title': 'Popüler Destinasyonlar',
    'home.countries.title': 'Ülkeye Göre Keşfet',
    'country.turkey': 'Türkiye', 'country.italy': 'İtalya', 'country.spain': 'İspanya', 'country.france': 'Fransa', 'country.greece': 'Yunanistan', 'country.usa': 'ABD', 'country.uk': 'Birleşik Krallık', 'country.japan': 'Japonya', 'country.thailand': 'Tayland', 'country.uae': 'B.A.E.', 'country.germany': 'Almanya', 'country.netherlands': 'Hollanda',
    'home.featured.title': 'En Yüksek Puanlı Tesisler',
    'home.propertyTypes.title': 'Tesis Türüne Göre Göz Atın', 'home.propertyTypes.boutique': 'Butik Oteller', 'home.propertyTypes.resorts': 'Sahil Otelleri', 'home.propertyTypes.villas': 'Özel Villalar', 'home.propertyTypes.cave': 'Mağara Süitleri',
    'home.features.title': 'Neden MyBavul?', 'home.features.ai.title': 'Yapay Zekâ Destekli Seyahat',
    'home.expedia.title': 'MyBavul Otel Arama',
    'auth.title': 'Giriş Yap veya Hesap Oluştur', 'auth.email': 'E-posta adresi', 'auth.continue': 'E-posta ile Devam Et', 'auth.checkEmail': 'E-postanızı kontrol edin', 'auth.magicLinkSent': '{email} adresine sihirli bir bağlantı gönderdik. Giriş yapmak veya hesap oluşturmak için bağlantıya tıklayın.', 'auth.signingIn': 'Bağlantı gönderiliyor...',
    'reservations.title': 'Rezervasyonlarım', 'reservations.noReservations': 'Henüz hiç rezervasyonunuz yok.', 'reservations.status.pending': 'Beklemede', 'reservations.status.confirmed': 'Onaylandı', 'reservations.status.cancelled': 'İptal Edildi', 'reservations.status.refunded': 'İade Edildi', 'reservations.status.partially_refunded': 'Kısmen İade Edildi', 'reservations.status.chargeback': 'Ters İbraz', 'reservations.status.no_show': 'Gelmeme', 'reservations.bookedOn': 'Rezervasyon tarihi', 'reservations.cancel': 'Rezervasyonu İptal Et',
    'reservations.cancelModal.title': 'İptali Onayla', 'reservations.cancelModal.body': 'Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.', 'reservations.cancelModal.confirm': 'Evet, İptal Et', 'reservations.cancelModal.goBack': 'Geri Dön', 'reservations.cancelModal.cancelling': 'İptal ediliyor...', 'reservations.cancelModal.error': 'Rezervasyon iptal edilemedi. Lütfen destek ile iletişime geçin.', 'reservations.cancelModal.success': 'Rezervasyon başarıyla iptal edildi.', 'reservations.cancelModal.nonRefundable': 'Bu rezervasyon iade edilemez ve iptal edilemez.',
    'booking.success.title': 'Rezervasyon Onaylandı!', 'booking.success.message': 'Ödemeniz başarılı oldu ve rezervasyonunuz onaylandı. "Rezervasyonlarım" bölümünde görüntüleyebilirsiniz.', 'booking.success.button': 'Rezervasyonlarımı Görüntüle',
    'booking.cancelled.title': 'Rezervasyon İptal Edildi', 'booking.cancelled.message': 'Ödemeniz iptal edildi. Tekrar rezervasyon yapmayı deneyebilirsiniz.', 'booking.cancelled.button': 'Ana Sayfaya Dön',
    'booking.error': 'Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'booking.redirectingToPayment': 'Ödemeye yönlendiriliyor...',
    'footer.weAccept': 'Güvenli Ödeme Yöntemleri:',
    'admin.title': 'Yönetim Paneli', 'admin.policies.title': 'Politika Belgelerini Yönet', 'admin.policies.new': 'Yeni Belge', 'admin.policies.edit': 'Belgeyi Düzenle', 'admin.policies.table.title': 'Başlık', 'admin.policies.table.slug': 'Link (URL)', 'admin.policies.table.active': 'Aktif', 'admin.policies.table.actions': 'Eylemler', 'admin.policies.form.titleKey': 'Başlık Anahtarı (i18n)', 'admin.policies.form.contentKey': 'İçerik Anahtarı (i18n)', 'admin.policies.form.slug': 'URL Kısaltması', 'admin.policies.form.sortOrder': 'Sıralama', 'admin.policies.form.isActive': 'Aktif mi?', 'admin.save': 'Kaydet', 'admin.cancel': 'İptal', 'admin.delete': 'Sil', 'admin.deleteConfirm': 'Emin misiniz?',
    'admin.accessDenied.title': 'Erişim Engellendi', 'admin.accessDenied.message': 'Bu sayfayı görüntüleme yetkiniz yok. Lütfen bir yönetici ile iletişime geçin.',
    'partner.title': 'İş Ortağı Portalı',
    'partner.dashboard': 'Kontrol Paneli',
    'partner.properties': 'Tesislerim',
    'partner.bookings': 'Rezervasyonlar',
    'partner.promotions': 'Promosyonlar',
    'partner.finance': 'Finans',
    'partner.calendar': 'Takvim',
    'partner.charts.revenue': 'Gelir (Son 30 Gün)',
    'partner.charts.roomTypes': 'Oda Tipine Göre Rezervasyonlar',
    'partner.finance.balance': 'Mevcut Bakiye',
    'partner.finance.nextPayout': 'Sıradaki Ödeme',
    'partner.finance.totalRevenue': 'Toplam Gelir',
    'partner.saveChanges': 'Değişiklikleri Kaydet',
    'partner.saving': 'Kaydediliyor...',
    'partner.saveSuccess': 'Değişiklikler başarıyla kaydedildi!',
    'partner.saveError': 'Değişiklikleri kaydederken bir hata oluştu. Lütfen tekrar deneyin.',
    'partner.generalInfo': 'Genel Bilgiler',
    'partner.propName': 'Tesis Adı',
    'partner.propDesc': 'Açıklama',
    'partner.amenities': 'Olanaklar',
    'partner.amenitiesHint': 'Olanakları virgülle ayırarak listeleyin (örn: Wifi, Havuz, Otopark)',
    'partner.photos': 'Fotoğraflar',
    'partner.photosHint': 'Resimleriniz için doğrudan URL\'leri girin.',
    'partner.addPhoto': 'Fotoğraf Ekle',
    'partner.roomsAndPricing': 'Odalar ve Fiyatlandırma',
    'partner.addRoom': 'Yeni Oda Ekle',
    'partner.editRoom': 'Odayı Düzenle',
    'partner.roomName': 'Oda Adı',
    'partner.capacity': 'Kapasite (misafir)',
    'partner.deleteRoom': 'Odayı Sil',
    'partner.ratePlans': 'Fiyat Planları',
    'partner.addRatePlan': 'Fiyat Planı Ekle',
    'partner.planName': 'Plan Adı',
    'partner.pricePerNight': 'Gecelik fiyat (USD sent)',
    'partner.refundable': 'İade Edilebilir',
    'partner.cancellationPolicy': 'İptal Politikası',
    'partner.deletePlan': 'Planı Sil',
    'partner.confirmDelete': 'Bunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    'partner.bookings.title': 'Son Rezervasyonlar',
    'partner.bookings.guest': 'Misafir',
    'partner.bookings.dates': 'Tarihler',
    'partner.bookings.room': 'Oda',
    'partner.bookings.status': 'Durum',
    'partner.bookings.price': 'Fiyat',
    'partner.finance.title': 'Finansal Kayıtlar',
    'partner.finance.date': 'Tarih',
    'partner.finance.type': 'Tür',
    'partner.finance.bookingId': 'Rezervasyon ID',
    'partner.finance.amount': 'Tutar',
    'policy.notFound': 'İstenen belge bulunamadı.',
    'policy.privacy.title': 'Gizlilik ve Çerez Politikası', 
    'policy.privacy.content': `
        <p class="text-sm text-gray-500">Yürürlük Tarihi: 1 Ocak 2024</p>
        <p class="text-sm text-gray-500">MyBavul.com, ABD'nin Wyoming Eyaleti'nde kayıtlı bir limited şirket olan LitxTech LLC'nin (D-U-N-S®: 144849529) bir iştirakidir.</p>
        
        <h3 class="mt-8">1. Amaç</h3>
        <p>Bu Gizlilik ve Çerez Politikası, MyBavul.com ("biz", "bize" veya "bizim") olarak web sitemizi, uygulamamızı veya ilgili hizmetlerimizi ("Platform") kullandığınızda kişisel verilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı, paylaştığımızı ve koruduğumuzu açıklar. Platformu kullanarak, aşağıda açıklanan şartları kabul etmiş olursunuz.</p>

        <h3>2. Hangi Verileri Topluyoruz</h3>
        <p>Aşağıdaki kategorilerde bilgi topluyoruz:</p>
        <h4>(a) Doğrudan sağladığınız veriler</h4>
        <ul>
            <li>Ad, soyad, e-posta adresi, telefon numarası ve fatura bilgileri</li>
            <li>Rezervasyon bilgileri</li>
            <li>Gönderdiğiniz mesajlar veya yorumlar</li>
            <li>Belgeler veya kimlik bilgileri (yasaların veya Sağlayıcı politikasının gerektirdiği durumlarda)</li>
        </ul>
        <h4>(b) Otomatik olarak toplanan veriler</h4>
        <ul>
            <li>Cihaz bilgileri (tarayıcı türü, işletim sistemi, dil, IP adresi)</li>
            <li>Kullanım verileri (ziyaret edilen sayfalar, harcanan süre, yönlendiren bağlantılar)</li>
            <li>Çerezler ve analiz verileri (Bkz. Bölüm 8)</li>
            <li>Konum verileri (tarayıcınızda veya uygulamanızda konum erişimine izin verirseniz)</li>
        </ul>

        <h3>3. Verilerinizi Nasıl Kullanıyoruz</h3>
        <p>Kişisel verilerinizi şu amaçlarla kullanırız:</p>
        <ul>
            <li>Platformu işletmek, iyileştirmek ve kişiselleştirmek</li>
            <li>Rezervasyonları, ödemeleri veya iadeleri işlemek ve onaylamak</li>
            <li>Müşteri desteği sağlamak ve taleplerinize yanıt vermek</li>
            <li>Sahtekarlığı veya güvenlik olaylarını tespit etmek ve önlemek</li>
            <li>Yasal yükümlülüklere ve vergi/denetim gerekliliklerine uymak</li>
        </ul>
        
        <h3>4. Veri Paylaşımı</h3>
        <p>Kişisel verileri yalnızca gerektiği gibi ve uygun güvencelerle paylaşırız. Verilerinizi üçüncü taraflara satmaz veya kiralamayız.</p>
        
        <h3>5. Uluslararası Veri Transferleri</h3>
        <p>Verileriniz, şirketimizin merkezinin bulunduğu Amerika Birleşik Devletleri'nde işlenebilir veya saklanabilir. Verilerin korunmasını sağlamak için uluslararası veri transferlerinde Standart Sözleşme Maddeleri (SCC'ler) veya eşdeğer güvenceler uygularız.</p>
        
        <h3>6. Haklarınız</h3>
        <p>Bulunduğunuz yere (ör. GDPR, CCPA) bağlı olarak, verilerinize erişme, düzeltme, silme, işlemeye itiraz etme ve verilerinizin bir kopyasını talep etme hakkına sahip olabilirsiniz. Haklarınızı kullanmak için Veri Sorumlumuz ile support@litxtech.com adresinden iletişime geçin.</p>
        
        <h3>7. Bize Ulaşın ve Kurumsal Bilgilendirme</h3>
        <p>Veri Sorumlusu: LitxTech LLC (Wyoming, ABD)<br>
        Genel Merkez: 15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403<br>
        📞 +1 (307) 271-5151<br>
        ✉️ support@litxtech.com</p>
    `,
    'policy.terms.title': 'Hizmet Şartları', 
    'policy.terms.content': `
        <p class="text-sm text-gray-500">Yürürlük tarihi: 1 Ocak 2024</p>
        <p class="text-sm text-gray-500">Bu hizmet, bir LitxTech LLC iştiraki olan MyBavul tarafından işletilmektedir.</p>

        <h3>1. Şartların Kabulü</h3>
        <p>MyBavul.com'a ("Platform") erişerek veya kullanarak, bu Hizmet Şartları'na ("Şartlar") bağlı kalmayı kabul edersiniz. Bu Şartları kabul etmiyorsanız, Platformu kullanmayın. Bu Şartlar, siz ve LitxTech LLC arasında yasal olarak bağlayıcı bir sözleşme teşkil eder.</p>
        
        <h3>2. Rolümüz</h3>
        <p>MyBavul bir aracı pazar yeri olarak hareket eder. Sizi oteller, araç kiralama şirketleri ve turistik yerler gibi seyahat hizmetlerinin üçüncü taraf sağlayıcılarıyla ("Sağlayıcılar") buluştururuz. Gerçek seyahat hizmeti için sözleşmeniz doğrudan Sağlayıcı ile olup, onların hüküm ve koşulları rezervasyonunuza uygulanacaktır.</p>
        
        <h3>3. Platformun Kullanımı</h3>
        <p>Rezervasyon yapmak için en az 18 yaşında olmalısınız. Verdiğiniz bilgilerin doğruluğundan ve hesap kimlik bilgilerinizi gizli tutmaktan siz sorumlusunuz. Platformu herhangi bir sahtekarlık, spekülatif veya yasa dışı faaliyet için kullanmamayı kabul edersiniz.</p>
        
        <h3>4. Rezervasyonlar, Ödemeler ve İptaller</h3>
        <p><strong>Fiyatlar:</strong> Tüm fiyatlar ortaklarımız tarafından sağlandığı gibi görüntülenir ve değişikliğe tabidir.</p>
        <p><strong>Ödemeler:</strong> Ödemeler, ortağımız Stripe, Inc. aracılığıyla güvenli bir şekilde işlenir.</p>
        <p><strong>İptaller ve İadeler:</strong> İptal ve iade politikaları Sağlayıcı tarafından belirlenir ve rezervasyon işlemi sırasında ve onay e-postanızda görüntülenir. İade edilemez rezervasyonlar iptal edilemez veya değiştirilemez.</p>
        
        <h3>5. Sorumluluğun Reddi ve Sınırlandırılması</h3>
        <p>Platform "olduğu gibi" ve "mevcut olduğu gibi" esasına göre sağlanır. Yasaların izin verdiği en geniş ölçüde, LitxTech LLC tüm garantileri reddeder. Platformu kullanımınızdan veya aracılığıyla rezerve edilen herhangi bir seyahat hizmetinden kaynaklanan doğrudan, dolaylı, arızi veya sonuç olarak ortaya çıkan zararlardan sorumlu değiliz.</p>
        
        <h3>6. Geçerli Hukuk ve Yargı Yetkisi</h3>
        <p>Bu Sözleşme, kanunlar ihtilafı ilkelerine bakılmaksızın Amerika Birleşik Devletleri, Wyoming Eyaleti yasalarına tabi olacaktır. Bu Sözleşme'den kaynaklanan veya bununla ilgili herhangi bir anlaşmazlık, Wyoming'de bulunan mahkemelerin münhasır yargı yetkisine tabi olacaktır.</p>
        
        <h3>7. Kurumsal Bilgilendirme</h3>
        <p>MyBavul.com, Wyoming'de kayıtlı LitxTech LLC (D-U-N-S®: 144849529) bünyesinde faaliyet göstermektedir. Genel Merkez: 15442 Ventura Blvd., Ste 201-1834, Sherman Oaks, CA 91403. Resmi iletişim: support@litxtech.com, +1 (307) 271-5151.</p>
    `,
    'policy.dpa.title': 'Veri İşleme Sözleşmesi',
    'policy.dpa.content': 'Veri İşleme Sözleşmesi içeriği burada yer alacaktır. Bu içerik yönetici panelinden yönetilebilir.',
    'policy.cookie.title': 'Çerez Politikası',
    'policy.cookie.content': 'Çerez Politikası içeriği burada yer alacaktır. Bu içerik yönetici panelinden yönetilebilir.',
    'policy.refund.title': 'İade ve İptal Politikası',
    'policy.refund.content': `
        <p class="text-sm text-gray-500">Son güncelleme: 1 Temmuz 2024</p>
        <p>LITXTECH LLC tarafından işletilen MyBavul.com olarak, gezginler ve konaklama sağlayıcıları arasında bir aracı olarak hareket ediyoruz. Tüm rezervasyonlar, iptaller ve iade kuralları, bireysel otel veya seyahat ortağı (ör. Expedia, Hotelbeds veya diğer tedarikçiler) tarafından belirlenir ve rezervasyon onayından önce gösterilir.</p>

        <h3 class="mt-8">1. Genel Politika</h3>
        <p>İptal ve iade koşulları, seçilen otele, oda tipine ve fiyat planına göre değişiklik gösterir.</p>
        <p>Bazı rezervasyonlar iade edilemez olabilirken, diğerleri belirli bir tarihe kadar ücretsiz iptale izin verebilir.</p>
        <p>Uygulanacak politika, ödeme öncesinde her rezervasyon sayfasında açıkça belirtilmiştir.</p>
        <p>Bir rezervasyonu tamamlayarak, ödeme sırasında gösterilen iade koşullarını kabul etmiş olursunuz.</p>

        <h3 class="mt-8">2. İptal Talebi</h3>
        <p>Bir rezervasyonu iptal etmek için, onay e-postanızda verilen bağlantıyı kullanın veya support@litxtech.com adresinden destek ekibimizle iletişime geçin.</p>
        <p>İptal talepleri, tedarikçinin politikasına göre işlenir ve onay e-posta ile gönderilir.</p>
        <p>Rezervasyonunuz iadeye uygunsa, işlem orijinal ödeme yöntemi üzerinden gerçekleştirilir.</p>

        <h3 class="mt-8">3. İade İşlemi</h3>
        <p>İadeler (varsa), tedarikçi onayından sonra 5–10 iş günü içinde başlatılır.</p>
        <p>İşlem ücretleri veya döviz kuru farkları, iade edilen son tutarı etkileyebilir.</p>
        <p>İadeler yalnızca orijinal rezervasyon için kullanılan aynı karta veya ödeme hesabına yapılabilir.</p>

        <h3 class="mt-8">4. İade Edilemeyen Rezervasyonlar</h3>
        <p>"İade edilemez" veya "özel fiyatlı" rezervasyonlar cezasız olarak değiştirilemez veya iptal edilemez.</p>
        <p>Rezervasyona gelinmemesi veya geç iptal durumunda, rezervasyon tutarının tamamı tahsil edilebilir.</p>

        <h3 class="mt-8">5. Mücbir Sebepler</h3>
        <p>Kontrol dışı olaylarda (ör. doğal afetler, salgınlar, seyahat kısıtlamaları), konaklama ortağı tarafından sağlanan iade veya yeniden rezervasyon politikalarını izleyeceğiz.</p>

        <h3 class="mt-8">6. Müşteri Desteği</h3>
        <p>İptal veya iade konusunda yardıma ihtiyacınız varsa, lütfen iletişime geçin:<br>
        📧 support@litxtech.com<br>
        📞 +1 307 271 5151</p>
    `,
    'policy.booking.title': 'Seyahat ve Rezervasyon Şartları',
    'policy.booking.content': `
      <p class="text-sm text-gray-500">Son güncelleme: 05.11.2025<br>İşleten: LITXTECH LLC — MyBavul.com</p>
      <h3>1. Kapsam</h3>
      <p>Bu Seyahat ve Rezervasyon Şartları, MyBavul.com üzerinden yapılan tüm otel ve konaklama rezervasyonlarını yönetir. Bir rezervasyonu tamamlayarak, bu şartları Gizlilik Politikamız, İade Politikamız ve Hizmet Şartlarımız ile birlikte kabul etmiş olursunuz.</p>
      <h3>2. MyBavul'un Rolü</h3>
      <p>MyBavul, yalnızca gezginleri konaklama sağlayıcıları (oteller, ortaklar veya Expedia ya da Hotelbeds gibi distribütörler) ile buluşturan bir aracı platform olarak hareket eder. Konaklama için nihai sözleşme, siz (gezgin) ve hizmeti sağlayan otel veya tedarikçi arasındadır.</p>
      <h3>3. Rezervasyon ve Onay</h3>
      <p>Bir rezervasyon, yalnızca tam ödeme veya depozito başarıyla işlendikten sonra onaylanmış sayılır.</p>
      <p>Otel adı, giriş/çıkış tarihleri ve fiyat koşulları dahil olmak üzere onay bilgileri e-posta ile gönderilir.</p>
      <p>MyBavul, kullanıcı tarafından sağlanan yanlış iletişim bilgilerinden kaynaklanan hatalardan sorumlu değildir.</p>
      <h3>4. Fiyatlandırma ve Vergiler</h3>
      <p>Fiyatlar seçilen para biriminde gösterilir ve aksi belirtilmedikçe tüm zorunlu vergileri içerir.</p>
      <p>Oteller varışta ek yerel vergiler, tesis ücretleri veya depozitolar talep edebilir.</p>
      <p>MyBavul, döviz kurları veya para birimi dönüşümlerinden kaynaklanan farklardan sorumlu değildir.</p>
      <h3>5. Değişiklikler ve İptaller</h3>
      <p>Tüm değişiklikler veya iptaller, otelin veya tedarikçinin politikasına tabidir.</p>
      <p>Bazı rezervasyonlar değiştirilemez ve iade edilemez.</p>
      <p>Değişiklik veya iptal talepleri support@litxtech.com adresine gönderilmelidir.</p>
      <h3>6. Rezervasyona Gelinmemesi Politikası</h3>
      <p>Planlanan tarihte otele gelinmemesi (“no-show”), rezervasyonun tam ücretinin alınması ve geri ödeme yapılmaması ile sonuçlanabilir.</p>
      <h3>7. Otelin Sorumluluğu</h3>
      <p>Tüm otel açıklamaları, olanakları ve fotoğrafları konaklama ortağı tarafından sağlanmaktadır. MyBavul, ağır ihmalden kaynaklanmadıkça, yayınlanan bilgiler ile gerçek deneyim arasındaki farklardan sorumlu değildir.</p>
      <h3>8. Yükümlülük</h3>
      <p>MyBavul, otel veya tedarikçi tarafından kaynaklanan gecikmelerden, iptallerden, fazla rezervasyonlardan veya diğer hizmet başarısızlıklarından sorumlu değildir. Bu gibi durumlarda, iade veya yeniden rezervasyon tedarikçinin politikasını takip edecektir.</p>
      <h3>9. Ödeme Güvenliği</h3>
      <p>Tüm ödemeler, SSL şifrelemesi ve 3D Secure protokolleri kullanılarak Stripe veya diğer PCI uyumlu ağ geçitleri aracılığıyla işlenir. MyBavul hiçbir kredi kartı bilgisini saklamaz.</p>
      <h3>10. Geçerli Hukuk</h3>
      <p>Bu şartlar, kanunlar ihtilafı ilkelerine bakılmaksızın Amerika Birleşik Devletleri, Wyoming yasalarına tabidir. Anlaşmazlıklar, dostane müzakere yoluyla veya gerekirse ABD, Wyoming'in yetkili mahkemeleri aracılığıyla ele alınacaktır.</p>
    `,
    'policy.affiliate.title': 'İştirak ve Komisyon Açıklaması',
    'policy.affiliate.content': `
        <p class="text-sm text-gray-500">Son güncelleme: 2 Temmuz 2024<br>İşleten: LITXTECH LLC — MyBavul.com</p>
        
        <p>MyBavul.com olarak şeffaflık ve güven, çalışma şeklimizin temelini oluşturur. Web sitemizdeki bazı bağlantılar veya listelemeler sizi Expedia Group, Hotelbeds veya diğer rezervasyon platformları gibi güvenilir seyahat ortaklarımıza yönlendirebilir. Bu bağlantılar üzerinden bir rezervasyon veya satın alma yaptığınızda, size hiçbir ek maliyet yansıtılmadan bir komisyon veya yönlendirme ücreti kazanabiliriz.</p>
        
        <p>Bu komisyonlar, hizmetlerimizi sürdürmemize ve iyileştirmemize, yeni seyahat araçları geliştirmemize ve platformu kullanıcılar için ücretsiz tutmamıza yardımcı olur. Ancak, tavsiyelerimiz asla komisyonlardan etkilenmez. Tüm listelemeler ve sonuçlar, ödeme önceliğine göre değil, müsaitlik, fiyat ve kullanıcı alaka düzeyine göre gösterilir.</p>
        
        <p>MyBavul'daki komisyonların veya ortaklıkların nasıl çalıştığı hakkında sorularınız varsa, lütfen bizimle iletişime geçin:<br>
        📧 support@litxtech.com<br>
        📞 +1 307 271 5151</p>
    `,
    'policy.contact.title': 'İletişim ve Yasal Uyarı',
    'policy.contact.content': `
      <p class="text-sm text-gray-500">Son güncelleme: 3 Temmuz 2024</p>
      <h3>Web sitesi operatörü:</h3>
      <p>
          LITXTECH LLC<br>
          ABD, Wyoming Eyaleti'nde kayıtlı<br>
          D-U-N-S® Numarası: 144849529<br>
          İş adresi: 30 N Gould St Ste 4000, Sheridan, WY 82801, Amerika Birleşik Devletleri<br>
          E-posta: support@litxtech.com<br>
          Telefon: +1 307 271 5151
      </p>
      <h3>Yasal Sorumluluk</h3>
      <p>MyBavul.com, konaklama ve seyahat hizmetleri için bir aracı platform olarak hareket eden LITXTECH LLC tarafından işletilmektedir. Tüm otel ve rezervasyon bilgileri, Expedia Group, Hotelbeds ve diğer seyahat sağlayıcıları gibi üçüncü taraf tedarikçiler ve ortaklar tarafından sağlanmaktadır. LITXTECH LLC, konaklama sağlayıcısı değildir ve ortak sistemlerinden kaynaklanan hatalardan veya iptallerden sorumlu tutulamaz.</p>
      <h3>Veri Koruma İletişim</h3>
      <p>Veri gizliliği veya GDPR uyumluluğu ile ilgili sorularınız için lütfen iletişime geçin:<br>
      📧 privacy@litxtech.com (veya birleştirilmişse support@litxtech.com)</p>
      <h3>Fikri Mülkiyet</h3>
      <p>Bu sitedeki tüm ticari markalar, logolar ve içerikler ilgili sahiplerinin mülkiyetindedir. MyBavul’un verilerinin, tasarımının veya içeriğinin herhangi bir şekilde çoğaltılması, kazınması veya izinsiz kullanılması kesinlikle yasaktır.</p>
      <h3>Yargı Yetkisi</h3>
      <p>Bu web sitesinin kullanımından doğan tüm yasal ilişkiler, kanunlar ihtilafı kurallarına bakılmaksızın ABD, Wyoming Eyaleti yasalarına tabidir.</p>
    `,
    'policy.about.title': 'MyBavul.com Hakkında',
    'policy.about.content': `
        <p class="text-sm text-gray-500">Seyahati basitleştirdik — LITXTECH LLC tarafından desteklenmektedir</p>
        <p class="mt-4">MyBavul.com, Soner Toprak tarafından kurulan ve LITXTECH LLC (ABD) tarafından işletilen bağımsız bir otel ve seyahat rezervasyon platformudur. Misyonumuz, seyahat planlamasını herkes için hızlı, güvenli ve uygun fiyatlı hale getirmektir.</p>
        <p class="mt-4">Platform, küresel seyahat verileri ve otel dağıtım sistemleriyle entegre olacak şekilde tasarlanmıştır ve kullanıcıların tek bir yerden geniş bir konaklama seçeneği yelpazesine erişmesine olanak tanır. MyBavul, gezginleri Expedia Group, Hotelbeds gibi veri kaynakları ve tedarikçilerle ve diğer güvenilir ortaklarla buluşturarak gerçek zamanlı otel bilgileri ve rekabetçi fiyatlar sunmayı amaçlamaktadır. Tüm ödemeler Stripe üzerinden güvenli bir şekilde işlenir.</p>
    
        <h3 class="mt-8">Değerlerimiz</h3>
        <ul>
            <li><strong>Şeffaflık:</strong> Fiyatlar, vergiler ve rezervasyon koşulları açıkça gösterilir — gizli ücret yoktur.</li>
            <li><strong>Güvenlik:</strong> SSL şifrelemesi ve güvenilir ödeme ağ geçitleri her işlemi korur.</li>
            <li><strong>Küresel Erişim:</strong> MyBavul, Türkiye'deki ve dünyanın dört bir yanındaki gezginleri binlerce otele bağlar.</li>
            <li><strong>Müşteri Odaklılık:</strong> Yolculuğunuzun her aşamasında 7/24 destek ve net iletişim.</li>
        </ul>
        
        <h3 class="mt-8">Şirket Bilgileri</h3>
        <p>
            LITXTECH LLC<br>
            ABD, Wyoming Eyaleti'nde kayıtlı<br>
            D-U-N-S® Numarası: 144849529<br>
            E-posta: support@litxtech.com<br>
            Telefon: +1 307 271 5151<br>
            Web sitesi: https://www.mybavul.com
        </p>
    `,
    'reviews.title': 'Yorumlar',
    'reviews.leaveReview': 'Yorum Yap',
    'reviews.noReviews': 'Henüz yorum yok.',
    'reviews.rating': 'Puan',
    'reviews.comment': 'Yorum',
    'reviews.submit': 'Yorumu Gönder',
    'reviews.submitting': 'Gönderiliyor...',
    'reviews.success': 'Yorum başarıyla gönderildi!',
    'reviews.error': 'Yorum gönderilemedi. Lütfen tekrar deneyin.',
    'reviews.yourRating': 'Puanınız',
    'reviews.basedOn': '{count} yoruma göre',
    'reviews.overallRating': 'Genel Puan',
    'wishlist.title': 'İstek Listem',
    'wishlist.empty': 'İstek listeniz boş.',
    'wishlist.empty.prompt': 'Keşfetmeye başlayın ve kalp simgesine tıklayarak favori tesislerinizi ekleyin.',
    'profile.title': 'Hesabım',
    'profile.update': 'Değişiklikleri Kaydet',
    'profile.updating': 'Kaydediliyor...',
    'profile.success': 'Profil başarıyla güncellendi!',
    'profile.error': 'Profil güncellenemedi. Lütfen tekrar deneyin.',
    'profile.tabs.personal': 'Kişisel Bilgiler',
    'profile.tabs.security': 'Güvenlik',
    'profile.tabs.notifications': 'Bildirimler',
    'profile.tabs.travelers': 'Yolcular',
    'profile.tabs.reviews': 'Yorumlarım',
    'profile.tabs.loyalty': 'Sadakat Programı',
    'profile.personal.name': 'Tam Ad',
    'profile.personal.dob': 'Doğum Tarihi',
    'profile.personal.hometown': 'Memleket',
    'profile.personal.country': 'Ülke',
    'profile.personal.address': 'Adres Satırı',
    'profile.personal.city': 'Şehir',
    'profile.personal.postalCode': 'Posta Kodu',
    'profile.security.title': 'Parola',
    'profile.security.changePassword': 'Parolayı Değiştir',
    'profile.security.currentPassword': 'Mevcut Parola',
    'profile.security.newPassword': 'Yeni Parola',
    'profile.security.confirmPassword': 'Yeni Parolayı Onayla',
    'profile.security.passwordChanged': 'Parola başarıyla değiştirildi!',
    'profile.security.passwordError': 'Parola değiştirilirken hata oluştu. Lütfen tekrar deneyin.',
    'profile.security.sessionsTitle': 'Aktif Oturumlar',
    'profile.security.sessionsDesc': 'Bu özellik yakında eklenecektir.',
    'profile.notifications.title': 'İletişim Tercihleri',
    'profile.notifications.desc': 'Sizden nasıl haber alacağımızı seçin.',
    'profile.notifications.email': 'E-posta Bildirimleri',
    'profile.notifications.emailDesc': 'Rezervasyon onayları, güncellemeler ve bültenler alın.',
    'profile.notifications.sms': 'SMS Uyarıları',
    'profile.notifications.smsDesc': 'Kritik rezervasyon uyarılarını ve güncellemeleri metin mesajı ile alın.',
    'profile.travelers.title': 'Sık Seyahat Edenler',
    'profile.travelers.desc': 'Rezervasyonları hızlandırmak için sık seyahat ettiğiniz kişilerin bilgilerini ekleyin.',
    'profile.travelers.add': 'Yolcu Ekle',
    'profile.travelers.name': 'Tam Ad',
    'profile.travelers.dob': 'Doğum Tarihi',
    'profile.travelers.noTravelers': 'Henüz yolcu eklenmedi.',
    'profile.reviews.title': 'Yazdığınız Yorumlar',
    'profile.reviews.noReviews': 'Henüz hiç yorum yazmadınız.',
    'profile.reviews.reviewedOn': '{date} tarihinde yorumlandı',
    'profile.loyalty.title': 'MyBavul Sadakat Programı',
    'profile.loyalty.status': 'Durumunuz: Altın Üye',
    'profile.loyalty.points': '4.500 puanınız var.',
    'profile.loyalty.desc': 'Geç çıkışlar, oda yükseltmeleri ve özel indirimler gibi özel avantajlardan yararlanıyorsunuz.',
    'profile.loyalty.cta': 'Tüm Avantajları Gör',
    'support.title': 'Destek Merkezi',
    'support.subtitle': 'Sorularınız mı var veya rezervasyonunuzla ilgili yardıma mı ihtiyacınız var? Sizin için buradayız.',
    'support.email': 'E-posta Desteği',
    'support.email.desc': 'Acil olmayan sorular için en iyisi. 24 saat içinde yanıt vermeyi hedefliyoruz.',
    'support.phone': 'Telefon Desteği',
    'support.phone.desc': 'Acil konular için anında yardım almak üzere lütfen bizi doğrudan arayın.',
    'support.address': 'Posta Adresi',
    'support.address.desc': 'Resmi yazışmalar için kurumsal merkezimiz.',
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (code: string) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  formatDate: (dateString: string, options?: Intl.DateTimeFormatOptions) => string;
} | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageCode, setLanguageCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mybavul-lang') || 'en';
    }
    return 'en';
  });

  const language = languages.find(l => l.code === languageCode) || languages[0];

  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
  }, [language]);

  const setLanguage = (code: string) => {
    if (languages.some(l => l.code === code)) {
      setLanguageCode(code);
      localStorage.setItem('mybavul-lang', code);
    }
  };

  const t = useCallback((key: string, options?: Record<string, string | number>) => {
    let translation = translations[language.code]?.[key] || translations['en'][key] || key;
    if (options) {
        Object.keys(options).forEach(optionKey => {
            translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
        });
    }
    return translation;
  }, [language.code]);
  
  const formatDate = useCallback((dateString: string, options?: Intl.DateTimeFormatOptions) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(language.code, { ...defaultOptions, ...options });
    return formatter.format(new Date(dateString));
  }, [language.code]);

  const value = useMemo(() => ({ language, setLanguage, t, formatDate }), [language, t, formatDate]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
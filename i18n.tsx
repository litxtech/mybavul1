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
  'header.myReservations': 'My Reservations', 'header.myWishlist': 'My Wishlist', 'header.myProfile': 'My Profile', 'header.signIn': 'Sign In', 'header.logout': 'Log Out',
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
  'home.destinations.title': 'Popular Destinations',
  'home.featured.title': 'Top-Rated Stays',
  'home.propertyTypes.title': 'Browse by Property Type', 'home.propertyTypes.boutique': 'Boutique Hotels', 'home.propertyTypes.resorts': 'Beach Resorts', 'home.propertyTypes.villas': 'Private Villas', 'home.propertyTypes.cave': 'Cave Suites',
  'home.features.title': 'Why Choose MyBavul?', 'home.features.ai.title': 'AI-Powered Travel', 'home.features.ai.desc': 'Get personalized tips and local guides with our integrated AI assistant.', 'home.features.price.title': 'Best Price Guarantee', 'home.features.price.desc': 'We find the best deals from thousands of properties so you don\'t have to.', 'home.features.support.title': '24/7 Customer Support', 'home.features.support.desc': 'Our team is here to help you anytime, anywhere during your travels.',
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
  'policy.refund.title': 'Refund Policy',
  'policy.refund.content': `
    <p class="text-sm text-gray-500">Effective Date: November 2025<br>Last Updated: November 2025</p>
    <p>Thank you for booking with MyBavul.com, operated by LitxTech LLC. This Refund Policy explains the conditions under which refunds may be granted for hotel and accommodation reservations made through our platform.</p>

    <hr class="my-6">

    <h3>1. General Policy</h3>
    <p>All bookings on MyBavul.com are confirmed in real-time and are subject to the individual cancellation and refund policies of each accommodation provider. When you make a booking, you agree to the specific refund terms displayed at the time of purchase.</p>

    <h3>2. Refund Eligibility</h3>
    <p>Refunds may be granted under the following conditions:</p>
    <ul>
        <li><strong>Fully refundable reservations:</strong> If canceled within the free cancellation period stated during booking.</li>
        <li><strong>Partially refundable reservations:</strong> If canceled after the free period but before check-in, according to the hotel’s terms.</li>
        <li><strong>Non-refundable reservations:</strong> No refunds are available for cancellations or no-shows unless required by law.</li>
    </ul>
    <p>If a hotel fails to honor your booking or the accommodation is unavailable upon arrival, MyBavul will work directly with the property to provide an alternative or process a refund.</p>

    <h3>3. Force Majeure (Unforeseen Events)</h3>
    <p>In case of travel restrictions, natural disasters, or emergencies, refunds or credits may be issued at the discretion of the accommodation provider and MyBavul’s support team.</p>

    <h3>4. Refund Process</h3>
    <p>Refunds are processed back to the original payment method (e.g., credit/debit card via Stripe). Processing times may vary depending on your bank or payment provider but usually take 5–10 business days after approval.</p>

    <h3>5. Service Fees</h3>
    <p>Certain administrative or transaction fees (such as Stripe payment fees) may be non-refundable unless required by applicable law.</p>

    <h3>6. Contact for Refund Requests</h3>
    <p>For refund inquiries, please contact our customer support team with your booking reference and payment details:</p>
    <p>
        📧 support@litxtech.com<br>
        📍 LitxTech LLC – MyBavul.com<br>
        15442 Ventura Blvd, Suite 201-1834<br>
        Sherman Oaks, CA 91403, United States
    </p>
    <p>Our team will review your request and respond within 3 business days.</p>

    <h3>7. Changes to This Policy</h3>
    <p>MyBavul reserves the right to modify this Refund Policy at any time to comply with updated legal requirements or platform changes. The latest version will always be available on our website.</p>
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
  'profile.title': 'My Profile',
  'profile.name': 'Full Name',
  'profile.avatar': 'Avatar URL',
  'profile.email': 'Email',
  'profile.update': 'Update Profile',
  'profile.updating': 'Updating...',
  'profile.success': 'Profile updated successfully!',
  'profile.error': 'Failed to update profile. Please try again.',
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
    'header.myReservations': 'Rezervasyonlarım', 'header.myWishlist': 'İstek Listem', 'header.myProfile': 'Profilim', 'header.signIn': 'Giriş Yap', 'header.logout': 'Çıkış Yap',
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
    'home.destinations.title': 'Popüler Destinasyonlar',
    'home.featured.title': 'En Yüksek Puanlı Tesisler',
    'home.propertyTypes.title': 'Tesis Türüne Göre Göz Atın', 'home.propertyTypes.boutique': 'Butik Oteller', 'home.propertyTypes.resorts': 'Sahil Otelleri', 'home.propertyTypes.villas': 'Özel Villalar', 'home.propertyTypes.cave': 'Mağara Süitleri',
    'home.features.title': 'Neden MyBavul?', 'home.features.ai.title': 'Yapay Zekâ Destekli Seyahat',
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
    'policy.refund.title': 'İade Politikası',
    'policy.refund.content': 'İade Politikası içeriği burada yer alacaktır. Bu içerik yönetici panelinden yönetilebilir.',
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
    'profile.title': 'Profilim',
    'profile.name': 'Tam Ad',
    'profile.avatar': 'Avatar URL',
    'profile.email': 'E-posta',
    'profile.update': 'Profili Güncelle',
    'profile.updating': 'Güncelleniyor...',
    'profile.success': 'Profil başarıyla güncellendi!',
    'profile.error': 'Profil güncellenemedi. Lütfen tekrar deneyin.',
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
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
  'city.barcelona': 'Barcelona', 'city.madrid': 'Madrid', 'city.palma': 'Palma', 'city.istanbul': 'Istanbul',
  'results.title': 'Results for "{city}"', 'results.noResults': 'No properties found for your search.', 'results.backToHome': 'New Search', 'results.allDestinations': 'All Destinations',
  'results.sort.title': 'Sort by:', 'results.sort.price': 'Price (low to high)', 'results.sort.stars': 'Stars (high to low)',
  'results.filter.title': 'Filter by:', 'results.filter.freeCancellation': 'Free Cancellation',
  'card.from': 'from', 'card.perNight': '/night', 'card.reviews': '({count} reviews)', 'card.freeCancellation': 'Free cancellation',
  'details.backToResults': 'Back to Results', 'details.chooseRoom': 'Choose your room', 'details.yourSelection': 'Your Selection', 'details.room': 'Room', 'details.plan': 'Plan', 'details.bookNow': 'Reserve and Pay', 'details.guestsUpTo': 'Up to {count} guests', 'details.loginToBook': 'Log in to book', 'details.nights_one': 'night', 'details.nights_other': '{count} nights', 'details.total': 'Total', 'details.refundable': 'Refundable', 'details.nonRefundable': 'Non-refundable',
  'ai.title': 'Bavul AI Assistant', 'ai.subtitle': 'Discover local gems and plan your trip!', 'ai.button': 'Ask about this area', 'ai.button.loading': 'Thinking...', 'ai.loadingMessage': 'Your personal guide is on its way...',
  'footer.weAccept': 'Secure Payments With:',
  'home.destinations.title': 'Popular Destinations',
  'home.featured.title': 'Top-Rated Stays',
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
    <p class="text-sm text-gray-500">Effective date: 03 November 2025</p>
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
};

const translations: Record<string, Record<string, string>> = {
  en: enTranslations,
  tr: {
    ...enTranslations, // Basic fallback
    'loading': 'Yükleniyor...',
    'header.myReservations': 'Rezervasyonlarım', 'header.login': 'Giriş Yap', 'header.signup': 'Kayıt Ol', 'header.logout': 'Çıkış Yap',
    'home.title': 'Bir sonraki konaklamanızı bulun', 'home.subtitle': 'Oteller, evler ve çok daha fazlası için fırsatları arayın...',
    'search.destination': 'Destinasyon', 'search.checkin': 'Giriş', 'search.checkout': 'Çıkış', 'search.guests': 'Misafirler', 'search.button': 'Ara', 'search.placeholder': 'örn. İstanbul',
    'city.barcelona': 'Barselona', 'city.madrid': 'Madrid', 'city.palma': 'Palma', 'city.istanbul': 'İstanbul',
    'results.title': '"{city}" için sonuçlar', 'results.noResults': 'Aramanız için tesis bulunamadı.', 'results.backToHome': 'Yeni Arama',
    'results.sort.title': 'Sırala:', 'results.sort.price': 'Fiyat (düşükten yükseğe)', 'results.sort.stars': 'Yıldız (yüksekten düşüğe)',
    'results.filter.title': 'Filtrele:', 'results.filter.freeCancellation': 'Ücretsiz İptal',
    'card.from': 'başlayan', 'card.perNight': '/gece', 'card.reviews': '({count} yorum)', 'card.freeCancellation': 'Ücretsiz iptal',
    'details.backToResults': 'Sonuçlara Geri Dön', 'details.chooseRoom': 'Odanızı seçin', 'details.yourSelection': 'Seçiminiz', 'details.room': 'Oda', 'details.plan': 'Plan', 'details.bookNow': 'Rezerve Et ve Öde', 'details.guestsUpTo': '{count} misafire kadar', 'details.loginToBook': 'Rezervasyon için giriş yapın', 'details.nights_one': 'gece', 'details.nights_other': '{count} gece', 'details.total': 'Toplam', 'details.refundable': 'İade Edilebilir', 'details.nonRefundable': 'İade Edilemez',
    'ai.title': 'Bavul AI Asistanı', 'ai.subtitle': 'Yerel harikaları keşfedin ve seyahatinizi planlayın!', 'ai.button': 'Bölge hakkında sor',
    'home.destinations.title': 'Popüler Destinasyonlar',
    'home.featured.title': 'En Yüksek Puanlı Tesisler',
    'home.propertyTypes.title': 'Tesis Türüne Göre Göz Atın', 'home.propertyTypes.boutique': 'Butik Oteller', 'home.propertyTypes.resorts': 'Sahil Otelleri', 'home.propertyTypes.villas': 'Özel Villalar', 'home.propertyTypes.cave': 'Mağara Süitleri',
    'home.features.title': 'Neden MyBavul?', 'home.features.ai.title': 'Yapay Zekâ Destekli Seyahat',
    'auth.login.title': 'Hesabınıza giriş yapın', 'auth.signup.title': 'Hesap oluşturun', 'auth.email': 'E-posta adresi', 'auth.password': 'Şifre', 'auth.login.button': 'Giriş Yap', 'auth.signup.button': 'Kayıt Ol', 'auth.noAccount': 'Hesabınız yok mu?', 'auth.haveAccount': 'Zaten bir hesabınız var mı?',
    'reservations.title': 'Rezervasyonlarım', 'reservations.noReservations': 'Henüz hiç rezervasyonunuz yok.', 'reservations.status.pending': 'Beklemede', 'reservations.status.confirmed': 'Onaylandı', 'reservations.status.cancelled': 'İptal Edildi', 'reservations.status.refunded': 'İade Edildi', 'reservations.status.partially_refunded': 'Kısmen İade Edildi', 'reservations.status.chargeback': 'Ters İbraz', 'reservations.status.no_show': 'Gelmeme', 'reservations.bookedOn': 'Rezervasyon tarihi', 'reservations.cancel': 'Rezervasyonu İptal Et',
    'reservations.cancelModal.title': 'İptali Onayla', 'reservations.cancelModal.body': 'Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.', 'reservations.cancelModal.confirm': 'Evet, İptal Et', 'reservations.cancelModal.goBack': 'Geri Dön', 'reservations.cancelModal.cancelling': 'İptal ediliyor...', 'reservations.cancelModal.error': 'Rezervasyon iptal edilemedi. Lütfen destek ile iletişime geçin.', 'reservations.cancelModal.success': 'Rezervasyon başarıyla iptal edildi.', 'reservations.cancelModal.nonRefundable': 'Bu rezervasyon iade edilemez ve iptal edilemez.',
    'booking.success.title': 'Rezervasyon Onaylandı!', 'booking.success.message': 'Ödemeniz başarılı oldu ve rezervasyonunuz onaylandı. "Rezervasyonlarım" bölümünde görüntüleyebilirsiniz.', 'booking.success.button': 'Rezervasyonlarımı Görüntüle',
    'booking.cancelled.title': 'Rezervasyon İptal Edildi', 'booking.cancelled.message': 'Ödemeniz iptal edildi. Tekrar rezervasyon yapmayı deneyebilirsiniz.', 'booking.cancelled.button': 'Ana Sayfaya Dön',
    'booking.error': 'Rezervasyon sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'booking.redirectingToPayment': 'Ödemeye yönlendiriliyor...',
    'footer.weAccept': 'Güvenli Ödeme Yöntemleri:',
    'admin.title': 'Yönetim Paneli', 'admin.policies.title': 'Politika Belgelerini Yönet', 'admin.policies.new': 'Yeni Belge', 'admin.policies.edit': 'Belgeyi Düzenle', 'admin.policies.table.title': 'Başlık', 'admin.policies.table.slug': 'Link (URL)', 'admin.policies.table.active': 'Aktif', 'admin.policies.table.actions': 'Eylemler', 'admin.policies.form.titleKey': 'Başlık Anahtarı (i18n)', 'admin.policies.form.contentKey': 'İçerik Anahtarı (i18n)', 'admin.policies.form.slug': 'URL Kısaltması', 'admin.policies.form.sortOrder': 'Sıralama', 'admin.policies.form.isActive': 'Aktif mi?', 'admin.save': 'Kaydet', 'admin.cancel': 'İptal', 'admin.delete': 'Sil', 'admin.deleteConfirm': 'Emin misiniz?',
    'admin.accessDenied.title': 'Erişim Engellendi', 'admin.accessDenied.message': 'Bu sayfayı görüntüleme yetkiniz yok. Lütfen bir yönetici ile iletişime geçin.',
    'policy.notFound': 'İstenen belge bulunamadı.',
    'policy.privacy.title': 'Gizlilik ve Çerez Politikası', 
    'policy.privacy.content': `
        <p class="text-sm text-gray-500">Yürürlük Tarihi: 03 Kasım 2025</p>
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
        <p class="text-sm text-gray-500">Yürürlük tarihi: 03 Kasım 2025</p>
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
    'city.barcelona': 'برشلونة', 'city.madrid': 'مدريد', 'city.palma': 'بالما', 'city.istanbul': 'اسطنبول',
    'results.title': 'نتائج البحث عن "{city}"', 'results.noResults': 'لم يتم العثور على عقارات لبحثك.', 'results.backToHome': 'بحث جديد',
    'results.sort.title': 'ترتيب حسب:', 'results.sort.price': 'السعر (من الأقل إلى الأعلى)', 'results.sort.stars': 'النجوم (من الأعلى إلى الأقل)',
    'results.filter.title': 'تصفية حسب:', 'results.filter.freeCancellation': 'إلغاء مجاني',
    'card.from': 'من', 'card.perNight': '/ليلة', 'card.reviews': '({count} تقييم)', 'card.freeCancellation': 'إلغاء مجاني',
    'details.backToResults': 'العودة إلى النتائج', 'details.chooseRoom': 'اختر غرفتك', 'details.yourSelection': 'اختيارك', 'details.room': 'غرفة', 'details.plan': 'خطة', 'details.bookNow': 'احجز وادفع', 'details.guestsUpTo': 'حتى {count} ضيوف', 'details.loginToBook': 'سجل الدخول للحجز', 'details.nights_one': 'ليلة', 'details.nights_other': '{count} ليالٍ', 'details.total': 'المجموع', 'details.refundable': 'قابل للاسترداد', 'details.nonRefundable': 'غير قابل للاسترداد',
    'ai.title': 'مساعد الذكاء الاصطناعي من BAVUL', 'ai.subtitle': 'اكتشف الجواهر المحلية وخطط لرحلتك!', 'ai.button': 'اسأل عن هذه المنطقة',
    'home.featured.title': 'الإقامات الأعلى تقييماً',
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
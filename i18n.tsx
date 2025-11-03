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
  'policy.privacy.title': 'Privacy Policy',
  'policy.privacy.content': 'This is the privacy policy. **Markdown is supported!** You can manage this content from the Admin Panel. We take your privacy seriously. We collect information to provide better services to all our users. We collect information in the following ways: Information you give us. For example, many of our services require you to sign up for an account. When you do, we’ll ask for personal information, like your name, email address, telephone number or credit card to store with your account.',
  'policy.terms.title': 'Terms of Service',
  'policy.terms.content': 'Welcome to MyBavul! These are our terms of service. By using our services, you are agreeing to these terms. Please read them carefully. You can manage this content from the Admin Panel. Our services display some content that is not MyBavul’s. This content is the sole responsibility of the entity that makes it available.',
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
    'policy.privacy.title': 'Gizlilik Politikası', 'policy.privacy.content': 'Bu gizlilik politikasıdır. **Markdown desteklenmektedir!** Bu içeriği Yönetim Panelinden yönetebilirsiniz. Gizliliğinizi ciddiye alıyoruz. Tüm kullanıcılarımıza daha iyi hizmet sunmak için bilgi toplarız. Bilgileri şu yollarla toplarız: Bize verdiğiniz bilgiler. Örneğin, hizmetlerimizin birçoğu bir hesaba kaydolmanızı gerektirir. Bunu yaptığınızda, hesabınızda saklamak üzere adınız, e-posta adresiniz, telefon numaranız veya kredi kartınız gibi kişisel bilgileri isteriz.',
    'policy.terms.title': 'Hizmet Şartları', 'policy.terms.content': 'MyBavul\'a hoş geldiniz! Bunlar hizmet şartlarımızdır. Hizmetlerimizi kullanarak bu şartları kabul etmiş olursunuz. Lütfen dikkatlice okuyun. Bu içeriği Yönetim Panelinden yönetebilirsiniz. Hizmetlerimiz, MyBavul\'a ait olmayan bazı içerikleri görüntüler. Bu içerik, onu kullanılabilir kılan tüzel kişiliğin sorumluluğundadır.',
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
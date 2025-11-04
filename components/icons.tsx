import React from 'react';

export const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.455 0l2.365 4.872 5.38.782c.73.106 1.02.996.494 1.508l-3.89 3.79.92 5.358c.125.728-.638 1.28-1.29.953L10 18.24l-4.802 2.525c-.652.328-1.415-.225-1.29-.953l.92-5.358-3.89-3.79c-.527-.512-.236-1.402.493-1.508l5.38-.782 2.365-4.872z" clipRule="evenodd" />
  </svg>
);

export const StarIconOutline = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);


export const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a7.5 7.5 0 00-14.98 0 .07.07 0 00-.002.002A4.5 4.5 0 005.5 21h9a4.5 4.5 0 004.43-3.998c.032-.23.05-.465.05-.702a4 4 0 00-3.52-3.957z" />
  </svg>
);

export const LocationIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.106.38-.223.57-.352l.028-.019c.11-.076.22-.153.33-.234.284-.208.55-.448.79-.714l.004-.005c.24-.269.46-.56.65-.873.18-.3.34-.621.48-.958.14-.328.25-.678.34-1.038.09-.353.15-.724.19-1.102.04-.37.06-.759.06-1.161 0-.693-.05-1.348-.13-1.968-.08-.609-.2-1.192-.35-1.745-.15-.539-.33-1.047-.54-1.512-.2-.452-.43-.865-.69-1.23-.26-.352-.55-.658-.87-.905-.32-.237-.68-.41-1.06-.513C10.97 3.01 10.51 3 10 3c-.51 0-.97.01-1.42.049-.38.093-.74.266-1.06.513-.32.247-.61.553-.87.905-.26.365-.49.778-.69 1.23-.21.465-.39.973-.54 1.512-.15.553-.27 1.136-.35 1.745-.08.62-.13 1.275-.13 1.968 0 .402.02.79.06 1.161.04.378.06.749.19 1.102.09.36.15.711.34 1.038.14.337.26.687.48.958.19.313.41.604.65.873l.004.005c.24.266.506.506.79.714.11.08.22.158.33.234l.028.019c.19.129.384.246.57.352a5.741 5.741 0 00.281.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
  </svg>
);

export const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 6.75A1.25 1.25 0 015.75 8h8.5a1.25 1.25 0 011.25 1.25v5.5A1.25 1.25 0 0114.25 16h-8.5A1.25 1.25 0 014.5 14.75v-5.5z" clipRule="evenodd" />
  </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624L16.5 21.75l-.398-1.126a3.375 3.375 0 00-2.455-2.456L12.75 18l1.126-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.126a3.375 3.375 0 002.456 2.456l1.126.398-1.126.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

export const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-18c-4.97 0-9 4.03-9 9s4.03 9 9 9 9 4.03 9 9-4.03 9-9 9zM3.293 12.707a9 9 0 010-1.414M20.707 12.707a9 9 0 000-1.414M9.5 3.5v17m5-17v17" />
    </svg>
);

export const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.956 11.956 0 013.825 8.51m0 0A11.953 11.953 0 0112 3C12.342 3 12.673 3.012 13 3.035m-3.175 5.484A9.01 9.01 0 0112 5.25c.163 0 .323.006.48.017m-.328 8.016A9.01 9.01 0 0112 18.75c-1.631 0-3.158-.44-4.5-1.216m9.328-8.016c.32.164.63.342.932.535m0 0a11.953 11.953 0 01-9.328 9.328m0 0A11.953 11.953 0 013 12m9 9a11.953 11.953 0 01-9-9" />
  </svg>
);

export const TagIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12h5.25m-5.25 3h5.25m-5.25 3h5.25m-5.25 3h5.25M3.75 6H7.5v12H3.75V6zM20.25 6H12v12h8.25V6z" />
  </svg>
);

export const ChatBubbleLeftRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a6.037 6.037 0 00-1.74-1.123 6.037 6.037 0 00-3.536 0 6.037 6.037 0 00-1.74 1.123l-3.72 3.72C3.847 17.18 3 16.223 3 15.09V10.805c0-.97.616-1.813 1.5-2.097L6.6 6.335a6.055 6.055 0 013.44-1.332 6.055 6.055 0 013.44 1.332l3.3 2.176z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.805a6.037 6.037 0 013.44-1.332 6.055 6.055 0 013.44 1.332l3.3 2.176M17.4 6.335a6.055 6.055 0 00-3.44-1.332 6.055 6.055 0 00-3.44 1.332L3 10.805" />
    </svg>
);

export const BuildingOfficeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21V3.75h7.5V21h-7.5zM12 12h.008v.008H12V12z" />
    </svg>
);

export const SunIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const HomeModernIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m1.5 0h1.5m-1.5 0V3.545M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const MountainIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 21L12.75 3l6 18M6.75 21L2 21m18 0l-4.75 0M9 14.25h6" />
    </svg>
);

export const LogoutIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const CurrencyDollarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.621L9 12.282M15 18a9 9 0 11-6-16.182" />
    </svg>
);

export const MercuryIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.235 41.5C32.558 41.5 41.735 32.221 41.735 20.75C41.735 9.279 32.558 0 21.235 0C9.912 0 0.735001 9.279 0.735001 20.75C0.735001 32.221 9.912 41.5 21.235 41.5Z" fill="currentColor"></path>
      <path d="M22.05 28.113C19.743 28.113 17.81 26.513 17.435 24.326L13.881 24.413C14.363 28.538 17.81 31.5 22.05 31.5C27.185 31.5 30.631 27.6 30.631 22.1C30.631 16.963 26.6 13.063 21.785 13.063C16.863 13.063 13.418 16.855 13.418 21.613L16.863 21.526C17.05 18.826 19.013 17.138 21.785 17.138C24.485 17.138 26.555 19.013 26.555 21.9C26.555 25.45 24.298 28.113 22.05 28.113Z" fill="#fff"></path>
    </svg>
);

export const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        <path d="M1 1h22v22H1z" fill="none" />
    </svg>
);

export const StripeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 46 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M45.34 3.35v13.3H40.6v-2.3c-1.3 1.8-3.4 2.91-6.14 2.91-4.72 0-8.54-3.83-8.54-8.55s3.82-8.55 8.54-8.55c2.75 0 4.84 1.1 6.14 2.9V0H45v3.13c.12.08.2.13.34.22zM34.46 12.8c0-2.5 2.02-4.5 4.5-4.5s4.5 2.01 4.5 4.5-2.02 4.5-4.5 4.5-4.5-2-4.5-4.5z" fill="currentColor"></path>
        <path d="M23.16 3.35v13.3h-4.73V3.35h4.73zM15.83 3.35v13.3H11.1V3.35h4.73zM8.2 16.65H3.47V3.35h4.4l4.22 10.15V3.35h4.1v13.3h-4.3L7.9 6.8v9.85H8.2z" fill="currentColor"></path>
    </svg>
);

export const VisaIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 12" fill="currentColor">
        <path d="M33.93,0H26.331a2.15,2.15,0,0,0-2.08,1.4L19.45,12h4.73l1.58-4.23h4.43l-.78,4.23h4.51Zm-3.8,5.55L28.1,7.82h2.06Z"/>
        <path d="M18.84,11.83.17,12,6.34,0H10.9L5,11.81,4.72,12h4.52l.27-.17L14.73,0h4.11Z"/>
        <path d="M38,1.22,37.3,0H34.19l3.52,12h2.26a2.2,2.2,0,0,0,2.1-1.57L45.6,1.22Z" fill="#ff5f00"/>
    </svg>
);

export const MastercardIcon = ({ className }: { className?: string }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24">
        <path d="M35.1,6.5H2.9a2.9,2.9,0,0,0-2.9,2.9v5.3a2.9,2.9,0,0,0,2.9,2.9H35.1a2.9,2.9,0,0,0,2.9-2.9V9.3A2.9,2.9,0,0,0,35.1,6.5Z" fill="#ff5f00"/>
        <circle cx="12.3" cy="12" r="7" fill="#eb001b"/>
        <path d="M25.8,12a7,7,0,0,1-11,6.1,7,7,0,0,0,0-12.2,7,7,0,0,1,11,6.1Z" fill="#f79e1b"/>
    </svg>
);

export const AmexIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" fill="#006fcf">
        <path d="M35,0H3A3,3,0,0,0,0,3V21a3,3,0,0,0,3,3H35a3,3,0,0,0,3-3V3A3,3,0,0,0,35,0Zm1,21a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V3A1,1,0,0,1,3,2H35a1,1,0,0,1,1,1Z"/>
        <path d="M15.56,6.66,13,7.74v.81l2.49,1V10l-2.49,1v.83l2.58,1.08L17.3,15.4H15.4l-1.39-2.6L12.6,15.4H10.55l2.1-3.42-2.5-1v-.8l2.5-1L10.48,6H12.4l1.46,2.54,1.4-2.54Z" fill="#FFF"/>
        <path d="M21.13,11.33l-1-1.6h.47l.79,1.25.79-1.25h.47l-1,1.6,1.08,1.72h-.48l-.86-1.34-.86,1.34h-.48ZM28.2,11.33l-1-1.6h.47l.79,1.25.79-1.25h.47l-1,1.6,1.08,1.72h-.48l-.86-1.34-.86,1.34h-.48ZM24.4,13.05h1.57v.38H23.6v-5h.8ZM21.84,8.81h.83v-.37H20.4v.37h.81v3.85h.63Z" fill="#FFF"/>
    </svg>
);

export const PayPalIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" fill="currentColor">
        <path d="M21.9,13.2a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H14c-1.8,0-2.8,1.3-3.1,3.1a.9.9,0,0,0,1,.8h.3l.3-1.8c.2-1,.8-1.5,1.7-1.5h1.2c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1h-1a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H8.8c-1.8,0-2.8,1.3-3.1,3.1a1,1,0,0,0,1,.8h.4l.2-1.2c.2-1,.8-1.5,1.7-1.5h.5c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1h-.7a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H1.9c-1,0-1.7.7-1.9,1.6-.2.8.2,1.6.9,2h5.8a1.2,1.2,0,0,0,1.2-1.2,1.3,1.3,0,0,0,1.2-1.2h4.5a1.2,1.2,0,0,0,1.2-1.2,1.3,1.3,0,0,0,1.2-1.2h2.5c2.3,0,3.6-1.6,4-3.9a3.1,3.1,0,0,0-3-3.3H21.9Z" fill="#009cde"/>
        <path d="M24.4,7.1a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H16.5c-1.8,0-2.8,1.3-3.1,3.1a.9.9,0,0,0,1,.8h.3l.3-1.8c.2-1,.8-1.5,1.7-1.5h1.2c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1H17a1.2,1.2,0,0,0-1.2,1.2A1.3,1.3,0,0,0,14.6,13h-4c-1.8,0-2.8,1.3-3.1,3.1a1,1,0,0,0,1,.8H9l.2-1.2c.2-1,.8-1.5,1.7-1.5H11c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1h-.7a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H4.4c-1,0-1.7.7-1.9,1.6-.2.8.2,1.6.9,2H17.2c2.8,0,4.8-1.9,5.2-4.9.5-3.3-1.2-5.4-4-5.4H24.4Z" fill="#003087"/>
        <path d="M36.1,13.2a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2H28.3c-1.8,0-2.8,1.3-3.1,3.1a.9.9,0,0,0,1,.8h.3l.3-1.8c.2-1,.8-1.5,1.7-1.5h1.2c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1h-1a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2h-4c-1.8,0-2.8,1.3-3.1,3.1a1,1,0,0,0,1,.8H17l.2-1.2c.2-1,.8-1.5,1.7-1.5h.5c.8,0,1.3.5,1.2,1.4a1,1,0,0,1-1,1h-.7a1.2,1.2,0,0,0-1.2,1.2,1.3,1.3,0,0,0-1.2-1.2h-4c-1,0-1.7.7-1.9,1.6-.2.8.2,1.6.9,2h5.8a1.2,1.2,0,0,0,1.2-1.2,1.3,1.3,0,0,0,1.2-1.2h4.5a1.2,1.2,0,0,0,1.2-1.2,1.3,1.3,0,0,0,1.2-1.2h2.5c2.3,0,3.6-1.6,4-3.9a3.1,3.1,0,0,0-3-3.3H36.1Z" fill="#002f86"/>
    </svg>
);

export const MapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-11.5-1.2 1.2M18.75 12l-1.2-1.2m-6 11.25L5.25 6l-3 3m15 0l-3-3-3 3" />
    </svg>
);

export const ListBulletIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);

export const PlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const PaperAirplaneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

export const HeartIconOutline = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const EnvelopeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
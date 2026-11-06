'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStorefront } from './StorefrontProvider';
import { LuxuryMoreDrawer } from '@/themes/base/luxury-noir/components/LuxuryMoreDrawer';

export function MobileAppTabBar() {
  const sf = useStorefront();
  const pathname = usePathname() || '/';
  const isHomeRoute = pathname === '/';
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const activeTheme = sf.activeTheme || 'luxury-noir';
  const palette = sf.palette;
  const isLight = palette?.isLight ?? false;

  const mobileTab = sf.mobileTab || 'home';
  const setMobileTab = sf.setMobileTab;
  const cart = sf.cart;

  // Determine active state for each of the 5 tabs
  const isHomeActive = isHomeRoute && mobileTab === 'home';
  const isCatalogActive = isHomeRoute && mobileTab === 'catalog';
  const isAuthActive =
    (isHomeRoute && (mobileTab === 'authenticity' || mobileTab === 'routine')) ||
    pathname.startsWith('/authenticity-hub');
  const isCartActive = cart.isOpen;
  const isMoreActive =
    isMoreOpen ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/bookings') ||
    pathname.startsWith('/account');

  // Dynamic Theme Colors
  const bgStyle = isLight
    ? activeTheme === 'clinic-lab'
      ? '#FFFFFF'
      : '#FAF7F2'
    : '#0A0A0D';

  const borderStyle = isLight
    ? activeTheme === 'clinic-lab'
      ? '#E2ECE9'
      : '#E8E2D8'
    : 'rgba(255, 255, 255, 0.08)';

  const activeColor = isLight
    ? activeTheme === 'clinic-lab'
      ? '#0F4C4A'
      : '#8C5E3C'
    : '#FCF6BA';

  const inactiveColor = isLight
    ? activeTheme === 'clinic-lab'
      ? '#4A7C79'
      : '#78716C'
    : '#9A968E';

  const handleTabClick = (tab: 'home' | 'catalog' | 'authenticity') => {
    if (setMobileTab) {
      setMobileTab(tab);
    }
  };

  const navLinks = [
    { labelAr: 'الرئيسية', labelEn: 'Home', href: '/' },
    { labelAr: 'المنتجات والكتالوج', labelEn: 'Catalog', href: '/?tab=catalog' },
    { labelAr: 'فحص الأصالة السريري', labelEn: 'Authenticity Lab', href: '/authenticity-hub' },
    { labelAr: 'المجلة العلمية', labelEn: 'Scientific Journal', href: '/blog' },
    { labelAr: 'حجز استشارة مجانية', labelEn: 'Consultation Booking', href: '/bookings' },
    { labelAr: 'حسابي ونقاط الولاء', labelEn: 'Account & Club', href: '/account' },
  ];

  const contact = sf.tenant?.contact || {
    phone: sf.tenant?.phone || '775234989',
    whatsapp: sf.tenant?.whatsapp || '775234989',
    social: {
      tiktok: sf.tenant?.tiktok,
      instagram: sf.tenant?.instagram,
      facebook: sf.tenant?.facebook,
    },
    map: {
      url: sf.tenant?.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
    },
  };

  return (
    <>
      <nav
        data-testid="bottom-nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 grid grid-cols-5 items-center w-full font-sans select-none shadow-[0_-2px_12px_rgba(0,0,0,0.12)]"
        style={{
          backgroundColor: bgStyle,
          borderTop: `1px solid ${borderStyle}`,
        }}
        aria-label="شريط تنقل تطبيق الجوال"
      >
        {/* 1. الرئيسية */}
        {isHomeRoute ? (
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isHomeActive ? activeColor : inactiveColor }}
          >
            {isHomeActive && (
              <span
                className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isHomeActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className={`text-[11px] whitespace-nowrap leading-tight ${isHomeActive ? 'font-bold' : 'font-medium'}`}>
              الرئيسية
            </span>
          </button>
        ) : (
          <Link
            href="/"
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isHomeActive ? activeColor : inactiveColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[11px] whitespace-nowrap leading-tight font-medium">
              الرئيسية
            </span>
          </Link>
        )}

        {/* 2. المنتجات */}
        {isHomeRoute ? (
          <button
            type="button"
            onClick={() => handleTabClick('catalog')}
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isCatalogActive ? activeColor : inactiveColor }}
          >
            {isCatalogActive && (
              <span
                className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCatalogActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className={`text-[11px] whitespace-nowrap leading-tight ${isCatalogActive ? 'font-bold' : 'font-medium'}`}>
              المنتجات
            </span>
          </button>
        ) : (
          <Link
            href="/?tab=catalog"
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isCatalogActive ? activeColor : inactiveColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-[11px] whitespace-nowrap leading-tight font-medium">
              المنتجات
            </span>
          </Link>
        )}

        {/* 3. الأصالة */}
        {isHomeRoute ? (
          <button
            type="button"
            onClick={() => handleTabClick('authenticity')}
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isAuthActive ? activeColor : inactiveColor }}
          >
            {isAuthActive && (
              <span
                className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isAuthActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className={`text-[11px] whitespace-nowrap leading-tight ${isAuthActive ? 'font-bold' : 'font-medium'}`}>
              الأصالة
            </span>
          </button>
        ) : (
          <Link
            href="/authenticity-hub"
            className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
            style={{ color: isAuthActive ? activeColor : inactiveColor }}
          >
            {isAuthActive && (
              <span
                className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
                style={{ backgroundColor: activeColor }}
              />
            )}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isAuthActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className={`text-[11px] whitespace-nowrap leading-tight ${isAuthActive ? 'font-bold' : 'font-medium'}`}>
              الأصالة
            </span>
          </Link>
        )}

        {/* 4. السلة */}
        <button
          type="button"
          onClick={() => cart.open()}
          className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
          style={{ color: isCartActive ? activeColor : inactiveColor }}
        >
          {isCartActive && (
            <span
              className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
              style={{ backgroundColor: activeColor }}
            />
          )}
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isCartActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cart.count > 0 && (
              <span
                className="absolute -top-1.5 -end-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center font-sans shadow-md"
                style={{
                  backgroundColor: isLight ? activeColor : '#C9A84C',
                  color: isLight ? '#FFFFFF' : '#070709',
                }}
              >
                {cart.count}
              </span>
            )}
          </div>
          <span className={`text-[11px] whitespace-nowrap leading-tight ${isCartActive ? 'font-bold' : 'font-medium'}`}>
            السلة
          </span>
        </button>

        {/* 5. المزيد */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 transition-colors"
          style={{ color: isMoreActive ? activeColor : inactiveColor }}
        >
          {isMoreActive && (
            <span
              className="absolute top-0 inset-x-2 h-[2.5px] rounded-full shadow-sm"
              style={{ backgroundColor: activeColor }}
            />
          )}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isMoreActive ? '2' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
          <span className={`text-[11px] whitespace-nowrap leading-tight ${isMoreActive ? 'font-bold' : 'font-medium'}`}>
            المزيد
          </span>
        </button>
      </nav>

      {/* Unified Mobile More Drawer */}
      <LuxuryMoreDrawer
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        currentCurrency={sf.currency}
        onCurrencyChange={sf.setCurrency}
        contact={contact}
        navLinks={navLinks}
      />
    </>
  );
}

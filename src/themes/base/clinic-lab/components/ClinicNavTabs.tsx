'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

const TABS = [
  { id: 'tab-store', labelAr: 'المتجر', labelEn: 'Store', href: '#products' },
  { id: 'tab-routine', labelAr: 'روتيني', labelEn: 'Routine', href: '#routine' },
  { id: 'tab-auth', labelAr: 'فحص الأصالة', labelEn: 'Authenticity Hub', href: '/authenticity-hub' },
  { id: 'tab-account', labelAr: 'الملف الطبي وحسابي', labelEn: 'Medical Profile', href: '/account' },
  { id: 'tab-bookings', labelAr: 'حجز استشارة', labelEn: 'Bookings', href: '/bookings' },
  { id: 'tab-blog', labelAr: 'المجلة السريرية', labelEn: 'Clinical Journal', href: '/blog' },
  { id: 'tab-contact', labelAr: 'تواصل', labelEn: 'Contact', href: '#contact' },
];

export function ClinicNavTabs() {
  const { locale } = useStorefront();
  const isEn = locale === 'en';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav
      aria-label="أقسام المتجر السريري"
      className="w-full bg-[#F2F7F5] border-b border-[#E2ECE9] px-3 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            onClick={(e) => handleClick(e, tab.href)}
            className="min-h-[40px] px-3.5 rounded-lg inline-flex items-center justify-center text-xs sm:text-sm font-semibold text-[#0F4C4A] hover:bg-[#CFE8E1]/60 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors whitespace-nowrap"
          >
            {isEn ? tab.labelEn : tab.labelAr}
          </a>
        ))}
      </div>
    </nav>
  );
}

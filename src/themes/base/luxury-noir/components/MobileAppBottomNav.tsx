'use client';

import React from 'react';
import Link from 'next/link';
import {
  BagCartIcon,
  ShieldCheckIcon,
  MapPinIcon,
} from './LuxuryIcons';

interface MobileAppBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
}

export function MobileAppBottomNav({
  cartCount,
  onOpenCart,
}: MobileAppBottomNavProps) {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#070709]/95 backdrop-blur-xl border-t border-[#C9A84C]/25 flex items-center justify-around px-1 font-sans shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      aria-label="شريط تنقل تطبيق الجوال"
    >
      {/* 1. الرئيسية */}
      <Link
        href="/"
        className="flex flex-col items-center justify-center flex-1 py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-[10px] mt-1 font-medium">الرئيسية</span>
      </Link>

      {/* 2. المنتجات */}
      <button
        type="button"
        onClick={() => scrollToSection('#products-catalog')}
        className="flex flex-col items-center justify-center flex-1 py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span className="text-[10px] mt-1 font-medium">المنتجات</span>
      </button>

      {/* 3. فحص المقلد (زر أوسط بارز ومرتفع) */}
      <div className="flex-1 flex justify-center -mt-6">
        <button
          type="button"
          onClick={() => scrollToSection('#authenticity-lab')}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#BF953F] via-[#FCF6BA] to-[#B38728] p-0.5 shadow-[0_0_20px_rgba(201,168,76,0.5)] hover:scale-105 active:scale-95 transition-transform"
          title="فاحص كشف المقلد"
        >
          <div className="w-full h-full rounded-full bg-[#070709] flex flex-col items-center justify-center text-champagne">
            <ShieldCheckIcon size={20} color="#C9A84C" />
            <span className="text-[8px] font-bold text-gold mt-0.5">فحص المقلد</span>
          </div>
        </button>
      </div>

      {/* 4. السلة */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center flex-1 py-1 text-ivory/70 hover:text-champagne transition-colors relative"
      >
        <div className="relative">
          <BagCartIcon size={20} color="currentColor" strokeWidth={1.3} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-gold text-obsidian text-[10px] font-bold flex items-center justify-center font-sans shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1 font-medium">السلة</span>
      </button>

      {/* 5. موقعنا وتواصل */}
      <button
        type="button"
        onClick={() => scrollToSection('#store-location')}
        className="flex flex-col items-center justify-center flex-1 py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        <MapPinIcon size={20} color="currentColor" strokeWidth={1.3} />
        <span className="text-[10px] mt-1 font-medium">موقعنا</span>
      </button>
    </nav>
  );
}

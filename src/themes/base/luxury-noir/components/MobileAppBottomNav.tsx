'use client';

import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'authenticity' | 'cart' | 'location'>('home');

  const scrollToSection = (id: string, tab: typeof activeTab) => {
    setActiveTab(tab);
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#070709]/98 backdrop-blur-2xl border-t border-white/[0.08] grid grid-cols-5 items-center w-full px-1 font-sans shadow-[0_-10px_30px_rgba(0,0,0,0.9)]"
      aria-label="شريط تنقل تطبيق الجوال"
    >
      {/* 1. الرئيسية */}
      <Link
        href="/"
        onClick={() => setActiveTab('home')}
        className="w-full h-full flex flex-col items-center justify-center gap-1 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'home' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FCF6BA] to-transparent shadow-[0_0_12px_#C9A84C]" />
        )}
        <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-[radial-gradient(circle,rgba(201,168,76,0.25)_0%,transparent_70%)]' : ''}`}>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke={activeTab === 'home' ? '#FCF6BA' : 'currentColor'}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className={`text-[10px] whitespace-nowrap leading-none ${activeTab === 'home' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'}`}>
          الرئيسية
        </span>
      </Link>

      {/* 2. المنتجات */}
      <button
        type="button"
        onClick={() => scrollToSection('#products-catalog', 'products')}
        className="w-full h-full flex flex-col items-center justify-center gap-1 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'products' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FCF6BA] to-transparent shadow-[0_0_12px_#C9A84C]" />
        )}
        <div className={`p-1 rounded-full ${activeTab === 'products' ? 'bg-[radial-gradient(circle,rgba(201,168,76,0.25)_0%,transparent_70%)]' : ''}`}>
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke={activeTab === 'products' ? '#FCF6BA' : 'currentColor'}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <span className={`text-[10px] whitespace-nowrap leading-none ${activeTab === 'products' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'}`}>
          المنتجات
        </span>
      </button>

      {/* 3. كشف المقلد */}
      <button
        type="button"
        onClick={() => scrollToSection('#authenticity-lab', 'authenticity')}
        className="w-full h-full flex flex-col items-center justify-center gap-1 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'authenticity' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FCF6BA] to-transparent shadow-[0_0_12px_#C9A84C]" />
        )}
        <div className="p-1 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.28)_0%,transparent_70%)]">
          <ShieldCheckIcon
            size={20}
            color={activeTab === 'authenticity' ? '#FCF6BA' : '#C9A84C'}
            strokeWidth={1.4}
          />
        </div>
        <span className={`text-[10px] whitespace-nowrap leading-none ${activeTab === 'authenticity' ? 'text-[#FCF6BA] font-bold' : 'text-champagne font-medium'}`}>
          كشف المقلد
        </span>
      </button>

      {/* 4. السلة */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('cart');
          onOpenCart();
        }}
        className="w-full h-full flex flex-col items-center justify-center gap-1 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'cart' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FCF6BA] to-transparent shadow-[0_0_12px_#C9A84C]" />
        )}
        <div className="relative p-1">
          <BagCartIcon
            size={19}
            color={activeTab === 'cart' ? '#FCF6BA' : 'currentColor'}
            strokeWidth={1.4}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1 -end-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian text-[9px] font-bold flex items-center justify-center font-sans shadow-md animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] whitespace-nowrap leading-none ${activeTab === 'cart' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'}`}>
          السلة
        </span>
      </button>

      {/* 5. موقعنا */}
      <button
        type="button"
        onClick={() => scrollToSection('#store-location', 'location')}
        className="w-full h-full flex flex-col items-center justify-center gap-1 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'location' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#FCF6BA] to-transparent shadow-[0_0_12px_#C9A84C]" />
        )}
        <div className={`p-1 rounded-full ${activeTab === 'location' ? 'bg-[radial-gradient(circle,rgba(201,168,76,0.25)_0%,transparent_70%)]' : ''}`}>
          <MapPinIcon
            size={19}
            color={activeTab === 'location' ? '#FCF6BA' : 'currentColor'}
            strokeWidth={1.4}
          />
        </div>
        <span className={`text-[10px] whitespace-nowrap leading-none ${activeTab === 'location' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'}`}>
          موقعنا
        </span>
      </button>
    </nav>
  );
}

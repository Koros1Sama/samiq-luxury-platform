'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BagCartIcon,
  ShieldCheckIcon,
} from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

interface MobileAppBottomNavProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenMore?: () => void;
}

export function MobileAppBottomNav(props: MobileAppBottomNavProps) {
  const sf = useStorefront();
  const cartCount = props.cartCount !== undefined ? props.cartCount : sf.cart.count;
  const onOpenCart = props.onOpenCart || sf.cart.open;
  const onOpenMore = props.onOpenMore;

  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'authenticity' | 'cart' | 'more'>('home');

  const scrollToSection = (id: string, tab: typeof activeTab) => {
    setActiveTab(tab);
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      data-testid="bottom-nav"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-[#0A0A0D] border-t border-white/[0.08] grid grid-cols-5 items-center w-full font-sans"
      aria-label="شريط تنقل تطبيق الجوال"
    >
      {/* 1. الرئيسية */}
      <Link
        href="/"
        onClick={() => setActiveTab('home')}
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'home' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_#C9A84C]" />
        )}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={activeTab === 'home' ? '#FCF6BA' : '#9A968E'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span
          className={`text-xs whitespace-nowrap leading-tight ${
            activeTab === 'home' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'
          }`}
        >
          الرئيسية
        </span>
      </Link>

      {/* 2. المنتجات */}
      <button
        type="button"
        onClick={() => scrollToSection('#products-catalog', 'products')}
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'products' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_#C9A84C]" />
        )}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={activeTab === 'products' ? '#FCF6BA' : '#9A968E'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span
          className={`text-xs whitespace-nowrap leading-tight ${
            activeTab === 'products' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'
          }`}
        >
          المنتجات
        </span>
      </button>

      {/* 3. كشف المقلد */}
      <button
        type="button"
        onClick={() => scrollToSection('#authenticity-lab', 'authenticity')}
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'authenticity' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_#C9A84C]" />
        )}
        <ShieldCheckIcon
          size={20}
          color={activeTab === 'authenticity' ? '#FCF6BA' : '#9A968E'}
          strokeWidth={1.5}
        />
        <span
          className={`text-xs whitespace-nowrap leading-tight ${
            activeTab === 'authenticity' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'
          }`}
        >
          الأصالة
        </span>
      </button>

      {/* 4. السلة */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('cart');
          onOpenCart();
        }}
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'cart' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_#C9A84C]" />
        )}
        <div className="relative">
          <BagCartIcon
            size={20}
            color={activeTab === 'cart' ? '#FCF6BA' : '#9A968E'}
            strokeWidth={1.5}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -end-2 w-4 h-4 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark text-xs font-bold flex items-center justify-center font-sans shadow-md animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
        <span
          className={`text-xs whitespace-nowrap leading-tight ${
            activeTab === 'cart' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'
          }`}
        >
          السلة
        </span>
      </button>

      {/* 5. المزيد */}
      <button
        type="button"
        onClick={() => {
          setActiveTab('more');
          if (onOpenMore) {
            onOpenMore();
          } else {
            const menuBtn = document.querySelector('[data-testid="menu-button"]') as HTMLButtonElement | null;
            if (menuBtn) menuBtn.click();
          }
        }}
        className="w-full h-full flex flex-col items-center justify-center gap-0.5 min-w-0 relative py-1 text-ivory/70 hover:text-champagne transition-colors"
      >
        {activeTab === 'more' && (
          <span className="absolute top-0 inset-x-2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent shadow-[0_0_8px_#C9A84C]" />
        )}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={activeTab === 'more' ? '#FCF6BA' : '#9A968E'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
        <span
          className={`text-xs whitespace-nowrap leading-tight ${
            activeTab === 'more' ? 'text-[#FCF6BA] font-bold' : 'text-muted-lux font-medium'
          }`}
        >
          المزيد
        </span>
      </button>
    </nav>
  );
}

'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { BagIcon, ArrowIcon } from './IvoryIcons';

export function IvoryCartPill() {
  const { cart, formatPrice } = useStorefront();

  if (cart.count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 start-0 end-0 z-40 flex justify-center px-4 pointer-events-none">
      <button
        type="button"
        aria-label="عرض حقيبة المشتريات التحريرية"
        onClick={() => cart.open()}
        className="pointer-events-auto w-full max-w-sm min-h-[44px] h-[46px] px-5 rounded-full bg-[#1B1612] text-[#FAF7F2] border border-[#B89B5E]/40 shadow-2xl flex items-center justify-between hover:bg-[#332E27] active:scale-[0.98] transition-all animate-bounce-subtle"
      >
        {/* Start side: Bag icon + Count */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <BagIcon size={18} color="#FAF7F2" />
            <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-[#B89B5E]" />
          </div>
          <span className="font-serif font-bold text-sm text-[#FAF7F2]">
            الحقيبة: {cart.count} {cart.count === 1 ? 'مستحضر' : 'مستحضرات'}
          </span>
        </div>

        {/* End side: Total + Arrow */}
        <div className="flex items-center gap-3">
          <span className="font-sans font-bold text-xs sm:text-sm text-[#E6CFA0]">
            {formatPrice(cart.total)}
          </span>
          <span className="rtl:-scale-x-100 text-xs">
            <ArrowIcon size={16} color="#FAF7F2" />
          </span>
        </div>
      </button>
    </div>
  );
}

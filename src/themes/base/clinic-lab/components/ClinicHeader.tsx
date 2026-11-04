'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ThemeCurrencyCode } from '@/themes/contract';
import {
  FlaskIcon,
  SearchIcon,
  BagIcon,
  StethoscopeIcon,
  CloseIcon,
} from './ClinicIcons';

interface ClinicHeaderProps {
  onOpenAdvisor: () => void;
  onOpenCart: () => void;
}

export function ClinicHeader({ onOpenAdvisor, onOpenCart }: ClinicHeaderProps) {
  const { tenant, cart, currency, setCurrency, search } = useStorefront();

  const handleCurrencyChange = (newCurr: ThemeCurrencyCode) => {
    setCurrency(newCurr);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-[#E2ECE9] shadow-[0_1px_3px_rgba(15,76,74,0.05)]">
      {/* Row 1: Brand & Actions (Height ~56px) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 min-h-[44px] min-w-[44px] text-[#0F4C4A] focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] rounded-lg"
          aria-label={tenant.name || 'مفتاح الجمال'}
        >
          <div className="w-9 h-9 rounded-lg bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center shrink-0 border border-[#0F4C4A]/20">
            <FlaskIcon size={20} />
          </div>
          <div className="flex flex-col text-start">
            <span className="font-bold text-sm sm:text-base leading-tight tracking-normal text-[#0F4C4A]">
              {tenant.name || 'مفتاح الجمال'}
            </span>
            <span className="text-xs text-[#0F4C4A]/70 font-medium">
              معمل سريري معتمد
            </span>
          </div>
        </a>

        {/* End Actions: Advisor, Account, Currency, Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* AI Clinical Advisor Button */}
          <button
            type="button"
            data-testid="advisor-btn"
            onClick={onOpenAdvisor}
            className="min-w-[44px] min-h-[44px] px-2.5 py-1.5 rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/50 inline-flex items-center gap-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title="استشارة مخبرية ذكية"
            aria-label="استشارة مخبرية ذكية"
          >
            <StethoscopeIcon size={18} />
            <span className="hidden sm:inline">استشارة</span>
          </button>

          {/* Account & Medical Profile Link */}
          <a
            href="/account"
            className="min-w-[44px] min-h-[44px] px-2.5 py-1.5 rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/50 inline-flex items-center justify-center gap-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title="حسابي والملف الطبي"
            aria-label="حسابي والملف الطبي"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">الملف الطبي</span>
          </a>

          {/* Currency Switcher */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="اختيار العملة"
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as ThemeCurrencyCode)}
              className="min-h-[44px] min-w-[44px] px-2 py-1.5 bg-[#F2F7F5] border border-[#D4E5E0] rounded-lg text-xs font-bold text-[#0F4C4A] focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] cursor-pointer"
            >
              <option value="YER">YER</option>
              <option value="SAR">SAR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            data-testid="cart-btn"
            onClick={() => (onOpenCart ? onOpenCart() : cart.open())}
            className="relative min-w-[44px] min-h-[44px] rounded-lg bg-[#0F4C4A] text-white hover:bg-[#0B3A38] inline-flex items-center justify-center p-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title="سلة المشتريات"
            aria-label={`سلة المشتريات: ${cart.count} منتجات`}
          >
            <BagIcon size={20} />
            {cart.count > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[20px] h-[20px] px-1 bg-[#D9534F] text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Always-Visible Clinical Search Bar (Height ~48px) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-2 pt-0.5">
        <div className="relative flex items-center w-full">
          <div className="absolute start-3 pointer-events-none text-[#0F4C4A]/60 flex items-center justify-center">
            <SearchIcon size={18} />
          </div>
          <input
            type="search"
            data-testid="search-input"
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            placeholder="ابحث بالاسم، التركيبة، أو المادة الفعالة..."
            className="w-full h-10 ps-10 pe-10 bg-[#F2F7F5] border border-[#D4E5E0] rounded-lg text-sm text-[#0F4C4A] placeholder:text-[#64748B] focus:bg-white focus:border-[#0F4C4A] focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A] transition-all"
            aria-label="البحث عن منتج أو مادة طبية"
          />
          {search.query && (
            <button
              type="button"
              onClick={() => search.setQuery('')}
              className="absolute end-1 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#64748B] hover:text-[#0F4C4A]"
              aria-label="مسح البحث"
            >
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

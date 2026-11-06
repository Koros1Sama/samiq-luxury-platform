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
  const { tenant, cart, search, features, locale, setLocale } = useStorefront();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isEn = locale === 'en';

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
              {isEn ? 'Clinical Care & Authenticity Lab' : 'لكشف المقلد والعناية السريرية'}
            </span>
          </div>
        </a>

        {/* End Actions: Language, Advisor, Account, Currency, Cart */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bilingual AR | EN Toggle (Gated by second_language feature) */}
          {features?.second_language !== false && (
            <button
              type="button"
              onClick={() => setLocale?.(isEn ? 'ar' : 'en')}
              className="min-h-[38px] px-2 rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] text-xs font-mono font-bold transition flex items-center gap-1"
              title={isEn ? 'التبديل إلى العربية' : 'Switch to English'}
              aria-label="تبديل اللغة"
            >
              <span className={!isEn ? 'font-bold' : 'opacity-50'}>AR</span>
              <span className="opacity-30">|</span>
              <span className={isEn ? 'font-bold' : 'opacity-50'}>EN</span>
            </button>
          )}

          {/* AI Clinical Advisor Button (hidden on narrow screens, available in mobile menu) */}
          <button
            type="button"
            data-testid="advisor-btn"
            onClick={onOpenAdvisor}
            className="hidden sm:inline-flex min-w-[44px] min-h-[44px] px-2.5 py-1.5 rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/50 items-center gap-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title={isEn ? 'Smart Consultation' : 'استشارة مخبرية ذكية'}
            aria-label={isEn ? 'Smart Consultation' : 'استشارة مخبرية ذكية'}
          >
            <StethoscopeIcon size={18} />
            <span className="hidden md:inline">{isEn ? 'Consult' : 'استشارة'}</span>
          </button>

          {/* Account & Medical Profile Link (hidden on narrow screens, available in mobile menu) */}
          <a
            href="/account"
            className="hidden sm:inline-flex min-w-[44px] min-h-[44px] px-2.5 py-1.5 rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/50 items-center justify-center gap-1.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title={isEn ? 'My Profile' : 'حسابي والملف الطبي'}
            aria-label={isEn ? 'My Profile' : 'حسابي والملف الطبي'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:inline">{isEn ? 'Profile' : 'الملف الطبي'}</span>
          </a>

          {/* Cart Drawer Trigger (Hidden on mobile < md where bottom MobileAppTabBar already provides the cart) */}
          <button
            type="button"
            data-testid="cart-btn"
            onClick={() => (onOpenCart ? onOpenCart() : cart.open())}
            className="relative min-w-[40px] min-h-[40px] rounded-lg bg-[#0F4C4A] text-white hover:bg-[#0B3A38] hidden md:inline-flex items-center justify-center p-2 focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] transition-colors"
            title="سلة المشتريات"
            aria-label={`سلة المشتريات: ${cart.count} منتجات`}
          >
            <BagIcon size={18} />
            {cart.count > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 bg-[#D9534F] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cart.count}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger (Visible on small screens) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden min-w-[40px] min-h-[40px] rounded-lg border border-[#D4E5E0] bg-[#F2F7F5] text-[#0F4C4A] flex items-center justify-center transition"
            aria-label="القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E2ECE9] bg-white px-4 py-3 space-y-2 animate-fadeIn shadow-lg">
          <div className="flex flex-col space-y-1 text-xs font-semibold text-[#0F4C4A]">
            <a
              href="/authenticity-hub"
              className="min-h-[42px] px-3 rounded-lg hover:bg-[#F2F7F5] flex items-center justify-between"
            >
              <span>{isEn ? 'Authenticity Hub' : 'فحص الأصالة والمطابقة'}</span>
              <span className="text-[#0F4C4A]/40 font-mono">↗</span>
            </a>
            <a
              href="/bookings"
              className="min-h-[42px] px-3 rounded-lg hover:bg-[#F2F7F5] flex items-center justify-between"
            >
              <span>{isEn ? 'Book Clinical Consultation' : 'حجز استشارة سريرية'}</span>
              <span className="text-[#0F4C4A]/40 font-mono">↗</span>
            </a>
            <a
              href="/blog"
              className="min-h-[42px] px-3 rounded-lg hover:bg-[#F2F7F5] flex items-center justify-between"
            >
              <span>{isEn ? 'Scientific Journal' : 'المجلة السريرية'}</span>
              <span className="text-[#0F4C4A]/40 font-mono">↗</span>
            </a>
            <a
              href="/account"
              className="min-h-[42px] px-3 rounded-lg hover:bg-[#F2F7F5] flex items-center justify-between"
            >
              <span>{isEn ? 'My Medical Profile & Club' : 'الملف الطبي وحسابي'}</span>
              <span className="text-[#0F4C4A]/40 font-mono">↗</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisor();
              }}
              className="min-h-[42px] px-3 rounded-lg bg-[#CFE8E1]/40 text-[#0F4C4A] flex items-center justify-between font-bold"
            >
              <span>{isEn ? 'AI Clinical Advisor' : 'المستشار السريري الذكي'}</span>
              <StethoscopeIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Row 2: Always-Visible Clinical Search Bar (Shown when catalog tier 3 is active) */}
      {features.tier_3_catalog && (
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
      )}
    </header>
  );
}

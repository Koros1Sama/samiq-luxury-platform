'use client';

import React, { useState } from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ThemeCurrencyCode } from '@/themes/contract';
import {
  MenuIcon,
  CloseIcon,
  BagIcon,
  SearchIcon,
  AdvisorStarIcon,
  ArrowIcon,
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  VerifiedStampIcon,
} from './IvoryIcons';

interface IvoryHeaderProps {
  onOpenSearch?: () => void;
  onOpenAdvisor?: () => void;
}

export function IvoryHeader({ onOpenSearch, onOpenAdvisor }: IvoryHeaderProps) {
  const { tenant, cart, currency, setCurrency, features } = useStorefront();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (hash: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currencies: { code: ThemeCurrencyCode; label: string }[] = [
    { code: 'YER', label: 'ر.ي' },
    { code: 'SAR', label: 'ر.س' },
    { code: 'USD', label: '$' },
  ];

  return (
    <>
      <header
        data-testid="header"
        className="sticky top-0 start-0 w-full h-[52px] bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D8] z-40 flex items-center justify-between px-3 sm:px-6 transition-colors"
      >
        {/* Start Side: Menu Trigger (Mobile) / Nav Links (Desktop) */}
        <div className="flex items-center gap-1 sm:gap-4 flex-1">
          <button
            type="button"
            data-testid="menu-button"
            aria-label="القائمة التحريرية"
            onClick={() => setIsMenuOpen(true)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-sm"
          >
            <MenuIcon size={22} color="#1B1612" />
          </button>

          {/* Desktop Left Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-sans font-medium text-[#554D46]">
            {features.tier_3_catalog && (
              <>
                <button
                  type="button"
                  onClick={() => scrollTo('#mosaic')}
                  className="hover:text-[#1B1612] transition-colors min-h-[44px] px-2 flex items-center"
                >
                  اختيارات الأسبوع
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('#categories')}
                  className="hover:text-[#1B1612] transition-colors min-h-[44px] px-2 flex items-center"
                >
                  فهرس الأقسام
                </button>
              </>
            )}
            {features.tier_3_catalog && features.authenticity_guide && (
              <button
                type="button"
                onClick={() => scrollTo('#authenticity')}
                className="hover:text-[#1B1612] transition-colors min-h-[44px] px-2 flex items-center"
              >
                فحص الأصالة
              </button>
            )}
          </nav>
        </div>

        {/* Center: Magazine Wordmark (min 44px hit area) */}
        <div className="flex flex-col items-center justify-center text-center px-1">
          <a
            href="/"
            className="min-h-[44px] inline-flex flex-col items-center justify-center px-2 py-1 font-serif font-bold text-xl sm:text-2xl text-[#1B1612] hover:text-[#5E6B5A] transition-colors leading-none"
          >
            <span>{tenant.name}</span>
            <span className="hidden sm:block text-xs font-sans text-[#5E6B5A] mt-0.5 leading-none">
              لكشف المقلد ومجلة العناية الفاخرة
            </span>
          </a>
        </div>

        {/* End Side: Actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1">
          {/* Desktop Currency Switcher */}
          <div className="hidden lg:flex items-center border border-[#E8E2D8] rounded-full p-0.5 bg-[#F4EFE6]/70">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`min-w-[40px] min-h-[40px] px-3 rounded-full text-xs font-sans font-semibold transition-all ${
                  currency === c.code
                    ? 'bg-[#1B1612] text-[#FAF7F2] shadow-sm'
                    : 'text-[#554D46] hover:text-[#1B1612]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Trigger (Shown when catalog tier 3 is active) */}
          {features.tier_3_catalog && (
            <button
              type="button"
              data-testid="search-button"
              aria-label="البحث في المجلة"
              onClick={onOpenSearch}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-sm"
            >
              <SearchIcon size={20} color="#1B1612" />
            </button>
          )}

          {/* Advisor Chat Trigger */}
          <button
            type="button"
            aria-label="استشارة خبيرة الجمال"
            onClick={onOpenAdvisor}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#5E6B5A] hover:text-[#1B1612] transition-colors rounded-sm"
          >
            <AdvisorStarIcon size={20} color="#5E6B5A" />
          </button>

          {/* Account Portal Link */}
          <a
            href="/account"
            aria-label="حسابي ونقاط الولاء"
            title="حسابي ونقاط الولاء"
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </a>

          {/* Bag Trigger */}
          <button
            type="button"
            data-testid="cart-button"
            aria-label="حقيبة المشتريات"
            onClick={() => cart.open()}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors relative rounded-sm"
          >
            <BagIcon size={21} color="#1B1612" />
            {cart.count > 0 && (
              <span className="absolute top-1.5 end-1.5 w-4 h-4 rounded-full bg-[#1B1612] text-[#FAF7F2] text-xs font-sans font-bold flex items-center justify-center shadow-sm">
                {cart.count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Full-Screen Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col justify-between overflow-y-auto animate-fade-in p-6 sm:p-12">
          {/* Top Bar inside Menu */}
          <div className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#E8E2D8]">
            <span className="font-serif font-bold text-2xl text-[#1B1612]">
              {tenant.name}
            </span>
            <button
              type="button"
              aria-label="إغلاق القائمة"
              onClick={() => setIsMenuOpen(false)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#1B1612]/20 rounded-full text-[#1B1612] hover:bg-[#1B1612] hover:text-[#FAF7F2] transition-colors"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Main Editorial Nav Rows */}
          <div className="w-full max-w-4xl mx-auto py-8 sm:py-12 space-y-2">
            <button
              type="button"
              onClick={() => scrollTo('#mosaic')}
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>اختيارات الأسبوع</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo('#categories')}
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>فهرس الأقسام والمنتجات</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo('#authenticity')}
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>فحص رقم التشغيلة وضمان الأصالة</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (onOpenAdvisor) onOpenAdvisor();
              }}
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>استشارة خبيرة الجمال التحريرية</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo('#colophon')}
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>بيانات الإصدار والتواصل</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </button>

            <a
              href="/account"
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>حسابي ونادي الولاء</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </a>

            <a
              href="/authenticity-hub"
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>مختبر كشف المقلد التفاعلي</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </a>

            <a
              href="/bookings"
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>حجز استشارة خاصة</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </a>

            <a
              href="/blog"
              className="w-full py-4 text-start font-serif font-bold text-2xl sm:text-4xl text-[#1B1612] hover:text-[#5E6B5A] border-b border-[#E8E2D8]/60 flex items-center justify-between group transition-colors min-h-[56px]"
            >
              <span>المجلة التحريرية</span>
              <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-2">
                <ArrowIcon size={24} color="#5E6B5A" />
              </span>
            </a>

            <div className="pt-4 flex items-center gap-3">
              <a
                href="/admin"
                className="min-h-[44px] px-4 py-2 rounded-sm bg-[#1B1612] text-[#FAF7F2] text-xs font-sans font-semibold inline-flex items-center"
              >
                لوحة إدارة المتجر (Admin)
              </a>
              <a
                href="/platform"
                className="min-h-[44px] px-4 py-2 rounded-sm bg-[#FAF7F2] border border-[#1B1612]/30 text-[#1B1612] text-xs font-sans font-semibold inline-flex items-center"
              >
                لوحة منصة سامق (Platform)
              </a>
            </div>
          </div>

          {/* Bottom Bar: Currency & Social Channels */}
          <div className="w-full max-w-4xl mx-auto pt-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Currency Choice */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-sans text-[#554D46]">العملة المعروضة:</span>
              <div className="flex items-center gap-1.5 border border-[#E8E2D8] rounded-full p-1 bg-[#F4EFE6]">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code)}
                    className={`min-w-[40px] min-h-[40px] px-3 rounded-full text-xs font-sans font-bold transition-all ${
                      currency === c.code
                        ? 'bg-[#1B1612] text-[#FAF7F2] shadow-sm'
                        : 'text-[#554D46] hover:text-[#1B1612]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-2">
              {tenant.whatsapp && (
                <a
                  href={`https://wa.me/${tenant.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="واتساب"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                >
                  <WhatsAppIcon size={18} />
                </a>
              )}
              {tenant.instagram && (
                <a
                  href={tenant.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="انستغرام"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
              {tenant.tiktok && (
                <a
                  href={tenant.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                >
                  <TikTokIcon size={18} />
                </a>
              )}
              {tenant.facebook && (
                <a
                  href={tenant.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="فيسبوك"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MiftahLogoSvg } from './MiftahLogoSvg';
import { CurrencySwitcher } from './CurrencySwitcher';
import { SearchModal } from './SearchModal';
import { ThemeCurrencyCode, FeatureFlags } from '../../../contract';

interface LuxuryHeaderProps {
  currentCurrency: ThemeCurrencyCode;
  onCurrencyChange: (currency: ThemeCurrencyCode) => void;
  features: FeatureFlags;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch?: () => void;
}

export function LuxuryHeader({
  currentCurrency,
  onCurrencyChange,
  features,
  cartCount,
  onOpenCart,
  onOpenSearch,
}: LuxuryHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('الرئيسية');

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'العناية بالبشرة', href: '/#skin-routine' },
    { label: 'المكياج', href: '/#featured-products' },
    { label: 'موسوعة الأصلي', href: '/authenticity-hub' },
    { label: 'حجز استشارة', href: '/bookings' },
    { label: 'المجلة الجمالية', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Right / Start (In Arabic RTL): Brand Logo */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center group">
            <MiftahLogoSvg size={50} />
          </a>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeNav === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`relative py-1 text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? 'text-champagne font-bold'
                    : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-10px] inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent rounded-full shadow-[0_0_8px_#C9A84C]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Left / End: Actions (Currency, Search, Account, Cart, Mobile Toggle) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Currency Switcher */}
          <CurrencySwitcher
            currentCurrency={currentCurrency}
            onCurrencyChange={onCurrencyChange}
          />

          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSearch) onOpenSearch();
              else setSearchModalOpen(true);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
            aria-label="بحث"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>

          {/* Customer Hub (if feature enabled) */}
          {features.customer_accounts && (
            <Link
              href="/account"
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
              aria-label="حسابي"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>
          )}

          {/* Cart Trigger (if cart_whatsapp enabled) */}
          {features.cart_whatsapp && (
            <button
              type="button"
              onClick={onOpenCart}
              className="relative w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-ivory hover:text-champagne transition shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              aria-label="سلة المشتريات"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-[11px] flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
            aria-label="القائمة"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface/98 border-b border-gold/20 px-6 py-5 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setActiveNav(link.label);
                setMobileMenuOpen(false);
              }}
              className="block py-2.5 text-base font-sans text-ivory/80 hover:text-champagne border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          {features.customer_accounts && (
            <a
              href="#"
              className="block py-2.5 text-base font-sans text-gold border-b border-white/5"
            >
              حسابي وسجل الطلبات
            </a>
          )}
        </div>
      )}

      {/* Global Instant Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        currentCurrency={currentCurrency}
      />
    </header>
  );
}

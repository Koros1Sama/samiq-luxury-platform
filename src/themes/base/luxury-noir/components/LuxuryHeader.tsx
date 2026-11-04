'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MiftahLogoSvg } from './MiftahLogoSvg';
import { CurrencySwitcher } from './CurrencySwitcher';
import { SearchModal } from './SearchModal';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import {
  MapPinIcon,
  TikTokIcon,
  InstagramIcon,
  WhatsAppIcon,
  FacebookIcon,
  BagCartIcon,
} from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ThemeCurrencyCode, FeatureFlags } from '../../../contract';

interface LuxuryHeaderProps {
  currentCurrency?: ThemeCurrencyCode;
  onCurrencyChange?: (currency: ThemeCurrencyCode) => void;
  features?: FeatureFlags;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
}

export function LuxuryHeader(props: LuxuryHeaderProps) {
  const sf = useStorefront();

  const currentCurrency = props.currentCurrency || sf.currency;
  const onCurrencyChange = props.onCurrencyChange || sf.setCurrency;
  const features = props.features || sf.features;
  const cartCount = props.cartCount !== undefined ? props.cartCount : sf.cart.count;
  const onOpenCart = props.onOpenCart || sf.cart.open;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('الرئيسية');

  const contact = sf.tenant.contact || {
    whatsapp: sf.tenant.whatsapp || '775234989',
    phone: sf.tenant.phone || '775234989',
    social: {
      tiktok: sf.tenant.tiktok,
      instagram: sf.tenant.instagram,
      facebook: sf.tenant.facebook,
    },
    map: {
      url: sf.tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: sf.tenant.city || 'صنعاء',
    },
  };

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المنتجات', href: '/#products-catalog' },
    { label: 'مختبر كشف المقلد', href: '/authenticity-hub' },
    { label: 'المجلة', href: '/blog' },
    { label: 'حجز استشارة', href: '/bookings' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full transition-all shadow-md">
      {/* 1. Top Utility Micro-Bar */}
      <div className="w-full bg-[#050507] border-b border-white/[0.06] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-sans text-muted-lux">
          {/* Start: Official Map Link */}
          <a
            href={contact.map.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-champagne transition-colors"
          >
            <MapPinIcon size={12} color="#C9A84C" />
            <span className="truncate max-w-[160px] sm:max-w-none">
              {contact.map.label}
            </span>
          </a>

          {/* End: Micro Utilities (Currency + PWA) - Note: Fake ThemeSwitcher removed */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CurrencySwitcher
              currentCurrency={currentCurrency}
              onCurrencyChange={onCurrencyChange}
            />
            <PwaInstallPrompt isCompact />
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full bg-obsidian/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-20 flex items-center justify-between">
          {/* Start: Hamburger Menu + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition shrink-0"
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

            {/* Logo Link */}
            <Link href="/" className="flex items-center group min-w-0">
              <MiftahLogoSvg size={38} className="md:hidden" />
              <MiftahLogoSvg size={50} className="hidden md:flex" />
            </Link>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveNav(link.label)}
                  className={`relative py-1 text-xs lg:text-sm font-sans font-medium transition-colors ${
                    isActive ? 'text-champagne font-bold' : 'text-ivory/70 hover:text-ivory'
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

          {/* End: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => {
                if (props.onOpenSearch) props.onOpenSearch();
                else setSearchModalOpen(true);
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
              aria-label="بحث"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            {/* Customer Account */}
            {features.customer_accounts && (
              <Link
                href="/account"
                className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
                aria-label="حسابي"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </Link>
            )}

            {/* Cart Trigger */}
            {features.cart_whatsapp && (
              <button
                type="button"
                onClick={onOpenCart}
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-ivory hover:text-champagne transition shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                aria-label="سلة المشتريات"
              >
                <BagCartIcon size={18} color="currentColor" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Mobile Slide-down Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0E]/98 border-b border-gold/20 px-5 py-5 space-y-4 animate-fadeIn shadow-2xl backdrop-blur-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveNav(link.label);
                  setMobileMenuOpen(false);
                }}
                className="block py-2.5 text-sm font-sans text-ivory/85 hover:text-champagne border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-sm font-sans text-gold border-b border-white/5"
            >
              حسابي وسجل الطلبات
            </Link>
          </div>

          {/* Social Links inside Mobile Drawer */}
          <div className="pt-2">
            <span className="text-[10px] text-muted-lux block mb-2 font-semibold">
              القنوات الرسمية:
            </span>
            <div className="flex items-center gap-2">
              {contact.social.tiktok && (
                <a
                  href={contact.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne"
                  title="تيك توك"
                >
                  <TikTokIcon size={18} color="#C9A84C" />
                </a>
              )}
              {contact.social.instagram && (
                <a
                  href={contact.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne"
                  title="إنستغرام"
                >
                  <InstagramIcon size={18} color="#C9A84C" />
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/${contact.whatsapp.startsWith('967') ? contact.whatsapp : `967${contact.whatsapp}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne"
                  title="واتساب"
                >
                  <WhatsAppIcon size={18} color="#C9A84C" />
                </a>
              )}
              {contact.social.facebook && (
                <a
                  href={contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne"
                  title="فيسبوك"
                >
                  <FacebookIcon size={18} color="#C9A84C" />
                </a>
              )}
              {contact.map.url && (
                <a
                  href={contact.map.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne"
                  title="خرائط جوجل"
                >
                  <MapPinIcon size={18} color="#C9A84C" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        currentCurrency={currentCurrency}
      />
    </header>
  );
}

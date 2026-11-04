'use client';

import React from 'react';
import Link from 'next/link';
import { CurrencySwitcher } from './CurrencySwitcher';
import { PwaInstallPrompt } from './PwaInstallPrompt';
import {
  MapPinIcon,
  TikTokIcon,
  InstagramIcon,
  WhatsAppIcon,
  FacebookIcon,
  CloseIcon,
  PhoneCallIcon,
} from './LuxuryIcons';
import { ThemeCurrencyCode } from '../../../contract';

interface LuxuryMoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: ThemeCurrencyCode;
  onCurrencyChange: (currency: ThemeCurrencyCode) => void;
  contact: {
    phone: string;
    whatsapp: string;
    social: {
      tiktok?: string;
      instagram?: string;
      facebook?: string;
    };
    map: {
      url: string;
      label: string;
    };
  };
  navLinks: Array<{ label: string; href: string }>;
}

export function LuxuryMoreDrawer({
  isOpen,
  onClose,
  currentCurrency,
  onCurrencyChange,
  contact,
  navLinks,
}: LuxuryMoreDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0E0E12] border-t border-gold/30 rounded-t-[2rem] p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto z-10 text-ivory shadow-2xl">
        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <h3 className="text-base font-serif font-bold text-ivory">
              المزيد من الخدمات والخيارات
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux hover:text-ivory"
            aria-label="إغلاق"
          >
            <CloseIcon size={18} color="#9A968E" />
          </button>
        </div>

        {/* 1. Currency Switcher */}
        <div className="space-y-2">
          <span className="text-xs font-sans text-muted-lux block font-medium">
            عملة العرض والتسعير:
          </span>
          <CurrencySwitcher
            currentCurrency={currentCurrency}
            onCurrencyChange={onCurrencyChange}
            className="w-full justify-around py-1.5"
          />
        </div>

        {/* 2. Branches & Location */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <span className="text-xs font-sans text-champagne font-bold block">
            مقر الفرع الرئيسي:
          </span>
          <a
            href={contact.map.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] flex items-center gap-2.5 text-xs font-sans text-ivory/80 hover:text-champagne transition"
          >
            <MapPinIcon size={18} color="#C9A84C" />
            <span>{contact.map.label} — اضغط لفتح الموقع في خرائط Google</span>
          </a>
        </div>

        {/* 3. Official Social Channels */}
        <div className="space-y-2">
          <span className="text-xs font-sans text-muted-lux block font-medium">
            القنوات الرسمية المعتمدة:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {contact.social.tiktok && (
              <a
                href={contact.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne hover:border-gold/40 transition"
                title="تيك توك"
              >
                <TikTokIcon size={20} color="#C9A84C" />
              </a>
            )}
            {contact.social.instagram && (
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne hover:border-gold/40 transition"
                title="إنستغرام"
              >
                <InstagramIcon size={20} color="#C9A84C" />
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.startsWith('967') ? contact.whatsapp : `967${contact.whatsapp}`}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne hover:border-gold/40 transition"
                title="واتساب"
              >
                <WhatsAppIcon size={20} color="#C9A84C" />
              </a>
            )}
            {contact.social.facebook && (
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne hover:border-gold/40 transition"
                title="فيسبوك"
              >
                <FacebookIcon size={20} color="#C9A84C" />
              </a>
            )}
          </div>
        </div>

        {/* 4. PWA Install & Language */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
          <PwaInstallPrompt isCompact={false} />
          <div className="min-h-[40px] px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-sans text-muted-lux flex items-center justify-center">
            اللغة: العربية (الافتراضية)
          </div>
        </div>

        {/* 5. Navigation Links in Drawer */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="min-h-[44px] flex items-center py-2.5 text-xs font-sans text-ivory/80 hover:text-champagne border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/account"
            onClick={onClose}
            className="min-h-[44px] flex items-center justify-between py-2.5 text-xs font-sans text-champagne border-b border-white/5 font-bold hover:text-gold"
          >
            <span>حسابي وتسجيل الدخول ونقاط الولاء</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
              بوابة العملاء
            </span>
          </Link>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/admin"
              onClick={onClose}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/90 hover:text-champagne flex items-center justify-center text-center transition"
            >
              لوحة إدارة المتجر (Admin)
            </Link>
            <Link
              href="/platform"
              onClick={onClose}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/90 hover:text-champagne flex items-center justify-center text-center transition"
            >
              لوحة منصة سامق (Platform)
            </Link>
          </div>
        </div>

        {/* 6. Quick Direct Call Button */}
        <div className="pt-1">
          <a
            href={`tel:${contact.phone}`}
            className="w-full min-h-[44px] py-3 rounded-2xl bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-champagne font-sans font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <PhoneCallIcon size={16} color="#C9A84C" />
            <span>اتصال مباشر: +967 {contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

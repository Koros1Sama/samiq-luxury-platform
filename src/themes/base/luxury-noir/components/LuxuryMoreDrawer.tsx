'use client';

import React from 'react';
import Link from 'next/link';
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
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { resolveThemePalette } from '@/core/storefront/themePalette';

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
  navLinks: Array<{ label?: string; labelAr?: string; labelEn?: string; href: string }>;
}

export function LuxuryMoreDrawer({
  isOpen,
  onClose,
  currentCurrency,
  onCurrencyChange,
  contact,
  navLinks,
}: LuxuryMoreDrawerProps) {
  const sf = useStorefront();
  const activeTheme = sf.activeTheme || 'luxury-noir';
  const palette = sf.palette || resolveThemePalette(activeTheme, sf.customPalette);
  const isLight = palette.isLight;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-lg border-t rounded-t-[2rem] p-5 sm:p-6 space-y-5 max-h-[85vh] overflow-y-auto z-10 shadow-2xl transition-colors"
        style={{
          backgroundColor: palette.surface,
          borderColor: `${palette.accent}40`,
          color: palette.text,
        }}
      >
        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: palette.border }}>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.accent }} />
            <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
              المزيد من الخدمات والخيارات
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition"
            style={{
              backgroundColor: isLight ? '#00000008' : 'rgba(255, 255, 255, 0.05)',
              color: palette.muted,
            }}
            aria-label="إغلاق"
          >
            <CloseIcon size={18} color={palette.muted} />
          </button>
        </div>

        {/* 1. Branches & Location */}
        <div
          className="p-3.5 rounded-2xl border space-y-2"
          style={{
            backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.03)',
            borderColor: palette.border,
          }}
        >
          <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
            مقر الفرع الرئيسي:
          </span>
          <a
            href={contact.map.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] flex items-center gap-2.5 text-xs font-sans transition"
            style={{ color: palette.text }}
          >
            <MapPinIcon size={18} color={palette.accent} />
            <span>{contact.map.label} — اضغط لفتح الموقع في خرائط Google</span>
          </a>
        </div>

        {/* 3. Official Social Channels */}
        <div className="space-y-2">
          <span className="text-xs font-sans block font-medium" style={{ color: palette.muted }}>
            القنوات الرسمية المعتمدة:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {contact.social.tiktok && (
              <a
                href={contact.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl border flex items-center justify-center transition"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.05)',
                  borderColor: palette.border,
                }}
                title="تيك توك"
              >
                <TikTokIcon size={20} color={palette.accent} />
              </a>
            )}
            {contact.social.instagram && (
              <a
                href={contact.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl border flex items-center justify-center transition"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.05)',
                  borderColor: palette.border,
                }}
                title="إنستغرام"
              >
                <InstagramIcon size={20} color={palette.accent} />
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.startsWith('967') ? contact.whatsapp : `967${contact.whatsapp}`}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl border flex items-center justify-center transition"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.05)',
                  borderColor: palette.border,
                }}
                title="واتساب"
              >
                <WhatsAppIcon size={20} color={palette.accent} />
              </a>
            )}
            {contact.social.facebook && (
              <a
                href={contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] rounded-xl border flex items-center justify-center transition"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.05)',
                  borderColor: palette.border,
                }}
                title="فيسبوك"
              >
                <FacebookIcon size={20} color={palette.accent} />
              </a>
            )}
          </div>
        </div>

        {/* 4. PWA Install & Interactive Language Switcher */}
        <div className="pt-2 border-t flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: palette.border }}>
          <PwaInstallPrompt isCompact={false} />
          <button
            type="button"
            onClick={() => sf.setLocale?.(sf.locale === 'en' ? 'ar' : 'en')}
            className="min-h-[40px] px-3.5 py-2 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition"
            style={{
              backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
              borderColor: palette.border,
              color: palette.text,
            }}
          >
            <span>{sf.locale === 'en' ? 'Language: English' : 'اللغة: العربية'}</span>
            <span style={{ color: palette.accent }}>({sf.locale === 'en' ? 'التبديل للعربية' : 'Switch to EN'})</span>
          </button>
        </div>

        {/* 5. Navigation Links in Drawer */}
        <div className="pt-2 border-t space-y-1" style={{ borderColor: palette.border }}>
          {navLinks.map((link, idx) => {
            const isEn = sf.locale === 'en';
            const labelText = isEn
              ? link.labelEn || link.label || link.labelAr
              : link.labelAr || link.label || link.labelEn;
            return (
              <a
                key={link.href + idx}
                href={link.href}
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.location.pathname === '/') {
                    if (link.href === '/') {
                      e.preventDefault();
                      sf.setMobileTab?.('home');
                    } else if (link.href.includes('tab=catalog') || link.href.includes('#products')) {
                      e.preventDefault();
                      sf.setMobileTab?.('catalog');
                    }
                  }
                  onClose();
                }}
                className="min-h-[44px] flex items-center py-2.5 text-xs font-sans border-b transition"
                style={{
                  borderColor: isLight ? '#00000008' : 'rgba(255, 255, 255, 0.05)',
                  color: palette.text,
                }}
              >
                {labelText}
              </a>
            );
          })}
          <Link
            href="/account"
            onClick={onClose}
            className="min-h-[44px] flex items-center justify-between py-2.5 text-xs font-sans font-bold"
            style={{ color: palette.accent }}
          >
            <span>حسابي وتسجيل الدخول ونقاط الولاء</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${palette.accent}18`,
                borderColor: `${palette.accent}40`,
                color: palette.accent,
              }}
            >
              بوابة الحساب
            </span>
          </Link>
        </div>

        {/* 6. Quick Direct Call Button */}
        <div className="pt-1">
          <a
            href={`tel:${contact.phone}`}
            className="w-full min-h-[44px] py-3 rounded-2xl border font-sans font-bold text-xs flex items-center justify-center gap-2 transition hover:brightness-105"
            style={{
              backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6') : 'rgba(255, 255, 255, 0.05)',
              borderColor: `${palette.accent}40`,
              color: palette.accent,
            }}
          >
            <PhoneCallIcon size={16} color={palette.accent} />
            <span>اتصال مباشر: +967 {contact.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

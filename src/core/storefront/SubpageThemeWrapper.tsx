'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ThemeId, isValidThemeId, TenantBrandInfo, FeatureFlags, ThemeCurrencyCode } from '@/themes/contract';
import {
  BrandPalette,
  ResolvedThemePalette,
  resolveThemePalette,
  getClientActiveTheme,
  getClientCustomPalette,
} from './themePalette';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import {
  StorefrontProvider,
  useStorefront,
  useOptionalStorefront,
  DEFAULT_STOREFRONT_TENANT,
  DEFAULT_STOREFRONT_FEATURES,
} from './StorefrontProvider';
import { FeatureTierSimulator } from '@/themes/base/luxury-noir/components/FeatureTierSimulator';
import { WhatsAppCartDrawer } from '@/themes/base/luxury-noir/components/WhatsAppCartDrawer';
import { IvoryCartDrawer } from '@/themes/base/ivory-journal/components/IvoryCartDrawer';
import { ClinicCartDrawer } from '@/themes/base/clinic-lab/components/ClinicCartDrawer';
import { MobileAppTabBar } from './MobileAppTabBar';

export interface SubpageThemeContextValue {
  activeTheme: ThemeId;
  setActiveTheme: (theme: ThemeId) => void;
  palette: ResolvedThemePalette;
  isLight: boolean;
  locale: 'ar' | 'en';
  isEn: boolean;
  setLocale: (locale: 'ar' | 'en') => void;
  currency: ThemeCurrencyCode;
  setCurrency: (c: ThemeCurrencyCode) => void;
}

const SubpageThemeContext = createContext<SubpageThemeContextValue | null>(null);

export function useSubpageTheme(): SubpageThemeContextValue {
  const ctx = useContext(SubpageThemeContext);
  if (!ctx) {
    const pal = resolveThemePalette('luxury-noir');
    return {
      activeTheme: 'luxury-noir',
      setActiveTheme: () => {},
      palette: pal,
      isLight: false,
      locale: 'ar',
      isEn: false,
      setLocale: () => {},
      currency: 'YER',
      setCurrency: () => {},
    };
  }
  return ctx;
}

export interface SubpageThemeWrapperProps {
  children: React.ReactNode;
  activeNav?: 'home' | 'product' | 'blog' | 'bookings' | 'account' | 'authenticity-hub';
  showNavHeader?: boolean;
  showFooter?: boolean;
  showSimulator?: boolean;
  titleAr?: string;
  titleEn?: string;
  tenant?: TenantBrandInfo;
  features?: FeatureFlags;
}

function SubpageThemeInner({
  children,
  activeNav,
  showNavHeader = true,
  showFooter = true,
  showSimulator = true,
}: SubpageThemeWrapperProps) {
  const sf = useStorefront();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTheme = sf.activeTheme || 'luxury-noir';
  const palette = sf.palette || resolveThemePalette(activeTheme, sf.customPalette);
  const isLight = palette.isLight;
  const locale = sf.locale || 'ar';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const qTheme = params.get('theme');
        if (qTheme && isValidThemeId(qTheme) && sf.activeTheme !== qTheme) {
          sf.setActiveTheme?.(qTheme as ThemeId);
        }
      } catch {
        // fallback
      }
    }
  }, [sf]);
  const isEn = locale === 'en';
  const features = sf.features || DEFAULT_STOREFRONT_FEATURES;
  const tenant = sf.tenant || DEFAULT_STOREFRONT_TENANT;

  const setActiveTheme = useCallback(
    (themeId: ThemeId) => {
      sf.setActiveTheme?.(themeId);
    },
    [sf]
  );

  const setLocale = useCallback(
    (newLocale: 'ar' | 'en') => {
      sf.setLocale?.(newLocale);
    },
    [sf]
  );

  const setCurrency = useCallback(
    (newCurrency: ThemeCurrencyCode) => {
      sf.setCurrency?.(newCurrency);
    },
    [sf]
  );

  const currency = sf.currency || 'YER';

  const navLinks = useMemo(
    () => [
      { id: 'home', labelAr: 'المتجر الرئيسي', labelEn: 'Storefront', href: '/', show: true },
      {
        id: 'authenticity-hub',
        labelAr: 'فحص الأصالة',
        labelEn: 'Authenticity Lab',
        href: '/authenticity-hub',
        show: features?.authenticity_guide !== false,
      },
      {
        id: 'bookings',
        labelAr: 'حجز استشارة',
        labelEn: 'Book Consultation',
        href: '/bookings',
        show: features?.bookings !== false,
      },
      {
        id: 'blog',
        labelAr: 'المجلة العلمية',
        labelEn: 'Scientific Journal',
        href: '/blog',
        show: features?.blog !== false,
      },
      {
        id: 'account',
        labelAr: 'حسابي والولاء',
        labelEn: 'My Account & Club',
        href: '/account',
        show: features?.customer_accounts !== false,
      },
    ].filter((link) => link.show),
    [features]
  );

  const announcement =
    tenant.announcementText ||
    (isEn
      ? 'Certified products compliant with Supreme Board of Drugs & Medical Appliances (SBDMA) standards'
      : 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية');

  return (
    <SubpageThemeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        palette,
        isLight,
        locale,
        isEn: locale === 'en',
        setLocale,
        currency,
        setCurrency,
      }}
    >
      <div
        className={`samiq-subpage-container min-h-screen transition-colors duration-300 font-sans pb-14 md:pb-0 ${
          isLight ? 'is-light' : 'is-dark'
        }`}
        data-theme={activeTheme}
        style={
          {
            '--samiq-bg': palette.background,
            '--samiq-surface': palette.surface,
            '--samiq-text': palette.text,
            '--samiq-muted': palette.muted,
            '--samiq-accent': palette.accent,
            '--samiq-border': palette.border,
            '--subpage-bg': palette.background,
            '--subpage-surface': palette.surface,
            '--subpage-text': palette.text,
            '--subpage-muted': palette.muted,
            '--subpage-accent': palette.accent,
            '--subpage-border': palette.border,
            backgroundColor: palette.background,
            color: palette.text,
          } as React.CSSProperties
        }
      >
        {/* Scoped CSS overrides for non-dark templates */}
        {isLight && (
          <style jsx global>{`
            .samiq-subpage-container.is-light {
              background-color: var(--samiq-bg) !important;
              color: var(--samiq-text) !important;
            }
            .samiq-subpage-container.is-light .bg-obsidian,
            .samiq-subpage-container.is-light .bg-obsidian-dark,
            .samiq-subpage-container.is-light .bg-\[\#070709\],
            .samiq-subpage-container.is-light .bg-\[\#0B0B0C\],
            .samiq-subpage-container.is-light .bg-\[\#0E0E0F\],
            .samiq-subpage-container.is-light .bg-\[\#111016\],
            .samiq-subpage-container.is-light .bg-\[\#15151B\] {
              background-color: var(--samiq-bg) !important;
            }
            .samiq-subpage-container.is-light .bg-surface,
            .samiq-subpage-container.is-light .bg-surface-elevated,
            .samiq-subpage-container.is-light .bg-elevated,
            .samiq-subpage-container.is-light .bg-\[\#0E0E12\],
            .samiq-subpage-container.is-light .bg-\[\#121214\],
            .samiq-subpage-container.is-light .bg-\[\#141416\],
            .samiq-subpage-container.is-light .bg-\[\#161514\],
            .samiq-subpage-container.is-light [class*="bg-white\/"] {
              background-color: var(--samiq-surface) !important;
              border-color: var(--samiq-border) !important;
              color: var(--samiq-text) !important;
            }
            .samiq-subpage-container.is-light [class*="bg-gradient-to-b"],
            .samiq-subpage-container.is-light [class*="bg-gradient-to-br"],
            .samiq-subpage-container.is-light [class*="from-\[\#161514\]"],
            .samiq-subpage-container.is-light [class*="to-\[\#121110\]"],
            .samiq-subpage-container.is-light [class*="to-\[\#0E0E0F\]"] {
              background-image: none !important;
              background-color: var(--samiq-surface) !important;
            }
            .samiq-subpage-container.is-light .image-overlay-badge {
              color: #F4EFE6 !important;
            }
            .samiq-subpage-container.is-light .text-ivory,
            .samiq-subpage-container.is-light .text-white,
            .samiq-subpage-container.is-light [class*="text-ivory"],
            .samiq-subpage-container.is-light .text-\[\#F4EFE6\],
            .samiq-subpage-container.is-light .text-\[\#F5F2EB\],
            .samiq-subpage-container.is-light .text-\[\#FFFFFF\] {
              color: var(--samiq-text) !important;
            }
            .samiq-subpage-container.is-light .text-muted-lux,
            .samiq-subpage-container.is-light [class*="text-muted"] {
              color: var(--samiq-muted) !important;
            }
            .samiq-subpage-container.is-light .text-champagne {
              color: var(--samiq-accent) !important;
            }
            .samiq-subpage-container.is-light [class*="border-white\/"] {
              border-color: var(--samiq-border) !important;
            }
            .samiq-subpage-container.is-light .border-gold\/30,
            .samiq-subpage-container.is-light .border-gold\/40,
            .samiq-subpage-container.is-light .border-gold {
              border-color: var(--samiq-accent) !important;
            }
            .samiq-subpage-container.is-light input,
            .samiq-subpage-container.is-light select,
            .samiq-subpage-container.is-light textarea {
              background-color: var(--samiq-surface) !important;
              color: var(--samiq-text) !important;
              border-color: var(--samiq-border) !important;
            }
            .samiq-subpage-container.is-light input[class*="bg-transparent"],
            .samiq-subpage-container.is-light textarea[class*="bg-transparent"],
            .samiq-subpage-container.is-light input.bg-transparent,
            .samiq-subpage-container.is-light textarea.bg-transparent {
              background-color: transparent !important;
            }
            .samiq-subpage-container.is-light input::placeholder,
            .samiq-subpage-container.is-light textarea::placeholder {
              color: var(--samiq-muted) !important;
            }
          `}</style>
        )}

        {/* 1. Top Regulatory & Announcement Bar */}
        <div
          className="w-full py-1.5 px-4 text-xs font-sans text-center transition-colors border-b flex items-center justify-center gap-2"
          style={{
            backgroundColor: isLight ? '#00000005' : '#FFFFFF08',
            borderColor: palette.border,
            color: palette.muted,
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: palette.accent }}
          />
          <span className="truncate max-w-4xl">{announcement}</span>
        </div>

        {/* 2. Unified Chameleon Subpage Header */}
        {showNavHeader && (
          <header
            data-testid="header"
            className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-300 shadow-sm"
            style={{
              backgroundColor: isLight ? `${palette.background}F0` : `${palette.background}E6`,
              borderBottom: `1px solid ${palette.border}`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
              {/* Brand Emblem & Name */}
              <Link href="/" className="flex items-center gap-2 group min-w-0 shrink-0">
                {activeTheme === 'clinic-lab' ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base"
                      style={{
                        backgroundColor: `${palette.accent}20`,
                        color: palette.accent,
                        border: `1px solid ${palette.accent}40`,
                      }}
                    >
                      M
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="font-bold text-sm sm:text-base leading-tight" style={{ color: palette.text }}>
                        {tenant.name}
                      </span>
                      <span className="text-[10px] leading-tight" style={{ color: palette.muted }}>
                        {isEn ? 'Clinical Care & Authenticity Lab' : 'لكشف المقلد والعناية السريرية'}
                      </span>
                    </div>
                  </div>
                ) : activeTheme === 'ivory-journal' ? (
                  <div className="flex flex-col text-start">
                    <span className="font-serif font-bold text-lg sm:text-xl leading-none" style={{ color: palette.text }}>
                      {tenant.name}
                    </span>
                    <span className="text-[10px] font-sans mt-0.5" style={{ color: palette.muted }}>
                      {isEn ? 'Luxury Care & Authenticity Journal' : 'لكشف المقلد ومجلة العناية الفاخرة'}
                    </span>
                  </div>
                ) : (
                  <MiftahLogoSvg size={40} showText={true} />
                )}
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => {
                  const isActive = activeNav === link.id;
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      className={`relative min-h-[42px] px-3.5 py-2 rounded-xl text-xs xl:text-sm font-sans font-medium transition-all inline-flex items-center gap-1.5 ${
                        isActive ? 'font-bold' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        color: isActive ? palette.accent : palette.text,
                        backgroundColor: isActive
                          ? `${palette.accent}15`
                          : 'transparent',
                      }}
                    >
                      <span>{isEn ? link.labelEn : link.labelAr}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-1 inset-x-3 h-[2px] rounded-full"
                          style={{
                            backgroundColor: palette.accent,
                            boxShadow: `0 0 6px ${palette.accent}`,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Action Controls: Template Switcher + Currency + Language + Cart */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Interactive Template Switcher Pill */}
                <div
                  className="hidden sm:inline-flex items-center p-0.5 rounded-full border text-[11px] font-medium"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: isLight ? '#00000008' : '#FFFFFF0A',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTheme('luxury-noir')}
                    className={`min-h-[32px] px-2.5 rounded-full transition-all ${
                      activeTheme === 'luxury-noir' ? 'font-bold shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeTheme === 'luxury-noir' ? palette.accent : 'transparent',
                      color: activeTheme === 'luxury-noir' ? '#0B0B0C' : palette.text,
                    }}
                    title="قالب الفخامة الداكنة"
                  >
                    Noir
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTheme('ivory-journal')}
                    className={`min-h-[32px] px-2.5 rounded-full transition-all ${
                      activeTheme === 'ivory-journal' ? 'font-bold shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeTheme === 'ivory-journal' ? palette.accent : 'transparent',
                      color: activeTheme === 'ivory-journal' ? '#FFFFFF' : palette.text,
                    }}
                    title="قالب المجلة العاجية"
                  >
                    Ivory
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTheme('clinic-lab')}
                    className={`min-h-[32px] px-2.5 rounded-full transition-all ${
                      activeTheme === 'clinic-lab' ? 'font-bold shadow-xs' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeTheme === 'clinic-lab' ? palette.accent : 'transparent',
                      color: activeTheme === 'clinic-lab' ? '#FFFFFF' : palette.text,
                    }}
                    title="قالب المختبر السريري"
                  >
                    Clinic
                  </button>
                </div>

                {/* Bilingual AR | EN Toggle */}
                {features?.second_language !== false && (
                  <button
                    type="button"
                    onClick={() => setLocale(isEn ? 'ar' : 'en')}
                    className="min-h-[36px] px-2.5 rounded-lg border text-xs font-mono font-bold transition inline-flex items-center gap-1"
                    style={{
                      borderColor: palette.border,
                      backgroundColor: isLight ? '#00000008' : '#FFFFFF0A',
                      color: palette.text,
                    }}
                    title={isEn ? 'التبديل إلى العربية' : 'Switch to English'}
                    aria-label="تبديل اللغة"
                  >
                    <span className={!isEn ? 'font-bold' : 'opacity-40'}>AR</span>
                    <span className="opacity-30">|</span>
                    <span className={isEn ? 'font-bold' : 'opacity-40'}>EN</span>
                  </button>
                )}

                {/* Cart Button */}
                <button
                  type="button"
                  onClick={() => sf.cart?.open?.()}
                  className="relative min-w-[42px] min-h-[42px] rounded-lg border flex items-center justify-center transition-all"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: `${palette.accent}15`,
                    color: palette.accent,
                  }}
                  title={isEn ? 'Shopping Cart' : 'سلة المشتريات'}
                  aria-label="سلة المشتريات"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.75}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {sf.cart?.count > 0 && (
                    <span
                      className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center leading-none text-white shadow-xs"
                      style={{ backgroundColor: '#D9534F' }}
                    >
                      {sf.cart.count}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden min-w-[42px] min-h-[42px] rounded-lg border flex items-center justify-center transition"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: isLight ? '#00000008' : '#FFFFFF0A',
                    color: palette.text,
                  }}
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

            {/* Mobile Expanded Menu Drawer */}
            {mobileMenuOpen && (
              <div
                className="lg:hidden border-t px-4 py-4 space-y-3"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                }}
              >
                <div className="flex flex-col space-y-1">
                  {navLinks.map((link) => {
                    const isActive = activeNav === link.id;
                    return (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`min-h-[44px] px-4 rounded-xl flex items-center justify-between text-sm font-sans font-medium transition ${
                          isActive ? 'font-bold' : 'opacity-80'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${palette.accent}20` : 'transparent',
                          color: isActive ? palette.accent : palette.text,
                        }}
                      >
                        <span>{isEn ? link.labelEn : link.labelAr}</span>
                        {isActive && <span style={{ color: palette.accent }}>●</span>}
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Template Selector */}
                <div className="pt-2 border-t flex items-center justify-between gap-2" style={{ borderColor: palette.border }}>
                  <span className="text-xs" style={{ color: palette.muted }}>
                    {isEn ? 'Theme Template:' : 'قالب المتجر:'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTheme('luxury-noir');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded text-xs"
                      style={{
                        backgroundColor: activeTheme === 'luxury-noir' ? palette.accent : 'transparent',
                        color: activeTheme === 'luxury-noir' ? '#0B0B0C' : palette.text,
                      }}
                    >
                      Noir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTheme('ivory-journal');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded text-xs"
                      style={{
                        backgroundColor: activeTheme === 'ivory-journal' ? palette.accent : 'transparent',
                        color: activeTheme === 'ivory-journal' ? '#FFFFFF' : palette.text,
                      }}
                    >
                      Ivory
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTheme('clinic-lab');
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded text-xs"
                      style={{
                        backgroundColor: activeTheme === 'clinic-lab' ? palette.accent : 'transparent',
                        color: activeTheme === 'clinic-lab' ? '#FFFFFF' : palette.text,
                      }}
                    >
                      Clinic
                    </button>
                  </div>
                </div>
              </div>
            )}
          </header>
        )}

        {/* Page Children Content */}
        {children}

        {/* 3. Unified Chameleon Storefront Subpage Footer */}
        {showFooter && (
          <footer
            className="w-full border-t transition-colors mt-20 pt-16 pb-28 sm:pb-24"
            style={{
              backgroundColor: isLight ? `${palette.surface}F8` : `${palette.surface}E6`,
              borderColor: palette.border,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Col 1: Brand Info */}
                <div className="space-y-4">
                  <Link href="/" className="inline-block">
                    <span className="font-serif font-bold text-xl" style={{ color: palette.text }}>
                      {tenant.name}
                    </span>
                  </Link>
                  <p className="text-xs sm:text-sm font-sans leading-relaxed" style={{ color: palette.muted }}>
                    {isEn
                      ? 'The premier destination for certified authentic luxury cosmetics and dermatology-grade skincare in Yemen.'
                      : 'الوجهة المعتمدة الأولى في اليمن لمستحضرات العناية بالبشرة والتجميل الأصلية الموثقة والمصرحة رسمياً.'}
                  </p>
                  <div
                    className="p-3 rounded-xl border text-xs font-sans leading-relaxed"
                    style={{
                      borderColor: palette.border,
                      backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
                      color: palette.muted,
                    }}
                  >
                    {isEn
                      ? 'Compliant with SBDMA regulations. Certified authenticity guarantee on all catalog curations.'
                      : 'مطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. كفالة أصالة معتمدة 100% لكافة المستحضرات.'}
                  </div>
                </div>

                {/* Col 2: Navigation Links */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                    {isEn ? 'Directory' : 'فهرس المتجر والمجلة'}
                  </h4>
                  <ul className="space-y-2 text-xs font-sans">
                    {navLinks.map((l) => (
                      <li key={l.id}>
                        <Link
                          href={l.href}
                          className="hover:underline transition-all"
                          style={{ color: palette.text }}
                        >
                          {isEn ? l.labelEn : l.labelAr}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3: Contact & Main Branch */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                    {isEn ? 'Main Branch' : 'الفرع الرئيسي والتواصل'}
                  </h4>
                  <div className="space-y-2 text-xs font-sans" style={{ color: palette.muted }}>
                    <p className="font-medium" style={{ color: palette.text }}>
                      {isEn ? 'Sanaa Main Flagship' : 'صنعاء — فرع حدة الرئيسي'}
                    </p>
                    <p>{isEn ? 'Hadda St, near diplomatic quarter' : 'شارع حدة، بجوار الحي الدبلوماسي'}</p>
                    <p>
                      {isEn ? 'Direct Line / WhatsApp: ' : 'هاتف وواتساب: '}
                      <span className="font-mono font-bold" style={{ color: palette.accent }}>
                        775234989
                      </span>
                    </p>
                    <a
                      href={tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline pt-1 font-semibold"
                      style={{ color: palette.accent }}
                    >
                      <span>{isEn ? 'View on Google Maps' : 'موقع الفرع على خرائط جوجل'}</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* Col 4: Official Social Channels */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                    {isEn ? 'Social Channels' : 'القنوات المعتمدة'}
                  </h4>
                  <div className="space-y-2 text-xs font-sans">
                    <a
                      href="https://wa.me/967775234989"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg border transition hover:opacity-100"
                      style={{
                        borderColor: palette.border,
                        color: palette.text,
                        backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
                      }}
                    >
                      <span>WhatsApp Direct</span>
                      <span className="font-mono text-xs" style={{ color: palette.accent }}>
                        +967 775 234 989
                      </span>
                    </a>
                    <a
                      href="https://instagram.com/tamifttah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg border transition hover:opacity-100"
                      style={{
                        borderColor: palette.border,
                        color: palette.text,
                        backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
                      }}
                    >
                      <span>Instagram</span>
                      <span className="font-mono text-xs" style={{ color: palette.accent }}>
                        @tamifttah
                      </span>
                    </a>
                    <a
                      href="https://tiktok.com/@tamiffttah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg border transition hover:opacity-100"
                      style={{
                        borderColor: palette.border,
                        color: palette.text,
                        backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
                      }}
                    >
                      <span>TikTok</span>
                      <span className="font-mono text-xs" style={{ color: palette.accent }}>
                        @tamiffttah
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright & SAMIQ Attribution */}
              <div
                className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans"
                style={{ borderColor: palette.border, color: palette.muted }}
              >
                <span>
                  © {new Date().getFullYear()} {tenant.name}. {isEn ? 'All rights reserved.' : 'كافة الحقوق محفوظة.'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span>{isEn ? 'Powered by' : 'مشغل بواسطة'}</span>
                  <a
                    href="https://samiq.shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                    style={{ color: palette.accent }}
                  >
                    {isEn ? 'SAMIQ Luxury Commerce Engine' : 'منصة سَامِق للعلامات الفاخرة'}
                  </a>
                </span>
              </div>
            </div>
          </footer>
        )}

        {/* 4. Active Theme Cart Drawer */}
        {sf.cart?.isOpen && (
          activeTheme === 'ivory-journal' ? (
            <IvoryCartDrawer />
          ) : activeTheme === 'clinic-lab' ? (
            <ClinicCartDrawer />
          ) : (
            <WhatsAppCartDrawer />
          )
        )}

        {/* 5. Feature Tier Simulator Bar (Bottom Live Bar) */}
        {showSimulator && <FeatureTierSimulator />}

        {/* 6. Mobile App Tab Bar across all subpages */}
        <MobileAppTabBar />
      </div>
    </SubpageThemeContext.Provider>
  );
}

export function SubpageThemeWrapper(props: SubpageThemeWrapperProps) {
  const existingSf = useOptionalStorefront();

  // If already wrapped by StorefrontProvider, render directly
  if (existingSf) {
    return <SubpageThemeInner {...props} />;
  }

  // Otherwise, wrap in StorefrontProvider with sensible defaults so simulator & cart work
  return (
    <StorefrontProvider
      tenant={props.tenant || DEFAULT_STOREFRONT_TENANT}
      features={props.features || DEFAULT_STOREFRONT_FEATURES}
    >
      <SubpageThemeInner {...props} />
    </StorefrontProvider>
  );
}

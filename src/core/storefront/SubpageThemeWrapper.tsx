'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ThemeId, isValidThemeId } from '@/themes/contract';
import {
  BrandPalette,
  ResolvedThemePalette,
  resolveThemePalette,
  getClientActiveTheme,
  getClientCustomPalette,
} from './themePalette';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';

interface SubpageThemeContextValue {
  activeTheme: ThemeId;
  setActiveTheme: (theme: ThemeId) => void;
  palette: ResolvedThemePalette;
  isLight: boolean;
  locale: 'ar' | 'en';
  setLocale: (locale: 'ar' | 'en') => void;
}

const SubpageThemeContext = createContext<SubpageThemeContextValue | null>(null);

export function useSubpageTheme(): SubpageThemeContextValue {
  const ctx = useContext(SubpageThemeContext);
  if (!ctx) {
    // Fallback safe defaults if used outside provider
    const pal = resolveThemePalette('luxury-noir');
    return {
      activeTheme: 'luxury-noir',
      setActiveTheme: () => {},
      palette: pal,
      isLight: false,
      locale: 'ar',
      setLocale: () => {},
    };
  }
  return ctx;
}

interface SubpageThemeWrapperProps {
  children: React.ReactNode;
  activeNav?: 'home' | 'product' | 'blog' | 'bookings' | 'account' | 'authenticity-hub';
  showNavHeader?: boolean;
  titleAr?: string;
  titleEn?: string;
}

export function SubpageThemeWrapper({
  children,
  activeNav,
  showNavHeader = true,
  titleAr,
  titleEn,
}: SubpageThemeWrapperProps) {
  const [activeTheme, setActiveThemeState] = useState<ThemeId>('luxury-noir');
  const [customPalette, setCustomPaletteState] = useState<BrandPalette | null>(null);
  const [locale, setLocaleState] = useState<'ar' | 'en'>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const clientTheme = getClientActiveTheme('luxury-noir');
    setActiveThemeState(clientTheme);

    const clientPalette = getClientCustomPalette();
    if (clientPalette) {
      setCustomPaletteState(clientPalette);
    }

    const savedLocale = localStorage.getItem('samiq_locale') as 'ar' | 'en';
    if (savedLocale === 'ar' || savedLocale === 'en') {
      setLocaleState(savedLocale);
    }

    const handleThemeChange = (e: any) => {
      if (e.detail && isValidThemeId(e.detail)) {
        setActiveThemeState(e.detail);
      }
    };
    const handlePaletteChange = (e: any) => {
      setCustomPaletteState(e.detail || null);
    };
    const handleLocaleChange = (e: any) => {
      if (e.detail === 'ar' || e.detail === 'en') {
        setLocaleState(e.detail);
      }
    };

    window.addEventListener('samiq_theme_changed', handleThemeChange);
    window.addEventListener('samiq_custom_palette_changed', handlePaletteChange);
    window.addEventListener('samiq_locale_changed', handleLocaleChange);

    return () => {
      window.removeEventListener('samiq_theme_changed', handleThemeChange);
      window.removeEventListener('samiq_custom_palette_changed', handlePaletteChange);
      window.removeEventListener('samiq_locale_changed', handleLocaleChange);
    };
  }, []);

  const setLocale = useCallback((newLocale: 'ar' | 'en') => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('samiq_locale', newLocale);
      document.documentElement.dir = newLocale === 'en' ? 'ltr' : 'rtl';
      document.documentElement.lang = newLocale;
      window.dispatchEvent(new CustomEvent('samiq_locale_changed', { detail: newLocale }));
    } catch {
      // fallback
    }
  }, []);

  const setActiveTheme = useCallback((themeId: ThemeId) => {
    setActiveThemeState(themeId);
    try {
      localStorage.setItem('samiq_demo_theme', themeId);
      window.dispatchEvent(new CustomEvent('samiq_theme_changed', { detail: themeId }));
    } catch {
      // fallback
    }
  }, []);

  const palette = useMemo(
    () => resolveThemePalette(activeTheme, customPalette),
    [activeTheme, customPalette]
  );

  const isLight = palette.isLight;

  const navLinks = [
    { id: 'home', labelAr: 'المتجر الرئيسي', labelEn: 'Storefront', href: '/' },
    { id: 'account', labelAr: 'حسابي والولاء', labelEn: 'My Account', href: '/account' },
    { id: 'authenticity-hub', labelAr: 'الموسوعة', labelEn: 'Authenticity Lab', href: '/authenticity-hub' },
    { id: 'bookings', labelAr: 'حجز موعد', labelEn: 'Bookings', href: '/bookings' },
    { id: 'blog', labelAr: 'المجلة', labelEn: 'Journal', href: '/blog' },
  ];

  return (
    <SubpageThemeContext.Provider
      value={{
        activeTheme,
        setActiveTheme,
        palette,
        isLight,
        locale,
        setLocale,
      }}
    >
      <div
        className={`samiq-subpage-container min-h-screen transition-colors duration-300 font-sans ${
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
            .samiq-subpage-container.is-light .bg-\[\#070709\],
            .samiq-subpage-container.is-light .bg-\[\#0B0B0C\],
            .samiq-subpage-container.is-light .bg-\[\#111016\] {
              background-color: var(--samiq-bg) !important;
            }
            .samiq-subpage-container.is-light .bg-surface,
            .samiq-subpage-container.is-light .bg-\[\#0E0E12\],
            .samiq-subpage-container.is-light .bg-\[\#121214\],
            .samiq-subpage-container.is-light .bg-white\/\[0\.02\],
            .samiq-subpage-container.is-light .bg-white\/\[0\.03\],
            .samiq-subpage-container.is-light .bg-white\/5 {
              background-color: var(--samiq-surface) !important;
              border-color: var(--samiq-border) !important;
              color: var(--samiq-text) !important;
            }
            .samiq-subpage-container.is-light .text-ivory,
            .samiq-subpage-container.is-light .text-white {
              color: var(--samiq-text) !important;
            }
            .samiq-subpage-container.is-light .text-muted-lux,
            .samiq-subpage-container.is-light .text-ivory\/70,
            .samiq-subpage-container.is-light .text-ivory\/80,
            .samiq-subpage-container.is-light .text-ivory\/90 {
              color: var(--samiq-muted) !important;
            }
            .samiq-subpage-container.is-light .text-champagne {
              color: var(--samiq-accent) !important;
            }
            .samiq-subpage-container.is-light .border-white\/10,
            .samiq-subpage-container.is-light .border-white\/5,
            .samiq-subpage-container.is-light .border-white\/\[0\.08\] {
              border-color: var(--samiq-border) !important;
            }
            .samiq-subpage-container.is-light .border-gold\/30,
            .samiq-subpage-container.is-light .border-gold\/40 {
              border-color: var(--samiq-accent) !important;
            }
            .samiq-subpage-container.is-light input,
            .samiq-subpage-container.is-light select,
            .samiq-subpage-container.is-light textarea {
              background-color: var(--samiq-surface) !important;
              color: var(--samiq-text) !important;
              border-color: var(--samiq-border) !important;
            }
            .samiq-subpage-container.is-light input::placeholder,
            .samiq-subpage-container.is-light textarea::placeholder {
              color: var(--samiq-muted) !important;
            }
          `}</style>
        )}

        {/* Dynamic Chameleon Subpage Header */}
        {showNavHeader && (
          <header
            className="sticky top-0 z-30 w-full backdrop-blur-md transition-colors duration-300"
            style={{
              backgroundColor: isLight
                ? `${palette.background}F2`
                : `${palette.background}E6`,
              borderBottom: `1px solid ${palette.border}`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2">
                <MiftahLogoSvg size={42} showText={true} />
              </Link>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Navigation Links */}
                {navLinks.map((link) => {
                  const isActive = activeNav === link.id;
                  return (
                    <Link
                      key={link.id}
                      href={link.href}
                      className={`min-h-[40px] px-3 rounded-lg text-xs font-sans transition inline-flex items-center ${
                        isActive
                          ? 'font-bold'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? `${palette.accent}20`
                          : isLight
                          ? '#00000008'
                          : '#FFFFFF0D',
                        color: isActive ? palette.accent : palette.text,
                        border: `1px solid ${
                          isActive ? palette.accent : palette.border
                        }`,
                      }}
                    >
                      {locale === 'en' ? link.labelEn : link.labelAr}
                    </Link>
                  );
                })}

                {/* Bilingual AR | EN Toggle */}
                <button
                  type="button"
                  onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                  className="min-h-[40px] px-2.5 rounded-lg border text-xs font-mono font-bold transition inline-flex items-center gap-1"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: isLight ? '#00000008' : '#FFFFFF0D',
                    color: palette.text,
                  }}
                  title={locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
                >
                  <span className={locale === 'ar' ? 'font-bold' : 'opacity-50'}>AR</span>
                  <span className="opacity-30">|</span>
                  <span className={locale === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
                </button>
              </div>
            </div>
          </header>
        )}

        {children}
      </div>
    </SubpageThemeContext.Provider>
  );
}

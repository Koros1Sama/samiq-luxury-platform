'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MiftahLogoSvg } from './MiftahLogoSvg';
import { BagCartIcon, SparkleStarIcon } from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ThemeCurrencyCode, FeatureFlags } from '../../../contract';

function OnDemandDrawer({
  loader,
  props,
}: {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  props?: any;
}) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    let isMounted = true;
    loader().then((mod) => {
      if (isMounted) setComponent(() => mod.default);
    });
    return () => {
      isMounted = false;
    };
  }, [loader]);

  if (!Component) return null;
  return <Component {...props} />;
}

interface LuxuryHeaderProps {
  currentCurrency?: ThemeCurrencyCode;
  onCurrencyChange?: (currency: ThemeCurrencyCode) => void;
  features?: FeatureFlags;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onOpenAdvisor?: () => void;
}

export function LuxuryHeader(props: LuxuryHeaderProps) {
  const sf = useStorefront();

  const currentCurrency = props.currentCurrency || sf.currency;
  const onCurrencyChange = props.onCurrencyChange || sf.setCurrency;
  const features = props.features || sf.features;
  const cartCount = props.cartCount !== undefined ? props.cartCount : sf.cart.count;
  const onOpenCart = props.onOpenCart || sf.cart.open;

  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('الرئيسية');

  const locale = sf.locale || 'ar';
  const isEn = locale === 'en';

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
    { labelAr: 'الرئيسية', labelEn: 'Home', href: '/', show: true },
    { labelAr: 'المنتجات', labelEn: 'Products', href: '/#products-catalog', show: !!features.tier_3_catalog },
    { labelAr: 'فحص الأصالة', labelEn: 'Authenticity Lab', href: '/authenticity-hub', show: !!features.tier_3_catalog && !!features.authenticity_guide },
    { labelAr: 'المجلة', labelEn: 'Journal', href: '/blog', show: !!features.blog },
    { labelAr: 'حجز استشارة', labelEn: 'Bookings', href: '/bookings', show: !!features.bookings },
    { labelAr: 'حسابي والولاء', labelEn: 'My Account', href: '/account', show: !!features.customer_accounts },
  ].filter((link) => link.show);

  return (
    <>
      {/* Exactly ONE Sticky Header Bar: 56px on Mobile (h-14), 64px on Desktop */}
      <header
        data-testid="header"
        className="sticky top-0 z-30 w-full h-14 md:h-16 bg-[#070709] border-b border-white/[0.08] shadow-lg flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Start: Logo Mark + Shop Name on One Line */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="flex items-center group min-w-0">
              <MiftahLogoSvg size={36} showText={true} />
            </Link>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const label = isEn ? link.labelEn : link.labelAr;
              const isActive = activeNav === link.labelAr;
              return (
                <a
                  key={link.labelAr}
                  href={link.href}
                  onClick={() => setActiveNav(link.labelAr)}
                  className={`relative min-h-[40px] px-2 py-2 flex items-center text-xs xl:text-sm font-sans font-medium transition-colors ${
                    isActive ? 'text-champagne font-bold' : 'text-ivory/70 hover:text-ivory'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-[-10px] inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent rounded-full shadow-[0_0_8px_#C9A84C]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* End: Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Bilingual AR | EN Toggle (Gated by second_language feature) */}
            {features?.second_language !== false && (
              <button
                type="button"
                onClick={() => sf.setLocale?.(isEn ? 'ar' : 'en')}
                className="h-8 sm:min-h-[38px] px-2 sm:px-2.5 rounded-full border border-gold/30 bg-gold/10 hover:bg-gold/20 text-champagne text-[11px] sm:text-xs font-mono font-bold transition flex items-center gap-1"
                title={isEn ? 'التبديل إلى العربية' : 'Switch to English'}
                aria-label="تبديل اللغة"
              >
                <span className={!isEn ? 'font-bold text-gold' : 'opacity-50'}>AR</span>
                <span className="opacity-30">|</span>
                <span className={isEn ? 'font-bold text-gold' : 'opacity-50'}>EN</span>
              </button>
            )}

            {/* Search Button (Only shown when catalog tier 3 is active) */}
            {features.tier_3_catalog && (
              <button
                type="button"
                data-testid="search-button"
                onClick={() => {
                  if (props.onOpenSearch) props.onOpenSearch();
                  else setSearchModalOpen(true);
                }}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
                aria-label="بحث في المنتجات"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            )}

            {/* Account Portal Link (hidden on mobile, accessible via More drawer / bottom bar) */}
            <Link
              href="/account"
              className="hidden sm:flex w-11 h-11 min-w-[44px] min-h-[44px] rounded-full items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
              aria-label="حسابي ونقاط الولاء"
              title="حسابي ونقاط الولاء"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* AI Advisor Button */}
            {features.ai_chatbot && (
              <button
                type="button"
                onClick={props.onOpenAdvisor}
                className="hidden sm:flex w-11 h-11 min-w-[44px] min-h-[44px] rounded-full items-center justify-center text-champagne bg-gold/10 hover:bg-gold/20 border border-gold/30 transition shadow-sm"
                aria-label="المستشار الذكي لكشف المقلد"
                title="المستشار الذكي"
              >
                <SparkleStarIcon size={18} color="#C9A84C" />
              </button>
            )}

            {/* Cart Button (Hidden on mobile < md where bottom MobileAppTabBar already provides the cart) */}
            {features.cart_whatsapp && (
              <button
                type="button"
                data-testid="cart-button"
                onClick={onOpenCart}
                className="relative hidden md:flex w-8 h-8 sm:w-11 sm:h-11 rounded-full items-center justify-center bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-ivory hover:text-champagne transition shadow-md"
                aria-label="سلة المشتريات"
              >
                <BagCartIcon size={17} color="currentColor" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-[10px] sm:text-xs flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Menu Button ("More" on mobile) */}
            <button
              type="button"
              data-testid="menu-button"
              onClick={() => setMoreDrawerOpen(true)}
              className="lg:hidden w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-ivory/80 hover:text-champagne hover:bg-white/5 transition"
              aria-label="المزيد من الخيارات"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full Bottom Sheet "More" on Mobile (Loaded strictly on-demand when user opens it) */}
      {moreDrawerOpen && (
        <OnDemandDrawer
          loader={() =>
            import('./LuxuryMoreDrawer').then((m) => ({
              default: m.LuxuryMoreDrawer,
            }))
          }
          props={{
            isOpen: moreDrawerOpen,
            onClose: () => setMoreDrawerOpen(false),
            currentCurrency,
            onCurrencyChange,
            contact,
            navLinks,
          }}
        />
      )}

      {/* Global Search Modal (Loaded strictly on-demand when user opens search) */}
      {searchModalOpen && (
        <OnDemandDrawer
          loader={() =>
            import('./SearchModal').then((m) => ({
              default: m.SearchModal,
            }))
          }
          props={{
            isOpen: searchModalOpen,
            onClose: () => setSearchModalOpen(false),
            currentCurrency,
          }}
        />
      )}
    </>
  );
}

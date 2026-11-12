'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Section, SectionRenderers } from '@/themes/contract';
import { useStorefront } from './StorefrontProvider';
import { formatCurrency } from '@/core/currency/formatter';
import { splitBilingualProductTitle } from './productQuickInfo';
import { SmartImage } from '@/core/ui/SmartImage';
import { renderStorefrontSection } from './renderStorefrontSection';

const MobileAppSecondaryTabs = dynamic(
  () => import('./MobileAppSecondaryTabs').then((m) => m.MobileAppSecondaryTabs),
  { ssr: false }
);

interface MobileAppViewsProps {
  sections: Section[];
  renderers: SectionRenderers;
}

/**
 * Renders the mobile Home fold (dock, bestsellers rail, compliance note, contact)
 * and dynamically code-splits secondary mobile tabs so Cold JS remains ultra-light.
 */
export function MobileAppViews({ sections, renderers }: MobileAppViewsProps) {
  const sf = useStorefront();
  const {
    products = [],
    currency,
    cart,
    mobileTab = 'home',
    setMobileTab,
    activeTheme = 'luxury-noir',
    palette,
    blocksData,
    features,
  } = sf;

  const isLight = palette?.isLight ?? false;

  const renderSection = (section: Section | undefined) =>
    renderStorefrontSection({ section, renderers, blocksData, features });

  const contactSection = sections.find((s) => s.type === 'contact');
  const bestsellers = useMemo(() => products.slice(0, 4), [products]);

  const surfaceColor = isLight ? palette.surfaceHex || '#FFFFFF' : '#0E0E12';
  const borderColor = isLight ? palette.borderHex || '#E8E2D8' : 'rgba(255, 255, 255, 0.08)';
  const textColor = isLight ? palette.textHex || '#1C1917' : '#F4EFE6';
  const mutedColor = isLight ? palette.mutedHex || '#78716C' : '#9A968E';
  const accentColor = isLight ? palette.accentHex || '#8C5E3C' : '#C9A84C';

  if (mobileTab !== 'home') {
    return <MobileAppSecondaryTabs sections={sections} renderSection={renderSection} />;
  }

  const isNoir = activeTheme === 'luxury-noir';
  const isIvory = activeTheme === 'ivory-journal';
  const radiusCard = isIvory ? 'rounded-md' : 'rounded-2xl';
  const radiusBtn = isIvory ? 'rounded-sm' : 'rounded-xl';

  return (
    <div className="flex flex-col w-full space-y-2 pb-4 animate-fadeIn">
      {/* 1. Sleek Theme-Aware Horizontal App Dock (Compact so >= 2 fold cards always shine at 320px+) */}
      <div className="px-3 pt-1.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => setMobileTab?.('catalog')}
            className={`min-h-[40px] px-3 ${radiusBtn} flex items-center gap-1.5 shrink-0 border text-xs font-sans font-semibold transition active:scale-[0.98]`}
            style={{
              backgroundColor: surfaceColor,
              borderColor: isNoir ? 'rgba(201, 168, 76, 0.28)' : borderColor,
              color: textColor,
            }}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
            <span>الكتالوج ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab?.('authenticity')}
            className={`min-h-[44px] px-3.5 ${radiusBtn} flex items-center gap-2 shrink-0 border text-xs font-sans font-semibold transition active:scale-[0.98]`}
            style={{
              backgroundColor: surfaceColor,
              borderColor,
              color: textColor,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span>كشف المقلد</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab?.('routine')}
            className={`min-h-[44px] px-3.5 ${radiusBtn} flex items-center gap-2 shrink-0 border text-xs font-sans font-semibold transition active:scale-[0.98]`}
            style={{
              backgroundColor: surfaceColor,
              borderColor,
              color: textColor,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.6 5.3L20.5 8l-4.2 4.1 1 5.8L12 15.2l-5.3 2.7 1-5.8L3.5 8l5.9-.7L12 2z" />
            </svg>
            <span>روتينكِ</span>
          </button>

          <Link
            href="/bookings"
            className={`min-h-[44px] px-3.5 ${radiusBtn} flex items-center gap-2 shrink-0 border text-xs font-sans font-semibold transition active:scale-[0.98]`}
            style={{
              backgroundColor: surfaceColor,
              borderColor,
              color: textColor,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>حجز استشارة</span>
          </Link>
        </div>
      </div>

      {/* 2. Horizontal Bestsellers Rail ("الأكثر طلباً وتوثيقاً" - Fold Anchor) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            <h2 className="text-sm font-serif font-bold" style={{ color: textColor }}>
              الأكثر طلباً وتوثيقاً
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setMobileTab?.('catalog')}
            className="min-h-[40px] px-2 text-xs font-sans font-bold flex items-center gap-1 transition"
            style={{ color: accentColor }}
          >
            <span>الكتالوج كامل</span>
            <span className="rtl:-scale-x-100">←</span>
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto px-3 pb-1.5 snap-x snap-mandatory no-scrollbar">
          {bestsellers.map((product) => {
            const price = product.prices[currency] || product.prices.YER || 0;
            const formattedPrice = formatCurrency(price, currency);
            const { arTitle } = splitBilingualProductTitle(product.title);

            return (
              <div
                key={`home-best-${product.id}`}
                data-product-card
                className={`w-[144px] sm:w-[155px] shrink-0 snap-start ${radiusCard} p-2 flex flex-col justify-between shadow-md border transition`}
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: isNoir ? 'rgba(201, 168, 76, 0.18)' : borderColor,
                }}
              >
                <Link
                  href={`/product/${product.id}`}
                  className={`block h-[88px] w-full ${radiusBtn} overflow-hidden relative bg-gradient-to-b from-[#EDE7DD] to-[#D8D0C3]`}
                >
                  <SmartImage
                    src={product.image}
                    alt={arTitle}
                    priority={false}
                    sizes="150px"
                    className="object-cover object-center brightness-95"
                  />
                </Link>

                <div className="mt-1 space-y-0.5">
                  <span className="text-xs font-sans font-medium block truncate" style={{ color: accentColor }}>
                    {product.brand}
                  </span>
                  <Link href={`/product/${product.id}`} className="min-h-[40px] flex items-center">
                    <h3 data-product-title className="text-xs font-serif font-bold line-clamp-1 leading-snug" style={{ color: textColor }}>
                      {arTitle}
                    </h3>
                  </Link>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-sans font-bold tabular-nums" style={{ color: isNoir ? '#E6CFA0' : accentColor }}>
                      {formattedPrice}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => cart.add(product)}
                  className={`w-full mt-1 min-h-[44px] h-[44px] ${radiusBtn} font-sans font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]`}
                  style={{
                    backgroundColor: accentColor,
                    color: isLight ? '#FFFFFF' : '#070709',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <span>إضافة</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SBDMA Certified Regulatory Banner */}
      <div className="px-3 pt-1">
        <div
          className={`p-3.5 ${radiusCard} border flex items-center gap-3 shadow-xs`}
          style={{
            backgroundColor: isLight ? '#00000004' : '#FFFFFF04',
            borderColor,
          }}
        >
          <div
            className={`w-10 h-10 ${radiusBtn} flex items-center justify-center shrink-0`}
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-serif font-bold block" style={{ color: textColor }}>
              مستحضرات مصرحة ومطابقة 100%
            </span>
            <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
              وفق معايير الهيئة العليا للأدوية والمستلزمات الطبية، مع ضمان استرداد فوري إن ثبت أي تلاعب.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Store Location & Contact Summary */}
      <div className="px-3">{renderSection(contactSection)}</div>
    </div>
  );
}


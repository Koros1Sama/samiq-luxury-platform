'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Section } from '@/themes/contract';
import { useStorefront } from './StorefrontProvider';
import { formatCurrency } from '@/core/currency/formatter';
import { splitBilingualProductTitle } from './productQuickInfo';
import { SmartImage } from '@/core/ui/SmartImage';

interface MobileAppSecondaryTabsProps {
  sections: Section[];
  renderSection: (section: Section | undefined) => React.ReactNode;
}

/**
 * Secondary mobile app-shell views (Catalog, Authenticity Lab, Skin Routine)
 * loaded dynamically only when switching away from the Home tab to keep Cold JS slim.
 */
export function MobileAppSecondaryTabs({
  sections,
  renderSection,
}: MobileAppSecondaryTabsProps) {
  const sf = useStorefront();
  const {
    products = [],
    currency,
    cart,
    whatsapp,
    mobileTab = 'home',
    setMobileTab,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    availableTags,
    palette,
  } = sf;

  const isLight = palette?.isLight ?? false;
  const [catalogSearch, setCatalogSearch] = useState('');

  const authSection = sections.find(
    (s) => s.type === 'block' && s.props?.blockKey === 'authenticity-compare'
  );
  const routineSection = sections.find(
    (s) => s.type === 'block' && s.props?.blockKey === 'skin-routine'
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && activeCategory !== 'all') {
        const matchedCat = sf.categories?.find(
          (c) =>
            c.id === activeCategory ||
            c.title === activeCategory ||
            c.href === `#${activeCategory}`
        );
        const targetSlug =
          matchedCat?.href?.replace(/^#/, '') || matchedCat?.id || activeCategory;
        if (
          p.categorySlug !== activeCategory &&
          p.categorySlug !== targetSlug &&
          p.id !== activeCategory
        ) {
          return false;
        }
      }
      if (activeTag && (!p.tags || !p.tags.includes(activeTag))) {
        return false;
      }
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        const matchCat = p.categorySlug?.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchCat) return false;
      }
      return true;
    });
  }, [products, activeCategory, activeTag, catalogSearch, sf.categories]);

  const surfaceColor = isLight ? palette.surfaceHex || '#FFFFFF' : '#0E0E12';
  const borderColor = isLight ? palette.borderHex || '#E8E2D8' : 'rgba(255, 255, 255, 0.08)';
  const textColor = isLight ? palette.textHex || '#1C1917' : '#F4EFE6';
  const mutedColor = isLight ? palette.mutedHex || '#78716C' : '#9A968E';
  const accentColor = isLight ? palette.accentHex || '#8C5E3C' : '#C9A84C';

  if (mobileTab === 'catalog') {
    return (
      <div className="flex flex-col w-full space-y-3 pb-6 animate-fadeIn">
        <div
          className="sticky top-14 z-20 px-3 py-2.5 border-b backdrop-blur-md space-y-2.5"
          style={{
            backgroundColor: isLight ? `${palette.background}F2` : '#070709F2',
            borderColor,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-sm font-serif font-bold" style={{ color: textColor }}>
                كتالوج المستحضرات المعتمدة
              </h1>
            </div>
            <span
              className="text-xs font-sans px-2.5 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {filteredProducts.length} مستحضرات
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1 rounded-xl border"
            style={{
              backgroundColor: surfaceColor,
              borderColor,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={mutedColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="ابحثي باسم المنتج أو المادة الفعالة..."
              className="w-full min-h-[40px] bg-transparent text-xs font-sans outline-hidden border-none"
              style={{ color: textColor }}
            />
            {catalogSearch && (
              <button
                type="button"
                onClick={() => setCatalogSearch('')}
                className="min-w-[40px] min-h-[40px] text-sm text-muted-dim hover:text-white flex items-center justify-center"
                aria-label="مسح البحث"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setActiveCategory?.('all')}
              className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans transition shrink-0 flex items-center ${
                activeCategory === 'all' || !activeCategory ? 'font-bold shadow-xs' : 'opacity-75'
              }`}
              style={{
                backgroundColor: activeCategory === 'all' || !activeCategory ? accentColor : `${accentColor}15`,
                color: activeCategory === 'all' || !activeCategory ? (isLight ? '#FFFFFF' : '#070709') : textColor,
              }}
            >
              كافة الأقسام
            </button>
            {sf.categories?.map((cat) => {
              const isSelected = activeCategory === cat.id || activeCategory === cat.title;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory?.(cat.id)}
                  className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans transition shrink-0 flex items-center ${
                    isSelected ? 'font-bold shadow-xs' : 'opacity-75'
                  }`}
                  style={{
                    backgroundColor: isSelected ? accentColor : `${accentColor}15`,
                    color: isSelected ? (isLight ? '#FFFFFF' : '#070709') : textColor,
                  }}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {availableTags && availableTags.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {availableTags.map(({ tag, count }) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag?.(isSelected ? null : tag)}
                    className={`min-h-[40px] px-3 rounded-lg text-xs font-sans transition shrink-0 flex items-center ${
                      isSelected ? 'font-bold shadow-xs' : 'opacity-75'
                    }`}
                    style={{
                      backgroundColor: isSelected ? accentColor : `${accentColor}10`,
                      color: isSelected ? (isLight ? '#FFFFFF' : '#070709') : textColor,
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-3">
          {filteredProducts.length === 0 ? (
            <div
              className="py-12 px-4 text-center rounded-2xl border"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <p className="text-xs font-sans" style={{ color: mutedColor }}>
                لا توجد مستحضرات تطابق بحثكِ حالياً.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCatalogSearch('');
                  setActiveCategory?.('all');
                  setActiveTag?.(null);
                }}
                className="mt-3 min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold"
                style={{ backgroundColor: accentColor, color: isLight ? '#FFFFFF' : '#070709' }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map((product) => {
                const price = product.prices[currency] || product.prices.YER || 0;
                const formattedPrice = formatCurrency(price, currency);
                const { arTitle } = splitBilingualProductTitle(product.title);
                const cleanBadge = (product.badge || '')
                  .replace(/^أصلي\s*100%\s*[·\-—]?\s*/i, '')
                  .trim();

                return (
                  <div
                    key={`cat-grid-${product.id}`}
                    data-product-card
                    className="rounded-2xl p-2.5 flex flex-col justify-between shadow-md border"
                    style={{ backgroundColor: surfaceColor, borderColor }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold" style={{ color: accentColor }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                          <span>موثق</span>
                        </span>
                        {cleanBadge && cleanBadge !== 'أصلي 100%' && (
                          <span
                            className="text-xs font-sans font-semibold truncate max-w-[90px]"
                            style={{ color: mutedColor }}
                          >
                            {cleanBadge}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/product/${product.id}`}
                        className="block aspect-square w-full rounded-xl overflow-hidden relative bg-gradient-to-b from-[#EDE7DD] to-[#D8D0C3]"
                      >
                        <SmartImage
                          src={product.image}
                          alt={arTitle}
                          priority={false}
                          sizes="180px"
                          className="object-cover object-center brightness-95"
                        />
                      </Link>

                      <div className="mt-2 space-y-1">
                        <span className="text-xs font-sans font-medium block truncate" style={{ color: accentColor }}>
                          {product.brand}
                        </span>
                        <Link href={`/product/${product.id}`} className="min-h-[40px] flex items-center">
                          <h3
                            data-product-title
                            className="text-xs font-serif font-bold line-clamp-2 leading-snug"
                            style={{ color: textColor }}
                          >
                            {arTitle}
                          </h3>
                        </Link>
                        <div className="pt-0.5">
                          <span className="text-xs font-sans font-bold tabular-nums block" style={{ color: textColor }}>
                            {formattedPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-1.5" style={{ borderColor }}>
                      <button
                        type="button"
                        onClick={() => cart.add(product)}
                        className="w-full min-h-[44px] py-1.5 rounded-xl font-sans font-bold text-xs transition flex items-center justify-center gap-1 shadow-xs"
                        style={{
                          backgroundColor: accentColor,
                          color: isLight ? '#FFFFFF' : '#070709',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        <span>السلة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => window.open(whatsapp.productUrl(product), '_blank')}
                        className="w-full min-h-[44px] py-1.5 rounded-xl border font-sans font-bold text-xs transition flex items-center justify-center gap-1 text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30"
                        title="طلب عبر واتساب"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                        </svg>
                        <span>واتساب</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mobileTab === 'authenticity') {
    return (
      <div className="flex flex-col w-full space-y-4 px-3 py-3 pb-6 animate-fadeIn">
        <div
          className="p-4 rounded-2xl border space-y-3 shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-base font-serif font-bold" style={{ color: textColor }}>
                مختبر الأصالة وكشف المقلد
              </h1>
            </div>
            <Link
              href="/authenticity-hub"
              className="min-h-[40px] inline-flex items-center text-xs font-sans font-bold underline"
              style={{ color: accentColor }}
            >
              الموسوعة كاملة ←
            </Link>
          </div>
          <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
            افحصي أي مستحضر لمعرفة علامات العبوة الأصلية وكشف المنتجات المغشوشة المنتشرة في السوق اليمني.
          </p>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border" style={{ borderColor }}>
            <button
              type="button"
              className="min-h-[40px] py-1.5 rounded-lg text-xs font-sans font-bold transition shadow-xs"
              style={{
                backgroundColor: accentColor,
                color: isLight ? '#FFFFFF' : '#070709',
              }}
            >
              فحص وكشف المقلد
            </button>
            <button
              type="button"
              onClick={() => setMobileTab?.('routine')}
              className="min-h-[40px] py-1.5 rounded-lg text-xs font-sans transition opacity-75 hover:opacity-100"
              style={{ color: textColor }}
            >
              مستشار روتينكِ
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor }}>
          {renderSection(authSection)}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/authenticity-hub"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold shadow-sm transition"
            style={{
              backgroundColor: accentColor,
              color: isLight ? '#FFFFFF' : '#070709',
            }}
          >
            <span>فتح موسوعة كشف المقلد الكاملة والمقالات التوثيقية</span>
            <span className="rtl:-scale-x-100">←</span>
          </Link>
        </div>
      </div>
    );
  }

  if (mobileTab === 'routine') {
    return (
      <div className="flex flex-col w-full space-y-4 px-3 py-3 pb-6 animate-fadeIn">
        <div
          className="p-4 rounded-2xl border space-y-3 shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-base font-serif font-bold" style={{ color: textColor }}>
                مستشار روتين العناية والعيادة
              </h1>
            </div>
            <Link
              href="/bookings"
              className="min-h-[40px] inline-flex items-center text-xs font-sans font-bold underline"
              style={{ color: accentColor }}
            >
              حجز موعد ←
            </Link>
          </div>
          <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
            حددي نوع بشرتكِ لتصميم روتين علاجي متكامل (صباحي / مسائي) ملائم لمناخ وطقس اليمن الجاف والحراري.
          </p>

          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border" style={{ borderColor }}>
            <button
              type="button"
              onClick={() => setMobileTab?.('authenticity')}
              className="min-h-[40px] py-1.5 rounded-lg text-xs font-sans transition opacity-75 hover:opacity-100"
              style={{ color: textColor }}
            >
              فحص وكشف المقلد
            </button>
            <button
              type="button"
              className="min-h-[40px] py-1.5 rounded-lg text-xs font-sans font-bold transition shadow-xs"
              style={{
                backgroundColor: accentColor,
                color: isLight ? '#FFFFFF' : '#070709',
              }}
            >
              مستشار روتينكِ
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor }}>
          {renderSection(routineSection)}
        </div>

        <div
          className="p-4 rounded-2xl border space-y-3 shadow-sm text-start"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="space-y-1">
            <span className="text-xs font-sans font-bold block" style={{ color: accentColor }}>
              استشارة حضورية مجانية مع خبيراتنا
            </span>
            <h3 className="text-sm font-serif font-bold" style={{ color: textColor }}>
              جلسة تقييم شاملة لبشرتكِ في فرع صنعاء (حدة)
            </h3>
            <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
              احجزي موعدكِ الآن لفحص حاجز البشرة بجهاز الديرماسكوب مجاناً مع كل طلب.
            </p>
          </div>

          <Link
            href="/bookings"
            className="w-full min-h-[44px] py-2.5 rounded-xl text-xs font-sans font-bold text-center flex items-center justify-center gap-1.5 transition shadow-xs"
            style={{
              backgroundColor: accentColor,
              color: isLight ? '#FFFFFF' : '#070709',
            }}
          >
            <span>اختيار الموعد والفرع في صفحة الحجوزات</span>
            <span className="rtl:-scale-x-100">←</span>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

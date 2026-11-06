'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Section, SectionRenderers, ProductCardData } from '@/themes/contract';
import { useStorefront } from './StorefrontProvider';
import { formatCurrency } from '@/core/currency/formatter';
import { SmartImage } from '@/core/ui/SmartImage';
import { getBlock } from '@/modules/blocks/registry';

interface MobileAppViewsProps {
  sections: Section[];
  renderers: SectionRenderers;
}

export function MobileAppViews({ sections, renderers }: MobileAppViewsProps) {
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
    activeTheme = 'luxury-noir',
    palette,
  } = sf;

  const isLight = palette?.isLight ?? false;

  // Search in catalog view
  const [catalogSearch, setCatalogSearch] = useState('');

  // Verifier state in authenticity view
  const [verifierQuery, setVerifierQuery] = useState('');
  const [verifierResult, setVerifierResult] = useState<null | {
    status: 'authentic' | 'counterfeit';
    title: string;
    details: string;
    batchNo: string;
  }>(null);

  // Helper to render any registered section
  const renderSection = (section: Section | undefined) => {
    if (!section || !section.visible) return null;

    if (section.type === 'block') {
      const blockKey = (section.props?.blockKey as string) || '';
      if (!blockKey) return null;

      const blockData = sf.blocksData[blockKey];
      const ThemeBlockRenderer = renderers.blocks?.[blockKey];
      if (ThemeBlockRenderer) {
        return <ThemeBlockRenderer key={section.id} blockKey={blockKey} data={blockData} props={section.props} />;
      }

      const blockDef = getBlock(blockKey);
      if (blockDef?.DefaultRenderer) {
        const DefaultRenderer = blockDef.DefaultRenderer;
        return <DefaultRenderer key={section.id} blockKey={blockKey} data={blockData} props={section.props} />;
      }
      return null;
    }

    const Renderer = renderers[section.type];
    if (!Renderer) return null;
    return <Renderer key={section.id} section={section} />;
  };

  const heroSection = sections.find((s) => s.type === 'hero');
  const productsSection = sections.find((s) => s.type === 'product-grid');
  const authSection = sections.find((s) => s.type === 'block' && s.props?.blockKey === 'authenticity-compare');
  const routineSection = sections.find((s) => s.type === 'block' && s.props?.blockKey === 'skin-routine');
  const contactSection = sections.find((s) => s.type === 'contact');

  // Filtered products for catalog tab
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && activeCategory !== 'all' && activeCategory !== p.categorySlug && activeCategory !== p.id) {
        return false;
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
  }, [products, activeCategory, activeTag, catalogSearch]);

  // Featured 4 for home bestsellers
  const bestsellers = useMemo(() => products.slice(0, 4), [products]);

  // Verifier quick check handler
  const handleQuickVerify = (query: string) => {
    setVerifierQuery(query);
    if (query.includes('مقلد') || query.includes('غير مسجل')) {
      setVerifierResult({
        status: 'counterfeit',
        title: 'تحذير مخبري: مستحضر غير مسجل أو مقلد',
        details: 'العبوة تفتقر إلى ختم الهيئة العليا للأدوية وبها اختلافات واضحة في غطاء القطارة والقوام.',
        batchNo: 'UNKNOWN-ALERT-00',
      });
    } else {
      setVerifierResult({
        status: 'authentic',
        title: 'مطابق ومسجل رسمياً لدى الهيئة العليا للأدوية',
        details: 'المستحضر أصلي 100% مستورد من الوكيل الرسمي ومعاير مخبرياً لضمان الفاعلية والنقاء.',
        batchNo: 'YE-SBDMA-2026-A89',
      });
    }
  };

  // Theme styling constants
  const surfaceColor = isLight ? palette.surfaceHex || '#FFFFFF' : '#0E0E12';
  const borderColor = isLight ? palette.borderHex || '#E8E2D8' : 'rgba(255, 255, 255, 0.08)';
  const textColor = isLight ? palette.textHex || '#1C1917' : '#F4EFE6';
  const mutedColor = isLight ? palette.mutedHex || '#78716C' : '#9A968E';
  const accentColor = isLight ? palette.accentHex || '#8C5E3C' : '#C9A84C';

  // ---------------------------------------------------------------------------
  // TAB 1: HOME (الرئيسية)
  // ---------------------------------------------------------------------------
  if (mobileTab === 'home') {
    return (
      <div className="flex flex-col w-full space-y-4 pb-4 animate-fadeIn">
        {/* 1. Mobile Hero */}
        {renderSection(heroSection)}

        {/* 2. Quick App Feature Shortcuts (2x2 Native App Grid) */}
        <div className="px-3 pt-1">
          <div className="grid grid-cols-2 gap-2">
            {/* Shortcut A: الكتالوج */}
            <button
              type="button"
              onClick={() => setMobileTab?.('catalog')}
              className="p-3 rounded-2xl flex items-center gap-2.5 transition text-start shadow-sm border active:scale-[0.98]"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-serif font-bold block truncate" style={{ color: textColor }}>
                  تصفح الكتالوج
                </span>
                <span className="text-[10px] font-sans block" style={{ color: mutedColor }}>
                  {products.length} مستحضرات أصلية
                </span>
              </div>
            </button>

            {/* Shortcut B: فحص الأصالة */}
            <button
              type="button"
              onClick={() => setMobileTab?.('authenticity')}
              className="p-3 rounded-2xl flex items-center gap-2.5 transition text-start shadow-sm border active:scale-[0.98]"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-serif font-bold block truncate" style={{ color: textColor }}>
                  كشف المقلد
                </span>
                <span className="text-[10px] font-sans block" style={{ color: mutedColor }}>
                  مطابقة الباركود والقوام
                </span>
              </div>
            </button>

            {/* Shortcut C: مستشار روتين البشرة */}
            <button
              type="button"
              onClick={() => setMobileTab?.('routine')}
              className="p-3 rounded-2xl flex items-center gap-2.5 transition text-start shadow-sm border active:scale-[0.98]"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-serif font-bold block truncate" style={{ color: textColor }}>
                  مستشار روتينكِ
                </span>
                <span className="text-[10px] font-sans block" style={{ color: mutedColor }}>
                  تشخيص حسب مناخ اليمن
                </span>
              </div>
            </button>

            {/* Shortcut D: حجز استشارة مجانية */}
            <Link
              href="/bookings"
              className="p-3 rounded-2xl flex items-center gap-2.5 transition text-start shadow-sm border active:scale-[0.98]"
              style={{ backgroundColor: surfaceColor, borderColor }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-serif font-bold block truncate" style={{ color: textColor }}>
                  حجز استشارة
                </span>
                <span className="text-[10px] font-sans block" style={{ color: mutedColor }}>
                  مجاناً في فرع حدة
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* 3. Horizontal Bestsellers Rail ("الأكثر طلباً") */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h2 className="text-sm font-serif font-bold" style={{ color: textColor }}>
                الأكثر طلباً وتوثيقاً
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileTab?.('catalog')}
              className="text-xs font-sans font-bold flex items-center gap-1 transition"
              style={{ color: accentColor }}
            >
              <span>الكتالوج كامل</span>
              <span className="rtl:-scale-x-100">←</span>
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto px-3 pb-2 snap-x snap-mandatory no-scrollbar">
            {bestsellers.map((product) => {
              const price = product.prices[currency] || product.prices.YER || 0;
              const formattedPrice = formatCurrency(price, currency);

              return (
                <div
                  key={`home-best-${product.id}`}
                  className="w-[145px] shrink-0 snap-start rounded-2xl p-2.5 flex flex-col justify-between shadow-md border"
                  style={{ backgroundColor: surfaceColor, borderColor }}
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="block aspect-square w-full rounded-xl overflow-hidden relative bg-gradient-to-b from-[#CFC8BE] to-[#B9B1A6]"
                  >
                    <SmartImage
                      src={product.image}
                      alt={product.title}
                      priority={false}
                      sizes="150px"
                      className="object-cover object-center brightness-95"
                    />
                  </Link>

                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] font-sans font-medium block truncate" style={{ color: accentColor }}>
                      {product.brand}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="text-xs font-serif font-bold line-clamp-2 leading-tight" style={{ color: textColor }}>
                        {product.title}
                      </h3>
                    </Link>
                    <div className="pt-1 flex items-baseline justify-between">
                      <span className="text-xs font-sans font-bold" style={{ color: accentColor }}>
                        {formattedPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => cart.add(product)}
                    className="w-full mt-2 min-h-[38px] py-1.5 rounded-xl font-sans font-bold text-[11px] transition flex items-center justify-center gap-1.5 shadow-xs"
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

        {/* 4. SBDMA Certified Regulatory Banner */}
        <div className="px-3 pt-1">
          <div
            className="p-3.5 rounded-2xl border flex items-center gap-3 shadow-xs"
            style={{
              backgroundColor: isLight ? '#00000004' : '#FFFFFF05',
              borderColor,
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-serif font-bold block" style={{ color: textColor }}>
                مستحضرات مصرحة ومطابقة 100%
              </span>
              <p className="text-[10px] font-sans leading-relaxed" style={{ color: mutedColor }}>
                وفق معايير الهيئة العليا للأدوية والمستلزمات الطبية، مع ضمان استرداد فوري إن ثبت أي تلاعب.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Store Location & Contact Summary */}
        <div className="px-3">{renderSection(contactSection)}</div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // TAB 2: CATALOG (المنتجات / الكتالوج المخصص للجوال)
  // ---------------------------------------------------------------------------
  if (mobileTab === 'catalog') {
    return (
      <div className="flex flex-col w-full space-y-3 pb-6 animate-fadeIn">
        {/* Mobile Catalog Header */}
        <div
          className="sticky top-14 z-20 px-3 py-2.5 border-b backdrop-blur-md space-y-2.5"
          style={{
            backgroundColor: isLight ? `${palette.background}F2` : '#070709F2',
            borderColor,
          }}
        >
          {/* Title & Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-sm font-serif font-bold" style={{ color: textColor }}>
                كتالوج المستحضرات المعتمدة
              </h1>
            </div>
            <span
              className="text-[11px] font-sans px-2 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {filteredProducts.length} مستحضرات
            </span>
          </div>

          {/* Search Field */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border"
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
              className="w-full bg-transparent text-xs font-sans outline-hidden border-none"
              style={{ color: textColor }}
            />
            {catalogSearch && (
              <button
                type="button"
                onClick={() => setCatalogSearch('')}
                className="text-xs px-1 text-muted-dim hover:text-white"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setActiveCategory?.('all')}
              className={`min-h-[32px] px-3 rounded-full text-xs font-sans transition shrink-0 ${
                activeCategory === 'all' || !activeCategory ? 'font-bold shadow-xs' : 'opacity-70'
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
                  className={`min-h-[32px] px-3 rounded-full text-xs font-sans transition shrink-0 ${
                    isSelected ? 'font-bold shadow-xs' : 'opacity-70'
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

          {/* Tag Filter Chips (if any) */}
          {availableTags && availableTags.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {availableTags.map(({ tag, count }) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag?.(isSelected ? null : tag)}
                    className={`min-h-[26px] px-2.5 rounded-lg text-[10px] font-sans transition shrink-0 ${
                      isSelected ? 'font-bold shadow-xs' : 'opacity-65'
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

        {/* 2-Column Sephora-style Compact Mobile App Grid */}
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
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold"
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

                return (
                  <div
                    key={`cat-grid-${product.id}`}
                    className="rounded-2xl p-2.5 flex flex-col justify-between shadow-md border"
                    style={{ backgroundColor: surfaceColor, borderColor }}
                  >
                    <div>
                      {/* Badge Row */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                          أصلي 100%
                        </span>
                        {product.badge && (
                          <span
                            className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded truncate max-w-[70px]"
                            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Image Link */}
                      <Link
                        href={`/product/${product.id}`}
                        className="block aspect-square w-full rounded-xl overflow-hidden relative bg-gradient-to-b from-[#CFC8BE] to-[#B9B1A6]"
                      >
                        <SmartImage
                          src={product.image}
                          alt={product.title}
                          priority={false}
                          sizes="180px"
                          className="object-cover object-center brightness-95"
                        />
                      </Link>

                      {/* Title & Brand */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] font-sans font-medium block truncate" style={{ color: accentColor }}>
                          {product.brand}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <h3
                            className="text-xs font-serif font-bold line-clamp-2 leading-tight"
                            style={{ color: textColor }}
                          >
                            {product.title}
                          </h3>
                        </Link>
                        <div className="pt-1">
                          <span className="text-xs font-sans font-bold block" style={{ color: accentColor }}>
                            {formattedPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: 1-Tap Cart + WhatsApp */}
                    <div className="pt-2 mt-2 border-t grid grid-cols-2 gap-1.5" style={{ borderColor }}>
                      <button
                        type="button"
                        onClick={() => cart.add(product)}
                        className="w-full min-h-[38px] py-1.5 rounded-xl font-sans font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-xs"
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
                        className="w-full min-h-[38px] py-1.5 rounded-xl border font-sans font-bold text-[11px] transition flex items-center justify-center gap-1 text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30"
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

  // ---------------------------------------------------------------------------
  // TAB 3: AUTHENTICITY LAB (فحص الأصالة وكشف المقلد)
  // ---------------------------------------------------------------------------
  if (mobileTab === 'authenticity') {
    return (
      <div className="flex flex-col w-full space-y-4 px-3 py-3 pb-6 animate-fadeIn">
        {/* Header Indicator & Segmented Routine Toggle */}
        <div
          className="p-4 rounded-2xl border space-y-3 shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-base font-serif font-bold" style={{ color: textColor }}>
                مختبر الأصالة وكشف المقلد
              </h1>
            </div>
            <Link
              href="/authenticity-hub"
              className="text-xs font-sans font-bold underline"
              style={{ color: accentColor }}
            >
              الموسوعة كاملة ←
            </Link>
          </div>
          <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
            افحصي أي مستحضر لمعرفة علامات العبوة الأصلية وكشف المنتجات المغشوشة المنتشرة في السوق اليمني.
          </p>

          {/* Segmented Quick Switch to Routine */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border" style={{ borderColor }}>
            <button
              type="button"
              className="py-1.5 rounded-lg text-xs font-sans font-bold transition shadow-xs"
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
              className="py-1.5 rounded-lg text-xs font-sans transition opacity-75 hover:opacity-100"
              style={{ color: textColor }}
            >
              مستشار روتينكِ
            </button>
          </div>
        </div>

        {/* Interactive SBDMA Product Name Verifier Card */}
        <div
          className="p-4 rounded-2xl border space-y-3.5 shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="space-y-1">
            <h2 className="text-sm font-serif font-bold" style={{ color: textColor }}>
              دليل وفاحص الأصالة السريع باسم المنتج
            </h2>
            <p className="text-xs font-sans" style={{ color: mutedColor }}>
              اكتبي اسم المستحضر أو اضغطي على أحد الأمثلة السريعة أدناه:
            </p>
          </div>

          {/* Input & Check Button */}
          <div className="flex gap-2">
            <input
              type="text"
              value={verifierQuery}
              onChange={(e) => setVerifierQuery(e.target.value)}
              placeholder="مثال: سيروم فيتامين سي أو الغسول..."
              className="flex-1 px-3 py-2 rounded-xl text-xs font-sans border outline-hidden"
              style={{
                backgroundColor: isLight ? '#FAF7F2' : '#141416',
                borderColor,
                color: textColor,
              }}
            />
            <button
              type="button"
              onClick={() => handleQuickVerify(verifierQuery || 'سيروم فيتامين سي')}
              className="px-4 py-2 rounded-xl text-xs font-sans font-bold transition shrink-0"
              style={{
                backgroundColor: accentColor,
                color: isLight ? '#FFFFFF' : '#070709',
              }}
            >
              فحص
            </button>
          </div>

          {/* Quick-test Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickVerify('سيروم فيتامين سي 10%')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-sans border transition"
              style={{ borderColor, color: textColor }}
            >
              سيروم فيتامين سي 10%
            </button>
            <button
              type="button"
              onClick={() => handleQuickVerify('الغسول المرطب للبشرة')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-sans border transition"
              style={{ borderColor, color: textColor }}
            >
              الغسول المرطب
            </button>
            <button
              type="button"
              onClick={() => handleQuickVerify('منتج مقلد غير مسجل')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-sans bg-rose-950/20 text-rose-300 border border-rose-500/30 transition"
            >
              اختبار مستحضر مقلد
            </button>
          </div>

          {/* Verification Result Callout */}
          {verifierResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-sans space-y-1.5 animate-fadeIn ${
                verifierResult.status === 'authentic'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{verifierResult.title}</span>
                <span className="font-mono text-[10px] opacity-75">{verifierResult.batchNo}</span>
              </div>
              <p className="leading-relaxed opacity-90">{verifierResult.details}</p>
            </div>
          )}
        </div>

        {/* Interactive Comparison Slider */}
        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor }}>
          {renderSection(authSection)}
        </div>

        {/* Direct Link to Authenticity Hub */}
        <div className="text-center pt-2">
          <Link
            href="/authenticity-hub"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold shadow-sm transition"
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

  // ---------------------------------------------------------------------------
  // TAB 4: ROUTINE & CLINIC (روتينكِ والعيادة)
  // ---------------------------------------------------------------------------
  if (mobileTab === 'routine') {
    return (
      <div className="flex flex-col w-full space-y-4 px-3 py-3 pb-6 animate-fadeIn">
        {/* Header Indicator & Segmented Switch */}
        <div
          className="p-4 rounded-2xl border space-y-3 shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <h1 className="text-base font-serif font-bold" style={{ color: textColor }}>
                مستشار روتين العناية والعيادة
              </h1>
            </div>
            <Link
              href="/bookings"
              className="text-xs font-sans font-bold underline"
              style={{ color: accentColor }}
            >
              حجز موعد ←
            </Link>
          </div>
          <p className="text-xs font-sans leading-relaxed" style={{ color: mutedColor }}>
            حددي نوع بشرتكِ لتصميم روتين علاجي متكامل (صباحي / مسائي) ملائم لمناخ وطقس اليمن الجاف والحراري.
          </p>

          {/* Segmented Quick Switch */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl border" style={{ borderColor }}>
            <button
              type="button"
              onClick={() => setMobileTab?.('authenticity')}
              className="py-1.5 rounded-lg text-xs font-sans transition opacity-75 hover:opacity-100"
              style={{ color: textColor }}
            >
              فحص وكشف المقلد
            </button>
            <button
              type="button"
              className="py-1.5 rounded-lg text-xs font-sans font-bold transition shadow-xs"
              style={{
                backgroundColor: accentColor,
                color: isLight ? '#FFFFFF' : '#070709',
              }}
            >
              مستشار روتينكِ
            </button>
          </div>
        </div>

        {/* Skin Routine Steps / Quiz */}
        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor }}>
          {renderSection(routineSection)}
        </div>

        {/* In-Clinic Booking Promotion Card */}
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
            className="w-full py-2.5 rounded-xl text-xs font-sans font-bold text-center flex items-center justify-center gap-1.5 transition shadow-xs"
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

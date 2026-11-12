'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { ProductCardData, ThemeCurrencyCode, SectionComponentProps } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import {
  WhatsAppIcon,
  BagCartIcon,
  ShieldCheckIcon,
  DeliveryVanIcon,
  ConciergeHeadsetIcon,
} from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { matchesProductCategory, splitBilingualProductTitle, getProductQuickInfo } from '@/core/storefront/productQuickInfo';

interface ProductShowcaseProps extends Partial<SectionComponentProps> {
  products?: ProductCardData[];
  currentCurrency?: ThemeCurrencyCode;
  onAddToCart?: (product: ProductCardData, variantId?: string) => void;
  onDirectWhatsApp?: (product: ProductCardData) => void;
  activeFilter?: string;
}

export function ProductShowcase(props: ProductShowcaseProps) {
  const sf = useStorefront();

  const products = props.products || sf.products || [];
  const currentCurrency = props.currentCurrency || sf.currency;
  const onAddToCart = props.onAddToCart || sf.cart.add;
  const onDirectWhatsApp =
    props.onDirectWhatsApp ||
    ((p: ProductCardData) => {
      window.open(sf.whatsapp.productUrl(p), '_blank');
    });
  const activeFilter = props.activeFilter || sf.activeCategory;
  const { activeTag, setActiveTag, availableTags } = sf;

  const filteredProducts = products.filter((p) => {
    if (!matchesProductCategory(p, activeFilter, sf.categories)) {
      return false;
    }
    if (activeTag && (!p.tags || !p.tags.includes(activeTag))) {
      return false;
    }
    return true;
  });

  const featuredProducts = products.slice(0, 4);
  const flagship = featuredProducts[0];
  const secondarySpotlights = featuredProducts.slice(1, 4);

  return (
    <section id="products-catalog" className="py-2 sm:py-10 lg:py-14 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 lg:space-y-14">
        {/* ==================================================================== */}
        {/* 1. Collector's Spotlight (Desktop Asymmetric, Tablet/Mobile Snap Rail) */}
        {/* ==================================================================== */}
        {featuredProducts.length > 0 && (
          <div className="space-y-2.5 sm:space-y-4">
            <div className="flex items-end justify-between px-1 border-b border-white/[0.06] pb-2 sm:pb-3">
              <div className="space-y-0.5">
                <span className="hidden sm:block text-xs font-sans text-gold font-semibold">
                  إصدار الدار المختار
                </span>
                <h2 className="text-sm sm:text-xl lg:text-2xl font-serif font-bold text-ivory">
                  الأكثر طلباً وتوثيقاً
                </h2>
              </div>
              <span className="text-xs text-champagne/80 font-sans lg:hidden">
                اسحبي للمزيد ←
              </span>
            </div>

            {/* Mobile & Tablet Horizontal Snap Rail */}
            <div className="flex lg:hidden gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1.5 no-scrollbar scroll-smooth">
              {featuredProducts.map((product) => {
                const info = getProductQuickInfo(product, currentCurrency);

                return (
                  <div
                    key={`rail-${product.id}`}
                    data-product-card
                    className="w-[144px] sm:w-[175px] shrink-0 snap-start rounded-2xl bg-[#0D0D12] border border-white/[0.08] hover:border-gold/40 transition-all p-2 sm:p-2.5 flex flex-col justify-between shadow-lg"
                  >
                    <Link
                      href={`/product/${product.id}`}
                      className="block w-full h-[90px] sm:h-[135px] rounded-xl overflow-hidden relative bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1]"
                    >
                      <SmartImage
                        src={product.image}
                        alt={info.arTitle}
                        priority={false}
                        sizes="180px"
                        className="object-cover object-center brightness-95 hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="mt-1.5 sm:mt-2">
                      <Link href={`/product/${product.id}`} className="min-h-[40px] flex items-center">
                        <h3
                          data-product-title
                          className="text-xs font-serif font-bold text-ivory line-clamp-2 leading-snug hover:text-champagne transition"
                        >
                          {info.arTitle}
                        </h3>
                      </Link>
                      <span className="text-xs font-sans font-bold text-champagne tabular-nums block mt-0.5 sm:mt-1">
                        {info.formattedPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="w-full mt-1.5 sm:mt-2 min-h-[44px] h-11 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                    >
                      <BagCartIcon size={14} color="#070709" />
                      <span>إضافة للسلة</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop Asymmetric Collector's Spotlight (Distinct geometry from catalog grid) */}
            {flagship && (
              <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-stretch">
                {/* Primary Flagship Monolith (5 cols) */}
                {(() => {
                  const flagInfo = getProductQuickInfo(flagship, currentCurrency);
                  return (
                    <div
                      data-product-card
                      className="lg:col-span-5 samiq-bezel-noir flex flex-col group"
                    >
                      <div className="samiq-bezel-noir-inner p-5 h-full flex flex-col justify-between gap-4 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-sans text-champagne">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                            <span>الاختيار الأول في صنعاء</span>
                          </span>
                          <span className="text-xs font-sans text-muted-lux">{flagship.brand}</span>
                        </div>

                        <Link
                          href={`/product/${flagship.id}`}
                          className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1] ring-1 ring-inset ring-black/10"
                        >
                          <SmartImage
                            src={flagship.image}
                            alt={flagInfo.arTitle}
                            priority={false}
                            sizes="460px"
                            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-architectural"
                          />
                        </Link>

                        <div className="space-y-2">
                          <Link href={`/product/${flagship.id}`} className="min-h-[44px] flex flex-col justify-center">
                            <h3
                              data-product-title
                              className="text-xl font-serif font-bold text-ivory group-hover:text-champagne transition leading-snug"
                            >
                              {flagInfo.arTitle}
                            </h3>
                            {flagInfo.enSubtitle && (
                              <span dir="ltr" className="text-xs font-mono text-muted-lux block mt-0.5 text-end">
                                {flagInfo.enSubtitle}
                              </span>
                            )}
                          </Link>
                          <p className="text-xs text-muted-lux font-sans leading-relaxed line-clamp-2">
                            {flagship.subtitle || flagship.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-sans font-bold text-champagne tabular-nums">
                              {flagInfo.formattedPrice}
                            </span>
                            {flagInfo.hasDiscount && flagInfo.formattedComparePrice && (
                              <span className="text-xs text-muted-dim line-through tabular-nums">
                                {flagInfo.formattedComparePrice}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onAddToCart(flagship)}
                            className="min-h-[44px] px-5 rounded-full bg-gradient-to-r from-[#BF953F] via-[#F2E2A8] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-105 active:scale-[0.98] transition flex items-center gap-2 shadow-gold-glow"
                          >
                            <BagCartIcon size={14} color="#070709" />
                            <span>إضافة للحقيبة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Right Signature Atelier Pairing Rows (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                  {secondarySpotlights.map((product) => {
                    const info = getProductQuickInfo(product, currentCurrency);
                    return (
                      <div
                        key={`desk-spot-${product.id}`}
                        data-product-card
                        className="flex-1 rounded-2xl bg-[#0D0D12] border border-white/[0.08] hover:border-gold/35 transition-all p-3.5 flex items-center gap-4 group"
                      >
                        <Link
                          href={`/product/${product.id}`}
                          className="w-[100px] h-[100px] rounded-xl overflow-hidden shrink-0 relative bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1]"
                        >
                          <SmartImage
                            src={product.image}
                            alt={info.arTitle}
                            priority={false}
                            sizes="120px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-sans text-gold">
                            <span>{product.brand}</span>
                            {info.concentration && (
                              <span className="text-muted-lux">· {info.concentration}</span>
                            )}
                          </div>
                          <Link href={`/product/${product.id}`} className="min-h-[40px] flex items-center">
                            <h3
                              data-product-title
                              className="text-sm font-serif font-bold text-ivory group-hover:text-champagne transition line-clamp-1"
                            >
                              {info.arTitle}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-lux font-sans line-clamp-1">
                            {info.enSubtitle || product.subtitle}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="text-sm font-sans font-bold text-champagne tabular-nums">
                            {info.formattedPrice}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(product)}
                            className="min-h-[44px] px-4 rounded-xl bg-white/[0.04] hover:bg-gold hover:text-obsidian-dark border border-white/10 hover:border-gold text-ivory font-sans font-bold text-xs transition flex items-center gap-1.5"
                          >
                            <BagCartIcon size={13} color="currentColor" />
                            <span>إضافة</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* 2. Restrained Luxury Product Catalog Grid                            */}
        {/* ==================================================================== */}
        <div className="space-y-5 pt-2">
          {/* Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-sans text-gold font-semibold block mb-1">
                المنتجات المعتمدة والمطابقة مخبرياً
              </span>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-serif font-bold text-ivory">
                كتالوج المنتجات الفاخرة
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
              توثيق الهيئة العليا للأدوية · توصيل فوري داخل صنعاء ({filteredProducts.length})
            </p>
          </div>

          {/* Interactive Tag Filter Bar (Kept above grid so cards stay clean & museum-grade) */}
          {availableTags.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`min-h-[40px] px-4 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
                  activeTag === null
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold shadow-sm'
                    : 'bg-white/[0.03] text-ivory/80 hover:bg-white/[0.08] hover:text-ivory border border-white/10'
                }`}
              >
                كافة الخصائص
              </button>
              {availableTags.map(({ tag, count }) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(isSelected ? null : tag)}
                    className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans transition-all shrink-0 inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gold/20 text-champagne border border-gold font-bold'
                        : 'bg-[#0E0E13] text-muted-lux hover:text-ivory border border-white/[0.07] hover:border-gold/30'
                    }`}
                  >
                    <span>{tag}</span>
                    <span className="text-xs opacity-65 tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Product Grid: 2 cols Mobile, 3 cols Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const info = getProductQuickInfo(product, currentCurrency);

              return (
                <div
                  key={product.id}
                  data-product-card
                  className="rounded-3xl bg-[#0D0D12] border border-white/[0.08] hover:border-gold/40 transition-all duration-300 ease-architectural p-3 sm:p-4 flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    {/* Quiet Provenance Line (Zero noisy box stack) */}
                    <div className="flex items-center justify-between gap-2 mb-2.5 text-xs font-sans">
                      <span className="inline-flex items-center gap-1.5 text-muted-lux">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        <span className="truncate">{product.brand}</span>
                      </span>
                      {product.badge && (
                        <span className="text-xs text-champagne font-semibold truncate">
                          {product.badge.replace(/^أصلي\s*100%\s*[·\-—]?\s*/i, '').trim() || 'أصلي موثق'}
                        </span>
                      )}
                    </div>

                    {/* Framed Studio Packshot Container */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block aspect-[4/3] sm:aspect-square w-full rounded-2xl relative overflow-hidden bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1] ring-1 ring-inset ring-black/10 min-h-[44px]"
                    >
                      <SmartImage
                        src={product.image}
                        alt={info.arTitle}
                        priority={false}
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-architectural"
                      />
                    </Link>

                    {/* Clean Split Typography: Arabic Name + Quiet English Subtitle */}
                    <div className="mt-3 space-y-1">
                      <Link href={`/product/${product.id}`} className="min-h-[40px] flex flex-col justify-center">
                        <h3
                          data-product-title
                          className="text-xs sm:text-base font-serif font-bold text-ivory line-clamp-2 group-hover:text-champagne transition leading-snug"
                        >
                          {info.arTitle}
                        </h3>
                        {info.enSubtitle && (
                          <span
                            dir="ltr"
                            className="hidden sm:block text-xs font-mono text-muted-lux truncate mt-0.5 text-end"
                          >
                            {info.enSubtitle}
                          </span>
                        )}
                      </Link>

                      {info.concentration && (
                        <p className="text-xs text-gold/85 font-sans">
                          التركيز النشط: {info.concentration}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2.5">
                    <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                      <span className="text-sm sm:text-lg font-sans font-bold text-champagne tabular-nums">
                        {info.formattedPrice}
                      </span>
                      <div className="flex items-center gap-2">
                        {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0 && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30">
                            حجز مسبق
                          </span>
                        )}
                        {info.hasDiscount && info.formattedComparePrice && (
                          <span className="text-xs text-muted-dim line-through tabular-nums">
                            {info.formattedComparePrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <BagCartIcon size={14} color="#070709" />
                        <span>
                          {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0
                            ? 'احجزي الآن'
                            : 'إضافة للسلة'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectWhatsApp(product)}
                        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/[0.03] hover:bg-[#25D366]/15 border border-white/10 hover:border-[#25D366]/40 text-[#25D366] transition flex items-center justify-center shrink-0"
                        title="استفسار أو طلب عبر واتساب"
                        aria-label={`طلب ${info.arTitle} عبر واتساب`}
                      >
                        <WhatsAppIcon size={16} color="#25D366" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. Architectural Trust Strip Under Products Grid                     */}
        {/* ==================================================================== */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-s divide-white/[0.07] rounded-2xl bg-[#0D0D12] border border-white/[0.08]">
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                <ShieldCheckIcon size={20} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory">
                  ضمان الأصالة 100%
                </h4>
                <p className="text-xs text-muted-lux font-sans leading-relaxed">
                  معاينة الختم والباركود وضمان الأصالة قبل الاستلام
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                <DeliveryVanIcon size={20} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory">
                  توصيل فوري وشحن مبرد
                </h4>
                <p className="text-xs text-muted-lux font-sans leading-relaxed">
                  توصيل سريع بصنعاء وشحن آمن لكافة المحافظات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                <ConciergeHeadsetIcon size={20} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory">
                  استشارة تجميلية مباشرة
                </h4>
                <p className="text-xs text-muted-lux font-sans leading-relaxed">
                  خبيراتنا متاحات لمساعدتك في مطابقة بشرتك عبر واتساب
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

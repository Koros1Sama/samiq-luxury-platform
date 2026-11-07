'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { ProductCardData, ThemeCurrencyCode, SectionComponentProps } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import {
  VerifiedCheckIcon,
  WhatsAppIcon,
  BagCartIcon,
  ShieldCheckIcon,
  DeliveryVanIcon,
  ConciergeHeadsetIcon,
} from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { matchesProductCategory } from '@/core/storefront/productQuickInfo';

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

  // Featured snap rail products ("الأكثر طلباً")
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="products-catalog" className="py-2.5 sm:py-6 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        {/* ==================================================================== */}
        {/* 4. "الأكثر طلباً" Horizontal Snap Rail (Visible in First Screen)      */}
        {/* ==================================================================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <h2 className="text-sm sm:text-base lg:text-lg font-serif font-bold text-ivory">
                الأكثر طلباً
              </h2>
            </div>
            <span className="text-xs text-champagne/80 font-sans lg:hidden">
              اسحبي للمزيد ←
            </span>
          </div>

          {/* Horizontal Snap Rail on Mobile / 4-Col Grid on Desktop */}
          <div className="flex lg:grid lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 no-scrollbar scroll-smooth">
            {featuredProducts.map((product) => {
              const price = product.prices[currentCurrency] || product.prices.YER || 0;
              const formattedPrice = formatCurrency(price, currentCurrency);

              return (
                <div
                  key={`rail-${product.id}`}
                  data-product-card
                  className="w-[136px] sm:w-[165px] lg:w-auto shrink-0 snap-start rounded-2xl bg-[#0E0E12] border border-white/[0.08] hover:border-gold/40 transition-all p-2 flex flex-col justify-between shadow-lg"
                >
                  {/* Square Packshot on warm greige backdrop */}
                  <Link
                    href={`/product/${product.id}`}
                    className="block w-full h-[105px] sm:h-[120px] lg:h-[180px] rounded-xl overflow-hidden relative bg-gradient-to-b from-[#CFC8BE] to-[#B9B1A6]"
                  >
                    <SmartImage
                      src={product.image}
                      alt={product.title}
                      priority={false}
                      sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 300px"
                      className="object-cover object-center brightness-95 hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Product Title Link (min-h-[44px] interactive hit target) */}
                  <div className="mt-1.5">
                    <Link
                      href={`/product/${product.id}`}
                      className="min-h-[44px] flex items-center"
                    >
                      <h3
                        data-product-title
                        className="text-xs font-serif font-bold text-ivory line-clamp-2 leading-snug hover:text-champagne transition"
                      >
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Formatted Price Leaf Node */}
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs font-sans font-bold text-champagne">
                      {formattedPrice}
                    </span>
                    {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30">
                        حجز مسبق
                      </span>
                    )}
                  </div>

                  {/* 44px Add Button */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="w-full min-h-[44px] h-11 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <BagCartIcon size={14} color="#070709" />
                      <span>
                        {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0
                          ? 'احجز / استفسر'
                          : 'إضافة للسلة'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 5. Full 2-Column Product Grid                                        */}
        {/* ==================================================================== */}
        <div className="space-y-4 pt-2">
          {/* Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-sans text-gold font-semibold block mb-0.5">
                مفتاح الجمال — المنتجات المعتمدة
              </span>
              <h2 className="text-base sm:text-2xl font-serif font-bold text-ivory">
                كتالوج المنتجات الفاخرة
              </h2>
            </div>
            <p className="text-xs text-muted-lux font-sans leading-relaxed">
              مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية • توصيل فوري
            </p>
          </div>

          {/* Smart Multi-Tags Horizontal Scrollable Bar */}
          {availableTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
                  activeTag === null
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold shadow-sm'
                    : 'bg-white/5 text-ivory/80 hover:bg-white/10 hover:text-ivory border border-white/10'
                }`}
              >
                كل الوسوم
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
                        ? 'bg-gold/20 text-champagne border border-gold font-bold shadow-[0_0_10px_rgba(201,168,76,0.2)]'
                        : 'bg-[#15151B] text-muted-lux hover:text-ivory border border-white/5 hover:border-gold/30'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => {
              const price = product.prices[currentCurrency] || product.prices.YER || 0;
              const comparePrice = product.comparePrices ? product.comparePrices[currentCurrency] : undefined;
              const formattedPrice = formatCurrency(price, currentCurrency);
              const hasDiscount = Boolean(comparePrice && comparePrice > price && price > 0);
              const formattedComparePrice =
                hasDiscount && comparePrice ? formatCurrency(comparePrice, currentCurrency) : undefined;

              return (
                <div
                  key={product.id}
                  data-product-card
                  className="rounded-2xl sm:rounded-3xl bg-[#0E0E12] border border-white/[0.08] hover:border-gold/40 transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    {/* Top Verified Badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                        <VerifiedCheckIcon size={12} color="#34D399" />
                        <span className="truncate">أصلي موثق</span>
                      </span>
                      {product.badge && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded text-xs font-sans font-bold bg-gold/15 text-gold border border-gold/30 truncate">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Image Link (Square warm greige backdrop) */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block aspect-square w-full rounded-xl sm:rounded-2xl relative overflow-hidden bg-gradient-to-b from-[#CFC8BE] to-[#B9B1A6] group-hover:scale-[1.02] transition-transform duration-300 min-h-[44px]"
                    >
                      <SmartImage
                        src={product.image}
                        alt={product.title}
                        priority={false}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center brightness-95 group-hover:brightness-105 transition-all duration-500"
                      />
                    </Link>

                    {/* Brand & Title Link (min-h-[40px] interactive hit target) */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-sans text-gold font-semibold block truncate">
                          {product.brand}
                        </span>
                        {product.aiCategoryConfidence && (
                          <span className="text-xs font-sans font-medium text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                            {product.aiCategoryConfidence}% AI
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/product/${product.id}`}
                        className="min-h-[40px] flex items-center"
                      >
                        <h3
                          data-product-title
                          className="text-xs sm:text-sm font-serif font-bold text-ivory line-clamp-2 group-hover:text-champagne transition leading-snug"
                        >
                          {product.title}
                        </h3>
                      </Link>

                      {/* Clickable Micro-chips for up to 2 tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {product.tags.slice(0, 2).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTag(activeTag === t ? null : t);
                              }}
                              className={`min-h-[40px] px-2.5 rounded-lg text-xs font-sans transition-colors inline-flex items-center justify-center ${
                                activeTag === t
                                  ? 'bg-gold text-obsidian-dark font-bold'
                                  : 'bg-white/5 text-champagne/90 hover:bg-gold/20 hover:text-champagne border border-white/10'
                              }`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 mt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-baseline justify-between gap-1 flex-wrap">
                      <span className="text-xs sm:text-base font-sans font-bold text-champagne">
                        {formattedPrice}
                      </span>
                      {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30">
                          حجز مسبق
                        </span>
                      )}
                      {hasDiscount && formattedComparePrice && (
                        <span className="text-xs text-muted-dim line-through">
                          {formattedComparePrice}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons (All min 44x44 primary) */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="w-full min-h-[44px] py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <BagCartIcon size={14} color="#070709" />
                        <span>
                          {typeof product.stockQuantity === 'number' && product.stockQuantity <= 0
                            ? 'احجز / استفسر'
                            : 'السلة'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectWhatsApp(product)}
                        className="w-full min-h-[44px] py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-sans font-bold text-xs transition flex items-center justify-center gap-1"
                        title="طلب فوري عبر واتساب"
                      >
                        <WhatsAppIcon size={14} color="#25D366" />
                        <span>واتساب</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 6. Compact Trust Strip Under Products Grid                           */}
        {/* ==================================================================== */}
        <div className="pt-3 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 sm:p-5 rounded-2xl bg-[#0E0E12] border border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                <ShieldCheckIcon size={22} color="#C9A84C" />
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

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                <DeliveryVanIcon size={22} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory">
                  توصيل فوري وشحن آمن
                </h4>
                <p className="text-xs text-muted-lux font-sans leading-relaxed">
                  توصيل سريع بصنعاء وشحن لكافة المحافظات
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                <ConciergeHeadsetIcon size={22} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-ivory">
                  دعم واستشارات مباشرة
                </h4>
                <p className="text-xs text-muted-lux font-sans leading-relaxed">
                  مستشارون متخصصون لمساعدتك عبر واتساب 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

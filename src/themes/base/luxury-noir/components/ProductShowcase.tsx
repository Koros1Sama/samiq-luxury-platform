'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCardData, ThemeCurrencyCode } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import { VerifiedCheckIcon, WhatsAppIcon, BagCartIcon } from './LuxuryIcons';

interface ProductShowcaseProps {
  products: ProductCardData[];
  currentCurrency: ThemeCurrencyCode;
  onAddToCart: (product: ProductCardData, variantId?: string) => void;
  onDirectWhatsApp: (product: ProductCardData) => void;
  activeFilter?: string;
}

export function ProductShowcase({
  products,
  currentCurrency,
  onAddToCart,
  onDirectWhatsApp,
  activeFilter = 'all',
}: ProductShowcaseProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  const filteredProducts = products.filter((p) => {
    if (!activeFilter || activeFilter === 'all' || activeFilter === 'authenticity') return true;
    if (activeFilter === 'serums') return p.categorySlug === 'serums';
    if (activeFilter === 'cleansers') return p.categorySlug === 'cleansers';
    if (activeFilter === 'makeup') return p.categorySlug === 'makeup';
    if (activeFilter === 'cerave') return p.brand.toLowerCase().includes('cerave');
    if (activeFilter === 'the-ordinary') return p.brand.toLowerCase().includes('ordinary');
    return true;
  });

  return (
    <section id="products-catalog" className="py-8 sm:py-16 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-champagne text-[11px] font-sans font-semibold mb-1">
              <span>المستحضرات الأصلية المضمونة 100%</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory">
              كتالوج المنتجات الفاخرة — تسوقي فوراً
            </h2>
          </div>
          <span className="text-xs text-muted-lux font-sans">
            فحص الباركود ورقم التشغيلة قبل الدفع • توصيل فوري بصنعاء
          </span>
        </div>

        {/* 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => {
            const price = product.prices[currentCurrency] || product.prices.YER;
            const comparePrice = product.comparePrices?.[currentCurrency];
            const activeVariantId = selectedVariants[product.id] || product.variants?.[0]?.id;

            return (
              <div
                key={product.id}
                className="group p-1 sm:p-1.5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-gold/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="rounded-[calc(1rem-0.125rem)] sm:rounded-[calc(1.5rem-0.25rem)] bg-[#0E0E12] p-2.5 sm:p-4 flex flex-col justify-between h-full space-y-3">
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-sans font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                        <VerifiedCheckIcon size={10} color="#34D399" />
                        <span className="truncate">أصلي موثق</span>
                      </span>
                      {product.badge && (
                        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-bold bg-gold/15 text-gold border border-gold/30 truncate">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Image Link */}
                    <Link
                      href={`/product/${product.id}`}
                      className="block h-32 sm:h-44 w-full rounded-xl sm:rounded-2xl relative overflow-hidden bg-white/[0.02] group-hover:scale-[1.02] transition-transform duration-300"
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover object-center brightness-95 group-hover:brightness-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12]/80 via-transparent to-transparent opacity-50" />
                    </Link>

                    {/* Brand & Title */}
                    <div className="mt-2.5 space-y-1">
                      <span className="text-[10px] sm:text-xs font-sans text-gold font-semibold uppercase block truncate">
                        {product.brand}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-xs sm:text-sm font-serif font-bold text-ivory line-clamp-2 group-hover:text-champagne transition leading-snug">
                          {product.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Variant Selector (if any) */}
                    {product.variants && product.variants.length > 1 && (
                      <div className="mt-2 flex items-center gap-1 flex-wrap">
                        {product.variants.map((v) => {
                          const isVarSelected = activeVariantId === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handleVariantSelect(product.id, v.id)}
                              className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-sans border transition ${
                                isVarSelected
                                  ? 'bg-gold/20 border-gold text-champagne font-bold'
                                  : 'bg-white/5 border-white/10 text-ivory/60 hover:text-ivory'
                              }`}
                            >
                              {v.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-xs sm:text-base font-serif font-bold text-champagne">
                        {formatCurrency(price, currentCurrency)}
                      </span>
                      {comparePrice && (
                        <span className="text-[10px] sm:text-xs text-muted-dim line-through">
                          {formatCurrency(comparePrice, currentCurrency)}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, activeVariantId)}
                        className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-[10px] sm:text-xs hover:brightness-110 transition flex items-center justify-center gap-1 shadow-sm"
                      >
                        <BagCartIcon size={12} color="#070709" />
                        <span>السلة</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectWhatsApp(product)}
                        className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-sans font-bold text-[10px] sm:text-xs transition flex items-center justify-center gap-1"
                        title="طلب عبر واتساب"
                      >
                        <WhatsAppIcon size={12} color="#25D366" />
                        <span>واتساب</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

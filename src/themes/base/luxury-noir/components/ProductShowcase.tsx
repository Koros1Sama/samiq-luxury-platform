'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductCardData, ThemeCurrencyCode } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import { VerifiedCheckIcon, WhatsAppIcon, BagCartIcon } from './LuxuryIcons';

interface ProductShowcaseProps {
  products: ProductCardData[];
  currentCurrency: ThemeCurrencyCode;
  onAddToCart: (product: ProductCardData, variantId?: string) => void;
  onDirectWhatsApp: (product: ProductCardData) => void;
}

export function ProductShowcase({
  products,
  currentCurrency,
  onAddToCart,
  onDirectWhatsApp,
}: ProductShowcaseProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  return (
    <section id="featured-products" className="py-16 sm:py-24 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold mb-2">
              <span>معايير وكالات التجميل العالمية</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory">
              المختارات الأكثر طلباً في صنعاء
            </h2>
          </div>
          <span className="text-xs text-muted-lux font-sans">
            جميع المنتجات متوفرة بتسليم فوري ورقم دفعة موثق
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const price = product.prices[currentCurrency] || product.prices.YER;
            const comparePrice = product.comparePrices?.[currentCurrency];
            const activeVariantId = selectedVariants[product.id] || product.variants?.[0]?.id;

            return (
              <div
                key={product.id}
                className="group p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/[0.08] hover:border-gold/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#0E0E12] p-5 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between mb-3">
                      {product.isAuthenticGuaranteed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                          <VerifiedCheckIcon size={12} color="#34D399" />
                          <span>أصلي 100%</span>
                        </span>
                      ) : <span />}
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-gold/15 text-gold border border-gold/30">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Visual Area: Real High-Res Studio Cosmetic Photography */}
                    <div className="h-48 w-full rounded-2xl relative overflow-hidden bg-white/[0.02] group-hover:scale-[1.02] transition-transform duration-300">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover object-center brightness-95 group-hover:brightness-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12]/80 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Brand & Title */}
                    <div className="mt-4 space-y-1">
                      <span className="text-[11px] font-sans text-gold/80 font-semibold block">
                        {product.brand}
                      </span>
                      <h3 className="text-base font-serif font-bold text-ivory line-clamp-1 group-hover:text-champagne transition">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-xs text-muted-lux font-sans line-clamp-1">
                          {product.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Variant Selector (if any) */}
                    {product.variants && product.variants.length > 1 && (
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {product.variants.map((v) => {
                          const isVarSelected = activeVariantId === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => handleVariantSelect(product.id, v.id)}
                              className={`px-2 py-0.5 rounded text-[11px] font-sans border transition ${
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

                  {/* Price and Cart Buttons */}
                  <div className="mt-5 pt-3 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-serif font-bold text-ivory">
                          {formatCurrency(price, currentCurrency)}
                        </span>
                        {comparePrice && (
                          <span className="text-xs text-muted-lux line-through font-sans">
                            {formatCurrency(comparePrice, currentCurrency)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-sans">
                        متوفر بالمحل
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, activeVariantId)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-[0_2px_10px_rgba(201,168,76,0.3)] transition flex items-center justify-center gap-1.5"
                      >
                        <BagCartIcon size={14} color="#070709" />
                        <span>أضف للسلة</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectWhatsApp(product)}
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-emerald-950/60 hover:text-emerald-300 border border-white/10 text-ivory/80 font-sans font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <WhatsAppIcon size={14} color="currentColor" />
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

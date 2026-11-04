'use client';

import React from 'react';
import { ProductCardData } from '@/themes/contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { getProductQuickInfo } from '@/core/storefront/productQuickInfo';
import { SmartImage } from '@/core/ui/SmartImage';
import { BagIcon, ShieldCheckIcon, SparklesIcon, CheckIcon } from './ClinicIcons';

interface ClinicProductListProps {
  products: ProductCardData[];
}

export function ClinicProductList({ products }: ClinicProductListProps) {
  const { cart, currency } = useStorefront();

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 text-center bg-[#F2F7F5] rounded-xl border border-[#E2ECE9] p-6">
        <p className="text-base font-medium text-[#0F4C4A] leading-[1.75]">
          لا توجد منتجات مطابقة لهذا التصنيف حالياً.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {products.map((product) => {
        const info = getProductQuickInfo(product, currency);
        const inCartCount = cart.items.find((item) => item.productId === product.id)?.quantity || 0;

        // Active chips: concentration + first ingredient or clinical highlight
        const chip1 = info.concentration || (info.isAuthenticGuaranteed ? 'نقاء 100%' : 'تركيبة علاجية');
        const chip2 = info.ingredients?.[0] || info.badge || 'مختبر سريرياً';

        return (
          <div
            key={product.id}
            data-product-card
            className="w-full bg-white rounded-xl border border-[#E2ECE9] hover:border-[#0F4C4A]/40 transition-all shadow-xs p-2.5 sm:p-3 flex items-center justify-between gap-3 text-start"
          >
            {/* Start Side: 88px Clinical Image Box */}
            <div className="relative w-[88px] h-[88px] min-w-[88px] rounded-lg overflow-hidden border border-[#E2ECE9] bg-[#F2F7F5] shrink-0">
              <SmartImage
                src={product.image}
                alt={product.title}
                fill
                priority={false}
                sizes="88px"
                className="object-cover object-center"
              />
              {info.hasDiscount && (
                <div className="absolute top-1 start-1 px-1.5 py-0.5 rounded bg-[#D9534F] text-white text-xs font-bold leading-none">
                  -{info.discountPercentage}%
                </div>
              )}
            </div>

            {/* Center Info: Name, Ingredients Chips, Verification Badge */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              {/* Product Title */}
              <h3
                data-product-title
                className="font-bold text-xs sm:text-sm md:text-base text-[#0F4C4A] line-clamp-1 leading-tight"
                title={product.title}
              >
                {product.title.replace(/\s*\([^)]*\)\s*$/, '')}
              </h3>

              {/* Clinical Ingredients / Concentration Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-[#CFE8E1]/50 border border-[#CFE8E1] text-[#0F4C4A]">
                  <SparklesIcon size={12} />
                  <span>{chip1}</span>
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-[#F2F7F5] border border-[#D4E5E0] text-[#4A5568]">
                  <span>{chip2}</span>
                </span>
              </div>

              {/* Lab Verification Badge */}
              <div className="flex items-center gap-1 text-xs font-medium text-[#0F4C4A]">
                <ShieldCheckIcon size={14} className="text-[#0F4C4A] shrink-0" />
                <span className="whitespace-nowrap">أصلي 100% · تشغيلة موثقة</span>
              </div>
            </div>

            {/* End Side: Price & 44px Add Button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0 ms-1">
              {/* Price Container */}
              <div className="flex flex-col items-end text-end">
                <span className="font-bold text-xs sm:text-sm md:text-base text-[#0F4C4A] whitespace-nowrap">
                  {info.formattedPrice}
                </span>
                {info.hasDiscount && info.formattedComparePrice && (
                  <span className="text-xs line-through text-[#64748B] whitespace-nowrap">
                    {info.formattedComparePrice}
                  </span>
                )}
              </div>

              {/* 44px Add to Cart Button */}
              <button
                type="button"
                onClick={() => cart.add(product)}
                className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-lg bg-[#0F4C4A] text-white hover:bg-[#0B3A38] inline-flex items-center justify-center gap-1 text-xs font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] shadow-xs shrink-0"
                aria-label={`إضافة ${product.title} إلى السلة`}
              >
                {inCartCount > 0 ? (
                  <>
                    <CheckIcon size={16} />
                    <span className="hidden sm:inline">{inCartCount}</span>
                  </>
                ) : (
                  <>
                    <BagIcon size={16} />
                    <span className="hidden sm:inline">إضافة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

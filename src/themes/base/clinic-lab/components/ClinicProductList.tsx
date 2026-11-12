'use client';

import React from 'react';
import Link from 'next/link';
import { ProductCardData } from '@/themes/contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import {
  getProductQuickInfo,
  splitBilingualProductTitle,
} from '@/core/storefront/productQuickInfo';
import { SmartImage } from '@/core/ui/SmartImage';
import { BagIcon, ShieldCheckIcon } from './ClinicIcons';

export interface ClinicProductListProps {
  products: ProductCardData[];
}

/**
 * Swiss Clinical 2-Column Specimen Grid.
 * Clean clinical frames without overlaid badges/floating buttons on photography,
 * strict BiDi title/Latin code separation, tabular numeric pricing without overlap,
 * and minimum 44px accessible controls.
 */
export function ClinicProductList({ products }: ClinicProductListProps) {
  const { cart, currency, locale } = useStorefront();
  const isEn = locale === 'en';

  if (products.length === 0) {
    return (
      <div className="p-10 rounded-2xl bg-[#F6FAF9] border border-[#D4E5E0] text-center space-y-2">
        <p className="text-sm font-bold text-[#0F4C4A]">
          {isEn
            ? 'No formulations match your current clinical criteria.'
            : 'لا توجد مستحضرات سريرية مطابقة لمعايير التصفية المختارة.'}
        </p>
        <p className="text-xs text-[#546E6C]">
          {isEn
            ? 'Try switching skin type or clearing search keywords.'
            : 'جربي اختيار تصنيف آخر أو إزالة قيود البحث أعلاه.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5 sm:gap-5">
      {products.map((product) => {
        const info = getProductQuickInfo(product, currency);
        const { arTitle, enSubtitle } = splitBilingualProductTitle(product.title);

        return (
          <article
            key={product.id}
            data-testid={`product-card-${product.id}`}
            className="group bg-white rounded-xl sm:rounded-2xl border border-[#DCEAE6] hover:border-[#0F4C4A]/60 overflow-hidden transition-colors flex flex-col justify-between shadow-xs"
          >
            {/* Specimen Photography Frame */}
            <Link
              href={`/product/${product.id}`}
              className="block p-2 sm:p-3 pb-0"
              aria-label={product.title}
            >
              <div className="relative h-[88px] sm:h-auto sm:aspect-[16/11] w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#EFF6F4] border border-[#E2ECE9]">
                <SmartImage
                  src={product.image}
                  alt={product.title}
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 48vw, 42vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </Link>

            {/* Specimen Dossier Content */}
            <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between gap-2 sm:gap-4 text-start">
              <div className="space-y-1 sm:space-y-2">
                {/* Brand & Concentration Line */}
                <div className="flex items-center justify-between gap-1 text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-[#0F4C4A] truncate">
                    <ShieldCheckIcon size={13} />
                    <span className="truncate">{product.brand}</span>
                  </span>
                  {info.concentration && (
                    <span
                      dir="ltr"
                      className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#EFF6F4] border border-[#D4E5E0] font-mono text-xs font-semibold text-[#0F4C4A]"
                    >
                      {info.concentration}
                    </span>
                  )}
                </div>

                {/* BiDi Split Title */}
                <Link href={`/product/${product.id}`} className="min-h-[40px] flex flex-col justify-center space-y-0.5">
                  <h3 className="text-xs sm:text-lg font-bold text-[#0F4C4A] leading-[1.45] line-clamp-2 group-hover:underline">
                    {arTitle}
                  </h3>
                  {enSubtitle && (
                    <span
                      dir="ltr"
                      className="hidden sm:block text-xs font-mono text-[#546E6C] truncate text-end sm:text-start"
                    >
                      {enSubtitle}
                    </span>
                  )}
                </Link>

                {/* Active Formulation Summary (Desktop/Tablet) */}
                <p className="hidden sm:block text-xs text-[#4A5568] leading-[1.65] line-clamp-2">
                  {product.subtitle || info.ingredients || 'تركيبة مفحوصة سريرياً ومعتمدة للاستخدام الطبي'}
                </p>
              </div>

              {/* Clean Price & Action Row */}
              <div className="pt-2 sm:pt-3 border-t border-[#E8F1EE] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
                <div className="flex flex-col min-w-0 gap-0.5">
                  <span className="text-xs sm:text-lg font-bold text-[#0F4C4A] tabular-nums whitespace-nowrap">
                    {info.formattedPrice}
                  </span>
                  {(info.formattedComparePrice || (info.discountPercentage ?? 0) > 0) && (
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                      {info.formattedComparePrice && (
                        <span className="text-xs text-[#64748B] line-through tabular-nums">
                          {info.formattedComparePrice}
                        </span>
                      )}
                      {(info.discountPercentage ?? 0) > 0 && (
                        <span
                          dir="ltr"
                          className="px-1.5 py-0.5 rounded bg-[#EAF4F2] text-[#0F4C4A] text-xs font-mono font-bold tabular-nums"
                        >
                          -{info.discountPercentage}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    href={`/product/${product.id}`}
                    className="hidden sm:inline-flex min-h-[44px] px-3 rounded-xl border border-[#D4E5E0] bg-[#F6FAF9] hover:bg-[#E7F2EF] text-xs font-bold text-[#0F4C4A] items-center justify-center transition-colors"
                  >
                    {isEn ? 'Specs' : 'المواصفات'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => cart.add(product)}
                    className="w-full sm:w-auto min-h-[44px] px-3 sm:px-4 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    aria-label={isEn ? `Add ${product.title}` : `إضافة ${product.title}`}
                  >
                    <BagIcon size={15} />
                    <span>{isEn ? 'Add' : 'إضافة للسلة'}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

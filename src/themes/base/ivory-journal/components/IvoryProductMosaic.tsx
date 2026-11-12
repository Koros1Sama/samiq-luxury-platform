'use client';

import React, { useState } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import {
  getProductQuickInfo,
  matchesProductCategory,
  splitBilingualProductTitle,
} from '@/core/storefront/productQuickInfo';
import { ProductCardData, SectionComponentProps } from '@/themes/contract';
import { PlusIcon, VerifiedStampIcon } from './IvoryIcons';

export interface IvoryProductMosaicProps extends Partial<SectionComponentProps> {
  onSelectProduct?: (product: ProductCardData) => void;
}

/**
 * Curated Exhibition Mosaic for Ivory Journal.
 * Features a unified editorial category bar, a compact collapsible concentration/tag filter,
 * museum passe-partout framing, split BiDi product titles, and clean touch-safe add buttons.
 */
export function IvoryProductMosaic({ onSelectProduct }: IvoryProductMosaicProps) {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    availableTags,
    search,
    features,
    currency,
    locale,
    cart,
  } = useStorefront();

  const [showAllTags, setShowAllTags] = useState(false);
  const isEn = locale === 'en';
  const isAll = !activeCategory || activeCategory === 'all' || activeCategory === '';

  const filteredProducts = products.filter((p) => {
    const matchCategory = isAll || matchesProductCategory(p, activeCategory);
    const matchTag = !activeTag || (p.tags && p.tags.includes(activeTag));
    const q = (search?.query || '').trim().toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.subtitle || '').toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
    return matchCategory && matchTag && matchSearch;
  });

  const visibleTags = showAllTags ? availableTags : availableTags.slice(0, 6);

  return (
    <section
      id="mosaic"
      aria-label={isEn ? 'Curated Product Index' : 'فهرس المستحضرات المعتمدة'}
      className="w-full py-2 sm:py-14 bg-[#FAF7F2] border-b border-[#E8E2D8]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-8">
        {/* Section Editorial Masthead */}
        <div className="flex flex-row items-end justify-between gap-2 border-b border-[#E8E2D8] pb-2 sm:pb-4">
          <div className="space-y-0.5 text-start">
            <span className="hidden sm:block text-xs font-sans font-semibold text-[#5E6B5A]">
              {isEn ? 'CURATED ARCHIVE · BATCH VERIFIED' : 'الأرشيف التحريري · مستحضرات أصلية مفحوصة'}
            </span>
            <h2 className="font-serif font-bold text-base sm:text-3xl lg:text-4xl text-[#1B1612] leading-[1.35]">
              {isEn ? 'Selected Skin Formulations' : 'اختيارات العدد للعناية الفائقة'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-sans text-[#554D46] shrink-0">
            <VerifiedStampIcon size={15} color="#5E6B5A" />
            <span className="tabular-nums">
              {filteredProducts.length} {isEn ? 'formulas' : 'مستحضرات'}
            </span>
          </div>
        </div>

        {/* Single Clean Category Filter Strip */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`min-h-[44px] px-4 rounded-full text-xs sm:text-sm font-sans font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isAll
                  ? 'bg-[#1B1612] text-[#FAF7F2]'
                  : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8] border border-[#E2D9CB]'
              }`}
            >
              {isEn ? 'All Editions' : 'كافة المستحضرات'}
            </button>
            {categories.map((cat) => {
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[44px] px-4 rounded-full text-xs sm:text-sm font-sans font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    selected
                      ? 'bg-[#1B1612] text-[#FAF7F2]'
                      : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8] border border-[#E2D9CB]'
                  }`}
                >
                  {cat.title}
                </button>
              );
            })}
          </div>

          {/* Restraint Single-Row Tag Index (Tablet/Desktop; mobile fold stays crisp) */}
          {features?.tags_filtering !== false && availableTags && availableTags.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-sans font-semibold text-[#877E75] shrink-0">
                {isEn ? 'Focus:' : 'التخصص:'}
              </span>
              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag?.(null)}
                  className="min-h-[40px] px-3 rounded-full text-xs font-sans font-semibold bg-[#5E6B5A] text-[#FAF7F2] shrink-0"
                >
                  {isEn ? 'Reset' : 'إلغاء التصفية'}
                </button>
              )}
              {visibleTags.map(({ tag }) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag?.(isSelected ? null : tag)}
                    className={`min-h-[40px] px-3 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-[#1B1612] text-[#FAF7F2] font-bold'
                        : 'bg-[#FAF7F2] text-[#554D46] border border-[#E2D9CB] hover:border-[#1B1612]'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
              {availableTags.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className="min-h-[40px] px-3 rounded-full text-xs font-sans font-semibold text-[#5E6B5A] underline underline-offset-4 shrink-0"
                >
                  {showAllTags
                    ? isEn
                      ? 'Fewer'
                      : 'عرض أقل'
                    : isEn
                    ? `+${availableTags.length - 6} more`
                    : `+${availableTags.length - 6} تخصصات`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Exhibition Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center border border-[#E8E2D8] rounded-2xl bg-[#F4EFE6]/60 space-y-3">
            <p className="font-serif text-base text-[#1B1612]">
              {isEn ? 'No matching formulas in this edition' : 'لا توجد مستحضرات مطابقة لبحثك حالياً'}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setActiveTag?.(null);
                search?.setQuery('');
              }}
              className="min-h-[44px] px-5 rounded-full bg-[#1B1612] text-[#FAF7F2] text-xs font-sans font-bold"
            >
              {isEn ? 'Show Full Index' : 'عرض كافة المستحضرات'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product, idx) => (
              <EditorialProductCard
                key={product.id}
                product={product}
                currency={currency}
                isEn={isEn}
                isTall={idx % 3 === 1}
                onSelect={() => onSelectProduct?.(product)}
                onAdd={() => cart.add(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EditorialProductCard({
  product,
  currency,
  isEn,
  isTall,
  onSelect,
  onAdd,
}: {
  product: ProductCardData;
  currency: 'YER' | 'SAR' | 'USD';
  isEn: boolean;
  isTall: boolean;
  onSelect: () => void;
  onAdd: () => void;
}) {
  const info = getProductQuickInfo(product, currency);
  const { arTitle, enSubtitle } = splitBilingualProductTitle(product.title);

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="group flex flex-col justify-between bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#B89B5E] rounded-2xl overflow-hidden transition-colors duration-300"
    >
      {/* Framed Exhibition Image Plate */}
      <div className="p-1.5 sm:p-3 pb-0">
        <button
          type="button"
          onClick={onSelect}
          className={`w-full block relative overflow-hidden rounded-xl bg-[#EFE8DC] ${
            isTall ? 'h-[88px] sm:h-auto sm:aspect-[4/5]' : 'h-[88px] sm:h-auto sm:aspect-[4/3]'
          }`}
          aria-label={isEn ? `Inspect ${product.title}` : `معاينة ${product.title}`}
        >
          <SmartImage
            src={product.image}
            alt={product.title}
            fill
            priority={false}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {(info.discountPercentage ?? 0) > 0 && (
            <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full bg-[#1B1612] text-[#FAF7F2] text-xs font-mono font-bold tabular-nums">
              -{info.discountPercentage}%
            </span>
          )}
        </button>
      </div>

      {/* Editorial Specimen Typography & Actions */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between gap-2 sm:gap-3 text-start">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs font-sans text-[#5E6B5A]">
            <span className="font-semibold truncate">{product.brand}</span>
            {info.concentration && (
              <span dir="ltr" className="hidden sm:inline font-mono text-[#877E75] shrink-0">
                {info.concentration}
              </span>
            )}
          </div>

          <a
            href={`/product/${product.id}`}
            className="block min-h-[40px] flex flex-col justify-center group-hover:text-[#5E6B5A] transition-colors"
          >
            <h3 className="font-serif font-bold text-xs sm:text-base text-[#1B1612] leading-[1.4] sm:leading-[1.55] line-clamp-2">
              {arTitle}
            </h3>
            {enSubtitle && (
              <span
                dir="ltr"
                className="hidden sm:block text-xs font-mono text-[#6E675F] truncate mt-0.5 text-end sm:text-start"
              >
                {enSubtitle}
              </span>
            )}
          </a>
        </div>

        {/* Bottom Ledger: Price + Circular Add Action */}
        <div className="pt-1.5 sm:pt-2.5 border-t border-[#E8E2D8] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-sm sm:text-base text-[#1B1612] tabular-nums">
              {info.formattedPrice}
            </span>
            {info.formattedComparePrice && (
              <span className="text-xs font-sans text-[#877E75] line-through tabular-nums">
                {info.formattedComparePrice}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-[#1B1612]/25 bg-[#F4EFE6] hover:bg-[#1B1612] text-[#1B1612] hover:text-[#FAF7F2] flex items-center justify-center transition-colors shrink-0"
            aria-label={isEn ? `Add ${product.title} to bag` : `إضافة ${product.title} للحقيبة`}
          >
            <PlusIcon size={18} color="currentColor" />
          </button>
        </div>
      </div>
    </article>
  );
}

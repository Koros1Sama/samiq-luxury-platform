'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { getProductQuickInfo } from '@/core/storefront/productQuickInfo';
import { ProductCardData, SectionComponentProps } from '@/themes/contract';
import { PlusIcon, VerifiedStampIcon } from './IvoryIcons';

interface IvoryProductMosaicProps extends Partial<SectionComponentProps> {
  onSelectProduct?: (product: ProductCardData) => void;
}

export function IvoryProductMosaic({ onSelectProduct }: IvoryProductMosaicProps) {
  const {
    products,
    categories,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    availableTags,
    cart,
    currency,
  } = useStorefront();

  // Filter products by active category and active tag
  const isAll = !activeCategory || activeCategory === 'all' || activeCategory === '';
  const filteredProducts = products.filter((p) => {
    if (!isAll && p.categorySlug !== activeCategory) return false;
    if (activeTag && (!p.tags || !p.tags.includes(activeTag))) return false;
    return true;
  });

  // Split into mobile 2 columns and desktop 3 columns cleanly without duplication
  const mobileCols = [
    filteredProducts.filter((_, i) => i % 2 === 0),
    filteredProducts.filter((_, i) => i % 2 === 1),
  ];

  const desktopCols = [0, 1, 2].map((rem) =>
    filteredProducts.filter((_, i) => i % 3 === rem)
  );

  return (
    <section
      id="mosaic"
      className="relative w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 -mt-3 sm:-mt-6 lg:-mt-8 z-20 pb-16"
    >
      {/* Editorial Section Header */}
      <div className="mb-2.5 sm:mb-8 p-2.5 sm:p-6 bg-[#FAF7F2]/95 backdrop-blur-md border border-[#E8E2D8] rounded-md shadow-sm flex flex-col md:flex-row items-start md:items-end justify-between gap-1.5 sm:gap-4">
        <div>
          <span className="text-xs font-sans font-semibold text-[#5E6B5A] block mb-1">
            مختارات الأسبوع · الإصدار التحريري
          </span>
          <h2 className="font-serif font-bold text-lg sm:text-3xl lg:text-4xl text-[#1B1612] leading-[1.35]">
            اختيارات الأسبوع
          </h2>
          <p className="font-sans text-sm text-[#554D46] mt-0.5 leading-[1.75] hidden sm:block">
            مستحضرات منتقاة بعناية فائقة، مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية
          </p>
        </div>

        {/* Category Pill Filters (Single horizontally scrollable row on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-nowrap">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              isAll
                ? 'bg-[#1B1612] text-[#FAF7F2]'
                : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8]'
            }`}
          >
            الكل ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#1B1612] text-[#FAF7F2]'
                  : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Smart Multi-Tags Horizontal Scrollable Bar */}
      {availableTags.length > 0 && (
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 mb-6">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
              activeTag === null
                ? 'bg-[#1B1612] text-[#FAF7F2] font-bold shadow-sm'
                : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8]'
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
                    ? 'bg-[#5E6B5A] text-white font-bold shadow-sm'
                    : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8] border border-[#E8E2D8]'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile 2-column layout (<= lg) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-6 items-start lg:hidden">
        {mobileCols.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`flex flex-col gap-2.5 sm:gap-6 ${colIdx === 1 ? 'pt-1.5 sm:pt-4' : ''}`}
          >
            {col.map((product) => (
              <IvoryCard
                key={product.id}
                product={product}
                isTall={false}
                currency={currency}
                onSelect={onSelectProduct}
                onAdd={() => cart.add(product)}
                activeTag={activeTag}
                setActiveTag={setActiveTag}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Mobile Smart Multi-Tags Bar (Below the fold) */}
      {availableTags.length > 0 && (
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 my-3 border-t border-[#E8E2D8]">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`min-h-[40px] px-3.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
              activeTag === null
                ? 'bg-[#1B1612] text-[#FAF7F2] font-bold shadow-sm'
                : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8]'
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
                    ? 'bg-[#5E6B5A] text-white font-bold shadow-sm'
                    : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8] border border-[#E8E2D8]'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-xs opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop 3-column layout (lg+) */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 items-start">
        {desktopCols.map((col, colIdx) => (
          <div
            key={colIdx}
            className={`flex flex-col gap-8 ${colIdx === 1 ? 'pt-8' : colIdx === 2 ? 'pt-4' : ''}`}
          >
            {col.map((product, pIdx) => (
              <IvoryCard
                key={product.id}
                product={product}
                isTall={colIdx === 0 ? pIdx % 2 === 0 : colIdx === 1 ? pIdx % 2 !== 0 : pIdx % 2 === 0}
                currency={currency}
                onSelect={onSelectProduct}
                onAdd={() => cart.add(product)}
                activeTag={activeTag}
                setActiveTag={setActiveTag}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

interface IvoryCardProps {
  product: ProductCardData;
  isTall: boolean;
  currency: any;
  onSelect?: (product: ProductCardData) => void;
  onAdd: () => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
}

function IvoryCard({ product, isTall, currency, onSelect, onAdd, activeTag, setActiveTag }: IvoryCardProps) {
  const info = getProductQuickInfo(product, currency);

  return (
    <article
      data-product-card
      onClick={() => onSelect && onSelect(product)}
      className="group relative flex flex-col bg-[#F7F4ED] border border-[#E8E2D8] hover:border-[#1B1612]/40 transition-all duration-300 rounded-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Packshot Container with Warm Greige Studio Backdrop */}
      <div
        className={`relative w-full bg-[#EFEAE1] overflow-hidden ${
          isTall ? 'aspect-[4/3] sm:aspect-[4/5]' : 'aspect-[4/3] sm:aspect-square'
        }`}
      >
        <SmartImage
          src={product.image}
          alt={product.title}
          priority={false}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center w-full h-full mix-blend-multiply opacity-95 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Micro Authenticity Badge */}
        {info.isAuthenticGuaranteed && (
          <div className="absolute top-1.5 start-1.5 sm:top-2 sm:start-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm border border-[#5E6B5A]/30 flex items-center gap-1 shadow-sm">
            <VerifiedStampIcon size={11} color="#5E6B5A" />
            <span className="text-xs font-sans font-medium text-[#5E6B5A]">
              موثق
            </span>
          </div>
        )}
      </div>

      {/* Editorial Caption Below Image */}
      <div className="p-2 sm:p-4 flex flex-col justify-between flex-1 space-y-1">
        <div className="space-y-0.5">
          {info.concentration && (
            <span className="text-xs font-sans text-[#5E6B5A] block leading-none">
              تركيز {info.concentration}
            </span>
          )}

          {/* Product Name with data-product-title */}
          <h3
            data-product-title
            className="font-serif font-bold text-xs sm:text-base text-[#1B1612] line-clamp-2 leading-[1.3] group-hover:text-[#5E6B5A] transition-colors"
          >
            {product.title}
          </h3>

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
                  className={`min-h-[40px] px-2.5 rounded-sm text-xs font-sans transition-colors inline-flex items-center justify-center ${
                    activeTag === t
                      ? 'bg-[#1B1612] text-[#FAF7F2] font-bold'
                      : 'bg-[#F4EFE6] text-[#554D46] hover:bg-[#E8E2D8] border border-[#E8E2D8]'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Plain '+' Add Control */}
        <div className="pt-1 flex items-center justify-between border-t border-[#E8E2D8]/60">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-xs sm:text-base text-[#1B1612]">
              {info.formattedPrice}
            </span>
            {info.hasDiscount && info.formattedComparePrice && (
              <span className="text-xs font-sans text-[#877E75] line-through leading-none">
                {info.formattedComparePrice}
              </span>
            )}
          </div>

          {/* Plain '+' add button (44px hit area per B2 spec) */}
          <button
            type="button"
            aria-label={`أضف ${product.title} إلى الحقيبة`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#1B1612]/20 hover:border-[#1B1612] bg-[#FAF7F2] hover:bg-[#1B1612] text-[#1B1612] hover:text-[#FAF7F2] rounded-full transition-all text-lg font-bold shadow-sm"
          >
            <PlusIcon size={18} color="currentColor" />
          </button>
        </div>
      </div>
    </article>
  );
}

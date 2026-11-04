'use client';

import React, { useState, useMemo } from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ClinicSkinTypeSelector, SkinTypeId } from './ClinicSkinTypeSelector';
import { ClinicProductList } from './ClinicProductList';
import { SectionComponentProps } from '@/themes/contract';
import {
  FlaskIcon,
  ShieldCheckIcon,
  BagIcon,
  CheckIcon,
  SparklesIcon,
} from './ClinicIcons';

export function ClinicProductSection(_props?: SectionComponentProps) {
  const { products, search, activeCategory, activeTag, setActiveTag, availableTags, cart, currency } = useStorefront();
  const [selectedSkinType, setSelectedSkinType] = useState<SkinTypeId>('all');
  const [priceMax, setPriceMax] = useState<number>(30000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Routine-based recommended product ids
  const SKIN_RECOMMENDATIONS: Record<Exclude<SkinTypeId, 'all'>, string[]> = {
    oily: ['prod-2', 'prod-3'],
    dry: ['prod-1', 'prod-2', 'prod-6'],
    sensitive: ['prod-2', 'prod-6'],
  };

  // Live filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query Filter
      if (search.query.trim()) {
        const q = search.query.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSubtitle = p.subtitle ? p.subtitle.toLowerCase().includes(q) : false;
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesSubtitle && !matchesBrand) {
          return false;
        }
      }

      // 2. Skin Type Filter
      if (selectedSkinType !== 'all') {
        const recommendedIds = SKIN_RECOMMENDATIONS[selectedSkinType];
        if (recommendedIds && !recommendedIds.includes(p.id)) {
          return false;
        }
      }

      // 3. Category Filter
      if (
        activeCategory &&
        activeCategory !== 'all' &&
        activeCategory !== '' &&
        p.categorySlug !== activeCategory
      ) {
        return false;
      }

      // 4. Smart Tag Filter
      if (activeTag && (!p.tags || !p.tags.includes(activeTag))) {
        return false;
      }

      // 5. Price Filter (YER reference)
      const yerPrice = p.prices.YER ?? 0;
      if (yerPrice > priceMax) {
        return false;
      }

      return true;
    });
  }, [products, search.query, selectedSkinType, activeCategory, activeTag, priceMax]);

  return (
    <section id="products" className="w-full py-4 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Mobile View: Skin-Type Segmented Selector as the FIRST content, followed directly by LIST rows */}
        <div className="lg:hidden">
          <ClinicSkinTypeSelector
            selectedSkinType={selectedSkinType}
            onSelectSkinType={setSelectedSkinType}
            resultCount={filteredProducts.length}
          />

          <div className="mt-2">
            <ClinicProductList products={filteredProducts} />
          </div>

          {/* Smart Multi-Tags Horizontal Scrollable Bar (Mobile - Below the fold) */}
          {availableTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 mt-4 border-t border-[#E2ECE9]">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`min-h-[40px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
                  activeTag === null
                    ? 'bg-[#0F4C4A] text-white shadow-sm'
                    : 'bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/60 border border-[#D4E5E0]'
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
                    className={`min-h-[40px] px-3.5 rounded-lg text-xs font-semibold transition-all shrink-0 inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#0F4C4A] text-white shadow-sm'
                        : 'bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/60 border border-[#D4E5E0]'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop View: Left Filter Sidebar, Results Grid/List, Sticky Cart Summary */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Filter Sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-5 text-start space-y-5 sticky top-28">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D4E5E0]">
              <FlaskIcon size={18} className="text-[#0F4C4A]" />
              <h3 className="font-bold text-sm text-[#0F4C4A]">
                تصفية المعمل والعيادة
              </h3>
            </div>

            {/* Skin Type Filter */}
            <div>
              <span className="text-xs font-bold text-[#0F4C4A] block mb-2">
                نوع البشرة المستهدفة:
              </span>
              <div className="space-y-1.5">
                {(['all', 'oily', 'dry', 'sensitive'] as const).map((type) => {
                  const labels = {
                    all: 'كافة أنواع البشرة',
                    oily: 'البشرة الدهنية (تنقية)',
                    dry: 'البشرة الجافة (ترطيب)',
                    sensitive: 'البشرة الحساسة (تهدئة)',
                  };
                  const isActive = selectedSkinType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedSkinType(type)}
                      className={`w-full min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold text-start flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-white text-[#0F4C4A] border border-[#0F4C4A]/30 shadow-xs'
                          : 'text-[#4A5568] hover:bg-white/60'
                      }`}
                    >
                      <span>{labels[type]}</span>
                      {isActive && <CheckIcon size={14} className="text-[#0F4C4A]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#0F4C4A] mb-1.5">
                <span>الحد الأقصى للسعر:</span>
                <span>{priceMax.toLocaleString()} YER</span>
              </div>
              <input
                type="range"
                min={10000}
                max={30000}
                step={1000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full min-h-[40px] h-10 accent-[#0F4C4A] cursor-pointer py-2"
                aria-label="الحد الأقصى للسعر بالريال اليمني"
              />
            </div>

            {/* Trust Pill */}
            <div className="p-3 rounded-xl bg-white border border-[#D4E5E0] text-xs text-[#0F4C4A] flex items-center gap-2">
              <ShieldCheckIcon size={16} className="shrink-0" />
              <span className="leading-[1.75]">كافة المستحضرات مفحوصة برقم تشغيلة رسمي</span>
            </div>
          </div>

          {/* Center Results List (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE9]">
              <span className="text-xs font-bold text-[#0F4C4A]">
                قائمة المستحضرات السريرية ({filteredProducts.length})
              </span>
              {selectedSkinType !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedSkinType('all')}
                  className="text-xs text-[#0F4C4A] font-semibold hover:underline"
                >
                  إعادة ضبط الفلاتر
                </button>
              )}
            </div>

            {/* Smart Multi-Tags Horizontal Scrollable Bar (Desktop) */}
            {availableTags.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={`min-h-[40px] px-3.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 inline-flex items-center justify-center ${
                    activeTag === null
                      ? 'bg-[#0F4C4A] text-white shadow-sm'
                      : 'bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/60 border border-[#D4E5E0]'
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
                      className={`min-h-[40px] px-3.5 rounded-lg text-xs font-semibold transition-all shrink-0 inline-flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#0F4C4A] text-white shadow-sm'
                          : 'bg-[#F2F7F5] text-[#0F4C4A] hover:bg-[#CFE8E1]/60 border border-[#D4E5E0]'
                      }`}
                    >
                      <span>#{tag}</span>
                      <span className="text-xs opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            <ClinicProductList products={filteredProducts} />
          </div>

          {/* Right Sticky Cart Summary (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#D4E5E0] p-5 text-start space-y-4 sticky top-28 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2ECE9]">
              <div className="flex items-center gap-2">
                <BagIcon size={18} className="text-[#0F4C4A]" />
                <h3 className="font-bold text-sm text-[#0F4C4A]">
                  ملخص الطلب السريع
                </h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#CFE8E1] text-[#0F4C4A] font-bold">
                {cart.count}
              </span>
            </div>

            {cart.items.length === 0 ? (
              <div className="py-8 text-center text-[#64748B]">
                <p className="text-sm leading-[1.75]">
                  السلة فارغة. اختاري المستحضرات المناسبة لبشرتك.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-56 overflow-y-auto space-y-2 pe-1">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-[#F2F7F5]"
                    >
                      <span className="font-semibold text-[#0F4C4A] truncate max-w-[120px]">
                        {item.title}
                      </span>
                      <span className="text-[#4A5568]">
                        x{item.quantity} · {item.unitPrice[currency]?.toLocaleString()} {currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E2ECE9] flex justify-between text-sm font-bold text-[#0F4C4A]">
                  <span>الإجمالي:</span>
                  <span>{cart.total?.toLocaleString()} {currency}</span>
                </div>

                <button
                  type="button"
                  onClick={cart.open}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                >
                  <BagIcon size={16} />
                  <span>معاينة السلة وإتمام الطلب</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

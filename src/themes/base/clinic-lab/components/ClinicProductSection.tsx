'use client';

import React, { useState, useMemo } from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { matchesProductCategory } from '@/core/storefront/productQuickInfo';
import { formatCurrency } from '@/core/currency/formatter';
import { ClinicSkinTypeSelector, SkinTypeId } from './ClinicSkinTypeSelector';
import { ClinicProductList } from './ClinicProductList';
import { SectionComponentProps } from '@/themes/contract';
import { BagIcon, FlaskIcon } from './ClinicIcons';

/**
 * Swiss Clinical Catalog Section.
 * Uses a balanced 3-col Clinical Filter Sidebar + 9-col 2-column Specimen Grid on desktop,
 * removing empty center-cramping right sidebars while keeping instant skin/category filtering.
 */
export function ClinicProductSection(_props?: Partial<SectionComponentProps>) {
  const {
    products,
    categories,
    search,
    activeCategory,
    setActiveCategory,
    activeTag,
    setActiveTag,
    availableTags,
    cart,
    currency,
    locale,
  } = useStorefront();

  const [selectedSkin, setSelectedSkin] = useState<SkinTypeId>('all');
  const isEn = locale === 'en';
  const isAllCat = !activeCategory || activeCategory === 'all' || activeCategory === '';

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!isAllCat && !matchesProductCategory(p, activeCategory)) return false;
      if (activeTag && (!p.tags || !p.tags.includes(activeTag))) return false;

      if (selectedSkin !== 'all') {
        const text = `${p.title} ${p.subtitle || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (selectedSkin === 'oily' && !/(نياسيناميد|سيبوم|دهن|oily|niacinamide|bha)/i.test(text)) {
          return false;
        }
        if (selectedSkin === 'dry' && !/(مرطب|سيراميد|هيالورونيك|dry|ceramide|hyaluronic|hydrat)/i.test(text)) {
          return false;
        }
        if (selectedSkin === 'sensitive' && !/(حساس|لطيف|مهدئ|غسول|sensitive|gentle|sooth)/i.test(text)) {
          return false;
        }
      }

      const q = (search?.query || '').trim().toLowerCase();
      if (q) {
        const blob = `${p.title} ${p.brand} ${p.subtitle || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }

      return true;
    });
  }, [products, isAllCat, activeCategory, activeTag, selectedSkin, search?.query]);

  return (
    <section
      id="products"
      aria-label={isEn ? 'Clinical Catalog' : 'دليل المستحضرات السريرية'}
      className="w-full py-2.5 sm:py-12 bg-[#FAFDFC] border-b border-[#E2ECE9]"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-2.5 sm:space-y-6">
        {/* Clinical Section Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#DCEAE6] pb-2 sm:pb-4 text-start">
          <div>
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C4A] mb-1">
              <FlaskIcon size={15} />
              <span>{isEn ? 'DERMALOGIC FORMULARY' : 'الدليل الصيدلاني للمستحضرات الأصلية'}</span>
            </div>
            <h2 className="text-sm sm:text-3xl font-bold text-[#0F4C4A] leading-[1.35]">
              {isEn ? 'Verified Formulations Archive' : 'أرشيف التركيبات المعتمدة'}
            </h2>
          </div>

          <span className="text-xs font-mono font-bold text-[#0F4C4A] bg-white px-2.5 py-1 rounded-lg border border-[#D4E5E0] shrink-0 tabular-nums">
            {filteredProducts.length} {isEn ? 'specimens' : 'مستحضرات'}
          </span>
        </div>

        {/* Compact Mobile Category Row */}
        <div className="lg:hidden space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`min-h-[44px] px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                isAllCat
                  ? 'bg-[#0F4C4A] text-white'
                  : 'bg-white border border-[#D4E5E0] text-[#0F4C4A]'
              }`}
            >
              {isEn ? 'All' : 'الكل'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`min-h-[44px] px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                  activeCategory === c.id
                    ? 'bg-[#0F4C4A] text-white'
                    : 'bg-white border border-[#D4E5E0] text-[#0F4C4A]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <ClinicSkinTypeSelector
            selectedSkinType={selectedSkin}
            onSelectSkinType={setSelectedSkin}
            resultCount={filteredProducts.length}
          />
        </div>

        {/* Desktop Swiss 12-Col Split (3-col Diagnostic Rail + 9-col Specimen Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sticky 3-col Sidebar (Desktop lg+) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 text-start">
            <div className="bg-white rounded-2xl border border-[#DCEAE6] p-4 space-y-4 shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-[#0F4C4A] pb-2 border-b border-[#E8F1EE]">
                  {isEn ? 'Clinical Categories' : 'التصنيفات العلاجية'}
                </h3>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`min-h-[44px] px-3 rounded-xl text-xs font-bold text-start transition-colors flex items-center justify-between ${
                      isAllCat
                        ? 'bg-[#0F4C4A] text-white'
                        : 'bg-[#F6FAF9] text-[#0F4C4A] hover:bg-[#EAF3F1]'
                    }`}
                  >
                    <span>{isEn ? 'All Specimens' : 'جميع المستحضرات'}</span>
                    <span className="font-mono tabular-nums">{products.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`min-h-[44px] px-3 rounded-xl text-xs font-bold text-start transition-colors flex items-center justify-between ${
                        activeCategory === cat.id
                          ? 'bg-[#0F4C4A] text-white'
                          : 'bg-[#F6FAF9] text-[#0F4C4A] hover:bg-[#EAF3F1]'
                      }`}
                    >
                      <span>{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8F1EE]">
                <ClinicSkinTypeSelector
                  selectedSkinType={selectedSkin}
                  onSelectSkinType={setSelectedSkin}
                  resultCount={filteredProducts.length}
                />
              </div>

              {availableTags && availableTags.length > 0 && (
                <div className="pt-2 border-t border-[#E8F1EE] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F4C4A]">
                      {isEn ? 'Active Compounds' : 'المركبات النشطة'}
                    </span>
                    {activeTag && (
                      <button
                        type="button"
                        onClick={() => setActiveTag(null)}
                        className="text-xs font-semibold text-[#D9534F] hover:underline"
                      >
                        {isEn ? 'Reset' : 'إعادة تعيين'}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableTags.slice(0, 6).map(({ tag }) => {
                      const active = activeTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setActiveTag(active ? null : tag)}
                          className={`min-h-[40px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                            active
                              ? 'bg-[#0F4C4A] text-white'
                              : 'bg-[#F6FAF9] border border-[#D4E5E0] text-[#0F4C4A] hover:border-[#0F4C4A]'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Compact Clinical Bag Trigger when items exist */}
              {cart.count > 0 && (
                <div className="pt-3 border-t border-[#E8F1EE]">
                  <button
                    type="button"
                    onClick={cart.open}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#0F4C4A] text-white text-xs font-bold flex items-center justify-between hover:bg-[#0B3A38] transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BagIcon size={15} />
                      <span>سلة الطلب ({cart.count})</span>
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(cart.total, currency)}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* 9-col Specimen Cards Container */}
          <div className="lg:col-span-9">
            <ClinicProductList products={filteredProducts} />
          </div>
        </div>
      </div>
    </section>
  );
}

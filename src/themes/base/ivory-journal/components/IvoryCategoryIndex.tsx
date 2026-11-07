'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { matchesProductCategory } from '@/core/storefront/productQuickInfo';
import { SectionComponentProps } from '@/themes/contract';
import { ArrowIcon } from './IvoryIcons';

export function IvoryCategoryIndex(_props: Partial<SectionComponentProps>) {
  const { categories, products, setActiveCategory } = useStorefront();

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const mosaicEl = document.querySelector('#mosaic');
    if (mosaicEl) {
      mosaicEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="w-full bg-[#F5F1E9] py-16 sm:py-24 border-y border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-start">
          <span className="text-xs font-sans font-semibold text-[#5E6B5A] block mb-2">
            فهرس الأعداد والأبواب (The Index)
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1B1612]">
            أقسام المجلة والكتالوج
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#554D46] mt-2 leading-[1.75] max-w-xl">
            تصفحي تشكيلاتنا الموثقة حسب احتياجات بشرتكِ وروتين العناية اليومي
          </p>
        </div>

        {/* Large-type Category Rows */}
        <div className="divide-y divide-[#E8E2D8] border-y border-[#E8E2D8]">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => matchesProductCategory(p, cat.id, categories)).length;
            const indexStr = String(idx + 1).padStart(2, '0');

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className="w-full min-h-[64px] py-5 sm:py-7 px-2 sm:px-6 flex items-center justify-between text-start group hover:bg-[#FAF7F2] transition-colors"
              >
                {/* Index Number & Category Title */}
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-xs sm:text-sm text-[#5E6B5A] font-semibold">
                    {indexStr}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-xl sm:text-3xl text-[#1B1612] group-hover:text-[#5E6B5A] transition-colors">
                      {cat.title}
                    </span>
                    {cat.subtitle && (
                      <span className="font-sans text-xs sm:text-sm text-[#6E675F] mt-1">
                        {cat.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Count & Arrow */}
                <div className="flex items-center gap-3 sm:gap-6">
                  <span className="text-xs sm:text-sm font-sans text-[#877E75]">
                    {count} {count === 1 ? 'مستحضر' : 'مستحضرات'}
                  </span>
                  <div className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#1B1612]/10 rounded-full group-hover:border-[#1B1612] group-hover:bg-[#1B1612] group-hover:text-[#FAF7F2] text-[#1B1612] transition-all">
                    <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-1">
                      <ArrowIcon size={20} color="currentColor" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

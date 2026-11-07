'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SmartImage } from '@/core/ui/SmartImage';
import { ArrowStartIcon, FlaskIcon } from './ClinicIcons';

export function ClinicCategories() {
  const { categories, activeCategory, setActiveCategory } = useStorefront();

  return (
    <section className="w-full py-8 sm:py-12 bg-[#F2F7F5] border-t border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CFE8E1] text-[#0F4C4A] text-xs font-bold mb-2">
              <FlaskIcon size={14} />
              <span>أقسام المعمل التخصصية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F4C4A] leading-tight">
              تصنيفات المنتجات العلاجية
            </h2>
            <p className="text-sm text-[#4A5568] leading-[1.75] mt-1">
              تصفحي المستحضرات حسب الفئة الطبية والوظيفة العلاجية
            </p>
          </div>

          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory('')}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-white border border-[#D4E5E0] text-xs font-semibold text-[#0F4C4A] hover:bg-[#CFE8E1] transition-colors self-start sm:self-auto"
            >
              عرض كافة الأقسام
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(isActive ? '' : cat.id);
                  if (!isActive) {
                    const prodEl = document.querySelector('#products');
                    if (prodEl) {
                      prodEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className={`min-h-[140px] p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] group ${
                  isActive
                    ? 'bg-white border-[#0F4C4A] shadow-md ring-2 ring-[#0F4C4A]/20'
                    : 'bg-white border-[#E2ECE9] hover:border-[#0F4C4A]/40 shadow-xs'
                }`}
              >
                <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#F2F7F5] mb-2 border border-[#E2ECE9]">
                  <SmartImage
                    src={cat.image}
                    alt={cat.title}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cat.badge && (
                    <span className="absolute top-1.5 start-1.5 px-2 py-0.5 rounded bg-[#0F4C4A] text-white text-xs font-bold">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 w-full mt-1">
                  <span className="font-bold text-xs sm:text-sm text-[#0F4C4A] truncate">
                    {cat.title}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#F2F7F5] group-hover:bg-[#CFE8E1] flex items-center justify-center text-[#0F4C4A] shrink-0 transition-colors">
                    <ArrowStartIcon size={12} />
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

'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { CategoryBentoItem, SectionComponentProps } from '../../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { matchesProductCategory } from '@/core/storefront/productQuickInfo';

interface BrandBentoGridProps extends Partial<SectionComponentProps> {
  categories?: CategoryBentoItem[];
  onSelectCategory?: (id: string) => void;
}

export function BrandBentoGrid(props: BrandBentoGridProps) {
  const sf = useStorefront();
  const categories = props.categories || sf.categories || [];
  const products = sf.products || [];
  const onSelectCategory = props.onSelectCategory || sf.setActiveCategory;

  return (
    <section id="categories-bento" className="py-10 sm:py-16 relative bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-sans text-gold font-semibold block mb-1">
              مجموعات {sf.tenant.name} الحصرية
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-ivory">
              أبرز الأقسام والتصنيفات
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-lux font-sans max-w-md leading-relaxed">
            تصنيف متخصص وفق التركيبات الفعالة مع كفالة الأصالة والمطابقة الرسمية.
          </p>
        </div>

        {/* Asymmetric 12-Col Architectural Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => matchesProductCategory(p, cat.id, categories)).length;
            // Balanced 2+2 asymmetric cadence: Row 1 (7+5), Row 2 (5+7)
            const colSpan =
              idx % 4 === 0 || idx % 4 === 3 ? 'md:col-span-7' : 'md:col-span-5';

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory?.(cat.id);
                  const catalogEl = document.querySelector('#products-catalog');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`${colSpan} group text-start samiq-bezel-noir transition-all duration-300 ease-architectural hover:scale-[1.01]`}
              >
                <div className="samiq-bezel-noir-inner p-4 sm:p-6 h-full flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden relative min-h-[210px] sm:min-h-[240px]">
                  {/* Details Column */}
                  <div className="relative z-10 flex-1 flex flex-col justify-between h-full w-full space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-sans text-gold">
                        <span className="tabular-nums font-bold">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="opacity-40">—</span>
                        <span>{cat.badge || `${count} مستحضرات`}</span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-serif font-bold text-ivory group-hover:text-champagne transition">
                        {cat.title}
                      </h3>
                      {cat.subtitle && (
                        <p className="text-xs text-muted-lux font-sans leading-relaxed line-clamp-2">
                          {cat.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-xs font-sans font-bold text-champagne">
                      <span>استكشفي التشكيلة ({count})</span>
                      <span className="w-7 h-7 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-1">
                        ←
                      </span>
                    </div>
                  </div>

                  {/* Framed Packshot Column */}
                  <div className="relative z-10 w-full sm:w-44 lg:w-52 h-40 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1] shrink-0 ring-1 ring-inset ring-black/10">
                    <SmartImage
                      src={cat.image}
                      alt={cat.title}
                      priority={false}
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-architectural"
                    />
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

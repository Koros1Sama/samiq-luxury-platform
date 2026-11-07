'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { CategoryBentoItem, SectionComponentProps } from '../../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

interface BrandBentoGridProps extends Partial<SectionComponentProps> {
  categories?: CategoryBentoItem[];
  onSelectCategory?: (id: string) => void;
}

export function BrandBentoGrid(props: BrandBentoGridProps) {
  const sf = useStorefront();
  const categories = props.categories || sf.categories || [];
  const onSelectCategory = props.onSelectCategory || sf.setActiveCategory;

  return (
    <section id="categories-bento" className="py-8 sm:py-16 relative bg-[#070709] border-t border-white/[0.08]">
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
            نضمن أعلى معايير الجودة والمطابقة مع كفالة الأصالة الموثقة.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory?.(cat.id);
                const catalogEl = document.querySelector('#products-catalog');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group cursor-pointer p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/[0.08] hover:border-gold/50 shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-[#0E0E12] p-4 sm:p-5 flex flex-col justify-between overflow-hidden relative min-h-[320px] sm:min-h-[360px]">
                {/* Ambient Golden Hover Shimmer */}
                <div className="absolute -top-24 -end-24 w-48 h-48 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all pointer-events-none" />

                {/* Card Header (Category Title) */}
                <div className="flex items-center justify-between z-10">
                  <span className="text-sm sm:text-base font-serif font-bold text-ivory group-hover:text-champagne transition">
                    {cat.brand || cat.title}
                  </span>
                  {cat.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-gold/10 text-gold border border-gold/20">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Image Asset with SmartImage */}
                <div className="my-3 sm:my-4 h-40 sm:h-48 w-full rounded-2xl overflow-hidden relative z-10 bg-white/[0.02]">
                  <SmartImage
                    src={cat.image}
                    alt={cat.title}
                    priority={false}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-transparent to-transparent opacity-80" />
                </div>

                {/* Card CTA Button (min 44px hit area) */}
                <div className="z-10 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-white/[0.04] group-hover:bg-gold/15 group-hover:border-gold/30 border border-white/5 text-ivory group-hover:text-champagne font-sans font-bold text-xs flex items-center justify-between transition-all"
                  >
                    <span>{cat.ctaText || 'استعراض القسم'}</span>
                    <span className="text-gold group-hover:-translate-x-1 transition-transform rtl:-scale-x-100">
                      ←
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

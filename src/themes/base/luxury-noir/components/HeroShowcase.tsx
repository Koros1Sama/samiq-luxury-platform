'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';

interface HeroShowcaseProps extends Partial<SectionComponentProps> {
  onCtaClick?: () => void;
}

export function HeroShowcase({ onCtaClick, section }: HeroShowcaseProps) {
  const { tenant, locale } = useStorefront();
  const isEn = locale === 'en';

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const title =
    (tenant as any).heroTitle ||
    (section?.props?.title as string) ||
    tenant.name ||
    'مفتاح الجمال — لكشف المقلد';
  const subtitle =
    (tenant as any).heroSubtitle ||
    (section?.props?.subtitle as string) ||
    tenant.tagline ||
    'بوابتك الموثوقة للمنتجات الأصلية وخدمات التسوق الفاخرة في اليمن';
  const ctaText = isEn ? 'Shop Now' : 'تسوق الآن';

  return (
    <section className="relative overflow-hidden w-full h-[155px] sm:h-[185px] lg:h-[230px] border-b border-white/[0.08] bg-[#070709]">
      {/* Background Hero Packshot with single LCP priority */}
      <div className="absolute inset-0 w-full h-full">
        <SmartImage
          src={tenant.heroImages?.noir || '/media/hero/hero-noir.jpg'}
          alt={title}
          priority={true}
          sizes="100vw"
          className="object-cover object-center brightness-[0.7] contrast-105"
        />
        {/* Directional Gradient: Solid obsidian on start side, fading towards end side */}
        <div className="absolute inset-0 bg-gradient-to-e from-[#070709] via-[#070709]/85 to-[#070709]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Content Container: Exactly ONE headline, ONE subline, ONE primary button */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col justify-center text-start space-y-1.5 sm:space-y-2.5">
        {/* 1. Exactly ONE Headline Line */}
        <h1 className="text-base sm:text-2xl lg:text-3xl font-serif font-bold text-ivory leading-tight truncate max-w-2xl">
          {title}
        </h1>

        {/* 2. Exactly ONE Short Subtitle Line */}
        <p className="text-xs sm:text-sm lg:text-base text-muted-lux font-sans leading-relaxed truncate max-w-xl">
          {subtitle}
        </p>

        {/* 3. Exactly ONE Primary CTA Button (min 44x44 hit area) */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => {
              if (onCtaClick) onCtaClick();
              scrollTo('#products-catalog');
            }}
            className="min-w-[44px] min-h-[44px] h-11 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 self-start"
          >
            <span>{ctaText}</span>
            <span className="inline-block rtl:-scale-x-100 font-serif">←</span>
          </button>
        </div>
      </div>
    </section>
  );
}

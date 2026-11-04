'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';
import { ArrowIcon, VerifiedStampIcon } from './IvoryIcons';

interface IvoryHeroProps extends Partial<SectionComponentProps> {
  onCtaClick?: () => void;
}

export function IvoryHero({ section }: IvoryHeroProps) {
  const { tenant } = useStorefront();

  const title = (section?.props?.title as string) || tenant.name;
  const subtitle =
    (section?.props?.subtitle as string) ||
    tenant.tagline ||
    'دليلك التحريري الشامل لمستحضرات العناية الأصلية والموثقة مخبرياً في اليمن';
  const heroImageSrc = tenant.heroImages?.ivory || '/media/hero/hero-ivory.jpg';

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8E2D8]/60">
      {/* 
        Full-bleed editorial canvas:
        Photo's empty cream area is originally on its left.
        We mirror the image wrapper horizontally via -scale-x-100 so the empty cream area 
        sits on the right (start side in RTL) and the face sits on the left (end side in RTL).
      */}
      <div className="relative w-full min-h-[170px] sm:min-h-[340px] lg:min-h-[58dvh] flex items-center">
        {/* Mirrored Image Wrapper (ONLY on the image container, NEVER on the text) */}
        <div className="absolute inset-0 w-full h-full -scale-x-100 overflow-hidden pointer-events-none">
          <SmartImage
            src={heroImageSrc}
            alt={title}
            priority={true}
            sizes="100vw"
            className="object-cover object-center w-full h-full opacity-90 contrast-[1.02] brightness-[1.01]"
          />
          {/* Subtle gradient overlay to enhance typography contrast while maintaining cream paper texture */}
          <div className="absolute inset-0 bg-gradient-to-s from-[#FAF7F2]/95 via-[#FAF7F2]/60 to-transparent" />
        </div>

        {/* Content Container (placed on the start side over the calm cream area) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 pt-3 pb-6 sm:pt-10 sm:pb-14 lg:pt-16 lg:pb-20">
          <div className="max-w-xl text-start space-y-1.5 sm:space-y-4">
            {/* Editorial Metadata / Issue Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#5E6B5A]/30 bg-[#F4EFE6]/80 text-[#5E6B5A]">
              <VerifiedStampIcon size={12} color="#5E6B5A" />
              <span className="text-xs font-sans font-medium">
                مختارات العدد التحريري الموثق
              </span>
            </div>

            {/* Headline in Royal Amiri Serif */}
            <h1 className="font-serif font-bold text-xl sm:text-4xl lg:text-6xl text-[#1B1612] leading-[1.2]">
              {title}
            </h1>

            {/* Subtitle in Clean Arabic Sans */}
            <p className="font-sans text-sm sm:text-base text-[#554D46] leading-[1.75] line-clamp-2 sm:line-clamp-none max-w-lg">
              {subtitle}
            </p>

            {/* Editorial Underlined Link CTA (NOT a pill button per spec) */}
            <div className="pt-0.5 sm:pt-2">
              <button
                type="button"
                onClick={() => scrollTo('#mosaic')}
                className="group inline-flex items-center gap-1.5 min-h-[44px] text-xs sm:text-base font-serif font-semibold text-[#1B1612] border-b-2 border-[#1B1612] pb-0.5 hover:text-[#5E6B5A] hover:border-[#5E6B5A] transition-colors"
              >
                <span>اكتشفي روائع العدد الأسبوعي</span>
                <span className="rtl:-scale-x-100 transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowIcon size={14} color="currentColor" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

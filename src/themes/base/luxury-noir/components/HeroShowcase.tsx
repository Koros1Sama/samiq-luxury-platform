'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { ShieldCheckIcon, VerifiedCheckIcon, SparkleStarIcon } from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';

interface HeroShowcaseProps extends Partial<SectionComponentProps> {
  onCtaClick?: () => void;
}

export function HeroShowcase({ onCtaClick, section }: HeroShowcaseProps) {
  const { tenant } = useStorefront();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const title = (section?.props?.title as string) || tenant.name;
  const subtitle = (section?.props?.subtitle as string) || tenant.tagline;
  const badge = (section?.props?.badge as string) || tenant.heroBadge || 'مضمون أصلي 100%';

  return (
    <section className="relative overflow-hidden py-4 sm:py-8 lg:py-14 border-b border-white/5">
      {/* Background Golden Atmospheric Spotlight */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.15)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Text & Primary Value Proposition (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-start space-y-3 sm:space-y-4">
            {/* Authenticity Guarantee Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-gold/30 shadow-[0_2px_15px_rgba(201,168,76,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] sm:text-xs font-sans font-bold text-champagne">
                {badge}
              </span>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory leading-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-lg text-muted-lux font-sans leading-snug">
                {subtitle}
              </p>
            </div>

            {/* Compact Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onCtaClick) onCtaClick();
                  scrollTo('#products-catalog');
                }}
                className="group relative inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs sm:text-sm shadow-[0_5px_20px_rgba(201,168,76,0.4)] hover:scale-105 transition-all"
              >
                <span>تسوق الآن</span>
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#store-location')}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-surface/80 hover:bg-surface border border-white/10 hover:border-gold/40 text-ivory font-sans font-semibold text-xs sm:text-sm transition-all"
              >
                <ShieldCheckIcon size={16} color="#C9A84C" />
                <span>زورونا وتواصلوا معنا</span>
              </button>
            </div>

            {/* Quick Micro Trust Badges */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[10px] sm:text-xs text-muted-lux font-sans border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <VerifiedCheckIcon size={13} color="#C9A84C" />
                <span>فحص وتأكيد قبل الاستلام</span>
              </div>
              <div className="flex items-center gap-1.5">
                <VerifiedCheckIcon size={13} color="#C9A84C" />
                <span>توصيل سريع لكافة المناطق</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase (6 cols): Studio Photography with single LCP priority */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-full max-w-[480px] p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              <div className="relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#15151B] to-[#0A0A0E] overflow-hidden aspect-[16/9] sm:aspect-[16/10]">
                <SmartImage
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
                  alt={title}
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center mix-blend-luminosity brightness-95 contrast-110 opacity-90 transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/30 pointer-events-none" />

                {/* Micro Tag on Image */}
                <div className="absolute bottom-3 end-3 px-3 py-1 rounded-full bg-obsidian/90 border border-gold/40 backdrop-blur-md flex items-center gap-1.5 shadow-xl">
                  <SparkleStarIcon size={13} color="#E6CFA0" />
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-champagne">
                    المجموعة الملكية الموثقة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

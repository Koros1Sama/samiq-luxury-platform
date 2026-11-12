'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';
import { ShieldCheckIcon } from './LuxuryIcons';

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
    'مفتاح الجمال — لكشف المقلد والعناية الموثوقة';
  const subtitle =
    (tenant as any).heroSubtitle ||
    (section?.props?.subtitle as string) ||
    tenant.tagline ||
    'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.';

  const ctaText = isEn ? 'Explore Atelier' : 'استكشفي المجموعة المعتمدة';
  const mobileCta = isEn ? 'Shop Now' : 'تسوق الآن';

  return (
    <section className="relative overflow-hidden w-full min-h-[76px] md:min-h-[430px] lg:min-h-[480px] border-b border-white/[0.08] bg-[#070709] samiq-grain flex items-center">
      {/* Ambient Radial Bronze Glow (GPU-composited radial lighting) */}
      <div
        className="hidden md:block absolute -top-24 start-1/3 w-[680px] h-[420px] pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.14) 0%, rgba(201, 168, 76, 0.03) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-10 items-center">
          {/* Start Column: Haute-Couture Editorial Content */}
          <div className="relative z-20 md:col-span-7 flex flex-col justify-center text-start space-y-1 sm:space-y-2 md:space-y-5">
            {/* Desktop Atelier Credential Line (Omitted on tight mobile fold to protect Bar 1) */}
            <div className="hidden md:inline-flex items-center gap-2 self-start px-3.5 py-1 rounded-full bg-white/[0.03] border border-[#C9A84C]/30 text-xs font-sans text-champagne">
              <ShieldCheckIcon size={14} color="#C9A84C" />
              <span>
                {isEn
                  ? 'Authenticated Flagship · Yemen SBDMA Standards'
                  : 'الدار الموثقة · مطابقة لمعايير الهيئة العليا للأدوية'}
              </span>
            </div>

            {/* Primary Display Title */}
            <h1 className="text-sm sm:text-xl md:text-4xl lg:text-5xl font-serif font-bold text-ivory leading-[1.48] md:leading-[1.48] truncate md:whitespace-normal max-w-2xl">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="hidden sm:block text-xs md:text-base text-muted-lux font-sans leading-relaxed line-clamp-1 md:line-clamp-none max-w-xl">
              {subtitle}
            </p>

            {/* Primary CTA Row (Button-in-Button architectural pill on Desktop, sleek Pill on Mobile) */}
            <div className="pt-0.5 md:pt-1 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (onCtaClick) onCtaClick();
                  scrollTo('#products-catalog');
                }}
                className="group min-w-[44px] min-h-[44px] h-11 md:h-12 ps-4 pe-1.5 md:ps-6 md:pe-2 rounded-full bg-gradient-to-r from-[#BF953F] via-[#F2E2A8] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs md:text-sm shadow-[0_8px_28px_-6px_rgba(201,168,76,0.45)] hover:brightness-105 active:scale-[0.98] transition-all duration-300 ease-architectural flex items-center justify-center gap-3 self-start"
              >
                <span className="md:hidden">{mobileCta}</span>
                <span className="hidden md:inline">{ctaText}</span>
                <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#070709] text-[#F7E7B4] flex items-center justify-center rtl:-scale-x-100 transition-transform duration-300 ease-architectural group-hover:translate-x-[-2px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>

              <Link
                href="/authenticity-hub"
                className="hidden md:inline-flex min-h-[48px] px-5 rounded-full border border-white/15 hover:border-[#C9A84C]/50 bg-white/[0.02] hover:bg-white/[0.05] text-ivory hover:text-champagne font-sans font-semibold text-sm items-center gap-2 transition-all duration-300"
              >
                <span>{isEn ? 'Authenticity Lab' : 'مختبر كشف المقلد'}</span>
              </Link>
            </div>

            {/* Desktop Specification Ledger Strip */}
            <div className="hidden md:grid grid-cols-3 gap-4 pt-5 border-t border-white/[0.08] max-w-xl">
              <div>
                <span className="text-xs font-serif font-bold text-champagne block">فحص مخبري</span>
                <span className="text-xs font-sans text-muted-lux block mt-0.5">مطابقة الختم والباركود</span>
              </div>
              <div className="border-s border-white/[0.08] ps-4">
                <span className="text-xs font-serif font-bold text-champagne block">توصيل مبرد</span>
                <span className="text-xs font-sans text-muted-lux block mt-0.5">خلال ساعتين بصنعاء</span>
              </div>
              <div className="border-s border-white/[0.08] ps-4">
                <span className="text-xs font-serif font-bold text-champagne block">معاينة حرة</span>
                <span className="text-xs font-sans text-muted-lux block mt-0.5">الفحص الكامل قبل السداد</span>
              </div>
            </div>
          </div>

          {/* End Column / Mobile Atmospheric Backdrop: Single Unified LCP SmartImage */}
          <div className="absolute inset-0 md:static md:col-span-5 pointer-events-none md:pointer-events-auto">
            <div className="w-full h-full md:samiq-bezel-noir">
              <div className="relative w-full h-full md:h-[340px] lg:h-[380px] md:samiq-bezel-noir-inner overflow-hidden">
                <SmartImage
                  src={tenant.heroImages?.noir || '/media/hero/hero-noir.jpg'}
                  alt={title}
                  priority={true}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-center brightness-[0.65] md:brightness-95 contrast-105"
                />
                {/* Mobile Directional Obsidian Gradient Scrim */}
                <div className="md:hidden absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#070709] via-[#070709]/92 to-[#070709]/35" />
                {/* Desktop Subtle Atelier Bottom Brass Caption Strip */}
                <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#070709]/95 via-[#070709]/65 to-transparent items-end justify-between">
                  <div>
                    <span className="text-xs font-sans text-champagne/90 block">إصدار مفتاح الجمال الموثق</span>
                    <span className="text-sm font-serif font-bold text-ivory">نقاء مخبري 100% — صنعاء، حدة</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] shadow-[0_0_12px_#C9A84C]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

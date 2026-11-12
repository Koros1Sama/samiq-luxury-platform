'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';
import { ArrowIcon, VerifiedStampIcon } from './IvoryIcons';

export interface IvoryHeroProps extends Partial<SectionComponentProps> {
  section?: SectionComponentProps['section'];
}

/**
 * Editorial Magazine Cover Spread for Ivory Journal.
 * Single responsive SmartImage (priority=true) keeps mobile fold compact for Bar 1
 * while expanding into a full architectural double-spread on desktop.
 */
export function IvoryHero({ section }: IvoryHeroProps) {
  const { tenant, locale } = useStorefront();
  const isEn = locale === 'en';

  const title =
    (isEn ? (section?.props?.titleEn as string) : (section?.props?.title as string)) ||
    (isEn
      ? 'Pure clinical formulas, verified directly from authorized houses'
      : 'عناية فائقة وموثقة بالمعايير المخبرية لبشرتك');

  const subtitle =
    (isEn ? (section?.props?.subtitleEn as string) : (section?.props?.subtitle as string)) ||
    (isEn
      ? 'Curated skincare and dermatological essentials compliant with the Supreme Board of Drugs & Medical Appliances.'
      : 'مستحضرات عناية أصلية مفحوصة بعناية ومطابقة لاشتراطات الهيئة العليا للأدوية والمستلزمات الطبية، مع توثيق مباشر عبر فاتورتك.');

  const heroImageSrc = tenant.heroImages?.ivory || '/media/hero/hero-ivory.jpg';

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label={isEn ? 'Editorial Cover' : 'غلاف العدد الافتتاحي'}
      className="w-full bg-[#FAF7F2] border-b border-[#E8E2D8] overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-8 lg:py-12">
        <div className="grid grid-cols-12 gap-2.5 sm:gap-8 lg:gap-12 items-center">
          {/* Editorial Cover Manifesto (Cols 7 on Mobile beside thumb, 5 on Desktop) */}
          <div className="col-span-8 md:col-span-5 flex flex-col justify-center space-y-1 sm:space-y-5 text-start order-1">
            {/* Issue Stamp */}
            <div className="hidden sm:flex items-center gap-2.5 text-xs font-sans font-medium text-[#5E6B5A]">
              <VerifiedStampIcon size={15} color="#5E6B5A" />
              <span>
                {isEn
                  ? 'ISSUE 04 · SBDMA VERIFIED ARCHIVE'
                  : 'العدد ٠٤ · أرشيف الأصالة الموثق'}
              </span>
            </div>

            {/* Serif Headline */}
            <h1 className="font-serif font-bold text-sm sm:text-3xl lg:text-[40px] text-[#1B1612] leading-[1.38] sm:leading-[1.38] line-clamp-2 sm:line-clamp-none">
              {title}
            </h1>

            {/* Subtitle (Desktop) */}
            <p className="hidden md:block font-sans text-sm lg:text-base text-[#554D46] leading-[1.85] max-w-md">
              {subtitle}
            </p>

            {/* Hairline Rule & CTA Row */}
            <div className="pt-0.5 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-5 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => scrollTo('#mosaic')}
                className="min-h-[40px] sm:min-h-[44px] inline-flex items-center gap-2 font-sans font-bold text-xs sm:text-sm text-[#1B1612] border-b-2 border-[#1B1612] hover:text-[#5E6B5A] hover:border-[#5E6B5A] transition-colors"
              >
                <span>{isEn ? 'Browse the Index' : 'تصفحي مختارات العدد'}</span>
                <span className="rtl:-scale-x-100">
                  <ArrowIcon size={16} color="currentColor" />
                </span>
              </button>

              <a
                href="/authenticity-hub"
                className="hidden sm:inline-flex min-h-[44px] items-center px-4 py-2 rounded-full border border-[#D9D0C3] bg-[#F4EFE6] text-xs font-sans font-semibold text-[#554D46] hover:border-[#5E6B5A] hover:text-[#1B1612] transition-colors"
              >
                {isEn ? 'Verify Authenticity' : 'فحص مطابقة الهيئة'}
              </a>
            </div>
          </div>

          {/* Single Priority Editorial Photograph Frame */}
          <div className="col-span-4 md:col-span-7 order-2">
            <div className="p-1 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#F3ECE0] border border-[#E2D9CB] shadow-sm">
              <div className="relative w-full h-[76px] sm:h-auto sm:aspect-[4/3] md:aspect-[16/10] md:min-h-[380px] lg:min-h-[430px] rounded-lg sm:rounded-xl overflow-hidden bg-[#EAE2D6]">
                <SmartImage
                  src={heroImageSrc}
                  alt={title}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 42vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                />
                {/* Subtle Print Margin Caption on Desktop */}
                <div className="hidden lg:flex absolute bottom-4 inset-x-4 items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF7F2]/95 border border-[#E8E2D8] text-xs font-sans text-[#1B1612]">
                  <span className="font-semibold">
                    {isEn
                      ? `${tenant.name} — Clinical & Botanical Curation`
                      : `${tenant.name} — ملف الفحص والمطابقة السريرية`}
                  </span>
                  <span className="text-[#5E6B5A] font-mono font-bold tabular-nums">
                    SBDMA · 100%
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

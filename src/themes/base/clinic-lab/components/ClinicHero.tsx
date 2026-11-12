'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { ShieldCheckIcon, FlaskIcon } from './ClinicIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

export interface ClinicHeroProps {
  onExploreClick?: () => void;
}

/**
 * Swiss Clinical Laboratory Dossier Hero.
 * Compact mobile banner prevents headline/BiDi truncation and preserves Bar 1 fold
 * while desktop renders a precision 12-column laboratory dossier with verified specs.
 */
export function ClinicHero({ onExploreClick }: ClinicHeroProps) {
  const { tenant, locale } = useStorefront();
  const isEn = locale === 'en';
  const heroImageSrc = tenant.heroImages?.clinic || '/media/hero/hero-clinic.jpg';

  const scrollToCatalog = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const target = document.getElementById('products');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      aria-label={isEn ? 'Clinical Reference Protocol' : 'البروتوكول المرجعي السريري'}
      className="w-full bg-white border-b border-[#E2ECE9] overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-12 gap-2.5 sm:gap-6 lg:gap-10 items-center bg-[#F6FAF9] border border-[#D4E5E0] rounded-2xl p-2 sm:p-6 lg:p-8 shadow-xs">
          {/* Clinical Dossier Typography & Specs */}
          <div className="col-span-8 md:col-span-7 space-y-1 sm:space-y-4 text-start">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#CFE8E1] text-xs font-bold text-[#0F4C4A]">
              <ShieldCheckIcon size={15} />
              <span>
                {isEn
                  ? 'SBDMA Cold-Chain Reference Laboratory'
                  : 'مختبر مطابقة الهيئة العليا للأدوية · سلسلة حفظ مبردة'}
              </span>
            </div>

            <h1 className="text-sm sm:text-3xl lg:text-[38px] font-bold text-[#0F4C4A] leading-[1.38] sm:leading-[1.35] line-clamp-2 sm:line-clamp-none">
              {isEn
                ? 'Active Vitamin C10 & Derm-Grade Clinical Protocols'
                : 'بروتوكول فيتامين سي النقي والمستحضرات السريرية'}
            </h1>

            <p className="hidden md:block text-sm lg:text-base text-[#3F5352] leading-[1.8] max-w-2xl">
              {isEn
                ? 'Prescribed dermatological formulations screened batch-by-batch against counterfeit risks and thermal oxidation prior to cold-chain dispatch.'
                : 'تركيبات جلدية علاجية مفحوصة تشغيلة بتشغيلة ضد مخاطر التقليد والأكسدة الحرارية، مع توازن حموضة سريري وتوثيق رسمي على كل عبوة.'}
            </p>

            {/* Swiss Protocol Metrics Ledger (Desktop / Tablet) */}
            <div className="hidden md:grid grid-cols-3 gap-3 pt-1 max-w-xl">
              <div className="p-3 rounded-xl bg-white border border-[#DCEAE6]">
                <span className="block text-xs text-[#546E6C]">توازن الأس الهيدروجيني</span>
                <span dir="ltr" className="block text-sm font-mono font-bold text-[#0F4C4A] mt-0.5 tabular-nums">
                  pH 3.2 – 5.5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#DCEAE6]">
                <span className="block text-xs text-[#546E6C]">النقل والتخزين المبرد</span>
                <span dir="ltr" className="block text-sm font-mono font-bold text-[#0F4C4A] mt-0.5 tabular-nums">
                  2°C – 8°C
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#DCEAE6]">
                <span className="block text-xs text-[#546E6C]">نسبة المطابقة السريرية</span>
                <span className="block text-sm font-mono font-bold text-[#0F4C4A] mt-0.5 tabular-nums">
                  100% SBDMA
                </span>
              </div>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="min-h-[44px] px-4 sm:px-6 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <FlaskIcon size={16} />
                <span>{isEn ? 'Browse Prescriptions' : 'استعراض المستحضرات'}</span>
              </button>

              <a
                href="/authenticity-hub"
                className="hidden sm:inline-flex min-h-[44px] px-4 rounded-xl bg-white hover:bg-[#EDF5F3] border border-[#C6DCD7] text-[#0F4C4A] text-xs sm:text-sm font-bold items-center transition-colors"
              >
                {isEn ? 'Verify Formulation' : 'فحص التشغيلة والأصالة'}
              </a>
            </div>
          </div>

          {/* Single Responsive Specimen Plate */}
          <div className="col-span-4 md:col-span-5">
            <div className="p-1 sm:p-2 rounded-xl sm:rounded-2xl bg-white border border-[#D4E5E0] shadow-xs">
              <div className="relative w-full h-[76px] sm:h-auto sm:aspect-[4/3] md:min-h-[320px] lg:min-h-[360px] rounded-lg sm:rounded-xl overflow-hidden bg-[#EAF3F1]">
                <SmartImage
                  src={heroImageSrc}
                  alt={isEn ? 'Verified Clinical Formulation' : 'مستحضر سريري موثق'}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 36vw, 44vw"
                  className={
                    heroImageSrc === '/media/hero/hero-clinic.jpg'
                      ? 'object-cover object-[12%_50%] scale-105 md:scale-[1.35] md:origin-[14%_52%]'
                      : 'object-cover object-center'
                  }
                />
                <div className="hidden lg:flex absolute bottom-3 inset-x-3 items-center justify-between px-3 py-2 rounded-lg bg-white/95 border border-[#D4E5E0] text-xs text-[#0F4C4A]">
                  <span className="font-bold">معمل {tenant.name} السريري</span>
                  <span dir="ltr" className="font-mono font-bold tabular-nums">PURE LAB · ISO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

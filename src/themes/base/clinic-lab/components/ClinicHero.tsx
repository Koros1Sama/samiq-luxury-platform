'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { ShieldCheckIcon, FlaskIcon } from './ClinicIcons';

interface ClinicHeroProps {
  onExploreClick?: () => void;
}

export function ClinicHero({ onExploreClick }: ClinicHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F7F5] to-white border-b border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-6 lg:py-8">
        <div className="flex flex-row sm:grid sm:grid-cols-12 gap-3 sm:gap-6 items-center justify-between">
          {/* Start Side: Text Content */}
          <div className="flex-1 min-w-0 sm:col-span-7 flex flex-col items-start gap-1 sm:gap-2.5 text-start">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#CFE8E1] border border-[#0F4C4A]/20 text-[#0F4C4A] text-xs font-bold">
              <ShieldCheckIcon size={14} />
              <span>فحص مخبري معتمد · لكشف المقلد</span>
            </div>

            {/* Headline */}
            <h1 className="text-sm sm:text-2xl lg:text-3xl font-bold text-[#0F4C4A] leading-tight truncate sm:whitespace-normal">
              مفتاح الجمال — فحص الأصالة والعناية السريرية
            </h1>

            {/* Subtitle - Hidden on mobile (< sm) to preserve fold height for >= 3 product rows */}
            <p className="hidden sm:block text-sm sm:text-base text-[#4A5568] leading-[1.75] max-w-xl">
              تركيبات علاجية نقية بتركيزات مدروسة وموثقة برقم التشغيلة الرسمي في اليمن. نوفر روتيناً سريرياً مخصصاً لبشرتك مع فحص الأصالة وكشف المقلد.
            </p>

            {/* Micro subtitle on mobile */}
            <span className="sm:hidden text-xs text-[#4A5568] leading-tight truncate">
              مفتاح الجمال · تركيبات علاجية نقية لكشف المقلد
            </span>

            {/* Quick Metrics (Desktop / Tablet) */}
            <div className="hidden sm:flex flex-wrap items-center gap-3 pt-1 text-xs text-[#0F4C4A] font-semibold">
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#D4E5E0]">
                <FlaskIcon size={14} />
                تركيزات فعالة ونقية
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#D4E5E0]">
                <ShieldCheckIcon size={14} />
                تتبع رقم الدفعة والباركود
              </span>
            </div>
          </div>

          {/* End Side: Exactly ONE SmartImage for LCP across all screens */}
          <div className="w-16 h-16 sm:w-full sm:h-48 lg:h-60 sm:col-span-5 relative rounded-xl sm:rounded-2xl overflow-hidden border border-[#D4E5E0] shadow-xs shrink-0">
            <SmartImage
              src="/media/hero/hero-clinic.jpg"
              alt="معمل ومختبر الجمال السريري"
              fill
              priority={true}
              sizes="(max-width: 640px) 64px, (max-width: 1024px) 50vw, 40vw"
              className="object-cover object-center"
            />
            <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#0F4C4A]/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

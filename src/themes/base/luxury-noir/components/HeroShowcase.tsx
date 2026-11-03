import React from 'react';
import Image from 'next/image';
import { ShieldCheckIcon, VerifiedCheckIcon, SparkleStarIcon } from './LuxuryIcons';

interface HeroShowcaseProps {
  onCtaClick?: () => void;
}

export function HeroShowcase({ onCtaClick }: HeroShowcaseProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Background Golden Atmospheric Spotlight */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.18)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Text & Primary Value Proposition (6 cols) */}
          <div className="lg:col-span-6 text-center lg:text-start space-y-6">
            {/* Authenticity Guarantee Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface border border-gold/30 shadow-[0_2px_15px_rgba(201,168,76,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-sans font-bold text-champagne tracking-normal">
                مضمون أصلي 100% — فحص باركود ورقم تشغيلة موثق
              </span>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-ivory tracking-normal leading-[1.25]">
                مفتاح الجمال{' '}
                <span className="text-gold/80 font-normal">—</span>
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-champagne drop-shadow-[0_2px_10px_rgba(201,168,76,0.25)]">
                بوابتك الموثوقة لعالم الجمال
              </p>
            </div>

            {/* Sub-description */}
            <p className="text-sm sm:text-base text-muted-lux font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed">
              نوفر لكِ أرقى مستحضرات العناية بالبشرة والمكياج والعطور العالمية الأصلية
              المضمونة مع دليل مرئي تفاعلي يكشف الفرق الدقيق بين الأصلي والتقليد المغشوش.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#featured-products"
                onClick={onCtaClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-base shadow-[0_10px_35px_-5px_rgba(201,168,76,0.5)] hover:shadow-[0_15px_40px_-2px_rgba(201,168,76,0.7)] hover:scale-105 transition-all duration-300"
              >
                <span>تسوقي الآن</span>
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
              </a>

              <a
                href="#authenticity-slider"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-surface/80 hover:bg-surface border border-white/10 hover:border-gold/40 text-ivory font-sans font-semibold text-sm transition-all duration-300"
              >
                <ShieldCheckIcon size={18} color="#C9A84C" />
                <span>دليل كشف التقليد</span>
              </a>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-lux font-sans border-t border-white/5">
              <div className="flex items-center gap-2">
                <VerifiedCheckIcon size={15} color="#C9A84C" />
                <span>فحص الباركود المباشر</span>
              </div>
              <div className="flex items-center gap-2">
                <VerifiedCheckIcon size={15} color="#C9A84C" />
                <span>توصيل سريع بصنعاء والمحافظات</span>
              </div>
              <div className="flex items-center gap-2">
                <VerifiedCheckIcon size={15} color="#C9A84C" />
                <span>استشارة مجانية للبشرة</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase: Studio Photography & Marble Pedestal Composition (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Outer Double-Bezel Frame */}
            <div className="relative w-full max-w-[520px] p-2 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              <div className="relative rounded-[calc(2rem-0.5rem)] bg-gradient-to-b from-[#15151B] to-[#0A0A0E] overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                {/* Real High-Fashion Luxury Cosmetic Photography Asset */}
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
                  alt="مجموعة مفتاح الجمال الفاخرة"
                  fill
                  priority
                  className="object-cover object-center mix-blend-luminosity brightness-95 contrast-110 opacity-90 transition-transform duration-700 hover:scale-105"
                />

                {/* Dark Vignette & Gold Atmospheric Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#070709]/30 to-[#070709]/90 pointer-events-none" />

                {/* Floating Agency Micro-Badge */}
                <div className="absolute bottom-5 end-5 px-4 py-2 rounded-full bg-obsidian/90 border border-gold/40 backdrop-blur-md flex items-center gap-2.5 shadow-2xl z-10">
                  <SparkleStarIcon size={16} color="#E6CFA0" />
                  <span className="text-xs font-sans font-bold text-champagne">
                    المجموعة الملكية الحصرية
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

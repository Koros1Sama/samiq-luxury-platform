'use client';

import React, { useState } from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SmartImage } from '@/core/ui/SmartImage';
import { getProductQuickInfo } from '@/core/storefront/productQuickInfo';
import {
  DropletIcon,
  FlaskIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BagIcon,
  CheckIcon,
} from './ClinicIcons';

interface SkinRoutineStep {
  stepNumber: string;
  phaseAr: string;
  textAr: string;
}

interface RoutineSkinType {
  id: string;
  label: string;
  tagline: string;
  routineDescription: string;
  steps: string[];
  recommendedProductIds: string[];
}

const DEFAULT_ROUTINE_DATA: Record<string, RoutineSkinType> = {
  oily: {
    id: 'oily',
    label: 'البشرة الدهنية',
    tagline: 'تنظيم الإفرازات الزهمية وتضييق المسام',
    routineDescription: 'بروتوكول سريري يوازن دهون البشرة دون تجفيف الحاجز الواقي.',
    steps: [
      'تنظيف عميق صباحاً ومساءً بغسول رغوي لطيف يحتوي على النياسيناميد والزنك.',
      'تطبيق سيروم النياسيناميد 10% بقطرات متساوية لتنظيم الإفرازات وتوحيد المسام.',
      'ترطيب بجل مائي غير زيتي مع حماية شمسية واسعة النطاق وخالية من اللمعان.',
    ],
    recommendedProductIds: ['prod-2', 'prod-3'],
  },
  dry: {
    id: 'dry',
    label: 'البشرة الجافة',
    tagline: 'ترطيب عميق ودعم حاجز السيراميدات الواقي',
    routineDescription: 'بروتوكول سريري مكثف لاستعادة مرونة البشرة وحبس الرطوبة 24 ساعة.',
    steps: [
      'غسول كريمي مغذٍ بالسيراميد خالي من الصابون والعطور يحافظ على رطوبة الجلد.',
      'سيروم فيتامين سي أو حمض الهيالورونيك النقي لضخ الامتلاء والترطيب العميق.',
      'كريم ترطيب مكثف غني بالسيراميدات ثلاثية المفعول لقفل الرطوبة طوال اليوم.',
    ],
    recommendedProductIds: ['prod-1', 'prod-2', 'prod-6'],
  },
  sensitive: {
    id: 'sensitive',
    label: 'البشرة الحساسة',
    tagline: 'تهدئة الاحمرار وتدعيم المناعة الجلدية',
    routineDescription: 'بروتوكول سريري مهدئ فائق اللطف خالٍ من المهيجات والعطور.',
    steps: [
      'تنظيف سريري فائق الهدوء بتركيبة غير رغوية لا تسبب أي وخز أو تهيج.',
      'سيروم مهدئ مدعم بالنياسيناميد بنسبة متوازنة لتخفيف الاحمرار والحكة.',
      'مرطب ترميمي بمركبات حيوية مهدئة وواقي شمس فيزيائي نقي 100%.',
    ],
    recommendedProductIds: ['prod-2', 'prod-6'],
  },
};

const STEP_LABELS = [
  { stepNumber: '01', phaseAr: 'تنظيف وتطهير' },
  { stepNumber: '02', phaseAr: 'علاج وتركيز فعال' },
  { stepNumber: '03', phaseAr: 'ترطيب وحماية الحاجز' },
];

export function ClinicRoutineSteps() {
  const { products, cart, currency } = useStorefront();
  const [activeSkin, setActiveSkin] = useState<'oily' | 'dry' | 'sensitive'>('oily');

  const currentRoutine = DEFAULT_ROUTINE_DATA[activeSkin] || DEFAULT_ROUTINE_DATA.oily;
  const recommendedProducts = products.filter((p) =>
    currentRoutine.recommendedProductIds.includes(p.id)
  );

  return (
    <section id="routine" className="w-full py-8 sm:py-12 bg-white border-t border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CFE8E1] text-[#0F4C4A] text-xs font-bold mb-2">
              <FlaskIcon size={14} />
              <span>البروتوكول السريري المتسلسل</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0F4C4A] leading-tight">
              خطوات الروتين السريري اليومي
            </h2>
            <p className="text-sm text-[#4A5568] leading-[1.75] mt-1 max-w-xl">
              تسلسل علاجي موثق علمياً لتحقيق أفضل نتيجة تآزرية بين المواد الفعالة دون تعارض
            </p>
          </div>

          {/* Skin Type Switcher for Routine */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F2F7F5] border border-[#D4E5E0] self-start sm:self-auto">
            {(['oily', 'dry', 'sensitive'] as const).map((typeKey) => (
              <button
                key={typeKey}
                type="button"
                onClick={() => setActiveSkin(typeKey)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] ${
                  activeSkin === typeKey
                    ? 'bg-white text-[#0F4C4A] shadow-xs border border-[#0F4C4A]/30'
                    : 'text-[#4A5568] hover:text-[#0F4C4A]'
                }`}
              >
                {DEFAULT_ROUTINE_DATA[typeKey].label}
              </button>
            ))}
          </div>
        </div>

        {/* Routine Sequence Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {currentRoutine.steps.map((stepText, idx) => {
            const meta = STEP_LABELS[idx] || { stepNumber: `0${idx + 1}`, phaseAr: 'خطوة علاجية' };
            const relatedProduct = recommendedProducts[idx];
            const info = relatedProduct ? getProductQuickInfo(relatedProduct, currency) : null;

            return (
              <div
                key={idx}
                className="bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-4 sm:p-5 flex flex-col justify-between gap-4 text-start hover:border-[#0F4C4A]/40 transition-colors shadow-xs"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-10 h-10 rounded-xl bg-[#0F4C4A] text-white flex items-center justify-center font-bold text-sm tracking-normal">
                      {meta.stepNumber}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-[#D4E5E0] text-[#0F4C4A]">
                      {meta.phaseAr}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-[#2D3748] leading-[1.75]">
                    {stepText}
                  </p>
                </div>

                {/* Recommended Product Box for this Step */}
                {relatedProduct && info && (
                  <div className="mt-2 pt-3 border-t border-[#D4E5E0] bg-white p-3 rounded-xl border border-[#E2ECE9] flex items-center justify-between gap-2.5">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#E2ECE9] shrink-0 bg-[#F2F7F5]">
                      <SmartImage
                        src={relatedProduct.image}
                        alt={relatedProduct.title}
                        fill
                        priority={false}
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-[#0F4C4A] block truncate">
                        {relatedProduct.title}
                      </span>
                      <span className="text-xs font-semibold text-[#0F4C4A]">
                        {info.formattedPrice}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.add(relatedProduct)}
                      className="min-w-[40px] min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[#0F4C4A] text-white hover:bg-[#0B3A38] inline-flex items-center justify-center text-xs font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                      aria-label={`إضافة ${relatedProduct.title} للروتين`}
                    >
                      <BagIcon size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

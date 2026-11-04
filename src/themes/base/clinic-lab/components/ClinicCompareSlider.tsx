'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { ShieldCheckIcon, ShieldAlertIcon, CheckIcon, CloseIcon } from './ClinicIcons';

interface InspectionPoint {
  title: string;
  originalFeature: string;
  fakeRisk: string;
}

const DEFAULT_INSPECTION_POINTS: InspectionPoint[] = [
  {
    title: 'قوام ولون السيروم النقي',
    originalFeature: 'سائل ذهبي شفاف خفيف الامتصاص بتركيز ثابت لا يترك لزوجة دهنية.',
    fakeRisk: 'سائل معكر مائل للاصفرار الداكن مع رغوة لزجة ورائحة كيميائية نفاذة.',
  },
  {
    title: 'الباركود والطباعة الليزرية',
    originalFeature: 'طباعة ليزرية بارزة ودقيقة لكود الدفعة تطابق البيانات الرسمية للمختبر.',
    fakeRisk: 'طباعة حبرية باهتة غير واضحة يمكن مسحها بسهولة أو باركود عشوائي.',
  },
  {
    title: 'زجاج العبوة والقطارة الطبية',
    originalFeature: 'زجاج طبي معتم عازل للضوء لحماية التركيبة من الأكسدة مع قطارة محكمة.',
    fakeRisk: 'زجاج شفاف رادئ ومطاط خفيف يتفتت أو يتغير لونه بسرعة.',
  },
];

interface ClinicCompareSliderProps {
  guideData?: {
    originalImage?: string;
    fakeImage?: string;
    points?: InspectionPoint[];
  };
}

export function ClinicCompareSlider({ guideData }: ClinicCompareSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const points = guideData?.points || DEFAULT_INSPECTION_POINTS;
  const originalImage = guideData?.originalImage || '/media/products/serum-vitamin-c.jpg';
  const fakeImage = guideData?.fakeImage || '/media/products/serum-niacinamide.jpg';

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  return (
    <div className="w-full bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-4 sm:p-6 lg:p-8 mt-6">
      {/* Title */}
      <div className="text-start mb-6">
        <span className="text-xs font-bold text-[#0F4C4A] uppercase tracking-normal">
          دليل التمييز السريري
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-[#0F4C4A] mt-1">
          مقارنة العبوة الأصلية بالنسخ المقلدة
        </h3>
        <p className="text-sm text-[#4A5568] leading-[1.75] mt-1">
          اسحبي المؤشر لمعاينة الفروقات المخبرية بين المنتج المعتمد والمنتجات المغشوشة
        </p>
      </div>

      {/* Visual Comparison Splitter */}
      <div
        ref={containerRef}
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden select-none cursor-ew-resize border border-[#D4E5E0] bg-white shadow-xs"
      >
        {/* Left Layer: Fake / Coral Alert */}
        <div className="absolute inset-0 w-full h-full">
          <SmartImage
            src={fakeImage}
            alt="المنتج المقلد غير المعتمد"
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover object-center filter grayscale contrast-125"
          />
          <div className="absolute top-3 end-3 px-3 py-1 rounded-lg bg-[#D9534F] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <ShieldAlertIcon size={16} />
            <span>مقلد مغشوش</span>
          </div>
        </div>

        {/* Right Layer (Clipped): Original / Teal */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <SmartImage
            src={originalImage}
            alt="المنتج الأصلي المعتمد"
            fill
            priority={false}
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover object-center"
          />
          <div className="absolute top-3 start-3 px-3 py-1 rounded-lg bg-[#0F4C4A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <ShieldCheckIcon size={16} />
            <span>أصلي معتمد 100%</span>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#0F4C4A] shadow-md flex items-center justify-center text-[#0F4C4A]">
            <span className="text-xs font-bold leading-none">⇄</span>
          </div>
        </div>
      </div>

      {/* Inspection Checklist Table */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {points.map((pt, idx) => (
          <div
            key={idx}
            className="bg-white p-3.5 rounded-xl border border-[#E2ECE9] flex flex-col gap-2 text-start"
          >
            <span className="text-xs font-bold text-[#0F4C4A] block border-b border-[#F2F7F5] pb-1.5">
              {pt.title}
            </span>

            {/* Original Standard */}
            <div className="flex items-start gap-1.5 text-xs text-[#0F4C4A]">
              <div className="w-4 h-4 rounded-full bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center shrink-0 mt-0.5">
                <CheckIcon size={12} />
              </div>
              <span className="leading-[1.75]">{pt.originalFeature}</span>
            </div>

            {/* Fake Risk */}
            <div className="flex items-start gap-1.5 text-xs text-[#D9534F] pt-1 border-t border-[#F2F7F5]">
              <div className="w-4 h-4 rounded-full bg-[#D9534F]/15 text-[#D9534F] flex items-center justify-center shrink-0 mt-0.5">
                <CloseIcon size={12} />
              </div>
              <span className="leading-[1.75]">{pt.fakeRisk}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

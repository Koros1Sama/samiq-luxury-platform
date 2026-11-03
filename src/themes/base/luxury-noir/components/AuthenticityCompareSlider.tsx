'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { AuthenticityComparisonData } from '../../../contract';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  CrossWarningIcon,
  PlayVideoIcon,
  CloseIcon,
} from './LuxuryIcons';

interface AuthenticityCompareSliderProps {
  guideData: AuthenticityComparisonData;
}

export function AuthenticityCompareSlider({ guideData }: AuthenticityCompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="authenticity-lab" className="py-12 sm:py-20 bg-surface/50 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <ShieldCheckIcon size={15} color="#C9A84C" />
            <span>مختبر مفتاح الجمال لكشف المقلد</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-ivory">
            الأصلي <span className="text-champagne">لكشف</span> المقلد
          </h2>
          <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
            اسحبي المقبض التفاعلي لمشاهدة الفرق الدقيق بالعين المجردة بين المنتج الأصلي
            المضمون والعبوة المغشوشة المنتشرة في الأسواق.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Slider Comparator Interactive Frame (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Top Bar Indicators */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-obsidian/80 rounded-t-2xl border-b border-white/5">
                <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold text-xs sm:text-sm">
                  <VerifiedCheckIcon size={16} color="#34D399" />
                  <span>الأصلي المضمون</span>
                </div>
                <span className="text-xs text-muted-lux font-sans">
                  {guideData.productTitle}
                </span>
                <div className="flex items-center gap-2 text-rose-400 font-sans font-bold text-xs sm:text-sm">
                  <span>التقليد المغشوش</span>
                  <CrossWarningIcon size={16} color="#FB7185" />
                </div>
              </div>

              {/* Interactive Image Split View Container */}
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                className="relative h-[360px] sm:h-[420px] w-full overflow-hidden select-none cursor-ew-resize rounded-b-2xl bg-[#09090D]"
              >
                {/* 1. RIGHT SIDE: Fake / Counterfeit Product Studio Photographic Render */}
                <div className="absolute inset-0 w-full h-full bg-[#111016] flex items-center justify-center p-6">
                  <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                    <Image
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                      alt="التقليد المغشوش"
                      fill
                      className="object-cover object-center filter blur-[0.5px] contrast-75 brightness-75 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-rose-950/40 mix-blend-multiply" />
                    <div className="absolute top-4 end-4 px-3 py-1 rounded-md bg-rose-950/90 border border-rose-500/40 text-xs text-rose-300 font-sans font-bold">
                      بديل مغشوش: رغوة + بدون Batch
                    </div>
                  </div>
                </div>

                {/* 2. LEFT SIDE: Original Genuine Product Photographic Render (Clipped) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#0A0D0E] flex items-center justify-center p-6 border-e border-[#C9A84C]"
                  style={{
                    clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                    <Image
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
                      alt="الأصلي المضمون"
                      fill
                      className="object-cover object-center contrast-110 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gold/10 mix-blend-overlay" />
                    <div className="absolute top-4 start-4 px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-xs text-emerald-300 font-sans font-bold flex items-center gap-1.5">
                      <VerifiedCheckIcon size={14} color="#34D399" />
                      <span>الأصلي: BATCH 54U700</span>
                    </div>
                  </div>
                </div>

                {/* 3. CENTER DRAGGABLE HANDLE DIVIDER */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FCF6BA] via-[#C9A84C] to-[#B38728] shadow-[0_0_12px_#C9A84C] pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] border-2 border-white shadow-[0_0_15px_rgba(201,168,76,0.8)] flex items-center justify-center text-obsidian-dark font-bold text-xs select-none">
                    ⟨ ⟩
                  </div>
                </div>
              </div>

              {/* Slider Bottom Helper Note */}
              <div className="px-4 py-2.5 bg-obsidian/90 rounded-b-2xl border-t border-white/5 flex items-center justify-between text-xs text-muted-lux font-sans">
                <span className="flex items-center gap-1">
                  <span>اسحبي يميناً ويساراً للمقارنة</span>
                </span>
                <span className="text-gold font-medium">
                  موضع الفحص: {Math.round(sliderPosition)}%
                </span>
              </div>
            </div>
          </div>

          {/* Checklist of Authenticity Markers (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-sans text-gold font-semibold uppercase tracking-wider">
                معايير الفحص المعتمدة
              </span>
              <h3 className="text-2xl font-serif font-bold text-ivory">
                كيف تكتشفين المنتج الأصلي في 10 ثوانٍ؟
              </h3>
            </div>

            <div className="space-y-3">
              {guideData.checklist.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-surface border border-white/5 hover:border-gold/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-ivory">
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-400 font-sans flex items-center gap-1.5">
                        <VerifiedCheckIcon size={13} color="#34D399" />
                        <span>الأصلي: {item.originalFeature}</span>
                      </p>
                      <p className="text-xs text-rose-400 font-sans flex items-center gap-1.5">
                        <CrossWarningIcon size={13} color="#FB7185" />
                        <span>المغشوش: {item.fakeRisk}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Verification Trigger Button & Official Social Links */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="w-full py-3 px-4 rounded-2xl bg-surface hover:bg-surface-elevated border border-gold/40 text-ivory font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md group"
              >
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition shrink-0">
                  <PlayVideoIcon size={12} color="#C9A84C" />
                </div>
                <span>مشاهدة شروحات فحص القوام والعبوة</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <a
                  href="https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-champagne text-center font-semibold transition truncate"
                >
                  مقاطع تيك توك (@tamiffttah) ←
                </a>
                <a
                  href="https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-champagne text-center font-semibold transition truncate"
                >
                  إنستغرام (@tamifttah) ←
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Verification Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-gold/40 shadow-2xl p-6 text-ivory">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <PlayVideoIcon size={20} color="#C9A84C" />
                <h3 className="text-lg font-serif font-bold text-ivory">
                  فيديو فحص وتدقيق سيروم الأصلي مقابل التقليد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux text-sm"
              >
                <CloseIcon size={16} color="#9A968E" />
              </button>
            </div>

            {/* Video simulation preview */}
            <div className="my-5 rounded-2xl bg-black aspect-video flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
              <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center text-gold shadow-[0_0_25px_rgba(201,168,76,0.5)]">
                <PlayVideoIcon size={26} color="#C9A84C" />
              </div>
              <p className="text-xs text-champagne mt-4 font-sans font-semibold">
                شرح عملي من خبراء متجر مفتاح الجمال (صنعاء)
              </p>
              <p className="text-[11px] text-muted-lux mt-1">
                رقم الباتش الموثق: 54U700 — تجربة القوام الفوري على ظهر اليد
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-6 py-2.5 rounded-xl bg-gold text-obsidian-dark font-sans font-bold text-xs"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

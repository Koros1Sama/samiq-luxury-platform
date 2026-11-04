'use client';

import React, { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { SmartImage } from '@/core/ui/SmartImage';
import { AuthenticityComparisonData } from '@/modules/blocks/types';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { useBatchVerifier } from '@/core/storefront/useBatchVerifier';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  CrossWarningIcon,
  PlayVideoIcon,
  WhatsAppIcon,
} from './LuxuryIcons';

const VideoVerificationModal = dynamic(
  () => import('./VideoVerificationModal').then((m) => m.VideoVerificationModal),
  { ssr: false }
);

interface AuthenticityCompareSliderProps {
  guideData?: AuthenticityComparisonData;
}

export function AuthenticityCompareSlider(props: AuthenticityCompareSliderProps) {
  const sf = useStorefront();
  const guideData = props.guideData || (sf.blocksData['authenticity-compare'] as AuthenticityComparisonData);

  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core headless batch verifier hook
  const {
    batchCode,
    setBatchCode,
    verify,
    isVerifying,
    result,
    error,
    reset,
  } = useBatchVerifier();

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

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify();
  };

  if (!guideData) return null;

  return (
    <section id="authenticity-lab" className="py-8 sm:py-16 bg-[#0E0E12]/80 border-y border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ==================================================================== */}
        {/* 1. Header & Batch Code Verifier Card                                 */}
        {/* ==================================================================== */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <ShieldCheckIcon size={16} color="#C9A84C" />
            <span>مختبر مفتاح الجمال لكشف المقلد</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-ivory">
            التحقق من رقم التشغيلة <span className="text-champagne">(Batch Code)</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
            أدخلي رقم الدفعة المطبوع أسفل العبوة للتحقق الفوري من تاريخ الصنع، المطابقة المخبرية، وسجل الاستيراد الرسمي.
          </p>
        </div>

        {/* Verifier Form Card */}
        <div className="max-w-2xl mx-auto p-4 sm:p-6 rounded-3xl bg-[#121218] border border-gold/30 shadow-2xl space-y-4">
          <form onSubmit={onVerifySubmit} className="flex flex-col sm:flex-row gap-2.5 items-stretch">
            <input
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              placeholder="مثال: 54U700 أو 22T301 أو 48X902..."
              className="flex-1 min-h-[44px] px-4 rounded-2xl bg-[#070709] border border-white/10 text-xs sm:text-sm text-ivory placeholder-muted-lux outline-none focus:border-gold transition font-mono uppercase"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="min-h-[44px] min-w-[44px] px-6 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon size={16} color="#070709" />
              <span>{isVerifying ? 'جاري الفحص...' : 'فحص التشغيلة'}</span>
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-sans">
              {error}
            </div>
          )}

          {/* Verification Result Area */}
          {result && (
            <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-3 animate-fadeIn">
              {result.success && result.verification ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold text-xs sm:text-sm">
                    <VerifiedCheckIcon size={18} color="#34D399" />
                    <span>دفعة أصلية موثقة ومطابقة لمواصفات الصانع</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs font-sans">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">الماركة:</span>
                      <span className="text-ivory font-bold">{result.verification.brand}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">المستحضر:</span>
                      <span className="text-ivory font-bold">{result.verification.productName}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">رقم الدفعة:</span>
                      <span className="text-champagne font-mono font-bold">{result.verification.batchCode}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">تاريخ الإنتاج:</span>
                      <span className="text-ivory">{result.verification.manufactureDate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">مدة الصلاحية:</span>
                      <span className="text-ivory">{result.verification.shelfLife}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-muted-lux block">الحالة:</span>
                      <span className="text-emerald-400 font-bold">{result.verification.statusNotes}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-sans font-bold text-xs sm:text-sm">
                    <CrossWarningIcon size={18} color="#FBBF24" />
                    <span>تنبيه: {result.message}</span>
                  </div>
                  <p className="text-xs text-muted-lux font-sans leading-relaxed">
                    إذا اشتريتِ هذا المنتج من متجر آخر وترغبين في فحصه مخبرياً، يسعدنا استقبالك في فرع حدة أو عبر واتساب.
                  </p>
                  <a
                    href="https://wa.me/967775234989"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-sans font-bold text-xs inline-flex items-center gap-2"
                  >
                    <WhatsAppIcon size={16} color="#25D366" />
                    <span>إرسال صورة الباركود لخبير المتجر</span>
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={reset}
                  className="min-h-[40px] px-3 text-xs text-muted-lux hover:text-ivory font-sans transition"
                >
                  فحص رقم آخر
                </button>
                <a
                  href="#authenticity-compare"
                  className="min-h-[40px] px-3 text-xs text-champagne hover:text-ivory font-sans font-bold transition flex items-center gap-1"
                >
                  <span>مقارنة العبوة والشكل بالأسفل</span>
                  <span>↓</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 2. Interactive Comparison Slider Section                             */}
        {/* ==================================================================== */}
        <div id="authenticity-compare" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4">
          {/* Slider Comparator Interactive Frame (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Top Bar Indicators */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#070709] rounded-t-2xl border-b border-white/5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-sans font-bold text-xs sm:text-sm">
                  <VerifiedCheckIcon size={16} color="#34D399" />
                  <span>الأصلي المضمون</span>
                </div>
                <span className="text-xs text-muted-lux font-sans truncate max-w-[140px] sm:max-w-none">
                  {guideData.productTitle}
                </span>
                <div className="flex items-center gap-1.5 text-rose-400 font-sans font-bold text-xs sm:text-sm">
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
                className="relative h-[320px] sm:h-[400px] w-full overflow-hidden select-none cursor-ew-resize rounded-b-2xl bg-[#09090D]"
              >
                {/* 1. RIGHT SIDE: Fake / Counterfeit Product Studio Photographic Render */}
                <div className="absolute inset-0 w-full h-full bg-[#111016] flex items-center justify-center p-4 sm:p-6">
                  <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                    <SmartImage
                      src={guideData.counterfeit?.image || '/media/products/serum-vitamin-c.jpg'}
                      alt="التقليد المغشوش"
                      fill
                      priority={false}
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover object-center filter blur-[0.5px] contrast-75 brightness-75 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-rose-950/40 mix-blend-multiply" />
                    <div className="absolute top-3 end-3 px-3 py-1 rounded-md bg-rose-950/90 border border-rose-500/40 text-xs text-rose-300 font-sans font-bold">
                      بديل مغشوش: رغوة + بدون Batch
                    </div>
                  </div>
                </div>

                {/* 2. LEFT SIDE: Original Genuine Product Photographic Render (Clipped) */}
                <div
                  className="absolute inset-0 w-full h-full bg-[#0A0D0E] flex items-center justify-center p-4 sm:p-6 border-e border-[#C9A84C]"
                  style={{
                    clipPath: `polygon(0% 0%, ${sliderPosition}% 0%, ${sliderPosition}% 100%, 0% 100%)`,
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                    <SmartImage
                      src={guideData.original?.image || '/media/products/serum-vitamin-c.jpg'}
                      alt="الأصلي المضمون"
                      fill
                      priority={false}
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover object-center contrast-110 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gold/10 mix-blend-overlay" />
                    <div className="absolute top-3 start-3 px-3 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-xs text-emerald-300 font-sans font-bold flex items-center gap-1.5">
                      <VerifiedCheckIcon size={14} color="#34D399" />
                      <span>الأصلي: BATCH 54U700</span>
                    </div>
                  </div>
                </div>

                {/* 3. CENTER DRAGGABLE HANDLE DIVIDER (Using logical insetInlineStart) */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FCF6BA] via-[#C9A84C] to-[#B38728] shadow-[0_0_12px_#C9A84C] pointer-events-none"
                  style={{ insetInlineStart: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] border-2 border-white shadow-[0_0_15px_rgba(201,168,76,0.8)] flex items-center justify-center text-obsidian-dark font-bold text-xs select-none">
                    ⟨ ⟩
                  </div>
                </div>
              </div>

              {/* Slider Bottom Helper Note */}
              <div className="px-4 py-2.5 bg-[#070709] rounded-b-2xl border-t border-white/5 flex items-center justify-between text-xs text-muted-lux font-sans">
                <span>اسحبي يميناً ويساراً للمقارنة</span>
                <span className="text-gold font-medium">
                  موضع الفحص: {Math.round(sliderPosition)}%
                </span>
              </div>
            </div>
          </div>

          {/* Checklist of Authenticity Markers (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-sans text-gold font-semibold block">
                معايير الفحص المعتمدة
              </span>
              <h3 className="text-lg sm:text-2xl font-serif font-bold text-ivory">
                كيف تكتشفين المنتج الأصلي في 10 ثوانٍ؟
              </h3>
            </div>

            <div className="space-y-2.5">
              {guideData.checklist.map((item, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-3.5 rounded-2xl bg-surface border border-white/5 hover:border-gold/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-ivory">
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

            {/* Video Verification Trigger Button */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-surface hover:bg-surface-elevated border border-gold/40 text-ivory font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md group"
              >
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition shrink-0">
                  <PlayVideoIcon size={14} color="#C9A84C" />
                </div>
                <span>مشاهدة شروحات فحص القوام والعبوة</span>
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <a
                  href="https://www.tiktok.com/@tamiffttah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-champagne flex items-center justify-center font-semibold transition truncate"
                >
                  مقاطع تيك توك ←
                </a>
                <a
                  href="https://www.instagram.com/tamifttah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-champagne flex items-center justify-center font-semibold transition truncate"
                >
                  إنستغرام المتجر ←
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Verification Modal (Dynamic, code-split) */}
      {showVideoModal && (
        <VideoVerificationModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </section>
  );
}

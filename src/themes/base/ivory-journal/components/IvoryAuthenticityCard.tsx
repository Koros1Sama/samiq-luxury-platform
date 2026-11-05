'use client';

import React, { useState } from 'react';
import { useBatchVerifier } from '@/core/storefront/useBatchVerifier';
import { SectionComponentProps } from '@/themes/contract';
import {
  VerifiedStampIcon,
  SearchIcon,
  CheckIcon,
  CloseIcon,
} from './IvoryIcons';

export function IvoryAuthenticityCard(_props: Partial<SectionComponentProps>) {
  const { batchCode, setBatchCode, verify, isVerifying, result, error, reset } = useBatchVerifier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify();
  };

  const sampleCodes = ['سيروم فيتامين سي', 'سيروم نياسيناميد', 'الغسول المرطب'];

  return (
    <section id="authenticity" className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Editorial Section Header */}
        <div className="text-start mb-10 sm:mb-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#5E6B5A]/30 bg-[#F4EFE6] text-[#5E6B5A] mb-3">
            <VerifiedStampIcon size={16} color="#5E6B5A" />
            <span className="text-xs font-sans font-semibold">
              مختبر الفحص والتحقق التحريري
            </span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1B1612]">
            تعلم كيف تكشف المقلد
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#554D46] mt-2 leading-[1.75]">
            دليل عملي تحريري من خطوتين للتحقق من أصلية مستحضراتكِ قبل الاستخدام أو عند الاستلام
          </p>
        </div>

        {/* Two-Step Editorial Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step 1: Batch Verifier (7 cols) */}
          <div className="lg:col-span-7 bg-[#F7F4ED] border border-[#E8E2D8] rounded-md p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#1B1612] text-[#FAF7F2] font-mono text-xs font-bold flex items-center justify-center">
                  01
                </span>
                <div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1B1612]">
                    فحص المستحضر باسم المنتج (Product Authenticity Lookup)
                  </h3>
                  <span className="font-sans text-xs text-[#6E675F]">
                    مطابقة فورية مع معايير الهيئة العليا للأدوية والمستلزمات الطبية
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="batch-code-input" className="block text-xs font-sans font-medium text-[#554D46]">
                اكتبي اسم المستحضر لمطابقة علامات الأصلي وكشف المقلد:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    id="batch-code-input"
                    type="text"
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    placeholder="مثال: سيروم فيتامين سي، الغسول المرطب، نياسيناميد..."
                    className="w-full h-11 min-h-[44px] px-4 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] font-mono text-sm text-[#1B1612] placeholder:text-[#A0988E] focus:outline-none focus:border-[#5E6B5A] transition-colors"
                  />
                  {batchCode && (
                    <button
                      type="button"
                      aria-label="مسح الكود"
                      onClick={reset}
                      className="absolute end-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#877E75] hover:text-[#1B1612]"
                    >
                      <CloseIcon size={16} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="min-h-[44px] min-w-[120px] px-6 py-2.5 rounded-md bg-[#1B1612] text-[#FAF7F2] hover:bg-[#332E27] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <SearchIcon size={16} color="#FAF7F2" />
                  <span>{isVerifying ? 'جارٍ الفحص...' : 'فحص المستحضر'}</span>
                </button>
              </div>

              {/* Sample Quick Codes */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-xs font-sans text-[#877E75]">منتجات سريعة:</span>
                {sampleCodes.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setBatchCode(c);
                      verify(c);
                    }}
                    className="min-h-[40px] px-2.5 py-1 text-xs font-mono font-medium rounded border border-[#E8E2D8] bg-[#FAF7F2] text-[#554D46] hover:border-[#5E6B5A] hover:text-[#5E6B5A] transition-colors inline-flex items-center"
                  >
                    {c}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setBatchCode('منتج مقلد غير معتمد');
                    verify('منتج مقلد غير معتمد');
                  }}
                  className="min-h-[40px] px-2.5 py-1 text-xs font-sans font-medium rounded border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors inline-flex items-center"
                >
                  اختبار منتج مقلد غير مسجل
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-md border border-[#D9534F]/30 bg-[#FFF5F5] text-[#A93226] text-xs font-sans leading-[1.75]">
                {error}
              </div>
            )}

            {/* Verified Result Card */}
            {result && result.success && result.verification && (
              <div className="p-5 rounded-md border border-[#5E6B5A]/40 bg-[#FAF7F2] space-y-3 animate-fade-in shadow-inner">
                <div className="flex items-center gap-2 text-[#5E6B5A]">
                  <VerifiedStampIcon size={20} color="#5E6B5A" />
                  <span className="font-serif font-bold text-base">
                    مستحضر مصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-sans text-[#554D46]">
                  <div>
                    <span className="block text-[#877E75]">المستحضر:</span>
                    <span className="font-mono font-bold text-[#1B1612]">
                      {result.verification.productName || batchCode}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#877E75]">حالة الاعتماد:</span>
                    <span className="font-mono font-bold text-[#1B1612]">
                      مصرح ومطابق للمعايير
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#877E75]">الصلاحية:</span>
                    <span className="font-mono font-bold text-[#5E6B5A]">
                      {result.verification.shelfLife || '36 شهراً'}
                    </span>
                  </div>
                </div>
                {result.verification.statusNotes && (
                  <p className="font-sans text-sm text-[#554D46] pt-1 border-t border-[#E8E2D8]/60 leading-[1.75]">
                    {result.verification.statusNotes}
                  </p>
                )}
              </div>
            )}

            {/* Unverified / Not Found */}
            {result && !result.success && (
              <div className="p-5 rounded-md border border-[#B89B5E]/40 bg-[#FFFDF9] space-y-2 text-xs font-sans text-[#554D46]">
                <span className="font-serif font-bold text-sm text-[#1B1612] block">
                  تنبيه تحريري: مستحضر غير مسجل تلقائياً
                </span>
                <p className="font-sans text-sm leading-[1.75]">
                  {result.message || 'المستحضر المدخل يتطلب مراجعة الفاتورة الجمركية المباشرة. يمكنكِ تصوير قاع العبوة وإرساله لخبيرتنا عبر واتساب للتحقق اليدوي.'}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Spot the Fake Sensory Guide (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-md p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-4">
              <span className="w-8 h-8 rounded-full bg-[#5E6B5A] text-[#FAF7F2] font-mono text-xs font-bold flex items-center justify-center">
                02
              </span>
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1B1612]">
                  دليل الفحص الحسي (Sensory Audit)
                </h3>
                <span className="font-sans text-xs text-[#6E675F]">
                  3 معايير مادية لا يمكن للمقلد تزييفها
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Checkpoint 1 */}
              <div className="p-3.5 rounded bg-[#F7F4ED] border border-[#E8E2D8]/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#1B1612]">
                  <CheckIcon size={16} color="#5E6B5A" />
                  <span>1. ملمس الطباعة وخامة الكرتون</span>
                </div>
                <p className="font-sans text-sm text-[#554D46] leading-[1.75] ps-6">
                  العبوات الأصلية تستخدم ورقاً معالجاً بألياف سميكة وطباعة ليزرية نافرة تشعرين ببروزها تحت أطراف الأصابع.
                </p>
              </div>

              {/* Checkpoint 2 */}
              <div className="p-3.5 rounded bg-[#F7F4ED] border border-[#E8E2D8]/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#1B1612]">
                  <CheckIcon size={16} color="#5E6B5A" />
                  <span>2. ختم الأصالة وتطابق بيانات المستحضر المعتمد</span>
                </div>
                <p className="font-sans text-sm text-[#554D46] leading-[1.75] ps-6">
                  بيانات المستحضر والباركود على العبوة مطابقة تماماً لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.
                </p>
              </div>

              {/* Checkpoint 3 */}
              <div className="p-3.5 rounded bg-[#F7F4ED] border border-[#E8E2D8]/60 space-y-1">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#1B1612]">
                  <CheckIcon size={16} color="#5E6B5A" />
                  <span>3. لزوجة السيروم ونقاء المظهر</span>
                </div>
                <p className="font-sans text-sm text-[#554D46] leading-[1.75] ps-6">
                  المنتج الأصلي لا يحتوي على شوائب عكرة أو عطور نفاذة اصطناعية، ويمتصه الجلد خلال 45 ثانية دون لزوجة دهنية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

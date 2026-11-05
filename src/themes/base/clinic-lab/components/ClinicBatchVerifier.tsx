'use client';

import React from 'react';
import { useBatchVerifier } from '@/core/storefront/useBatchVerifier';
import {
  FlaskIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  CheckIcon,
  AlertTriangleIcon,
  SearchIcon,
} from './ClinicIcons';

export function ClinicBatchVerifier() {
  const { batchCode, setBatchCode, verify, isVerifying, result, error, reset } =
    useBatchVerifier();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (batchCode.trim()) {
      verify();
    }
  };

  const handleQuickCode = (code: string) => {
    setBatchCode(code);
    verify(code);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#D4E5E0] shadow-xs p-4 sm:p-6 lg:p-8">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E2ECE9]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center shrink-0 border border-[#0F4C4A]/20">
            <FlaskIcon size={22} />
          </div>
          <div className="flex flex-col text-start">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#0F4C4A] leading-tight">
              فحص المستحضر ودليل كشف المقلد باسم المنتج
            </h2>
            <p className="text-sm text-[#4A5568] leading-[1.75]">
              اكتبي اسم المستحضر أو اختاريه من القائمة لمعرفة علامات المنتج الأصلي والتأكد من مطابقته لمعايير الهيئة العليا للأدوية والمستلزمات الطبية
            </p>
          </div>
        </div>
      </div>

      {/* Form Input Section */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#0F4C4A]/50">
            <SearchIcon size={20} />
          </div>
          <input
            type="text"
            data-testid="batch-input"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
            placeholder="مثال: سيروم فيتامين سي، الغسول المرطب، نياسيناميد..."
            className="w-full min-h-[44px] ps-10 pe-4 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-sm font-semibold text-[#0F4C4A] placeholder:text-[#64748B] focus:bg-white focus:border-[#0F4C4A] focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A]"
            aria-label="اسم المستحضر للتحقق"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || !batchCode.trim()}
          className="min-h-[44px] min-w-[120px] px-5 py-2.5 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] disabled:opacity-50 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] shrink-0"
        >
          {isVerifying ? (
            <span>جارٍ الفحص المخبري...</span>
          ) : (
            <>
              <ShieldCheckIcon size={18} />
              <span>فحص المستحضر</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Test Samples */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#4A5568]">
        <span className="font-semibold text-[#0F4C4A]">منتجات سريعة للاختيار:</span>
        <button
          type="button"
          onClick={() => handleQuickCode('سيروم فيتامين سي 10%')}
          className="min-h-[40px] px-2.5 py-1 rounded-md bg-[#F2F7F5] border border-[#D4E5E0] text-[#0F4C4A] hover:bg-[#CFE8E1] font-semibold transition-colors"
        >
          سيروم فيتامين سي 10%
        </button>
        <button
          type="button"
          onClick={() => handleQuickCode('الغسول المرطب للبشرة')}
          className="min-h-[40px] px-2.5 py-1 rounded-md bg-[#F2F7F5] border border-[#D4E5E0] text-[#0F4C4A] hover:bg-[#CFE8E1] font-semibold transition-colors"
        >
          الغسول المرطب للبشرة
        </button>
        <button
          type="button"
          onClick={() => handleQuickCode('سيروم نياسيناميد 10%')}
          className="min-h-[40px] px-2.5 py-1 rounded-md bg-[#F2F7F5] border border-[#D4E5E0] text-[#0F4C4A] hover:bg-[#CFE8E1] font-semibold transition-colors"
        >
          سيروم نياسيناميد 10%
        </button>
        <button
          type="button"
          onClick={() => handleQuickCode('كريم الترطيب المكثف')}
          className="min-h-[40px] px-2.5 py-1 rounded-md bg-[#F2F7F5] border border-[#D4E5E0] text-[#0F4C4A] hover:bg-[#CFE8E1] font-semibold transition-colors"
        >
          كريم الترطيب المكثف
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-[#D9534F] flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <AlertTriangleIcon size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display: Verified Teal State vs Coral Warning State */}
      {result && (
        <div className="mt-5">
          {result.success && result.verification?.isVerified ? (
            /* VERIFIED TEAL STATE */
            <div className="p-4 sm:p-5 rounded-xl bg-[#CFE8E1]/30 border border-[#0F4C4A]/30 text-[#0F4C4A]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C4A] text-white flex items-center justify-center shrink-0">
                    <CheckIcon size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-[#0F4C4A] block">
                      مستحضر مصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية
                    </span>
                    <span className="text-xs text-[#0F4C4A]/80 font-medium">
                      المستحضر: {result.verification.productName || batchCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="min-h-[40px] px-3 py-1 text-xs font-semibold text-[#0F4C4A] hover:underline"
                >
                  فحص مستحضر آخر
                </button>
              </div>

              {/* Lab Metadata Table */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#0F4C4A]/15 text-xs sm:text-sm">
                <div className="bg-white/80 p-2.5 rounded-lg border border-[#0F4C4A]/15">
                  <span className="text-xs text-[#4A5568] block">المستحضر:</span>
                  <span className="font-bold text-[#0F4C4A]">
                    {result.verification.productName || 'مستحضر علاجي معتمد'}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-[#0F4C4A]/15">
                  <span className="text-xs text-[#4A5568] block">حالة الاعتماد:</span>
                  <span className="font-bold text-[#0F4C4A]">
                    مطابق لمعايير الهيئة العليا للأدوية
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-lg border border-[#0F4C4A]/15">
                  <span className="text-xs text-[#4A5568] block">الصلاحية:</span>
                  <span className="font-bold text-[#0F4C4A]">
                    {result.verification.shelfLife || '36 شهراً'}
                  </span>
                </div>
              </div>

              {result.verification.statusNotes && (
                <p className="mt-3 text-sm text-[#0F4C4A] leading-[1.75] bg-white/60 p-2.5 rounded-lg border border-[#0F4C4A]/10">
                  {result.verification.statusNotes}
                </p>
              )}

              {result.verification.inspectionChecklist && result.verification.inspectionChecklist.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#0F4C4A]/15 space-y-1.5">
                  <span className="text-xs font-bold text-[#0F4C4A] block">علامات المنتج الأصلي وكشف المقلد:</span>
                  <ul className="space-y-1 text-xs text-[#0F4C4A]/90">
                    {result.verification.inspectionChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckIcon size={14} className="text-[#0F4C4A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* SUSPICIOUS CORAL ALERT STATE */
            <div className="p-4 sm:p-5 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/40 text-[#D9534F]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#D9534F] text-white flex items-center justify-center shrink-0">
                    <ShieldAlertIcon size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-[#D9534F] block">
                      تنبيه: المستحضر غير مسجل في السجلات المعتمدة
                    </span>
                    <span className="text-xs text-[#D9534F]/90 font-medium">
                      الاسم أو الرمز المدخل: {batchCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="min-h-[40px] px-3 py-1 text-xs font-semibold text-[#D9534F] hover:underline"
                >
                  إعادة المحاولة
                </button>
              </div>

              <p className="mt-3 text-sm leading-[1.75] bg-white/70 p-3 rounded-lg border border-[#D9534F]/20 text-[#D9534F]">
                {result.message ||
                  'لم يتم العثور على مستحضر بهذا الاسم في سجلات المستحضرات المصرحة. نوصي بالتأكد من كتابة الاسم أو التواصل مع أخصائيينا في صنعاء.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

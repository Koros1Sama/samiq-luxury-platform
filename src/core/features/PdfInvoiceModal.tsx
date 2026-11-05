'use client';

import React, { useId, useMemo } from 'react';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  FeatureDefinition,
} from './registry';
import { SAMIQ_THEMES, ThemeId } from '@/themes/contract';

export interface PdfInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  clientName?: string;
  selectedTemplate: string;
  selectedFeatureIds: string[];
  priceOverrides?: Record<string, number>;
  discountUsd?: number;
  domainType?: 'subdomain_free' | 'custom_com' | 'custom_ye';
  annualDomainUsd?: number;
  annualHostingUsd?: number;
  aiPlanType?: 'none' | 'byok' | 'managed_annual';
  customRef?: string;
}

export function PdfInvoiceModal({
  isOpen,
  onClose,
  projectName,
  clientName,
  selectedTemplate,
  selectedFeatureIds,
  priceOverrides,
  discountUsd = 0,
  domainType = 'custom_com',
  annualDomainUsd = 20,
  annualHostingUsd = 45,
  aiPlanType = 'none',
  customRef,
}: PdfInvoiceModalProps) {
  const instanceId = useId().replace(/:/g, '');

  const pricing = useMemo(() => {
    return calculateTierPrice(selectedFeatureIds, priceOverrides, discountUsd);
  }, [selectedFeatureIds, priceOverrides, discountUsd]);

  const quoteNumber = useMemo(() => {
    if (customRef) return customRef;
    const cleanName = (projectName || 'QUOTE').replace(/\s+/g, '').toUpperCase();
    const hash = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 100);
    return `SMQ-2026-${hash.toString().slice(-4)}`;
  }, [customRef, projectName]);

  const issueDateFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const templateLabel = useMemo(() => {
    const key = selectedTemplate as ThemeId;
    return SAMIQ_THEMES[key]?.nameAr || selectedTemplate || 'أسود رخامي فاخر (Luxury Noir)';
  }, [selectedTemplate]);

  // Base tier definition
  const baseTierDef: FeatureDefinition =
    FEATURES_REGISTRY[pricing.selectedTier] || FEATURES_REGISTRY.tier_1_static;

  // Selected addons list
  const activeAddons = useMemo(() => {
    return selectedFeatureIds
      .filter((id) => {
        const def = FEATURES_REGISTRY[id];
        return def && def.category !== 'tier';
      })
      .map((id) => {
        const def = FEATURES_REGISTRY[id];
        const price = pricing.itemizedPrices[id] ?? def.basePriceUsd;
        return {
          ...def,
          effectivePrice: price,
        };
      });
  }, [selectedFeatureIds, pricing.itemizedPrices]);

  // Annual recurring calculation
  const aiAnnualCost = aiPlanType === 'managed_annual' ? 90 : 0;
  const annualTotalStartingYearTwo = annualDomainUsd + annualHostingUsd + aiAnnualCost;

  const handlePrint = () => {
    const origTitle = document.title;
    const sanitizedName = (projectName || 'Store').replace(/[^\w\u0600-\u06FF-]/g, '_');
    document.title = `SAMIQ-Invoice-${sanitizedName}`;
    window.print();
    setTimeout(() => {
      document.title = origTitle;
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="معاينة عرض السعر والفاتورة الرسمية لمنصة سامق"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      {/* Print-specific style block strictly scoping prints to this invoice container */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #samiq-official-invoice,
          #samiq-official-invoice * {
            visibility: visible !important;
          }
          #samiq-official-invoice {
            position: absolute !important;
            inset-inline-start: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 18mm 16mm !important;
            background: #ffffff !important;
            color: #0b0b0f !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
        }
      `}</style>

      <div className="w-full max-w-4xl bg-[#0a0a0d] border border-gold/40 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-fadeIn">
        {/* Top Modal Toolbar (Hidden on print) */}
        <div className="no-print p-4 sm:px-6 bg-[#111016] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#BF953F] to-[#AA771C] flex items-center justify-center text-obsidian-dark font-serif font-bold text-base shadow-sm">
              سـ
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-ivory">
                وثيقة عرض السعر والفاتورة الرسمية (Official Quote & Invoice)
              </h2>
              <p className="text-xs text-muted-lux hidden sm:block">
                معاينة مستند الفاتورة المعتمدة لمشروع: <span className="text-champagne font-bold">{projectName || 'مشروع جديد'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-110 text-obsidian-dark font-sans font-bold text-xs transition shadow-lg flex items-center gap-1.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>طباعة / حفظ كملف PDF الآن</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition"
              aria-label="إغلاق المعاينة"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="overflow-y-auto p-3 sm:p-6 lg:p-8 bg-[#070709] font-sans">
          <div
            id="samiq-official-invoice"
            className="w-full bg-[#0d0c11] text-ivory border border-gold/30 rounded-2xl p-6 sm:p-8 lg:p-10 space-y-7 shadow-xl print:text-black print:bg-white print:border-none"
            dir="rtl"
          >
            {/* Header: Platform Branding & Invoice Reference */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 border-b border-gold/25 pb-6 print:border-neutral-300">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#BF953F] to-[#AA771C] flex items-center justify-center text-obsidian-dark font-serif font-bold text-2xl shadow-md print:border print:border-black">
                    سـ
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-serif font-bold text-ivory print:text-black">سَـامِــق</span>
                      <span className="text-sm font-sans font-semibold tracking-wider text-gold print:text-neutral-700">SAMIQ</span>
                    </div>
                    <span className="text-xs text-muted-lux block print:text-neutral-600">
                      منصة هندسة المتاجر الرقمية الفاخرة والذكاء الاصطناعي (Luxury Digital Commerce Platform)
                    </span>
                  </div>
                </div>
                <div className="pt-1 text-xs text-muted-dim print:text-neutral-500 flex items-center gap-2">
                  <span>الموقع الرسمي: samiq.shop</span>
                  <span>|</span>
                  <span>تيليجرام: @KorosSenpai</span>
                </div>
              </div>

              <div className="sm:text-end space-y-1 bg-white/[0.02] p-3.5 rounded-xl border border-white/5 print:bg-neutral-50 print:border-neutral-200">
                <div className="flex items-center sm:justify-end gap-2">
                  <span className="text-xs font-bold text-gold print:text-neutral-800">رقم عرض السعر:</span>
                  <span className="text-xs font-mono font-bold text-ivory print:text-black dir-ltr">
                    #{quoteNumber}
                  </span>
                </div>
                <div className="text-xs text-muted-lux print:text-neutral-600">
                  <span>تاريخ الإصدار: </span>
                  <span className="font-semibold text-ivory print:text-black">{issueDateFormatted}</span>
                </div>
                <div className="pt-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold inline-block print:bg-neutral-200 print:text-neutral-900 print:border-neutral-400">
                    عرض سعر رسمي معتمد
                  </span>
                </div>
              </div>
            </div>

            {/* Project & Client Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5 print:bg-neutral-50 print:border-neutral-200 text-xs">
              <div className="space-y-1">
                <span className="text-muted-lux print:text-neutral-500 block">اسم المشروع / المتجر:</span>
                <span className="text-sm font-serif font-bold text-champagne print:text-black block">
                  {projectName || 'مشروع جديد'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-lux print:text-neutral-500 block">الجهة / العميل المستلم:</span>
                <span className="text-sm font-bold text-ivory print:text-black block">
                  {clientName?.trim() ? clientName : 'إدارة المتجر الموقرة'}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-lux print:text-neutral-500 block">القالب المعماري المعتمد:</span>
                <span className="text-sm font-semibold text-gold print:text-neutral-900 block">
                  {templateLabel}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-lux print:text-neutral-500 block">خيار النطاق المعتمد:</span>
                <span className="text-sm font-semibold text-ivory print:text-black block">
                  {domainType === 'subdomain_free'
                    ? `${(projectName || 'store').toLowerCase().replace(/\s+/g, '-')}.samiq.shop (مجاني)`
                    : domainType === 'custom_com'
                    ? 'نطاق رسمي عالمي (.com)'
                    : 'نطاق رسمي محلي (.ye)'}
                </span>
              </div>
            </div>

            {/* Section 1: Base Tier Selected */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-neutral-200">
                <h3 className="text-sm font-serif font-bold text-ivory print:text-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold print:bg-neutral-800" />
                  <span>1. الباقة الأساسية التراكمية (Selected Base Tier)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-gold print:text-neutral-900">
                  ${pricing.baseTierPriceUsd}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:bg-neutral-50 print:border-neutral-300">
                <div className="space-y-1">
                  <span className="text-sm font-serif font-bold text-champagne print:text-black block">
                    {baseTierDef.nameAr}
                  </span>
                  <p className="text-xs text-muted-lux print:text-neutral-700 leading-relaxed max-w-2xl">
                    {baseTierDef.descriptionAr}
                  </p>
                </div>
                <div className="sm:text-end shrink-0">
                  <span className="text-base font-serif font-bold text-gold print:text-neutral-900">
                    ${pricing.baseTierPriceUsd}
                  </span>
                  <span className="text-xs text-muted-dim block print:text-neutral-500">تأسيس لمرة واحدة</span>
                </div>
              </div>
            </div>

            {/* Section 2: Selected Add-ons & Channels */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-neutral-200">
                <h3 className="text-sm font-serif font-bold text-ivory print:text-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-champagne print:bg-neutral-800" />
                  <span>2. جدول الميزات والإضافات الهندسية المفعلة ({activeAddons.length} ميزة)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-champagne print:text-neutral-900">
                  +${pricing.addonsPriceUsd}
                </span>
              </div>

              {activeAddons.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-muted-lux text-center print:bg-neutral-50 print:text-neutral-500">
                  لم يتم اختيار إضافات إضافية، الباقة تقتصر على الدرجة الأساسية.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03] text-muted-lux print:bg-neutral-100 print:text-neutral-700 print:border-neutral-300">
                        <th className="py-2.5 px-3 font-semibold text-start w-10">#</th>
                        <th className="py-2.5 px-3 font-semibold text-start">اسم الميزة أو القناة</th>
                        <th className="py-2.5 px-3 font-semibold text-start">التصنيف الهندسي</th>
                        <th className="py-2.5 px-3 font-semibold text-start">المتطلب المسبق</th>
                        <th className="py-2.5 px-3 font-semibold text-end w-24">الاستثمار ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-neutral-200">
                      {activeAddons.map((addon, idx) => {
                        const catLabel =
                          addon.category === 'intelligence'
                            ? 'ذكاء اصطناعي'
                            : addon.category === 'channel'
                            ? 'قناة تواصل'
                            : addon.category === 'integration'
                            ? 'بوابة دفع'
                            : 'إضافة تجارية';

                        return (
                          <tr key={addon.id} className="hover:bg-white/[0.01] print:hover:bg-transparent">
                            <td className="py-2.5 px-3 font-mono text-muted-dim print:text-neutral-500">{idx + 1}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-ivory print:text-black block">{addon.nameAr}</span>
                              <span className="text-xs text-muted-lux print:text-neutral-600 block">{addon.descriptionAr}</span>
                            </td>
                            <td className="py-2.5 px-3 text-muted-lux print:text-neutral-600 whitespace-nowrap">
                              {catLabel}
                            </td>
                            <td className="py-2.5 px-3 text-muted-dim print:text-neutral-500 font-mono text-xs whitespace-nowrap">
                              {addon.requires.length > 0 ? addon.requires.join(', ') : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-end font-mono font-bold text-gold print:text-neutral-900 whitespace-nowrap">
                              +${addon.effectivePrice}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 3: Financial Summary of Setup Costs */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-gold/40 space-y-3 print:bg-neutral-50 print:border-neutral-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-neutral-300">
                <h3 className="text-sm font-serif font-bold text-ivory print:text-black">
                  3. الملخص المالي لتكلفة التأسيس (تُدفع لمرة واحدة عند الإنشاء والتسليم)
                </h3>
                <span className="text-xs text-muted-lux print:text-neutral-600">شاملة استضافة السنة الأولى مجاناً ($0)</span>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between text-muted-lux print:text-neutral-700">
                  <span>إجمالي التأسيس قبل الخصم:</span>
                  <span className="font-mono text-sm font-semibold text-ivory print:text-black">
                    ${pricing.subtotalUsd}
                  </span>
                </div>

                {pricing.discountUsd > 0 && (
                  <div className="flex items-center justify-between text-emerald-400 print:text-emerald-700 font-semibold">
                    <span>خصم خاص معتمد من إدارة منصة سَامِق:</span>
                    <span className="font-mono text-sm font-bold">
                      -${pricing.discountUsd}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 print:border-neutral-300 flex items-baseline justify-between">
                  <div>
                    <span className="text-base font-serif font-bold text-champagne print:text-black block">
                      الصافي النهائي للتأسيس (Net One-Time Setup):
                    </span>
                    <span className="text-xs text-muted-dim print:text-neutral-600">
                      استثمار بناء المتجر كاملاً، البرمجة، ربط الدومين، واستضافة سحابية للسنة الأولى مجاناً
                    </span>
                  </div>
                  <span className="text-3xl font-serif font-bold text-gold print:text-neutral-950 font-mono">
                    ${pricing.totalUsd}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Transparent Annual & Operational Costs */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs print:bg-neutral-50 print:border-neutral-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 print:border-neutral-300">
                <h3 className="text-xs font-serif font-bold text-champagne print:text-neutral-900">
                  4. جدول التكاليف السنوية والتشغيلية الشفافة (ابتداءً من السنة الثانية)
                </h3>
                <span className="font-mono font-bold text-emerald-400 print:text-neutral-900">
                  المجموع: ${annualTotalStartingYearTwo} / سنوياً
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-muted-lux print:text-neutral-700">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 print:bg-white print:border-neutral-200 space-y-1">
                  <span className="text-ivory print:text-black font-semibold block">النطاق الرسمي السنوي:</span>
                  <span className="font-mono font-bold text-gold print:text-neutral-900 block">${annualDomainUsd} / سنوياً</span>
                  <span className="text-muted-dim print:text-neutral-500 block leading-tight">
                    {domainType === 'subdomain_free'
                      ? 'نطاق فرعي samiq.shop مجاني مدى الحياة ($0)'
                      : 'حجز النطاق العالمي وتجديده السنوي وشهادة SSL'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 print:bg-white print:border-neutral-200 space-y-1">
                  <span className="text-ivory print:text-black font-semibold block">الاستضافة والصيانة السحابية:</span>
                  <span className="font-mono font-bold text-gold print:text-neutral-900 block">${annualHostingUsd} / سنوياً</span>
                  <span className="text-muted-dim print:text-neutral-500 block leading-tight">
                    السنة الأولى مشمولة مجاناً ($0). التجديد يبدأ من السنة الثانية
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 print:bg-white print:border-neutral-200 space-y-1">
                  <span className="text-ivory print:text-black font-semibold block">خطة الذكاء الاصطناعي والقنوات:</span>
                  <span className="font-mono font-bold text-gold print:text-neutral-900 block">${aiAnnualCost} / سنوياً</span>
                  <span className="text-muted-dim print:text-neutral-500 block leading-tight">
                    {aiPlanType === 'byok'
                      ? 'مفتاح العميل المباشر BYOK ($0 للمنصة)'
                      : aiPlanType === 'managed_annual'
                      ? 'استهلاك سحابي شامل ومدار للرسائل والوسوم'
                      : 'بدون اشتراك ذكاء اصطناعي إضافي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 5: Official Footer & Signature */}
            <div className="pt-4 border-t border-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-lux print:border-neutral-300 print:text-neutral-600">
              <div className="space-y-1">
                <span className="font-serif font-bold text-champagne print:text-black block text-sm">
                  منصة سَامِق — صُممت وهُندست لمعايير التجارة الرقمية الفاخرة
                </span>
                <p className="leading-snug max-w-xl">
                  هذا العرض وثيقة معتمدة ومبرمجة وفق المعمارية التراكمية لمنصة سَامِق. التسليم يشمل كافة الأكواد ولوحة الإدارة ودليل الاستخدام.
                </p>
              </div>

              <div className="sm:text-end shrink-0 space-y-1">
                <div className="font-mono text-ivory print:text-black font-bold">
                  Telegram: @KorosSenpai
                </div>
                <div className="text-gold print:text-neutral-800 font-semibold">
                  samiq.shop
                </div>
                <div className="text-muted-dim print:text-neutral-500 text-xs">
                  كود الاعتماد: {instanceId.slice(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

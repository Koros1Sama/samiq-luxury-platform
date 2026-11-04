'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FEATURES_REGISTRY, calculateTierPrice, validateFeatureDependencies, resolveEffectiveFeatures } from '@/core/features/registry';

export default function PlatformSuperAdminPage() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'tier_1_static',
    'tier_2_editable',
    'tier_3_catalog',
    'cart_whatsapp',
    'authenticity_guide',
    'skin_routine_advisor',
    'ai_chatbot',
  ]);

  const pricing = calculateTierPrice(selectedFeatures);
  const validation = validateFeatureDependencies(selectedFeatures);

  const toggleFeature = (id: string) => {
    let next: string[];
    if (selectedFeatures.includes(id)) {
      next = selectedFeatures.filter((f) => f !== id);
      if (!next.some((f) => f.startsWith('tier_'))) {
        next.push('tier_1_static');
      }
    } else {
      next = resolveEffectiveFeatures([...selectedFeatures, id]);
    }
    setSelectedFeatures(next);
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Platform Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#BF953F] to-[#B38728] flex items-center justify-center text-obsidian-dark font-serif font-bold text-2xl shadow-[0_0_20px_rgba(201,168,76,0.4)]">
              سـ
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                لوحة منصة سَامِق (SAMIQ Engine)
              </h1>
              <p className="text-xs text-muted-lux">
                إدارة المستأجرين، هندسة المزايا، وحاسبة تسعير الباقات الفاخرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <span>معاينة متجر مفتاح الجمال</span>
              <span>←</span>
            </Link>
            <Link
              href="/admin"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition inline-flex items-center"
            >
              لوحة المحل (Admin)
            </Link>
          </div>
        </div>

        {/* Section 1: Pilot Tenant Overview */}
        <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-ivory flex items-center gap-2">
              <span>المستأجر التجريبي الأساسي:</span>
              <span className="text-champagne">مفتاح الجمال (miftah)</span>
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              نشط (Active Pilot)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-muted-lux block">الدومين المعرف:</span>
              <span className="text-sm font-sans font-semibold text-ivory dir-ltr block mt-1">
                miftah.samiq.ye
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-muted-lux block">رقم الواتساب للطلبات:</span>
              <span className="text-sm font-sans font-semibold text-ivory dir-ltr block mt-1">
                +967 775 234 989
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-muted-lux block">القالب المعتمد:</span>
              <span className="text-sm font-sans font-semibold text-gold block mt-1">
                luxury-noir (مطابق للمرجع)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs text-muted-lux block">سياسة الفهرسة:</span>
              <span className="text-sm font-sans font-semibold text-rose-300 block mt-1">
                noindex = true (قيد الاختبار)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Pricing Calculator ($100 to $700+) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Feature Selector (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-surface border border-white/5 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-ivory">
                حاسبة وهندسة باقات سامق (Modular Pricing Engine)
              </h3>
              <p className="text-xs text-muted-lux mt-1">
                انقر على أي ميزة لتفعيلها أو إيقافها، وسيتولى المحرك التحقق من شروط الاعتمادية (requires).
              </p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(FEATURES_REGISTRY).map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between ${
                      isSelected
                        ? 'bg-elevated border-gold/50 shadow-md'
                        : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-1 pe-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ivory">
                          {feat.nameAr}
                        </span>
                      </div>
                      <p className="text-sm text-muted-lux leading-[1.75]">
                        {feat.descriptionAr}
                      </p>
                      {feat.requires.length > 0 && (
                        <span className="text-xs text-gold/80 block mt-1">
                          تتطلب: {feat.requires.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded text-xs font-sans font-bold bg-gold/15 text-gold">
                        +${feat.basePriceUsd}
                      </span>
                      <span className="text-xs font-sans font-semibold text-gold">
                        {isSelected ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Summary (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-gradient-to-b from-elevated to-surface border border-gold/40 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <span className="text-xs text-gold font-bold block">
                ملخص التسعير المباشر
              </span>

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-lux">سعر الباقة الأساسية:</span>
                  <span className="text-lg font-serif font-bold text-ivory">
                    ${pricing.baseTierPriceUsd}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-lux">مجموع الإضافات المفعلة:</span>
                  <span className="text-lg font-serif font-bold text-gold">
                    +${pricing.addonsPriceUsd}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <span className="text-base font-bold text-ivory">الإجمالي المقدر:</span>
                  <span className="text-4xl font-serif font-bold text-champagne drop-shadow-[0_2px_15px_rgba(201,168,76,0.3)]">
                    ${pricing.totalUsd}
                  </span>
                </div>
              </div>

              {/* Tier Details */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">الباقة الحالية:</span>
                  <span className="text-gold font-bold">{pricing.selectedTier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">عدد المزايا المفعلة:</span>
                  <span className="text-ivory font-bold">{selectedFeatures.length} ميزة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">صلاحية الشروط (requires):</span>
                  <span className={validation.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {validation.isValid ? 'سليمة 100%' : 'توجد نواقص'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`تم حفظ تكوين باقة متجر مفتاح الجمال بقيمة $${pricing.totalUsd}`)}
              className="w-full min-h-[44px] py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.4)] hover:brightness-110 transition inline-flex items-center justify-center"
            >
              حفظ وتطبيق الباقة على المحل ↵
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

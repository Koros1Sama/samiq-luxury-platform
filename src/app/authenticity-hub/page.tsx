'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  CrossWarningIcon,
  SparkleStarIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { SubpageThemeWrapper, useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';

function AuthenticityHubContent() {
  const { palette, isLight } = useSubpageTheme();
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

  const handleVerify = async (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const query = (customCode || batchCodeInput).trim();
    if (!query) return;

    if (customCode) {
      setBatchCodeInput(customCode);
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/store/authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchCode: query }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationResult(data.verification);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const brandGuides = [
    {
      brand: 'سيرومات نقية',
      product: 'سيروم فيتامين سي Pure Vitamin C10',
      batchCode: '54U700',
      country: 'معتمد دولياً',
      originalMarkers: [
        'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية',
        'قوام انسيابي نقي بلون كهرماني بدون أي رغوة بيضاء',
        'قطارة طبية بسدادة محكمة تمنع دخول الأكسجين',
      ],
      fakeRisks: [
        'عبوة بلاستيكية خفيفة تسرب الهواء وتؤكسد الفيتامين',
        'رغوة بيضاء كثيفة تطفو على السطح بعد الرج',
        'رائحة كيميائية لاذعة تسبب حساسية واحمرار فوري',
      ],
      image: '/media/products/serum-vitamin-c.jpg',
    },
    {
      brand: 'عناية يومية',
      product: 'غسول Hydrating Facial Cleanser 473ml',
      batchCode: '20T900',
      country: 'معتمد دولياً',
      originalMarkers: [
        'مضخة زرقاء مصبوبة ناعمة بدون حواف بلاستيكية خشنة',
        'لوشن أبيض كريمي خفيف لا يصنع رغوة قاسية',
        'الباركود الدولي يقرأ بيانات الاعتماد الرسمي ومطابقة معايير الهيئة',
      ],
      fakeRisks: [
        'مضخة رديئة تسرب السائل وتعلق عند الضغط',
        'رائحة عطرية قوية مضافة (الأصلي خالي تماماً من العطور)',
        'قوام مائي شفاف لا يحتوي على السيراميدات',
      ],
      image: '/media/products/cleanser-hydrating.jpg',
    },
    {
      brand: 'عناية متقدمة',
      product: 'سيروم Niacinamide 10% + Zinc 1%',
      batchCode: '1A02',
      country: 'معتمد دولياً',
      originalMarkers: [
        'ختم الأصالة وتاريخ الإنتاج مطبوعان بدقة عالية بالليزر على الزجاج الخارجي',
        'ملمس السائل خفيف سريع الامتصاص برائحة خفيفة جداً',
        'خطوط الكتابة على الملصق رفيعة ودقيقة بدون أي أخطاء إملائية',
      ],
      fakeRisks: [
        'خطوط عريضة باهتة مع أخطاء في ترجمة المكونات',
        'سائل لزج يشبه الصمغ يترك طبقة بيضاء جافة على الجلد',
        'غطاء القطارة رديء يتفتت بعد أسبوع من الاستخدام',
      ],
      image: '/media/products/serum-niacinamide.jpg',
    },
  ];

  const filteredGuides =
    activeBrandFilter === 'all'
      ? brandGuides
      : brandGuides.filter((b) => b.brand.toLowerCase().includes(activeBrandFilter.toLowerCase()));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-sans font-semibold"
          style={{
            borderColor: `${palette.accent}50`,
            backgroundColor: `${palette.accent}15`,
            color: palette.accentHex || palette.accent,
          }}
        >
          <ShieldCheckIcon size={16} color={palette.accentHex || palette.accent} />
          <span>الموسوعة اليمنية الأولى للأصالة التجميلية</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-serif font-bold leading-[1.45] md:leading-[1.4]"
          style={{ color: palette.textHex || palette.text }}
        >
          كيف تميزين المنتج الأصلي لكشف المقلد المغشوش؟
        </h1>
        <p className="text-sm sm:text-base font-sans leading-[1.75]" style={{ color: palette.mutedHex || palette.muted }}>
          في متجر مفتاح الجمال، لا نكتفي بضمان الأصالة، بل نمكّنكِ من فحص أي مستحضر تجميلي
          بنفسك والتأكد من مطابقته لمعايير الهيئة العليا للأدوية والمستلزمات الطبية والخصائص الفيزيائية للعبوة والقوام.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap text-xs font-sans">
          <a
            href="https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full border transition font-semibold"
            style={{
              backgroundColor: `${palette.accent}20`,
              borderColor: `${palette.accent}40`,
              color: palette.accentHex || palette.accent,
            }}
          >
            شاهد مقاطع كشف المقلد على تيك توك (@tamiffttah) ←
          </a>
          <a
            href="https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full border transition font-semibold"
            style={{
              backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
              borderColor: palette.borderHex || palette.border,
              color: palette.textHex || palette.text,
            }}
          >
            حساب إنستغرام (@tamifttah) ←
          </a>
        </div>
      </div>

      {/* Interactive Authenticity & Counterfeit Detector Card */}
      <div
        className="p-2 sm:p-3 rounded-[2rem] shadow-2xl max-w-3xl mx-auto border transition-all"
        style={{
          backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255, 255, 255, 0.03)',
          borderColor: `${palette.accent}40`,
        }}
      >
        <div
          className="rounded-[calc(2rem-0.5rem)] p-6 sm:p-8 space-y-6 transition-all"
          style={{
            backgroundColor: palette.surfaceHex || palette.surface,
            borderColor: palette.borderHex || palette.border,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
              style={{
                backgroundColor: `${palette.accent}15`,
                borderColor: `${palette.accent}40`,
                color: palette.accentHex || palette.accent,
              }}
            >
              <SparkleStarIcon size={20} color={palette.accentHex || palette.accent} />
            </div>
            <div>
              <h3
                className="text-lg font-serif font-bold leading-[1.45] md:leading-[1.4]"
                style={{ color: palette.textHex || palette.text }}
              >
                دليل وفاحص الأصالة وكشف المقلد باسم المنتج
              </h3>
              <p className="text-sm font-sans leading-[1.75]" style={{ color: palette.mutedHex || palette.muted }}>
                اكتبي اسم المستحضر لمعرفة علامات الأصلي ومطابقته لمعايير الهيئة العليا للأدوية
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="اكتبي اسم المستحضر (مثال: سيروم فيتامين سي أو الغسول المرطب)"
              value={batchCodeInput}
              onChange={(e) => setBatchCodeInput(e.target.value)}
              className="min-h-[44px] flex-1 px-4 py-3 rounded-2xl border text-sm outline-none transition"
              style={{
                backgroundColor: isLight ? '#00000005' : 'rgba(255, 255, 255, 0.05)',
                borderColor: palette.borderHex || palette.border,
                color: palette.textHex || palette.text,
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="min-h-[44px] px-6 py-3 rounded-2xl font-sans font-bold text-sm shadow-md transition disabled:opacity-50 inline-flex items-center justify-center"
              style={{
                backgroundColor: palette.accentHex || palette.accent,
                color: isLight ? '#FFFFFF' : '#0B0B0C',
              }}
            >
              {isLoading ? 'جاري الفحص...' : 'فحص المستحضر ↵'}
            </button>
          </form>

          {/* Quick Test Presets */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-sans" style={{ color: palette.mutedHex || palette.muted }}>
            <span className="font-semibold" style={{ color: palette.textHex || palette.text }}>
              مستحضرات سريعة للاختيار:
            </span>
            <button
              type="button"
              onClick={() => handleVerify(undefined, 'سيروم فيتامين سي 10%')}
              className="min-h-[40px] px-3 py-1.5 inline-flex items-center rounded-xl border font-bold transition active:scale-95"
              style={{
                backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                borderColor: palette.borderHex || palette.border,
                color: palette.accentHex || palette.accent,
              }}
            >
              سيروم فيتامين سي 10%
            </button>
            <button
              type="button"
              onClick={() => handleVerify(undefined, 'الغسول المرطب للبشرة')}
              className="min-h-[40px] px-3 py-1.5 inline-flex items-center rounded-xl border font-bold transition active:scale-95"
              style={{
                backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                borderColor: palette.borderHex || palette.border,
                color: palette.accentHex || palette.accent,
              }}
            >
              الغسول المرطب للبشرة
            </button>
            <button
              type="button"
              onClick={() => handleVerify(undefined, 'سيروم نياسيناميد 10%')}
              className="min-h-[40px] px-3 py-1.5 inline-flex items-center rounded-xl border font-bold transition active:scale-95"
              style={{
                backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                borderColor: palette.borderHex || palette.border,
                color: palette.accentHex || palette.accent,
              }}
            >
              سيروم نياسيناميد 10%
            </button>
            <button
              type="button"
              onClick={() => handleVerify(undefined, 'منتج مجهول المصدر غير مصرح')}
              className={`min-h-[40px] px-3 py-1.5 inline-flex items-center rounded-xl border font-bold transition active:scale-95 ${
                isLight
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border-rose-500/30'
              }`}
            >
              اختبار منتج مقلد غير مسجل
            </button>
          </div>

          {/* Result Box */}
          {verificationResult && (
            <div
              className={`p-5 rounded-2xl border space-y-3 animate-fadeIn ${
                verificationResult.isVerified !== false
                  ? isLight
                    ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                  : isLight
                  ? 'bg-rose-50/90 border-rose-400 text-rose-950'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  verificationResult.isVerified !== false
                    ? isLight
                      ? 'border-emerald-300'
                      : 'border-emerald-500/20'
                    : isLight
                    ? 'border-rose-300'
                    : 'border-rose-500/20'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold text-sm font-sans ${
                    verificationResult.isVerified !== false
                      ? isLight
                        ? 'text-emerald-800'
                        : 'text-emerald-300'
                      : isLight
                      ? 'text-rose-800'
                      : 'text-rose-300'
                  }`}
                >
                  {verificationResult.isVerified !== false ? (
                    <VerifiedCheckIcon size={18} color={isLight ? '#047857' : '#34D399'} />
                  ) : (
                    <CrossWarningIcon size={18} color={isLight ? '#BE123C' : '#FB7185'} />
                  )}
                  <span>
                    {verificationResult.isVerified !== false
                      ? 'نتيجة الفحص: مستحضر مصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية'
                      : 'تحذير: مستحضر غير مسجل أو يشتبه بكونه مقلداً ومغشوشاً'}
                  </span>
                </div>
                <span className="text-xs font-sans font-semibold" style={{ color: palette.accentHex || palette.accent }}>
                  {verificationResult.productName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans" style={{ color: palette.textHex || palette.text }}>
                <div>
                  <span className="block" style={{ color: palette.mutedHex || palette.muted }}>الماركة والمستحضر:</span>
                  <span className="font-bold" style={{ color: palette.accentHex || palette.accent }}>
                    {verificationResult.brand} — {verificationResult.productName}
                  </span>
                </div>
                <div>
                  <span className="block" style={{ color: palette.mutedHex || palette.muted }}>تاريخ الإنتاج وصلاحية العبوة:</span>
                  <span className="font-bold">
                    {verificationResult.manufactureDate} ({verificationResult.shelfLife})
                  </span>
                </div>
              </div>

              <p
                className={`text-sm font-sans leading-[1.75] pt-1 ${
                  verificationResult.isVerified !== false
                    ? isLight
                      ? 'text-emerald-900'
                      : 'text-emerald-200/90'
                    : isLight
                    ? 'text-rose-900'
                    : 'text-rose-200/90'
                }`}
              >
                {verificationResult.statusNotes}
              </p>

              <div
                className={`pt-2 border-t space-y-1 ${
                  verificationResult.isVerified !== false
                    ? isLight
                      ? 'border-emerald-300'
                      : 'border-emerald-500/20'
                    : isLight
                    ? 'border-rose-300'
                    : 'border-rose-500/20'
                }`}
              >
                <span className="text-xs block font-sans" style={{ color: palette.mutedHex || palette.muted }}>
                  معايير فحص العبوة باليد:
                </span>
                {verificationResult.inspectionChecklist?.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-sans" style={{ color: palette.textHex || palette.text }}>
                    {verificationResult.isVerified !== false ? (
                      <VerifiedCheckIcon size={12} color={isLight ? '#047857' : '#34D399'} />
                    ) : (
                      <CrossWarningIcon size={12} color={isLight ? '#BE123C' : '#FB7185'} />
                    )}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brand Archive Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-serif font-bold leading-[1.45] md:leading-[1.4]"
              style={{ color: palette.textHex || palette.text }}
            >
              أرشيف المقارنات الموثقة حسب الماركة
            </h2>
            <p className="text-sm font-sans mt-0.5 leading-[1.75]" style={{ color: palette.mutedHex || palette.muted }}>
              مقارنات دقيقة بالصور للمستحضرات الأكثر تعرضاً للغش في السوق المحلي
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'سيرومات نقية', 'عناية يومية', 'عناية متقدمة'].map((brandKey) => {
              const isSelected = activeBrandFilter === brandKey;
              return (
                <button
                  key={brandKey}
                  type="button"
                  onClick={() => setActiveBrandFilter(brandKey)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition inline-flex items-center ${
                    isSelected ? 'font-bold shadow-xs' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? (palette.accentHex || palette.accent)
                      : isLight
                      ? (palette.surfaceHex || '#FFFFFF')
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isSelected
                      ? (isLight ? '#FFFFFF' : '#0B0B0C')
                      : (palette.textHex || palette.text),
                    border: `1px solid ${isSelected ? (palette.accentHex || palette.accent) : (palette.borderHex || palette.border)}`,
                  }}
                >
                  {brandKey === 'all' ? 'جميع الماركات' : brandKey}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGuides.map((guide, idx) => (
            <div
              key={idx}
              className="p-1.5 rounded-[1.75rem] border transition-all duration-300 flex flex-col justify-between shadow-xl"
              style={{
                backgroundColor: isLight ? (palette.surfaceHex || '#FFFFFF') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.borderHex || palette.border,
              }}
            >
              <div
                className="rounded-[calc(1.75rem-0.375rem)] p-5 space-y-4 flex-1 flex flex-col justify-between"
                style={{ backgroundColor: palette.surfaceHex || palette.surface }}
              >
                <div>
                  <div className="h-44 w-full rounded-2xl overflow-hidden relative mb-4 bg-black/10">
                    <SmartImage
                      src={guide.image}
                      alt={guide.product}
                      fill
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                    <div className="absolute top-3 start-3 px-2.5 py-1 rounded bg-black/80 border border-white/20 text-xs text-white font-sans font-bold">
                      بلد المنشأ: {guide.country}
                    </div>
                  </div>

                  <span className="text-xs font-sans font-bold block" style={{ color: palette.accentHex || palette.accent }}>
                    {guide.brand}
                  </span>
                  <h3
                    className="text-base font-serif font-bold leading-[1.45] md:leading-[1.4]"
                    style={{ color: palette.textHex || palette.text }}
                  >
                    {guide.product}
                  </h3>
                </div>

                <div className="space-y-3 pt-3 border-t text-xs font-sans" style={{ borderColor: palette.borderHex || palette.border }}>
                  <div>
                    <span className="text-emerald-500 font-bold block mb-1">علامات الأصلي:</span>
                    <ul className="space-y-1" style={{ color: palette.textHex || palette.text }}>
                      {guide.originalMarkers.map((m, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <VerifiedCheckIcon className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-rose-500 font-bold block mb-1">عيوب المغشوش:</span>
                    <ul className="space-y-1" style={{ color: palette.textHex || palette.text }}>
                      {guide.fakeRisks.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CrossWarningIcon className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={`/product/prod-${idx + 1}`}
                  className="w-full min-h-[44px] py-2.5 mt-2 rounded-xl border text-xs font-sans font-bold inline-flex items-center justify-center transition"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    borderColor: `${palette.accent}35`,
                    color: palette.accentHex || palette.accent,
                  }}
                >
                  عرض المستحضر الأصلي في المتجر ←
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AuthenticityHubPage() {
  return (
    <SubpageThemeWrapper activeNav="authenticity-hub" showNavHeader={true}>
      <AuthenticityHubContent />
    </SubpageThemeWrapper>
  );
}

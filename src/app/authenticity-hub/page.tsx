'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  CrossWarningIcon,
  PlayVideoIcon,
  SparkleStarIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';

export default function AuthenticityHubPage() {
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCodeInput.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/store/authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchCode: batchCodeInput.trim() }),
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
        'كود الباتش مطبوع بلون رمادي مائل للزرقة على الزجاج الخارجي',
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
    <div className="min-h-screen bg-obsidian text-ivory font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Link
              href="/account"
              className="min-h-[44px] px-3 rounded-lg bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/80 hover:text-champagne transition inline-flex items-center"
            >
              حسابي والولاء
            </Link>
            <Link
              href="/bookings"
              className="min-h-[44px] px-3 rounded-lg bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/80 hover:text-champagne transition inline-flex items-center"
            >
              حجز موعد
            </Link>
            <Link
              href="/blog"
              className="min-h-[44px] px-3 rounded-lg bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/80 hover:text-champagne transition inline-flex items-center"
            >
              المدونة
            </Link>
            <Link
              href="/"
              className="min-h-[44px] px-3 rounded-lg bg-gold/15 hover:bg-gold/25 border border-gold/40 text-xs font-sans font-bold text-champagne transition inline-flex items-center gap-1"
            >
              <span>المتجر الرئيسي</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <ShieldCheckIcon size={16} color="#C9A84C" />
            <span>الموسوعة اليمنية الأولى للأصالة التجميلية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ivory leading-tight">
            كيف تميزين المنتج الأصلي لكشف المقلد المغشوش؟
          </h1>
          <p className="text-sm sm:text-base text-muted-lux font-sans leading-[1.75]">
            في متجر مفتاح الجمال، لا نكتفي بضمان الأصالة، بل نمكّنكِ من فحص أي مستحضر تجميلي
            بنفسك والتأكد من مطابقته لمعايير الهيئة العليا للأدوية والمستلزمات الطبية والخصائص الفيزيائية للعبوة والقوام.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap text-xs font-sans">
            <a
              href="https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition font-semibold"
            >
              شاهد مقاطع كشف المقلد على تيك توك (@tamiffttah) ←
            </a>
            <a
              href="https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center px-4 py-2 rounded-full bg-white/5 text-ivory border border-white/10 hover:bg-white/10 transition font-semibold"
            >
              حساب إنستغرام (@tamifttah) ←
            </a>
          </div>
        </div>

        {/* Interactive Authenticity & Counterfeit Detector Card */}
        <div className="p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-gold/30 shadow-2xl max-w-3xl mx-auto">
          <div className="rounded-[calc(2rem-0.5rem)] bg-gradient-to-b from-surface to-elevated p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <SparkleStarIcon size={20} color="#C9A84C" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-ivory">
                  دليل وفاحص الأصالة وكشف المقلد باسم المنتج
                </h3>
                <p className="text-sm text-muted-lux font-sans leading-[1.75]">
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
                className="min-h-[44px] flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-ivory focus:border-gold outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="min-h-[44px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:brightness-110 transition disabled:opacity-50 inline-flex items-center justify-center"
              >
                {isLoading ? 'جاري الفحص...' : 'فحص المستحضر ↵'}
              </button>
            </form>

            {/* Quick Test Presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-sans text-muted-lux">
              <span>مستحضرات سريعة للاختيار:</span>
              <button
                type="button"
                onClick={() => setBatchCodeInput('سيروم فيتامين سي 10%')}
                className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                سيروم فيتامين سي 10%
              </button>
              <button
                type="button"
                onClick={() => setBatchCodeInput('الغسول المرطب للبشرة')}
                className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                الغسول المرطب للبشرة
              </button>
              <button
                type="button"
                onClick={() => setBatchCodeInput('سيروم نياسيناميد 10%')}
                className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                سيروم نياسيناميد 10%
              </button>
            </div>

            {/* Result Box */}
            {verificationResult && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm font-sans">
                    <VerifiedCheckIcon size={18} color="#34D399" />
                    <span>نتيجة الفحص: مستحضر مصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية</span>
                  </div>
                  <span className="text-xs text-gold font-sans font-semibold">
                    {verificationResult.productName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-ivory/90">
                  <div>
                    <span className="text-muted-lux block">الماركة والمستحضر:</span>
                    <span className="font-bold text-champagne">
                      {verificationResult.brand} — {verificationResult.productName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-lux block">تاريخ الإنتاج وصلاحية العبوة:</span>
                    <span className="font-bold text-ivory">
                      {verificationResult.manufactureDate} ({verificationResult.shelfLife})
                    </span>
                  </div>
                </div>

                <p className="text-sm text-emerald-200/90 font-sans leading-[1.75] pt-1">
                  {verificationResult.statusNotes}
                </p>

                <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                  <span className="text-xs text-muted-lux block font-sans">معايير فحص العبوة باليد:</span>
                  {verificationResult.inspectionChecklist?.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-ivory/80 font-sans">
                      <VerifiedCheckIcon size={12} color="#34D399" />
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
              <h2 className="text-2xl font-serif font-bold text-ivory">
                أرشيف المقارنات الموثقة حسب الماركة
              </h2>
              <p className="text-sm text-muted-lux font-sans mt-0.5 leading-[1.75]">
                مقارنات دقيقة بالصور للمستحضرات الأكثر تعرضاً للغش في السوق المحلي
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'سيرومات نقية', 'عناية يومية', 'عناية متقدمة'].map((brandKey) => (
                <button
                  key={brandKey}
                  type="button"
                  onClick={() => setActiveBrandFilter(brandKey)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition inline-flex items-center ${
                    activeBrandFilter === brandKey
                      ? 'bg-gold text-obsidian-dark font-bold'
                      : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                  }`}
                >
                  {brandKey === 'all' ? 'جميع الماركات' : brandKey}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredGuides.map((guide, idx) => (
              <div
                key={idx}
                className="p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] bg-surface p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="h-44 w-full rounded-2xl overflow-hidden relative mb-4 bg-white/5">
                      <SmartImage
                        src={guide.image}
                        alt={guide.product}
                        fill
                        priority={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center"
                      />
                      <div className="absolute top-3 start-3 px-2.5 py-1 rounded bg-black/80 border border-gold/40 text-xs text-champagne font-sans font-bold">
                        بلد المنشأ: {guide.country}
                      </div>
                    </div>

                    <span className="text-xs font-sans text-gold font-bold block">{guide.brand}</span>
                    <h3 className="text-base font-serif font-bold text-ivory">{guide.product}</h3>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5 text-xs font-sans">
                    <div>
                      <span className="text-emerald-400 font-bold block mb-1">علامات الأصلي:</span>
                      <ul className="space-y-1 text-ivory/80">
                        {guide.originalMarkers.map((m, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <VerifiedCheckIcon className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-rose-400 font-bold block mb-1">عيوب المغشوش:</span>
                      <ul className="space-y-1 text-ivory/80">
                        {guide.fakeRisks.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CrossWarningIcon className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={`/product/prod-${idx + 1}`}
                    className="w-full min-h-[44px] py-2.5 mt-2 rounded-xl bg-white/5 hover:bg-gold/15 text-champagne border border-white/10 hover:border-gold/30 text-xs font-sans font-bold inline-flex items-center justify-center transition"
                  >
                    عرض المستحضر الأصلي في المتجر ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

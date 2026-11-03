'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      brand: 'La Roche-Posay',
      product: 'سيروم فيتامين سي Pure Vitamin C10',
      batchCode: '54U700',
      country: 'فرنسا',
      originalMarkers: [
        'رقم التشغيلة محفور بالليزر أسفل الزجاج وليس حبراً مطبوعاً',
        'قوام انسيابي نقي بلون كهرماني بدون أي رغوة بيضاء',
        'قطارة طبية بسدادة محكمة تمنع دخول الأكسجين',
      ],
      fakeRisks: [
        'عبوة بلاستيكية خفيفة تسرب الهواء وتؤكسد الفيتامين',
        'رغوة بيضاء كثيفة تطفو على السطح بعد الرج',
        'رائحة كيميائية لاذعة تسبب حساسية واحمرار فوري',
      ],
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    },
    {
      brand: 'CeraVe',
      product: 'غسول Hydrating Facial Cleanser 473ml',
      batchCode: '20T900',
      country: 'الولايات المتحدة',
      originalMarkers: [
        'مضخة زرقاء مصبوبة ناعمة بدون حواف بلاستيكية خشنة',
        'لوشن أبيض كريمي خفيف لا يصنع رغوة قاسية',
        'الباركود الأمريكي الدولي يقرأ بلد الصنع والوكالة الرسمية',
      ],
      fakeRisks: [
        'مضخة رديئة تسرب السائل وتعلق عند الضغط',
        'رائحة عطرية قوية مضافة (الأصلي خالي تماماً من العطور)',
        'قوام مائي شفاف لا يحتوي على السيراميدات',
      ],
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    },
    {
      brand: 'The Ordinary',
      product: 'سيروم Niacinamide 10% + Zinc 1%',
      batchCode: '1A02',
      country: 'كندا',
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
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-sans text-ivory/80 hover:text-champagne transition"
            >
              العودة للمتجر الرئيسي ←
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
          <p className="text-sm sm:text-base text-muted-lux font-sans leading-relaxed">
            في متجر مفتاح الجمال، لا نكتفي بضمان الأصالة، بل نمكّنكِ من فحص أي مستحضر تجميلي
            بنفسك عبر مطابقة رقم الدفعة (Batch Code) والخصائص الفيزيائية للعبوة والقوام.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap text-xs font-sans">
            <a
              href="https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition font-semibold"
            >
              شاهد مقاطع كشف المقلد على تيك توك (@tamiffttah) ←
            </a>
            <a
              href="https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/5 text-ivory border border-white/10 hover:bg-white/10 transition font-semibold"
            >
              حساب إنستغرام (@tamifttah) ←
            </a>
          </div>
        </div>

        {/* Interactive Batch Code Verifier Card */}
        <div className="p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-gold/30 shadow-2xl max-w-3xl mx-auto">
          <div className="rounded-[calc(2rem-0.5rem)] bg-gradient-to-b from-surface to-elevated p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <SparkleStarIcon size={20} color="#C9A84C" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-ivory">
                  فاحص رقم الدفعة المباشر (Batch Code Verifier)
                </h3>
                <p className="text-xs text-muted-lux font-sans">
                  اكتبي الرمز المحفور في قاع العبوة لمطابقته مع بيانات الوكالة المعتمدة
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="أدخلي رقم الدفعة (مثال: 54U700 أو 20T900)"
                value={batchCodeInput}
                onChange={(e) => setBatchCodeInput(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-ivory uppercase focus:border-gold outline-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:brightness-110 transition disabled:opacity-50"
              >
                {isLoading ? 'جاري الفحص...' : 'فحص الباتش كود ↵'}
              </button>
            </form>

            {/* Quick Test Presets */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-sans text-muted-lux">
              <span>أكواد تجريبية معتمدة:</span>
              <button
                type="button"
                onClick={() => setBatchCodeInput('54U700')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                54U700 (لاروش بوزيه)
              </button>
              <button
                type="button"
                onClick={() => setBatchCodeInput('20T900')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                20T900 (سيرافي)
              </button>
              <button
                type="button"
                onClick={() => setBatchCodeInput('1A02')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold/15 text-champagne border border-white/10"
              >
                1A02 (ذا أورديناري)
              </button>
            </div>

            {/* Result Box */}
            {verificationResult && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm font-sans">
                    <VerifiedCheckIcon size={18} color="#34D399" />
                    <span>نتيجة الفحص: كود معتمد ومطابق للمعايير</span>
                  </div>
                  <span className="text-xs text-gold font-sans font-semibold">
                    {verificationResult.batchCode}
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

                <p className="text-xs text-emerald-200/90 font-sans leading-relaxed pt-1">
                  {verificationResult.statusNotes}
                </p>

                <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                  <span className="text-[11px] text-muted-lux block font-sans">معايير فحص العبوة باليد:</span>
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
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                مقارنات دقيقة بالصور للمستحضرات الأكثر تعرضاً للغش في السوق المحلي
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'La Roche-Posay', 'CeraVe', 'The Ordinary'].map((brandKey) => (
                <button
                  key={brandKey}
                  type="button"
                  onClick={() => setActiveBrandFilter(brandKey)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition ${
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
                      <Image
                        src={guide.image}
                        alt={guide.product}
                        fill
                        className="object-cover object-center"
                      />
                      <div className="absolute top-3 start-3 px-2.5 py-1 rounded bg-black/80 border border-gold/40 text-[10px] text-champagne font-sans font-bold">
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
                    className="w-full py-2.5 mt-2 rounded-xl bg-white/5 hover:bg-gold/15 text-champagne border border-white/10 hover:border-gold/30 text-xs font-sans font-bold text-center block transition"
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

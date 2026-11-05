'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  resolveEffectiveFeatures,
  FeatureDefinition,
} from '@/core/features/registry';
import { SAMIQ_THEMES, ThemeId } from '@/themes/contract';

// Pre-defined ready packages matching requirements
const READY_PACKAGES = [
  {
    id: 'starter',
    nameAr: 'باقة الانطلاقة (Static Core)',
    priceUsd: 100,
    badge: 'الأسرع تدشيناً',
    features: ['tier_1_static'],
    description: 'واجهة فاخرة أحادية فائقة السرعة مع هوية بصرية مخصصة ونموذج طلب واتساب مباشر.',
    highlights: [
      'سرعة تحميل فائقة (Cold Load أقل من 150 كيلوبايت)',
      'تصميم متجاوب بالكامل مع أصغر شاشات الجوال (320px)',
      'عرض بطاقات المنتجات مع تفاصيل المكونات الأصلية',
      'زر طلب سريع موجه إلى واتساب المتجر',
      'استضافة سحابية عالمية مع حماية SSL مجانية',
    ],
  },
  {
    id: 'growth',
    nameAr: 'باقة النمو (Editable Hub)',
    priceUsd: 250,
    badge: 'الأكثر طلباً للبدء',
    features: ['tier_1_static', 'tier_2_editable'],
    description: 'لوحة تحكم إدارية خاصة بالتاجر لإدارة المنتجات والأسعار والمخزون مع إحصائيات مبسطة.',
    highlights: [
      'كافة مزايا باقة الانطلاقة',
      'لوحة تحكم إدارية كاملة وسهلة الاستخدام باللغة العربية',
      'إضافة وتعديل وحذف المنتجات وتحديث الأسعار لحظياً',
      'إدارة المخزون والتنبيه عند نفاد الكميات',
      'سجل وتتبع الطلبات الواردة وإحصائيات الزوار',
    ],
  },
  {
    id: 'commerce',
    nameAr: 'باقة التجارة المتكاملة (Omni Commerce)',
    priceUsd: 400,
    badge: 'تجارة إلكترونية كاملة',
    features: ['tier_1_static', 'tier_2_editable', 'cart_whatsapp'],
    description: 'سلة تسوق متطورة، نظام كوبونات تخفيض، مناطق شحن، وتعدد عملات (YER / SAR / USD).',
    highlights: [
      'كافة مزايا باقة النمو الإدارية',
      'سلة تسوق ذكية تحسب الإجمالي وتبني رسالة واتساب مفصلة',
      'نظام كوبونات الخصم وقسائم الترويج',
      'تعدد العملات بالريال اليمني والسعودي والدولار الأمريكي',
      'إدارة مناطق ورسوم الشحن والتوصيل للمحافظات',
    ],
  },
  {
    id: 'intelligence',
    nameAr: 'باقة الاحتراف والذكاء التخصصي (Smart AI Hub)',
    priceUsd: 550,
    badge: 'ذكاء اصطناعي تخصصي',
    features: [
      'tier_1_static',
      'tier_2_editable',
      'tier_3_catalog',
      'cart_whatsapp',
      'smart_tags_ai',
      'authenticity_guide',
      'skin_routine_advisor',
    ],
    description: 'الوسوم الذكية بالذكاء الاصطناعي، فلترة تخصصية عميقة، مختبر كشف الأصالة، ومستشار الروتين.',
    highlights: [
      'كافة مزايا باقة التجارة المتكاملة',
      'توليد وتصنيف الوسوم التلقائية بالذكاء الاصطناعي (#الوسوم_الذكية)',
      'مختبر كشف المقلد وفحص التشغيلات التفاعلي لبناء ثقة المشتري',
      'مستشار روتين العناية وتحديد مشاكل البشرة التفاعلي',
      'كتالوج ديناميكي متعدد الأقسام والتصنيفات الدقيقة',
    ],
  },
  {
    id: 'royal',
    nameAr: 'الباقة الملكية الشاملة (Royal Enterprise)',
    priceUsd: 700,
    badge: 'الحل الرقمي الأقوى',
    features: [
      'tier_1_static',
      'tier_2_editable',
      'tier_3_catalog',
      'cart_whatsapp',
      'smart_tags_ai',
      'authenticity_guide',
      'skin_routine_advisor',
      'customer_accounts',
      'ai_chatbot',
    ],
    description: 'مستشار ذكي AI مدرب باللهجة المحلية 24/7، بوابة حسابات العملاء ونقاط الولاء، وأتمتة شاملة.',
    highlights: [
      'كافة مزايا باقة الاحتراف والذكاء التخصصي',
      'مستشار تجميلي ذكي (AI Chatbot) يجيب باللهجة اليمنية مدار الساعة',
      'بوابة حسابات العملاء مع نظام نقاط الولاء واستبدال القسائم',
      'تجهيز للربط مع بوابات الدفع الإلكتروني والمحافظ اليمنية',
      'دعم هندسي مستمر وتحديثات أمنية ذات أولوية قصوى',
    ],
  },
];

const TEMPLATE_PREVIEWS = [
  {
    id: 'luxury-noir',
    nameAr: 'أسود رخامي فاخر (Luxury Noir)',
    tagline: 'الأسود الساحر مع الذهب الملكي وإضاءات الهالو السينمائية',
    bestFor: 'العلامات التجميلية الفاخرة، العطور الحصرية، والمجوهرات',
    previewUrl: '/?demo=1&theme=luxury-noir',
    bgColor: '#070709',
    accentColor: '#C9A84C',
  },
  {
    id: 'ivory-journal',
    nameAr: 'حرير عاجي تحريري (Ivory Journal)',
    tagline: 'حرير عاجي دافئ، نصوص إسبريسو، وطابع المجلات التحريرية العالمية',
    bestFor: 'صالونات التجميل، العلامات التحريرية، والمنتجات الطبيعية',
    previewUrl: '/?demo=1&theme=ivory-journal',
    bgColor: '#FAF7F2',
    accentColor: '#B8860B',
  },
  {
    id: 'clinic-lab',
    nameAr: 'مختبر سريري نقي (Clinic Lab)',
    tagline: 'الأبيض الطبي مع تركواز كلينيكال عميق وأخضر نعناعي مخبري',
    bestFor: 'العيادات الجلدية، الصيدليات المتخصصة، ومراكز الفحص',
    previewUrl: '/?demo=1&theme=clinic-lab',
    bgColor: '#FFFFFF',
    accentColor: '#0F4C4A',
  },
  {
    id: 'demo-restaurant',
    nameAr: 'مطعم ومقهى فاخر (Demo Restaurant)',
    tagline: 'قالب تفاعلي لقوائم الطعام والمشروبات وحجوزات الطاولات',
    bestFor: 'المطاعم الراقية، المقاهي التخصصية، ولاونجات الضيافة',
    previewUrl: '/?demo=1&tenant=demo-restaurant',
    bgColor: '#120F0D',
    accentColor: '#E67E22',
  },
];

export default function SamiqShowcasePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('luxury-noir');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('intelligence');
  const [selectedDomainOption, setSelectedDomainOption] = useState<'free' | 'com' | 'ye'>('com');
  const [customFeatures, setCustomFeatures] = useState<string[]>([
    'tier_1_static',
    'tier_2_editable',
    'tier_3_catalog',
    'cart_whatsapp',
    'smart_tags_ai',
    'authenticity_guide',
    'skin_routine_advisor',
  ]);
  const [activeTab, setActiveTab] = useState<'packages' | 'custom' | 'templates'>('packages');

  // Developer Telegram info (centralized)
  const developerTelegramHandle = 'KorosSenpai';
  const developerTelegramUrl = 'https://t.me/KorosSenpai';

  // Calculate pricing based on custom features
  const customPricing = useMemo(() => calculateTierPrice(customFeatures), [customFeatures]);

  // Handle ready package selection
  const handleSelectPackage = (pkg: typeof READY_PACKAGES[0]) => {
    setSelectedPackageId(pkg.id);
    setCustomFeatures(resolveEffectiveFeatures(pkg.features));
  };

  // Toggle custom feature with dependency handling
  const toggleCustomFeature = (id: string) => {
    const isCurrentlyOn = customFeatures.includes(id);
    if (!isCurrentlyOn) {
      setCustomFeatures(resolveEffectiveFeatures([...customFeatures, id]));
    } else {
      const toRemove = new Set<string>([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [featId, def] of Object.entries(FEATURES_REGISTRY)) {
          if (!toRemove.has(featId) && customFeatures.includes(featId)) {
            if (def.requires.some((req) => toRemove.has(req))) {
              toRemove.add(featId);
              changed = true;
            }
          }
        }
      }
      let result = customFeatures.filter((f) => !toRemove.has(f));
      if (!result.some((f) => f.startsWith('tier_'))) {
        result.push('tier_1_static');
      }
      setCustomFeatures(result);
    }
  };

  // Current package object or custom
  const currentPackageObj = READY_PACKAGES.find((p) => p.id === selectedPackageId);
  const effectivePrice = activeTab === 'packages' && currentPackageObj ? currentPackageObj.priceUsd : customPricing.totalUsd;
  const currentTemplateObj = TEMPLATE_PREVIEWS.find((t) => t.id === selectedTemplate) || TEMPLATE_PREVIEWS[0];

  const domainCostUsd = selectedDomainOption === 'com' ? 20 : selectedDomainOption === 'ye' ? 35 : 0;
  const annualRenewalUsd = domainCostUsd + 45;

  // Pre-filled Telegram order URL
  const telegramOrderUrl = useMemo(() => {
    const packageName =
      activeTab === 'packages' && currentPackageObj ? currentPackageObj.nameAr : `باقة مخصصة ($${customPricing.totalUsd})`;
    const featureNames = customFeatures
      .map((fid) => FEATURES_REGISTRY[fid]?.nameAr || fid)
      .slice(0, 6)
      .join('، ');

    const domainLabel =
      selectedDomainOption === 'com'
        ? 'دومين رسمي خاص (.com) — $20 سنوياً'
        : selectedDomainOption === 'ye'
        ? 'دومين محلي رسمي (.ye) — $35 سنوياً'
        : 'نطاق فرعي مجاني (*.samiq.app) — $0 سنوياً';

    const text =
      `السلام عليكم أخي المطور (@${developerTelegramHandle})،\n` +
      `أرغب بطلب متجر رقمي فاخر عبر محرك منصة سَامِق (SAMIQ).\n\n` +
      `القالب المفضل: ${currentTemplateObj.nameAr}\n` +
      `الباقة المختارة: ${packageName}\n` +
      `عقد التأسيس (مرة واحدة): $${effectivePrice} (يشمل استضافة السنة الأولى مجاناً)\n` +
      `خيار النطاق: ${domainLabel}\n` +
      `تجديد الاستضافة السنوية (من السنة 2): $45 / سنوياً (السنة الأولى مجانية $0)\n` +
      `المزايا المحددة: ${featureNames}...\n\n` +
      `أرجو تزويدي بتفاصيل التجهيز، وقت التسليم، وآلية الربط. شكراً لك!`;

    return `${developerTelegramUrl}?text=${encodeURIComponent(text)}`;
  }, [
    activeTab,
    currentPackageObj,
    customPricing.totalUsd,
    customFeatures,
    currentTemplateObj.nameAr,
    effectivePrice,
    selectedDomainOption,
  ]);

  return (
    <div className="min-h-screen bg-[#070709] text-[#FAF7F2] font-sans selection:bg-[#C9A84C]/30 selection:text-[#E8D390]">
      {/* Top Luxury Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#070709]/95 backdrop-blur-md border-b border-white/[0.08] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#BF953F] to-[#B38728] flex items-center justify-center text-[#070709] font-serif font-bold text-xl shadow-[0_0_15px_rgba(201,168,76,0.3)]">
              سـ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-serif font-bold text-[#FAF7F2]">
                  سَامِق (SAMIQ)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8D390] font-sans font-semibold">
                  بوابة الأسعار والعروض الرسمية
                </span>
              </div>
              <p className="text-xs text-[#8E8B85]">
                منصة هندسة المتاجر الرقمية الفاخرة وتصنيف المنتجات بالذكاء الاصطناعي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="min-h-[44px] px-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#FAF7F2] border border-white/10 text-xs font-semibold transition inline-flex items-center gap-1.5"
            >
              <span>معاينة المتجر الحي</span>
              <span>←</span>
            </Link>
            <a
              href={telegramOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-[#070709] text-xs font-bold transition shadow-lg inline-flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.7 6.4a2.25 2.25 0 0 0 .126 4.195l4.312 1.348 1.624 5.228a1.5 1.5 0 0 0 2.45.64l2.58-2.203 4.802 3.535a2.25 2.25 0 0 0 3.524-1.39l3.3-15.5a2.242 2.242 0 0 0-1.996-2.468z" />
              </svg>
              <span>طلب متجر فوري</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Luxury Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-white/[0.08]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-[#070709]/0 to-[#070709] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8D390] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
            <span>محرك معماري مستقل فائق السرعة للعلامات التخصصية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FAF7F2] leading-tight">
            متجرك الرقمي القادم بفخامة عالمية،
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8D390] via-[#C9A84C] to-[#AA771C]">
              وذكاء اصطناعي يرفع مبيعاتك 3 أضعاف
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#A09D94] max-w-3xl mx-auto leading-relaxed">
            محرك سَامِق (SAMIQ) ليس قالباً مكرراً، بل بنية معمارية فريدة تجمع بين سرعة التحميل الخارقة،
            3 قوالب بصرية فاخرة، سلة طلبات واتساب متطورة، وتصنيف ذكي للمنتجات بالذكاء الاصطناعي مع دعم كامل للسوق اليمني والخليجي.
          </p>

          {/* Quick Advantage Badges */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-start">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs font-bold text-[#E8D390] block">سرعة البرق</span>
              <p className="text-xs text-[#8E8B85]">تحميل بارد أقل من 150kB، استجابة فورية بدون أي تأخير.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs font-bold text-[#E8D390] block">3 قوالب مستقلة</span>
              <p className="text-xs text-[#8E8B85]">رخامي ملكي، تحريري عاجي، وسريري طبي بمجرد نقرة زر.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs font-bold text-[#E8D390] block">تعدد العملات</span>
              <p className="text-xs text-[#8E8B85]">تسعير آلي بالريال اليمني والسعودي والدولار بدقة تامة.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <span className="text-xs font-bold text-[#E8D390] block">الوسوم الذكية AI</span>
              <p className="text-xs text-[#8E8B85]">تحليل المنتجات وتوليد الوسوم التخصصية تلقائياً.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace: Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/10 inline-flex items-center gap-1">
            <button
              onClick={() => setActiveTab('packages')}
              className={`min-h-[44px] px-5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#070709] shadow-lg'
                  : 'text-[#A09D94] hover:text-[#FAF7F2]'
              }`}
            >
              الباقات الجاهزة المعتمدة (Ready Packages)
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`min-h-[44px] px-5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'custom'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#070709] shadow-lg'
                  : 'text-[#A09D94] hover:text-[#FAF7F2]'
              }`}
            >
              حاسبة الباقة المخصصة وشجرة الترابطات
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`min-h-[44px] px-5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'templates'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#070709] shadow-lg'
                  : 'text-[#A09D94] hover:text-[#FAF7F2]'
              }`}
            >
              معرض القوالب المعمارية (4 قوالب)
            </button>
          </div>
        </div>

        {/* TAB 1: READY-MADE PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                اختر الباقة المناسبة لمرحلة نمو تجارتك
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                أسعار شفافة لمرة واحدة تشمل الإعداد والتهيئة دون اشتراكات خفية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {READY_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`rounded-3xl p-5 flex flex-col justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#C9A84C]/15 to-[#070709] border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.15)] ring-1 ring-[#C9A84C]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#E8D390] font-semibold">
                          {pkg.badge}
                        </span>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] ring-4 ring-[#C9A84C]/30" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-[#FAF7F2]">
                          {pkg.nameAr}
                        </h3>
                        <p className="text-xs text-[#8E8B85] mt-1.5 leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <span className="text-xs text-[#8E8B85] block">التكلفة التقديرية:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-serif font-bold text-[#E8D390]">
                            ${pkg.priceUsd}
                          </span>
                          <span className="text-xs text-[#8E8B85]">دولار</span>
                        </div>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#FAF7F2]/90">
                        {pkg.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <svg className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-xs text-[#A09D94]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <button
                        className={`w-full min-h-[44px] rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#C9A84C] text-[#070709]'
                            : 'bg-white/5 text-[#FAF7F2] hover:bg-white/10'
                        }`}
                      >
                        {isSelected ? 'الباقة المحددة حالياً' : 'تحديد هذه الباقة'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE CUSTOM PROPOSAL & DEPENDENCY TREE */}
        {activeTab === 'custom' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                شجرة الترابطات الهندسية وحاسبة التكلفة المخصصة
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                اضغط على أي ميزة لتفعيلها أو إيقافها؛ يضمن النظام تفعيل المتطلبات السابقة تلقائياً وإلغاء التبعيات بأمان.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Tree View */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#FAF7F2]">
                      المسار المعماري للترابطات (Architecture Hierarchy)
                    </h3>
                    <p className="text-xs text-[#8E8B85]">
                      المستوى 1 الأساسي يفتح المستوى 2 والملحقات، والمستوى 2 يفتح الكتالوج والمستشار الذكي.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8D390] font-bold">
                    {customFeatures.length} مزايا مفعلة
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Root Tier 1 */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-[#C9A84C]" />
                        <div>
                          <span className="text-sm font-bold text-[#FAF7F2] block">
                            باقة الحضور الرقمي الفاخر (Tier 1: Static Core)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            الأساس المعماري الإلزامي لكافة المتاجر
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#C9A84C]/20 text-[#E8D390]">
                        +$100 (أساسي)
                      </span>
                    </div>

                    {/* Direct Addons to Tier 1 */}
                    <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-2 pt-2">
                      <span className="text-xs text-[#8E8B85] font-semibold block">
                        ملحقات المستوى الأول المباشرة:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['cart_whatsapp', 'authenticity_guide', 'skin_routine_advisor'].map((id) => {
                          const feat = FEATURES_REGISTRY[id];
                          const active = customFeatures.includes(id);
                          return (
                            <button
                              key={id}
                              onClick={() => toggleCustomFeature(id)}
                              className={`p-3 rounded-xl border text-start flex flex-col justify-between transition min-h-[44px] ${
                                active
                                  ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#FAF7F2]'
                                  : 'bg-white/[0.02] border-white/10 text-[#8E8B85] hover:border-white/20'
                              }`}
                            >
                              <span className="text-xs font-bold block">{feat.nameAr}</span>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                                <span className="text-xs text-[#E8D390] font-mono">+${feat.basePriceUsd}</span>
                                <span className={`text-xs ${active ? 'text-emerald-400 font-bold' : 'text-[#8E8B85]'}`}>
                                  {active ? 'مفعل' : 'معطل'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Level 2: Editable Hub */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${customFeatures.includes('tier_2_editable') ? 'bg-[#C9A84C]' : 'bg-white/20'}`} />
                        <div>
                          <span className="text-sm font-bold text-[#FAF7F2] block">
                            لوحة التحكم وإدارة المحتوى (Tier 2: Editable Merchant Hub)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            يتطلب Tier 1 ويفتح حسابات العملاء وشات بوت الذكاء الاصطناعي
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCustomFeature('tier_2_editable')}
                        className={`min-h-[40px] px-3 rounded-lg text-xs font-bold transition ${
                          customFeatures.includes('tier_2_editable')
                            ? 'bg-[#C9A84C] text-[#070709]'
                            : 'bg-white/10 text-[#FAF7F2] hover:bg-white/15'
                        }`}
                      >
                        {customFeatures.includes('tier_2_editable') ? 'مفعل (+$150)' : 'تفعيل (+$150)'}
                      </button>
                    </div>

                    {/* Direct Addons to Tier 2 */}
                    {customFeatures.includes('tier_2_editable') && (
                      <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-2 pt-2 animate-fadeIn">
                        <span className="text-xs text-[#8E8B85] font-semibold block">
                          ملحقات المستوى الثاني:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {['customer_accounts', 'ai_chatbot'].map((id) => {
                            const feat = FEATURES_REGISTRY[id];
                            const active = customFeatures.includes(id);
                            return (
                              <button
                                key={id}
                                onClick={() => toggleCustomFeature(id)}
                                className={`p-3 rounded-xl border text-start flex flex-col justify-between transition min-h-[44px] ${
                                  active
                                    ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#FAF7F2]'
                                    : 'bg-white/[0.02] border-white/10 text-[#8E8B85] hover:border-white/20'
                                }`}
                              >
                                <span className="text-xs font-bold block">{feat.nameAr}</span>
                                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                                  <span className="text-xs text-[#E8D390] font-mono">+${feat.basePriceUsd}</span>
                                  <span className={`text-xs ${active ? 'text-emerald-400 font-bold' : 'text-[#8E8B85]'}`}>
                                    {active ? 'مفعل' : 'معطل'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level 3: Full Catalog & AI Smart Tags */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${customFeatures.includes('tier_3_catalog') ? 'bg-[#C9A84C]' : 'bg-white/20'}`} />
                        <div>
                          <span className="text-sm font-bold text-[#FAF7F2] block">
                            الكتالوج الشامل والوسوم الذكية (Tier 3: Dynamic Catalog)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            يتطلب Tier 2 ويفتح الوسوم التلقائية بالذكاء الاصطناعي وبوابات الدفع
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCustomFeature('tier_3_catalog')}
                        className={`min-h-[40px] px-3 rounded-lg text-xs font-bold transition ${
                          customFeatures.includes('tier_3_catalog')
                            ? 'bg-[#C9A84C] text-[#070709]'
                            : 'bg-white/10 text-[#FAF7F2] hover:bg-white/15'
                        }`}
                      >
                        {customFeatures.includes('tier_3_catalog') ? 'مفعل (+$200)' : 'تفعيل (+$200)'}
                      </button>
                    </div>

                    {/* Direct Addons to Tier 3 */}
                    {customFeatures.includes('tier_3_catalog') && (
                      <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-2 pt-2 animate-fadeIn">
                        <span className="text-xs text-[#8E8B85] font-semibold block">
                          ملحقات المستوى الثالث والذكاء الاصطناعي:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {['smart_tags_ai', 'payment_gateways'].map((id) => {
                            const feat = FEATURES_REGISTRY[id];
                            const active = customFeatures.includes(id);
                            return (
                              <button
                                key={id}
                                onClick={() => toggleCustomFeature(id)}
                                className={`p-3 rounded-xl border text-start flex flex-col justify-between transition min-h-[44px] ${
                                  active
                                    ? 'bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#FAF7F2]'
                                    : 'bg-white/[0.02] border-white/10 text-[#8E8B85] hover:border-white/20'
                                }`}
                              >
                                <span className="text-xs font-bold block">{feat.nameAr}</span>
                                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                                  <span className="text-xs text-[#E8D390] font-mono">+${feat.basePriceUsd}</span>
                                  <span className={`text-xs ${active ? 'text-emerald-400 font-bold' : 'text-[#8E8B85]'}`}>
                                    {active ? 'مفعل' : 'معطل'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Proposal Summary Card */}
              <div className="lg:col-span-4 sticky top-28 space-y-6">
                <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#C9A84C]/30 shadow-2xl space-y-6">
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#C9A84C]/15 text-[#E8D390] font-semibold">
                      ملخص عرض السعر المخصص
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#FAF7F2] mt-2">
                      تكلفة باقتك المخصصة
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
                    <span className="text-xs text-[#8E8B85] block">الإجمالي التقديري لمرة واحدة:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-bold text-[#E8D390]">
                        ${customPricing.totalUsd}
                      </span>
                      <span className="text-xs text-[#8E8B85]">دولار أمريكي</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold pt-1">
                      يشمل الاستضافة السحابية والتهيئة الأولية
                    </p>
                  </div>

                  {/* Pick Template for Proposal */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FAF7F2] block">
                      القالب المعماري المفضل:
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/15 text-xs text-[#FAF7F2] focus:border-[#C9A84C] outline-hidden"
                    >
                      {TEMPLATE_PREVIEWS.map((tpl) => (
                        <option key={tpl.id} value={tpl.id} className="bg-[#070709] text-[#FAF7F2]">
                          {tpl.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Domain Option Toggle for Proposal */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FAF7F2] block">
                      خيار النطاق الرسمي (Domain Name):
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedDomainOption('free')}
                        className={`min-h-[44px] p-2 rounded-xl border text-center transition flex flex-col justify-center items-center ${
                          selectedDomainOption === 'free'
                            ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#FAF7F2] font-bold'
                            : 'bg-white/5 border-white/10 text-[#8E8B85] hover:border-white/20'
                        }`}
                      >
                        <span>نطاق مجاني</span>
                        <span className="font-mono text-emerald-400 text-xs">$0 / سنوياً</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDomainOption('com')}
                        className={`min-h-[44px] p-2 rounded-xl border text-center transition flex flex-col justify-center items-center ${
                          selectedDomainOption === 'com'
                            ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#FAF7F2] font-bold'
                            : 'bg-white/5 border-white/10 text-[#8E8B85] hover:border-white/20'
                        }`}
                      >
                        <span>دومين رسمي .com</span>
                        <span className="font-mono text-[#E8D390] text-xs">+$20 / سنوياً</span>
                      </button>
                    </div>
                  </div>

                  {/* Recurring Renewal Details Card */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#8E8B85]">
                      <span>عقد التأسيس (مرة واحدة):</span>
                      <span className="font-bold text-[#FAF7F2]">${customPricing.totalUsd}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8E8B85]">
                      <span>النطاق السنوي:</span>
                      <span className="font-bold text-[#E8D390]">
                        {selectedDomainOption === 'com' ? '$20 / سنوياً' : '$0 / سنوياً'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#8E8B85]">
                      <span>استضافة السنة الأولى:</span>
                      <span className="font-bold text-emerald-400">مجاناً ($0)</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8E8B85] pt-1 border-t border-white/5">
                      <span>تجديد الاستضافة من السنة 2:</span>
                      <span className="font-mono text-[#FAF7F2]">$45 / سنوياً</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#8E8B85] block">المزايا المضمنة ({customFeatures.length}):</span>
                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1 text-xs text-[#A09D94]">
                      {customFeatures.map((fid) => (
                        <div key={fid} className="flex items-center justify-between py-1 border-b border-white/5">
                          <span className="truncate">{FEATURES_REGISTRY[fid]?.nameAr || fid}</span>
                          <span className="font-mono text-[#E8D390] shrink-0">
                            +${FEATURES_REGISTRY[fid]?.basePriceUsd || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={telegramOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[48px] rounded-2xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-[#070709] text-xs sm:text-sm font-bold transition shadow-xl flex items-center justify-center gap-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.7 6.4a2.25 2.25 0 0 0 .126 4.195l4.312 1.348 1.624 5.228a1.5 1.5 0 0 0 2.45.64l2.58-2.203 4.802 3.535a2.25 2.25 0 0 0 3.524-1.39l3.3-15.5a2.242 2.242 0 0 0-1.996-2.468z" />
                      </svg>
                      <span>اطلب هذه الباقة عبر تيليجرام (@{developerTelegramHandle})</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARCHITECTURAL TEMPLATES GALLERY */}
        {activeTab === 'templates' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                4 قوالب معمارية فاخرة بهويات مستقلة تماماً
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                كل قالب تم بناؤه من الصفر بـ DNA بصري مستقل، ويمكن تبديل القالب بنقرة واحدة من لوحة التحكم دون فقدان أي بيانات.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEMPLATE_PREVIEWS.map((tpl) => {
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    className={`rounded-3xl p-6 border transition-all space-y-5 ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#C9A84C]/15 to-[#070709] border-[#C9A84C] shadow-2xl'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: tpl.accentColor }}
                        />
                        <h3 className="font-serif font-bold text-lg text-[#FAF7F2]">
                          {tpl.nameAr}
                        </h3>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#E8D390] font-semibold">
                        قالب جاهز للإنتاج
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#A09D94] leading-relaxed">
                      {tpl.tagline}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-[#8E8B85] space-y-1">
                      <span className="text-[#FAF7F2] font-semibold block">الأنسب لـ:</span>
                      <p>{tpl.bestFor}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Link
                        href={tpl.previewUrl}
                        target="_blank"
                        className="flex-1 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <span>معاينة حية للقالب</span>
                        <span>↗</span>
                      </Link>
                      <button
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`min-h-[44px] px-5 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? 'bg-[#C9A84C] text-[#070709]'
                            : 'bg-white/5 hover:bg-white/10 text-[#E8D390] border border-[#C9A84C]/30'
                        }`}
                      >
                        {isSelected ? 'القالب المختار للطلب' : 'اختيار هذا القالب'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* DEDICATED SECTION: TRANSPARENT ANNUAL & OPERATIONAL ECONOMICS        */}
        {/* ==================================================================== */}
        <section className="p-8 sm:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-2xl space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#E8D390] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              <span>شفافية مالية مطلقة 100% بدون أي اشتراكات مفاجئة</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF7F2]">
              التكاليف السنوية والتشغيلية الشفافة (الدومين، الاستضافة، والتجديد)
            </h2>

            <p className="text-xs sm:text-sm text-[#A09D94] leading-relaxed">
              نؤمن في سَامِق بالوضوح المالي التام مع عملائنا منذ اليوم الأول. إليك التفصيل الدقيق لرسوم البناء لمرة واحدة ورسوم التشغيل والتجديد السنوية الحقيقية دون أي تكاليف مستترة:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Setup Fee */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
                  1
                </div>
                <div>
                  <span className="text-xs font-semibold text-gold block">تُدفع لمرة واحدة فقط عند الاستلام</span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-ivory mt-0.5">
                    أولاً: رسوم تأسيس وبناء المتجر
                  </h3>
                </div>
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-[#E8D390]">$100 - $700+</span>
                    <span className="text-xs text-muted-lux">حسب الباقة</span>
                  </div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#A09D94]">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>برمجة معمارية فاخرة وخاصة بعلامتك (Cold Load أقل من 150kB).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>تهيئة الكتالوج، وسوم الذكاء الاصطناعي، وسلة واتساب الذكية.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-champagne font-semibold">استضافة سحابية عالمية مجانية للعام الأول بالكامل ($0).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>صفر عمولة (0%) على كافة مبيعاتك وأرباحك مدى الحياة.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 2: Domain Name */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
                  2
                </div>
                <div>
                  <span className="text-xs font-semibold text-champagne block">حجز وتجديد النطاق سنوياً</span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-ivory mt-0.5">
                    ثانياً: رسوم النطاق الرسمي (Domain)
                  </h3>
                </div>
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-[#E8D390]">
                      {selectedDomainOption === 'free' ? '$0' : selectedDomainOption === 'com' ? '$20' : '$35'}
                    </span>
                    <span className="text-xs text-muted-lux">/ سنوياً</span>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
                  <div
                    onClick={() => setSelectedDomainOption('free')}
                    className={`cursor-pointer p-3 rounded-xl border transition flex items-center justify-between min-h-[44px] ${
                      selectedDomainOption === 'free'
                        ? 'bg-gold/15 border-gold text-ivory'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">نطاق فرعي مجاني (*.samiq.app)</span>
                      <span className="text-muted-dim text-xs">مدى الحياة بدون أي تجديد</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">$0</span>
                  </div>

                  <div
                    onClick={() => setSelectedDomainOption('com')}
                    className={`cursor-pointer p-3 rounded-xl border transition flex items-center justify-between min-h-[44px] ${
                      selectedDomainOption === 'com'
                        ? 'bg-gold/15 border-gold text-ivory'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">دومين عالمي خاص (.com / .net)</span>
                      <span className="text-muted-dim text-xs">شامل حماية SSL وCloudflare</span>
                    </div>
                    <span className="font-mono text-gold font-bold">$20/سنة</span>
                  </div>

                  <div
                    onClick={() => setSelectedDomainOption('ye')}
                    className={`cursor-pointer p-3 rounded-xl border transition flex items-center justify-between min-h-[44px] ${
                      selectedDomainOption === 'ye'
                        ? 'bg-gold/15 border-gold text-ivory'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">دومين يمني رسمي (.ye / .com.ye)</span>
                      <span className="text-muted-dim text-xs">وفق رسوم الهيئة العامة للاتصالات</span>
                    </div>
                    <span className="font-mono text-gold font-bold">$35/سنة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pillar 3: Hosting & Maintenance (Year 2+) */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
                  3
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block">ابتداءً من السنة الثانية فقط</span>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-ivory mt-0.5">
                    ثالثاً: الاستضافة السحابية والصيانة
                  </h3>
                </div>
                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-emerald-400">$35 - $50</span>
                    <span className="text-xs text-muted-lux">/ سنوياً (أقل من $4/شهرياً)</span>
                  </div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-[#A09D94]">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span><strong className="text-champagne">السنة الأولى: مجاناً ($0)</strong> مشمولة بالكامل مع التأسيس.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>بنية سحابية عالمية فائقة السرعة للمستخدمين داخل اليمن والخليج.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>نسخ احتياطي يومي متواصل وتحديثات برمجية أمنية فورية.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>دعم فني واستجابة هندسية مباشرة ومستمرة.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-gold/15 to-gold/5 border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-start">
              <span className="text-xs font-bold text-champagne block">
                ملخص التكلفة لاختيارك الحالي ({selectedDomainOption === 'free' ? 'نطاق مجاني' : selectedDomainOption === 'com' ? 'دومين رسمي .com' : 'دومين يمني .ye'}):
              </span>
              <p className="text-xs text-muted-lux">
                السنة الأولى: <strong className="text-ivory">${effectivePrice}</strong> عقد تأسيس
                {selectedDomainOption !== 'free' && ` + $${domainCostUsd} حجز النطاق`} (الاستضافة مجاناً $0) ·
                التجديد من السنة الثانية: <strong className="text-emerald-400">${annualRenewalUsd} / سنوياً فقط</strong> (شامل النطاق والسيرفر).
              </p>
            </div>

            <a
              href={telegramOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-obsidian-dark text-xs font-bold transition shadow-lg inline-flex items-center gap-2 shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.7 6.4a2.25 2.25 0 0 0 .126 4.195l4.312 1.348 1.624 5.228a1.5 1.5 0 0 0 2.45.64l2.58-2.203 4.802 3.535a2.25 2.25 0 0 0 3.524-1.39l3.3-15.5a2.242 2.242 0 0 0-1.996-2.468z" />
              </svg>
              <span>طلب المتجر بهذا الخيار عبر تيليجرام</span>
            </a>
          </div>
        </section>

        {/* Global Bottom Order Call to Action Banner */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-[#BF953F]/20 via-[#C9A84C]/10 to-[#AA771C]/20 border border-[#C9A84C]/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#E8D390] font-semibold">
              انطلاقة سريعة خلال 48 إلى 72 ساعة
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF7F2]">
              هل أنت جاهز لتدشين متجرك بـ DNA معماري استثنائي؟
            </h2>
            <p className="text-xs sm:text-sm text-[#A09D94] leading-relaxed">
              تواصل مباشرة مع المطور عبر تيليجرام لمناقشة هويتك البصرية، وحجز استضافتك، وتجهيز كتالوجك بالذكاء الاصطناعي.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
            <a
              href={telegramOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-8 rounded-full bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-[#070709] text-sm font-bold transition shadow-xl inline-flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.7 6.4a2.25 2.25 0 0 0 .126 4.195l4.312 1.348 1.624 5.228a1.5 1.5 0 0 0 2.45.64l2.58-2.203 4.802 3.535a2.25 2.25 0 0 0 3.524-1.39l3.3-15.5a2.242 2.242 0 0 0-1.996-2.468z" />
              </svg>
              <span>اطلب متجرك الآن عبر تيليجرام (@{developerTelegramHandle})</span>
            </a>
            <Link
              href="/"
              className="min-h-[48px] px-6 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF7F2] border border-white/15 text-xs font-bold transition inline-flex items-center"
            >
              العودة للمتجر الرئيسي
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-[#8E8B85]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} منصة سَامِق (SAMIQ Luxury Architecture Platform) — كافة الحقوق محفوظة.</p>
          <p>تطوير وهندسة معمارية متقدمة بواسطة @{developerTelegramHandle}</p>
        </div>
      </footer>
    </div>
  );
}

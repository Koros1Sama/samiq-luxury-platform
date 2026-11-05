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
import { PdfInvoiceModal } from '@/core/features/PdfInvoiceModal';

// Pre-defined ready packages matching requirements
const READY_PACKAGES = [
  {
    id: 'starter',
    nameAr: 'باقة 1: الموقع التعريفي الثابت (Static Landing Page)',
    priceUsd: 80,
    badge: 'الأسرع تدشيناً',
    features: ['tier_1_static'],
    description: 'واجهة فاخرة فائقة السرعة بدون أي منتجات وبدون لوحة تحكم، تركز على هوية المحل، قصة العلامة، الخريطة وأوقات العمل، وزر واتساب مباشر.',
    highlights: [
      'واجهة فاخرة أحادية بدون أي منتجات أو كتالوج مع هوية بصرية مخصصة',
      'سرعة تحميل فائقة (Cold Load أقل من 150 كيلوبايت)',
      'تصميم متجاوب بالكامل مع أصغر شاشات الجوال (320px)',
      'عرض هوية العلامة، قصة المحل، وأوقات العمل بدقة',
      'موقع المحل على الخريطة وروابط التواصل الاجتماعي',
      'زر محادثة وطلب مباشر موجه إلى واتساب المتجر',
      'استضافة سحابية عالمية مع حماية SSL مجانية للسنة الأولى ($0)',
    ],
  },
  {
    id: 'growth',
    nameAr: 'باقة 2: الموقع القابل للتعديل بلوحة إدارة (Editable Hub)',
    priceUsd: 130,
    badge: 'لوحة تحكم للمدير',
    features: ['tier_1_static', 'tier_2_editable'],
    description: 'نفس الموقع التعريفي مع مدخل سري للوحة تحكم المدير لتعديل النصوص، الصور، أوقات العمل، أرقام التواصل، وترتيب الأقسام.',
    highlights: [
      'كافة مزايا باقة الموقع التعريفي الثابت',
      'مدخل سري للوحة تحكم المدير بإيميل وكلمة سر خاصة',
      'إمكانية تعديل كافة النصوص والعناوين والصور لحظياً',
      'تعديل أوقات الدوام، أرقام التواصل، وروابط السوشيال ميديا',
      'إمكانية إخفاء وإظهار وترتيب أقسام الصفحة الرئيسية في أي وقت',
    ],
  },
  {
    id: 'catalog',
    nameAr: 'باقة 3: كتالوج المنتجات والأقسام والوسوم (Full Catalog)',
    priceUsd: 200,
    badge: 'كتالوج متكامل',
    features: ['tier_1_static', 'tier_2_editable', 'tier_3_catalog'],
    description: 'إضافة كتالوج المنتجات، الأقسام، الوسوم، الفلترة الفورية، صفحات تفاصيل المنتجات، 3 أنماط عملات، وإدارة الكتالوج من لوحة المدير.',
    highlights: [
      'كافة مزايا باقتي التعريفي ولوحة الإدارة',
      'إضافة قسم المنتجات والأقسام والوسوم مع فلترة فورية سريعة',
      'صفحات تفاصيل مستقلة لكل منتج بالصور والمواصفات',
      'دعم 3 أنماط لعرض العملات (عملة واحدة / تحويل تلقائي / أسعار يدوية)',
      'إدارة المنتجات، الأسعار، والمخزون بالكامل من لوحة المدير',
    ],
  },
  {
    id: 'commerce',
    nameAr: 'باقة التجارة وسلة واتساب (WhatsApp Commerce)',
    priceUsd: 235,
    badge: 'الأكثر طلباً للتجارة',
    features: ['tier_1_static', 'tier_2_editable', 'tier_3_catalog', 'cart_whatsapp'],
    description: 'كتالوج المنتجات + سلة تسوق ذكية تحسب الإجمالي وتبني رسالة واتساب منسقة فورية وتوثق الطلب في لوحة الإدارة.',
    highlights: [
      'كافة مزايا باقة الكتالوج المتكامل',
      'سلة تسوق ذكية تحفظ المنتجات تلقائياً وتبني فاتورة واتساب',
      'توثيق الطلبات الواردة في لوحة الإدارة',
      'خيار الدفع عند الاستلام أو التحويل المباشر',
    ],
  },
  {
    id: 'intelligence',
    nameAr: 'باقة الذكاء الاصطناعي والأصالة (Smart AI & Lab)',
    priceUsd: 335,
    badge: 'ذكاء اصطناعي وأصالة',
    features: [
      'tier_1_static',
      'tier_2_editable',
      'tier_3_catalog',
      'cart_whatsapp',
      'smart_tags_ai',
      'authenticity_guide',
      'skin_routine_advisor',
    ],
    description: 'كتالوج المنتجات + السلة + مساعد الوسوم الذكية بالذكاء الاصطناعي + مختبر كشف الأصالة + مستشار الروتين التفاعلي.',
    highlights: [
      'كافة مزايا باقة التجارة وسلة واتساب',
      'توليد وتصنيف الوسوم التلقائية بالذكاء الاصطناعي مع SEO والبحث الدلالي',
      'مختبر ودليل كشف المقلد والبحث باسم المنتج لبناء ثقة المشتري',
      'مستشار روتين العناية وتحديد المنتجات الأنسب لاحتياج الزبون',
    ],
  },
  {
    id: 'royal',
    nameAr: 'الباقة الملكية الشاملة (Royal Enterprise)',
    priceUsd: 495,
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
      'whatsapp_channel',
      'delivery_zones',
      'coupons',
    ],
    description: 'مستشار ذكي AI في الموقع وشات بوت واتساب، حسابات الزبائن والمفضلة، كوبونات التخفيض، ومناطق التوصيل.',
    highlights: [
      'كافة مزايا باقة الذكاء الاصطناعي والأصالة',
      'مستشار ذكي AI في الموقع يجيب 24/7 ببطاقات منتجات تفاعلية',
      'شات بوت منصة واتساب التفاعلي (بـ 3 أنماط عمل)',
      'بوابة حسابات العملاء المستقلة وقوائم المفضلة وسجل الطلبات',
      'إدارة مناطق ورسوم الشحن والتوصيل مع نظام الكوبونات والخصومات',
    ],
  },
];

const TEMPLATE_PREVIEWS = [
  {
    id: 'luxury-noir',
    nameAr: 'مفتاح الجمال — أسود رخامي فاخر (Luxury Noir)',
    tagline: 'الأسود الساحر مع الذهب الملكي وإضاءات الهالو السينمائية لمفتاح الجمال',
    bestFor: 'مستحضرات العناية الفاخرة، السيرومات النقية، والمكياج الملكي',
    previewUrl: '/?demo=1&theme=luxury-noir',
    bgColor: '#070709',
    accentColor: '#C9A84C',
  },
  {
    id: 'ivory-journal',
    nameAr: 'مفتاح الجمال — حرير عاجي تحريري (Ivory Journal)',
    tagline: 'حرير عاجي دافئ، نصوص إسبريسو، وطابع المجلات التحريرية لمفتاح الجمال',
    bestFor: 'أدلة روتين العناية، مختارات العدد التحريري، ومستحضرات الترطيب',
    previewUrl: '/?demo=1&theme=ivory-journal',
    bgColor: '#FAF7F2',
    accentColor: '#B8860B',
  },
  {
    id: 'clinic-lab',
    nameAr: 'مفتاح الجمال — مختبر سريري نقي (Clinic Lab)',
    tagline: 'الأبيض الطبي مع تركواز كلينيكال عميق لفحص الأصالة وكشف المقلد لمفتاح الجمال',
    bestFor: 'فحص الأصالة المخبري، تحليل المكونات والتركيزات الدقيقة، وكشف المقلد',
    previewUrl: '/?demo=1&theme=clinic-lab',
    bgColor: '#FFFFFF',
    accentColor: '#0F4C4A',
  },
];

export default function SamiqShowcasePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('luxury-noir');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('intelligence');
  const [selectedDomainOption, setSelectedDomainOption] = useState<'free' | 'com' | 'ye'>('com');
  const [clientStoreTitle, setClientStoreTitle] = useState<string>('مفتاح الجمال');
  const [clientContactName, setClientContactName] = useState<string>('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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

  const effectiveStoreName = clientStoreTitle.trim() || 'متجري الجديد';

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
        : 'نطاق فرعي مجاني (*.samiq.shop) — $0 سنوياً';

    const text =
      `السلام عليكم أخي المطور (@${developerTelegramHandle})،\n` +
      `أرغب بطلب متجر رقمي فاخر عبر محرك منصة سَامِق (SAMIQ).\n\n` +
      `اسم المتجر / المشروع: ${effectiveStoreName}\n` +
      (clientContactName.trim() ? `اسم العميل: ${clientContactName.trim()}\n` : '') +
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
    effectiveStoreName,
    clientContactName,
  ]);

  return (
    <div className="min-h-screen bg-[#070709] text-[#FAF7F2] font-sans selection:bg-[#C9A84C]/30 selection:text-[#E8D390]">
      {/* Official PDF Invoice Modal */}
      <PdfInvoiceModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        projectName={effectiveStoreName}
        clientName={clientContactName}
        selectedTemplate={selectedTemplate}
        selectedFeatureIds={customFeatures}
        domainType={selectedDomainOption === 'free' ? 'subdomain_free' : selectedDomainOption === 'com' ? 'custom_com' : 'custom_ye'}
        annualDomainUsd={domainCostUsd}
        annualHostingUsd={45}
      />

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

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-lg transition flex items-center gap-1.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>تحميل عرض السعر (PDF)</span>
            </button>
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
              className="min-h-[44px] px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] border border-white/15 text-xs font-bold transition inline-flex items-center gap-2"
            >
              <span>طلب عبر تيليجرام</span>
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
            <span>محرك معماري مستقل فائق السرعة يبدأ من $80 فقط</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#FAF7F2] leading-tight">
            متجرك الرقمي القادم بفخامة عالمية،
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8D390] via-[#C9A84C] to-[#AA771C]">
              وتدرج هندسي يبدأ من واجهة تعريفية إلى أتمتة شاملة
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-[#A09D94] max-w-3xl mx-auto leading-relaxed">
            محرك سَامِق (SAMIQ) يقدم لك 3 درجات أساسية تراكمية: موقع تعريفي ثابت بدون منتجات ($80)، ثم قابل للتعديل مع لوحة تحكم المدير ($130)، ثم كتالوج المنتجات والأقسام والوسوم ($200)، مع إضافات مستقلة تختار منها ما يناسب ميزانيتك وطبيعة نشاطك.
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
          <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/10 inline-flex items-center gap-1 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('packages')}
              className={`min-h-[44px] px-5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'packages'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#AA771C] text-[#070709] shadow-lg'
                  : 'text-[#A09D94] hover:text-[#FAF7F2]'
              }`}
            >
              الباقات الجاهزة المعتمدة (6 باقات)
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
              معرض قوالب مفتاح الجمال (3 قوالب فاخرة)
            </button>
          </div>
        </div>

        {/* TAB 1: READY-MADE PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                اختر الباقة الأنسب لمرحلة نشاطك التجاري
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                كل باقة تشمل استضافة السنة الأولى مجاناً ($0)، بدون أي عمولات على المبيعات، مع إمكانية الترقية في أي وقت.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {READY_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between gap-6 relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#C9A84C]/15 to-[#070709] border-[#C9A84C] shadow-[0_0_30px_rgba(201,168,76,0.2)] ring-1 ring-[#C9A84C]/50'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#E8D390] font-semibold">
                          {pkg.badge}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-emerald-400 font-bold">المحددة حالياً</span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#FAF7F2]">
                          {pkg.nameAr}
                        </h3>
                        <p className="text-xs text-[#8E8B85] mt-1 leading-relaxed">
                          {pkg.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <span className="text-xs text-[#8E8B85] block">عقد التأسيس (مرة واحدة):</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-3xl font-serif font-bold text-[#E8D390]">
                            ${pkg.priceUsd}
                          </span>
                          <span className="text-xs text-[#8E8B85]">دولار أمريكي</span>
                        </div>
                        <span className="text-xs text-emerald-400 block mt-1">
                          يشمل استضافة السنة الأولى مجاناً ($0)
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="text-xs font-semibold text-[#FAF7F2] block">أهم المميزات:</span>
                        <ul className="space-y-1.5 text-xs text-[#A09D94]">
                          {pkg.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleSelectPackage(pkg)}
                        className={`w-full min-h-[44px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#C9A84C] text-[#070709] shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 text-[#FAF7F2] border border-white/10'
                        }`}
                      >
                        <span>{isSelected ? 'الباقة المعتمدة للطلب' : 'اختيار هذه الباقة'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectPackage(pkg);
                          setIsPdfModalOpen(true);
                        }}
                        className="w-full min-h-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-champagne border border-gold/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9" />
                          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                          <rect x="6" y="14" width="12" height="8" />
                        </svg>
                        <span>تصدير فاتورة هذه الباقة (PDF)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE CUSTOM CONFIGURATOR & TREE */}
        {activeTab === 'custom' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                شجرة الترابطات الهندسية وحاسبة التخصيص الدقيق
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                انقري على أي درجة أو ميزة لتفعيلها تلقائياً مع كافة متطلباتها الهندسية المسبقة، وشاهدي التكلفة تتحدث لحظياً.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Tree */}
              <div className="lg:col-span-8 space-y-6">
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
                  {/* Level 1: Static Core */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-[#C9A84C]" />
                        <div>
                          <span className="text-sm font-bold text-[#FAF7F2] block">
                            المستوى 1: باقة الموقع التعريفي الثابت (Tier 1: Static Core)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            واجهة فاخرة بدون منتجات وبدون لوحة تحكم — الأساس الإلزامي
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#C9A84C]/20 text-[#E8D390]">
                        +$80 (أساسي)
                      </span>
                    </div>

                    {/* Direct Addons to Tier 1 */}
                    <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-2 pt-2">
                      <span className="text-xs text-[#8E8B85] font-semibold block">
                        إضافات المستوى الأول المباشرة:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        {['custom_domain', 'second_language', 'pwa_app', 'analytics_stats'].map((id) => {
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
                            المستوى 2: الموقع القابل للتعديل ولوحة المدير (Tier 2: Editable Hub)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            دخول سري للمدير لتعديل النصوص والصور والأقسام (+$50 فوق الدرجة 1)
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
                        {customFeatures.includes('tier_2_editable') ? 'مفعل ($130 تراكمي)' : 'تفعيل (+$50)'}
                      </button>
                    </div>

                    {/* Direct Addons to Tier 2 */}
                    {customFeatures.includes('tier_2_editable') && (
                      <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-2 pt-2 animate-fadeIn">
                        <span className="text-xs text-[#8E8B85] font-semibold block">
                          إضافات المستوى الثاني والشات بوت:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {['bookings', 'blog', 'ai_chatbot'].map((id) => {
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

                        {/* Channels under AI Chatbot */}
                        {customFeatures.includes('ai_chatbot') && (
                          <div className="mr-4 pr-3 border-r-2 border-sky-400/30 space-y-2 pt-2">
                            <span className="text-xs text-sky-400 font-bold block">
                              قنوات التواصل الاجتماعي المربوطة بالشات بوت:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {['telegram_channel', 'whatsapp_channel', 'instagram_channel'].map((id) => {
                                const feat = FEATURES_REGISTRY[id];
                                const active = customFeatures.includes(id);
                                return (
                                  <button
                                    key={id}
                                    onClick={() => toggleCustomFeature(id)}
                                    className={`p-2.5 rounded-xl border text-start flex flex-col justify-between transition min-h-[44px] ${
                                      active
                                        ? 'bg-sky-950/40 border-sky-400/50 text-[#FAF7F2]'
                                        : 'bg-white/[0.02] border-white/10 text-[#8E8B85]'
                                    }`}
                                  >
                                    <span className="text-xs font-bold block">{feat.nameAr}</span>
                                    <span className="text-xs text-sky-300 font-mono mt-1">+${feat.basePriceUsd}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Level 3: Full Catalog Core */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${customFeatures.includes('tier_3_catalog') ? 'bg-[#C9A84C]' : 'bg-white/20'}`} />
                        <div>
                          <span className="text-sm font-bold text-[#FAF7F2] block">
                            المستوى 3: كتالوج المنتجات والأقسام والوسوم (Tier 3: Dynamic Catalog)
                          </span>
                          <span className="text-xs text-[#8E8B85]">
                            كتالوج المنتجات، الأقسام، 3 أنماط عملات، والبحث (+$70 فوق الدرجة 2)
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
                        {customFeatures.includes('tier_3_catalog') ? 'مفعل ($200 تراكمي)' : 'تفعيل (+$70)'}
                      </button>
                    </div>

                    {/* Direct Addons to Tier 3 */}
                    {customFeatures.includes('tier_3_catalog') && (
                      <div className="mr-6 pr-4 border-r-2 border-white/10 space-y-3 pt-2 animate-fadeIn">
                        <span className="text-xs text-[#8E8B85] font-semibold block">
                          ملحقات المستوى الثالث والكتالوج:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            'cart_whatsapp',
                            'inventory_variants',
                            'smart_tags_ai',
                            'customer_accounts',
                            'authenticity_guide',
                            'skin_routine_advisor',
                            'multi_branch',
                          ].map((id) => {
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
                <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-[#C9A84C]/40 shadow-2xl space-y-6">
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#C9A84C]/15 text-[#E8D390] font-semibold">
                      ملخص عرض السعر المخصص
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#FAF7F2] mt-2">
                      تكلفة باقتك المخصصة
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#070709] border border-white/10 space-y-2">
                    <span className="text-xs text-[#8E8B85] block">إجمالي التأسيس لمرة واحدة:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-serif font-bold text-[#E8D390]">
                        ${customPricing.totalUsd}
                      </span>
                      <span className="text-xs text-[#8E8B85]">دولار أمريكي</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold pt-1">
                      يشمل الاستضافة السحابية والتهيئة الأولية مجاناً ($0)
                    </p>
                  </div>

                  {/* Project / Store Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#FAF7F2] block">
                      اكتب اسم مشروعك أو متجرك لإصدار عرض السعر الرسمي:
                    </label>
                    <input
                      type="text"
                      value={clientStoreTitle}
                      onChange={(e) => setClientStoreTitle(e.target.value)}
                      placeholder="مثال: متجر أصالة، عيادة النخبة..."
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/15 text-xs text-[#FAF7F2] focus:border-[#C9A84C] outline-hidden font-semibold"
                    />
                  </div>

                  {/* Client Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8E8B85] block">
                      اسم العميل أو صفتك (اختياري):
                    </label>
                    <input
                      type="text"
                      value={clientContactName}
                      onChange={(e) => setClientContactName(e.target.value)}
                      placeholder="مثال: الأستاذ محمد"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/15 text-xs text-[#FAF7F2] focus:border-[#C9A84C] outline-hidden"
                    />
                  </div>

                  {/* Pick Template for Proposal */}
                  <div className="space-y-1.5">
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
                  <div className="space-y-1.5">
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
                        <span>نطاق فرعي مجاني</span>
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

                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="w-full min-h-[46px] rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark text-xs sm:text-sm font-bold transition shadow-xl flex items-center justify-center gap-2 hover:brightness-110"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect x="6" y="14" width="12" height="8" />
                      </svg>
                      <span>تحميل عرض السعر والفاتورة الرسمية (PDF)</span>
                    </button>

                    <a
                      href={telegramOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] rounded-2xl bg-white/10 hover:bg-white/15 text-[#FAF7F2] text-xs font-bold transition flex items-center justify-center gap-2 border border-white/15"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-16.7 6.4a2.25 2.25 0 0 0 .126 4.195l4.312 1.348 1.624 5.228a1.5 1.5 0 0 0 2.45.64l2.58-2.203 4.802 3.535a2.25 2.25 0 0 0 3.524-1.39l3.3-15.5a2.242 2.242 0 0 0-1.996-2.468z" />
                      </svg>
                      <span>إرسال الباقة المختارة عبر تيليجرام</span>
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
              <span className="text-xs font-mono font-semibold tracking-wider text-[#C9A84C] uppercase">
                MIFTAH AL-JAMAL ARCHITECTURAL TEMPLATES
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                3 قوالب معمارية فاخرة لمفتاح الجمال بهندسات بصرية مستقلة
              </h2>
              <p className="text-xs sm:text-sm text-[#8E8B85]">
                كل قالب تم تخصيصه وتوجيهه بالكامل لمفتاح الجمال (لكشف المقلد)، ويمكنك معاينة المتجر الحي بكل قالب واختيار النمط الأنسب لعلامتك.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              التكاليف السنوية وخدمات السيرفرات الشفافة (الدومين، الاستضافة، والتجديد)
            </h2>

            <p className="text-xs sm:text-sm text-[#A09D94] leading-relaxed">
              نؤمن في سَامِق بالوضوح المالي التام مع عملائنا منذ اليوم الأول. إليك التفصيل الدقيق لرسوم البناء لمرة واحدة ورسوم الاستضافة والتجديد السنوية الحقيقية دون أي تكاليف مستترة:
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
                    <span className="text-3xl font-serif font-bold text-[#E8D390]">$80 - $500+</span>
                    <span className="text-xs text-muted-lux">حسب الباقة المعتمدة</span>
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
                      <span className="font-bold block">نطاق فرعي مجاني (*.samiq.shop)</span>
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
                      <span className="text-muted-dim text-xs">شامل حماية SSL وسيرفرات Cloudflare</span>
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
                    <span className="text-3xl font-serif font-bold text-emerald-400">$45</span>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark text-xs font-bold transition shadow-lg inline-flex items-center gap-1.5"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>تصدير الفاتورة (PDF)</span>
              </button>

              <a
                href={telegramOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-xs font-bold transition shadow-md inline-flex items-center gap-2 border border-white/15"
              >
                <span>طلب عبر تيليجرام</span>
              </a>
            </div>
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
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="min-h-[48px] px-7 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark text-sm font-bold transition shadow-xl inline-flex items-center gap-2 hover:brightness-110"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>تحميل عرض السعر والفاتورة الرسمية (PDF)</span>
            </button>
            <a
              href={telegramOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-sm font-bold transition shadow-xl inline-flex items-center gap-2 border border-white/15"
            >
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

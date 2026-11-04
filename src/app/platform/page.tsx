'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  validateFeatureDependencies,
  resolveEffectiveFeatures,
  FeatureDefinition,
} from '@/core/features/registry';
import { ThemeId, SAMIQ_THEMES } from '@/themes/contract';

export default function PlatformSuperAdminPage() {
  // Active Theme & Live DB Stats
  const [activeTheme, setActiveTheme] = useState<ThemeId>('luxury-noir');
  const [metrics, setMetrics] = useState({
    productsCount: 6,
    ordersCount: 2,
    bookingsCount: 2,
    customersCount: 1,
    tenantName: 'مفتاح الجمال',
    whatsapp: '775234989',
    city: 'صنعاء',
  });

  // Selected Features in Simulator
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'tier_1_static',
    'tier_2_editable',
    'tier_3_catalog',
    'cart_whatsapp',
    'authenticity_guide',
    'skin_routine_advisor',
    'customer_accounts',
    'ai_chatbot',
    'smart_tags_ai',
  ]);

  // View Mode: synchronized (default) | tree_only | matrix_only
  const [viewMode, setViewMode] = useState<'sync' | 'tree' | 'matrix'>('sync');

  // Platform & Developer Identity Meta State
  const [platformMetaState, setPlatformMetaState] = useState({
    developerTelegramHandle: 'KorosSenpai',
    developerTelegramUrl: 'https://t.me/KorosSenpai',
    platformNameAr: 'سَامِق',
    platformNameEn: 'SAMIQ',
    taglineAr: 'منصة هندسة المتاجر الرقمية الفاخرة والذكاء الاصطناعي',
    showcasePath: '/samiq',
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [metaSaveMsg, setMetaSaveMsg] = useState('');

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  // Fetch initial config from real database
  useEffect(() => {
    async function loadPlatformConfig() {
      try {
        const res = await fetch('/api/platform/config');
        const data = await res.json();
        if (data.success) {
          if (data.themeId) setActiveTheme(data.themeId);
          if (data.platformMeta) {
            setPlatformMetaState(data.platformMeta);
          }
          if (data.features) {
            const activeKeys = Object.entries(data.features)
              .filter(([_, active]) => Boolean(active))
              .map(([key]) => key);
            if (activeKeys.length > 0) {
              setSelectedFeatures(resolveEffectiveFeatures(activeKeys));
            }
          }
          setMetrics({
            productsCount: data.productsCount,
            ordersCount: data.ordersCount,
            bookingsCount: data.bookingsCount,
            customersCount: data.customersCount,
            tenantName: data.tenant?.name || 'مفتاح الجمال',
            whatsapp: data.tenant?.whatsapp || '775234989',
            city: data.tenant?.city || 'صنعاء',
          });
        }
      } catch (err) {
        console.error('Error fetching platform config:', err);
      }
    }
    loadPlatformConfig();
  }, []);

  const pricing = useMemo(() => calculateTierPrice(selectedFeatures), [selectedFeatures]);
  const validation = useMemo(() => validateFeatureDependencies(selectedFeatures), [selectedFeatures]);

  // Cascade feature toggle helper
  const toggleFeatureWithCascade = (id: string) => {
    const isCurrentlyOn = selectedFeatures.includes(id);
    if (!isCurrentlyOn) {
      // Turn ON: resolve prerequisites
      setSelectedFeatures(resolveEffectiveFeatures([...selectedFeatures, id]));
    } else {
      // Turn OFF: cascade turn-off to any dependent child features
      const toRemove = new Set<string>([id]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [featId, def] of Object.entries(FEATURES_REGISTRY)) {
          if (!toRemove.has(featId) && selectedFeatures.includes(featId)) {
            if (def.requires.some((req) => toRemove.has(req))) {
              toRemove.add(featId);
              changed = true;
            }
          }
        }
      }
      let result = selectedFeatures.filter((f) => !toRemove.has(f));
      if (!result.some((f) => f.startsWith('tier_'))) {
        result.push('tier_1_static');
      }
      setSelectedFeatures(result);
    }
  };

  // Switch Theme & Persist immediately to database
  const handleSwitchTheme = async (themeId: ThemeId) => {
    setActiveTheme(themeId);
    try {
      await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
      setSaveSuccessMsg(`تم تطبيق القالب المعماري ${SAMIQ_THEMES[themeId].nameAr} فورياً على المتجر الحي`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e) {}
  };

  // Full Save of Features & Active Theme
  const handleSavePlatformConfig = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: activeTheme,
          features: selectedFeatures,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg(`تم بنجاح حفظ وتطبيق تكوين الباقة ($${pricing.totalUsd}) والقالب النشط في قاعدة البيانات.`);
      } else {
        setSaveError(data.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      setSaveError('تعذر حفظ البيانات في السيرفر');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyShowcaseLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/samiq` : 'https://samiq-luxury-platform.vercel.app/samiq';
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleSavePlatformMeta = async () => {
    setIsSavingMeta(true);
    setMetaSaveMsg('');
    try {
      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformMeta: platformMetaState }),
      });
      const data = await res.json();
      if (data.success) {
        setMetaSaveMsg('تم حفظ وتحديث هوية المنصة وبيانات المطور في قاعدة البيانات بنجاح.');
        setTimeout(() => setMetaSaveMsg(''), 4000);
      }
    } catch (e) {
      setMetaSaveMsg('تعذر حفظ بيانات المطور');
    } finally {
      setIsSavingMeta(false);
    }
  };

  // Node Component for Tree View
  const TreeNode = ({
    id,
    label,
    price,
    requires,
    isBranchHeader,
  }: {
    id: string;
    label: string;
    price: number;
    requires?: string[];
    isBranchHeader?: boolean;
  }) => {
    const isSelected = selectedFeatures.includes(id);
    return (
      <button
        type="button"
        onClick={() => toggleFeatureWithCascade(id)}
        className={`w-full min-h-[44px] p-3 rounded-2xl border text-start transition-all duration-300 relative group flex items-center justify-between gap-2 ${
          isSelected
            ? 'bg-elevated border-gold/60 shadow-[0_0_15px_rgba(201,168,76,0.18)]'
            : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
              isSelected ? 'bg-gold animate-pulse' : 'bg-white/20'
            }`}
          />
          <div className="min-w-0">
            <span
              className={`text-xs sm:text-sm font-sans font-bold block truncate ${
                isSelected ? 'text-ivory' : 'text-muted-lux'
              }`}
            >
              {label}
            </span>
            {requires && requires.length > 0 && (
              <span className="text-xs text-muted-dim block truncate">
                تتطلب: {requires.join(', ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-sans font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
            +${price}
          </span>
          <span
            className={`text-xs font-sans font-bold px-2 py-0.5 rounded ${
              isSelected ? 'bg-emerald-950/60 text-emerald-300' : 'bg-white/5 text-muted-dim'
            }`}
          >
            {isSelected ? 'مفعل' : 'معطل'}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#070709]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#BF953F] to-[#B38728] flex items-center justify-center text-obsidian-dark font-serif font-bold text-xl shadow-[0_0_15px_rgba(201,168,76,0.3)]">
              سـ
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-ivory">
                لوحة منصة سَامِق (SAMIQ Multi-Tenant Architecture Studio)
              </h1>
              <p className="text-xs text-muted-lux">
                إدارة المستأجرين، شجرة الترابطات الهندسية، والمزامنة اللحظية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/samiq"
              target="_blank"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <span>صفحة العرض والأسعار للعملاء (/samiq)</span>
              <span>↗</span>
            </Link>
            <button
              onClick={handleCopyShowcaseLink}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/15 text-xs font-semibold transition inline-flex items-center gap-1.5"
            >
              <span>{copySuccess ? 'تم نسخ الرابط!' : 'نسخ رابط العرض للعميل'}</span>
            </button>
            <Link
              href="/"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition inline-flex items-center gap-1.5"
            >
              <span>معاينة المتجر الحي</span>
              <span>←</span>
            </Link>
            <Link
              href="/admin"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition inline-flex items-center"
            >
              لوحة المحل (Admin)
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Real DB Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">مستحضرات الكتالوج الحي:</span>
            <div className="text-2xl font-serif font-bold text-ivory">{metrics.productsCount}</div>
            <span className="text-xs text-emerald-400 font-bold">موثقة ومفهرسة</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">طلبات الشراء المسجلة:</span>
            <div className="text-2xl font-serif font-bold text-ivory">{metrics.ordersCount}</div>
            <span className="text-xs text-champagne font-bold">قيد التنفيذ والمتابعة</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">حجوزات الاستشارات:</span>
            <div className="text-2xl font-serif font-bold text-ivory">{metrics.bookingsCount}</div>
            <span className="text-xs text-gold font-bold">جلسات مؤكدة</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">حسابات العملاء المسجلين:</span>
            <div className="text-2xl font-serif font-bold text-ivory">{metrics.customersCount}</div>
            <span className="text-xs text-emerald-400 font-bold">أعضاء نادي الولاء</span>
          </div>
        </div>

        {/* Live Architecture Template Switcher */}
        <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                القالب المعماري النشط للمتجر (Live Architectural Template)
              </h2>
              <p className="text-xs text-muted-lux">
                اختاري القالب النشط ليتم تطبيقه فورياً في قاعدة البيانات وحفظه في samiq-db.json
              </p>
            </div>
            <span className="text-xs font-bold text-gold px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
              القالب الحالي: {SAMIQ_THEMES[activeTheme]?.nameAr}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {Object.values(SAMIQ_THEMES).map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleSwitchTheme(theme.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                    isActive
                      ? 'bg-elevated border-gold shadow-[0_0_20px_rgba(201,168,76,0.25)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ivory">{theme.nameAr}</span>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold text-obsidian-dark font-bold">
                          النشط حالياً
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-lux leading-relaxed">
                      {theme.paletteDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-gold font-semibold">{theme.badge}</span>
                    <Link
                      href={`/?theme=${theme.id}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-champagne hover:underline font-bold"
                    >
                      معاينة القالب ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform & Developer Identity Configuration Section */}
        <div className="p-6 rounded-3xl bg-surface border border-gold/30 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  إعدادات هوية المنصة والمطور (Platform & Developer Meta)
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                تخصيص بيانات مطور محرك سَامِق ورابط تيليجرام وعرض الأسعار عبر قاعدة البيانات الموحدة
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/samiq"
                target="_blank"
                className="min-h-[44px] px-4 rounded-xl bg-gold/20 hover:bg-gold/30 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <span>فتح صفحة العرض العامة (/samiq)</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {metaSaveMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn">
              {metaSaveMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">معرف تيليجرام للمطور (Telegram Handle):</label>
              <div className="relative">
                <input
                  type="text"
                  value={platformMetaState.developerTelegramHandle}
                  onChange={(e) =>
                    setPlatformMetaState({ ...platformMetaState, developerTelegramHandle: e.target.value })
                  }
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden dir-ltr text-end"
                  placeholder="KorosSenpai"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">رابط محادثة تيليجرام (Telegram URL):</label>
              <input
                type="text"
                value={platformMetaState.developerTelegramUrl}
                onChange={(e) =>
                  setPlatformMetaState({ ...platformMetaState, developerTelegramUrl: e.target.value })
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden dir-ltr text-end"
                placeholder="https://t.me/KorosSenpai"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">اسم المنصة الرسمي (العربية):</label>
              <input
                type="text"
                value={platformMetaState.platformNameAr}
                onChange={(e) =>
                  setPlatformMetaState({ ...platformMetaState, platformNameAr: e.target.value })
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                placeholder="سَامِق"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">مسار صفحة العرض (Showcase Path):</label>
              <input
                type="text"
                value={platformMetaState.showcasePath}
                onChange={(e) =>
                  setPlatformMetaState({ ...platformMetaState, showcasePath: e.target.value })
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden dir-ltr text-end"
                placeholder="/samiq"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <p className="text-xs text-muted-lux">
              أي تعديل على هذه البيانات يتم تطبيقه فورياً في تذييل قوالب المتجر وفي رسائل الطلب
            </p>
            <button
              onClick={handleSavePlatformMeta}
              disabled={isSavingMeta}
              className="min-h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-obsidian-dark font-sans font-bold text-xs transition shadow-md disabled:opacity-50"
            >
              {isSavingMeta ? 'جاري الحفظ...' : 'حفظ هوية المنصة والمطور'}
            </button>
          </div>
        </div>

        {/* View Mode Switcher & Save Confirmation Alerts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('sync')}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-sans font-bold transition ${
                viewMode === 'sync'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                  : 'text-ivory/70 hover:text-ivory'
              }`}
            >
              العرض المتزامن (شجري + مصفوفة)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-sans font-bold transition ${
                viewMode === 'tree'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                  : 'text-ivory/70 hover:text-ivory'
              }`}
            >
              المخطط الشجري فقط
            </button>
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-sans font-bold transition ${
                viewMode === 'matrix'
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                  : 'text-ivory/70 hover:text-ivory'
              }`}
            >
              مصفوفة الميزات فقط
            </button>
          </div>

          <button
            type="button"
            onClick={handleSavePlatformConfig}
            disabled={isSaving}
            className="min-h-[44px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition inline-flex items-center justify-center gap-2"
          >
            {isSaving ? 'جارٍ الحفظ والتطبيق...' : 'حفظ وتطبيق الباقة والقالب في قاعدة البيانات'}
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-sans text-center">
            {saveSuccessMsg}
          </div>
        )}
        {saveError && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-sans text-center">
            {saveError}
          </div>
        )}

        {/* ==================================================================== */}
        {/* SYNCHRONIZED INTERACTIVE DEPENDENCY TREE VIEW                        */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT/CENTER: TREE VIEW (Rendered in 'sync' or 'tree' modes) */}
          {(viewMode === 'sync' || viewMode === 'tree') && (
            <div
              className={`${
                viewMode === 'tree' ? 'lg:col-span-12' : 'lg:col-span-8'
              } p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-8`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base sm:text-xl font-serif font-bold text-ivory">
                    المخطط الشجري التفاعلي للترابطات الهندسية (Interactive Dependency Tree)
                  </h3>
                  <p className="text-xs text-muted-lux mt-1">
                    انقري على أي عقدة شجرية لتفعيلها تلقائياً مع كافة متطلباتها، أو إيقافها مع تسلسل
                    إيقاف الأبناء التابعين.
                  </p>
                </div>
                <span className="text-xs text-gold font-bold">
                  {selectedFeatures.length} ميزة نشطة
                </span>
              </div>

              {/* TREE STRUCTURE */}
              <div className="space-y-6">
                {/* Level 1: Root */}
                <div className="space-y-2">
                  <span className="text-xs font-sans font-bold text-gold block">
                    المستوى 1 (الجذر الأساسي):
                  </span>
                  <TreeNode
                    id="tier_1_static"
                    label={FEATURES_REGISTRY.tier_1_static.nameAr}
                    price={FEATURES_REGISTRY.tier_1_static.basePriceUsd}
                  />
                </div>

                {/* Level 2: Dynamic Engine */}
                <div className="ps-4 sm:ps-8 border-s-2 border-gold/30 space-y-2">
                  <span className="text-xs font-sans font-bold text-champagne block">
                    ──► المستوى 2 (المحرك الديناميكي):
                  </span>
                  <TreeNode
                    id="tier_2_editable"
                    label={FEATURES_REGISTRY.tier_2_editable.nameAr}
                    price={FEATURES_REGISTRY.tier_2_editable.basePriceUsd}
                    requires={['tier_1_static']}
                  />
                </div>

                {/* Level 3: Full Catalog Core */}
                <div className="ps-8 sm:ps-16 border-s-2 border-gold/40 space-y-4">
                  <span className="text-xs font-sans font-bold text-champagne block">
                    ──► المستوى 3 (نواة الكتالوج الذكي):
                  </span>
                  <TreeNode
                    id="tier_3_catalog"
                    label={FEATURES_REGISTRY.tier_3_catalog.nameAr}
                    price={FEATURES_REGISTRY.tier_3_catalog.basePriceUsd}
                    requires={['tier_2_editable']}
                  />

                  {/* BRANCHES FROM TIER 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {/* Branch A: Commerce & Accounts */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-xs font-sans font-bold text-emerald-400 block border-b border-white/5 pb-1.5">
                        فرع التجارة والولاء (Commerce Branch)
                      </span>
                      <div className="space-y-2">
                        <TreeNode
                          id="cart_whatsapp"
                          label={FEATURES_REGISTRY.cart_whatsapp.nameAr}
                          price={FEATURES_REGISTRY.cart_whatsapp.basePriceUsd}
                        />
                        <TreeNode
                          id="customer_accounts"
                          label={FEATURES_REGISTRY.customer_accounts.nameAr}
                          price={FEATURES_REGISTRY.customer_accounts.basePriceUsd}
                        />
                        <TreeNode
                          id="payment_gateways"
                          label={FEATURES_REGISTRY.payment_gateways.nameAr}
                          price={FEATURES_REGISTRY.payment_gateways.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                      </div>
                    </div>

                    {/* Branch B: Domain Intelligence & Tagging */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-xs font-sans font-bold text-gold block border-b border-white/5 pb-1.5">
                        فرع الذكاء التخصصي والوسوم (AI & Tagging)
                      </span>
                      <div className="space-y-2">
                        <TreeNode
                          id="smart_tags_ai"
                          label={FEATURES_REGISTRY.smart_tags_ai.nameAr}
                          price={FEATURES_REGISTRY.smart_tags_ai.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        <TreeNode
                          id="authenticity_guide"
                          label={FEATURES_REGISTRY.authenticity_guide.nameAr}
                          price={FEATURES_REGISTRY.authenticity_guide.basePriceUsd}
                        />
                        <TreeNode
                          id="skin_routine_advisor"
                          label={FEATURES_REGISTRY.skin_routine_advisor.nameAr}
                          price={FEATURES_REGISTRY.skin_routine_advisor.basePriceUsd}
                        />
                      </div>
                    </div>

                    {/* Branch C: AI Agents & Channels */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-xs font-sans font-bold text-sky-400 block border-b border-white/5 pb-1.5">
                        فرع الأتمتة والوكلاء الأذكياء (AI Agents)
                      </span>
                      <div className="space-y-2">
                        <TreeNode
                          id="ai_chatbot"
                          label={FEATURES_REGISTRY.ai_chatbot.nameAr}
                          price={FEATURES_REGISTRY.ai_chatbot.basePriceUsd}
                        />
                        <TreeNode
                          id="whatsapp_channel"
                          label={FEATURES_REGISTRY.whatsapp_channel.nameAr}
                          price={FEATURES_REGISTRY.whatsapp_channel.basePriceUsd}
                          requires={['ai_chatbot']}
                        />
                        <TreeNode
                          id="telegram_channel"
                          label={FEATURES_REGISTRY.telegram_channel.nameAr}
                          price={FEATURES_REGISTRY.telegram_channel.basePriceUsd}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: PRICING SUMMARY & LIVE METRICS (4 cols in sync mode) */}
          <div
            className={`${
              viewMode === 'tree' ? 'lg:col-span-12' : viewMode === 'matrix' ? 'lg:col-span-4' : 'lg:col-span-4'
            } p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-elevated to-surface border border-gold/40 shadow-2xl space-y-6 sticky top-24`}
          >
            <div>
              <span className="text-xs font-bold text-gold block">
                ملخص التسعير والاستثمار المعماري
              </span>
              <h3 className="text-base font-serif font-bold text-ivory mt-0.5">
                حاسبة الباقة الفورية
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex items-baseline justify-between text-muted-lux">
                <span>سعر الباقة الأساسية:</span>
                <span className="text-base font-serif font-bold text-ivory">
                  ${pricing.baseTierPriceUsd}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-muted-lux">
                <span>مجموع الإضافات والقنوات:</span>
                <span className="text-base font-serif font-bold text-gold">
                  +${pricing.addonsPriceUsd}
                </span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-sm font-bold text-ivory">الإجمالي المقدر:</span>
                <span className="text-3xl sm:text-4xl font-serif font-bold text-champagne drop-shadow-[0_2px_15px_rgba(201,168,76,0.3)]">
                  ${pricing.totalUsd}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-muted-lux">الباقة الأساسية الحالية:</span>
                <span className="text-gold font-bold">{pricing.selectedTier}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-lux">عدد المزايا المفعلة:</span>
                <span className="text-ivory font-bold">{selectedFeatures.length} ميزة</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-lux">صلاحية شروط الترابط (requires):</span>
                <span
                  className={
                    validation.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                  }
                >
                  {validation.isValid ? 'سليمة 100%' : 'توجد نواقص'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSavePlatformConfig}
              disabled={isSaving}
              className="w-full min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition inline-flex items-center justify-center"
            >
              {isSaving ? 'جارٍ الحفظ...' : 'حفظ الباقة في samiq-db.json'}
            </button>
          </div>
        </div>

        {/* MATRIX GRID (Rendered in 'sync' or 'matrix' modes) */}
        {(viewMode === 'sync' || viewMode === 'matrix') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                مصفوفة الميزات التفصيلية (Features Matrix Grid)
              </h3>
              <p className="text-xs text-muted-lux">
                قائمة كافة الإضافات الموديلية التابعة لمنصة سامق مع إمكانية التفعيل والتعطيل بنقرة
                واحدة
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(FEATURES_REGISTRY).map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeatureWithCascade(feat.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-elevated border-gold/50 shadow-md'
                        : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-1 pe-1">
                      <span className="text-xs sm:text-sm font-bold text-ivory block">
                        {feat.nameAr}
                      </span>
                      <p className="text-xs text-muted-lux leading-relaxed">
                        {feat.descriptionAr}
                      </p>
                      {feat.requires.length > 0 && (
                        <span className="text-xs text-gold/80 block pt-1">
                          تتطلب: {feat.requires.join(', ')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-xs font-sans font-bold bg-gold/15 text-gold border border-gold/30">
                        +${feat.basePriceUsd}
                      </span>
                      <span
                        className={`text-xs font-sans font-bold px-2 py-0.5 rounded ${
                          isSelected
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : 'bg-white/5 text-muted-dim'
                        }`}
                      >
                        {isSelected ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

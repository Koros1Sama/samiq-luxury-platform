'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  validateFeatureDependencies,
  resolveEffectiveFeatures,
} from '@/core/features/registry';
import { ThemeId, SAMIQ_THEMES, isValidThemeId } from '@/themes/contract';
import { SamiqProjectRecord } from '@/core/db/store';
import { PdfInvoiceModal } from '@/core/features/PdfInvoiceModal';

export default function PlatformSuperAdminPage() {
  // Fleet of Projects State
  const [projects, setProjects] = useState<SamiqProjectRecord[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-miftah');

  // Mode: 'custom_quote' (general quote for any project) | 'fleet_project' (linked to a registered project in fleet)
  const [targetMode, setTargetMode] = useState<'custom_quote' | 'fleet_project'>('custom_quote');
  const [quoteProjectTitle, setQuoteProjectTitle] = useState<string>('مفتاح الجمال — لكشف المقلد');
  const [quoteClientName, setQuoteClientName] = useState<string>('إدارة مفتاح الجمال');
  const [customDiscountUsd, setCustomDiscountUsd] = useState<number>(0);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Active Theme & Selected Features for the selected project / quote
  const [activeTheme, setActiveTheme] = useState<ThemeId>('luxury-noir');
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

  // Operational & Recurring Costs State
  const [projectDomainType, setProjectDomainType] = useState<'subdomain_free' | 'custom_com' | 'custom_ye'>('custom_com');
  const [projectAnnualDomainUsd, setProjectAnnualDomainUsd] = useState<number>(20);
  const [projectAnnualHostingUsd, setProjectAnnualHostingUsd] = useState<number>(45);
  const [projectAiPlan, setProjectAiPlan] = useState<'none' | 'byok' | 'managed_annual'>('byok');

  // Create Project Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [createProjectError, setCreateProjectError] = useState('');
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    slug: '',
    industryAr: 'العناية بالبشرة والمكياج',
    domain: '',
    domainType: 'custom_com' as 'subdomain_free' | 'custom_com' | 'custom_ye',
    themeId: 'luxury-noir' as ThemeId,
    whatsapp: '967770000000',
    city: 'صنعاء',
    adminPasscode: 'samiq2026',
    setupPriceUsd: 235,
  });

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
          if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
            const initialProj =
              data.projects.find((p: SamiqProjectRecord) => p.id === 'proj-miftah') || data.projects[0];
            setSelectedProjectId(initialProj.id);
            if (targetMode === 'fleet_project') {
              setActiveTheme(initialProj.themeId);
              setSelectedFeatures(resolveEffectiveFeatures(initialProj.enabledFeatures || []));
              setQuoteProjectTitle(initialProj.name);
              setProjectDomainType(initialProj.domainType || 'custom_com');
              setProjectAnnualDomainUsd(initialProj.annualDomainUsd ?? 20);
              setProjectAnnualHostingUsd(initialProj.annualHostingMaintenanceUsd ?? 45);
              setProjectAiPlan(initialProj.aiPlanType || 'byok');
            }
          }
          if (data.platformMeta) {
            setPlatformMetaState(data.platformMeta);
          }
        }
      } catch (err) {
        console.error('Error fetching platform config:', err);
      }
    }
    loadPlatformConfig();
  }, [targetMode]);

  // Currently selected fleet project
  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Effective display project name
  const effectiveProjectTitle = useMemo(() => {
    if (targetMode === 'fleet_project' && selectedProject) {
      return selectedProject.name;
    }
    return quoteProjectTitle.trim() || 'مشروع جديد';
  }, [targetMode, selectedProject, quoteProjectTitle]);

  // Sync state when fleet project is selected
  const handleSelectFleetProject = (proj: SamiqProjectRecord) => {
    setSelectedProjectId(proj.id);
    setActiveTheme(proj.themeId);
    setSelectedFeatures(resolveEffectiveFeatures(proj.enabledFeatures || []));
    setQuoteProjectTitle(proj.name);
    setProjectDomainType(proj.domainType || 'custom_com');
    setProjectAnnualDomainUsd(proj.annualDomainUsd ?? 20);
    setProjectAnnualHostingUsd(proj.annualHostingMaintenanceUsd ?? 45);
    setProjectAiPlan(proj.aiPlanType || 'byok');
    setSaveSuccessMsg(`تم تحديد مشروع «${proj.name}» للتخصيص والتطبيق.`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Fleet Aggregated Metrics (Industry-Agnostic)
  const fleetMetrics = useMemo(() => {
    const totalProjects = projects.length;
    const totalSetupRevenueUsd = projects.reduce((sum, p) => sum + (p.setupPriceUsd || 0), 0);
    const totalAnnualRecurringUsd = projects.reduce(
      (sum, p) =>
        sum +
        (p.annualDomainUsd || 0) +
        (p.annualHostingMaintenanceUsd || 0) +
        (p.aiPlanType === 'managed_annual' ? 90 : 0),
      0
    );
    const totalProductsAcrossFleet = projects.reduce((sum, p) => sum + (p.productsCount || 0), 0);
    const totalOrdersAcrossFleet = projects.reduce((sum, p) => sum + (p.ordersCount || 0), 0);

    return {
      totalProjects,
      totalSetupRevenueUsd,
      totalAnnualRecurringUsd,
      totalProductsAcrossFleet,
      totalOrdersAcrossFleet,
    };
  }, [projects]);

  const pricing = useMemo(
    () => calculateTierPrice(selectedFeatures, priceOverrides, customDiscountUsd),
    [selectedFeatures, priceOverrides, customDiscountUsd]
  );
  const validation = useMemo(() => validateFeatureDependencies(selectedFeatures), [selectedFeatures]);

  // Selected project annual recurring total
  const selectedProjectAnnualTotal = useMemo(() => {
    const domain = projectAnnualDomainUsd;
    const hosting = projectAnnualHostingUsd;
    const ai = projectAiPlan === 'managed_annual' ? 90 : 0;
    return domain + hosting + ai;
  }, [projectAnnualDomainUsd, projectAnnualHostingUsd, projectAiPlan]);

  // Handle Domain Tier Change
  const handleDomainTierChange = (type: 'subdomain_free' | 'custom_com' | 'custom_ye') => {
    setProjectDomainType(type);
    if (type === 'subdomain_free') {
      setProjectAnnualDomainUsd(0);
    } else if (type === 'custom_com') {
      setProjectAnnualDomainUsd(20);
    } else if (type === 'custom_ye') {
      setProjectAnnualDomainUsd(35);
    }
  };

  // Cascade feature toggle helper
  const toggleFeatureWithCascade = (id: string) => {
    const isCurrentlyOn = selectedFeatures.includes(id);
    if (!isCurrentlyOn) {
      setSelectedFeatures(resolveEffectiveFeatures([...selectedFeatures, id]));
    } else {
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

  // Handle manual price override for a feature
  const handleSetPriceOverride = (featId: string) => {
    const currentPrice = priceOverrides[featId] ?? FEATURES_REGISTRY[featId]?.basePriceUsd ?? 0;
    const input = prompt(`أدخل السعر المخصص لميزة «${FEATURES_REGISTRY[featId]?.nameAr}» بالدولار ($):`, String(currentPrice));
    if (input !== null) {
      const num = Number(input);
      if (!isNaN(num) && num >= 0) {
        setPriceOverrides((prev) => ({
          ...prev,
          [featId]: num,
        }));
      }
    }
  };

  // Switch Theme
  const handleSwitchTheme = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    setSaveSuccessMsg(`تم تحديد القالب ${SAMIQ_THEMES[themeId].nameAr}.`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Save Full Config for Selected Project & Platform
  const handleSavePlatformConfig = async () => {
    if (targetMode === 'custom_quote') {
      // In custom quote mode, prompt to create a new project with these settings
      setNewProjectForm((prev) => ({
        ...prev,
        name: quoteProjectTitle.trim() || 'مشروع جديد',
        slug: (quoteProjectTitle.trim() || 'store').toLowerCase().replace(/[^\w-]/g, '-'),
        setupPriceUsd: pricing.totalUsd,
        themeId: activeTheme,
        domainType: projectDomainType,
      }));
      setIsCreateModalOpen(true);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          themeId: activeTheme,
          features: selectedFeatures,
          domainType: projectDomainType,
          annualDomainUsd: projectAnnualDomainUsd,
          annualHostingMaintenanceUsd: projectAnnualHostingUsd,
          aiPlanType: projectAiPlan,
          setupPriceUsd: pricing.totalUsd,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.projects) {
          setProjects(data.projects);
        }
        setSaveSuccessMsg(
          `تم بنجاح حفظ وتطبيق تكوين مشروع «${effectiveProjectTitle}» (التأسيس: $${pricing.totalUsd} · التجديد: $${selectedProjectAnnualTotal}/سنوياً).`
        );
      } else {
        setSaveError(data.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err) {
      setSaveError('تعذر حفظ البيانات في السيرفر');
    } finally {
      setIsSaving(false);
    }
  };

  // Create New Client Project
  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.name.trim() || !newProjectForm.slug.trim()) {
      setCreateProjectError('يرجى كتابة اسم المتجر والمعرف التقني');
      return;
    }

    setIsCreatingProject(true);
    setCreateProjectError('');

    try {
      const domainVal =
        newProjectForm.domain.trim() ||
        (newProjectForm.domainType === 'subdomain_free'
          ? `${newProjectForm.slug.trim()}.samiq.shop`
          : `${newProjectForm.slug.trim()}.com`);

      const annualDomainCost =
        newProjectForm.domainType === 'subdomain_free' ? 0 : newProjectForm.domainType === 'custom_com' ? 20 : 35;

      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_project',
          name: newProjectForm.name.trim(),
          legalName: `${newProjectForm.name.trim()} — متجر رسمي`,
          slug: newProjectForm.slug.trim(),
          industryAr: newProjectForm.industryAr,
          domain: domainVal,
          domainType: newProjectForm.domainType,
          annualDomainUsd: annualDomainCost,
          annualHostingMaintenanceUsd: 45,
          aiPlanType: 'none',
          themeId: newProjectForm.themeId,
          whatsapp: newProjectForm.whatsapp.trim(),
          city: newProjectForm.city.trim(),
          adminPasscode: newProjectForm.adminPasscode.trim(),
          setupPriceUsd: Number(newProjectForm.setupPriceUsd) || pricing.totalUsd,
          enabledFeatures: selectedFeatures,
        }),
      });

      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
        if (data.project) {
          setSelectedProjectId(data.project.id);
          setTargetMode('fleet_project');
          setQuoteProjectTitle(data.project.name);
          setActiveTheme(data.project.themeId);
          setSelectedFeatures(data.project.enabledFeatures);
        }
        setIsCreateModalOpen(false);
        setSaveSuccessMsg(`تم تدشين مشروع «${newProjectForm.name}» بنجاح وإضافته للأسطول!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        setCreateProjectError(data.message || 'حدث خطأ أثناء تدشين المشروع');
      }
    } catch (err) {
      setCreateProjectError('فشل الاتصال بالسيرفر لتدشين المشروع');
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Delete Non-Primary Project
  const handleDeleteProject = async (projId: string, projName: string) => {
    if (!confirm(`هل أنت متأكد من حذف مشروع «${projName}» من الأسطول؟`)) return;

    try {
      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_project',
          projectId: projId,
        }),
      });
      const data = await res.json();
      if (data.success && data.projects) {
        setProjects(data.projects);
        setSelectedProjectId('proj-miftah');
        setSaveSuccessMsg(`تم حذف مشروع «${projName}» بنجاح.`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      } else {
        alert(data.message || 'تعذر حذف المشروع');
      }
    } catch (e) {
      alert('خطأ في الاتصال بالسيرفر أثناء الحذف');
    }
  };

  const handleCopyShowcaseLink = () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/samiq`
        : 'https://samiq.shop/samiq';
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
    incrementalDiff,
  }: {
    id: string;
    label: string;
    price: number;
    requires?: string[];
    incrementalDiff?: string;
  }) => {
    const isSelected = selectedFeatures.includes(id);
    const overridePrice = priceOverrides[id];
    const displayPrice = overridePrice !== undefined ? overridePrice : price;

    return (
      <div
        className={`w-full min-h-[44px] p-3.5 rounded-2xl border text-start transition-all duration-300 relative group flex flex-col justify-between gap-2.5 ${
          isSelected
            ? 'bg-elevated border-gold/60 shadow-[0_0_15px_rgba(201,168,76,0.18)]'
            : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleFeatureWithCascade(id)}
          className="w-full text-start flex items-start gap-2.5 focus:outline-hidden"
        >
          <span
            className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 transition-colors ${
              isSelected ? 'bg-gold animate-pulse' : 'bg-white/20'
            }`}
          />
          <div className="min-w-0 flex-1">
            <span
              className={`text-xs sm:text-sm font-sans font-bold block leading-snug ${
                isSelected ? 'text-ivory' : 'text-muted-lux'
              }`}
            >
              {label}
            </span>
            {requires && requires.length > 0 && (
              <span className="text-xs text-muted-dim block mt-1 leading-snug">
                تتطلب: {requires.join(', ')}
              </span>
            )}
          </div>
        </button>

        <div className="flex items-center justify-between w-full pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleSetPriceOverride(id)}
              title="انقر لتعديل السعر لهذا العرض يدوياً"
              className="text-xs font-sans font-bold px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition cursor-pointer"
            >
              {overridePrice !== undefined ? `$${displayPrice} (معدل)` : `+$${displayPrice}`}
            </button>
            {incrementalDiff && (
              <span className="text-xs text-muted-lux font-semibold">
                ({incrementalDiff})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleFeatureWithCascade(id)}
            className={`text-xs font-sans font-bold px-2 py-0.5 rounded transition ${
              isSelected ? 'bg-emerald-950/60 text-emerald-300' : 'bg-white/5 text-muted-dim'
            }`}
          >
            {isSelected ? 'مفعل' : 'معطل'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans pb-20">
      {/* Official PDF Invoice Modal */}
      <PdfInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        projectName={effectiveProjectTitle}
        clientName={quoteClientName}
        selectedTemplate={activeTheme}
        selectedFeatureIds={selectedFeatures}
        priceOverrides={priceOverrides}
        discountUsd={customDiscountUsd}
        domainType={projectDomainType}
        annualDomainUsd={projectAnnualDomainUsd}
        annualHostingUsd={projectAnnualHostingUsd}
        aiPlanType={projectAiPlan}
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#070709]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#BF953F] to-[#B38728] flex items-center justify-center text-obsidian-dark font-serif font-bold text-xl shadow-[0_0_15px_rgba(201,168,76,0.3)]">
              سـ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-serif font-bold text-ivory">
                  منصة سَامِق (SAMIQ Fleet & Multi-Tenant Studio)
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-semibold">
                  حاسبة عروض الأسعار والأسطول
                </span>
              </div>
              <p className="text-xs text-muted-lux">
                إصدار عروض الأسعار الرسمية (PDF)، شجرة الترابطات الهندسية، وإدارة أسطول المشاريع
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-lg transition flex items-center gap-1.5"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>تصدير عرض السعر / الفاتورة (PDF)</span>
            </button>
            <Link
              href="/samiq"
              target="_blank"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <span>صفحة الأسعار العامة (/samiq)</span>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Industry-Agnostic Platform Fleet Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">إجمالي المشاريع والمتاجر المدارة:</span>
            <div className="text-2xl font-serif font-bold text-ivory">{fleetMetrics.totalProjects} مشاريع</div>
            <span className="text-xs text-emerald-400 font-bold">موزعة على كافة القطاعات</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">إجمالي عقود التأسيس (One-Time Setup):</span>
            <div className="text-2xl font-serif font-bold text-gold">${fleetMetrics.totalSetupRevenueUsd}</div>
            <span className="text-xs text-champagne font-bold">مجموع قيمة بناء المتاجر المسجلة</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">العائد السنوي المتكرر (الدومينات + الاستضافة):</span>
            <div className="text-2xl font-serif font-bold text-emerald-400">${fleetMetrics.totalAnnualRecurringUsd} / سنوياً</div>
            <span className="text-xs text-muted-dim font-bold">مجموع رسوم التجديد السنوية</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-1">
            <span className="text-xs text-muted-lux font-medium">إجمالي المنتجات والطلبات بالمنصة:</span>
            <div className="text-2xl font-serif font-bold text-ivory">
              {fleetMetrics.totalProductsAcrossFleet} منتجاً · {fleetMetrics.totalOrdersAcrossFleet} طلباً
            </div>
            <span className="text-xs text-sky-400 font-bold">عبر كافة المتاجر النشطة</span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* QUOTE & TARGET MODE SELECTOR CARD                                    */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-gold/40 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  شريط تحديد الهدف وبيانات العرض (Quote / Target Mode)
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                حددي ما إذا كنت تصدرين عرض سعر لمشروع جديد/مخصص أو تطبقين الإعدادات على متجر مسجل بالأسطول
              </p>
            </div>

            {/* Target Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0d0c11] border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setTargetMode('custom_quote')}
                className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition ${
                  targetMode === 'custom_quote'
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                    : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                عرض سعر / مشروع جديد أو عام (Custom Quote)
              </button>
              <button
                type="button"
                onClick={() => setTargetMode('fleet_project')}
                className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition ${
                  targetMode === 'fleet_project'
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                    : 'text-ivory/70 hover:text-ivory'
                }`}
              >
                ربط وتطبيق على مشروع بالأسطول
              </button>
            </div>
          </div>

          {/* Target Mode Details & Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            {targetMode === 'custom_quote' ? (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-ivory/80 font-semibold block">
                  اسم المشروع أو المتجر المقترح (Project Title):
                </label>
                <input
                  type="text"
                  value={quoteProjectTitle}
                  onChange={(e) => setQuoteProjectTitle(e.target.value)}
                  placeholder="مثال: مجوهرات الملكة، عطور الأصالة، عيادة النخبة..."
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-sm font-semibold"
                />
              </div>
            ) : (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-ivory/80 font-semibold block">
                  اختر المشروع المستهدف من الأسطول:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    const proj = projects.find((p) => p.id === e.target.value);
                    if (proj) handleSelectFleetProject(proj);
                  }}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-sm font-semibold"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id} className="bg-obsidian text-ivory">
                      {proj.name} ({proj.industryAr}) — {proj.domain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">
                اسم العميل أو الجهة المستلمة (اختياري):
              </label>
              <input
                type="text"
                value={quoteClientName}
                onChange={(e) => setQuoteClientName(e.target.value)}
                placeholder="مثال: الأستاذ محمد"
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">
                خصم خاص من منصة سَامِق ($):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={customDiscountUsd}
                  onChange={(e) => setCustomDiscountUsd(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="0"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold focus:border-gold outline-hidden text-sm"
                />
                <span className="absolute end-3 top-3 text-muted-dim text-xs">$ خصم</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MULTI-PROJECT FLEET CARDS (When Fleet Mode or Overview)              */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-champagne" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  أسطول مشاريع وعملاء منصة سَامِق (SAMIQ Fleet Manager)
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                إدارة مركزية لكافة مشاريع العملاء المستضافة في قاعدة البيانات، مع إمكانية التحديد والتبديل المباشر
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-obsidian-dark font-sans font-bold text-xs transition shadow-lg inline-flex items-center gap-2 shrink-0"
            >
              <span>+ تدشين مشروع لعميل جديد</span>
            </button>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const isSelected = targetMode === 'fleet_project' && selectedProjectId === proj.id;
              const annualSum = (proj.annualDomainUsd || 0) + (proj.annualHostingMaintenanceUsd || 0) + (proj.aiPlanType === 'managed_annual' ? 90 : 0);

              const statusBadge =
                proj.status === 'active' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-semibold">
                    متجر نشط
                  </span>
                ) : proj.status === 'demo' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 font-semibold">
                    نموذج قطاع
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-950/70 border border-sky-500/30 text-sky-300 font-semibold">
                    قيد التجهيز
                  </span>
                );

              return (
                <div
                  key={proj.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-elevated border-gold shadow-[0_0_25px_rgba(201,168,76,0.22)] ring-1 ring-gold/50'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-gold block">{proj.industryAr}</span>
                        <h3 className="text-base font-serif font-bold text-ivory mt-0.5">{proj.name}</h3>
                      </div>
                      {statusBadge}
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-lux font-sans pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span>النطاق (Domain):</span>
                        <span className="font-mono text-ivory dir-ltr font-semibold">{proj.domain}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>عقد التأسيس (Setup):</span>
                        <span className="font-bold text-gold">${proj.setupPriceUsd}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>التجديد السنوي (Renewal):</span>
                        <span className="font-bold text-emerald-400">${annualSum} / سنوياً</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>القالب المعتمد:</span>
                        <span className="text-champagne font-semibold">{SAMIQ_THEMES[proj.themeId]?.nameAr || proj.themeId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetMode('fleet_project');
                        handleSelectFleetProject(proj);
                      }}
                      className={`w-full min-h-[42px] px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-gold text-obsidian-dark shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-ivory border border-white/10'
                      }`}
                    >
                      <span>{isSelected ? 'المشروع المحدد للتخصيص حالياً' : 'تحديد وتخصيص هذا المشروع'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={proj.previewUrl}
                        target="_blank"
                        className="flex-1 min-h-[40px] px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-champagne border border-white/10 text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        <span>فتح المتجر</span>
                        <span>↗</span>
                      </Link>
                      <Link
                        href={proj.adminUrl}
                        target="_blank"
                        className="flex-1 min-h-[40px] px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        <span>لوحة التاجر</span>
                        <span>↗</span>
                      </Link>
                      {proj.id !== 'proj-miftah' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.name)}
                          className="min-h-[40px] px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs transition flex items-center justify-center"
                          title="حذف المشروع"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Create New Project */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-xl bg-surface border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-ivory">تدشين مشروع جديد لعميل سَامِق</h3>
                  <p className="text-xs text-muted-lux mt-0.5">أدخل بيانات المتجر والقطاع والنطاق لإنشاء المتجر وحفظه بالأسطول فورياً</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-ivory flex items-center justify-center"
                  aria-label="إغلاق النافذة"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {createProjectError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold">
                  {createProjectError}
                </div>
              )}

              <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">اسم المتجر / العلامة:</label>
                    <input
                      type="text"
                      required
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                      placeholder="مثال: مخبز روز الحرفي"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">المعرف التقني (Slug بالإنجليزية):</label>
                    <input
                      type="text"
                      required
                      value={newProjectForm.slug}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, slug: e.target.value })}
                      placeholder="rose-bakery"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden dir-ltr text-end"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">القطاع التجاري:</label>
                    <select
                      value={newProjectForm.industryAr}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, industryAr: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                    >
                      <option value="العناية بالبشرة والمكياج" className="bg-obsidian text-ivory">العناية بالبشرة والمكياج</option>
                      <option value="المطاعم والمقاهي المختصة" className="bg-obsidian text-ivory">المطاعم والمقاهي المختصة</option>
                      <option value="العيادات والصيدليات التخصصية" className="bg-obsidian text-ivory">العيادات والصيدليات التخصصية</option>
                      <option value="الأزياء والعطور الحصرية" className="bg-obsidian text-ivory">الأزياء والعطور الحصرية</option>
                      <option value="المجوهرات والساعات الثمينة" className="bg-obsidian text-ivory">المجوهرات والساعات الثمينة</option>
                      <option value="الإلكترونيات والتقنية" className="bg-obsidian text-ivory">الإلكترونيات والتقنية</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">نوع النطاق السنوي:</label>
                    <select
                      value={newProjectForm.domainType}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, domainType: e.target.value as any })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                    >
                      <option value="custom_com" className="bg-obsidian text-ivory">دومين عالمي رسمي .com ($20 / سنوياً)</option>
                      <option value="subdomain_free" className="bg-obsidian text-ivory">نطاق فرعي مجاني samiq.shop ($0 / سنوياً)</option>
                      <option value="custom_ye" className="bg-obsidian text-ivory">دومين يمني .ye ($35 / سنوياً)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">القالب المعماري المبدئي:</label>
                    <select
                      value={newProjectForm.themeId}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, themeId: e.target.value as ThemeId })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                    >
                      <option value="luxury-noir" className="bg-obsidian text-ivory">أسود رخامي فاخر (Luxury Noir)</option>
                      <option value="ivory-journal" className="bg-obsidian text-ivory">حرير عاجي تحريري (Ivory Journal)</option>
                      <option value="clinic-lab" className="bg-obsidian text-ivory">مختبر سريري نقي (Clinic Lab)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">سعر عقد التأسيس ($):</label>
                    <input
                      type="number"
                      value={newProjectForm.setupPriceUsd}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, setupPriceUsd: Number(e.target.value) })}
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">رقم واتساب المتجر:</label>
                    <input
                      type="text"
                      value={newProjectForm.whatsapp}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, whatsapp: e.target.value })}
                      placeholder="967770000000"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden dir-ltr text-end"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-ivory/80 font-semibold block">المدينة / المقر:</label>
                    <input
                      type="text"
                      value={newProjectForm.city}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, city: e.target.value })}
                      placeholder="صنعاء"
                      className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="min-h-[44px] px-5 rounded-xl bg-white/5 hover:bg-white/10 text-ivory text-xs font-semibold transition"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingProject}
                    className="min-h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#AA771C] hover:from-[#C9A84C] hover:to-[#B38728] text-obsidian-dark font-sans font-bold text-xs transition shadow-lg disabled:opacity-50"
                  >
                    {isCreatingProject ? 'جارٍ التدشين...' : 'تأكيد تدشين المشروع في الأسطول'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* OPERATIONAL & ANNUAL COSTS CONFIGURATOR                              */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  التكاليف السنوية والتشغيلية — الدومين، الاستضافة، والذكاء الاصطناعي
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                تخصيص رسوم التجديد السنوية لـ: <span className="text-champagne font-bold">{effectiveProjectTitle}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold font-mono">
                الإجمالي السنوي: ${selectedProjectAnnualTotal} / سنوياً
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Domain Tier Selector */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-champagne block">نوع النطاق (Domain Tier):</span>
                <span className="text-xs font-mono font-bold text-gold">${projectAnnualDomainUsd} / سنوياً</span>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleDomainTierChange('subdomain_free')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectDomainType === 'subdomain_free'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>نطاق فرعي مجاني (*.samiq.shop)</span>
                  <span className="font-mono text-emerald-400">$0 / سنوياً</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDomainTierChange('custom_com')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectDomainType === 'custom_com'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>نطاق عالمي رسمي (.com / .net)</span>
                  <span className="font-mono text-gold">$20 / سنوياً</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDomainTierChange('custom_ye')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectDomainType === 'custom_ye'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>نطاق محلي رسمي (.ye / .com.ye)</span>
                  <span className="font-mono text-gold">$35 / سنوياً</span>
                </button>
              </div>
              <p className="text-xs text-muted-dim leading-snug">
                يشمل الدومين حجز الاسم السنوي الرسمي، شهادة الأمان SSL وحماية سحابية عالمية.
              </p>
            </div>

            {/* 2. Cloud Hosting & Maintenance */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-champagne block">الاستضافة والصيانة السحابية:</span>
                <span className="text-xs font-mono font-bold text-gold">${projectAnnualHostingUsd} / سنوياً</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-bold block">السنة الأولى مشمولة مجاناً ($0)</span>
                  <span className="text-muted-lux block mt-0.5">مع عقد التأسيس للباقة المختارة.</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-lux block">رسم التجديد السنوي ابتداءً من السنة الثانية ($):</label>
                  <input
                    type="number"
                    value={projectAnnualHostingUsd}
                    onChange={(e) => setProjectAnnualHostingUsd(Number(e.target.value) || 0)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-dim leading-snug">
                تغطي السيرفرات السحابية العالمية فائقة السرعة، النسخ الاحتياطي اليومي والتحديثات الأمنية.
              </p>
            </div>

            {/* 3. AI API Operational Plan */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-champagne block">خطة تشغيل الذكاء الاصطناعي (AI Plan):</span>
                <span className="text-xs font-mono font-bold text-gold">
                  {projectAiPlan === 'managed_annual' ? '$90 / سنوياً' : '$0'}
                </span>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setProjectAiPlan('none')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectAiPlan === 'none'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>بدون ذكاء اصطناعي</span>
                  <span className="font-mono text-muted-lux">$0</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProjectAiPlan('byok')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectAiPlan === 'byok'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>مفتاح العميل الخاص (BYOK)</span>
                  <span className="font-mono text-emerald-400">$0 للمنصة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProjectAiPlan('managed_annual')}
                  className={`w-full p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                    projectAiPlan === 'managed_annual'
                      ? 'bg-gold/15 border-gold text-ivory font-bold'
                      : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                  }`}
                >
                  <span>استهلاك سحابي شامل ومدار</span>
                  <span className="font-mono text-gold">$90 / سنوياً</span>
                </button>
              </div>
              <p className="text-xs text-muted-dim leading-snug">
                تغطي تكاليف استهلاك نماذج Gemini API للوسوم الذكية والشات بوت التفاعلي.
              </p>
            </div>
          </div>
        </div>

        {/* Live Architecture Template Switcher */}
        <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                القالب المعماري المقترح لـ ({effectiveProjectTitle})
              </h2>
              <p className="text-xs text-muted-lux">
                اختاري القالب المعتمد ليتم تطبيقه فورياً وإدراجه في وثيقة الفاتورة الرسمية
              </p>
            </div>
            <span className="text-xs font-bold text-gold px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
              القالب المعتمد: {SAMIQ_THEMES[activeTheme]?.nameAr}
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
                          المحدد حالياً
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

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition inline-flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>تصدير الفاتورة الرسمية (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleSavePlatformConfig}
              disabled={isSaving}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-ivory border border-white/15 font-sans font-bold text-xs transition inline-flex items-center justify-center gap-2"
            >
              {isSaving
                ? 'جارٍ الحفظ...'
                : targetMode === 'custom_quote'
                ? `تدشين مشروع جديد بالأسطول (${effectiveProjectTitle})`
                : `حفظ وتطبيق الإعدادات على «${effectiveProjectTitle}»`}
            </button>
          </div>
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
                    المخطط الشجري للترابطات الهندسية — {effectiveProjectTitle}
                  </h3>
                  <p className="text-xs text-muted-lux mt-1">
                    انقري على أي عقدة شجرية لتفعيلها تلقائياً مع كافة متطلباتها، أو انقري على السعر لتعديله يدوياً.
                  </p>
                </div>
                <span className="text-xs text-gold font-bold">
                  {selectedFeatures.length} ميزة نشطة
                </span>
              </div>

              {/* TREE STRUCTURE */}
              <div className="space-y-6">
                {/* Level 1: Root - Tier 1 Static Landing Page */}
                <div className="space-y-3">
                  <span className="text-xs font-sans font-bold text-gold block">
                    المستوى 1 (الجذر الأساسي — موقع تعريفي فخم بدون منتجات وبدون لوحة تحكم):
                  </span>
                  <TreeNode
                    id="tier_1_static"
                    label={FEATURES_REGISTRY.tier_1_static.nameAr}
                    price={FEATURES_REGISTRY.tier_1_static.basePriceUsd}
                  />

                  {/* Branches directly from Tier 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 ps-3 sm:ps-6 border-s-2 border-gold/30">
                    <TreeNode
                      id="custom_domain"
                      label={FEATURES_REGISTRY.custom_domain.nameAr}
                      price={FEATURES_REGISTRY.custom_domain.basePriceUsd}
                      requires={['tier_1_static']}
                    />
                    <TreeNode
                      id="second_language"
                      label={FEATURES_REGISTRY.second_language.nameAr}
                      price={FEATURES_REGISTRY.second_language.basePriceUsd}
                      requires={['tier_1_static']}
                    />
                    <TreeNode
                      id="pwa_app"
                      label={FEATURES_REGISTRY.pwa_app.nameAr}
                      price={FEATURES_REGISTRY.pwa_app.basePriceUsd}
                      requires={['tier_1_static']}
                    />
                    <TreeNode
                      id="analytics_stats"
                      label={FEATURES_REGISTRY.analytics_stats.nameAr}
                      price={FEATURES_REGISTRY.analytics_stats.basePriceUsd}
                      requires={['tier_1_static']}
                    />
                  </div>
                </div>

                {/* Level 2: Editable Site + Admin */}
                <div className="ps-4 sm:ps-8 border-s-2 border-gold/40 space-y-3">
                  <span className="text-xs font-sans font-bold text-champagne block">
                    ──► المستوى 2 (موقع تعريفي قابل للتعديل + مدخل سري للوحة تحكم المدير):
                  </span>
                  <TreeNode
                    id="tier_2_editable"
                    label={FEATURES_REGISTRY.tier_2_editable.nameAr}
                    price={FEATURES_REGISTRY.tier_2_editable.basePriceUsd}
                    requires={['tier_1_static']}
                    incrementalDiff="+$50 فوق الدرجة 1"
                  />

                  {/* Branches directly from Tier 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ps-3 sm:ps-6 border-s-2 border-gold/30">
                    <TreeNode
                      id="bookings"
                      label={FEATURES_REGISTRY.bookings.nameAr}
                      price={FEATURES_REGISTRY.bookings.basePriceUsd}
                      requires={['tier_2_editable']}
                    />
                    <TreeNode
                      id="blog"
                      label={FEATURES_REGISTRY.blog.nameAr}
                      price={FEATURES_REGISTRY.blog.basePriceUsd}
                      requires={['tier_2_editable']}
                    />
                    <div className="space-y-2">
                      <TreeNode
                        id="ai_chatbot"
                        label={FEATURES_REGISTRY.ai_chatbot.nameAr}
                        price={FEATURES_REGISTRY.ai_chatbot.basePriceUsd}
                        requires={['tier_2_editable']}
                      />
                      {/* Sub-branches from AI Chatbot (Degree 7) */}
                      <div className="ps-3 border-s-2 border-sky-400/40 space-y-2 pt-1">
                        <span className="text-xs text-sky-400 font-bold block">
                          قنوات التواصل الاجتماعي المربوطة بالشات بوت:
                        </span>
                        <TreeNode
                          id="telegram_channel"
                          label={FEATURES_REGISTRY.telegram_channel.nameAr}
                          price={FEATURES_REGISTRY.telegram_channel.basePriceUsd}
                          requires={['ai_chatbot']}
                        />
                        <TreeNode
                          id="whatsapp_channel"
                          label={FEATURES_REGISTRY.whatsapp_channel.nameAr}
                          price={FEATURES_REGISTRY.whatsapp_channel.basePriceUsd}
                          requires={['ai_chatbot']}
                        />
                        <TreeNode
                          id="instagram_channel"
                          label={FEATURES_REGISTRY.instagram_channel.nameAr}
                          price={FEATURES_REGISTRY.instagram_channel.basePriceUsd}
                          requires={['ai_chatbot']}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level 3: Full Interactive Product Catalog */}
                <div className="ps-8 sm:ps-16 border-s-2 border-gold/60 space-y-4">
                  <span className="text-xs font-sans font-bold text-gold block">
                    ──► المستوى 3 (كتالوج المنتجات والأقسام والوسوم + 3 أنماط عملات والبحث):
                  </span>
                  <TreeNode
                    id="tier_3_catalog"
                    label={FEATURES_REGISTRY.tier_3_catalog.nameAr}
                    price={FEATURES_REGISTRY.tier_3_catalog.basePriceUsd}
                    requires={['tier_2_editable']}
                    incrementalDiff="+$70 فوق الدرجة 2"
                  />

                  {/* BRANCHES FROM TIER 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Branch A: Commerce & Orders */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-xs font-sans font-bold text-emerald-400 block border-b border-white/5 pb-1.5">
                        فرع التجارة وسلة واتساب (Commerce & Checkout Branch)
                      </span>
                      <div className="space-y-2">
                        <TreeNode
                          id="cart_whatsapp"
                          label={FEATURES_REGISTRY.cart_whatsapp.nameAr}
                          price={FEATURES_REGISTRY.cart_whatsapp.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        {/* Sub-branches from Cart */}
                        <div className="ps-3 border-s-2 border-emerald-500/40 space-y-2 pt-1">
                          <span className="text-xs text-emerald-400/90 font-bold block">
                            تفريعات سلة المشتريات:
                          </span>
                          <TreeNode
                            id="delivery_zones"
                            label={FEATURES_REGISTRY.delivery_zones.nameAr}
                            price={FEATURES_REGISTRY.delivery_zones.basePriceUsd}
                            requires={['cart_whatsapp']}
                          />
                          <TreeNode
                            id="coupons"
                            label={FEATURES_REGISTRY.coupons.nameAr}
                            price={FEATURES_REGISTRY.coupons.basePriceUsd}
                            requires={['cart_whatsapp']}
                          />
                          <TreeNode
                            id="owner_notifications"
                            label={FEATURES_REGISTRY.owner_notifications.nameAr}
                            price={FEATURES_REGISTRY.owner_notifications.basePriceUsd}
                            requires={['cart_whatsapp']}
                          />
                          <TreeNode
                            id="payment_gateways"
                            label={FEATURES_REGISTRY.payment_gateways.nameAr}
                            price={FEATURES_REGISTRY.payment_gateways.basePriceUsd}
                            requires={['cart_whatsapp']}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Branch B: Catalog Intelligence & Customer Auth */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <span className="text-xs font-sans font-bold text-gold block border-b border-white/5 pb-1.5">
                        فرع الذكاء، المخزون، وحسابات الزبائن (Intelligence & Accounts)
                      </span>
                      <div className="space-y-2">
                        <TreeNode
                          id="inventory_variants"
                          label={FEATURES_REGISTRY.inventory_variants.nameAr}
                          price={FEATURES_REGISTRY.inventory_variants.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        <TreeNode
                          id="smart_tags_ai"
                          label={FEATURES_REGISTRY.smart_tags_ai.nameAr}
                          price={FEATURES_REGISTRY.smart_tags_ai.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        <TreeNode
                          id="customer_accounts"
                          label={FEATURES_REGISTRY.customer_accounts.nameAr}
                          price={FEATURES_REGISTRY.customer_accounts.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        {/* Sub-branch from Customer Accounts */}
                        <div className="ps-3 border-s-2 border-gold/40 space-y-2 pt-1">
                          <TreeNode
                            id="reviews_ratings"
                            label={FEATURES_REGISTRY.reviews_ratings.nameAr}
                            price={FEATURES_REGISTRY.reviews_ratings.basePriceUsd}
                            requires={['customer_accounts']}
                          />
                        </div>
                        <TreeNode
                          id="authenticity_guide"
                          label={FEATURES_REGISTRY.authenticity_guide.nameAr}
                          price={FEATURES_REGISTRY.authenticity_guide.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        <TreeNode
                          id="skin_routine_advisor"
                          label={FEATURES_REGISTRY.skin_routine_advisor.nameAr}
                          price={FEATURES_REGISTRY.skin_routine_advisor.basePriceUsd}
                          requires={['tier_3_catalog']}
                        />
                        <TreeNode
                          id="multi_branch"
                          label={FEATURES_REGISTRY.multi_branch.nameAr}
                          price={FEATURES_REGISTRY.multi_branch.basePriceUsd}
                          requires={['tier_3_catalog']}
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
                ملخص التسعير والاستثمار — {effectiveProjectTitle}
              </span>
              <h3 className="text-base font-serif font-bold text-ivory mt-0.5">
                حاسبة الباقة والتكاليف المتكررة
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex items-baseline justify-between text-muted-lux">
                <span>سعر الباقة الأساسية ({pricing.selectedTier}):</span>
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
              <div className="flex items-baseline justify-between text-muted-lux">
                <span>المجموع الإفرادي (Subtotal):</span>
                <span className="font-mono text-sm font-semibold text-ivory">
                  ${pricing.subtotalUsd}
                </span>
              </div>
              {pricing.discountUsd > 0 && (
                <div className="flex items-baseline justify-between text-emerald-400 font-semibold">
                  <span>خصم خاص معتمد:</span>
                  <span className="font-mono text-sm font-bold">
                    -${pricing.discountUsd}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-ivory block">عقد التأسيس الصافي:</span>
                  <span className="text-xs text-muted-dim">يشمل استضافة السنة الأولى مجاناً ($0)</span>
                </div>
                <span className="text-3xl font-serif font-bold text-champagne drop-shadow-[0_2px_15px_rgba(201,168,76,0.3)]">
                  ${pricing.totalUsd}
                </span>
              </div>
            </div>

            {/* Recurring Annual Renewal Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-gold/20 space-y-2.5 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-bold text-champagne">التجديد السنوي (ابتداءً من السنة 2):</span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  ${selectedProjectAnnualTotal} / سنوياً
                </span>
              </div>
              <div className="space-y-1.5 text-muted-lux">
                <div className="flex items-center justify-between">
                  <span>- النطاق الرسمي ({projectDomainType}):</span>
                  <span className="font-mono text-ivory">${projectAnnualDomainUsd} / سنوياً</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>- الاستضافة والصيانة السحابية:</span>
                  <span className="font-mono text-ivory">${projectAnnualHostingUsd} / سنوياً</span>
                </div>
                {projectAiPlan === 'managed_annual' && (
                  <div className="flex items-center justify-between">
                    <span>- استهلاك ذكاء اصطناعي شامل:</span>
                    <span className="font-mono text-gold">$90 / سنوياً</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-muted-lux">اسم المتجر / المشروع:</span>
                <span className="text-gold font-bold">{effectiveProjectTitle}</span>
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

            {/* Prominent Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="w-full min-h-[46px] py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>تصدير عرض السعر / الفاتورة كملف PDF</span>
              </button>

              <button
                type="button"
                onClick={handleSavePlatformConfig}
                disabled={isSaving}
                className="w-full min-h-[44px] py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-ivory border border-white/15 font-sans font-bold text-xs transition inline-flex items-center justify-center"
              >
                {isSaving
                  ? 'جارٍ الحفظ...'
                  : targetMode === 'custom_quote'
                  ? `إنشاء وتدشين مشروع جديد بالأسطول بهذه الإعدادات`
                  : `حفظ وتطبيق الإعدادات على مشروع «${effectiveProjectTitle}»`}
              </button>
            </div>
          </div>
        </div>

        {/* MATRIX GRID (Rendered in 'sync' or 'matrix' modes) */}
        {(viewMode === 'sync' || viewMode === 'matrix') && (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                مصفوفة الميزات التفصيلية (Features Matrix Grid) — {effectiveProjectTitle}
              </h3>
              <p className="text-xs text-muted-lux">
                قائمة كافة الإضافات الموديلية التابعة لمنصة سامق مع إمكانية التفعيل والتعطيل بنقرة واحدة
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(FEATURES_REGISTRY).map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                const overridePrice = priceOverrides[feat.id];
                const displayPrice = overridePrice !== undefined ? overridePrice : feat.basePriceUsd;

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
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPriceOverride(feat.id);
                        }}
                        title="تعديل السعر يدوياً"
                        className="px-2 py-0.5 rounded text-xs font-sans font-bold bg-gold/15 text-gold border border-gold/30 hover:bg-gold/30 transition cursor-pointer"
                      >
                        {overridePrice !== undefined ? `$${displayPrice}*` : `+$${displayPrice}`}
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
          </div>

          {metaSaveMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn">
              {metaSaveMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="space-y-1.5">
              <label className="text-ivory/80 font-semibold block">معرف تيليجرام للمطور (Telegram Handle):</label>
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
      </main>
    </div>
  );
}

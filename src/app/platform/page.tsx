'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  validateFeatureDependencies,
  resolveEffectiveFeatures,
  PlatformPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from '@/core/features/registry';
import { ThemeId, SAMIQ_THEMES, isValidThemeId } from '@/themes/contract';
import type { SamiqProjectRecord } from '@/core/db/store';
import { PdfInvoiceModal } from '@/core/features/PdfInvoiceModal';

function PencilIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CloseIcon({ className = 'w-2.5 h-2.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

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

  // Anchoring & Multiplier Pricing Engine State
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1.5);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState<boolean>(true);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [isMatchOriginal, setIsMatchOriginal] = useState<boolean>(false);

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
  const [domainTierPrices, setDomainTierPrices] = useState({
    subdomain_free: 0,
    custom_com: 20,
    custom_ye: 35,
  });
  const [projectAnnualDomainUsd, setProjectAnnualDomainUsd] = useState<number>(20);
  const [projectFirstYearHostingUsd, setProjectFirstYearHostingUsd] = useState<number>(0);
  const [projectAnnualHostingUsd, setProjectAnnualHostingUsd] = useState<number>(45);
  const [projectAiPlan, setProjectAiPlan] = useState<'none' | 'byok' | 'managed_annual'>('byok');
  const [projectAnnualAiUsd, setProjectAnnualAiUsd] = useState<number>(90);

  // Chameleon Rebranding & Color Studio State
  const [activeClientPreset, setActiveClientPreset] = useState<string>('cosmetics_miftah');
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('#C9A84C');
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>('#070709');
  const [customSurfaceColor, setCustomSurfaceColor] = useState<string>('#0E0E12');
  const [customTextColor, setCustomTextColor] = useState<string>('#FAF7F2');
  const [isCustomColorPalette, setIsCustomColorPalette] = useState<boolean>(false);
  const [isRebrandingLoading, setIsRebrandingLoading] = useState<boolean>(false);

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
  const [isPricingLoaded, setIsPricingLoaded] = useState(false);

  // Fetch initial config from real database and localStorage
  useEffect(() => {
    async function loadPlatformConfig() {
      // 1. Initial hydration from localStorage if available
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('samiq_live_pricing_config');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (typeof parsed.priceMultiplier === 'number') setPriceMultiplier(parsed.priceMultiplier);
            if (typeof parsed.isDiscountEnabled === 'boolean') setIsDiscountEnabled(parsed.isDiscountEnabled);
            if (typeof parsed.discountPercent === 'number') setDiscountPercent(parsed.discountPercent);
            if (typeof parsed.customDiscountUsd === 'number') setCustomDiscountUsd(parsed.customDiscountUsd);
            if (typeof parsed.matchOriginalPrice === 'boolean') setIsMatchOriginal(parsed.matchOriginalPrice);
            if (parsed.priceOverrides && typeof parsed.priceOverrides === 'object') setPriceOverrides(parsed.priceOverrides);
            if (parsed.domainTierPrices && typeof parsed.domainTierPrices === 'object') {
              setDomainTierPrices({
                subdomain_free: parsed.domainTierPrices.subdomain_free ?? 0,
                custom_com: parsed.domainTierPrices.custom_com ?? 20,
                custom_ye: parsed.domainTierPrices.custom_ye ?? 35,
              });
            }
            if (typeof parsed.firstYearHostingUsd === 'number') setProjectFirstYearHostingUsd(parsed.firstYearHostingUsd);
            if (typeof parsed.annualHostingUsd === 'number') setProjectAnnualHostingUsd(parsed.annualHostingUsd);
            if (typeof parsed.annualAiUsd === 'number') setProjectAnnualAiUsd(parsed.annualAiUsd);
          }
        } catch (e) {
          console.warn('Could not read cached pricing config:', e);
        }
      }

      try {
        const res = await fetch('/api/platform/config');
        const data = await res.json();
        if (data.success) {
          if (data.pricingConfig) {
            const cfg = data.pricingConfig;
            if (typeof cfg.priceMultiplier === 'number') setPriceMultiplier(cfg.priceMultiplier);
            if (typeof cfg.isDiscountEnabled === 'boolean') setIsDiscountEnabled(cfg.isDiscountEnabled);
            if (typeof cfg.discountPercent === 'number') setDiscountPercent(cfg.discountPercent);
            if (typeof cfg.customDiscountUsd === 'number') setCustomDiscountUsd(cfg.customDiscountUsd);
            if (typeof cfg.matchOriginalPrice === 'boolean') setIsMatchOriginal(cfg.matchOriginalPrice);
            if (cfg.priceOverrides && typeof cfg.priceOverrides === 'object') setPriceOverrides(cfg.priceOverrides);
            if (cfg.domainTierPrices && typeof cfg.domainTierPrices === 'object') {
              setDomainTierPrices({
                subdomain_free: cfg.domainTierPrices.subdomain_free ?? 0,
                custom_com: cfg.domainTierPrices.custom_com ?? 20,
                custom_ye: cfg.domainTierPrices.custom_ye ?? 35,
              });
            }
            if (typeof cfg.firstYearHostingUsd === 'number') setProjectFirstYearHostingUsd(cfg.firstYearHostingUsd);
            if (typeof cfg.annualHostingUsd === 'number') setProjectAnnualHostingUsd(cfg.annualHostingUsd);
            if (typeof cfg.annualAiUsd === 'number') setProjectAnnualAiUsd(cfg.annualAiUsd);
          }
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
      } finally {
        setIsPricingLoaded(true);
      }
    }
    loadPlatformConfig();
  }, [targetMode]);

  // Auto-sync pricing config across tabs, localStorage and server database
  useEffect(() => {
    if (!isPricingLoaded) return;

    const currentConfig: PlatformPricingConfig = {
      priceMultiplier,
      isDiscountEnabled,
      discountPercent,
      customDiscountUsd,
      matchOriginalPrice: isMatchOriginal,
      priceOverrides,
      domainTierPrices,
      firstYearHostingUsd: projectFirstYearHostingUsd,
      annualHostingUsd: projectAnnualHostingUsd,
      annualAiUsd: projectAnnualAiUsd,
    };

    // 1. Instant local persistence & same-window/cross-tab broadcast
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('samiq_live_pricing_config', JSON.stringify(currentConfig));
        window.dispatchEvent(new Event('samiq_pricing_updated'));
      } catch (e) {}
    }

    // 2. Debounced persistence to database
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/platform/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pricingConfig: currentConfig }),
        });
      } catch (err) {
        console.warn('Auto-sync pricing to db failed:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    isPricingLoaded,
    priceMultiplier,
    isDiscountEnabled,
    discountPercent,
    customDiscountUsd,
    isMatchOriginal,
    priceOverrides,
    domainTierPrices,
    projectFirstYearHostingUsd,
    projectAnnualHostingUsd,
    projectAnnualAiUsd,
  ]);

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

  const handleApplyClientPreset = async (presetKey: string) => {
    setIsRebrandingLoading(true);
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_client_preset', presetKey }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setActiveClientPreset(presetKey);
        if (data.tenant.brandPalette) {
          setCustomPrimaryColor(data.tenant.brandPalette.primaryColor || '#C9A84C');
          setCustomBackgroundColor(data.tenant.brandPalette.backgroundColor || '#070709');
          setCustomSurfaceColor(data.tenant.brandPalette.surfaceColor || '#0E0E12');
          setCustomTextColor(data.tenant.brandPalette.textColor || '#FAF7F2');
          setIsCustomColorPalette(!!data.tenant.brandPalette.isCustomPalette);
        }
        if (data.tenant.themeId) {
          setActiveTheme(data.tenant.themeId);
        }
        setSaveSuccessMsg(`تم تطبيق نمط «${data.tenant.name}» وتحديث المتجر المباشر.`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        window.dispatchEvent(new Event('samiq_pricing_updated'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebrandingLoading(false);
    }
  };

  const handleSaveLiveColorPalette = async () => {
    setIsRebrandingLoading(true);
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_tenant',
          tenant: {
            brandPalette: {
              primaryColor: customPrimaryColor,
              backgroundColor: customBackgroundColor,
              surfaceColor: customSurfaceColor,
              textColor: customTextColor,
              isCustomPalette: isCustomColorPalette,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('تم حفظ وتطبيق لوحة الألوان المخصصة على المتجر المباشر.');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        window.dispatchEvent(new Event('samiq_pricing_updated'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRebrandingLoading(false);
    }
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
    () =>
      calculateTierPrice(selectedFeatures, priceOverrides, {
        priceMultiplier,
        isDiscountEnabled,
        discountPercent,
        customDiscountUsd,
        matchOriginalPrice: isMatchOriginal,
      }),
    [selectedFeatures, priceOverrides, priceMultiplier, isDiscountEnabled, discountPercent, customDiscountUsd, isMatchOriginal]
  );
  const validation = useMemo(() => validateFeatureDependencies(selectedFeatures), [selectedFeatures]);

  // Selected project annual recurring total
  const selectedProjectAnnualTotal = useMemo(() => {
    const domain = projectAnnualDomainUsd;
    const hosting = projectAnnualHostingUsd;
    const ai = projectAiPlan === 'managed_annual' ? projectAnnualAiUsd : 0;
    return domain + hosting + ai;
  }, [projectAnnualDomainUsd, projectAnnualHostingUsd, projectAiPlan, projectAnnualAiUsd]);

  // Handle Domain Tier Change
  const handleDomainTierChange = (type: 'subdomain_free' | 'custom_com' | 'custom_ye') => {
    setProjectDomainType(type);
    setProjectAnnualDomainUsd(domainTierPrices[type]);
  };

  // Handle Domain Tier Price Override
  const handleSetDomainTierPrice = (type: 'subdomain_free' | 'custom_com' | 'custom_ye') => {
    const current = domainTierPrices[type];
    const typeNames = {
      subdomain_free: 'النطاق الفرعي المجاني (*.samiq.shop)',
      custom_com: 'النطاق العالمي الرسمي (.com / .net)',
      custom_ye: 'النطاق المحلي الرسمي (.ye / .com.ye)',
    };
    const input = prompt(`أدخل سعر حجز وتجديد «${typeNames[type]}» بالدولار ($/سنوياً):`, String(current));
    if (input !== null) {
      const num = Math.max(0, Number(input) || 0);
      setDomainTierPrices((prev) => ({ ...prev, [type]: num }));
      if (projectDomainType === type) {
        setProjectAnnualDomainUsd(num);
      }
    }
  };

  // Reset single price override
  const handleResetSinglePrice = (featId: string) => {
    setPriceOverrides((prev) => {
      const next = { ...prev };
      delete next[featId];
      return next;
    });
  };

  // Reset all price overrides & discounts to default
  const handleResetAllPrices = () => {
    setPriceOverrides({});
    setPriceMultiplier(1.5);
    setIsDiscountEnabled(true);
    setDiscountPercent(25);
    setIsMatchOriginal(false);
    setCustomDiscountUsd(0);
    setProjectFirstYearHostingUsd(0);
    setProjectAnnualHostingUsd(45);
    setProjectAnnualDomainUsd(20);
    setProjectAnnualAiUsd(90);
    setDomainTierPrices({ subdomain_free: 0, custom_com: 20, custom_ye: 35 });
    setSaveSuccessMsg('تمت إعادة ضبط جميع الأسعار والمعاملات والخصومات إلى القيم القياسية الافتراضية.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Handle setting target net total directly
  const handleSetTargetNetTotal = () => {
    const val = prompt('أدخل السعر الصافي المقطوع المطلوب لعقد التأسيس بالدولار ($):', String(pricing.totalUsd));
    if (val !== null) {
      const target = Math.max(0, Number(val) || 0);
      setIsMatchOriginal(false);
      if (target <= pricing.subtotalUsd) {
        setIsDiscountEnabled(true);
        setCustomDiscountUsd(pricing.subtotalUsd - target);
        setDiscountPercent(0);
      } else {
        setIsDiscountEnabled(false);
        setCustomDiscountUsd(0);
        const extra = target - pricing.subtotalUsd;
        const currentTierPrice = priceOverrides[pricing.selectedTier] ?? Math.round((FEATURES_REGISTRY[pricing.selectedTier]?.basePriceUsd ?? 80) * priceMultiplier);
        setPriceOverrides((prev) => ({
          ...prev,
          [pricing.selectedTier]: currentTierPrice + extra,
        }));
      }
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
    const feat = FEATURES_REGISTRY[featId];
    const currentPrice = priceOverrides[featId] ?? feat?.basePriceUsd ?? 0;
    const label = feat ? feat.nameAr : featId;
    const input = prompt(`أدخل السعر المخصص لميزة «${label}» بالدولار ($):`, String(currentPrice));
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

  // Quick edit for fleet card setup price
  const handleEditFleetSetupPrice = async (proj: SamiqProjectRecord) => {
    const val = prompt(`أدخل سعر عقد التأسيس لمشروع «${proj.name}» بالدولار ($):`, String(proj.setupPriceUsd));
    if (val !== null) {
      const num = Math.max(0, Number(val) || 0);
      setProjects((prev) => prev.map((p) => p.id === proj.id ? { ...p, setupPriceUsd: num } : p));
      try {
        await fetch('/api/platform/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: proj.id, setupPriceUsd: num }),
        });
        setSaveSuccessMsg(`تم تحديث عقد التأسيس لمشروع «${proj.name}» إلى $${num}`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      } catch {
        // local state already updated
      }
    }
  };

  // Quick edit for fleet card renewal price
  const handleEditFleetRenewalPrice = async (proj: SamiqProjectRecord) => {
    const currentTotal = (proj.annualDomainUsd || 0) + (proj.annualHostingMaintenanceUsd || 0) + (proj.aiPlanType === 'managed_annual' ? 90 : 0);
    const val = prompt(`أدخل إجمالي التجديد السنوي لمشروع «${proj.name}» بالدولار ($):`, String(currentTotal));
    if (val !== null) {
      const num = Math.max(0, Number(val) || 0);
      const domain = proj.annualDomainUsd || 0;
      const newHosting = Math.max(0, num - domain);
      setProjects((prev) => prev.map((p) => p.id === proj.id ? { ...p, annualHostingMaintenanceUsd: newHosting } : p));
      try {
        await fetch('/api/platform/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: proj.id, annualHostingMaintenanceUsd: newHosting }),
        });
        setSaveSuccessMsg(`تم تحديث التجديد السنوي لمشروع «${proj.name}» إلى $${num}/سنوياً`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      } catch {
        // local state already updated
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
          pricingConfig: {
            priceMultiplier,
            isDiscountEnabled,
            discountPercent,
            customDiscountUsd,
            matchOriginalPrice: isMatchOriginal,
            priceOverrides,
            domainTierPrices,
            firstYearHostingUsd: projectFirstYearHostingUsd,
            annualHostingUsd: projectAnnualHostingUsd,
            annualAiUsd: projectAnnualAiUsd,
          },
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
    const defaultMultipliedPrice = Math.round(price * priceMultiplier);
    const displayPrice = overridePrice !== undefined ? overridePrice : defaultMultipliedPrice;

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

        <div className="flex items-center justify-between w-full pt-2 border-t border-white/5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleSetPriceOverride(id)}
              title="انقر لتعديل السعر لهذا العرض يدوياً"
              className="text-xs font-sans font-bold px-2.5 py-1 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold/30 hover:border-gold transition cursor-pointer inline-flex items-center gap-1"
            >
              {overridePrice !== undefined ? (
                <span>${displayPrice} (معدل)</span>
              ) : priceMultiplier !== 1.0 ? (
                <span className="inline-flex items-center gap-1">
                  <span className="line-through text-muted-dim text-[11px]">${price}</span>
                  <span>+${displayPrice}</span>
                </span>
              ) : (
                <span>+${displayPrice}</span>
              )}
              <PencilIcon className="w-2.5 h-2.5" />
            </button>
            {overridePrice !== undefined && (
              <button
                type="button"
                onClick={() => handleResetSinglePrice(id)}
                title="إعادة السعر للافتراضي"
                className="text-muted-dim hover:text-rose-400 p-1 rounded transition flex items-center justify-center"
              >
                <CloseIcon />
              </button>
            )}
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
        annualAiUsd={projectAiPlan === 'managed_annual' ? projectAnnualAiUsd : 0}
        firstYearHostingUsd={projectFirstYearHostingUsd}
        priceMultiplier={priceMultiplier}
        isDiscountEnabled={isDiscountEnabled}
        discountPercent={discountPercent}
        matchOriginalPrice={isMatchOriginal}
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
                  onChange={(e) => {
                    setIsMatchOriginal(false);
                    setCustomDiscountUsd(Math.max(0, Number(e.target.value) || 0));
                  }}
                  placeholder="0"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold focus:border-gold outline-hidden text-sm"
                />
                <span className="absolute end-3 top-3 text-muted-dim text-xs">$ خصم</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* ANCHORING & MULTIPLIER PRICING ENGINE CARD                           */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-gold/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  محرك مضاعف الأسعار والعروض الترويجية (Anchoring & Multiplier Pricing Engine)
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                التحكم الذكي بمضاعف التسعير لإبراز القيمة النفسية العالية (Anchoring) وتطبيق التخفيضات الترويجية مع موازنة السعر بنقرة واحدة
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>متزامن تلقائياً مع صفحة العرض العام (/samiq)</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-gold/15 text-gold font-mono font-bold border border-gold/30">
                المعامل النشط: ×{priceMultiplier}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPriceMultiplier(1.5);
                  setIsDiscountEnabled(true);
                  setDiscountPercent(25);
                  setIsMatchOriginal(false);
                  setCustomDiscountUsd(0);
                }}
                className="text-xs text-muted-lux hover:text-ivory px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition"
              >
                الافتراضي (×1.5 + خصم 25%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Control 1: Price Multiplier */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-champagne block">
                  معامل ضرب الأسعار (Multiplier ×):
                </label>
                <span className="text-xs font-mono font-bold text-gold">×{priceMultiplier}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="10"
                  value={priceMultiplier}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0.1) {
                      setPriceMultiplier(Number(val.toFixed(2)));
                    }
                  }}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory font-mono font-bold focus:border-gold outline-hidden text-sm"
                />
                <span className="absolute end-3 top-3 text-muted-dim text-xs">معامل ×</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-dim">أزرار سريعة:</span>
                {[
                  { label: '×0.5', val: 0.5 },
                  { label: '×1.0', val: 1.0 },
                  { label: '×1.33', val: 1.33 },
                  { label: '×1.5', val: 1.5 },
                  { label: '×2.0', val: 2.0 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setPriceMultiplier(item.val);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                      priceMultiplier === item.val
                        ? 'bg-gold text-obsidian-dark border-gold shadow-xs'
                        : 'bg-white/5 text-muted-lux hover:text-ivory border-white/10 hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-dim leading-snug">
                يضاعف أسعار الباقة والميزات غير المعدلة يدوياً بنسبة {Math.round((priceMultiplier - 1) * 100)}% لرفع القيمة المدركة.
              </p>
            </div>

            {/* Control 2: Discount Offer Settings */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-champagne block">
                  عرض التخفيض المعتمد (Discount Offer):
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsDiscountEnabled(!isDiscountEnabled);
                    setIsMatchOriginal(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                    isDiscountEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-muted-dim border-white/10'
                  }`}
                >
                  {isDiscountEnabled ? 'مفعّل (ON)' : 'معطّل (OFF)'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">نسبة التخفيض (%):</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      disabled={!isDiscountEnabled}
                      value={discountPercent}
                      onChange={(e) => {
                        setIsMatchOriginal(false);
                        setDiscountPercent(Math.max(0, Math.min(90, Number(e.target.value) || 0)));
                      }}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold focus:border-gold outline-hidden text-sm disabled:opacity-40"
                    />
                    <span className="absolute end-3 top-3 text-muted-dim text-xs">%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">خصم إضافي ($):</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={customDiscountUsd}
                      onChange={(e) => {
                        setIsMatchOriginal(false);
                        setCustomDiscountUsd(Math.max(0, Number(e.target.value) || 0));
                      }}
                      placeholder="0"
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold focus:border-gold outline-hidden text-sm"
                    />
                    <span className="absolute end-3 top-3 text-muted-dim text-xs">$</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-dim">نسب سريعة:</span>
                {[10, 15, 20, 25, 33, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={!isDiscountEnabled}
                    onClick={() => {
                      setIsMatchOriginal(false);
                      setDiscountPercent(pct);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition border disabled:opacity-40 ${
                      discountPercent === pct && !isMatchOriginal
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-white/5 text-muted-lux hover:text-ivory border-white/10 hover:border-white/20'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-muted-dim leading-snug">
                يظهر للعميل السعر المرتكز مشطوباً مع شارة الخصم لإبراز الصفقة الاستثنائية.
              </p>
            </div>

            {/* Control 3: Smart 1-Click Match Original & Summary */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-gold/20 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-champagne block">
                    الموازنة الذكية (Smart Match):
                  </span>
                  {isMatchOriginal && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold">
                      نشطة
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMatchOriginal(!isMatchOriginal);
                    if (!isMatchOriginal) {
                      setIsDiscountEnabled(true);
                    }
                  }}
                  className={`w-full p-3 rounded-xl border text-start transition flex flex-col gap-1 ${
                    isMatchOriginal
                      ? 'bg-gold/20 border-gold text-ivory shadow-[0_0_15px_rgba(201,168,76,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-gold/40 text-muted-lux hover:text-ivory'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ivory">
                      موازنة التخفيض ليعود للسعر الأصلي (100% Match)
                    </span>
                    <span className="text-xs font-mono font-bold text-gold">
                      {isMatchOriginal ? 'مفعّل' : 'تفعيل بنقرة'}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-dim leading-snug">
                    يضبط الخصم تلقائياً ليكون الصافي مساوياً تماماً للسعر الأصلي قبل المضاعفة (${pricing.originalSubtotalUsd})، مع إظهار السعر المضروب (${pricing.subtotalUsd}) مشطوباً!
                  </span>
                </button>
              </div>

              {/* Live Metric Bar */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs font-sans">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-muted-dim block">المعروض للعميل:</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {pricing.discountUsd > 0 && (
                      <span className="line-through text-muted-dim font-mono text-xs">${pricing.subtotalUsd}</span>
                    )}
                    <span className="font-mono font-bold text-emerald-400 text-sm">${pricing.totalUsd}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-muted-dim block">قيمة التوفير المعلنة:</span>
                  <span className="font-mono font-bold text-gold text-sm mt-0.5 block">
                    ${pricing.discountUsd} ({pricing.discountPercent}%)
                  </span>
                </div>
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
                        <button
                          type="button"
                          onClick={() => handleEditFleetSetupPrice(proj)}
                          title="انقر لتعديل عقد التأسيس لهذا المشروع"
                          className="font-bold text-gold hover:text-champagne transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>${proj.setupPriceUsd}</span>
                          <PencilIcon className="w-2.5 h-2.5 text-gold/70" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>التجديد السنوي (Renewal):</span>
                        <button
                          type="button"
                          onClick={() => handleEditFleetRenewalPrice(proj)}
                          title="انقر لتعديل التجديد السنوي لهذا المشروع"
                          className="font-bold text-emerald-400 hover:text-emerald-300 transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>${annualSum} / سنوياً</span>
                          <PencilIcon className="w-2.5 h-2.5 text-emerald-400/70" />
                        </button>
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
        {/* QUICK CLIENT REBRAND & LIVE COLOR STUDIO                             */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-gold/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-champagne">
                  تجهيز سريع لعميل جديد (Quick Client Rebrand & Color Studio)
                </h2>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                تبديل هوية المتجر وألوان الواجهة فورياً بنقرة واحدة لتقديم عروض تفاعلية حية أمام العملاء الجدد
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/?demo=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3.5 py-1.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/30 text-champagne font-bold transition inline-flex items-center gap-1.5"
              >
                <span>معاينة المتجر المباشر</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* 5 Industry Presets */}
          <div className="space-y-2">
            <span className="text-xs text-gold font-bold block">أنماط العلامات الجاهزة بنقرة واحدة:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { id: 'cosmetics_miftah', name: 'مفتاح الجمال', tag: 'مستحضرات وعناية', theme: 'luxury-noir', color: '#C9A84C' },
                { id: 'royal_oud', name: 'دار السمو', tag: 'عود وعطور ملكية', theme: 'luxury-noir', color: '#D4AF37' },
                { id: 'derma_clinic', name: 'عيادة ديرما كير', tag: 'جلدية وسريرية', theme: 'clinic-lab', color: '#0F4C4A' },
                { id: 'luxury_jewelry', name: 'قصر العقيق', tag: 'مجوهرات وأزياء', theme: 'ivory-journal', color: '#8C5E3C' },
                { id: 'specialty_coffee', name: 'سُقيا للقهوة', tag: 'محمصة وبن مختص', theme: 'luxury-noir', color: '#C87D4B' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={isRebrandingLoading}
                  onClick={() => handleApplyClientPreset(p.id)}
                  className={`p-3.5 rounded-2xl border text-start transition flex flex-col justify-between space-y-2 ${
                    activeClientPreset === p.id
                      ? 'border-gold bg-gold/15 shadow-md ring-1 ring-gold'
                      : 'border-white/10 bg-white/5 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ivory block">{p.name}</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: p.color }} />
                  </div>
                  <span className="text-[11px] text-muted-dim block">{p.tag}</span>
                  <span className="text-[10px] text-champagne font-mono block">
                    {activeClientPreset === p.id ? 'النمط المطبق' : 'تطبيق النمط'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Palette */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-gold font-bold block">تخصيص ألوان الواجهة الحية (Live Color Palette):</span>
                <p className="text-[11px] text-muted-lux mt-0.5">تغيير الألوان الرئيسية فورياً لعرض الموقع بألوان هوية العميل أمام عينيه</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomColorPalette}
                  onChange={(e) => setIsCustomColorPalette(e.target.checked)}
                  className="w-4 h-4 rounded text-gold bg-white/5 border-white/20"
                />
                <span className="text-xs text-ivory font-bold">تفعيل الألوان المخصصة</span>
              </label>
            </div>

            {isCustomColorPalette && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">اللون الأساسي (Primary):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">خلفية الموقع (Background):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBackgroundColor}
                      onChange={(e) => setCustomBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={customBackgroundColor}
                      onChange={(e) => setCustomBackgroundColor(e.target.value)}
                      className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">لون البطاقات (Surface):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customSurfaceColor}
                      onChange={(e) => setCustomSurfaceColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={customSurfaceColor}
                      onChange={(e) => setCustomSurfaceColor(e.target.value)}
                      className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-lux block">لون النصوص (Text):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={customTextColor}
                      onChange={(e) => setCustomTextColor(e.target.value)}
                      className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={isRebrandingLoading}
                onClick={handleSaveLiveColorPalette}
                className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs shadow-md hover:brightness-110 transition"
              >
                {isRebrandingLoading ? 'جاري التطبيق...' : 'حفظ وتطبيق الألوان على المتجر المباشر'}
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* OPERATIONAL & ANNUAL COSTS CONFIGURATOR                              */}
        {/* ==================================================================== */}
        <div className="p-6 rounded-3xl bg-surface border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h2 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  التكاليف السنوية وخدمات السيرفرات — الدومين، الاستضافة، والذكاء الاصطناعي
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
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDomainTierChange('subdomain_free')}
                    className={`flex-1 p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                      projectDomainType === 'subdomain_free'
                        ? 'bg-gold/15 border-gold text-ivory font-bold'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <span>نطاق فرعي مجاني (*.samiq.shop)</span>
                    <span className="font-mono text-emerald-400">${domainTierPrices.subdomain_free} / سنوياً</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDomainTierPrice('subdomain_free')}
                    title="تعديل سعر هذا النطاق"
                    className="min-h-[44px] px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gold/80 hover:text-gold border border-white/10 transition flex items-center justify-center shrink-0"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDomainTierChange('custom_com')}
                    className={`flex-1 p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                      projectDomainType === 'custom_com'
                        ? 'bg-gold/15 border-gold text-ivory font-bold'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <span>نطاق عالمي رسمي (.com / .net)</span>
                    <span className="font-mono text-gold">${domainTierPrices.custom_com} / سنوياً</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDomainTierPrice('custom_com')}
                    title="تعديل سعر هذا النطاق"
                    className="min-h-[44px] px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gold/80 hover:text-gold border border-white/10 transition flex items-center justify-center shrink-0"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDomainTierChange('custom_ye')}
                    className={`flex-1 p-2.5 rounded-xl border text-start text-xs transition flex items-center justify-between min-h-[44px] ${
                      projectDomainType === 'custom_ye'
                        ? 'bg-gold/15 border-gold text-ivory font-bold'
                        : 'bg-white/5 border-white/5 text-muted-lux hover:border-white/20'
                    }`}
                  >
                    <span>نطاق محلي رسمي (.ye / .com.ye)</span>
                    <span className="font-mono text-gold">${domainTierPrices.custom_ye} / سنوياً</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetDomainTierPrice('custom_ye')}
                    title="تعديل سعر هذا النطاق"
                    className="min-h-[44px] px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gold/80 hover:text-gold border border-white/10 transition flex items-center justify-center shrink-0"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Direct number input for adopted annual domain fee */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-lux font-semibold">رسم النطاق السنوي المعتمد ($/سنوياً):</label>
                  <span className="text-xs text-gold font-mono font-bold">${projectAnnualDomainUsd} / سنوياً</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={projectAnnualDomainUsd}
                  onChange={(e) => setProjectAnnualDomainUsd(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                />
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
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                  <span className="font-bold block">
                    {projectFirstYearHostingUsd === 0
                      ? 'السنة الأولى مشمولة مجاناً ($0)'
                      : `رسوم استضافة السنة الأولى: $${projectFirstYearHostingUsd}`}
                  </span>
                  <span className="text-muted-lux block mt-0.5">مع عقد التأسيس للباقة المختارة.</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-lux block">تكلفة استضافة السنة الأولى ($):</label>
                    <span className="text-xs font-mono text-champagne font-bold">
                      {projectFirstYearHostingUsd === 0 ? '$0 (مجاناً)' : `$${projectFirstYearHostingUsd}`}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={projectFirstYearHostingUsd}
                    onChange={(e) => setProjectFirstYearHostingUsd(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="0 (مجاناً)"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-lux block">رسم التجديد السنوي ابتداءً من السنة الثانية ($):</label>
                    <span className="text-xs font-mono text-gold font-bold">${projectAnnualHostingUsd} / سنوياً</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={projectAnnualHostingUsd}
                    onChange={(e) => setProjectAnnualHostingUsd(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
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
                <span className="text-xs font-bold text-champagne block">خطة استهلاك الذكاء الاصطناعي (AI Plan):</span>
                <span className="text-xs font-mono font-bold text-gold">
                  {projectAiPlan === 'managed_annual' ? `$${projectAnnualAiUsd} / سنوياً` : '$0'}
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
                  <span className="font-mono text-gold">${projectAnnualAiUsd} / سنوياً</span>
                </button>
              </div>

              {/* Direct number input for AI plan annual cost */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-lux font-semibold">تكلفة اشتراك الذكاء الاصطناعي السنوي ($/سنوياً):</label>
                  <span className="text-xs text-gold font-mono font-bold">${projectAnnualAiUsd} / سنوياً</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={projectAnnualAiUsd}
                  onChange={(e) => setProjectAnnualAiUsd(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                />
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
            <button
              type="button"
              onClick={handleResetAllPrices}
              className="min-h-[40px] px-3.5 rounded-xl text-xs font-sans font-bold text-muted-lux hover:text-ivory bg-white/5 hover:bg-white/10 border border-white/10 transition inline-flex items-center gap-1.5"
              title="إعادة جميع الأسعار والخصومات للافتراضي"
            >
              <span>إعادة ضبط الأسعار للافتراضي</span>
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
        {/* INTERACTIVE DEPENDENCY TREE VIEW (Rendered in sync or tree mode)    */}
        {/* ==================================================================== */}
        {(viewMode === 'sync' || viewMode === 'tree') && (
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-xl font-serif font-bold text-ivory">
                  المخطط الشجري للترابطات الهندسية — {effectiveProjectTitle}
                </h3>
                <p className="text-xs text-muted-lux mt-1">
                  انقري على أي عقدة شجرية لتفعيلها تلقائياً مع كافة متطلباتها، أو انقري على السعر لتعديله يدوياً.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold font-bold">
                  {selectedFeatures.length} ميزة نشطة
                </span>
                <button
                  type="button"
                  onClick={handleResetAllPrices}
                  className="text-xs text-muted-lux hover:text-ivory px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition"
                  title="إعادة تعيين كافة الأسعار للافتراضي"
                >
                  إعادة ضبط الأسعار للافتراضي
                </button>
              </div>
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

        {/* ==================================================================== */}
        {/* MATRIX GRID (Rendered in sync or matrix mode)                       */}
        {/* ==================================================================== */}
        {(viewMode === 'sync' || viewMode === 'matrix') && (
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                  مصفوفة الميزات التفصيلية (Features Matrix Grid) — {effectiveProjectTitle}
                </h3>
                <p className="text-xs text-muted-lux">
                  قائمة كافة الإضافات الموديلية التابعة لمنصة سامق مع إمكانية التفعيل والتعطيل وتعديل السعر بنقرة واحدة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold font-bold">
                  {selectedFeatures.length} ميزة نشطة
                </span>
                <button
                  type="button"
                  onClick={handleResetAllPrices}
                  className="text-xs text-muted-lux hover:text-ivory px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 transition"
                  title="إعادة تعيين كافة الأسعار للافتراضي"
                >
                  إعادة ضبط الأسعار للافتراضي
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(FEATURES_REGISTRY).map((feat) => {
                const isSelected = selectedFeatures.includes(feat.id);
                const overridePrice = priceOverrides[feat.id];
                const defaultMultipliedPrice = Math.round(feat.basePriceUsd * priceMultiplier);
                const displayPrice = overridePrice !== undefined ? overridePrice : defaultMultipliedPrice;

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
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPriceOverride(feat.id);
                          }}
                          title="تعديل السعر يدوياً"
                          className="px-2.5 py-1 rounded-lg text-xs font-sans font-bold bg-gold/15 text-gold border border-gold/30 hover:bg-gold/30 hover:border-gold transition cursor-pointer inline-flex items-center gap-1"
                        >
                          {overridePrice !== undefined ? (
                            <span>${displayPrice} (معدل)</span>
                          ) : priceMultiplier !== 1.0 ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="line-through text-muted-dim text-[11px]">${feat.basePriceUsd}</span>
                              <span>+${displayPrice}</span>
                            </span>
                          ) : (
                            <span>+${displayPrice}</span>
                          )}
                          <PencilIcon className="w-2.5 h-2.5" />
                        </button>
                        {overridePrice !== undefined && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResetSinglePrice(feat.id);
                            }}
                            title="إعادة السعر للافتراضي"
                            className="text-muted-dim hover:text-rose-400 p-1 rounded transition flex items-center justify-center"
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>
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

        {/* ==================================================================== */}
        {/* PRICING & INVESTMENT SUMMARY CARD (Positioned at bottom in all modes) */}
        {/* ==================================================================== */}
        <div
          id="pricing-summary-card"
          className="w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-elevated via-surface to-elevated border border-gold/40 shadow-2xl space-y-6 scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h3 className="text-base sm:text-xl font-serif font-bold text-ivory">
                  ملخص التسعير والاستثمار — {effectiveProjectTitle}
                </h3>
              </div>
              <p className="text-xs text-muted-lux mt-1">
                حاسبة الباقة والتكاليف المتكررة مع إمكانية تعديل كافة بنود التأسيس والرسوم السنوية مباشرة
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleResetAllPrices}
                className="min-h-[40px] px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-lux hover:text-ivory border border-white/10 text-xs font-semibold transition"
              >
                إعادة ضبط الأسعار للافتراضي
              </button>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="min-h-[40px] px-4 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>تصدير فاتورة PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1: One-Time Setup Costs */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-champagne block">
                  1. عقد التأسيس لمرة واحدة (Setup Investment):
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gold/15 text-gold border border-gold/30">
                  معامل الضرب: ×{priceMultiplier}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                {/* Base Tier with Edit Button */}
                <div className="flex items-center justify-between text-muted-lux">
                  <div className="flex items-center gap-1.5">
                    <span>سعر الباقة الأساسية ({pricing.selectedTier}):</span>
                    <button
                      type="button"
                      onClick={() => handleSetPriceOverride(pricing.selectedTier)}
                      title="تعديل سعر الباقة الأساسية"
                      className="text-gold/70 hover:text-gold p-0.5 transition cursor-pointer"
                    >
                      <PencilIcon className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {priceOverrides[pricing.selectedTier] === undefined && priceMultiplier !== 1.0 && (
                      <span className="text-xs line-through text-muted-dim">
                        ${FEATURES_REGISTRY[pricing.selectedTier]?.basePriceUsd}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSetPriceOverride(pricing.selectedTier)}
                      className="text-base font-serif font-bold text-ivory hover:text-gold transition cursor-pointer"
                    >
                      ${pricing.baseTierPriceUsd}
                    </button>
                  </div>
                </div>

                {/* Addons sum */}
                <div className="flex items-center justify-between text-muted-lux">
                  <span>مجموع الإضافات والقنوات:</span>
                  <span className="text-base font-serif font-bold text-gold">
                    +${pricing.addonsPriceUsd}
                  </span>
                </div>

                {/* Subtotal (Anchored before discount) */}
                <div className="flex items-center justify-between text-muted-lux">
                  <span>المجموع الإفرادي (قبل الخصم):</span>
                  <div className="flex items-center gap-1.5">
                    {pricing.discountUsd > 0 && (
                      <span className="line-through text-muted-dim font-mono text-xs">
                        ${pricing.subtotalUsd}
                      </span>
                    )}
                    <span className="font-mono text-sm font-semibold text-ivory">
                      ${pricing.subtotalUsd}
                    </span>
                  </div>
                </div>

                {/* Multiplier & Discount Controls inline in summary */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-lux font-semibold">عرض التخفيض المعتمد:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDiscountEnabled(!isDiscountEnabled);
                        setIsMatchOriginal(false);
                      }}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition border ${
                        isDiscountEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 text-muted-dim border-white/10'
                      }`}
                    >
                      {isDiscountEnabled ? 'مفعّل (ON)' : 'معطّل (OFF)'}
                    </button>
                  </div>

                  {isDiscountEnabled && (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-muted-lux">نسبة الخصم (%):</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="90"
                            value={discountPercent}
                            onChange={(e) => {
                              setIsMatchOriginal(false);
                              setDiscountPercent(Math.max(0, Math.min(90, Number(e.target.value) || 0)));
                            }}
                            className="w-16 min-h-[32px] px-2 rounded-lg bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold text-center text-xs"
                          />
                          <span className="text-muted-dim text-xs">%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-emerald-400 font-mono">
                        <span>قيمة الخصم المحسوبة:</span>
                        <span className="font-bold">-${pricing.discountUsd} ({pricing.discountPercent}%)</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMatchOriginal(!isMatchOriginal)}
                        className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold transition border ${
                          isMatchOriginal
                            ? 'bg-gold/20 text-gold border-gold'
                            : 'bg-white/5 text-muted-lux hover:text-ivory border-white/10'
                        }`}
                      >
                        {isMatchOriginal
                          ? 'تم تفعيل موازنة السعر للأصلي (100% Match)'
                          : 'موازنة التخفيض ليعود للسعر الأصلي تماماً (×1.0)'}
                      </button>
                    </>
                  )}
                </div>

                {/* Additional custom dollar discount */}
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-muted-lux font-semibold">خصم إضافي مقطوع بالدولار ($):</label>
                    <span className="font-mono text-xs font-bold text-emerald-400">-${customDiscountUsd}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={customDiscountUsd}
                      onChange={(e) => {
                        setIsMatchOriginal(false);
                        setCustomDiscountUsd(Math.max(0, Number(e.target.value) || 0));
                      }}
                      placeholder="0"
                      className="w-full min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-mono font-bold focus:border-gold outline-hidden text-xs"
                    />
                    <span className="absolute end-3 top-2.5 text-muted-dim text-xs">$ خصم</span>
                  </div>
                </div>

                {/* Net Setup Total with direct prompt/target edit */}
                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-ivory block">عقد التأسيس الصافي:</span>
                      <button
                        type="button"
                        onClick={handleSetTargetNetTotal}
                        title="تعديل السعر النهائي المقطوع"
                        className="text-gold/70 hover:text-gold p-0.5 transition cursor-pointer"
                      >
                        <PencilIcon className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-dim">
                      {projectFirstYearHostingUsd > 0
                        ? `استضافة السنة الأولى: $${projectFirstYearHostingUsd}`
                        : 'شامل استضافة السنة الأولى مجاناً ($0)'}
                    </span>
                    {pricing.discountUsd > 0 && (
                      <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                        وفر العميل: ${pricing.discountUsd} ({pricing.discountPercent}%)
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSetTargetNetTotal}
                    title="انقر لتعديل الصافي مقطوعاً"
                    className="text-3xl font-serif font-bold text-champagne hover:text-gold transition drop-shadow-[0_2px_15px_rgba(201,168,76,0.3)] cursor-pointer"
                  >
                    ${pricing.totalUsd}
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Transparent Recurring Annual Costs */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-gold/20 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-champagne">
                  2. التجديد السنوي (ابتداءً من السنة 2):
                </span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  ${selectedProjectAnnualTotal} / سنوياً
                </span>
              </div>

              <div className="space-y-3 text-xs font-sans">
                {/* Domain Annual Fee */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-lux font-medium">النطاق الرسمي ({projectDomainType}):</span>
                    <span className="font-mono text-gold font-bold">${projectAnnualDomainUsd} / سنوياً</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={projectAnnualDomainUsd}
                    onChange={(e) => setProjectAnnualDomainUsd(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full min-h-[38px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                  />
                </div>

                {/* Hosting & Maintenance Annual Fee */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-lux font-medium">الاستضافة والصيانة السحابية:</span>
                    <span className="font-mono text-gold font-bold">${projectAnnualHostingUsd} / سنوياً</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={projectAnnualHostingUsd}
                    onChange={(e) => setProjectAnnualHostingUsd(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full min-h-[38px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                  />
                </div>

                {/* AI Operational Plan Annual Fee */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-lux font-medium">استهلاك الذكاء الاصطناعي ({projectAiPlan}):</span>
                    <span className="font-mono text-gold font-bold">
                      {projectAiPlan === 'managed_annual' ? `$${projectAnnualAiUsd} / سنوياً` : '$0'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={projectAnnualAiUsd}
                    onChange={(e) => setProjectAnnualAiUsd(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full min-h-[38px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-hidden text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Meta & Actions */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5 text-xs font-sans">
                <span className="text-xs font-bold text-champagne block border-b border-white/5 pb-2">
                  3. مواصفات العرض والترابط:
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">المشروع المستهدف:</span>
                  <span className="text-gold font-bold">{effectiveProjectTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">عدد المزايا المفعلة:</span>
                  <span className="text-ivory font-bold">{selectedFeatures.length} ميزة</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">القالب المعماري:</span>
                  <span className="text-champagne font-semibold">{SAMIQ_THEMES[activeTheme]?.nameAr}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-lux">صلاحية الترابط (requires):</span>
                  <span
                    className={
                      validation.isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                    }
                  >
                    {validation.isValid ? 'سليمة 100%' : 'توجد نواقص'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-ivory border border-white/15 font-sans font-bold text-xs transition inline-flex items-center justify-center"
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
        </div>

        {/* Floating Live Total Badge on Left */}
        <aside
          aria-label="الشارة الطافية الذكية للتسعير الحي"
          className="fixed bottom-6 left-6 z-40 max-w-[340px] w-[calc(100vw-3rem)] sm:w-80 bg-[#0e0d13]/95 backdrop-blur-xl border border-gold/50 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(201,168,76,0.25)] rounded-3xl p-4 space-y-3 transition-all duration-300 animate-fadeIn"
          dir="rtl"
        >
          {/* Badge Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-serif font-bold text-ivory">سَامِق · التسعير الحي</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-gold/20 text-champagne border border-gold/30">
                ×{priceMultiplier}
              </span>
              <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                {selectedFeatures.length} ميزة نشطة
              </span>
            </div>
          </div>

          {/* Live Figures */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            {/* Setup Price */}
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-gold/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-lux font-medium">إجمالي التأسيس:</span>
                <button
                  type="button"
                  onClick={handleSetTargetNetTotal}
                  title="تعديل صافي التأسيس مباشرة"
                  className="text-gold/70 hover:text-gold p-0.5 transition cursor-pointer"
                >
                  <PencilIcon className="w-2.5 h-2.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSetTargetNetTotal}
                title="انقر لتعديل الصافي مقطوعاً"
                className="text-start mt-1 group cursor-pointer"
              >
                {pricing.discountUsd > 0 && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="line-through text-muted-dim font-mono">${pricing.subtotalUsd}</span>
                    <span className="text-emerald-400 font-bold text-[10px]">خصم {pricing.discountPercent}%</span>
                  </div>
                )}
                <span className="text-lg sm:text-xl font-serif font-bold text-champagne block group-hover:text-gold transition">
                  ${pricing.totalUsd}
                </span>
                <span className="text-[10px] text-muted-dim block">انقر للتعديل المباشر</span>
              </button>
            </div>

            {/* Annual Renewal */}
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <span className="text-[11px] text-muted-lux font-medium">التجديد السنوي:</span>
              <div className="mt-1">
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-400 block">
                  ${selectedProjectAnnualTotal}
                </span>
                <span className="text-[10px] text-muted-dim block">ابتداءً من السنة 2</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex-1 min-h-[38px] px-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-md transition flex items-center justify-center gap-1.5"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>فاتورة PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                document.getElementById('pricing-summary-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 min-h-[38px] px-3 rounded-xl bg-white/10 hover:bg-white/20 text-ivory border border-white/15 font-sans font-bold text-xs transition flex items-center justify-center gap-1"
            >
              <span>الملخص</span>
              <span className="text-gold font-bold">↓</span>
            </button>
          </div>
        </aside>

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

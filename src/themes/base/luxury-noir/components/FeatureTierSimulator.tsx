'use client';

import React, { useState, useEffect } from 'react';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  resolveEffectiveFeatures,
  PlatformPricingConfig,
  DEFAULT_PRICING_CONFIG,
} from '@/core/features/registry';
import { FeatureFlags, ThemeId } from '../../../contract';
import { TuningSliderIcon } from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { BrandPalette } from '@/core/storefront/themePalette';

interface FeatureTierSimulatorProps {
  currentFeatures?: FeatureFlags;
  onFeaturesUpdate?: (features: FeatureFlags) => void;
}

export function FeatureTierSimulator(props: FeatureTierSimulatorProps) {
  const sf = useStorefront();
  const currentFeatures = props.currentFeatures || sf.features;
  const onFeaturesUpdate = (newFlags: FeatureFlags) => {
    if (sf.setFeatures) {
      sf.setFeatures(newFlags);
    }
    if (props.onFeaturesUpdate) {
      props.onFeaturesUpdate(newFlags);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaletteCustomizerOpen, setIsPaletteCustomizerOpen] = useState(false);
  const [pricingConfig, setPricingConfig] = useState<PlatformPricingConfig>(DEFAULT_PRICING_CONFIG);

  // Palette draft state
  const activeTheme = sf.activeTheme || 'luxury-noir';
  const currentPalette = sf.palette || {
    accent: '#D4AF37',
    background: '#0B0B0C',
    surface: '#121214',
    text: '#F4EFE6',
  };

  const [draftPrimary, setDraftPrimary] = useState(currentPalette.accent || '#D4AF37');
  const [draftBg, setDraftBg] = useState(currentPalette.background || '#0B0B0C');
  const [draftSurface, setDraftSurface] = useState(currentPalette.surface || '#121214');
  const [draftText, setDraftText] = useState(currentPalette.text || '#F4EFE6');
  const [isCustomEnabled, setIsCustomEnabled] = useState(!!sf.customPalette?.isCustomPalette);

  useEffect(() => {
    if (sf.palette) {
      setDraftPrimary(sf.palette.accent);
      setDraftBg(sf.palette.background);
      setDraftSurface(sf.palette.surface);
      setDraftText(sf.palette.text);
    }
    setIsCustomEnabled(!!sf.customPalette?.isCustomPalette);
  }, [sf.palette, sf.customPalette]);

  const handleApplyPalette = () => {
    if (sf.setCustomPalette) {
      sf.setCustomPalette({
        isCustomPalette: isCustomEnabled,
        primaryColor: draftPrimary,
        backgroundColor: draftBg,
        surfaceColor: draftSurface,
        textColor: draftText,
      });
    }
  };

  const handleResetPalette = () => {
    setIsCustomEnabled(false);
    if (sf.setCustomPalette) {
      sf.setCustomPalette(null);
    }
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    if (sf.setActiveTheme) {
      sf.setActiveTheme(newTheme);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loadConfig = () => {
      try {
        const saved = localStorage.getItem('samiq_live_pricing_config');
        if (saved) {
          setPricingConfig(JSON.parse(saved));
        }
      } catch {
        // Fallback to default
      }
    };
    loadConfig();
    window.addEventListener('storage', loadConfig);
    window.addEventListener('samiq_pricing_updated', loadConfig);
    return () => {
      window.removeEventListener('storage', loadConfig);
      window.removeEventListener('samiq_pricing_updated', loadConfig);
    };
  }, []);

  // Active feature list as array of keys
  const activeKeys = Object.keys(currentFeatures).filter((k) => currentFeatures[k]);
  const pricing = calculateTierPrice(
    activeKeys,
    pricingConfig.priceOverrides,
    pricingConfig
  );

  const t1Pricing = calculateTierPrice(
    ['tier_1_static'],
    pricingConfig.priceOverrides,
    pricingConfig
  );
  const t2Pricing = calculateTierPrice(
    ['tier_1_static', 'tier_2_editable'],
    pricingConfig.priceOverrides,
    pricingConfig
  );
  const t3Pricing = calculateTierPrice(
    ['tier_1_static', 'tier_2_editable', 'tier_3_catalog', 'cart_whatsapp'],
    pricingConfig.priceOverrides,
    pricingConfig
  );

  const toggleFeature = (featureId: string) => {
    const isCurrentlyOn = !!currentFeatures[featureId];
    let newKeys: string[];

    if (isCurrentlyOn) {
      const toRemove = new Set<string>([featureId]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const [fId, def] of Object.entries(FEATURES_REGISTRY)) {
          if (!toRemove.has(fId) && activeKeys.includes(fId)) {
            if (def.requires.some((r) => toRemove.has(r))) {
              toRemove.add(fId);
              changed = true;
            }
          }
        }
      }
      newKeys = activeKeys.filter((k) => !toRemove.has(k));
      if (
        !newKeys.includes('tier_1_static') &&
        !newKeys.includes('tier_2_editable') &&
        !newKeys.includes('tier_3_catalog')
      ) {
        newKeys.push('tier_1_static');
      }
    } else {
      newKeys = resolveEffectiveFeatures([...activeKeys, featureId]);
    }

    const updatedFlags: FeatureFlags = {
      tier_1_static: newKeys.includes('tier_1_static'),
      tier_2_editable: newKeys.includes('tier_2_editable'),
      tier_3_catalog: newKeys.includes('tier_3_catalog'),
      cart_whatsapp: newKeys.includes('cart_whatsapp'),
      customer_accounts: newKeys.includes('customer_accounts'),
      payment_gateways: newKeys.includes('payment_gateways'),
      ai_chatbot: newKeys.includes('ai_chatbot'),
      whatsapp_channel: newKeys.includes('whatsapp_channel'),
      telegram_channel: newKeys.includes('telegram_channel'),
    };

    for (const key of Object.keys(FEATURES_REGISTRY)) {
      updatedFlags[key] = newKeys.includes(key);
    }

    onFeaturesUpdate(updatedFlags);
  };

  const applyPreset = (preset: 'tier1' | 'tier2' | 'tier3' | 'royal') => {
    let presetKeys: string[];
    if (preset === 'tier1') {
      presetKeys = ['tier_1_static'];
    } else if (preset === 'tier2') {
      presetKeys = ['tier_1_static', 'tier_2_editable'];
    } else if (preset === 'tier3') {
      presetKeys = [
        'tier_1_static',
        'tier_2_editable',
        'tier_3_catalog',
        'cart_whatsapp',
      ];
    } else {
      presetKeys = [
        'tier_1_static',
        'tier_2_editable',
        'tier_3_catalog',
        'cart_whatsapp',
        'authenticity_guide',
        'smart_tags_ai',
        'skin_routine_advisor',
        'customer_accounts',
        'ai_chatbot',
        'whatsapp_channel',
      ];
    }
    const resolved = resolveEffectiveFeatures(presetKeys);
    const updatedFlags: FeatureFlags = {
      tier_1_static: resolved.includes('tier_1_static'),
      tier_2_editable: resolved.includes('tier_2_editable'),
      tier_3_catalog: resolved.includes('tier_3_catalog'),
      cart_whatsapp: resolved.includes('cart_whatsapp'),
      customer_accounts: resolved.includes('customer_accounts'),
      payment_gateways: resolved.includes('payment_gateways'),
      ai_chatbot: resolved.includes('ai_chatbot'),
      whatsapp_channel: resolved.includes('whatsapp_channel'),
      telegram_channel: resolved.includes('telegram_channel'),
    };

    for (const key of Object.keys(FEATURES_REGISTRY)) {
      updatedFlags[key] = resolved.includes(key);
    }

    onFeaturesUpdate(updatedFlags);
  };

  return (
    <div className="w-full bg-[#111016] border-b border-gold/40 text-ivory transition-all z-20">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <TuningSliderIcon size={16} color="#C9A84C" />
          <span className="text-xs font-semibold text-champagne">
            محاكي باقات سَامِق:
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gold/15 text-gold font-bold font-mono">
            {pricing.selectedTier === 'tier_1_static'
              ? 'الدرجة 1: تعريفي ثابت بدون منتجات'
              : pricing.selectedTier === 'tier_2_editable'
              ? 'الدرجة 2: تعريفي بلوحة إدارة'
              : 'الدرجة 3: كتالوج منتجات كامل'}
          </span>
          {pricing.isDiscountEnabled && pricing.discountUsd > 0 && (
            <span className="text-[11px] font-mono text-[#8E8B85] line-through ms-1">${pricing.subtotalUsd}</span>
          )}
          <span className="text-xs font-bold font-mono text-gold ms-1">${pricing.totalUsd}</span>

          {/* Quick Theme Switches */}
          <div className="ms-2 hidden md:flex items-center gap-1 border-s border-white/10 ps-2">
            <span className="text-[11px] text-muted-lux">القالب:</span>
            <button
              type="button"
              onClick={() => handleThemeChange('luxury-noir')}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition ${
                activeTheme === 'luxury-noir'
                  ? 'bg-gold text-obsidian-dark font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-ivory/70'
              }`}
            >
              أسود فاخر
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('ivory-journal')}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition ${
                activeTheme === 'ivory-journal'
                  ? 'bg-[#FAF7F2] text-[#1B1612] font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-ivory/70'
              }`}
            >
              عاجي تحريري
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('clinic-lab')}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition ${
                activeTheme === 'clinic-lab'
                  ? 'bg-[#0F4C4A] text-white font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-ivory/70'
              }`}
            >
              سريري نقي
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaletteCustomizerOpen(!isPaletteCustomizerOpen)}
            className={`min-h-[44px] px-3 py-1.5 rounded-full border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
              isPaletteCustomizerOpen || isCustomEnabled
                ? 'bg-gold/20 border-gold text-gold font-bold shadow-sm'
                : 'bg-white/5 hover:bg-gold/15 border-gold/30 text-champagne'
            }`}
          >
            <span>لوحة الألوان الحية</span>
            {isCustomEnabled && <span className="w-2 h-2 rounded-full bg-gold inline-block animate-ping" />}
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-gold/15 border border-gold/30 text-xs font-semibold text-champagne transition flex items-center justify-center"
          >
            {isExpanded ? 'إخفاء الباقات ▲' : 'تبديل المزايا والباقات ▼'}
          </button>
        </div>
      </div>

      {/* Chameleon Palette Drawer */}
      {isPaletteCustomizerOpen && (
        <div className="max-w-7xl mx-auto px-4 py-4 border-t border-gold/30 bg-[#0E0E14] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10">
            <div>
              <h4 className="text-sm font-bold text-champagne font-serif">
                مخصص الألوان والهوية الحية (Chameleon Theme Engine)
              </h4>
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                تغيير مباشر للألوان وتطبيق فوري على الواجهة الرئيسية وكافة الصفحات الفرعية
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-ivory cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomEnabled}
                  onChange={(e) => setIsCustomEnabled(e.target.checked)}
                  className="rounded border-white/20 text-gold focus:ring-gold"
                />
                <span>تفعيل الألوان المخصصة فوق القالب</span>
              </label>
              <button
                type="button"
                onClick={handleResetPalette}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-xs text-muted-lux hover:text-rose-300 border border-white/10"
              >
                إعادة ضبط القالب
              </button>
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Primary Accent Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-champagne block">
                اللون الأساسي للعلامة (Accent):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftPrimary}
                  onChange={(e) => setDraftPrimary(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={draftPrimary}
                  onChange={(e) => setDraftPrimary(e.target.value)}
                  className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-ivory uppercase"
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {['#D4AF37', '#0F4C4A', '#8C5E3C', '#722F37', '#2563EB'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraftPrimary(c)}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-champagne block">
                لون الخلفية (Background):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftBg}
                  onChange={(e) => setDraftBg(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={draftBg}
                  onChange={(e) => setDraftBg(e.target.value)}
                  className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-ivory uppercase"
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {['#0B0B0C', '#FAF7F2', '#F4F8F7', '#FFFFFF', '#141418'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraftBg(c)}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Surface Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-champagne block">
                لون البطاقات والسطح (Surface):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftSurface}
                  onChange={(e) => setDraftSurface(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={draftSurface}
                  onChange={(e) => setDraftSurface(e.target.value)}
                  className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-ivory uppercase"
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {['#121214', '#FFFFFF', '#F2F7F5', '#1B1B22', '#FDFBF7'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraftSurface(c)}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-champagne block">
                لون النصوص الرئيسية (Text):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-24 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-ivory uppercase"
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {['#F4EFE6', '#1C1917', '#0D2625', '#FFFFFF', '#111827'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDraftText(c)}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition"
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleApplyPalette}
              className="px-5 py-2 rounded-xl bg-gold text-obsidian-dark font-sans font-bold text-xs shadow-md hover:brightness-110 transition"
            >
              تطبيق الألوان فورياً عبر المتجر
            </button>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 py-4 border-t border-white/5 space-y-4 animate-fadeIn">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-lux">الدرجات الأساسية والنماذج:</span>
            <button
              type="button"
              onClick={() => applyPreset('tier1')}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                pricing.selectedTier === 'tier_1_static' && activeKeys.length === 1
                  ? 'bg-gold text-obsidian-dark font-bold border-gold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-ivory'
              }`}
            >
              الدرجة 1: موقع تعريفي ثابت (${t1Pricing.totalUsd})
            </button>
            <button
              type="button"
              onClick={() => applyPreset('tier2')}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                pricing.selectedTier === 'tier_2_editable' && !currentFeatures.tier_3_catalog
                  ? 'bg-gold text-obsidian-dark font-bold border-gold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-ivory'
              }`}
            >
              الدرجة 2: تعريفي بلوحة إدارة (${t2Pricing.totalUsd})
            </button>
            <button
              type="button"
              onClick={() => applyPreset('tier3')}
              className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                currentFeatures.tier_3_catalog && !currentFeatures.ai_chatbot
                  ? 'bg-gold text-obsidian-dark font-bold border-gold shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-ivory'
              }`}
            >
              الدرجة 3: كتالوج وسلة واتساب (${t3Pricing.totalUsd})
            </button>
            <button
              type="button"
              onClick={() => applyPreset('royal')}
              className="px-3 py-1.5 rounded-lg text-xs bg-gradient-to-r from-gold/20 to-gold/5 border border-gold text-ivory font-bold hover:brightness-110"
            >
              الباقة الملكية بالذكاء الاصطناعي ($500+)
            </button>
          </div>

          {/* Feature Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pt-2">
            {Object.values(FEATURES_REGISTRY).map((feat) => {
              const isEnabled = !!currentFeatures[feat.id];
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => toggleFeature(feat.id)}
                  className={`p-2.5 rounded-xl border text-start transition flex items-center justify-between text-xs ${
                    isEnabled
                      ? 'bg-gold/10 border-gold/40 text-champagne font-semibold'
                      : 'bg-white/[0.02] border-white/5 text-muted-lux hover:text-ivory'
                  }`}
                >
                  <span className="truncate">{feat.nameAr}</span>
                  <span className="text-xs font-mono text-gold shrink-0 ms-2">
                    {isEnabled ? 'مفعل' : 'معطل'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

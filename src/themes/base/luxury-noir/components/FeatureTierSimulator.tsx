'use client';

import React, { useState } from 'react';
import {
  FEATURES_REGISTRY,
  calculateTierPrice,
  resolveEffectiveFeatures,
} from '@/core/features/registry';
import { FeatureFlags } from '../../../contract';
import { TuningSliderIcon } from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

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

  // Active feature list as array of keys
  const activeKeys = Object.keys(currentFeatures).filter((k) => currentFeatures[k]);
  const pricing = calculateTierPrice(activeKeys);

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
        <div className="flex items-center gap-2">
          <TuningSliderIcon size={16} color="#C9A84C" />
          <span className="text-xs font-semibold text-champagne">
            محاكي باقات سَامِق (وضع المعاينة الحي — ؟demo=panel):
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gold/15 text-gold font-bold font-mono">
            {pricing.selectedTier === 'tier_1_static'
              ? 'الدرجة 1: تعريفي ثابت بدون منتجات'
              : pricing.selectedTier === 'tier_2_editable'
              ? 'الدرجة 2: تعريفي بلوحة إدارة'
              : 'الدرجة 3: كتالوج منتجات كامل'}
          </span>
          <span className="text-xs font-bold font-mono text-gold">${pricing.totalUsd}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="min-h-[44px] px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-gold/15 border border-gold/30 text-xs font-semibold text-champagne transition flex items-center justify-center"
        >
          {isExpanded ? 'إخفاء لوحة المحاكي ▲' : 'تبديل الدرجات والمزايا فورياً ▼'}
        </button>
      </div>

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
              الدرجة 1: موقع تعريفي ثابت ($80)
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
              الدرجة 2: تعريفي بلوحة إدارة ($130)
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
              الدرجة 3: كتالوج وسلة واتساب ($235)
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

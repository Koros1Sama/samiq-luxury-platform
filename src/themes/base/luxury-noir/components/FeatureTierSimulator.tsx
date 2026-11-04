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
  const onFeaturesUpdate = props.onFeaturesUpdate || (() => {});

  const [isExpanded, setIsExpanded] = useState(false);

  // Active feature list as array of keys
  const activeKeys = Object.keys(currentFeatures).filter((k) => currentFeatures[k]);
  const pricing = calculateTierPrice(activeKeys);

  const toggleFeature = (featureId: string) => {
    const isCurrentlyOn = !!currentFeatures[featureId];
    let newKeys: string[];

    if (isCurrentlyOn) {
      newKeys = activeKeys.filter((k) => k !== featureId);
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

    onFeaturesUpdate(updatedFlags);
  };

  const applyPreset = (preset: 'starter' | 'merchant' | 'ultimate') => {
    let presetKeys: string[];
    if (preset === 'starter') {
      presetKeys = ['tier_1_static', 'cart_whatsapp'];
    } else if (preset === 'merchant') {
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
        'ai_chatbot',
        'payment_gateways',
        'customer_accounts',
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
    onFeaturesUpdate(updatedFlags);
  };

  return (
    <div className="w-full bg-[#111016] border-b border-gold/40 text-ivory transition-all z-20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <TuningSliderIcon size={16} color="#C9A84C" />
          <span className="text-xs font-semibold text-champagne">
            محاكي باقات سَامِق (وضع المعاينة التجريبي):
          </span>
          <span className="text-xs font-bold font-mono text-gold">${pricing.totalUsd}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-1 rounded-full bg-white/5 hover:bg-gold/15 border border-gold/30 text-xs font-semibold text-champagne transition"
        >
          {isExpanded ? 'إخفاء لوحة التحكم ▲' : 'تخصيص المزايا والأسعار ▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 py-4 border-t border-white/5 space-y-4 animate-fadeIn">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-lux">نماذج جاهزة:</span>
            <button
              type="button"
              onClick={() => applyPreset('starter')}
              className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-ivory"
            >
              باقة الحضور ($140)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('merchant')}
              className="px-2.5 py-1 rounded-lg text-xs bg-gold/10 hover:bg-gold/20 border border-gold/30 text-champagne font-semibold"
            >
              باقة التميز ($425)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('ultimate')}
              className="px-2.5 py-1 rounded-lg text-xs bg-gradient-to-r from-gold/20 to-gold/5 border border-gold text-ivory font-bold"
            >
              الباقة الكاملة ($700+)
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
                  <span className="text-[10px] font-mono text-gold shrink-0 ms-2">
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

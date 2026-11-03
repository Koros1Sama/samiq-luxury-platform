'use client';

import React, { useState } from 'react';
import { FEATURES_REGISTRY, calculateTierPrice, validateFeatureDependencies, resolveEffectiveFeatures } from '@/core/features/registry';
import { FeatureFlags } from '../../../contract';
import { TuningSliderIcon, CloseIcon } from './LuxuryIcons';
import { ThemeSwitcher } from './ThemeSwitcher';

interface FeatureTierSimulatorProps {
  currentFeatures: FeatureFlags;
  onFeaturesUpdate: (features: FeatureFlags) => void;
}

export function FeatureTierSimulator({
  currentFeatures,
  onFeaturesUpdate,
}: FeatureTierSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Active feature list as array of keys
  const activeKeys = Object.keys(currentFeatures).filter(
    (k) => currentFeatures[k]
  );
  const pricing = calculateTierPrice(activeKeys);
  const validation = validateFeatureDependencies(activeKeys);

  const toggleFeature = (featureId: string) => {
    const isCurrentlyOn = !!currentFeatures[featureId];
    let newKeys: string[];

    if (isCurrentlyOn) {
      newKeys = activeKeys.filter((k) => k !== featureId);
      if (!newKeys.includes('tier_1_static') && !newKeys.includes('tier_2_editable') && !newKeys.includes('tier_3_catalog')) {
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
      authenticity_guide: newKeys.includes('authenticity_guide'),
      skin_routine_advisor: newKeys.includes('skin_routine_advisor'),
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
      presetKeys = ['tier_1_static', 'tier_2_editable', 'cart_whatsapp', 'authenticity_guide', 'skin_routine_advisor'];
    } else {
      presetKeys = [
        'tier_1_static',
        'tier_2_editable',
        'tier_3_catalog',
        'cart_whatsapp',
        'authenticity_guide',
        'skin_routine_advisor',
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
      authenticity_guide: resolved.includes('authenticity_guide'),
      skin_routine_advisor: resolved.includes('skin_routine_advisor'),
      customer_accounts: resolved.includes('customer_accounts'),
      payment_gateways: resolved.includes('payment_gateways'),
      ai_chatbot: resolved.includes('ai_chatbot'),
      whatsapp_channel: resolved.includes('whatsapp_channel'),
      telegram_channel: resolved.includes('telegram_channel'),
    };
    onFeaturesUpdate(updatedFlags);
  };

  return (
    <>
      {/* Floating Activation Pill (Elevated on mobile above bottom app nav) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-5 start-4 md:start-5 z-40 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1E1B15] to-[#121217] border border-[#C9A84C]/50 shadow-[0_4px_25px_rgba(201,168,76,0.35)] text-ivory hover:border-[#FCF6BA] hover:scale-105 transition-all duration-300"
      >
        <TuningSliderIcon size={16} color="#C9A84C" />
        <span className="text-xs font-sans font-bold bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
          محاكي باقات سامق: ({pricing.totalUsd}$)
        </span>
      </button>

      {/* Simulator Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-[#C9A84C]/30 shadow-2xl p-6 text-ivory">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <TuningSliderIcon size={20} color="#C9A84C" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-ivory">
                    محاكي هندسة باقات سَامِق (SAMIQ Engine)
                  </h3>
                  <p className="text-xs text-muted-lux">
                    شغّلي وأوقفي المزايا حياً لمشاهدة تحول المتجر فورياً
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux hover:text-ivory text-sm"
              >
                <CloseIcon size={16} color="#9A968E" />
              </button>
            </div>

            {/* Live Theme Switcher */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-ivory block">القالب البصري النشط:</span>
                <span className="text-[11px] text-muted-lux">تبديل فوري بين الثيمات الـ 3 (Noir, Ivory, Botanical)</span>
              </div>
              <ThemeSwitcher />
            </div>

            {/* Total Pricing Bar */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-[#1C180E] to-[#121118] border border-gold/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-gold font-medium">
                  تكلفة الترخيص والتشغيل التقديرية:
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-serif font-bold text-ivory">
                    ${pricing.totalUsd}
                  </span>
                  <span className="text-xs text-muted-lux font-sans">
                    (الباقة: ${pricing.baseTierPriceUsd} + إضافات: ${pricing.addonsPriceUsd})
                  </span>
                </div>
              </div>
              <div className="text-end">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-champagne border border-gold/30">
                  {FEATURES_REGISTRY[pricing.selectedTier]?.nameAr.split(' ')[0] || 'الباقة الحالية'}
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-5">
              <label className="text-xs text-muted-lux font-medium block mb-2">
                نماذج جاهزة للاختيار السريع:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('starter')}
                  className="px-3 py-2 rounded-xl text-xs font-medium border border-white/10 hover:border-gold/50 bg-white/5 text-ivory text-center transition"
                >
                  حضور رقمي بسيط
                  <div className="text-[10px] text-gold mt-0.5">($140)</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('merchant')}
                  className="px-3 py-2 rounded-xl text-xs font-medium border border-gold/40 bg-gold/10 text-champagne text-center transition"
                >
                  متجر التميز
                  <div className="text-[10px] text-gold mt-0.5">($425)</div>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('ultimate')}
                  className="px-3 py-2 rounded-xl text-xs font-medium border border-gold bg-gradient-to-r from-gold/20 to-gold/5 text-ivory text-center transition"
                >
                  إمبراطوري كامل + ذكاء
                  <div className="text-[10px] text-gold mt-0.5">($700+)</div>
                </button>
              </div>
            </div>

            {/* Feature Toggles List */}
            <div className="space-y-2.5">
              <label className="text-xs text-muted-lux font-medium block">
                تخصيص المزايا الفردية:
              </label>
              {Object.values(FEATURES_REGISTRY).map((feat) => {
                const isEnabled = !!currentFeatures[feat.id];
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                      isEnabled
                        ? 'bg-elevated border-gold/40 shadow-[0_2px_12px_rgba(201,168,76,0.1)]'
                        : 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex-1 pe-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ivory">
                          {feat.nameAr}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gold font-sans">
                          +${feat.basePriceUsd}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-lux mt-0.5 leading-relaxed">
                        {feat.descriptionAr}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <div
                        className={`w-11 h-6 rounded-full transition-colors p-0.5 relative ${
                          isEnabled ? 'bg-gradient-to-r from-[#BF953F] to-[#C9A84C]' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                            isEnabled ? 'translate-x-[-1.25rem]' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close / Apply button */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.4)] hover:brightness-110 transition"
              >
                تطبيق الإعدادات ومعاينة المتجر ↵
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

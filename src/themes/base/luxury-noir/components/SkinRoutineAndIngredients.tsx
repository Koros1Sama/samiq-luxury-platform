'use client';

import React, { useState } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { SkinRoutineData } from '@/modules/blocks/types';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import {
  DropSkinIcon,
  WaveSkinIcon,
  FeatherSkinIcon,
  CitrusIngredientIcon,
  HydraDropIngredientIcon,
  HexMoleculeIngredientIcon,
} from './LuxuryIcons';

interface SkinRoutineAndIngredientsProps {
  skinData?: SkinRoutineData;
  onExploreProducts?: (categorySlug: string) => void;
}

export function SkinRoutineAndIngredients(props: SkinRoutineAndIngredientsProps) {
  const sf = useStorefront();
  const skinData = props.skinData || (sf.blocksData['skin-routine'] as SkinRoutineData);
  const onExploreProducts = props.onExploreProducts;

  const [activeSkinTypeId, setActiveSkinTypeId] = useState<'oily' | 'dry' | 'sensitive'>('oily');

  if (!skinData || !skinData.skinTypes) return null;

  const currentRoutine =
    skinData.skinTypes.find((t) => t.id === activeSkinTypeId) || skinData.skinTypes[0];

  const getSkinIcon = (typeId: string, isSelected: boolean) => {
    const color = isSelected ? '#C9A84C' : '#9A968E';
    if (typeId === 'oily') return <DropSkinIcon size={26} color={color} strokeWidth={1.5} />;
    if (typeId === 'dry') return <WaveSkinIcon size={26} color={color} strokeWidth={1.5} />;
    return <FeatherSkinIcon size={26} color={color} strokeWidth={1.5} />;
  };

  const getIngredientIcon = (iconType: string) => {
    if (iconType === 'citrus') return <CitrusIngredientIcon size={24} color="#C9A84C" strokeWidth={1.25} />;
    if (iconType === 'drop') return <HydraDropIngredientIcon size={24} color="#C9A84C" strokeWidth={1.25} />;
    return <HexMoleculeIngredientIcon size={24} color="#C9A84C" strokeWidth={1.25} />;
  };

  return (
    <section id="skin-routine" className="py-8 sm:py-16 relative overflow-hidden bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Column 1: Editorial Radiant Skincare (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2rem] overflow-hidden bg-[#0E0E12] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[420px]">
              <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                <SmartImage
                  src="/media/hero/hero-ivory.jpg"
                  alt={skinData.title || 'روتين العناية بالبشرة'}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#0E0E12]/80 to-transparent pointer-events-none" />

              {/* Top Badge */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/30 text-champagne text-xs font-sans font-semibold">
                  <span>إشراقة وتناغم طبيعي</span>
                </div>
              </div>

              {/* Headline & CTA */}
              <div className="relative z-10 space-y-3 my-auto pt-12">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory leading-tight">
                  روتين العناية ببشرتك لإشراقة تدوم
                </h2>
                <p className="text-sm text-muted-lux font-sans leading-relaxed max-w-sm">
                  {currentRoutine.routineDescription}
                </p>
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <a
                    href="#products-catalog"
                    onClick={() => onExploreProducts?.(currentRoutine.id)}
                    className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:brightness-110 transition"
                  >
                    <span>اكتشفي الروتين المثالي</span>
                    <span className="rtl:-scale-x-100">←</span>
                  </a>
                  <a
                    href="/blog?post=how-to-verify-vitamin-c-serum"
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/40 text-ivory text-xs font-sans transition"
                  >
                    <span>دليل المجلة العلمية</span>
                    <span className="rtl:-scale-x-100">←</span>
                  </a>
                </div>
              </div>

              {/* Active Routine Steps Summary */}
              <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-champagne font-sans">
                <span>الروتين المقترح: {currentRoutine.label} — 3 خطوات متكاملة</span>
              </div>
            </div>
          </div>

          {/* Column 2: 3 Interactive Skin Type Cards (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {skinData.skinTypes.map((type) => {
              const isSelected = activeSkinTypeId === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setActiveSkinTypeId(type.id)}
                  className={`min-h-[48px] p-4 rounded-[1.5rem] border text-start transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1A1813] to-[#121118] border-gold text-champagne shadow-[0_4px_25px_rgba(201,168,76,0.25)] scale-[1.02]'
                      : 'bg-[#0E0E12] border-white/10 text-ivory/70 hover:text-ivory hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-gold/15 border-gold/40 shadow-inner'
                          : 'bg-white/5 border-white/10 group-hover:border-gold/30'
                      }`}
                    >
                      {getSkinIcon(type.id, isSelected)}
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-serif font-bold text-ivory block">
                        {type.label}
                      </span>
                      <span className="text-xs font-sans text-muted-lux block mt-0.5">
                        {type.tagline.split(' ')[0]} {type.tagline.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isSelected ? 'bg-gold scale-125' : 'bg-white/20'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Column 3: Molecular Network & Active Actives Map (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#0E0E12] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                    <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                      المكونات الفعالة
                    </h3>
                  </div>
                  <span className="text-xs text-champagne font-sans font-semibold">
                    Active Actives
                  </span>
                </div>

                {/* SVG Golden Glowing Molecular Network */}
                <div className="relative h-20 w-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 240 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  >
                    <line x1="40" y1="40" x2="120" y2="25" stroke="#C9A84C" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="120" y1="25" x2="200" y2="40" stroke="#C9A84C" strokeWidth="2" />
                    <line x1="120" y1="25" x2="120" y2="65" stroke="#C9A84C" strokeWidth="2" />
                    <circle cx="40" cy="40" r="7" fill="#C9A84C" />
                    <circle cx="120" cy="25" r="10" fill="#FCF6BA" />
                    <circle cx="200" cy="40" r="8" fill="#C9A84C" />
                    <circle cx="120" cy="65" r="7" fill="#B38728" />
                  </svg>
                </div>

                {/* 3 Active Actives with Bespoke Monoline SVGs */}
                <div className="space-y-2.5">
                  {skinData.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                          {getIngredientIcon(ing.iconType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-ivory">
                              {ing.nameAr}
                            </span>
                            <span className="text-xs font-sans text-champagne/80 dir-ltr">
                              {ing.nameEn}
                            </span>
                          </div>
                          <p className="text-xs text-muted-lux mt-0.5 line-clamp-1 leading-relaxed">
                            {ing.benefitsAr}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-sans font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-md shrink-0">
                        {ing.concentration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section id="skin-routine" className="py-10 sm:py-16 relative overflow-hidden bg-obsidian border-t border-white/5">
      {/* Golden atmospheric glows */}
      <div className="absolute top-1/4 start-10 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-10 end-10 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 3-Column Luxury Desktop Layout (Matching Monitor Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Editorial Radiant Skincare Model + Headline + CTA (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2rem] overflow-hidden bg-surface border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[460px]">
              {/* Background Model Photograph with Radiant Glowing Skin */}
              <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                <SmartImage
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80"
                  alt={skinData.title || "روتين العناية بالبشرة"}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#0E0E12]/80 to-transparent pointer-events-none" />

              {/* Top Section Badge */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/30 text-champagne text-xs font-sans font-semibold">
                  <span>إشراقة وتناغم طبيعي</span>
                </div>
              </div>

              {/* Headline & CTA */}
              <div className="relative z-10 space-y-4 my-auto pt-16">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory leading-tight">
                  روتين العناية ببشرتك لإشراقة تدوم
                </h2>
                <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed max-w-sm">
                  {currentRoutine.routineDescription}
                </p>
                <div className="pt-2">
                  <a
                    href="#featured-products"
                    onClick={() => onExploreProducts?.(currentRoutine.id)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:brightness-110 transition"
                  >
                    <span>اكتشفي الروتين المثالي</span>
                    <span>←</span>
                  </a>
                </div>
              </div>

              {/* Active Routine Steps Summary */}
              <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-champagne/90 font-sans">
                <span>الروتين المقترح: {currentRoutine.label} — 3 خطوات متكاملة</span>
              </div>
            </div>
          </div>

          {/* Column 2: The 3 Stacked Interactive Skin Type Cards (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {skinData.skinTypes.map((type) => {
              const isSelected = activeSkinTypeId === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setActiveSkinTypeId(type.id)}
                  className={`p-5 rounded-[1.75rem] border text-start transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1A1813] to-[#121118] border-gold text-champagne shadow-[0_4px_25px_rgba(201,168,76,0.25)] scale-[1.02]'
                      : 'bg-surface/80 border-white/10 text-ivory/70 hover:text-ivory hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-gold/15 border-gold/40 shadow-inner'
                          : 'bg-white/5 border-white/10 group-hover:border-gold/30'
                      }`}
                    >
                      {getSkinIcon(type.id, isSelected)}
                    </div>
                    <div>
                      <span className="text-base font-serif font-bold text-ivory block">
                        {type.label}
                      </span>
                      <span className="text-[11px] font-sans text-muted-lux block mt-0.5">
                        {type.tagline.split(' ')[0]} {type.tagline.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full transition-all ${
                      isSelected ? 'bg-gold scale-125' : 'bg-white/20'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Column 3: Golden Molecular Network & Active Actives Map (4 cols) */}
          <div className="lg:col-span-4">
            <div className="p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-gradient-to-b from-[#15151B] to-[#0A0A0E] p-6 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                    <h3 className="text-lg font-serif font-bold text-ivory">
                      المكونات الفعالة
                    </h3>
                  </div>
                  <span className="text-[10px] text-champagne font-sans font-semibold tracking-normal uppercase">
                    Active Actives
                  </span>
                </div>

                {/* SVG Golden Glowing Molecular Network */}
                <div className="relative h-36 w-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 320 150"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(201,168,76,0.35)]"
                  >
                    <defs>
                      <linearGradient id="bondGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#FCF6BA" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.8" />
                      </linearGradient>
                      <radialGradient id="nodeGlowGold" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF2A3" />
                        <stop offset="40%" stopColor="#C9A84C" />
                        <stop offset="100%" stopColor="#8A7326" stopOpacity="0.2" />
                      </radialGradient>
                    </defs>

                    {/* Molecular Bonds */}
                    <line x1="60" y1="75" x2="120" y2="35" stroke="url(#bondGradGold)" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="120" y1="35" x2="200" y2="75" stroke="url(#bondGradGold)" strokeWidth="2.5" />
                    <line x1="200" y1="75" x2="260" y2="35" stroke="url(#bondGradGold)" strokeWidth="2" />
                    <line x1="120" y1="35" x2="120" y2="115" stroke="url(#bondGradGold)" strokeWidth="2" />
                    <line x1="200" y1="75" x2="200" y2="125" stroke="url(#bondGradGold)" strokeWidth="2" />
                    <line x1="120" y1="115" x2="200" y2="125" stroke="url(#bondGradGold)" strokeWidth="2" />

                    {/* Glowing Atoms */}
                    <circle cx="60" cy="75" r="7" fill="url(#nodeGlowGold)" />
                    <circle cx="120" cy="35" r="11" fill="url(#nodeGlowGold)" />
                    <circle cx="200" cy="75" r="14" fill="url(#nodeGlowGold)" />
                    <circle cx="260" cy="35" r="9" fill="url(#nodeGlowGold)" />
                    <circle cx="120" cy="115" r="10" fill="url(#nodeGlowGold)" />
                    <circle cx="200" cy="125" r="11" fill="url(#nodeGlowGold)" />
                    <circle cx="200" cy="75" r="22" stroke="#FCF6BA" strokeWidth="0.8" strokeOpacity="0.3" />
                  </svg>
                </div>

                {/* The 3 Active Actives with Bespoke Monoline SVGs */}
                <div className="space-y-3">
                  {skinData.ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                          {getIngredientIcon(ing.iconType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-ivory">
                              {ing.nameAr}
                            </span>
                            <span className="text-[10px] font-sans text-champagne/80 dir-ltr">
                              {ing.nameEn}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-lux mt-0.5 line-clamp-1">
                            {ing.benefitsAr}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-sans font-bold text-gold bg-gold/10 px-2 py-1 rounded-md flex-shrink-0">
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

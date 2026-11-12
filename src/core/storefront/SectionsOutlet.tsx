'use client';

import React from 'react';
import { Section, SectionRenderers } from '@/themes/contract';
import { useStorefront } from './StorefrontProvider';
import { MobileAppViews } from './MobileAppViews';
import { renderStorefrontSection } from './renderStorefrontSection';

interface SectionsOutletProps {
  sections?: Section[];
  renderers: SectionRenderers;
}

export function SectionsOutlet({ sections, renderers }: SectionsOutletProps) {
  const { tenant, features, blocksData, mobileTab = 'home' } = useStorefront();

  const activeSections = sections || tenant.homeSections || [];
  const heroSection = activeSections.find((s) => s.type === 'hero' && s.visible);
  const bodySections = activeSections.filter((s) => s.type !== 'hero');
  const HeroRenderer = heroSection ? renderers['hero'] : undefined;
  const isHomeTab = mobileTab === 'home';

  return (
    <>
      {/* Single unified LCP Hero slot: renders once in DOM across mobile Home and all Desktop views */}
      {heroSection && HeroRenderer && (
        <div className={isHomeTab ? 'block w-full' : 'hidden md:block w-full'}>
          <HeroRenderer key={heroSection.id} section={heroSection} />
        </div>
      )}

      {/* 1. Desktop & Tablet View (>= 768px): Full Editorial Sections Sequence */}
      <div className="hidden md:flex flex-col w-full">
        {bodySections.map((section) =>
          renderStorefrontSection({ section, renderers, blocksData, features })
        )}
      </div>

      {/* 2. Mobile App-Shell View (< 768px): Dynamic Switchable Mobile Views */}
      <div className="md:hidden flex flex-col w-full">
        <MobileAppViews sections={bodySections} renderers={renderers} />
      </div>
    </>
  );
}

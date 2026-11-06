'use client';

import React from 'react';
import { Section, SectionRenderers } from '@/themes/contract';
import { useStorefront } from './StorefrontProvider';
import { getBlock } from '@/modules/blocks/registry';
import { MobileAppViews } from './MobileAppViews';

interface SectionsOutletProps {
  sections?: Section[];
  renderers: SectionRenderers;
}

export function SectionsOutlet({ sections, renderers }: SectionsOutletProps) {
  const { tenant, features, blocksData } = useStorefront();

  const activeSections = sections || tenant.homeSections || [];

  return (
    <>
      {/* 1. Desktop & Tablet View (>= 768px): Full Editorial Sections Sequence */}
      <div className="hidden md:flex flex-col w-full">
        {activeSections.map((section) => {
          if (!section.visible) return null;

          // Check section-level feature flag
          if (section.requiresFeature && !features[section.requiresFeature]) {
            return null;
          }

          // Tier 1 and Tier 2 landing page mandate:
          if (!features.tier_3_catalog && (section.type === 'product-grid' || section.type === 'category-grid')) {
            return null;
          }

          // 1. Handle modular blocks
          if (section.type === 'block') {
            const blockKey = (section.props?.blockKey as string) || '';
            if (!blockKey) return null;

            const blockDef = getBlock(blockKey);
            if (blockDef?.requiresFeature && !features[blockDef.requiresFeature]) {
              return null;
            }

            const blockData = blocksData[blockKey];

            const ThemeBlockRenderer = renderers.blocks?.[blockKey];
            if (ThemeBlockRenderer) {
              return (
                <React.Fragment key={section.id}>
                  <ThemeBlockRenderer blockKey={blockKey} data={blockData} props={section.props} />
                </React.Fragment>
              );
            }

            if (blockDef?.DefaultRenderer) {
              const DefaultBlockRenderer = blockDef.DefaultRenderer;
              return (
                <React.Fragment key={section.id}>
                  <DefaultBlockRenderer blockKey={blockKey} data={blockData} props={section.props} />
                </React.Fragment>
              );
            }

            return null;
          }

          // 2. Handle generic section types
          const Renderer = renderers[section.type];
          if (!Renderer) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[SectionsOutlet] No renderer found for section type: "${section.type}"`);
            }
            return null;
          }

          return <Renderer key={section.id} section={section} />;
        })}
      </div>

      {/* 2. Mobile App-Shell View (< 768px): Dynamic Switchable Mobile Views */}
      <div className="md:hidden flex flex-col w-full">
        <MobileAppViews sections={activeSections} renderers={renderers} />
      </div>
    </>
  );
}

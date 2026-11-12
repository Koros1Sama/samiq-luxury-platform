import React from 'react';
import { FeatureFlags, Section, SectionRenderers } from '@/themes/contract';
import { getBlock } from '@/modules/blocks/registry';

interface RenderStorefrontSectionArgs {
  section: Section | undefined;
  renderers: SectionRenderers;
  blocksData: Record<string, unknown>;
  features: FeatureFlags;
}

/**
 * Canonical storefront section and modular block resolver shared between
 * desktop editorial flow (`SectionsOutlet`) and mobile app views (`MobileAppViews`).
 */
export function renderStorefrontSection({
  section,
  renderers,
  blocksData,
  features,
}: RenderStorefrontSectionArgs): React.ReactNode {
  if (!section || !section.visible) return null;
  if (section.requiresFeature && !features[section.requiresFeature]) return null;
  if (!features.tier_3_catalog && (section.type === 'product-grid' || section.type === 'category-grid')) {
    return null;
  }

  if (section.type === 'block') {
    const blockKey = (section.props?.blockKey as string) || '';
    if (!blockKey) return null;

    const blockDef = getBlock(blockKey);
    if (blockDef?.requiresFeature && !features[blockDef.requiresFeature]) return null;

    const blockData = blocksData[blockKey];
    const BlockRenderer = renderers.blocks?.[blockKey] ?? blockDef?.DefaultRenderer;
    return BlockRenderer ? (
      <BlockRenderer key={section.id} blockKey={blockKey} data={blockData} props={section.props} />
    ) : null;
  }

  const Renderer = renderers[section.type];
  if (!Renderer) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[SectionsOutlet] No renderer found for section type: "${section.type}"`);
    }
    return null;
  }

  return <Renderer key={section.id} section={section} />;
}

import React from 'react';
import { resolveTenant } from '@/core/tenant/resolver';
import { getDb } from '@/core/db/store';
import { StorefrontProvider } from '@/core/storefront/StorefrontProvider';
import { ThemeHost } from '@/themes/ThemeHost';
import { loadAllBlocksData } from '@/modules/blocks/registry';
import { TenantBrandInfo, ThemeId, resolveThemeId } from '@/themes/contract';
import { FeatureTierSimulator } from '@/themes/base/luxury-noir/components/FeatureTierSimulator';

export const revalidate = 0; // Dynamic real-time persistence

interface PageProps {
  searchParams: Promise<{
    theme?: string;
    demo?: string;
    tenant?: string;
  }>;
}

export default async function StorefrontHomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const isDevOrDemo =
    process.env.NODE_ENV !== 'production' ||
    searchParams.demo === '1' ||
    searchParams.demo === 'panel';

  // 1. Resolve tenant context (defaults to Miftah Al-Jamal)
  const tenantSlug = isDevOrDemo && searchParams.tenant ? searchParams.tenant : undefined;
  const tenantContext = resolveTenant(tenantSlug);
  const db = getDb();

  // 2. Select theme: searchParams.theme is honored only in dev or demo=1
  const rawThemeId = isDevOrDemo && searchParams.theme
    ? searchParams.theme
    : db.tenant?.themeId || tenantContext.tenant.themeId;
  const themeId: ThemeId = resolveThemeId(rawThemeId);

  // 3. Load modular blocks data from registry
  const blocksData = loadAllBlocksData(db);

  // 4. Build tenant storefront data (tailored for Miftah Al-Jamal)
  const tenantData: TenantBrandInfo = {
    ...tenantContext.tenant,
    ...(db.tenant || {}),
    themeId,
    contact: db.tenant?.contact || tenantContext.tenant.contact,
    homeSections: db.tenant?.homeSections || tenantContext.tenant.homeSections,
  };

  const rawProducts = db.products;
  const products = rawProducts.filter(
    (p) =>
      p.visibilityStatus !== 'warehouse_only' &&
      p.visibilityStatus !== 'archived' &&
      p.isPublished !== false
  );
  const categories = db.categories;

  const showDemoPanel = searchParams.demo === 'panel' || searchParams.demo === '1' || isDevOrDemo;

  return (
    <StorefrontProvider
      tenant={tenantData}
      features={db.features}
      products={products}
      categories={categories}
      blocksData={blocksData}
      platformMeta={db.platformMeta}
      branches={db.branches || []}
      shippingZones={db.shippingZones || []}
      initialCurrency="YER"
    >
      {showDemoPanel && <FeatureTierSimulator />}
      <ThemeHost themeId={themeId} />
    </StorefrontProvider>
  );
}

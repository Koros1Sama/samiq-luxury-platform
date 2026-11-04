import React from 'react';
import { resolveTenant } from '@/core/tenant/resolver';
import { getDb } from '@/core/db/store';
import { StorefrontProvider } from '@/core/storefront/StorefrontProvider';
import { THEMES, resolveThemeId, DEFAULT_THEME_ID } from '@/themes/registry';
import { loadAllBlocksData } from '@/modules/blocks/registry';
import { DEMO_RESTAURANT_PRODUCTS, DEMO_RESTAURANT_CATEGORIES } from '@/core/store/mockData';
import { TenantBrandInfo, ThemeId } from '@/themes/contract';

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
  const isDevOrDemo = process.env.NODE_ENV !== 'production' || searchParams.demo === '1';

  // 1. Resolve tenant context (supports dev acceptance testing for demo-restaurant)
  const tenantSlug = isDevOrDemo && searchParams.tenant ? searchParams.tenant : undefined;
  const isDemoRestaurant = tenantSlug === 'demo-restaurant';
  const tenantContext = resolveTenant(tenantSlug);
  const db = getDb();

  // 2. Select theme: searchParams.theme is honored only in dev or demo=1
  const rawThemeId = isDevOrDemo && searchParams.theme
    ? searchParams.theme
    : db.tenant?.themeId || tenantContext.tenant.themeId;
  const themeId: ThemeId = resolveThemeId(rawThemeId);

  // 3. Dynamically load theme layout
  const themeEntry = THEMES[themeId] || THEMES[DEFAULT_THEME_ID];
  const { default: ThemeLayout } = await themeEntry.load();

  // 4. Load modular blocks data from registry
  const blocksData = loadAllBlocksData(db);

  // 5. Build tenant storefront data
  const tenantData: TenantBrandInfo = {
    ...tenantContext.tenant,
    ...(!isDemoRestaurant ? db.tenant : {}),
    themeId,
    contact: isDemoRestaurant ? tenantContext.tenant.contact : (db.tenant?.contact || tenantContext.tenant.contact),
    homeSections: isDemoRestaurant ? tenantContext.tenant.homeSections : (db.tenant?.homeSections || tenantContext.tenant.homeSections),
  };

  const products = isDemoRestaurant ? DEMO_RESTAURANT_PRODUCTS : db.products;
  const categories = isDemoRestaurant ? DEMO_RESTAURANT_CATEGORIES : db.categories;

  return (
    <StorefrontProvider
      tenant={tenantData}
      features={db.features}
      products={products}
      categories={categories}
      blocksData={blocksData}
      initialCurrency="YER"
    >
      <ThemeLayout />
    </StorefrontProvider>
  );
}

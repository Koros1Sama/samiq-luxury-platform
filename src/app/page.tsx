import React from 'react';
import { cookies } from 'next/headers';
import { resolveTenant } from '@/core/tenant/resolver';
import { getDb } from '@/core/db/store';
import { StorefrontProvider } from '@/core/storefront/StorefrontProvider';
import { DemoSimulatorGate } from '@/core/storefront/DemoSimulatorGate';
import { ThemeHost } from '@/themes/ThemeHost';
import { loadAllBlocksData } from '@/modules/blocks/registry';
import { buildFeatureFlagsFromList, resolveEffectiveFeatures } from '@/core/features/registry';
import { TenantBrandInfo, ThemeId, resolveThemeId } from '@/themes/contract';

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
  const matchedProject = tenantSlug
    ? (db.projects || []).find((p) => p.slug === tenantSlug || p.id === tenantSlug)
    : undefined;
  const isAlternateTenant = Boolean(
    tenantSlug && tenantSlug !== 'miftah' && !tenantSlug.startsWith('miftah-')
  );

  // 2. Select theme: explicit ?theme= always wins; otherwise alternate projects use their own themeId
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('samiq_active_theme')?.value || cookieStore.get('samiq_demo_theme')?.value;
  const rawThemeId = isAlternateTenant
    ? searchParams.theme || matchedProject?.themeId || tenantContext.tenant.themeId
    : searchParams.theme || cookieTheme || db.tenant?.themeId || tenantContext.tenant.themeId;
  const themeId: ThemeId = resolveThemeId(rawThemeId);

  // 3. Load modular blocks data from registry
  const blocksData = loadAllBlocksData(db);

  // 4. Build tenant storefront data without overwriting alternate tenants with pilot db.tenant
  const tenantData: TenantBrandInfo = isAlternateTenant
    ? {
        ...tenantContext.tenant,
        ...(matchedProject
          ? {
              id: matchedProject.id,
              name: matchedProject.name,
              legalName: matchedProject.legalName,
              tagline: matchedProject.industryAr,
              city: matchedProject.city,
              whatsapp: matchedProject.whatsapp,
              phone: matchedProject.whatsapp,
              contact: {
                whatsapp: matchedProject.whatsapp,
                phone: matchedProject.whatsapp,
                social:
                  tenantSlug === 'demo-restaurant'
                    ? tenantContext.tenant.contact.social
                    : {},
                map: {
                  url: tenantContext.tenant.contact?.map?.url || 'https://maps.google.com',
                  label: `${matchedProject.city} — الفرع الرئيسي`,
                  city: matchedProject.city,
                },
              },
            }
          : {}),
        themeId,
        activeTheme: themeId,
        currency: 'YER',
      }
    : {
        ...tenantContext.tenant,
        ...(db.tenant || {}),
        themeId,
        contact: db.tenant?.contact || tenantContext.tenant.contact,
        homeSections: db.tenant?.homeSections || tenantContext.tenant.homeSections,
      };

  const activeFeatures = isAlternateTenant
    ? buildFeatureFlagsFromList(
        resolveEffectiveFeatures(matchedProject?.enabledFeatures || tenantContext.activeFeatureIds)
      )
    : db.features;

  const rawProducts = db.products;
  const products = rawProducts.filter(
    (p) =>
      p.visibilityStatus !== 'warehouse_only' &&
      p.visibilityStatus !== 'archived' &&
      p.isPublished !== false
  );
  const categories = db.categories;

  const showDemoPanel = searchParams.demo === 'panel';

  return (
    <StorefrontProvider
      tenant={tenantData}
      features={activeFeatures}
      products={products}
      categories={categories}
      blocksData={blocksData}
      platformMeta={db.platformMeta}
      branches={db.branches || []}
      shippingZones={db.shippingZones || []}
      initialCurrency={tenantData.currency || 'YER'}
    >
      {showDemoPanel && <DemoSimulatorGate />}
      <ThemeHost themeId={themeId} />
    </StorefrontProvider>
  );
}

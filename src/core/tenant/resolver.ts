/**
 * SAMIQ Tenant Context & Resolver
 * Handles domain/slug routing, feature flags resolution, and tenant profile
 */

import { CurrencyCode } from '../currency/formatter';
import { FEATURES_REGISTRY, resolveEffectiveFeatures } from '../features/registry';

export interface TenantProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  themeId: string;
  defaultCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  noindex: boolean;
  city: string;
  deliveryCoverage: string;
  instagram?: string;
  heroBadge?: string;
}

export interface ResolvedTenantContext {
  tenant: TenantProfile;
  activeFeatureIds: string[];
  isFeatureEnabled: (featureId: string) => boolean;
  mode: 'shared' | 'single';
}

/**
 * Default Seed Tenant: "مفتاح الجمال — لكشف المقلد"
 * Primary pilot merchant for SAMIQ platform
 */
export const DEFAULT_PILOT_TENANT: TenantProfile = {
  id: '11111111-1111-1111-1111-111111111111',
  slug: 'miftah',
  name: 'مفتاح الجمال',
  tagline: 'بوابتك الموثوقة لعالم الجمال',
  legalName: 'مفتاح الجمال — لكشف المقلد',
  phone: '967775234989',
  whatsapp: '967775234989',
  email: 'contact@miftah-beauty.ye',
  themeId: 'luxury-noir',
  defaultCurrency: 'YER',
  supportedCurrencies: ['YER', 'SAR', 'USD'],
  noindex: true, // Pilot flag: Keep unindexed until merchant approves
  city: 'صنعاء',
  deliveryCoverage: 'توصيل فوري لجميع مديريات صنعاء وشحن آمن لكافة المحافظات',
  instagram: 'miftah_beauty',
  heroBadge: 'مضمون أصلي 100%',
};

export const DEFAULT_PILOT_FEATURES = [
  'tier_1_static',
  'tier_2_editable',
  'tier_3_catalog',
  'cart_whatsapp',
  'authenticity_guide',
  'skin_routine_advisor',
  'ai_chatbot',
];

/**
 * Resolves tenant profile and active features given hostname or query slug
 */
export function resolveTenant(slugOrDomain?: string): ResolvedTenantContext {
  const mode = (process.env.TENANT_MODE as 'shared' | 'single') || 'shared';

  // For the initial pilot phase, we resolve to Miftah
  const tenant = DEFAULT_PILOT_TENANT;
  const rawFeatures = DEFAULT_PILOT_FEATURES;
  const effectiveFeatureIds = resolveEffectiveFeatures(rawFeatures);
  const featureSet = new Set(effectiveFeatureIds);

  return {
    tenant,
    activeFeatureIds: effectiveFeatureIds,
    isFeatureEnabled: (id: string) => featureSet.has(id),
    mode,
  };
}

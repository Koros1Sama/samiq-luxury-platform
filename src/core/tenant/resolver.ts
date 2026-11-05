/**
 * SAMIQ Tenant Context & Resolver
 * Handles domain/slug routing, feature flags resolution, and tenant profile
 */

import { CurrencyCode } from '../currency/formatter';
import { resolveEffectiveFeatures } from '../features/registry';
import { Section, TenantContactInfo, ThemeId } from '@/themes/contract';

export interface TenantProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  themeId: ThemeId;
  defaultCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
  noindex: boolean;
  city: string;
  deliveryCoverage: string;
  instagram?: string;
  heroBadge?: string;
  heroImages?: {
    noir?: string;
    ivory?: string;
    clinic?: string;
    [key: string]: string | undefined;
  };
  contact: TenantContactInfo;
  homeSections: Section[];
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
  tagline: 'بوابتك الموثوقة لعالم الجمال الأصلي في اليمن',
  legalName: 'مفتاح الجمال — لكشف المقلد',
  phone: '775234989',
  whatsapp: '775234989',
  email: 'contact@miftah-beauty.ye',
  themeId: 'luxury-noir',
  defaultCurrency: 'YER',
  supportedCurrencies: ['YER', 'SAR', 'USD'],
  noindex: true,
  city: 'صنعاء',
  deliveryCoverage: 'توصيل فوري لجميع مديريات صنعاء وشحن آمن لكافة المحافظات',
  instagram: '@tamifttah',
  heroBadge: 'مضمون أصلي 100%',
  heroImages: {
    noir: '/media/hero/hero-noir.jpg',
    ivory: '/media/hero/hero-ivory.jpg',
    clinic: '/media/hero/hero-clinic.jpg',
  },
  contact: {
    whatsapp: '775234989',
    phone: '775234989',
    social: {
      tiktok: 'https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0',
      instagram: 'https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53',
      facebook: 'https://www.facebook.com/share/1XjEnK4CeM/',
      tiktokHandle: '@tamiffttah',
      instagramHandle: '@tamifttah',
    },
    map: {
      url: 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: 'صنعاء',
    },
  },
  homeSections: [
    { id: 'sec-hero', type: 'hero', visible: true },
    { id: 'sec-products', type: 'product-grid', visible: true },
    {
      id: 'sec-authenticity',
      type: 'block',
      props: { blockKey: 'authenticity-compare' },
      visible: true,
      requiresFeature: 'authenticity_guide',
    },
    { id: 'sec-categories', type: 'category-grid', visible: true },
    {
      id: 'sec-skin-routine',
      type: 'block',
      props: { blockKey: 'skin-routine' },
      visible: true,
      requiresFeature: 'skin_routine_advisor',
    },
    { id: 'sec-contact', type: 'contact', visible: true },
  ],
};

/**
 * Dev Acceptance Check Fake Tenant: "مطعم ومشاوي السرايا"
 * Proves that themes are 100% industry-agnostic and data-driven
 */
export const DEMO_RESTAURANT_TENANT: TenantProfile = {
  id: '22222222-2222-2222-2222-222222222222',
  slug: 'demo-restaurant',
  name: 'مطعم ومشاوي السرايا',
  tagline: 'أشهى المأكولات والمشاوي الشامية واليمنية الفاخرة',
  legalName: 'شركة السرايا للضيافة والمطاعم الفاخرة',
  phone: '777000111',
  whatsapp: '777000111',
  email: 'contact@saraya-restaurant.ye',
  themeId: 'luxury-noir',
  defaultCurrency: 'YER',
  supportedCurrencies: ['YER', 'SAR', 'USD'],
  noindex: true,
  city: 'صنعاء',
  deliveryCoverage: 'توصيل ساخن وسريع لجميع مناطق صنعاء',
  heroBadge: 'طازج وشهي 100%',
  contact: {
    whatsapp: '777000111',
    phone: '777000111',
    social: {
      facebook: 'https://facebook.com/saraya',
    },
    map: {
      url: 'https://maps.google.com',
      label: 'فرع حدة — شارع الرويشان',
      city: 'صنعاء',
    },
  },
  homeSections: [
    { id: 'sec-hero', type: 'hero', visible: true },
    { id: 'sec-categories', type: 'category-grid', visible: true },
    { id: 'sec-products', type: 'product-grid', visible: true },
    { id: 'sec-contact', type: 'contact', visible: true },
  ],
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

  // Template variation for Miftah Ivory Journal
  if (slugOrDomain === 'miftah-ivory') {
    const tenant: TenantProfile = {
      ...DEFAULT_PILOT_TENANT,
      tagline: 'المجلة التحريرية ودليل العناية الفاخرة لكشف المقلد',
      themeId: 'ivory-journal',
    };
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

  // Template variation for Miftah Clinic Lab
  if (slugOrDomain === 'miftah-clinic') {
    const tenant: TenantProfile = {
      ...DEFAULT_PILOT_TENANT,
      tagline: 'المختبر السريري التخصصي لفحص الأصالة وكشف المقلد',
      themeId: 'clinic-lab',
    };
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

  // Default to Miftah pilot tenant (Luxury Noir)
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

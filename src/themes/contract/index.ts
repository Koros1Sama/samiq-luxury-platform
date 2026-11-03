/**
 * SAMIQ Theme Contract
 * Pure presentational interface definitions for storefront themes.
 *
 * STRICT ARCHITECTURAL RULE:
 * Themes MUST NOT import Supabase, database clients, or server actions.
 * They consume only typed properties defined in this contract.
 */

export type ThemeCurrencyCode = 'YER' | 'SAR' | 'USD';

export type SamiqThemeId = 'luxury-noir' | 'editorial-ivory' | 'emerald-botanical';

export interface ThemeMeta {
  id: SamiqThemeId;
  nameAr: string;
  nameEn: string;
  paletteDescription: string;
  primaryColor: string;
  accentColor: string;
  badge: string;
}

export const SAMIQ_THEMES: Record<SamiqThemeId, ThemeMeta> = {
  'luxury-noir': {
    id: 'luxury-noir',
    nameAr: 'أسود رخامي فاخر (Luxury Noir)',
    nameEn: 'Luxury Noir',
    paletteDescription: 'الأسود الساحر مع الذهب الملكي وإضاءات الهالو السينمائية',
    primaryColor: '#070709',
    accentColor: '#C9A84C',
    badge: 'الأكثر فخامة',
  },
  'editorial-ivory': {
    id: 'editorial-ivory',
    nameAr: 'حرير عاجي تحريري (Editorial Ivory)',
    nameEn: 'Editorial Ivory',
    paletteDescription: 'حرير عاجي دافئ، نصوص إسبريسو، ولمسات شامبانيا عيادات التجميل السويسرية',
    primaryColor: '#FAF7F2',
    accentColor: '#B8860B',
    badge: 'طابع المجلات العالمية',
  },
  'emerald-botanical': {
    id: 'emerald-botanical',
    nameAr: 'زمرد نباتي ملكي (Emerald Botanical)',
    nameEn: 'Emerald Botanical',
    paletteDescription: 'الأخضر الزمردي العميق مع الذهب المصقول للمنتجات العضوية والطبيعية',
    primaryColor: '#061410',
    accentColor: '#D4AF37',
    badge: 'للمستحضرات العضوية',
  },
};


export interface TenantBrandInfo {
  id: string;
  name: string;
  tagline: string;
  legalName: string;
  whatsapp: string;
  phone: string;
  city: string;
  deliveryCoverage: string;
  heroBadge?: string;
  instagram?: string;
  noindex?: boolean;
}

export interface FeatureFlags {
  tier_1_static: boolean;
  tier_2_editable: boolean;
  tier_3_catalog: boolean;
  cart_whatsapp: boolean;
  authenticity_guide: boolean;
  skin_routine_advisor: boolean;
  customer_accounts: boolean;
  payment_gateways: boolean;
  ai_chatbot: boolean;
  whatsapp_channel: boolean;
  telegram_channel: boolean;
  [key: string]: boolean;
}

export interface ProductVariantData {
  id: string;
  title: string;
  shadeCode?: string;
  inStock: boolean;
}

export interface ProductCardData {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  categorySlug: string;
  image: string;
  prices: Record<ThemeCurrencyCode, number>;
  comparePrices?: Record<ThemeCurrencyCode, number>;
  isAuthenticGuaranteed: boolean;
  isFeatured?: boolean;
  badge?: string;
  variants?: ProductVariantData[];
  description?: string;
}

export interface CartItem {
  id: string; // unique item key
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  unitPrice: Record<ThemeCurrencyCode, number>;
  quantity: number;
  image: string;
}

export interface AuthenticityCheckPoint {
  title: string;
  originalFeature: string;
  fakeRisk: string;
}

export interface AuthenticityComparisonData {
  productId: string;
  productTitle: string;
  brand: string;
  original: {
    title: string;
    image: string;
    batchCode: string;
    formulaNotes: string;
    packagingNotes: string;
  };
  counterfeit: {
    title: string;
    image: string;
    batchCode: string;
    formulaNotes: string;
    packagingNotes: string;
  };
  checklist: AuthenticityCheckPoint[];
  videoUrl?: string;
}

export interface SkinTypeRoutine {
  id: 'oily' | 'dry' | 'sensitive';
  label: string;
  icon: string;
  tagline: string;
  routineDescription: string;
  steps: string[];
  recommendedProductIds: string[];
  activeIngredientIds: string[];
}

export interface ActiveIngredientDetail {
  id: string;
  nameEn: string;
  nameAr: string;
  iconType: 'citrus' | 'drop' | 'molecule';
  benefitsAr: string;
  concentration: string;
}

export interface SkinRoutineData {
  title: string;
  subtitle: string;
  skinTypes: SkinTypeRoutine[];
  ingredients: ActiveIngredientDetail[];
}

export interface CategoryBentoItem {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  image: string;
  ctaText: string;
  href: string;
  badge?: string;
}

export interface StorefrontProps {
  tenant: TenantBrandInfo;
  features: FeatureFlags;
  initialCurrency?: ThemeCurrencyCode;
  initialTheme?: SamiqThemeId;
  products: ProductCardData[];
  categories: CategoryBentoItem[];
  authenticityGuide: AuthenticityComparisonData;
  skinRoutine: SkinRoutineData;
}

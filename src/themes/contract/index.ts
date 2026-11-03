/**
 * SAMIQ Theme Contract
 * Pure presentational interface definitions for storefront themes.
 *
 * STRICT ARCHITECTURAL RULE:
 * Themes MUST NOT import Supabase, database clients, or server actions.
 * They consume only typed properties defined in this contract.
 */

export type ThemeCurrencyCode = 'YER' | 'SAR' | 'USD';

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
  products: ProductCardData[];
  categories: CategoryBentoItem[];
  authenticityGuide: AuthenticityComparisonData;
  skinRoutine: SkinRoutineData;
}

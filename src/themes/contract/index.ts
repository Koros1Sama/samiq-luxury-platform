import React from 'react';

/**
 * SAMIQ Theme Contract
 * Pure presentational interface definitions for storefront themes.
 *
 * STRICT ARCHITECTURAL RULE:
 * Themes MUST NOT import Supabase, database clients, or server actions.
 * They consume only typed properties defined in this contract and via useStorefront().
 */

export type ThemeCurrencyCode = 'YER' | 'SAR' | 'USD';

export type ThemeId = 'luxury-noir' | 'ivory-journal' | 'clinic-lab';

export interface ThemeMeta {
  id: ThemeId;
  nameAr: string;
  nameEn: string;
  paletteDescription: string;
  primaryColor: string;
  accentColor: string;
  badge?: string;
}

export const SAMIQ_THEMES: Record<ThemeId, ThemeMeta> = {
  'luxury-noir': {
    id: 'luxury-noir',
    nameAr: 'مفتاح الجمال — أسود رخامي فاخر (Luxury Noir)',
    nameEn: 'Luxury Noir',
    paletteDescription: 'الأسود الساحر مع الذهب الملكي وإضاءات الهالو السينمائية لمفتاح الجمال',
    primaryColor: '#070709',
    accentColor: '#C9A84C',
    badge: 'الأكثر فخامة',
  },
  'ivory-journal': {
    id: 'ivory-journal',
    nameAr: 'مفتاح الجمال — حرير عاجي تحريري (Ivory Journal)',
    nameEn: 'Ivory Journal',
    paletteDescription: 'حرير عاجي دافئ، نصوص إسبريسو، ولمسات شامبانيا المجلات التحريرية لمفتاح الجمال',
    primaryColor: '#FAF7F2',
    accentColor: '#B8860B',
    badge: 'طابع المجلات العالمية',
  },
  'clinic-lab': {
    id: 'clinic-lab',
    nameAr: 'مفتاح الجمال — مختبر سريري نقي (Clinic Lab)',
    nameEn: 'Clinic Lab',
    paletteDescription: 'الأبيض والضباب الهادئ مع تركواز كلينيكال عميق لفحص الأصالة وكشف المقلد لمفتاح الجمال',
    primaryColor: '#FFFFFF',
    accentColor: '#0F4C4A',
    badge: 'مخبري معتمد',
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'luxury-noir';

export function isValidThemeId(themeId: string): themeId is ThemeId {
  return themeId in SAMIQ_THEMES;
}

export function resolveThemeId(requestedThemeId?: string | null): ThemeId {
  if (requestedThemeId && isValidThemeId(requestedThemeId)) {
    return requestedThemeId;
  }
  return DEFAULT_THEME_ID;
}

// Generic Section Types
export type SectionType =
  | 'hero'
  | 'category-grid'
  | 'product-grid'
  | 'feature-strip'
  | 'rich-text'
  | 'gallery'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'block';

export interface Section {
  id: string;
  type: SectionType;
  props?: Record<string, unknown>;
  visible: boolean;
  requiresFeature?: string;
}

export interface SectionComponentProps {
  section: Section;
}

export interface BlockRendererProps {
  blockKey: string;
  data?: unknown;
  props?: Record<string, unknown>;
}

export type SectionRenderers = Partial<Record<SectionType, React.ComponentType<SectionComponentProps>>> & {
  blocks?: Record<string, React.ComponentType<BlockRendererProps>>;
};

export interface PlatformMeta {
  platformNameAr: string;
  platformNameEn: string;
  taglineAr: string;
  developerTelegramHandle: string;
  developerTelegramUrl: string;
  showcasePath: string;
}

export interface TenantSocialChannels {
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  tiktokHandle?: string;
  instagramHandle?: string;
  [key: string]: string | undefined;
}

export interface TenantMapLocation {
  url: string;
  label: string;
  city: string;
}

export interface TenantContactInfo {
  whatsapp: string;
  phone: string;
  social: TenantSocialChannels;
  map: TenantMapLocation;
}

export interface TenantBrandInfo {
  id: string;
  name: string;
  tagline: string;
  legalName: string;
  city: string;
  deliveryCoverage: string;
  heroBadge?: string;
  themeId?: ThemeId;
  heroImages?: {
    noir?: string;
    ivory?: string;
    clinic?: string;
    [key: string]: string | undefined;
  };
  noindex?: boolean;
  contact: TenantContactInfo;
  homeSections: Section[];
  platformMeta?: PlatformMeta;
  // Direct shortcuts for convenience
  whatsapp?: string;
  phone?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  googleMaps?: string;
}

export interface FeatureFlags {
  tier_1_static: boolean;
  tier_2_editable: boolean;
  tier_3_catalog: boolean;
  cart_whatsapp: boolean;
  customer_accounts: boolean;
  payment_gateways: boolean;
  ai_chatbot: boolean;
  whatsapp_channel: boolean;
  telegram_channel: boolean;
  smart_tags_ai?: boolean;
  [key: string]: boolean | undefined;
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
  images?: string[];
  prices: Record<ThemeCurrencyCode, number>;
  comparePrices?: Record<ThemeCurrencyCode, number>;
  isAuthenticGuaranteed?: boolean;
  isFeatured?: boolean;
  badge?: string;
  variants?: ProductVariantData[];
  description?: string;
  tags?: string[];
  skinTypes?: ('oily' | 'dry' | 'combination' | 'sensitive' | 'all')[];
  aiCategoryConfidence?: number;
  visibilityStatus?: 'published' | 'warehouse_only' | 'coming_soon' | 'archived';
  isPublished?: boolean;
  stockQuantity?: number;
  lowStockThreshold?: number;
  inStock?: boolean;
  sku?: string;
  costPriceYer?: number;
  batchCode?: string;
  concentration?: string;
  keyIngredients?: string[];
  usageInstructions?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  unitPrice: Record<ThemeCurrencyCode, number>;
  quantity: number;
  image: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle?: string;
  brand?: string;
  image: string;
  ctaText: string;
  href: string;
  badge?: string;
}

export type CategoryBentoItem = CategoryItem;

export interface StorefrontCart {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: ProductCardData, variantId?: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export interface StorefrontWishlist {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export interface StorefrontSearch {
  query: string;
  setQuery: (q: string) => void;
  results: ProductCardData[];
}

export interface StorefrontWhatsApp {
  orderUrl: (items: CartItem[]) => string;
  productUrl: (product: ProductCardData) => string;
}

export interface StorefrontContextValue {
  tenant: TenantBrandInfo;
  features: FeatureFlags;
  products: ProductCardData[];
  categories: CategoryItem[];
  currency: ThemeCurrencyCode;
  setCurrency: (currency: ThemeCurrencyCode) => void;
  formatPrice: (prices: Record<ThemeCurrencyCode, number> | number) => string;
  cart: StorefrontCart;
  wishlist: StorefrontWishlist;
  search: StorefrontSearch;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  availableTags: { tag: string; count: number }[];
  whatsapp: StorefrontWhatsApp;
  platformMeta?: PlatformMeta;
  blocksData: Record<string, unknown>;
  setFeatures?: (features: FeatureFlags) => void;
}

export interface ThemeLayoutProps {
  content?: Record<string, unknown>;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  Layout: React.ComponentType<ThemeLayoutProps>;
}

// Deprecated alias for backwards compatibility during migration
export type SamiqThemeId = ThemeId;

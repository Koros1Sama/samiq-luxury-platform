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

export type ThemeId = 'luxury-noir' | 'ivory-journal';

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
    nameAr: 'أسود رخامي فاخر (Luxury Noir)',
    nameEn: 'Luxury Noir',
    paletteDescription: 'الأسود الساحر مع الذهب الملكي وإضاءات الهالو السينمائية',
    primaryColor: '#070709',
    accentColor: '#C9A84C',
    badge: 'الأكثر فخامة',
  },
  'ivory-journal': {
    id: 'ivory-journal',
    nameAr: 'حرير عاجي تحريري (Ivory Journal)',
    nameEn: 'Ivory Journal',
    paletteDescription: 'حرير عاجي دافئ، نصوص إسبريسو، ولمسات شامبانيا عيادات التجميل السويسرية',
    primaryColor: '#FAF7F2',
    accentColor: '#B8860B',
    badge: 'طابع المجلات العالمية',
  },
};

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
  noindex?: boolean;
  contact: TenantContactInfo;
  homeSections: Section[];
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
  isAuthenticGuaranteed?: boolean;
  isFeatured?: boolean;
  badge?: string;
  variants?: ProductVariantData[];
  description?: string;
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
  whatsapp: StorefrontWhatsApp;
  blocksData: Record<string, unknown>;
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

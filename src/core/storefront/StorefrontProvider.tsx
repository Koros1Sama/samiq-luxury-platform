'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  StorefrontContextValue,
  TenantBrandInfo,
  FeatureFlags,
  ProductCardData,
  CategoryItem,
  ThemeCurrencyCode,
  ThemeId,
  isValidThemeId,
  CartItem,
  PlatformMeta,
} from '@/themes/contract';
import {
  BrandPalette,
  ResolvedThemePalette,
  resolveThemePalette,
  getClientActiveTheme,
  getClientCustomPalette,
} from './themePalette';

const DEFAULT_PLATFORM_META: PlatformMeta = {
  platformNameAr: 'سَامِق',
  platformNameEn: 'SAMIQ',
  taglineAr: 'منصة هندسة المتاجر الرقمية الفاخرة والذكاء الاصطناعي',
  developerTelegramHandle: 'KorosSenpai',
  developerTelegramUrl: 'https://t.me/KorosSenpai',
  showcasePath: '/samiq',
};

export const DEFAULT_STOREFRONT_TENANT: TenantBrandInfo = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'مفتاح الجمال',
  tagline: 'لكشف المقلد ومجلة العناية الفاخرة',
  legalName: 'مفتاح الجمال للتجارة والعناية',
  city: 'صنعاء',
  deliveryCoverage: 'كافة محافظات الجمهورية اليمنية',
  themeId: 'luxury-noir',
  activeTheme: 'luxury-noir',
  currency: 'YER',
  exchangeRates: {
    usdToYer: 550,
    sarToYer: 145,
    usdToSar: 3.75,
  },
  whatsapp: '775234989',
  phone: '775234989',
  googleMaps: 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
  announcementText: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية',
  homeSections: [],
  contact: {
    whatsapp: '775234989',
    phone: '775234989',
    social: {
      tiktok: 'tamifttah',
      instagram: 'tamifttah',
      facebook: 'tamifttah',
    },
    map: {
      url: 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: 'صنعاء',
    },
  },
};

export const DEFAULT_STOREFRONT_FEATURES: FeatureFlags = {
  tier_1_static: true,
  tier_2_editable: true,
  tier_3_catalog: true,
  cart_whatsapp: true,
  customer_accounts: true,
  payment_gateways: true,
  ai_chatbot: true,
  whatsapp_channel: true,
  telegram_channel: true,
  authenticity_guide: true,
  blog: true,
  bookings: true,
  coupons: true,
  delivery_zones: true,
  second_language: true,
  pwa_app: true,
  multi_branch: true,
  reviews_ratings: true,
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

const STORAGE_KEYS = {
  cart: 'samiq_cart_items',
  wishlist: 'samiq_wishlist_ids',
  currency: 'samiq_user_currency',
};

interface StorefrontProviderProps {
  tenant?: TenantBrandInfo;
  features?: FeatureFlags;
  products?: ProductCardData[];
  categories?: CategoryItem[];
  blocksData?: Record<string, unknown>;
  initialCurrency?: ThemeCurrencyCode;
  platformMeta?: PlatformMeta;
  branches?: any[];
  shippingZones?: any[];
  children: React.ReactNode;
}

export function StorefrontProvider({
  tenant = DEFAULT_STOREFRONT_TENANT,
  features = DEFAULT_STOREFRONT_FEATURES,
  products = [],
  categories = [],
  blocksData = {},
  initialCurrency = 'YER',
  platformMeta,
  branches = [],
  shippingZones = [],
  children,
}: StorefrontProviderProps) {
  // 0. Features state with live reactive capability
  const [featuresState, setFeaturesState] = useState<FeatureFlags>(features);
  useEffect(() => {
    setFeaturesState(features);
  }, [features]);

  const updateFeatures = useCallback((newFeatures: FeatureFlags) => {
    setFeaturesState((prev) => ({
      ...prev,
      ...newFeatures,
    }));
  }, []);

  // Theme & Chameleon Palette State
  const initialThemeId = (tenant.themeId || (tenant as any).activeTheme || 'luxury-noir') as ThemeId;
  const [activeTheme, setActiveThemeState] = useState<ThemeId>(initialThemeId);
  const [customPalette, setCustomPaletteState] = useState<BrandPalette | null>(
    (tenant as any).brandPalette || null
  );

  // Bilingual Locale State
  const [locale, setLocaleState] = useState<'ar' | 'en'>('ar');

  // Injected shipping zones
  useEffect(() => {
    if (typeof window !== 'undefined' && shippingZones && shippingZones.length > 0) {
      (window as any).__SAMIQ_SHIPPING_ZONES__ = shippingZones;
    }
  }, [shippingZones]);

  // 1. Currency State: Strictly merchant-driven by tenant.currency (defaulting to 'YER')
  const storeCurrency = (tenant.currency || initialCurrency || 'YER') as ThemeCurrencyCode;
  const [currency, setCurrencyState] = useState<ThemeCurrencyCode>(storeCurrency);

  // Synchronize store currency whenever tenant configuration updates
  useEffect(() => {
    if (tenant.currency && ['YER', 'SAR', 'USD'].includes(tenant.currency)) {
      setCurrencyState(tenant.currency as ThemeCurrencyCode);
    }
  }, [tenant.currency]);

  // 2. Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileTab, setMobileTabState] = useState<'home' | 'catalog' | 'authenticity' | 'routine'>('home');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const qTab = params.get('tab');
        if (qTab === 'catalog' || qTab === 'authenticity' || qTab === 'routine' || qTab === 'home') {
          setMobileTabState(qTab);
        }
      } catch {}
    }
  }, []);

  const setMobileTab = useCallback((tab: 'home' | 'catalog' | 'authenticity' | 'routine') => {
    setMobileTabState(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Demo Mode State (?demo=1 or sessionStorage 'samiq_demo_mode')
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const hasParam = window.location.search.includes('demo=1');
        const sessionActive = sessionStorage.getItem('samiq_demo_mode') === 'true';
        if (hasParam) {
          sessionStorage.setItem('samiq_demo_mode', 'true');
          setIsDemoMode(true);
        } else if (sessionActive) {
          setIsDemoMode(true);
        }
      } catch {}
    }
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('samiq_demo_mode');
        const url = new URL(window.location.href);
        if (url.searchParams.has('demo')) {
          url.searchParams.delete('demo');
          window.history.replaceState({}, '', url.toString());
        }
      } catch {}
    }
  }, []);

  // 3. Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // 4. Search & Category Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // 5. Smart Tags Computed Available List (sorted by frequency, top 10)
  const availableTags = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.tags && Array.isArray(p.tags)) {
        for (const t of p.tags) {
          counts[t] = (counts[t] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [products]);

  // SSR hydration guard: Load from localStorage only on client mount
  useEffect(() => {
    try {
      // 1. Theme
      const clientTheme = getClientActiveTheme(initialThemeId);
      if (clientTheme) {
        setActiveThemeState(clientTheme);
      }

      const handleThemeChanged = (e: any) => {
        if (e.detail && typeof e.detail === 'string') {
          setActiveThemeState(e.detail as ThemeId);
        }
      };
      window.addEventListener('samiq_theme_changed', handleThemeChanged);

      // 2. Custom Palette
      const clientPalette = getClientCustomPalette();
      if (clientPalette) {
        setCustomPaletteState(clientPalette);
      }

      const handlePaletteChanged = (e: any) => {
        setCustomPaletteState(e.detail || null);
      };
      window.addEventListener('samiq_custom_palette_changed', handlePaletteChanged);

      // 3. Locale
      const savedLocale = localStorage.getItem('samiq_locale') as 'ar' | 'en';
      if (savedLocale === 'ar' || savedLocale === 'en') {
        setLocaleState(savedLocale);
      }

      // Clear any legacy customer-selected currency overrides
      try {
        localStorage.removeItem(STORAGE_KEYS.currency);
        localStorage.removeItem('samiq_currency');
      } catch {}

      const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        const reconciledCart = parsedCart.map((item) => {
          const liveProduct = products.find((p) => p.id === item.productId);
          if (!liveProduct) return item;
          return {
            ...item,
            title: liveProduct.title,
            image: liveProduct.image,
            unitPrice: liveProduct.prices,
          };
        });
        setCartItems(reconciledCart);
      }

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.wishlist);
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }

      return () => {
        window.removeEventListener('samiq_theme_changed', handleThemeChanged);
        window.removeEventListener('samiq_custom_palette_changed', handlePaletteChanged);
      };
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, [initialThemeId]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = locale === 'en' ? 'ltr' : 'rtl';
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setActiveTheme = useCallback((themeId: ThemeId) => {
    setActiveThemeState(themeId);
    try {
      localStorage.setItem('samiq_demo_theme', themeId);
      localStorage.setItem('samiq_active_theme', themeId);
      if (typeof document !== 'undefined') {
        document.cookie = `samiq_active_theme=${themeId}; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `samiq_demo_theme=${themeId}; path=/; max-age=31536000; SameSite=Lax`;
      }
      window.dispatchEvent(new CustomEvent('samiq_theme_changed', { detail: themeId }));
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
  }, []);

  const setCustomPalette = useCallback((p: BrandPalette | null) => {
    setCustomPaletteState(p);
    try {
      if (p) {
        localStorage.setItem('samiq_custom_palette', JSON.stringify(p));
      } else {
        localStorage.removeItem('samiq_custom_palette');
      }
      window.dispatchEvent(new CustomEvent('samiq_custom_palette_changed', { detail: p }));
    } catch (e) {
      console.warn('Could not save custom palette to localStorage:', e);
    }
  }, []);

  const setLocale = useCallback((newLocale: 'ar' | 'en') => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('samiq_locale', newLocale);
      window.dispatchEvent(new CustomEvent('samiq_locale_changed', { detail: newLocale }));
    } catch (e) {
      console.warn('Could not save locale to localStorage:', e);
    }
  }, []);

  const palette = useMemo(
    () => resolveThemePalette(activeTheme, customPalette),
    [activeTheme, customPalette]
  );

  const setCurrency = useCallback((newCurrency: ThemeCurrencyCode) => {
    setCurrencyState(newCurrency);
    // Currency is strictly merchant-authoritative; no customer override in localStorage
  }, []);

  // Sync cart to localStorage
  const persistCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not persist cart to localStorage:', e);
    }
  }, []);

  // Cart operations
  const addToCart = useCallback(
    (product: ProductCardData, variantId?: string) => {
      setCartItems((prev) => {
        const itemKey = `${product.id}-${variantId || 'default'}`;
        const existingIdx = prev.findIndex((i) => i.id === itemKey);

        let nextItems: CartItem[];
        if (existingIdx >= 0) {
          nextItems = [...prev];
          nextItems[existingIdx].quantity += 1;
        } else {
          const variant = product.variants?.find((v) => v.id === variantId);
          const newItem: CartItem = {
            id: itemKey,
            productId: product.id,
            variantId,
            title: product.title,
            variantTitle: variant?.title,
            unitPrice: product.prices,
            quantity: 1,
            image: product.image,
          };
          nextItems = [...prev, newItem];
        }

        persistCart(nextItems);
        return nextItems;
      });
      setIsCartOpen(true);
    },
    [persistCart]
  );

  const setCartItemQty = useCallback(
    (id: string, qty: number) => {
      setCartItems((prev) => {
        const nextItems = prev
          .map((item) => (item.id === id ? { ...item, quantity: qty } : item))
          .filter((item) => item.quantity > 0);
        persistCart(nextItems);
        return nextItems;
      });
    },
    [persistCart]
  );

  const removeCartItem = useCallback(
    (id: string) => {
      setCartItems((prev) => {
        const nextItems = prev.filter((item) => item.id !== id);
        persistCart(nextItems);
        return nextItems;
      });
    },
    [persistCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    persistCart([]);
  }, [persistCart]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.unitPrice[currency] || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems, currency]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Wishlist operations
  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const nextIds = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(nextIds));
      } catch (e) {
        console.warn('Could not save wishlist to localStorage:', e);
      }
      return nextIds;
    });
  }, []);

  const hasInWishlist = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  // Price Formatter (formats according to merchant store currency)
  const formatPrice = useCallback(
    (prices: Record<ThemeCurrencyCode, number> | number) => {
      const amount = typeof prices === 'number' ? prices : (prices[currency] ?? prices.YER ?? 0);
      const formatted = new Intl.NumberFormat('en-US').format(amount);
      const labels: Record<ThemeCurrencyCode, string> = {
        YER: 'ر.ي',
        SAR: 'ر.س',
        USD: '$',
      };
      return `${formatted} ${labels[currency] || currency}`;
    },
    [currency]
  );

  // Dynamic WhatsApp Messages: Uses tenant.name and tenant.contact.whatsapp
  const whatsappNumber = tenant.contact?.whatsapp || tenant.whatsapp || '';
  const tenantName = tenant.name || 'المتجر';

  const buildOrderWhatsAppUrl = useCallback(
    (items: CartItem[]) => {
      if (items.length === 0) {
        return `https://wa.me/${whatsappNumber}`;
      }
      const itemsList = items
        .map((item, idx) => {
          const price = item.unitPrice[currency] || 0;
          const subtotal = price * item.quantity;
          const variantStr = item.variantTitle ? ` (${item.variantTitle})` : '';
          return `${idx + 1}. *${item.title}${variantStr}*\n   الكمية: ${item.quantity} × ${price} ${currency} = ${subtotal} ${currency}`;
        })
        .join('\n\n');

      const message = `مرحباً ${tenantName}، أود تأكيد الطلب التالي من المتجر:\n\n${itemsList}\n\nالإجمالي: *${cartTotal} ${currency}*\n\nيرجى تأكيد التوصيل والفحص عند الاستلام.`;
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    },
    [whatsappNumber, tenantName, currency, cartTotal]
  );

  const buildProductWhatsAppUrl = useCallback(
    (product: ProductCardData) => {
      const price = product.prices[currency] || 0;
      const message = `مرحباً ${tenantName}، أود الاستفسار والطلب للمنتج:\n*${product.title}*\nالسعر: ${price} ${currency}\nهل المنتج متوفر للتسليم الفوري؟`;
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    },
    [whatsappNumber, tenantName, currency]
  );

  const contextValue: StorefrontContextValue = useMemo(
    () => ({
      tenant,
      features: featuresState,
      products,
      categories,
      currency,
      setCurrency,
      formatPrice,
      cart: {
        items: cartItems,
        count: cartCount,
        total: cartTotal,
        add: addToCart,
        setQty: setCartItemQty,
        remove: removeCartItem,
        clear: clearCart,
        isOpen: isCartOpen,
        open: () => setIsCartOpen(true),
        close: () => setIsCartOpen(false),
      },
      wishlist: {
        ids: wishlistIds,
        toggle: toggleWishlist,
        has: hasInWishlist,
      },
      search: {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: searchResults,
      },
      activeCategory,
      setActiveCategory,
      activeTag,
      setActiveTag,
      availableTags,
      whatsapp: {
        orderUrl: buildOrderWhatsAppUrl,
        productUrl: buildProductWhatsAppUrl,
      },
      platformMeta: platformMeta || tenant.platformMeta || DEFAULT_PLATFORM_META,
      blocksData,
      setFeatures: updateFeatures,
      activeTheme,
      setActiveTheme,
      locale,
      setLocale,
      palette,
      customPalette,
      setCustomPalette,
      branches,
      shippingZones,
      mobileTab,
      setMobileTab,
      isDemoMode,
      exitDemoMode,
    }),
    [
      isDemoMode,
      exitDemoMode,
      tenant,
      platformMeta,
      featuresState,
      products,
      categories,
      currency,
      setCurrency,
      formatPrice,
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      setCartItemQty,
      removeCartItem,
      clearCart,
      isCartOpen,
      wishlistIds,
      toggleWishlist,
      hasInWishlist,
      searchQuery,
      searchResults,
      activeCategory,
      activeTag,
      availableTags,
      buildOrderWhatsAppUrl,
      buildProductWhatsAppUrl,
      blocksData,
      updateFeatures,
      activeTheme,
      setActiveTheme,
      locale,
      setLocale,
      palette,
      customPalette,
      setCustomPalette,
      branches,
      shippingZones,
      mobileTab,
      setMobileTab,
    ]
  );

  return <StorefrontContext.Provider value={contextValue}>{children}</StorefrontContext.Provider>;
}

export function useStorefront(): StorefrontContextValue {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error('useStorefront must be used within a StorefrontProvider');
  }
  return context;
}

export function useOptionalStorefront(): StorefrontContextValue | null {
  return useContext(StorefrontContext);
}

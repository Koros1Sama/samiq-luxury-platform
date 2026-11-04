'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  StorefrontContextValue,
  TenantBrandInfo,
  FeatureFlags,
  ProductCardData,
  CategoryItem,
  ThemeCurrencyCode,
  CartItem,
  PlatformMeta,
} from '@/themes/contract';

const DEFAULT_PLATFORM_META: PlatformMeta = {
  platformNameAr: 'سَامِق',
  platformNameEn: 'SAMIQ',
  taglineAr: 'منصة هندسة المتاجر الرقمية الفاخرة والذكاء الاصطناعي',
  developerTelegramHandle: 'KorosSenpai',
  developerTelegramUrl: 'https://t.me/KorosSenpai',
  showcasePath: '/samiq',
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

const STORAGE_KEYS = {
  cart: 'samiq_cart_items',
  wishlist: 'samiq_wishlist_ids',
  currency: 'samiq_user_currency',
};

interface StorefrontProviderProps {
  tenant: TenantBrandInfo;
  features: FeatureFlags;
  products: ProductCardData[];
  categories: CategoryItem[];
  blocksData?: Record<string, unknown>;
  initialCurrency?: ThemeCurrencyCode;
  platformMeta?: PlatformMeta;
  children: React.ReactNode;
}

export function StorefrontProvider({
  tenant,
  features,
  products,
  categories,
  blocksData = {},
  initialCurrency = 'YER',
  platformMeta,
  children,
}: StorefrontProviderProps) {
  // 1. Currency State (hydrated safely in useEffect)
  const [currency, setCurrencyState] = useState<ThemeCurrencyCode>(initialCurrency);

  // 2. Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      const savedCurrency = localStorage.getItem(STORAGE_KEYS.currency) as ThemeCurrencyCode;
      if (savedCurrency && ['YER', 'SAR', 'USD'].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.cart);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      const savedWishlist = localStorage.getItem(STORAGE_KEYS.wishlist);
      if (savedWishlist) {
        setWishlistIds(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, []);

  const setCurrency = useCallback((newCurrency: ThemeCurrencyCode) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem(STORAGE_KEYS.currency, newCurrency);
    } catch (e) {
      console.warn('Could not save currency to localStorage:', e);
    }
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

  // Price Formatter
  const formatPrice = useCallback(
    (prices: Record<ThemeCurrencyCode, number> | number) => {
      const amount = typeof prices === 'number' ? prices : prices[currency] || 0;
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
      features,
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
    }),
    [
      tenant,
      platformMeta,
      features,
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

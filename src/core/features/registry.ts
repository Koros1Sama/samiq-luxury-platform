/**
 * SAMIQ Feature Registry & Modular Engine
 * Manages tiers (Tier 1: $80 -> Tier 2: $130 -> Tier 3: $200) and independent addons (up to $500+)
 * Enforces strict dependency graph validation (requires)
 */

export type FeatureCategory = 'tier' | 'addon' | 'channel' | 'integration' | 'intelligence';

export interface FeatureDefinition {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionAr: string;
  category: FeatureCategory;
  basePriceUsd: number;
  requires: string[];
  minTier?: 'tier_1_static' | 'tier_2_editable' | 'tier_3_catalog';
  iconName?: string;
  recurringCostAnnualUsd?: number;
}

export const FEATURES_REGISTRY: Record<string, FeatureDefinition> = {
  // =========================================================================
  // 1. CUMULATIVE BASE TIERS (category: 'tier') — Each tier includes previous
  // =========================================================================
  tier_1_static: {
    id: 'tier_1_static',
    nameEn: 'Static Landing Page Core',
    nameAr: 'الدرجة 1: باقة الموقع التعريفي الثابت (Static Landing Page)',
    descriptionAr:
      'صفحة موقع فخمة بدون أي منتجات أو كتالوج وبدون لوحة تحكم، تركز على هوية المحل، قصة العلامة، الموقع على الخريطة، أوقات العمل، وزر محادثة واتساب مباشر.',
    category: 'tier',
    basePriceUsd: 80,
    requires: [],
  },
  tier_2_editable: {
    id: 'tier_2_editable',
    nameEn: 'Editable Site + Secret Admin Login',
    nameAr: 'الدرجة 2: باقة الموقع التعريفي القابل للتعديل (Editable Hub)',
    descriptionAr:
      'نفس الموقع التعريفي مع مدخل سري للوحة تحكم المدير بإيميل وكلمة سر لتعديل النصوص، الصور، أوقات الدوام، أرقام التواصل، وترتيب الأقسام في أي وقت.',
    category: 'tier',
    basePriceUsd: 130, // Cumulative: $80 + $50 = $130
    requires: ['tier_1_static'],
    minTier: 'tier_2_editable',
  },
  tier_3_catalog: {
    id: 'tier_3_catalog',
    nameEn: 'Interactive Product Catalog & Admin',
    nameAr: 'الدرجة 3: باقة كتالوج المنتجات والأقسام والوسوم (Interactive Catalog)',
    descriptionAr:
      'إضافة قسم المنتجات، الأقسام، الوسوم، الفلترة الفورية، صفحات تفاصيل المنتجات، 3 أنماط عملات، وإدارة الكتالوج بالكامل من لوحة المدير السرية.',
    category: 'tier',
    basePriceUsd: 200, // Cumulative: $130 + $70 = $200
    requires: ['tier_2_editable'],
    minTier: 'tier_3_catalog',
  },

  // =========================================================================
  // 2. ADD-ONS ON TIER 1 (requires: ['tier_1_static'])
  // =========================================================================
  custom_domain: {
    id: 'custom_domain',
    nameEn: 'Custom Brand Domain Link',
    nameAr: 'ربط دومين خاص رسمي (brand.com بدلاً من samiq.shop)',
    descriptionAr:
      'ربط مباشر بدون تحويل مع شهادة حماية SSL مشفرة وتأمين سحابي عالمي (رسوم حجز النطاق السنوية $20/سنة).',
    category: 'addon',
    basePriceUsd: 15,
    requires: ['tier_1_static'],
    recurringCostAnnualUsd: 20,
  },
  second_language: {
    id: 'second_language',
    nameEn: 'Second Language (Arabic RTL + English LTR)',
    nameAr: 'اللغة الثانية (عربي RTL + إنجليزي LTR)',
    descriptionAr:
      'واجهة ومحتوى متكامل بلغتين مع تبديل فوري للاتجاه وتنسيق طباعي مخصص لكل لغة.',
    category: 'addon',
    basePriceUsd: 35,
    requires: ['tier_1_static'],
  },
  pwa_app: {
    id: 'pwa_app',
    nameEn: 'Installable PWA Mobile App',
    nameAr: 'تطبيق الجوال القابل للتثبيت (PWA App)',
    descriptionAr:
      'تثبيت الموقع كتطبيق جوال مستقل بأيقونة وشاشة تحميل خاصة على أجهزة الزبائن وجوال التاجر.',
    category: 'addon',
    basePriceUsd: 25,
    requires: ['tier_1_static'],
  },
  analytics_stats: {
    id: 'analytics_stats',
    nameEn: 'Traffic & Engagement Analytics',
    nameAr: 'إحصائيات وتقارير الزيارات والمبيعات',
    descriptionAr:
      'لوحة تقارير وإحصائيات دقيقة لعدد الزوار، مصادر الزيارات، والصفحات الأكثر مشاهدة وتفاعلاً.',
    category: 'addon',
    basePriceUsd: 20,
    requires: ['tier_1_static'],
  },

  // =========================================================================
  // 3. ADD-ONS ON TIER 2 (requires: ['tier_2_editable'])
  // =========================================================================
  bookings: {
    id: 'bookings',
    nameEn: 'Appointments & Bookings System',
    nameAr: 'نظام الحجوزات والمواعيد',
    descriptionAr:
      'مناسب للصالونات والعيادات والاستشارات والمطاعم مع إدارة وتأكيد المواعيد وساعات العمل من لوحة المحل.',
    category: 'addon',
    basePriceUsd: 40,
    requires: ['tier_2_editable'],
  },
  blog: {
    id: 'blog',
    nameEn: 'SEO Articles & News Blog',
    nameAr: 'المدونة والأخبار والمقالات (SEO Blog)',
    descriptionAr:
      'نشر مقالات وأخبار ونصائح ترفع تصنيف المتجر وتجلب زواراً مجانيين من محركات بحث جوجل.',
    category: 'addon',
    basePriceUsd: 30,
    requires: ['tier_2_editable'],
  },
  ai_chatbot: {
    id: 'ai_chatbot',
    nameEn: 'On-Site AI Smart Advisor',
    nameAr: 'الدرجة 6: الشات بوت الذكي في الموقع (On-Site AI Advisor)',
    descriptionAr:
      'يرد على استفسارات الزبائن من معلومات ومنتجات الموقع الحقيقية ويعرض بطاقات تفاعلية بالأسعار والروابط ($15/سنة أو حسب الاستهلاك).',
    category: 'intelligence',
    basePriceUsd: 50,
    requires: ['tier_2_editable'],
    recurringCostAnnualUsd: 15,
  },
  telegram_channel: {
    id: 'telegram_channel',
    nameEn: 'AI Telegram Channel Bot',
    nameAr: 'شات بوت منصة تيليجرام (الدرجة 7)',
    descriptionAr:
      'يرد تلقائياً في تيليجرام بصورة المنتج والوصف وسعره وزر رابط مباشر مع تحويل المحادثة للمالك.',
    category: 'channel',
    basePriceUsd: 35,
    requires: ['ai_chatbot'],
  },
  whatsapp_channel: {
    id: 'whatsapp_channel',
    nameEn: 'AI WhatsApp Channel Bot (3 Modes)',
    nameAr: 'شات بوت منصة واتساب بـ 3 أنماط (الدرجة 7)',
    descriptionAr:
      'رد آلي تفاعلي على واتساب ببطاقات المنتجات ويدعم 3 أنماط: أندرويد Webhook مجاني، مسح QR كود، أو Meta Cloud API الرسمي.',
    category: 'channel',
    basePriceUsd: 45,
    requires: ['ai_chatbot'],
  },
  instagram_channel: {
    id: 'instagram_channel',
    nameEn: 'AI Instagram & Messenger Bot',
    nameAr: 'شات بوت منصة إنستغرام وفيسبوك (الدرجة 7)',
    descriptionAr:
      'رد ذكي في رسائل إنستغرام وماسنجر ببطاقات منتجات متتالية (Carousel) وروابط مباشرة.',
    category: 'channel',
    basePriceUsd: 45,
    requires: ['ai_chatbot'],
  },

  // =========================================================================
  // 4. ADD-ONS ON TIER 3 (requires: ['tier_3_catalog'])
  // =========================================================================
  cart_whatsapp: {
    id: 'cart_whatsapp',
    nameEn: 'Smart WhatsApp Cart & Checkout',
    nameAr: 'سلة المشتريات وإتمام الطلب عبر واتساب أو الدفع عند الاستلام',
    descriptionAr:
      'سلة ذكية تحفظ تلقائياً وترسل فاتورة الطلب المنسقة لواتساب المحل وتوثق الطلب في لوحة الإدارة.',
    category: 'addon',
    basePriceUsd: 35,
    requires: ['tier_3_catalog'],
  },
  delivery_zones: {
    id: 'delivery_zones',
    nameEn: 'Delivery Zones & Shipping Rates',
    nameAr: 'مناطق التوصيل ورسومها حسب المدينة أو الحي',
    descriptionAr:
      'تحديد رسوم التوصيل لكل مديرية أو منطقة مع تحديد سقف للطلبات المؤهلة للتوصيل المجاني.',
    category: 'addon',
    basePriceUsd: 20,
    requires: ['cart_whatsapp'],
  },
  coupons: {
    id: 'coupons',
    nameEn: 'Coupons & Discount Promotions',
    nameAr: 'الكوبونات والعروض والخصومات',
    descriptionAr:
      'أكواد خصم بنسبة مئوية أو مبلغ ثابت مع تحديد تاريخ الصلاحية وسقف عدد مرات الاستخدام.',
    category: 'addon',
    basePriceUsd: 20,
    requires: ['cart_whatsapp'],
  },
  owner_notifications: {
    id: 'owner_notifications',
    nameEn: 'Instant Order Alerts for Merchant',
    nameAr: 'إشعارات فورية لصاحب المحل بالطلبات الجديدة',
    descriptionAr:
      'تنبيه فوري على تيليجرام أو واتساب التاجر في نفس اللحظة التي يؤكد فيها الزبون طلبه.',
    category: 'addon',
    basePriceUsd: 20,
    requires: ['cart_whatsapp'],
  },
  payment_gateways: {
    id: 'payment_gateways',
    nameEn: 'Electronic Payments & Local Wallets',
    nameAr: 'الدرجة 5: بوابات الدفع الإلكتروني والمحافظ المحلية',
    descriptionAr:
      'الدفع بالبطاقات والمحافظ الرقمية وتحديث حالة سداد الطلبات تلقائياً في النظام.',
    category: 'integration',
    basePriceUsd: 50,
    requires: ['cart_whatsapp'],
  },
  inventory_variants: {
    id: 'inventory_variants',
    nameEn: 'Inventory Stock & Variants Control',
    nameAr: 'إدارة المخزون والمستودع وخيارات المنتج',
    descriptionAr:
      'تتبع الكميات، الخصم التلقائي، خيارات المنتج (الأحجام/الألوان/المقاسات) وعزل مستودع التاجر عن العرض العام.',
    category: 'addon',
    basePriceUsd: 35,
    requires: ['tier_3_catalog'],
  },
  smart_tags_ai: {
    id: 'smart_tags_ai',
    nameEn: 'AI Smart Tags & Semantic Search',
    nameAr: 'مساعد المنتجات والوسوم الذكية بالذكاء الاصطناعي',
    descriptionAr:
      'تحليل صورة واسم المنتج لاقتراح الوسوم والوصف الاحترافي وترجمته وتجهيز SEO والبحث الدلالي الفوري.',
    category: 'intelligence',
    basePriceUsd: 35,
    requires: ['tier_3_catalog'],
  },
  customer_accounts: {
    id: 'customer_accounts',
    nameEn: 'Customer Auth & Order History',
    nameAr: 'الدرجة 4: حسابات الزبائن والبروفايل وقائمة المفضلة',
    descriptionAr:
      'تسجيل دخول مستقل لكل محل بالإيميل أو الجوال مع ملف شخصي، قائمة مفضلات محفوظة، وسجل للطلبات السابقة.',
    category: 'addon',
    basePriceUsd: 40,
    requires: ['tier_3_catalog'],
  },
  reviews_ratings: {
    id: 'reviews_ratings',
    nameEn: 'Customer Reviews & Ratings',
    nameAr: 'تقييمات ومراجعات المنتجات بالنجوم',
    descriptionAr:
      'تقييمات موثقة من الزبائن المسجلين مع تحكم صاحب المحل بمراجعتها واعتماد ظهورها.',
    category: 'addon',
    basePriceUsd: 20,
    requires: ['customer_accounts'],
  },
  authenticity_guide: {
    id: 'authenticity_guide',
    nameEn: 'Authenticity Lab & Counterfeit Detector',
    nameAr: 'مختبر ودليل كشف المقلد والبحث باسم المنتج',
    descriptionAr:
      'مقارنة تفاعلية بين الأصلي والبدائل، شارة الأصالة، فحص المنتج بالاسم لكشف المقلد، وربط مقاطع الفيديو التوضيحية.',
    category: 'addon',
    basePriceUsd: 35,
    requires: ['tier_3_catalog'],
  },
  skin_routine_advisor: {
    id: 'skin_routine_advisor',
    nameEn: 'Interactive Selection & Routine Advisor',
    nameAr: 'مستشار الاختيار والروتين التفاعلي',
    descriptionAr:
      'أداة تفاعلية تساعد الزبون في اختيار المنتجات الأنسب لاحتياجه ونوع استخدامه مع خريطة بصرية.',
    category: 'addon',
    basePriceUsd: 30,
    requires: ['tier_3_catalog'],
  },
  multi_branch: {
    id: 'multi_branch',
    nameEn: 'Multi-Branch Management',
    nameAr: 'تعدد الفروع للمحل الواحد (Multi-Branch)',
    descriptionAr:
      'إدارة أكثر من فرع للمحل (مثلاً صنعاء، عدن، الرياض) لكل فرع عنوانه، أوقات دوامه، ورقم واتسابه ومخزونه.',
    category: 'addon',
    basePriceUsd: 40,
    requires: ['tier_3_catalog'],
  },
};

export interface PlatformPricingConfig {
  priceMultiplier: number;
  isDiscountEnabled: boolean;
  discountPercent: number;
  customDiscountUsd: number;
  matchOriginalPrice: boolean;
  priceOverrides: Record<string, number>;
  domainTierPrices: {
    subdomain_free: number;
    custom_com: number;
    custom_ye: number;
  };
  firstYearHostingUsd: number;
  annualHostingUsd: number;
  annualAiUsd: number;
}

export const DEFAULT_PRICING_CONFIG: PlatformPricingConfig = {
  priceMultiplier: 1.5,
  isDiscountEnabled: true,
  discountPercent: 25,
  customDiscountUsd: 0,
  matchOriginalPrice: false,
  priceOverrides: {},
  domainTierPrices: {
    subdomain_free: 0,
    custom_com: 20,
    custom_ye: 35,
  },
  firstYearHostingUsd: 0,
  annualHostingUsd: 45,
  annualAiUsd: 90,
};

export interface PricingOptions {
  priceMultiplier?: number;
  isDiscountEnabled?: boolean;
  discountPercent?: number;
  customDiscountUsd?: number;
  matchOriginalPrice?: boolean;
}

export interface PricingResult {
  totalUsd: number;
  subtotalUsd: number;
  discountUsd: number;
  originalSubtotalUsd: number;
  originalTotalUsd: number;
  priceMultiplier: number;
  discountPercent: number;
  isDiscountEnabled: boolean;
  isMatchOriginal: boolean;
  baseTierPriceUsd: number;
  addonsPriceUsd: number;
  selectedTier: string;
  itemizedPrices: Record<string, number>;
}

/**
 * Calculates estimated package investment in USD with optional overrides, multiplier, and discount
 */
export function calculateTierPrice(
  selectedFeatureIds: string[],
  priceOverrides?: Record<string, number>,
  discountUsdOrOptions: number | PricingOptions = 0,
  legacyMultiplier?: number
): PricingResult {
  const options: PricingOptions =
    typeof discountUsdOrOptions === 'number'
      ? {
          customDiscountUsd: discountUsdOrOptions,
          priceMultiplier: legacyMultiplier ?? 1.0,
          isDiscountEnabled: discountUsdOrOptions > 0,
        }
      : discountUsdOrOptions || {};

  const multiplier = Math.max(0.1, options.priceMultiplier ?? 1.0);
  const isDiscountEnabled = options.isDiscountEnabled ?? (options.discountPercent !== undefined ? options.discountPercent > 0 : false);
  const discountPercent = Math.max(0, Math.min(100, options.discountPercent ?? 0));
  const customDiscountUsd = Math.max(0, options.customDiscountUsd ?? 0);
  const matchOriginal = !!options.matchOriginalPrice;

  const selectedSet = new Set(selectedFeatureIds);

  // Determine highest tier selected
  let baseTier = 'tier_1_static';
  let originalBaseTierPrice = priceOverrides?.['tier_1_static'] ?? FEATURES_REGISTRY.tier_1_static.basePriceUsd;

  if (selectedSet.has('tier_3_catalog')) {
    baseTier = 'tier_3_catalog';
    originalBaseTierPrice = priceOverrides?.['tier_3_catalog'] ?? FEATURES_REGISTRY.tier_3_catalog.basePriceUsd;
  } else if (selectedSet.has('tier_2_editable')) {
    baseTier = 'tier_2_editable';
    originalBaseTierPrice = priceOverrides?.['tier_2_editable'] ?? FEATURES_REGISTRY.tier_2_editable.basePriceUsd;
  }

  // Base tier with multiplier (if overridden in priceOverrides, use override as-is; otherwise multiply)
  const isBaseOverridden = priceOverrides?.[baseTier] !== undefined;
  const baseTierPrice = isBaseOverridden ? originalBaseTierPrice : Math.round(originalBaseTierPrice * multiplier);

  const itemized: Record<string, number> = {
    [baseTier]: baseTierPrice,
  };

  // Calculate sum of active addons / channels
  let originalAddonsSum = 0;
  let addonsSum = 0;

  for (const featureId of selectedSet) {
    const feat = FEATURES_REGISTRY[featureId];
    if (feat && feat.category !== 'tier') {
      const isOverridden = priceOverrides?.[featureId] !== undefined;
      const orig = priceOverrides?.[featureId] ?? feat.basePriceUsd;
      const effective = isOverridden ? orig : Math.round(orig * multiplier);
      originalAddonsSum += orig;
      addonsSum += effective;
      itemized[featureId] = effective;
    }
  }

  const originalSubtotal = originalBaseTierPrice + originalAddonsSum;
  const subtotal = baseTierPrice + addonsSum;

  let calculatedDiscount = 0;
  let effectiveDiscountPercent = discountPercent;

  if (isDiscountEnabled) {
    if (matchOriginal) {
      calculatedDiscount = Math.max(0, subtotal - originalSubtotal);
      effectiveDiscountPercent = subtotal > 0 ? Math.round((calculatedDiscount / subtotal) * 100) : 0;
    } else {
      const percentDiscountVal = Math.round((subtotal * discountPercent) / 100);
      calculatedDiscount = Math.min(subtotal, percentDiscountVal + customDiscountUsd);
    }
  }

  const total = Math.max(0, subtotal - calculatedDiscount);

  return {
    totalUsd: total,
    subtotalUsd: subtotal,
    discountUsd: calculatedDiscount,
    originalSubtotalUsd: originalSubtotal,
    originalTotalUsd: originalSubtotal,
    priceMultiplier: multiplier,
    discountPercent: effectiveDiscountPercent,
    isDiscountEnabled,
    isMatchOriginal: matchOriginal,
    baseTierPriceUsd: baseTierPrice,
    addonsPriceUsd: addonsSum,
    selectedTier: baseTier,
    itemizedPrices: itemized,
  };
}

/**
 * Validates dependencies for a set of enabled features
 */
export function validateFeatureDependencies(selectedFeatureIds: string[]): {
  isValid: boolean;
  missingDependencies: Record<string, string[]>;
} {
  const selectedSet = new Set(selectedFeatureIds);
  const missingDependencies: Record<string, string[]> = {};
  let isValid = true;

  for (const featureId of selectedFeatureIds) {
    const def = FEATURES_REGISTRY[featureId];
    if (!def) continue;

    const missingForThis = def.requires.filter((reqId) => !selectedSet.has(reqId));
    if (missingForThis.length > 0) {
      isValid = false;
      missingDependencies[featureId] = missingForThis;
    }
  }

  return { isValid, missingDependencies };
}

/**
 * Automatically includes required prerequisite features
 */
export function resolveEffectiveFeatures(featureIds: string[]): string[] {
  const effective = new Set<string>(featureIds);
  let changed = true;

  while (changed) {
    changed = false;
    for (const featId of Array.from(effective)) {
      const def = FEATURES_REGISTRY[featId];
      if (!def) continue;
      for (const reqId of def.requires) {
        if (!effective.has(reqId)) {
          effective.add(reqId);
          changed = true;
        }
      }
    }
  }

  return Array.from(effective);
}

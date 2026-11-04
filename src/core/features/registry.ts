/**
 * SAMIQ Feature Registry & Modular Engine
 * Manages tiers (Tier 1: $100 -> Tier 3: $450) and independent addons (up to $700+)
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
}

export const FEATURES_REGISTRY: Record<string, FeatureDefinition> = {
  // --- Tiers ---
  tier_1_static: {
    id: 'tier_1_static',
    nameEn: 'Luxury Presence Core',
    nameAr: 'باقة الحضور الرقمي الفاخر (Static Core)',
    descriptionAr: 'واجهة فاخرة فائقة السرعة مع هوية بصرية مخصصة وطلب مباشر عبر واتساب',
    category: 'tier',
    basePriceUsd: 100,
    requires: [],
  },
  tier_2_editable: {
    id: 'tier_2_editable',
    nameEn: 'Editable Merchant Hub',
    nameAr: 'باقة المتجر المرن (Editable Store)',
    descriptionAr: 'لوحة تحكم للمنتجات وتعديل الأسعار والمخزون مع إحصائيات مبسطة',
    category: 'tier',
    basePriceUsd: 250,
    requires: ['tier_1_static'],
    minTier: 'tier_2_editable',
  },
  tier_3_catalog: {
    id: 'tier_3_catalog',
    nameEn: 'Dynamic Multi-Category Catalog',
    nameAr: 'باقة الكتالوج الديناميكي الشامل (Full Catalog)',
    descriptionAr: 'كتالوج متكامل بفلترة سريعة وأقسام متعددة وتدرجات ألوان وأحجام المنتجات',
    category: 'tier',
    basePriceUsd: 450,
    requires: ['tier_2_editable'],
    minTier: 'tier_3_catalog',
  },

  // --- Addons ---
  cart_whatsapp: {
    id: 'cart_whatsapp',
    nameEn: 'Smart WhatsApp Cart',
    nameAr: 'سلة التسوق الذكية الموجهة لواتساب',
    descriptionAr: 'سلة أنيقة تحسب الإجمالي تلقائياً وتبني رسالة واتساب منسقة فورية',
    category: 'addon',
    basePriceUsd: 40,
    requires: ['tier_1_static'],
  },
  authenticity_guide: {
    id: 'authenticity_guide',
    nameEn: 'Authenticity Interactive Slider',
    nameAr: 'مختبر كشف المقلد وفحص الدفعات التفاعلي',
    descriptionAr: 'أداة سحب تفاعلية وفاحص رقم تشغيلة لمطابقة تفاصيل العبوة والقوام والباركود لبناء الثقة المطلقة',
    category: 'addon',
    basePriceUsd: 75,
    requires: ['tier_1_static'],
  },
  skin_routine_advisor: {
    id: 'skin_routine_advisor',
    nameEn: 'Skin Routine & Active Actives Advisor',
    nameAr: 'مستشار روتين العناية ومخطط المكونات الفعالة',
    descriptionAr: 'تحديد نوع البشرة واقتراح الروتين المناسب مع خريطة بصرية لجزيئات المكونات',
    category: 'addon',
    basePriceUsd: 60,
    requires: ['tier_1_static'],
  },
  smart_tags_ai: {
    id: 'smart_tags_ai',
    nameEn: 'AI Smart Multi-Tags & Auto Classification',
    nameAr: 'الوسوم الذكية والتصنيف بالذكاء الاصطناعي (AI Smart Tags)',
    descriptionAr: 'توليد وسوم متعددة الأبعاد تلقائياً بالذكاء الاصطناعي وتصنيف المنتجات حسب مشاكل البشرة والمكونات مع فلترة فورية.',
    category: 'intelligence',
    basePriceUsd: 75,
    requires: ['tier_3_catalog'],
  },
  customer_accounts: {
    id: 'customer_accounts',
    nameEn: 'Customer Hub & Order History',
    nameAr: 'حسابات العملاء وتتبع الطلبات السابقة',
    descriptionAr: 'تسجيل دخول سلس برقم الجوال لمتابعة حالة الشحنات والطلبات السابقة',
    category: 'addon',
    basePriceUsd: 80,
    requires: ['tier_2_editable'],
  },
  payment_gateways: {
    id: 'payment_gateways',
    nameEn: 'Yemeni Electronic Wallets',
    nameAr: 'بوابات الدفع الإلكتروني اليمنية',
    descriptionAr: 'الدفع المباشر عبر الكريمي، جوالي، فلوسك، ون كاش ومحفظة جيب',
    category: 'integration',
    basePriceUsd: 120,
    requires: ['tier_3_catalog'],
  },
  ai_chatbot: {
    id: 'ai_chatbot',
    nameEn: 'AI Beauty & Authenticity Consultant',
    nameAr: 'المستشار الذكي (اسأل خبير لكشف المقلد)',
    descriptionAr: 'شات بوت ذكي يقترح المنتجات المناسبة ويجيب على أسئلة الأصالة باللهجة اليمنية 24/7',
    category: 'addon',
    basePriceUsd: 150,
    requires: ['tier_2_editable'],
  },
  whatsapp_channel: {
    id: 'whatsapp_channel',
    nameEn: 'Interactive WhatsApp Business Bot',
    nameAr: 'قناة بوت الواتساب التفاعلية',
    descriptionAr: 'استقبال الاستفسارات والطلبات آلياً عبر محادثة تطبيق الواتساب مباشرة',
    category: 'channel',
    basePriceUsd: 90,
    requires: ['ai_chatbot'],
  },
  telegram_channel: {
    id: 'telegram_channel',
    nameEn: 'Interactive Telegram Storefront',
    nameAr: 'قناة بوت التيليجرام الذكي',
    descriptionAr: 'تصفح الكتالوج والطلب المباشر من خلال تطبيق التيليجرام',
    category: 'channel',
    basePriceUsd: 50,
    requires: ['tier_2_editable'],
  },
};

/**
 * Calculates estimated package investment in USD
 */
export function calculateTierPrice(selectedFeatureIds: string[]): {
  totalUsd: number;
  baseTierPriceUsd: number;
  addonsPriceUsd: number;
  selectedTier: string;
} {
  const selectedSet = new Set(selectedFeatureIds);

  // Determine highest tier selected
  let baseTier = 'tier_1_static';
  let baseTierPrice = FEATURES_REGISTRY.tier_1_static.basePriceUsd;

  if (selectedSet.has('tier_3_catalog')) {
    baseTier = 'tier_3_catalog';
    baseTierPrice = FEATURES_REGISTRY.tier_3_catalog.basePriceUsd;
  } else if (selectedSet.has('tier_2_editable')) {
    baseTier = 'tier_2_editable';
    baseTierPrice = FEATURES_REGISTRY.tier_2_editable.basePriceUsd;
  }

  // Calculate sum of active addons / channels
  let addonsSum = 0;
  for (const featureId of selectedSet) {
    const feat = FEATURES_REGISTRY[featureId];
    if (feat && feat.category !== 'tier') {
      addonsSum += feat.basePriceUsd;
    }
  }

  return {
    totalUsd: baseTierPrice + addonsSum,
    baseTierPriceUsd: baseTierPrice,
    addonsPriceUsd: addonsSum,
    selectedTier: baseTier,
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

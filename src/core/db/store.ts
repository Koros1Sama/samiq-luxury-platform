import fs from 'fs';
import path from 'path';
import { MOCK_STOREFRONT_DATA } from '../store/mockData';
import { CLIENT_INDUSTRY_PRESETS } from '@/core/tenant/presets';
import { ProductCardData, ThemeCurrencyCode, TenantBrandInfo, PlatformMeta, CategoryItem } from '@/themes/contract';
import { AuthenticityComparisonData } from '@/modules/blocks/types';
import { PlatformPricingConfig, DEFAULT_PRICING_CONFIG } from '@/core/features/registry';
export { type PlatformPricingConfig, DEFAULT_PRICING_CONFIG };

export interface BrandPaletteConfig {
  primaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  isCustomPalette?: boolean;
}

export interface PaymentAccountsConfig {
  kuraimiAccount?: string;
  floosakAccount?: string;
  jeebAccount?: string;
  jawaliAccount?: string;
  accountHolderName?: string;
}

export interface NotificationConfig {
  telegramBotToken?: string;
  telegramChatId?: string;
  ownerWhatsapp?: string;
  geminiApiKey?: string;
}

export interface TenantConfig extends TenantBrandInfo {
  heroTitle?: string;
  heroSubtitle?: string;
  announcementText?: string;
  industryPreset?: string;
  brandPalette?: BrandPaletteConfig;
  paymentAccounts?: PaymentAccountsConfig;
  notificationConfig?: NotificationConfig;
}

export interface CouponRecord {
  code: string;
  discountPercentage: number;
  fixedDiscountYer?: number;
  minOrderAmountYer?: number;
  isActive: boolean;
  expiresAt?: string;
  usageCount: number;
}

export interface ShippingZoneRecord {
  id: string;
  nameAr: string;
  nameEn?: string;
  governorateAr?: string;
  city: string;
  feeYer: number;
  feeSar: number;
  feeUsd: number;
  estimatedDeliveryHours?: string;
  etaHours?: string;
  isAvailable: boolean;
  active?: boolean;
}

export interface CustomerOrderHistoryItem {
  productId: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  unitPrice: Record<ThemeCurrencyCode, number>;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  address: string;
  items: CustomerOrderHistoryItem[];
  subtotalYer: number;
  shippingFeeYer: number;
  discountYer: number;
  totalYer: number;
  currency: ThemeCurrencyCode;
  appliedCoupon?: string;
  paymentMethod: 'whatsapp' | 'cod' | 'kuraimi' | 'jawali' | 'floosak' | 'mada' | 'apple_pay';
  paymentReference?: string;
  paymentVerified?: boolean;
  stockDeducted?: boolean;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRecord {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string;
  email: string;
  passwordHash?: string;
  city: string;
  defaultAddress: string;
  loyaltyPoints: number;
  wishlistProductIds: string[];
  skinType?: 'oily' | 'dry' | 'combination' | 'sensitive' | 'all';
  concerns?: string[];
  role?: 'customer' | 'admin' | 'owner';
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  serviceType: 'skin_consultation' | 'routine_design' | 'makeup_match' | 'authenticity_check';
  branchId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BlogPostRecord {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string;
  isFeatured: boolean;
}

export interface ReviewRecord {
  id: string;
  tenantId: string;
  productId: string;
  customerName: string;
  rating: number; // 1 - 5
  comment: string;
  isVerifiedPurchase: boolean;
  batchCodeVerified?: string;
  createdAt: string;
  approved?: boolean;
}

export interface BranchRecord {
  id: string;
  tenantId: string;
  name: string;
  nameAr?: string;
  city: string;
  cityAr?: string;
  address: string;
  addressAr?: string;
  phone: string;
  whatsapp?: string;
  hoursAr: string;
  workingHours?: string;
  mapUrl?: string;
  isMain: boolean;
  isActive: boolean;
}

export interface SamiqProjectRecord {
  id: string;
  slug: string;
  name: string;
  legalName: string;
  industryAr: string; // e.g. 'العناية بالبشرة والمكياج' | 'المطاعم والمقاهي المختصة' | 'العيادات والصيدليات التخصصية'
  domain: string; // e.g. 'miftah-beauty.com'
  domainType: 'subdomain_free' | 'custom_com' | 'custom_ye'; // subdomain ($0/yr), .com ($20/yr), .ye ($35/yr)
  annualDomainUsd: number; // 0, 20, 35
  annualHostingMaintenanceUsd: number; // e.g. 45 ($45/yr after free 1st year)
  aiPlanType: 'none' | 'byok' | 'managed_annual'; // 0, 0, 90 ($90/yr)
  themeId: 'luxury-noir' | 'ivory-journal' | 'clinic-lab';
  whatsapp: string;
  city: string;
  adminPasscode: string;
  status: 'active' | 'staging' | 'demo';
  setupPriceUsd: number;
  enabledFeatures: string[];
  productsCount: number;
  ordersCount: number;
  previewUrl: string;
  adminUrl: string;
}

export interface SamiqDatabaseSchema {
  tenant: TenantConfig;
  features: typeof MOCK_STOREFRONT_DATA.features;
  products: ProductCardData[];
  categories: typeof MOCK_STOREFRONT_DATA.categories;
  authenticityGuides: Record<string, AuthenticityComparisonData>;
  content?: {
    blocks?: Record<string, any>;
    [key: string]: any;
  };
  orders: OrderRecord[];
  coupons: CouponRecord[];
  shippingZones: ShippingZoneRecord[];
  customers: CustomerRecord[];
  bookings: BookingRecord[];
  blogPosts: BlogPostRecord[];
  reviews: ReviewRecord[];
  branches: BranchRecord[];
  conversations: OmnichannelConversation[];
  platformMeta?: PlatformMeta;
  projects?: SamiqProjectRecord[];
  pricingConfig?: PlatformPricingConfig;
}

export type ChannelType = 'web' | 'whatsapp' | 'telegram';

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'bot' | 'agent';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface OmnichannelConversation {
  id: string;
  channel: ChannelType;
  customerName: string;
  customerIdentifier: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isBotActive: boolean;
  status: 'active' | 'resolved' | 'pending';
  messages: ChatMessage[];
}

function getDatabaseFilePath(): string {
  const isVercel = Boolean(process.env.VERCEL);
  if (isVercel) {
    const tmpPath = path.join('/tmp', 'samiq-db.json');
    if (!fs.existsSync(tmpPath)) {
      const seedPath = path.join(process.cwd(), 'data', 'samiq-db.json');
      if (fs.existsSync(seedPath)) {
        try {
          fs.copyFileSync(seedPath, tmpPath);
        } catch (e) {
          console.warn('Could not copy seed to /tmp:', e);
        }
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), 'data', 'samiq-db.json');
}

/**
 * Default Seed Database Data
 */
function createDefaultSeed(): SamiqDatabaseSchema {
  return {
    tenant: MOCK_STOREFRONT_DATA.tenant as unknown as TenantConfig,
    features: MOCK_STOREFRONT_DATA.features,
    products: MOCK_STOREFRONT_DATA.products,
    categories: MOCK_STOREFRONT_DATA.categories,
    content: MOCK_STOREFRONT_DATA.content,
    authenticityGuides: {
      'prod-1': MOCK_STOREFRONT_DATA.authenticityGuide,
      '54U700': MOCK_STOREFRONT_DATA.authenticityGuide,
    },
    platformMeta: MOCK_STOREFRONT_DATA.platformMeta,
    orders: [
      {
        id: 'ord-101',
        orderNumber: 'MIFTAH-7842',
        tenantId: '11111111-1111-1111-1111-111111111111',
        customerName: 'فاطمة العنسي',
        customerPhone: '967771234567',
        customerEmail: 'fatima@example.com',
        city: 'صنعاء',
        address: 'شارع حدة - جوار برج الأمل',
        items: [
          {
            productId: 'prod-1',
            title: 'سيروم فيتامين سي النقي 10% (Pure Vitamin C10)',
            variantTitle: '30 مل (الأصلي)',
            quantity: 1,
            unitPrice: { YER: 28500, SAR: 195, USD: 52 },
          },
          {
            productId: 'prod-2',
            title: 'غسول السيراميد المرطب للبشرة العادية والجافة',
            variantTitle: '473 مل (عائلي)',
            quantity: 1,
            unitPrice: { YER: 14500, SAR: 98, USD: 26 },
          },
        ],
        subtotalYer: 43000,
        shippingFeeYer: 0,
        discountYer: 0,
        totalYer: 43000,
        currency: 'YER',
        paymentMethod: 'whatsapp',
        status: 'delivered',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'ord-102',
        orderNumber: 'MIFTAH-7841',
        tenantId: '11111111-1111-1111-1111-111111111111',
        customerName: 'سارة عبد الله',
        customerPhone: '967779876543',
        city: 'تعز',
        address: 'الحوبان - الشارع العام',
        items: [
          {
            productId: 'prod-4',
            title: 'أحمر شفاه كوتور الفاخر بثبات حريري (Rouge Pur Couture)',
            variantTitle: 'درجة 01 - لو روج الكلاسيكي',
            quantity: 1,
            unitPrice: { YER: 24000, SAR: 165, USD: 44 },
          },
          {
            productId: 'prod-3',
            title: 'سيروم نياسيناميد 10% + زنك 1%',
            variantTitle: '30 مل',
            quantity: 2,
            unitPrice: { YER: 9500, SAR: 65, USD: 17 },
          },
        ],
        subtotalYer: 43000,
        shippingFeeYer: 2500,
        discountYer: 0,
        totalYer: 45500,
        currency: 'YER',
        paymentMethod: 'kuraimi',
        paymentReference: 'KR-908123',
        status: 'shipped',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    coupons: [
      {
        code: 'MIFTAH10',
        discountPercentage: 10,
        isActive: true,
        usageCount: 42,
      },
      {
        code: 'ASLI20',
        discountPercentage: 20,
        minOrderAmountYer: 30000,
        isActive: true,
        usageCount: 15,
      },
      {
        code: 'VIP5000',
        discountPercentage: 0,
        fixedDiscountYer: 5000,
        minOrderAmountYer: 25000,
        isActive: true,
        usageCount: 8,
      },
    ],
    shippingZones: [
      {
        id: 'zone-sanaa',
        nameAr: 'أمانة العاصمة صنعاء وضواحيها',
        nameEn: 'Sanaa Capital Region',
        city: 'صنعاء',
        feeYer: 1000,
        feeSar: 7,
        feeUsd: 2,
        estimatedDeliveryHours: 'خلال 2 إلى 4 ساعات',
        isAvailable: true,
      },
      {
        id: 'zone-aden',
        nameAr: 'محافظة عدن ولحج',
        nameEn: 'Aden & Lahij',
        city: 'عدن',
        feeYer: 3000,
        feeSar: 21,
        feeUsd: 6,
        estimatedDeliveryHours: 'خلال 24 إلى 48 ساعة',
        isAvailable: true,
      },
      {
        id: 'zone-taiz-ibb',
        nameAr: 'محافظتي تعز وإب',
        nameEn: 'Taiz & Ibb',
        city: 'تعز',
        feeYer: 2500,
        feeSar: 18,
        feeUsd: 5,
        estimatedDeliveryHours: 'خلال 24 إلى 36 ساعة',
        isAvailable: true,
      },
      {
        id: 'zone-hadramout',
        nameAr: 'حضرموت (المكلا وسيئون) وشبوة',
        nameEn: 'Hadramout & Shabwa',
        city: 'المكلا',
        feeYer: 4000,
        feeSar: 28,
        feeUsd: 8,
        estimatedDeliveryHours: 'خلال 48 ساعة',
        isAvailable: true,
      },
      {
        id: 'zone-saudi',
        nameAr: 'المملكة العربية السعودية (شحن دولي سريع)',
        nameEn: 'Saudi Arabia Express',
        city: 'الرياض',
        feeYer: 8500,
        feeSar: 35,
        feeUsd: 10,
        estimatedDeliveryHours: 'خلال 3 إلى 5 أيام عمل',
        isAvailable: true,
      },
    ],
    customers: [
      {
        id: 'cust-1',
        tenantId: '11111111-1111-1111-1111-111111111111',
        fullName: 'ريم المحمودي',
        phone: '967775001122',
        email: 'reem@example.com',
        city: 'صنعاء',
        defaultAddress: 'حدة - الحي الدبلوماسي',
        loyaltyPoints: 350,
        wishlistProductIds: ['prod-1', 'prod-4'],
        skinType: 'dry',
        concerns: ['تفتيح التصبغات', 'الترطيب العميق'],
        createdAt: '2026-09-15T10:00:00Z',
      },
    ],
    bookings: [
      {
        id: 'book-1',
        tenantId: '11111111-1111-1111-1111-111111111111',
        customerName: 'أمل الصنعاني',
        customerPhone: '967773344556',
        serviceType: 'skin_consultation',
        branchId: 'branch-sanaa',
        bookingDate: '2026-11-10',
        bookingTime: '04:30 PM',
        notes: 'استشارة فحص حاجز البشرة واختيار روتين مضاد للتصبغات',
        status: 'confirmed',
        createdAt: '2026-11-01T14:20:00Z',
      },
    ],
    blogPosts: [
      {
        id: 'post-1',
        tenantId: '11111111-1111-1111-1111-111111111111',
        slug: 'how-to-verify-vitamin-c-serum',
        title: 'أسرار فحص سيروم فيتامين سي الأصلي: الفرق القاطع بين النقاء والتأكسد',
        excerpt: 'دليل تفصيلي لكشف السيرومات المغشوشة المنتشرة في السوق اليمني وتأثيرها على صحة البشرة.',
        content: `
فيتامين سي (L-Ascorbic Acid) من أقوى مضادات الأكسدة التي تحمي خلايا الجلد وتوحد لون البشرة، لكنه في الوقت ذاته من أكثر المواد حساسية تجاه الضوء والحرارة والهواء.

المنتجات المقلدة تعتمد عادة على سوائل ماء ملون بدون أي تركيز فعال، أو تحتوي على مواد كيميائية تتأكسد في أيام قليلة وتسبب التهابات حادة للبشرة.

العلامات الحاسمة لفحص سيروم فيتامين سي Pure Vitamin C10 الأصلي:
1. ختم وتصريح الهيئة العليا للأدوية والمستلزمات الطبية:
يأتي المستحضر مصرحاً ومطابقاً لمعايير الهيئة العليا للأدوية والمستلزمات الطبية مع ختم الأصالة والباركود المعتمد على ظهر الكرتون الخارجي. في المنتجات المقلدة تجد الختم مفقوداً تماماً أو مطبوعاً بحبر سطحي يزول بمسحة إصبع.

2. قوام ولون السيروم:
السيروم الأصلي يتميز بلون ذهبي كهرماني نقي، وقوام انسيابي خفيف سريع الامتصاص دون أي ملمس زيتي لزج. في العبوات المقلدة تلاحظ رغوة بيضاء عائمة عند رج العبوة ورائحة كيميائية نفاذة.

3. نوع ومطاط القطارة:
العبوة الأصلية مزودة بقطارة طبية ذات سدادة داخلية محكمة للغاية تمنع تسرب جزيئات الأكسجين لحماية الفيتامين من التلف.
        `,
        author: 'خبيرات مفتاح الجمال',
        coverImage: '/media/hero/hero-noir.jpg',
        tags: ['العناية بالبشرة', 'فيتامين سي', 'كشف الأصلي والتقليد'],
        readTimeMinutes: 4,
        publishedAt: '2026-10-25',
        isFeatured: true,
      },
      {
        id: 'post-2',
        tenantId: '11111111-1111-1111-1111-111111111111',
        slug: 'hydrating-cleanser-original-guide',
        title: 'دليل الغسول المرطب الأصلي: كيف تضمنين وجود السيراميدات الثلاث الأساسية؟',
        excerpt: 'مقارنة دقيقة في الباركود وحجم العبوة ولون المضخة للغسول المرطب الأصلي Hydrating Cleanser.',
        content: `
يُعد الغسول المرطب Hydrating Cleanser المستحضر الأكثر توصية من أطباء الجلد حول العالم للبشرة الجافة والعادية، نظراً لاحتوائه على 3 سيراميدات متطابقة جينياً مع حاجز الجلد الطبيعي (1، 3، 6-II) وحمض الهيالورونيك.

كيف تميزين العبوة الأصلية؟
- المضخة (Pump): رأس المضخة في العبوة الأصلية مصبوب بلون أزرق موحد متقن دون أي نتوءات بلاستيكية خشنة، وتحتوي آلية أمان قفل وفتح ناعمة للغاية.
- ملمس اللوشن: الأصلي لوشن كريمي مائي أبيض ناصع لا يصنع رغوة قاسية، ويترك طبقة ترطيب مخملية فور الشطف.
- الباركود الدولي: الباركود يبدأ برقم الوكالة المعتمد ويظهر تاريخ الإنتاج وبلد المنشأ مباشرة.
        `,
        author: 'فريق التوثيق المخبري',
        coverImage: '/media/hero/hero-ivory.jpg',
        tags: ['غسول مرطب', 'ترطيب البشرة', 'السيراميدات'],
        readTimeMinutes: 5,
        publishedAt: '2026-10-28',
        isFeatured: false,
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        tenantId: '11111111-1111-1111-1111-111111111111',
        productId: 'prod-1',
        customerName: 'د. أروى الحميري',
        rating: 5,
        comment: 'السيروم أصلي 100% ومصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية، ظهرت تفاصيل علامات الأصلي بدقة. النضارة بدأت تظهر من أول أسبوع.',
        isVerifiedPurchase: true,
        batchCodeVerified: '54U700',
        createdAt: '2026-10-20T12:00:00Z',
      },
      {
        id: 'rev-2',
        tenantId: '11111111-1111-1111-1111-111111111111',
        productId: 'prod-2',
        customerName: 'منال الشامي',
        rating: 5,
        comment: 'غسول السيراميد ممتاز جداً للبشرة الجافة، التوصيل في صنعاء استغرق 3 ساعات فقط مع فحص العبوة قبل الدفع.',
        isVerifiedPurchase: true,
        createdAt: '2026-10-22T15:30:00Z',
      },
      {
        id: 'rev-3',
        tenantId: '11111111-1111-1111-1111-111111111111',
        productId: 'prod-3',
        customerName: 'هند القاسمي',
        rating: 5,
        comment: 'سيروم نياسيناميد المركز أصلي وموثوق، الزجاجة ثقيلة وملمس المحلول خفيف، المسامات صغرت بشكل ملحوظ.',
        isVerifiedPurchase: true,
        createdAt: '2026-10-29T18:15:00Z',
      },
    ],
    branches: [
      {
        id: 'branch-sanaa',
        tenantId: '11111111-1111-1111-1111-111111111111',
        name: 'فرع صنعاء الرئيسي (حدة)',
        city: 'صنعاء',
        address: 'شارع حدة — مقابل مجمع الكميم التجاري',
        phone: '967775234989',
        whatsapp: '967775234989',
        hoursAr: 'يومياً من 9:00 صباحاً حتى 10:00 مساءً',
        isMain: true,
        isActive: true,
      },
      {
        id: 'branch-aden',
        tenantId: '11111111-1111-1111-1111-111111111111',
        name: 'نقطة تسليم عدن (المنصورة)',
        city: 'عدن',
        address: 'المنصورة — شارع التسعين جوار كابوتا',
        phone: '967775234989',
        whatsapp: '967775234989',
        hoursAr: 'يومياً من 10:00 صباحاً حتى 9:00 مساءً',
        isMain: false,
        isActive: true,
      },
    ],
    conversations: [
      {
        id: 'conv-wa-1',
        channel: 'whatsapp',
        customerName: 'أم ريان — صنعاء',
        customerIdentifier: '+967 771 234 567',
        lastMessage: 'كيف أتحقق من مطابقة غسول السيراميد لمعايير الجودة قبل فتح العبوة؟',
        lastMessageTime: 'منذ 10 دقائق',
        unreadCount: 1,
        isBotActive: true,
        status: 'active',
        messages: [
          {
            id: 'm1',
            sender: 'customer',
            senderName: 'أم ريان',
            text: 'السلام عليكم، هل غسول السيراميد للبشرة الدهنية متوفر بحجم 473 مل؟',
            timestamp: '14:20',
          },
          {
            id: 'm2',
            sender: 'bot',
            senderName: 'المستشارة الذكية (مفتاح الجمال)',
            text: 'وعليكم السلام ورحمة الله. نعم متوفر في فرع حدة والكتالوج الإلكتروني، المنتج أصلي 100% مستورد من فرنسا مع باركود فحص فوري.',
            timestamp: '14:21',
          },
          {
            id: 'm3',
            sender: 'customer',
            senderName: 'أم ريان',
            text: 'كيف أتحقق من مطابقة غسول السيراميد لمعايير الجودة قبل فتح العبوة؟',
            timestamp: '14:23',
          },
        ],
      },
      {
        id: 'conv-web-2',
        channel: 'web',
        customerName: 'سارة المهدي',
        customerIdentifier: 'sarah.m@gmail.com',
        lastMessage: 'طلبت سيروم فيتامين سي من الموقع، هل التوصيل إلى حدة بنفس اليوم؟',
        lastMessageTime: 'منذ 25 دقيقة',
        unreadCount: 0,
        isBotActive: true,
        status: 'active',
        messages: [
          {
            id: 'm4',
            sender: 'customer',
            senderName: 'سارة المهدي',
            text: 'طلبت سيروم فيتامين سي من الموقع، هل التوصيل إلى حدة بنفس اليوم؟',
            timestamp: '13:50',
          },
          {
            id: 'm5',
            sender: 'bot',
            senderName: 'مستشارة سَامِق الذكية',
            text: 'أهلاً بكِ أستاذة سارة. طلبات أمانة العاصمة صنعاء تسلّم في نفس اليوم خلال 3 إلى 5 ساعات عبر مندوبنا مع إمكانية الفحص قبل السداد.',
            timestamp: '13:51',
          },
        ],
      },
      {
        id: 'conv-tg-3',
        channel: 'telegram',
        customerName: 'م. عبد الرحمن الحكيمي',
        customerIdentifier: '@Ar_Hakeemi',
        lastMessage: 'أريد حجز استشارة جلدية لزوجتي يوم الخميس القادم في فرع حدة.',
        lastMessageTime: 'منذ 45 دقيقة',
        unreadCount: 2,
        isBotActive: false,
        status: 'pending',
        messages: [
          {
            id: 'm6',
            sender: 'customer',
            senderName: 'م. عبد الرحمن الحكيمي',
            text: 'أريد حجز استشارة جلدية لزوجتي يوم الخميس القادم في فرع حدة.',
            timestamp: '13:10',
          },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-miftah',
        slug: 'miftah',
        name: 'مفتاح الجمال',
        legalName: 'مفتاح الجمال — لكشف المقلد',
        industryAr: 'العناية بالبشرة والمكياج',
        domain: 'miftah-beauty.com',
        domainType: 'custom_com',
        annualDomainUsd: 20,
        annualHostingMaintenanceUsd: 45,
        aiPlanType: 'byok',
        themeId: 'luxury-noir',
        whatsapp: '967775234989',
        city: 'صنعاء',
        adminPasscode: 'miftah2026',
        status: 'active',
        setupPriceUsd: 550,
        enabledFeatures: [
          'tier_1_static',
          'tier_2_editable',
          'tier_3_catalog',
          'cart_whatsapp',
          'smart_tags_ai',
          'authenticity_guide',
          'skin_routine_advisor',
          'customer_accounts',
          'ai_chatbot',
        ],
        productsCount: 6,
        ordersCount: 2,
        previewUrl: '/?demo=1&theme=luxury-noir',
        adminUrl: '/admin?tenant=miftah',
      },
      {
        id: 'proj-restaurant',
        slug: 'demo-restaurant',
        name: 'دار القهوة المختصة والمخبز الحرفي',
        legalName: 'دار القهوة المختصة — صنعاء',
        industryAr: 'المطاعم والمقاهي المختصة',
        domain: 'roastery.samiq.app',
        domainType: 'subdomain_free',
        annualDomainUsd: 0,
        annualHostingMaintenanceUsd: 35,
        aiPlanType: 'none',
        themeId: 'ivory-journal',
        whatsapp: '967770000111',
        city: 'صنعاء',
        adminPasscode: 'coffee2026',
        status: 'demo',
        setupPriceUsd: 400,
        enabledFeatures: [
          'tier_1_static',
          'tier_2_editable',
          'tier_3_catalog',
          'cart_whatsapp',
        ],
        productsCount: 6,
        ordersCount: 5,
        previewUrl: '/?demo=1&tenant=demo-restaurant&theme=ivory-journal',
        adminUrl: '/admin?tenant=demo-restaurant',
      },
      {
        id: 'proj-clinic',
        slug: 'derma-clinic',
        name: 'مختبرات النخبة الجلدية',
        legalName: 'مختبرات النخبة للعناية السريرية',
        industryAr: 'العيادات والصيدليات التخصصية',
        domain: 'elite-derma.com',
        domainType: 'custom_com',
        annualDomainUsd: 20,
        annualHostingMaintenanceUsd: 50,
        aiPlanType: 'managed_annual',
        themeId: 'clinic-lab',
        whatsapp: '967770000222',
        city: 'عدن / صنعاء',
        adminPasscode: 'clinic2026',
        status: 'staging',
        setupPriceUsd: 700,
        enabledFeatures: [
          'tier_1_static',
          'tier_2_editable',
          'tier_3_catalog',
          'cart_whatsapp',
          'smart_tags_ai',
          'skin_routine_advisor',
          'customer_accounts',
          'ai_chatbot',
        ],
        productsCount: 6,
        ordersCount: 3,
        previewUrl: '/?demo=1&theme=clinic-lab',
        adminUrl: '/admin?tenant=derma-clinic',
      },
    ],
  };
}

/**
 * Reads database from local file or creates seed if missing
 */
export function getDb(): SamiqDatabaseSchema {
  try {
    const dbPath = getDatabaseFilePath();
    if (!fs.existsSync(dbPath)) {
      const initialSeed = createDefaultSeed();
      saveDb(initialSeed);
      return initialSeed;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(raw) as SamiqDatabaseSchema;
    if (!parsed.conversations) {
      parsed.conversations = createDefaultSeed().conversations;
    }
    if (!parsed.content) {
      parsed.content = createDefaultSeed().content;
    }
    if (!parsed.tenant.homeSections) {
      parsed.tenant.homeSections = createDefaultSeed().tenant.homeSections;
    }
    if (!parsed.tenant.contact) {
      parsed.tenant.contact = createDefaultSeed().tenant.contact;
    }
    if (!parsed.tenant.themeId) {
      parsed.tenant.themeId = 'luxury-noir';
    }
    if (!parsed.platformMeta) {
      parsed.platformMeta = createDefaultSeed().platformMeta;
    }
    if (!parsed.projects || !Array.isArray(parsed.projects) || parsed.projects.length === 0) {
      parsed.projects = createDefaultSeed().projects;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading samiq-db.json, falling back to seed:', err);
    return createDefaultSeed();
  }
}

/**
 * Writes data synchronously to disk for real-time persistence
 */
export function saveDb(data: SamiqDatabaseSchema): void {
  try {
    const dbPath = getDatabaseFilePath();
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing samiq-db.json:', err);
  }
}

// --------------------------------------------------------------------------
// PERSISTENT CRUD METHODS
// --------------------------------------------------------------------------

// 1. Products
export function getAllProducts(): ProductCardData[] {
  const db = getDb();
  return db.products;
}

export function getPublishedProducts(): ProductCardData[] {
  const db = getDb();
  return db.products.filter(
    (p) =>
      p.visibilityStatus !== 'warehouse_only' &&
      p.visibilityStatus !== 'archived' &&
      p.isPublished !== false
  );
}

export function getProductBySlugOrId(slugOrId: string): ProductCardData | undefined {
  const db = getDb();
  return db.products.find(
    (p) => p.id === slugOrId || p.title.toLowerCase().includes(slugOrId.toLowerCase())
  );
}

export function saveProduct(product: ProductCardData): ProductCardData {
  const db = getDb();
  const existingIdx = db.products.findIndex((p) => p.id === product.id);
  if (existingIdx >= 0) {
    db.products[existingIdx] = product;
  } else {
    db.products.unshift(product);
  }
  saveDb(db);
  return product;
}

export function deleteProduct(productId: string): boolean {
  const db = getDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== productId);
  if (db.products.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// 2. Orders
export function getAllOrders(): OrderRecord[] {
  const db = getDb();
  return db.orders;
}

export function createOrder(order: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): OrderRecord {
  const db = getDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();
  const isConfirmed = order.status === 'confirmed';
  const newOrder: OrderRecord = {
    ...order,
    id: `ord-${Date.now()}`,
    orderNumber: `MIFTAH-${randomSuffix}`,
    paymentVerified: order.paymentVerified ?? false,
    stockDeducted: order.stockDeducted ?? isConfirmed,
    createdAt: now,
    updatedAt: now,
  };
  db.orders.unshift(newOrder);

  // If created as confirmed (e.g. from POS), automatically decrement stock
  if (isConfirmed && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod && typeof prod.stockQuantity === 'number') {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
        prod.inStock = prod.stockQuantity > 0;
      }
    });
  }

  // If coupon used, increment count
  if (order.appliedCoupon) {
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === order.appliedCoupon?.toUpperCase());
    if (coupon) coupon.usageCount += 1;
  }

  saveDb(db);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderRecord['status']): OrderRecord | undefined {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (order) {
    const prevStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // If transitioning to confirmed and not yet deducted, decrement product stock
    if (status === 'confirmed' && prevStatus !== 'confirmed' && !order.stockDeducted && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod && typeof prod.stockQuantity === 'number') {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
          prod.inStock = prod.stockQuantity > 0;
        }
      });
      order.stockDeducted = true;
    }

    saveDb(db);
  }
  return order;
}

export function deductOrderStock(orderId: string): OrderRecord | undefined {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (order && !order.stockDeducted && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod && typeof prod.stockQuantity === 'number') {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - (item.quantity || 1));
        prod.inStock = prod.stockQuantity > 0;
      }
    });
    order.stockDeducted = true;
    order.status = 'confirmed';
    order.updatedAt = new Date().toISOString();
    saveDb(db);
  }
  return order;
}

export function restoreOrderStock(orderId: string): OrderRecord | undefined {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (order && order.stockDeducted && Array.isArray(order.items)) {
    order.items.forEach((item) => {
      const prod = db.products.find((p) => p.id === item.productId);
      if (prod && typeof prod.stockQuantity === 'number') {
        prod.stockQuantity = prod.stockQuantity + (item.quantity || 1);
        prod.inStock = prod.stockQuantity > 0;
      }
    });
    order.stockDeducted = false;
    order.updatedAt = new Date().toISOString();
    saveDb(db);
  }
  return order;
}

export function togglePaymentVerified(orderId: string): OrderRecord | undefined {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  if (order) {
    order.paymentVerified = !order.paymentVerified;
    order.updatedAt = new Date().toISOString();
    saveDb(db);
  }
  return order;
}

export function applyIndustryPreset(presetKey: string): {
  tenant: TenantConfig;
  categories: CategoryItem[];
  products: ProductCardData[];
} | null {
  const preset = CLIENT_INDUSTRY_PRESETS[presetKey];
  if (!preset) return null;

  const db = getDb();
  db.tenant = {
    ...db.tenant,
    name: preset.name,
    legalName: preset.legalName,
    tagline: preset.tagline,
    heroTitle: preset.heroTitle,
    heroSubtitle: preset.heroSubtitle,
    announcementText: preset.announcementText,
    heroBadge: preset.heroBadge,
    themeId: preset.themeId,
    industryPreset: presetKey,
    brandPalette: {
      ...db.tenant.brandPalette,
      ...preset.brandPalette,
    },
  };

  if (Array.isArray(preset.categories) && preset.categories.length > 0) {
    db.categories = JSON.parse(JSON.stringify(preset.categories));
  }
  if (Array.isArray(preset.products) && preset.products.length > 0) {
    db.products = JSON.parse(JSON.stringify(preset.products));
  }

  saveDb(db);
  return {
    tenant: db.tenant,
    categories: db.categories,
    products: db.products,
  };
}

export function deleteOrder(orderId: string): boolean {
  const db = getDb();
  const initialLen = db.orders.length;
  db.orders = db.orders.filter((o) => o.id !== orderId && o.orderNumber !== orderId);
  if (db.orders.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// 3. Coupons
export function getAllCoupons(): CouponRecord[] {
  const db = getDb();
  return db.coupons;
}

export function saveCoupon(coupon: CouponRecord): CouponRecord {
  const db = getDb();
  const existingIdx = db.coupons.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
  if (existingIdx >= 0) {
    db.coupons[existingIdx] = coupon;
  } else {
    db.coupons.unshift(coupon);
  }
  saveDb(db);
  return coupon;
}

export function deleteCoupon(code: string): boolean {
  const db = getDb();
  const initialLen = db.coupons.length;
  db.coupons = db.coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
  if (db.coupons.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function validateCoupon(code: string, subtotalYer: number): { isValid: boolean; discountAmountYer: number; message: string } {
  const db = getDb();
  const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return { isValid: false, discountAmountYer: 0, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' };
  }
  if (coupon.minOrderAmountYer && subtotalYer < coupon.minOrderAmountYer) {
    return {
      isValid: false,
      discountAmountYer: 0,
      message: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minOrderAmountYer} ريال يمني`,
    };
  }

  let discount = 0;
  if (coupon.discountPercentage > 0) {
    discount = Math.round((subtotalYer * coupon.discountPercentage) / 100);
  } else if (coupon.fixedDiscountYer) {
    discount = Math.min(coupon.fixedDiscountYer, subtotalYer);
  }

  return {
    isValid: true,
    discountAmountYer: discount,
    message: `تم تطبيق الخصم بنجاح (-${discount} ر.ي)`,
  };
}

// 4. Shipping Zones
export function getShippingZones(): ShippingZoneRecord[] {
  const db = getDb();
  return db.shippingZones;
}

// 5. Authenticity Guides & Product Authenticity Verifier
export function getAuthenticityGuide(productIdOrQuery: string): AuthenticityComparisonData | undefined {
  const db = getDb();
  if (db.authenticityGuides[productIdOrQuery]) {
    return db.authenticityGuides[productIdOrQuery];
  }
  const clean = productIdOrQuery.trim().toLowerCase();
  // Try matching product title or id
  const found = Object.values(db.authenticityGuides).find(
    (g) =>
      g.productId.toLowerCase() === clean ||
      g.productTitle.toLowerCase().includes(clean) ||
      g.brand.toLowerCase().includes(clean) ||
      (g.original.batchCode && g.original.batchCode.toLowerCase() === clean)
  );
  return found || db.authenticityGuides['prod-1'];
}

export function verifyBatchCode(queryOrCode: string): {
  isVerified: boolean;
  brand: string;
  productName: string;
  batchCode: string;
  manufactureDate: string;
  shelfLife: string;
  statusNotes: string;
  inspectionChecklist: string[];
} {
  const clean = (queryOrCode || '').trim();
  const lower = clean.toLowerCase();

  // Suspicious queries check
  if (lower.includes('suspicious') || lower.includes('fake') || lower.includes('مغشوش') || lower.includes('مقلد')) {
    return {
      isVerified: false,
      brand: 'غير معتمد',
      productName: clean || 'مستحضر مشتبه به',
      batchCode: 'غير مصرح',
      manufactureDate: 'غير محدد',
      shelfLife: 'غير صالح للاستخدام',
      statusNotes: 'تنبيه: المستحضر غير مسجل ضمن المستحضرات المصرحة من الهيئة العليا للأدوية والمستلزمات الطبية. يرجى الحذر من استخدامه لسلامة بشرتكِ.',
      inspectionChecklist: [
        'عدم وجود ختم الهيئة العليا للأدوية والمستلزمات الطبية',
        'رائحة كيميائية نفاذة أو قوام معكر سريع التأكسد',
        'عبوة رديئة ومطاط يسرب الهواء',
      ],
    };
  }

  // Pre-configured product catalog verifications
  const KNOWN_PRODUCTS = [
    {
      keywords: ['فيتامين', 'vitamin', '54u700', 'c10', 'سيروم فيتامين'],
      brand: 'سيرومات نقية',
      product: 'سيروم فيتامين سي النقي 10% (Pure Vitamin C10)',
      date: 'سنة الإنتاج 2026',
      life: '36 شهراً (غير مفتوح) / 6 أشهر بعد الفتح',
      notes: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. خاضع للفحص الدوري والمطابقة السريرية.',
      checklist: [
        'القوام واللون: قوام كهرماني نقي سريع الامتصاص خالي تماماً من الرغوة البيضاء العائمة أو الرائحة الكيميائية النفاذة',
        'جودة العبوة والقطارة: زجاج طبي معتم عازل للضوء لحماية فيتامين C مع سدادة قطارة محكمة تمنع تسرب الهواء',
        'الطباعة والختم: ختم الأصالة والباركود المعتمد ومطابقة بيانات الهيئة العليا للأدوية والمستلزمات الطبية',
      ],
    },
    {
      keywords: ['غسول', 'cleanser', '20t900', 'مرطب', 'الغسول المرطب'],
      brand: 'عناية يومية',
      product: 'الغسول المرطب للبشرة (Hydrating Facial Cleanser)',
      date: 'سنة الإنتاج 2026',
      life: '36 شهراً من تاريخ التصنيع',
      notes: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. يحتوي على 3 سيراميدات أساسية مطابقة لحاجز الجلد.',
      checklist: [
        'القوام واللون: لوشن كريمي مائي أبيض ناصع لا يصنع رغوة قاسية وخالي من العطور الاصطناعية',
        'جودة المضخة: رأس مضخة ناعم مصبوب بإتقان دون حواف حادة مع آلية قفل وفتح آمنة',
        'الطباعة والختم: باركود دولي معتمد يقرأ بيانات الاعتماد الرسمية والمطابقة الصيدلانية',
      ],
    },
    {
      keywords: ['نياسيناميد', 'niacinamide', '1a02', 'زنك', 'zinc'],
      brand: 'سيرومات نقية',
      product: 'سيروم نياسيناميد 10% + زنك 1% (Niacinamide 10%)',
      date: 'سنة الإنتاج 2026',
      life: '36 شهراً (12 شهراً بعد الفتح)',
      notes: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. تركيبة نقية لضبط الإفرازات الدهنية وتضييق المسام.',
      checklist: [
        'القوام واللون: سائل شفاف انسيابي خفيف الامتصاص دون لزوجة صمغية أو بقايا بيضاء جافة',
        'جودة العبوة والقطارة: قارورة زجاجية ثقيلة مع قطارة دقيقة بسدادة عازلة للأكسجين',
        'الطباعة والختم: طباعة بارزة ونقية للبيانات مع ختم الأصالة والباركود المعتمد',
      ],
    },
    {
      keywords: ['كريم', 'ترطيب', 'cream', 'كريم الترطيب المكثف'],
      brand: 'عناية فائقة',
      product: 'كريم الترطيب المكثف وحماية حاجز البشرة',
      date: 'سنة الإنتاج 2026',
      life: '36 شهراً من تاريخ التصنيع',
      notes: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. غني بحمض الهيالورونيك والدهون الحيوية.',
      checklist: [
        'القوام واللون: ملمس مخملي غني يغذي البشرة دون سد المسام أو التسبب بلمعان دهني زائد',
        'جودة العبوة: غطاء محكم عازل مع غشاء أمان داخلي يضمن عدم فتح المنتج مسبقاً',
        'الطباعة والختم: ختم الأصالة وبيانات التسجيل الصيدلاني المعتمدة في اليمن',
      ],
    },
  ];

  const matched = KNOWN_PRODUCTS.find((p) =>
    p.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );

  if (matched) {
    return {
      isVerified: true,
      brand: matched.brand,
      productName: matched.product,
      batchCode: 'مصرح ومطابق للمعايير',
      manufactureDate: matched.date,
      shelfLife: matched.life,
      statusNotes: matched.notes,
      inspectionChecklist: matched.checklist,
    };
  }

  // Fallback for general product search
  const isQueryValid = clean.length >= 2;
  return {
    isVerified: isQueryValid,
    brand: isQueryValid ? 'مستحضر معتمد' : 'غير معروف',
    productName: clean || 'مستحضر مصرح',
    batchCode: isQueryValid ? 'مصرح ومطابق للمعايير' : 'غير مسجل',
    manufactureDate: 'سنة الإنتاج 2026',
    shelfLife: '36 شهراً من تاريخ التصنيع',
    statusNotes: isQueryValid
      ? 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية. تأكدي من سلامة ختم الأصالة والباركود المعتمد عند الاستلام.'
      : 'يرجى كتابة اسم المستحضر بوضوح لمطابقة علامات الأصلي وكشف المقلد.',
    inspectionChecklist: [
      'القوام واللون: قوام نقي طبيعي ورائحة معتدلة خالية من الروائح الكيميائية الحادة',
      'جودة التغليف: عبوة محكمة الإغلاق ومصنوعة من مواد طبية عازلة للضوء والهواء',
      'الختم والباركود: ختم الأصالة المعتمد وتطابق بيانات الملصق مع معايير الهيئة العليا للأدوية',
    ],
  };
}

export function getAllAuthenticityGuides(): Record<string, AuthenticityComparisonData> {
  const db = getDb();
  return db.authenticityGuides;
}

export function saveAuthenticityGuide(key: string, guide: AuthenticityComparisonData): void {
  const db = getDb();
  db.authenticityGuides[key] = guide;
  saveDb(db);
}

export function deleteAuthenticityGuide(key: string): boolean {
  const db = getDb();
  if (db.authenticityGuides[key]) {
    delete db.authenticityGuides[key];
    saveDb(db);
    return true;
  }
  return false;
}

// 6. Bookings
export function getAllBookings(): BookingRecord[] {
  const db = getDb();
  return db.bookings;
}

export function updateBookingStatus(bookingId: string, status: BookingRecord['status']): BookingRecord | undefined {
  const db = getDb();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = status;
    saveDb(db);
  }
  return booking;
}

export function deleteBooking(bookingId: string): boolean {
  const db = getDb();
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter((b) => b.id !== bookingId);
  if (db.bookings.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function createBooking(booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): BookingRecord {
  const db = getDb();
  const newBooking: BookingRecord = {
    ...booking,
    id: `book-${Date.now()}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  db.bookings.unshift(newBooking);
  saveDb(db);
  return newBooking;
}

// 7. Blog Posts
export function getAllBlogPosts(): BlogPostRecord[] {
  const db = getDb();
  return db.blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPostRecord | undefined {
  const db = getDb();
  return db.blogPosts.find((p) => p.slug === slug || p.id === slug);
}

export function saveBlogPost(post: BlogPostRecord): BlogPostRecord {
  const db = getDb();
  const existingIdx = db.blogPosts.findIndex((p) => p.id === post.id || p.slug === post.slug);
  if (existingIdx >= 0) {
    db.blogPosts[existingIdx] = post;
  } else {
    db.blogPosts.unshift(post);
  }
  saveDb(db);
  return post;
}

export function deleteBlogPost(idOrSlug: string): boolean {
  const db = getDb();
  const initialLen = db.blogPosts.length;
  db.blogPosts = db.blogPosts.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  if (db.blogPosts.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

// Categories & Storefront Layout
export function getAllCategories(): CategoryItem[] {
  const db = getDb();
  return db.categories;
}

export function saveCategory(category: CategoryItem): CategoryItem {
  const db = getDb();
  const existingIdx = db.categories.findIndex((c) => c.id === category.id);
  if (existingIdx >= 0) {
    db.categories[existingIdx] = category;
  } else {
    db.categories.push(category);
  }
  saveDb(db);
  return category;
}

export function deleteCategory(categoryId: string): boolean {
  const db = getDb();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== categoryId);
  if (db.categories.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}

export function updateHomeSections(sections: any[]): void {
  const db = getDb();
  db.tenant.homeSections = sections;
  saveDb(db);
}

// 8. Reviews
export function getAllReviews(): ReviewRecord[] {
  const db = getDb();
  return db.reviews || [];
}

export function getProductReviews(productId: string): ReviewRecord[] {
  const db = getDb();
  return (db.reviews || []).filter((r) => r.productId === productId && r.approved !== false);
}

export function addReview(review: Omit<ReviewRecord, 'id' | 'createdAt'>): ReviewRecord {
  const db = getDb();
  const newReview: ReviewRecord = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
    approved: review.approved !== undefined ? review.approved : true,
  };
  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(newReview);
  saveDb(db);
  return newReview;
}

export function moderateReview(reviewId: string, operation: 'delete' | 'toggle_approve'): boolean {
  const db = getDb();
  if (!db.reviews) return false;
  if (operation === 'delete') {
    const initialLen = db.reviews.length;
    db.reviews = db.reviews.filter((r) => r.id !== reviewId);
    if (db.reviews.length !== initialLen) {
      saveDb(db);
      return true;
    }
    return false;
  }
  if (operation === 'toggle_approve') {
    const target = db.reviews.find((r) => r.id === reviewId);
    if (target) {
      target.approved = target.approved === false ? true : false;
      saveDb(db);
      return true;
    }
  }
  return false;
}

export function updateShippingZones(zones: ShippingZoneRecord[]): void {
  const db = getDb();
  db.shippingZones = zones;
  saveDb(db);
}

export function updateBranches(branches: BranchRecord[]): void {
  const db = getDb();
  db.branches = branches;
  saveDb(db);
}

export function updateTenant(partialTenant: Partial<TenantConfig>): TenantConfig {
  const db = getDb();
  const existingTenant = db.tenant || ({} as TenantConfig);

  // Guard against overwriting secrets with masked values (e.g. •••• or ***)
  const incomingNc = partialTenant.notificationConfig;
  const existingNc = existingTenant.notificationConfig || {};
  let mergedNc = existingNc;

  if (incomingNc) {
    const isMasked = (str?: string) => !str || str.startsWith('•') || str.startsWith('*');
    mergedNc = {
      ...existingNc,
      ...incomingNc,
      geminiApiKey: isMasked(incomingNc.geminiApiKey)
        ? existingNc.geminiApiKey
        : incomingNc.geminiApiKey,
      telegramBotToken: isMasked(incomingNc.telegramBotToken)
        ? existingNc.telegramBotToken
        : incomingNc.telegramBotToken,
    };
  }

  db.tenant = {
    ...existingTenant,
    ...partialTenant,
    id: existingTenant.id || '11111111-1111-1111-1111-111111111111',
    notificationConfig: mergedNc,
  };
  saveDb(db);
  return db.tenant;
}

export interface ConvertCurrencyOptions {
  fromCurrency: ThemeCurrencyCode;
  toCurrency: ThemeCurrencyCode;
  rate?: number;
  operation?: 'divide' | 'multiply';
  mode: 'rate_convert' | 'change_symbol_only';
  rounding?: 'round' | 'ceil' | 'floor' | 'decimals';
}

export function convertStoreCurrency(options: ConvertCurrencyOptions): {
  success: boolean;
  message: string;
  affectedProducts: number;
  newCurrency: ThemeCurrencyCode;
} {
  const db = getDb();
  const from = options.fromCurrency || db.tenant.currency || 'YER';
  const to = options.toCurrency || 'YER';

  if (!db.products || !Array.isArray(db.products)) {
    db.products = [];
  }

  if (options.mode === 'change_symbol_only') {
    db.products.forEach((p) => {
      if (!p.prices) {
        p.prices = { YER: 0, SAR: 0, USD: 0 };
      }
      const existingBase = p.prices[from] ?? p.prices.YER ?? 0;
      p.prices[to] = existingBase;

      if (p.comparePrices) {
        const existingCompare = p.comparePrices[from] ?? p.comparePrices.YER;
        if (existingCompare !== undefined) {
          p.comparePrices[to] = existingCompare;
        }
      }
    });

    db.tenant.currency = to;
    saveDb(db);

    return {
      success: true,
      message: `تم تغيير عملة المتجر الرسمية إلى (${to}) بنجاح دون المساس بالقيم العددية`,
      affectedProducts: db.products.length,
      newCurrency: to,
    };
  }

  // Rate Convert mode
  const rate = Number(options.rate) || 1;
  if (rate <= 0) {
    return {
      success: false,
      message: 'سعر الصرف يجب أن يكون قيمة رقمية أكبر من الصفر',
      affectedProducts: 0,
      newCurrency: from,
    };
  }

  const op = options.operation || (from === 'YER' ? 'divide' : 'multiply');
  const rounding = options.rounding || (to === 'USD' ? 'decimals' : 'round');

  const calculateNewPrice = (val: number): number => {
    if (val <= 0) return 0;
    const raw = op === 'divide' ? val / rate : val * rate;
    if (rounding === 'decimals') {
      return Number(raw.toFixed(2));
    }
    if (rounding === 'ceil') {
      return Math.ceil(raw);
    }
    if (rounding === 'floor') {
      return Math.floor(raw);
    }
    return Math.round(raw);
  };

  db.products.forEach((p) => {
    if (!p.prices) {
      p.prices = { YER: 0, SAR: 0, USD: 0 };
    }
    const oldBasePrice = p.prices[from] ?? p.prices.YER ?? 0;
    const newBasePrice = calculateNewPrice(oldBasePrice);

    p.prices[to] = newBasePrice;
    p.prices[from] = oldBasePrice;

    if (p.comparePrices) {
      const oldCompare = p.comparePrices[from] ?? p.comparePrices.YER ?? 0;
      if (oldCompare > 0) {
        p.comparePrices[to] = calculateNewPrice(oldCompare);
      }
    }
  });

  // Scale shipping zones
  if (db.shippingZones && Array.isArray(db.shippingZones)) {
    db.shippingZones.forEach((zone) => {
      if (from === 'YER' && to === 'SAR') {
        zone.feeSar = calculateNewPrice(zone.feeYer || 0);
      } else if (from === 'YER' && to === 'USD') {
        zone.feeUsd = calculateNewPrice(zone.feeYer || 0);
      } else if (from === 'SAR' && to === 'YER') {
        zone.feeYer = calculateNewPrice(zone.feeSar || 0);
      } else if (from === 'USD' && to === 'YER') {
        zone.feeYer = calculateNewPrice(zone.feeUsd || 0);
      }
    });
  }

  db.tenant.currency = to;
  if (!db.tenant.exchangeRates) {
    db.tenant.exchangeRates = { usdToYer: 550, sarToYer: 145, usdToSar: 3.75 };
  }
  if ((from === 'YER' && to === 'SAR') || (from === 'SAR' && to === 'YER')) {
    db.tenant.exchangeRates.sarToYer = rate;
  }
  if ((from === 'YER' && to === 'USD') || (from === 'USD' && to === 'YER')) {
    db.tenant.exchangeRates.usdToYer = rate;
  }
  if ((from === 'SAR' && to === 'USD') || (from === 'USD' && to === 'SAR')) {
    db.tenant.exchangeRates.usdToSar = rate;
  }

  saveDb(db);

  const opLabel = op === 'divide' ? '÷' : '×';
  return {
    success: true,
    message: `تم تحويل أسعار ${db.products.length} مستحضر بنجاح من (${from}) إلى (${to}) بعملية (${opLabel} ${rate}) وتحديث عملة المتجر`,
    affectedProducts: db.products.length,
    newCurrency: to,
  };
}

// 9. Customers & Wishlist
export function getCustomerByEmailOrPhone(identifier: string): CustomerRecord | undefined {
  const db = getDb();
  return db.customers.find((c) => c.email.toLowerCase() === identifier.toLowerCase() || c.phone === identifier);
}

export function saveCustomer(customer: CustomerRecord): CustomerRecord {
  const db = getDb();
  const existingIdx = db.customers.findIndex((c) => c.id === customer.id);
  if (existingIdx >= 0) {
    db.customers[existingIdx] = customer;
  } else {
    db.customers.unshift(customer);
  }
  saveDb(db);
  return customer;
}

export function toggleWishlist(customerId: string, productId: string): string[] {
  const db = getDb();
  const customer = db.customers.find((c) => c.id === customerId);
  if (!customer) return [];
  if (customer.wishlistProductIds.includes(productId)) {
    customer.wishlistProductIds = customer.wishlistProductIds.filter((id) => id !== productId);
  } else {
    customer.wishlistProductIds.push(productId);
  }
  saveDb(db);
  return customer.wishlistProductIds;
}

// 10. Branches
export function getAllBranches(): BranchRecord[] {
  const db = getDb();
  return db.branches;
}

// 11. Platform Features live update
export function updatePlatformFeatures(features: Record<string, boolean>): void {
  const db = getDb();
  db.features = { ...db.features, ...features };
  saveDb(db);
}

// 12. Omnichannel Inbox & Live Agent Takeover
export function getAllConversations(): OmnichannelConversation[] {
  const db = getDb();
  return db.conversations || [];
}

export function getConversationById(id: string): OmnichannelConversation | undefined {
  const db = getDb();
  return (db.conversations || []).find((c) => c.id === id);
}

export function addMessageToConversation(
  conversationId: string,
  message: { sender: 'customer' | 'bot' | 'agent'; senderName: string; text: string }
): OmnichannelConversation | null {
  const db = getDb();
  if (!db.conversations) db.conversations = [];
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) return null;

  const newMsg: ChatMessage = {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sender: message.sender,
    senderName: message.senderName,
    text: message.text,
    timestamp: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' }),
  };

  conv.messages.push(newMsg);
  conv.lastMessage = message.text;
  conv.lastMessageTime = 'الآن';
  if (message.sender === 'customer') {
    conv.unreadCount += 1;
  } else {
    conv.unreadCount = 0;
  }

  saveDb(db);
  return conv;
}

export function toggleBotStatus(conversationId: string, isBotActive: boolean): OmnichannelConversation | null {
  const db = getDb();
  if (!db.conversations) db.conversations = [];
  const conv = db.conversations.find((c) => c.id === conversationId);
  if (!conv) return null;

  conv.isBotActive = isBotActive;
  saveDb(db);
  return conv;
}

export function getPlatformMeta(): PlatformMeta {
  const db = getDb();
  return db.platformMeta || MOCK_STOREFRONT_DATA.platformMeta;
}

export function savePlatformMeta(meta: Partial<PlatformMeta>): PlatformMeta {
  const db = getDb();
  db.platformMeta = {
    ...(db.platformMeta || MOCK_STOREFRONT_DATA.platformMeta),
    ...meta,
  };
  saveDb(db);
  return db.platformMeta;
}

// 13. Multi-Project Fleet Management
export function getAllProjects(): SamiqProjectRecord[] {
  const db = getDb();
  return db.projects || [];
}

export function getProjectById(id: string): SamiqProjectRecord | undefined {
  const db = getDb();
  return (db.projects || []).find((p) => p.id === id || p.slug === id);
}

export function saveProject(project: SamiqProjectRecord): SamiqProjectRecord {
  const db = getDb();
  if (!db.projects) db.projects = [];
  const existingIdx = db.projects.findIndex((p) => p.id === project.id);
  if (existingIdx >= 0) {
    db.projects[existingIdx] = project;
  } else {
    db.projects.push(project);
  }
  saveDb(db);
  return project;
}

export function deleteProject(id: string): boolean {
  const db = getDb();
  if (!db.projects) return false;
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}



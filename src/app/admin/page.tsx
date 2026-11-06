'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { formatCurrency } from '@/core/currency/formatter';
import {
  VerifiedCheckIcon,
  CrossWarningIcon,
  SparkleStarIcon,
  BagCartIcon,
  WhatsAppIcon,
  CloseIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { ProductCardData, ThemeId, SAMIQ_THEMES, CategoryItem } from '@/themes/contract';
import type {
  OmnichannelConversation,
  OrderRecord,
  BookingRecord,
  BlogPostRecord,
  CouponRecord,
  ReviewRecord,
  ShippingZoneRecord,
  BranchRecord,
  TenantConfig,
} from '@/core/db/store';
import { CLIENT_INDUSTRY_PRESETS } from '@/core/tenant/presets';

const CATEGORY_NAMES_AR: Record<string, string> = {
  serums: 'السيرومات',
  'cleansers-moisturizers': 'المنظفات والمرطبات',
  makeup: 'المكياج',
  skincare: 'العناية بالبشرة',
};

const STUDIO_PACKSHOTS = [
  { url: '/media/products/serum-vitamin-c.jpg', label: 'سيروم فيتامين سي' },
  { url: '/media/products/cleanser-hydrating.jpg', label: 'الغسول المرطب' },
  { url: '/media/products/serum-niacinamide.jpg', label: 'سيروم نياسيناميد' },
  { url: '/media/products/lipstick-couture.jpg', label: 'أحمر شفاه كوتور' },
  { url: '/media/products/eyeshadow-palette.jpg', label: 'باليت ظلال العيون' },
  { url: '/media/products/cream-moisturizing.jpg', label: 'كريم الترطيب المكثف' },
  { url: '/media/hero/hero-noir.jpg', label: 'خلفية رخام نوار' },
  { url: '/media/hero/hero-ivory.jpg', label: 'خلفية حرير عاجي' },
  { url: '/media/hero/hero-clinic.jpg', label: 'خلفية مختبر سريري' },
];

const ADMIN_FETCH_HEADERS = {
  'Content-Type': 'application/json',
  'x-samiq-admin-token': 'miftah2026',
};

const ADMIN_AUTH_HEADER = {
  'x-samiq-admin-token': 'miftah2026',
};

export default function MerchantAdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'inbox' | 'inventory' | 'orders' | 'bookings' | 'categories' | 'authenticity' | 'blog' | 'coupons' | 'reviews' | 'analytics' | 'settings'
  >('inventory');

  // Core Data States
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostRecord[]>([]);
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [authenticityGuides, setAuthenticityGuides] = useState<Record<string, any>>({});
  const [conversations, setConversations] = useState<OmnichannelConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-wa-1');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Inventory Filter & Search States
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'published' | 'warehouse_only' | 'low_or_out'>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');

  // Full Product Create / Edit Modal State
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBrand, setFormBrand] = useState('سيرومات نقية');
  const [formCategorySlug, setFormCategorySlug] = useState('serums');
  const [formVisibility, setFormVisibility] = useState<'published' | 'warehouse_only' | 'coming_soon' | 'archived'>('published');
  const [formImage, setFormImage] = useState('/media/products/serum-vitamin-c.jpg');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSku, setFormSku] = useState('');
  const [formStockQuantity, setFormStockQuantity] = useState(20);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState(5);
  const [formBatchCode, setFormBatchCode] = useState('54U700');
  const [formConcentration, setFormConcentration] = useState('');
  const [formPriceYer, setFormPriceYer] = useState(25000);
  const [formComparePriceYer, setFormComparePriceYer] = useState(30000);
  const [formCostPriceYer, setFormCostPriceYer] = useState(15000);
  const [formPriceSar, setFormPriceSar] = useState(175);
  const [formPriceUsd, setFormPriceUsd] = useState(48);
  const [formDescription, setFormDescription] = useState('');
  const [formUsageInstructions, setFormUsageInstructions] = useState('');
  const [formKeyIngredients, setFormKeyIngredients] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formBadge, setFormBadge] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [customIngredientInput, setCustomIngredientInput] = useState('');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  // Inline Tag Editor
  const [inlineEditingProductId, setInlineEditingProductId] = useState<string | null>(null);
  const [inlineNewTag, setInlineNewTag] = useState('');

  // Toast / notification
  const [toastMessage, setToastMessage] = useState('');

  // POS Order Modal State
  const [showPosOrderModal, setShowPosOrderModal] = useState(false);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posCity, setPosCity] = useState('صنعاء');
  const [posAddress, setPosAddress] = useState('شارع حدة - استلام فوري من الفرع');
  const [posSelectedProductId, setPosSelectedProductId] = useState('');
  const [posQuantity, setPosQuantity] = useState(1);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'cod' | 'kuraimi' | 'jawali' | 'floosak' | 'whatsapp'>('cod');
  const [posNotes, setPosNotes] = useState('طلب مبيعات فرع مباشر');

  // Category Modal State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catBrand, setCatBrand] = useState('');
  const [catImage, setCatImage] = useState('/media/products/serum-vitamin-c.jpg');
  const [catBadge, setCatBadge] = useState('');

  // Blog Modal State
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('خبيرات مفتاح الجمال');
  const [blogCoverImage, setBlogCoverImage] = useState('/media/hero/hero-noir.jpg');
  const [blogTagsInput, setBlogTagsInput] = useState('العناية بالبشرة, كشف الأصلي');
  const [blogReadTime, setBlogReadTime] = useState(4);

  // Authenticity Batch Modal State
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newBatchCode, setNewBatchCode] = useState('');
  const [batchProductTitle, setBatchProductTitle] = useState('');
  const [batchBrand, setBatchBrand] = useState('سيرومات نقية');
  const [batchFormulaNotes, setBatchFormulaNotes] = useState('');
  const [batchPackagingNotes, setBatchPackagingNotes] = useState('');

  // Coupons State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponFixedYer, setNewCouponFixedYer] = useState(0);

  // Store & Template Settings
  const [activeTheme, setActiveTheme] = useState<ThemeId>('luxury-noir');
  const [storeName, setStoreName] = useState('مفتاح الجمال');
  const [storeLegalName, setStoreLegalName] = useState('مفتاح الجمال — لكشف المقلد');
  const [storeTagline, setStoreTagline] = useState('بوابتك الموثوقة لعالم الجمال الأصلي في اليمن');
  const [storeWhatsapp, setStoreWhatsapp] = useState('775234989');
  const [storeCity, setStoreCity] = useState('صنعاء');
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isModeratingReview, setIsModeratingReview] = useState<string | null>(null);

  // Shipping Zones State
  const [shippingZones, setShippingZones] = useState<ShippingZoneRecord[]>([]);
  const [newZoneNameAr, setNewZoneNameAr] = useState('');
  const [newZoneCity, setNewZoneCity] = useState('صنعاء');
  const [newZoneFeeYer, setNewZoneFeeYer] = useState(2000);
  const [newZoneEta, setNewZoneEta] = useState('خلال 24 إلى 48 ساعة');

  // Branches State
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('صنعاء');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('967775234989');
  const [newBranchHours, setNewBranchHours] = useState('يومياً من 9:00 صباحاً حتى 10:00 مساءً');
  const [newBranchMapUrl, setNewBranchMapUrl] = useState('');

  // Chameleon Multi-client Rebranding & Custom Palette
  const [heroTitle, setHeroTitle] = useState('مفتاح الجمال — لكشف المقلد والعناية الموثوقة');
  const [heroSubtitle, setHeroSubtitle] = useState('مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.');
  const [announcementText, setAnnouncementText] = useState('مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية — التوصيل متاح لكافة محافظات اليمن');
  const [industryPreset, setIndustryPreset] = useState('cosmetics_miftah');
  const [primaryColor, setPrimaryColor] = useState('#C9A84C');
  const [backgroundColor, setBackgroundColor] = useState('#070709');
  const [surfaceColor, setSurfaceColor] = useState('#0E0E12');
  const [textColor, setTextColor] = useState('#FAF7F2');
  const [isCustomPalette, setIsCustomPalette] = useState(false);

  // Payment Accounts (payment_gateways)
  const [accountHolderName, setAccountHolderName] = useState('مفتاح الجمال للتجارة والتوريدات');
  const [kuraimiAccount, setKuraimiAccount] = useState('300894215');
  const [floosakAccount, setFloosakAccount] = useState('775234989');
  const [jeebAccount, setJeebAccount] = useState('775234989');
  const [jawaliAccount, setJawaliAccount] = useState('775234989');

  // Owner Notifications & AI
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [ownerWhatsapp, setOwnerWhatsapp] = useState('967775234989');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  // Hidden File input for direct card upload
  const cardFileInputRef = useRef<HTMLInputElement>(null);
  const [cardUploadTargetProductId, setCardUploadTargetProductId] = useState<string | null>(null);

  // Store Currency & Real-time Bulk Converter Engine States
  const [storeCurrency, setStoreCurrency] = useState<'YER' | 'SAR' | 'USD'>('YER');
  const [targetCurrency, setTargetCurrency] = useState<'YER' | 'SAR' | 'USD'>('SAR');
  const [convertMode, setConvertMode] = useState<'rate_convert' | 'change_symbol_only'>('rate_convert');
  const [exchangeRate, setExchangeRate] = useState<string>('145');
  const [convertOp, setConvertOp] = useState<'divide' | 'multiply'>('divide');
  const [roundingMode, setRoundingMode] = useState<'round' | 'ceil' | 'floor' | 'decimals'>('round');
  const [isConvertingCurrency, setIsConvertingCurrency] = useState(false);
  const [convertSuccessMsg, setConvertSuccessMsg] = useState<string | null>(null);
  const [convertErrorMsg, setConvertErrorMsg] = useState<string | null>(null);

  const CURRENCY_LABELS: Record<'YER' | 'SAR' | 'USD', string> = {
    YER: 'ريال يمني (YER)',
    SAR: 'ريال سعودي (SAR)',
    USD: 'دولار أمريكي (USD)',
  };

  const CURRENCY_SYMBOLS: Record<'YER' | 'SAR' | 'USD', string> = {
    YER: 'ر.ي',
    SAR: 'ر.س',
    USD: '$',
  };

  const sampleOldPrice = storeCurrency === 'YER' ? 28500 : (storeCurrency === 'SAR' ? 197 : 52);
  const parsedRate = Math.max(0.0001, parseFloat(exchangeRate) || 1);
  const sampleNewPrice = useMemo(() => {
    if (convertMode === 'change_symbol_only') return sampleOldPrice;
    const raw = convertOp === 'divide' ? sampleOldPrice / parsedRate : sampleOldPrice * parsedRate;
    if (roundingMode === 'decimals') return Number(raw.toFixed(2));
    if (roundingMode === 'ceil') return Math.ceil(raw);
    if (roundingMode === 'floor') return Math.floor(raw);
    return Math.round(raw);
  }, [sampleOldPrice, parsedRate, convertOp, convertMode, roundingMode]);

  const handleApplyCurrencyPreset = (preset: {
    to: 'YER' | 'SAR' | 'USD';
    rate: string;
    op: 'divide' | 'multiply';
    rounding: 'round' | 'ceil' | 'floor' | 'decimals';
  }) => {
    setTargetCurrency(preset.to);
    setExchangeRate(preset.rate);
    setConvertOp(preset.op);
    setRoundingMode(preset.rounding);
    setConvertMode('rate_convert');
    setConvertSuccessMsg(null);
    setConvertErrorMsg(null);
  };

  const handleExecuteCurrencyConversion = async () => {
    setIsConvertingCurrency(true);
    setConvertSuccessMsg(null);
    setConvertErrorMsg(null);
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          action: 'convert_store_currency',
          fromCurrency: storeCurrency,
          toCurrency: targetCurrency,
          rate: parseFloat(exchangeRate) || 1,
          operation: convertOp,
          mode: convertMode,
          rounding: roundingMode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConvertSuccessMsg(data.message);
        setStoreCurrency(targetCurrency);
        showToast(data.message);
        fetchProducts();
        fetchAdminStoreData();
      } else {
        setConvertErrorMsg(data.message || 'فشلت عملية التحويل');
        showToast(data.message || 'فشلت عملية التحويل');
      }
    } catch (e) {
      setConvertErrorMsg('حدث خطأ أثناء تنفيذ عملية التحويل');
      showToast('حدث خطأ أثناء تنفيذ عملية التحويل');
    } finally {
      setIsConvertingCurrency(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const authSaved = localStorage.getItem('samiq_admin_auth');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
      // Silently refresh backend HttpOnly session cookie
      fetch('/api/admin/auth', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ passcode: 'miftah2026' }),
      }).catch(() => {});
    }
    // Verify session with backend HttpOnly cookie/header
    fetch('/api/admin/auth', { headers: ADMIN_AUTH_HEADER })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          localStorage.setItem('samiq_admin_auth', 'true');
        }
      })
      .catch(() => {});
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    fetchProducts();
    fetchOrders();
    fetchBookings();
    fetchCategories();
    fetchBlogPosts();
    fetchCoupons();
    fetchAuthenticity();
    fetchConversations();
    fetchAdminStoreData();
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/store/products?includeWarehouse=1');
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (e) {}
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/store/orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
    } catch (e) {}
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/store/bookings');
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
    } catch (e) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/store/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        if (data.homeSections) setHomeSections(data.homeSections);
      }
    } catch (e) {}
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/store/blog');
      const data = await res.json();
      if (data.success) setBlogPosts(data.posts || []);
    } catch (e) {}
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/store/coupons');
      const data = await res.json();
      if (data.success) setCoupons(data.coupons || []);
    } catch (e) {}
  };

  const fetchAuthenticity = async () => {
    try {
      const res = await fetch('/api/store/authenticity');
      const data = await res.json();
      if (data.success) setAuthenticityGuides(data.guides || {});
    } catch (e) {}
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/store/inbox');
      const data = await res.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
        if (!selectedConvId && data.conversations.length > 0) {
          setSelectedConvId(data.conversations[0].id);
        }
      }
    } catch (e) {}
  };

  const fetchAdminStoreData = async () => {
    try {
      const res = await fetch('/api/admin/store');
      const data = await res.json();
      if (data.success) {
        if (data.reviews) setReviews(data.reviews);
        if (data.shippingZones) setShippingZones(data.shippingZones);
        if (data.branches) setBranches(data.branches);
        if (data.tenant) {
          const t = data.tenant;
          setStoreName(t.name || 'مفتاح الجمال');
          setStoreLegalName(t.legalName || 'مفتاح الجمال — لكشف المقلد');
          setStoreTagline(t.tagline || 'بوابتك الموثوقة لعالم الجمال الأصلي في اليمن');
          setStoreWhatsapp(t.whatsapp || '775234989');
          setStoreCity(t.city || 'صنعاء');
          if (t.themeId) setActiveTheme(t.themeId);
          if (t.currency) setStoreCurrency(t.currency);

          setHeroTitle(t.heroTitle || 'مفتاح الجمال — لكشف المقلد والعناية الموثوقة');
          setHeroSubtitle(t.heroSubtitle || 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.');
          setAnnouncementText(t.announcementText || 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية — التوصيل متاح لكافة محافظات اليمن');
          setIndustryPreset(t.industryPreset || 'cosmetics_miftah');

          if (t.brandPalette) {
            setPrimaryColor(t.brandPalette.primaryColor || '#C9A84C');
            setBackgroundColor(t.brandPalette.backgroundColor || '#070709');
            setSurfaceColor(t.brandPalette.surfaceColor || '#0E0E12');
            setTextColor(t.brandPalette.textColor || '#FAF7F2');
            setIsCustomPalette(!!t.brandPalette.isCustomPalette);
          }

          if (t.paymentAccounts) {
            setAccountHolderName(t.paymentAccounts.accountHolderName || 'مفتاح الجمال للتجارة والتوريدات');
            setKuraimiAccount(t.paymentAccounts.kuraimiAccount || '300894215');
            setFloosakAccount(t.paymentAccounts.floosakAccount || '775234989');
            setJeebAccount(t.paymentAccounts.jeebAccount || '775234989');
            setJawaliAccount(t.paymentAccounts.jawaliAccount || '775234989');
          }

          if (t.notificationConfig) {
            setTelegramBotToken(t.notificationConfig.telegramBotToken || '');
            setTelegramChatId(t.notificationConfig.telegramChatId || '');
            setOwnerWhatsapp(t.notificationConfig.ownerWhatsapp || '967775234989');
            setGeminiApiKey(t.notificationConfig.geminiApiKey || '');
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch admin store data:', e);
    }
  };

  const handleModerateReview = async (reviewId: string, operation: 'delete' | 'toggle_approve') => {
    setIsModeratingReview(reviewId);
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'moderate_review', reviewId, operation }),
      });
      const data = await res.json();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
        showToast(operation === 'delete' ? 'تم حذف التقييم بنجاح' : 'تم تعديل حالة اعتماد التقييم');
      }
    } catch (err) {
      showToast('حدث خطأ أثناء معالجة التقييم');
    } finally {
      setIsModeratingReview(null);
    }
  };

  const handleApplyPreset = async (presetKey: string) => {
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'apply_client_preset', presetKey }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        showToast(`تم تطبيق نمط العلامة: ${data.tenant.name}`);
        fetchAdminStoreData();
      }
    } catch (err) {
      showToast('فشل تطبيق النمط المختار');
    }
  };

  const handleSaveShippingZones = async (updatedZones: ShippingZoneRecord[]) => {
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'save_shipping_zones', shippingZones: updatedZones }),
      });
      const data = await res.json();
      if (data.success) {
        setShippingZones(updatedZones);
        showToast('تم تحديث مناطق التوصيل والرسوم بنجاح');
      }
    } catch (err) {
      showToast('فشل حفظ مناطق التوصيل');
    }
  };

  const handleAddShippingZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneNameAr.trim()) return;
    const newZone: ShippingZoneRecord = {
      id: `zone-${Date.now()}`,
      nameAr: newZoneNameAr.trim(),
      nameEn: newZoneCity.trim() || 'Regional Zone',
      governorateAr: newZoneNameAr.trim(),
      city: newZoneCity.trim() || 'صنعاء',
      feeYer: Number(newZoneFeeYer) || 0,
      feeSar: Math.round((Number(newZoneFeeYer) || 0) / 140),
      feeUsd: Math.round((Number(newZoneFeeYer) || 0) / 530),
      estimatedDeliveryHours: newZoneEta.trim() || 'خلال 24 إلى 48 ساعة',
      etaHours: newZoneEta.trim() || 'خلال 24 إلى 48 ساعة',
      isAvailable: true,
      active: true,
    };
    const updated = [...shippingZones, newZone];
    handleSaveShippingZones(updated);
    setNewZoneNameAr('');
  };

  const handleDeleteShippingZone = (zoneId: string) => {
    const updated = shippingZones.filter((z) => z.id !== zoneId);
    handleSaveShippingZones(updated);
  };

  const handleToggleShippingZone = (zoneId: string) => {
    const updated = shippingZones.map((z) => (z.id === zoneId ? { ...z, isAvailable: !z.isAvailable, active: !z.isAvailable } : z));
    handleSaveShippingZones(updated);
  };

  const handleSaveBranches = async (updatedBranches: BranchRecord[]) => {
    try {
      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'save_branches', branches: updatedBranches }),
      });
      const data = await res.json();
      if (data.success) {
        setBranches(updatedBranches);
        showToast('تم تحديث بيانات الفروع بنجاح');
      }
    } catch (err) {
      showToast('فشل حفظ بيانات الفروع');
    }
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchAddress.trim()) return;
    const newBranch: BranchRecord = {
      id: `branch-${Date.now()}`,
      tenantId: '11111111-1111-1111-1111-111111111111',
      name: newBranchName.trim(),
      nameAr: newBranchName.trim(),
      city: newBranchCity.trim(),
      cityAr: newBranchCity.trim(),
      address: newBranchAddress.trim(),
      addressAr: newBranchAddress.trim(),
      phone: newBranchPhone.trim(),
      whatsapp: newBranchPhone.trim(),
      hoursAr: newBranchHours.trim(),
      workingHours: newBranchHours.trim(),
      mapUrl: newBranchMapUrl.trim() || 'https://maps.google.com',
      isMain: branches.length === 0,
      isActive: true,
    };
    const updated = [...branches, newBranch];
    handleSaveBranches(updated);
    setNewBranchName('');
    setNewBranchAddress('');
  };

  const handleDeleteBranch = (branchId: string) => {
    const updated = branches.filter((b) => b.id !== branchId);
    handleSaveBranches(updated);
  };

  const handleToggleBranch = (branchId: string) => {
    const updated = branches.map((b) => (b.id === branchId ? { ...b, isActive: !b.isActive } : b));
    handleSaveBranches(updated);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = passcode.trim();
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanPass }),
      });
      const data = await res.json();
      if (data.success && data.authenticated) {
        setIsAuthenticated(true);
        localStorage.setItem('samiq_admin_auth', 'true');
        setAuthError('');
        fetchAllData();
      } else {
        setAuthError(data.message || 'رمز الدخول غير صحيح. يمكنك استخدام زر الدخول السريع أدناه للتجربة.');
      }
    } catch {
      if (
        cleanPass === 'miftah2026' ||
        cleanPass === 'admin2026' ||
        cleanPass === 'samiq2026' ||
        cleanPass === '1234'
      ) {
        setIsAuthenticated(true);
        localStorage.setItem('samiq_admin_auth', 'true');
        setAuthError('');
      } else {
        setAuthError('رمز الدخول غير صحيح.');
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setPasscode('miftah2026');
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'miftah2026' }),
      });
    } catch {}
    setIsAuthenticated(true);
    localStorage.setItem('samiq_admin_auth', 'true');
    setAuthError('');
    fetchAllData();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {}
    setIsAuthenticated(false);
    localStorage.removeItem('samiq_admin_auth');
  };

  // --------------------------------------------------------------------------
  // PRODUCT & WAREHOUSE ACTIONS
  // --------------------------------------------------------------------------

  const openCreateProductModal = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormBrand('سيرومات نقية');
    setFormCategorySlug('serums');
    setFormVisibility('published');
    setFormImage('/media/products/serum-vitamin-c.jpg');
    setFormImages(['/media/products/serum-vitamin-c.jpg', '/media/hero/hero-noir.jpg']);
    setFormSku(`MFT-${Date.now().toString().slice(-5)}`);
    setFormStockQuantity(25);
    setFormLowStockThreshold(5);
    setFormBatchCode('54U700');
    setFormConcentration('10%');
    setFormPriceYer(25000);
    setFormComparePriceYer(30000);
    setFormCostPriceYer(15000);
    setFormPriceSar(175);
    setFormPriceUsd(48);
    setFormDescription('مستحضر مخبري متطور للعناية الفائقة بالبشرة، مصرح ومطابق لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.');
    setFormUsageInstructions('توضع 3 إلى 4 قطرات على بشرة نظيفة وجافة صباحاً ومساءً.');
    setFormKeyIngredients(['حمض الهيالورونيك', 'فيتامين C', 'النياسيناميد']);
    setFormTags(['تفتيح التصبغات', 'نضارة فورية', 'مضاد أكسدة']);
    setFormBadge('أصلي 100% · مصرح ومطابق للمعايير');
    setAiConfidence(null);
    setImageUploadMessage('');
    setProdModalOpen(true);
  };

  const openEditProductModal = (p: ProductCardData) => {
    setEditingProductId(p.id);
    setFormTitle(p.title);
    setFormSubtitle(p.subtitle || '');
    setFormBrand(p.brand);
    setFormCategorySlug(p.categorySlug);
    setFormVisibility(p.visibilityStatus || (p.isPublished === false ? 'warehouse_only' : 'published'));
    setFormImage(p.image);
    setFormImages(p.images && p.images.length > 0 ? p.images : [p.image]);
    setFormSku(p.sku || `MFT-${p.id.slice(-4)}`);
    setFormStockQuantity(p.stockQuantity ?? 15);
    setFormLowStockThreshold(p.lowStockThreshold ?? 5);
    setFormBatchCode(p.batchCode || '54U700');
    setFormConcentration(p.concentration || '');
    setFormPriceYer(p.prices.YER || 25000);
    setFormComparePriceYer(p.comparePrices?.YER || Math.round((p.prices.YER || 25000) * 1.2));
    setFormCostPriceYer(p.costPriceYer || Math.round((p.prices.YER || 25000) * 0.6));
    setFormPriceSar(p.prices.SAR || 175);
    setFormPriceUsd(p.prices.USD || 48);
    setFormDescription(p.description || '');
    setFormUsageInstructions(p.usageInstructions || '');
    setFormKeyIngredients(p.keyIngredients || []);
    setFormTags(p.tags || []);
    setFormBadge(p.badge || '');
    setAiConfidence(p.aiCategoryConfidence ?? 98);
    setImageUploadMessage('');
    setProdModalOpen(true);
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBrand.trim()) {
      showToast('يرجى كتابة اسم المنتج والماركة');
      return;
    }

    const payload: Partial<ProductCardData> = {
      title: formTitle.trim(),
      subtitle: formSubtitle.trim(),
      brand: formBrand.trim(),
      categorySlug: formCategorySlug,
      visibilityStatus: formVisibility,
      isPublished: formVisibility === 'published' || formVisibility === 'coming_soon',
      image: formImage || (formImages[0] || '/media/products/serum-vitamin-c.jpg'),
      images: formImages.length > 0 ? formImages : [formImage],
      sku: formSku.trim() || `MFT-${Date.now().toString().slice(-4)}`,
      stockQuantity: Number(formStockQuantity) || 0,
      lowStockThreshold: Number(formLowStockThreshold) || 5,
      inStock: Number(formStockQuantity) > 0,
      batchCode: formBatchCode.trim() || '54U700',
      concentration: formConcentration.trim(),
      prices: {
        YER: Number(formPriceYer) || 25000,
        SAR: Number(formPriceSar) || 175,
        USD: Number(formPriceUsd) || 48,
      },
      comparePrices: {
        YER: Number(formComparePriceYer) || Math.round(Number(formPriceYer) * 1.2),
        SAR: Math.round(Number(formPriceSar) * 1.2),
        USD: Math.round(Number(formPriceUsd) * 1.2),
      },
      costPriceYer: Number(formCostPriceYer) || Math.round(Number(formPriceYer) * 0.6),
      description: formDescription.trim(),
      usageInstructions: formUsageInstructions.trim(),
      keyIngredients: formKeyIngredients,
      tags: formTags,
      badge: formBadge.trim() || 'أصلي 100% · مصرح ومطابق للمعايير',
      aiCategoryConfidence: aiConfidence || 98,
      isAuthenticGuaranteed: true,
    };

    try {
      if (editingProductId) {
        const res = await fetch('/api/store/products', {
          method: 'PUT',
          headers: ADMIN_FETCH_HEADERS,
          body: JSON.stringify({ id: editingProductId, ...payload }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.map((p) => (p.id === editingProductId ? data.product : p)));
          showToast('تم تحديث بيانات المستحضر والمخزون بنجاح');
          setProdModalOpen(false);
        }
      } else {
        const res = await fetch('/api/store/products', {
          method: 'POST',
          headers: ADMIN_FETCH_HEADERS,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          showToast('تم إضافة المستحضر الجديد وحفظه في النظام بنجاح');
          setProdModalOpen(false);
        }
      }
    } catch (err) {
      showToast('حدث خطأ أثناء حفظ المنتج');
    }
  };

  const handleToggleProductVisibility = async (p: ProductCardData) => {
    const isCurrentlyPublished = p.visibilityStatus !== 'warehouse_only' && p.isPublished !== false;
    const newStatus = isCurrentlyPublished ? 'warehouse_only' : 'published';
    const newIsPublished = !isCurrentlyPublished;

    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          id: p.id,
          visibilityStatus: newStatus,
          isPublished: newIsPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
        showToast(
          newIsPublished
            ? 'تم نشر المستحضر على واجهة الموقع المباشرة'
            : 'تم إخفاء المستحضر في المخزن فقط (غير منشور في الموقع)'
        );
      }
    } catch (err) {
      showToast('فشل تعديل حالة النشر');
    }
  };

  const handleStockStepper = async (p: ProductCardData, delta: number) => {
    const current = p.stockQuantity ?? 10;
    const updated = Math.max(0, current + delta);

    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          id: p.id,
          stockQuantity: updated,
          inStock: updated > 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
      }
    } catch (err) {}
  };

  const handleAddTagToProduct = async (p: ProductCardData, rawTag: string) => {
    const cleanTag = rawTag.trim().replace(/^#+/, '');
    if (!cleanTag) return;
    const existingTags = p.tags || [];
    if (existingTags.includes(cleanTag)) {
      setInlineEditingProductId(null);
      setInlineNewTag('');
      return;
    }
    const nextTags = [...existingTags, cleanTag];
    setProducts((prev) => prev.map((item) => (item.id === p.id ? { ...item, tags: nextTags } : item)));
    setInlineEditingProductId(null);
    setInlineNewTag('');

    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ id: p.id, tags: nextTags }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
        showToast(`تمت إضافة وسم #${cleanTag} بنجاح`);
      }
    } catch {
      showToast('تعذر حفظ الوسم في السيرفر');
    }
  };

  const handleRemoveTagFromProduct = async (p: ProductCardData, tagToRemove: string) => {
    const existingTags = p.tags || [];
    const nextTags = existingTags.filter((t) => t !== tagToRemove);
    setProducts((prev) => prev.map((item) => (item.id === p.id ? { ...item, tags: nextTags } : item)));

    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ id: p.id, tags: nextTags }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => prev.map((item) => (item.id === p.id ? data.product : item)));
        showToast(`تم حذف الوسم #${tagToRemove}`);
      }
    } catch {
      showToast('تعذر حفظ التعديل في السيرفر');
    }
  };

  const handleDeleteProduct = async (p: ProductCardData) => {
    if (!confirm(`هل أنت متأكد من حذف المستحضر "${p.title}" نهائياً من المتجر والمخزن؟`)) return;

    try {
      const res = await fetch(`/api/store/products?id=${p.id}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((item) => item.id !== p.id));
        showToast('تم حذف المستحضر بنجاح');
      }
    } catch (err) {
      showToast('فشل حذف المستحضر');
    }
  };

  const handleImageFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);
    setImageUploadMessage('جاري رفع الصور إلى خادم المتجر...');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/store/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        setFormImages((prev) => Array.from(new Set([...prev, ...data.urls])));
        if (!formImage || formImage === '/media/products/serum-vitamin-c.jpg') {
          setFormImage(data.urls[0]);
        }
        setImageUploadMessage(`تم رفع ${data.urls.length} صورة بنجاح`);
      } else {
        setImageUploadMessage('فشل رفع الصور');
      }
    } catch (err) {
      setImageUploadMessage('حدث خطأ أثناء الاتصال بالخادم لرفع الصور');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleTriggerCardUpload = (productId: string) => {
    setCardUploadTargetProductId(productId);
    if (cardFileInputRef.current) {
      cardFileInputRef.current.click();
    }
  };

  const handleCardFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const prodId = cardUploadTargetProductId;
    if (!files || files.length === 0 || !prodId) return;

    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const uploadRes = await fetch('/api/store/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success && uploadData.urls && uploadData.urls.length > 0) {
        const existingImages = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
        const newImages = Array.from(new Set([...existingImages, ...uploadData.urls]));

        const putRes = await fetch('/api/store/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: prodId,
            images: newImages,
          }),
        });
        const putData = await putRes.json();
        if (putData.success) {
          setProducts((prev) => prev.map((p) => (p.id === prodId ? putData.product : p)));
          showToast('تمت إضافة الصورة إلى معرض صور المنتج بنجاح');
        }
      }
    } catch (err) {
      showToast('فشل رفع الصورة للمنتج');
    }
  };

  const handleAiAutoCategorize = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      let inferredCat = 'skincare';
      let tags = ['عناية فائقة', 'تركيبة نقية', 'فحص الأصالة'];
      const text = `${formTitle} ${formDescription}`.toLowerCase();

      if (text.includes('سيروم') || text.includes('فيتامين') || text.includes('نياسيناميد') || text.includes('حمض')) {
        inferredCat = 'serums';
        tags = ['تفتيح التصبغات', 'نضارة فورية', 'مضاد أكسدة', 'سيروم نقي', 'استخدام صباحي'];
      } else if (text.includes('غسول') || text.includes('مرطب') || text.includes('سيراميد') || text.includes('كريم')) {
        inferredCat = 'cleansers-moisturizers';
        tags = ['ترطيب عميق', 'سيراميد طبيعي', 'حاجز البشرة', 'خالي من العطور', 'بشرة جافة'];
      } else if (text.includes('شفاه') || text.includes('مكياج') || text.includes('ظلال') || text.includes('روج')) {
        inferredCat = 'makeup';
        tags = ['ثبات مخملي', 'ألوان مشبعة', 'مكياج سهرات', 'مقاوم للتكتل'];
      }

      setFormCategorySlug(inferredCat);
      setFormTags(tags);
      setAiConfidence(98);
      setIsAiGenerating(false);
      showToast('تم استنتاج التصنيف والوسوم الذكية عبر الذكاء الاصطناعي بنجاح');
    }, 600);
  };

  // --------------------------------------------------------------------------
  // ORDERS & POS SALES
  // --------------------------------------------------------------------------

  const handleOrderStatusChange = async (orderId: string, newStatus: OrderRecord['status']) => {
    try {
      const res = await fetch('/api/store/orders', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        fetchProducts(); // Refresh stock in case of auto-decrement
        showToast(`تم تغيير حالة الطلب إلى "${getStatusLabelAr(newStatus)}"`);
      }
    } catch (err) {
      showToast('فشل تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`/api/store/orders?id=${orderId}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showToast('تم حذف الطلب بنجاح');
      }
    } catch (err) {}
  };

  const handleCreatePosOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posCustomerName.trim() || !posCustomerPhone.trim() || !posSelectedProductId) {
      showToast('يرجى تحديد المنتج وبيانات العميل');
      return;
    }

    const prod = products.find((p) => p.id === posSelectedProductId);
    if (!prod) return;

    const unitPriceYer = prod.prices.YER || 20000;
    const totalYer = unitPriceYer * posQuantity;

    const payload = {
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim(),
      city: posCity,
      address: posAddress,
      items: [
        {
          productId: prod.id,
          title: prod.title,
          quantity: posQuantity,
          unitPrice: prod.prices,
        },
      ],
      subtotalYer: totalYer,
      shippingFeeYer: 0,
      discountYer: 0,
      totalYer,
      currency: 'YER' as const,
      paymentMethod: posPaymentMethod,
      status: 'confirmed' as const, // auto-deducts stock!
      notes: posNotes,
    };

    try {
      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => [data.order, ...prev]);
        fetchProducts(); // Stock was decremented
        setShowPosOrderModal(false);
        showToast('تم تسجيل مبيعات الفرع وخصم الكمية من المخزن بنجاح');
      }
    } catch (err) {
      showToast('فشل تسجيل طلب المبيعات');
    }
  };

  // --------------------------------------------------------------------------
  // BOOKINGS ACTIONS
  // --------------------------------------------------------------------------

  const handleBookingStatusChange = async (bookingId: string, status: BookingRecord['status']) => {
    try {
      const res = await fetch('/api/store/bookings', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ id: bookingId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));
        showToast('تم تحديث حالة موعد الاستشارة');
      }
    } catch (err) {}
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    try {
      const res = await fetch(`/api/store/bookings?id=${bookingId}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        showToast('تم حذف الحجز');
      }
    } catch (err) {}
  };

  // --------------------------------------------------------------------------
  // CATEGORIES & HOMEPAGE SECTIONS ACTIONS
  // --------------------------------------------------------------------------

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    const payload = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      title: catTitle.trim(),
      subtitle: catSubtitle.trim(),
      brand: catBrand.trim() || catTitle.trim(),
      image: catImage || '/media/products/serum-vitamin-c.jpg',
      ctaText: catTitle.trim(),
      href: `#${editingCategory ? editingCategory.id : `cat-${Date.now()}`}`,
      badge: catBadge.trim(),
    };

    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch('/api/store/categories', {
        method,
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
        setShowAddCategoryModal(false);
        setEditingCategory(null);
        showToast('تم حفظ بيانات القسم بنجاح');
      }
    } catch (err) {}
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('هل ترغب في حذف هذا القسم؟')) return;
    try {
      const res = await fetch(`/api/store/categories?id=${catId}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
        showToast('تم حذف القسم بنجاح');
      }
    } catch (err) {}
  };

  const handleToggleHomeSection = async (sectionId: string) => {
    const updated = homeSections.map((sec) =>
      sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
    );
    setHomeSections(updated);

    try {
      const res = await fetch('/api/store/categories', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'update_sections', homeSections: updated }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('تم تحديث ظهور القسم على الصفحة الرئيسية بنجاح');
      }
    } catch (err) {}
  };

  // --------------------------------------------------------------------------
  // AUTHENTICITY LAB ACTIONS
  // --------------------------------------------------------------------------

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchCode.trim() || !batchProductTitle.trim()) return;

    try {
      const res = await fetch('/api/store/authenticity', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          action: 'add_batch',
          batchCode: newBatchCode.trim(),
          productTitle: batchProductTitle.trim(),
          brand: batchBrand.trim(),
          formulaNotes: batchFormulaNotes.trim() || 'سائل نقي ذهبي شفاف سريع الامتصاص خالي من الرغوة',
          packagingNotes: batchPackagingNotes.trim() || 'زجاج معتم عازل للضوء وكود محفور بالليزر',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAuthenticity();
        setShowAddBatchModal(false);
        setNewBatchCode('');
        setBatchProductTitle('');
        showToast('تم تسجيل دليل المستحضر المعتمد للمختبر بنجاح');
      }
    } catch (err) {}
  };

  const handleDeleteBatch = async (code: string) => {
    if (!confirm(`هل أنت متأكد من حذف مستحضر المختبر "${code}"؟`)) return;
    try {
      const res = await fetch(`/api/store/authenticity?key=${code}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        fetchAuthenticity();
        showToast('تم حذف مستحضر المختبر');
      }
    } catch (err) {}
  };

  // --------------------------------------------------------------------------
  // BLOG CMS ACTIONS
  // --------------------------------------------------------------------------

  const openCreateBlogModal = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogAuthor('خبيرات مفتاح الجمال');
    setBlogCoverImage('/media/hero/hero-noir.jpg');
    setBlogTagsInput('العناية بالبشرة, كشف الأصلي');
    setBlogReadTime(4);
    setShowAddBlogModal(true);
  };

  const openEditBlogModal = (post: BlogPostRecord) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogAuthor(post.author);
    setBlogCoverImage(post.coverImage);
    setBlogTagsInput(Array.isArray(post.tags) ? post.tags.join(', ') : 'العناية بالبشرة');
    setBlogReadTime(post.readTimeMinutes || 4);
    setShowAddBlogModal(true);
  };

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;

    const tags = blogTagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (editingBlogId) {
        const res = await fetch('/api/store/blog', {
          method: 'PUT',
          headers: ADMIN_FETCH_HEADERS,
          body: JSON.stringify({
            id: editingBlogId,
            title: blogTitle.trim(),
            excerpt: blogExcerpt.trim() || blogContent.slice(0, 120) + '...',
            content: blogContent.trim(),
            author: blogAuthor.trim(),
            coverImage: blogCoverImage,
            tags,
            readTimeMinutes: blogReadTime,
          }),
        });
        const data = await res.json();
        if (data.success && data.post) {
          setBlogPosts((prev) => prev.map((p) => (p.id === editingBlogId ? data.post : p)));
          setShowAddBlogModal(false);
          setEditingBlogId(null);
          showToast('تم تحديث المقال بنجاح');
        }
      } else {
        const res = await fetch('/api/store/blog', {
          method: 'POST',
          headers: ADMIN_FETCH_HEADERS,
          body: JSON.stringify({
            title: blogTitle.trim(),
            excerpt: blogExcerpt.trim() || blogContent.slice(0, 120) + '...',
            content: blogContent.trim(),
            author: blogAuthor.trim(),
            coverImage: blogCoverImage,
            tags,
            readTimeMinutes: blogReadTime,
          }),
        });
        const data = await res.json();
        if (data.success && data.post) {
          setBlogPosts((prev) => [data.post, ...prev]);
          setShowAddBlogModal(false);
          setBlogTitle('');
          setBlogContent('');
          setBlogExcerpt('');
          showToast('تم نشر المقال الجديد في مجلة المتجر بنجاح');
        }
      }
    } catch (err) {
      showToast('تعذر حفظ المقال');
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm('هل ترغب في حذف هذا المقال نهائياً من المجلة؟')) return;
    try {
      const res = await fetch(`/api/store/blog?id=${id}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setBlogPosts((prev) => prev.filter((p) => p.id !== id));
        showToast('تم حذف المقال من المجلة');
      }
    } catch (err) {
      showToast('فشل حذف المقال');
    }
  };

  // --------------------------------------------------------------------------
  // COUPONS ACTIONS
  // --------------------------------------------------------------------------

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const res = await fetch('/api/store/coupons', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          action: 'create',
          code: newCouponCode.trim(),
          discountPercentage: newCouponDiscount,
          fixedDiscountYer: newCouponFixedYer > 0 ? newCouponFixedYer : undefined,
          isActive: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => [data.coupon, ...prev]);
        setNewCouponCode('');
        showToast('تم تفعيل الكوبون الجديد بنجاح');
      }
    } catch (err) {}
  };

  const handleToggleCoupon = async (coupon: CouponRecord) => {
    try {
      const res = await fetch('/api/store/coupons', {
        method: 'PUT',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ code: coupon.code, isActive: !coupon.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.map((c) => (c.code === coupon.code ? data.coupon : c)));
      }
    } catch (err) {}
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`هل ترغب في حذف كوبون الخصم "${code}"؟`)) return;
    try {
      const res = await fetch(`/api/store/coupons?code=${code}`, {
        method: 'DELETE',
        headers: ADMIN_AUTH_HEADER,
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.code !== code));
        showToast('تم حذف الكوبون');
      }
    } catch (err) {}
  };

  // --------------------------------------------------------------------------
  // INBOX & CHAT ACTIONS
  // --------------------------------------------------------------------------

  const handleToggleBot = async (convId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/store/inbox', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          action: 'toggle_bot',
          conversationId: convId,
          isBotActive: !currentStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, isBotActive: !currentStatus } : c))
        );
      }
    } catch (e) {}
  };

  const handleSendHumanReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConvId) return;

    setIsSendingReply(true);
    try {
      const res = await fetch('/api/store/inbox', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({
          action: 'send_reply',
          conversationId: selectedConvId,
          text: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConversations((prev) =>
          prev.map((c) => (c.id === selectedConvId ? data.conversation : c))
        );
        setReplyText('');
      }
    } catch (e) {
    } finally {
      setIsSendingReply(false);
    }
  };

  // --------------------------------------------------------------------------
  // SETTINGS ACTIONS
  // --------------------------------------------------------------------------

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const updatedTenant: Partial<TenantConfig> = {
        name: storeName,
        legalName: storeLegalName,
        tagline: storeTagline,
        whatsapp: storeWhatsapp,
        city: storeCity,
        themeId: activeTheme,
        currency: storeCurrency,
        heroTitle,
        heroSubtitle,
        announcementText,
        industryPreset,
        brandPalette: {
          primaryColor,
          backgroundColor,
          surfaceColor,
          textColor,
          isCustomPalette,
        },
        paymentAccounts: {
          accountHolderName,
          kuraimiAccount,
          floosakAccount,
          jeebAccount,
          jawaliAccount,
        },
        notificationConfig: {
          telegramBotToken,
          telegramChatId,
          ownerWhatsapp,
          geminiApiKey,
        },
      };

      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: ADMIN_FETCH_HEADERS,
        body: JSON.stringify({ action: 'update_tenant', tenant: updatedTenant }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccessMsg('تم حفظ وتطبيق كافة إعدادات وهوية المتجر بنجاح');
        showToast('تم حفظ وتطبيق الإعدادات بنجاح');
        setTimeout(() => setSettingsSuccessMsg(''), 4000);
      }
    } catch (err) {
      setSettingsSuccessMsg('فشل حفظ الإعدادات، يرجى المحاولة ثانية');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --------------------------------------------------------------------------
  // CALCULATED INVENTORY SUMMARY METRICS
  // --------------------------------------------------------------------------

  const totalUnits = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
  const totalRetailValueCurrent = products.reduce(
    (acc, p) => acc + (p.stockQuantity || 0) * (p.prices?.[storeCurrency] ?? p.prices?.YER ?? 0),
    0
  );
  const expectedProfitCurrent = products.reduce(
    (acc, p) =>
      acc + (p.stockQuantity || 0) * ((p.prices?.[storeCurrency] ?? p.prices?.YER ?? 0) - (p.costPriceYer || 0)),
    0
  );

  const publishedCount = products.filter(
    (p) =>
      p.visibilityStatus !== 'warehouse_only' &&
      p.visibilityStatus !== 'archived' &&
      p.isPublished !== false
  ).length;

  const warehouseOnlyCount = products.filter(
    (p) => p.visibilityStatus === 'warehouse_only' || p.isPublished === false
  ).length;

  const lowOrOutCount = products.filter(
    (p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 5) || !p.inStock
  ).length;

  const filteredProducts = products.filter((p) => {
    if (inventoryFilter === 'published') {
      if (
        p.visibilityStatus === 'warehouse_only' ||
        p.visibilityStatus === 'archived' ||
        p.isPublished === false
      )
        return false;
    } else if (inventoryFilter === 'warehouse_only') {
      if (p.visibilityStatus !== 'warehouse_only' && p.isPublished !== false) return false;
    } else if (inventoryFilter === 'low_or_out') {
      const isLow = (p.stockQuantity || 0) <= (p.lowStockThreshold || 5);
      const isOut = (p.stockQuantity || 0) === 0 || !p.inStock;
      if (!isLow && !isOut) return false;
    }

    if (inventoryCategoryFilter !== 'all' && p.categorySlug !== inventoryCategoryFilter) {
      return false;
    }

    if (inventorySearch.trim()) {
      const q = inventorySearch.trim().toLowerCase();
      const text = `${p.title} ${p.brand} ${p.sku || ''} ${p.batchCode || ''}`.toLowerCase();
      if (!text.includes(q)) return false;
    }

    return true;
  });

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const getStatusLabelAr = (status: OrderRecord['status']) => {
    switch (status) {
      case 'pending':
        return 'قيد المراجعة';
      case 'confirmed':
        return 'تم التأكيد وخصم المخزون';
      case 'processing':
        return 'قيد التجهيز';
      case 'shipped':
        return 'خرج للتوصيل';
      case 'delivered':
        return 'تم التسليم بنجاح';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  // --------------------------------------------------------------------------
  // AUTHENTICATION SCREEN
  // --------------------------------------------------------------------------

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070709] text-ivory flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0E0E12] border border-[#C9A84C]/20 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-serif font-bold text-champagne">
              بوابة التاجر وإدارة المتجر الملكي
            </h1>
            <p className="text-xs text-muted-lux font-sans">
              سَامِق — نظام إدارة الموارد والكتالوج والمخزن الموحد
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gold font-bold block">رمز دخول الإدارة (Passcode):</label>
              <input
                type="password"
                placeholder="أدخل رمز المرور..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-sm focus:border-gold outline-none"
              />
            </div>

            {authError && <p className="text-xs text-rose-400">{authError}</p>}

            <button
              type="submit"
              className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_20px_rgba(201,168,76,0.25)] hover:brightness-110 transition"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="min-h-[44px] text-xs text-champagne hover:underline inline-flex items-center"
            >
              دخول سريع لتجربة لوحة التحكم (عرض تجريبي)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN ADMIN DASHBOARD
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#070709] text-ivory font-sans overflow-x-hidden w-full max-w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-300 text-xs font-sans font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
          <VerifiedCheckIcon size={16} color="#34D399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Card Image Upload */}
      <input
        ref={cardFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleCardFileSelected}
        className="hidden"
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-[#070709]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-auto min-h-[56px] sm:h-20 py-2.5 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link href="/" className="min-h-[44px] inline-flex items-center">
              <span className="text-xl font-serif font-bold text-champagne">
                {storeName} — لكشف المقلد
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gold/15 text-champagne border border-gold/30">
              ERP السحابي
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/platform"
              className="min-h-[44px] px-3 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-xs font-bold text-champagne border border-gold/30 transition inline-flex items-center gap-1"
            >
              <span>استوديو المنصة والأسطول</span>
              <span>↗</span>
            </Link>
            <Link
              href="/samiq"
              target="_blank"
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ivory border border-white/10 transition inline-flex items-center gap-1"
            >
              <span>معرض سَامِق العام</span>
              <span>↗</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ivory border border-white/10 transition inline-flex items-center gap-1.5"
            >
              <span>معاينة المتجر المباشر</span>
              <span>↗</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 text-xs font-bold text-muted-lux hover:text-rose-300 border border-white/10 transition inline-flex items-center"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            المخزون والمنتجات ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            الطلبات والمبيعات POS ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            الأقسام والواجهة ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            المحادثات ({conversations.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            حجوزات الاستشارات ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('authenticity')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'authenticity'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            مختبر الأصالة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blog')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            المجلة والمقالات ({blogPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            كوبونات الخصم ({coupons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            التقييمات والمراجعات ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            التقارير والقنوات الذكية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            إعدادات المتجر
          </button>
        </div>

        {/* Quick Links to Live Storefront Subpages */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto text-[11px] text-muted-lux scrollbar-none">
          <span className="font-semibold text-gold/80 whitespace-nowrap">معاينة صفحات المتجر الحية:</span>
          <Link href="/authenticity-hub" target="_blank" className="hover:text-champagne transition whitespace-nowrap px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            مركز فحص الأصالة ↗
          </Link>
          <Link href="/bookings" target="_blank" className="hover:text-champagne transition whitespace-nowrap px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            حجز استشارة ↗
          </Link>
          <Link href="/blog" target="_blank" className="hover:text-champagne transition whitespace-nowrap px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            المدونة الطبية ↗
          </Link>
          <Link href="/account" target="_blank" className="hover:text-champagne transition whitespace-nowrap px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            بوابة العميل ↗
          </Link>
          <Link href="/" target="_blank" className="hover:text-champagne transition whitespace-nowrap px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
            الواجهة الرئيسية ↗
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================================================================== */}
        {/* TAB: INVENTORY & WAREHOUSE ERP                                      */}
        {/* ================================================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Header & Main Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-ivory">
                  إدارة المخزون والمستحضرات ومعرض الصور
                </h2>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  تحكم فوري بحالة النشر بين المخزن وواجهة المتجر، تحديث الكميات، ورفع الصور المتعددة
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={openCreateProductModal}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition inline-flex items-center gap-2"
                >
                  <span>+</span>
                  <span>إضافة مستحضر جديد (للمخزن أو الموقع)</span>
                </button>
              </div>
            </div>

            {/* ================================================================== */}
            {/* DEDICATED STORE CURRENCY & BULK EXCHANGE RATE CONVERTER CARD       */}
            {/* ================================================================== */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#0E0E12] border border-gold/40 shadow-2xl space-y-5">
              {/* Header with Title and Current Active Currency Badge */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_#C9A84C]" />
                    <h3 className="text-base sm:text-lg font-serif font-bold text-champagne">
                      عملة المتجر الرسمية ومحوّل أسعار الصرف الشامل
                    </h3>
                  </div>
                  <p className="text-xs text-muted-lux font-sans">
                    حدد العملة المعتمدة للمبيعات، أو حوّل أسعار كافة المستحضرات والمناطق دفعة واحدة بسعر الصرف المباشر.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 rounded-xl bg-gold/15 border border-gold/40 flex items-center gap-2">
                    <span className="text-[11px] text-muted-lux font-sans">العملة النشطة للمتجر:</span>
                    <span className="text-xs font-mono font-bold text-champagne">
                      {CURRENCY_LABELS[storeCurrency]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mode Toggle: Rate Convert vs. Symbol-Only Switch */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-sans text-muted-lux ms-1">طريقة المعالجة:</span>
                <button
                  type="button"
                  onClick={() => {
                    setConvertMode('rate_convert');
                    setConvertSuccessMsg(null);
                    setConvertErrorMsg(null);
                  }}
                  className={`min-h-[38px] px-3.5 rounded-xl text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                    convertMode === 'rate_convert'
                      ? 'bg-gold text-obsidian-dark shadow-md'
                      : 'bg-white/5 text-ivory/70 hover:text-ivory hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>تحويل القيم الحسابية بسعر الصرف (Recalculate Prices)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvertMode('change_symbol_only');
                    setConvertSuccessMsg(null);
                    setConvertErrorMsg(null);
                  }}
                  className={`min-h-[38px] px-3.5 rounded-xl text-xs font-sans font-bold transition flex items-center gap-1.5 ${
                    convertMode === 'change_symbol_only'
                      ? 'bg-gold text-obsidian-dark shadow-md'
                      : 'bg-white/5 text-ivory/70 hover:text-ivory hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>تغيير رمز العملة فقط دون تعديل الأرقام (Symbol-Only Switch)</span>
                </button>
              </div>

              {/* MODE 1: Rate Conversion Engine */}
              {convertMode === 'rate_convert' && (
                <div className="space-y-4 pt-1">
                  {/* Quick Presets Row */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-sans text-muted-lux block font-medium">
                      نماذج أسعار الصرف الشائعة (صنعاء ومقارنات السوق):
                    </span>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'SAR',
                            rate: '145',
                            op: 'divide',
                            rounding: 'round',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        صنعاء: YER &rarr; SAR (&divide; 145)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'YER',
                            rate: '145',
                            op: 'multiply',
                            rounding: 'round',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        صنعاء: SAR &rarr; YER (&times; 145)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'USD',
                            rate: '550',
                            op: 'divide',
                            rounding: 'decimals',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        صنعاء: YER &rarr; USD (&divide; 550)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'YER',
                            rate: '550',
                            op: 'multiply',
                            rounding: 'round',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        صنعاء: USD &rarr; YER (&times; 550)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'USD',
                            rate: '3.75',
                            op: 'divide',
                            rounding: 'decimals',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        SAR &rarr; USD (&divide; 3.75)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyCurrencyPreset({
                            to: 'SAR',
                            rate: '3.75',
                            op: 'multiply',
                            rounding: 'round',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/50 text-ivory/80 hover:text-champagne transition font-sans text-[11px]"
                      >
                        USD &rarr; SAR (&times; 3.75)
                      </button>
                    </div>
                  </div>

                  {/* Core Settings Grid: Target Currency, Rate, Operation, Rounding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    {/* 1. Target Currency */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-lux block font-medium">العملة المستهدفة للمتجر:</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['YER', 'SAR', 'USD'] as const).map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              setTargetCurrency(code);
                              if (code === 'USD') setRoundingMode('decimals');
                              else setRoundingMode('round');
                            }}
                            className={`min-h-[42px] px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center ${
                              targetCurrency === code
                                ? 'bg-gold/20 border-2 border-gold text-champagne'
                                : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                            }`}
                          >
                            <span className="font-mono">{code}</span>
                            <span className="text-[10px] opacity-70">{CURRENCY_SYMBOLS[code]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Math Operation Toggle */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-lux block font-medium">العملية الحسابية:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConvertOp('divide')}
                          className={`min-h-[42px] px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            convertOp === 'divide'
                              ? 'bg-gold/20 border-2 border-gold text-champagne'
                              : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                          }`}
                        >
                          <span className="text-base">&divide;</span>
                          <span>قسمة على الصرف</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConvertOp('multiply')}
                          className={`min-h-[42px] px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            convertOp === 'multiply'
                              ? 'bg-gold/20 border-2 border-gold text-champagne'
                              : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                          }`}
                        >
                          <span className="text-base">&times;</span>
                          <span>ضرب في الصرف</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Exchange Rate Value */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-lux block font-medium">سعر الصرف المعتمد:</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          min="0.001"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(e.target.value)}
                          placeholder="مثال: 145 أو 550"
                          className="w-full min-h-[42px] px-3 pe-12 rounded-xl bg-white/5 border border-gold/40 text-champagne font-mono font-bold text-sm outline-none focus:border-gold"
                        />
                        <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-lux font-mono pointer-events-none">
                          Rate
                        </span>
                      </div>
                    </div>

                    {/* 4. Rounding Mode */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-lux block font-medium">نمط التقريب النهائي:</label>
                      <select
                        value={roundingMode}
                        onChange={(e) => setRoundingMode(e.target.value as any)}
                        className="w-full min-h-[42px] px-3 rounded-xl bg-[#141418] border border-white/10 text-ivory text-xs font-sans outline-none focus:border-gold"
                      >
                        <option value="round">تقريب لأقرب عدد صحيح (Math.round)</option>
                        <option value="decimals">منزلتين عشريتين (مناسب للدولار 0.00)</option>
                        <option value="ceil">تقريب للأعلى دائماً (Math.ceil)</option>
                        <option value="floor">تقريب للأدنى دائماً (Math.floor)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: Symbol-Only Switch */}
              {convertMode === 'change_symbol_only' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(['YER', 'SAR', 'USD'] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setTargetCurrency(code)}
                        className={`min-h-[44px] px-4 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                          targetCurrency === code
                            ? 'bg-gold/20 border-2 border-gold text-champagne'
                            : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                        }`}
                      >
                        <span className="font-mono">{code} ({CURRENCY_SYMBOLS[code]})</span>
                        <span className="text-[11px] opacity-70">{CURRENCY_LABELS[code]}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-lux bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    تنبيه: سيتم اعتماد رمز العملة الجديد كعملة العرض الرسمية في المتجر والفواتير، مع إبقاء قيم الأسعار العددية الحالية كما هي دون إجراء أي عمليات حسابية أو تغييرات للأرقام.
                  </p>
                </div>
              )}

              {/* Live Interactive Preview Box */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-gold font-bold block">
                    معاينة حية ومباشرة للأثر الحسابي قبل التطبيق:
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-sans flex-wrap">
                    <span className="text-ivory/70">مستحضر نموذجي بسعر:</span>
                    <span className="font-mono font-bold text-champagne">
                      {sampleOldPrice.toLocaleString('en-US')} {CURRENCY_SYMBOLS[storeCurrency]}
                    </span>
                    <span className="text-gold font-bold">&rarr;</span>
                    <span className="text-ivory/70">سيصبح سعره:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                      {sampleNewPrice.toLocaleString('en-US')} {CURRENCY_SYMBOLS[targetCurrency]}
                    </span>
                  </div>
                </div>

                <div className="text-start md:text-end text-[11px] text-muted-lux font-mono shrink-0">
                  {convertMode === 'change_symbol_only'
                    ? 'الوضع: تعديل الرمز فقط دون ضرب/قسمة'
                    : `العملية: ${sampleOldPrice.toLocaleString('en-US')} ${convertOp === 'divide' ? '÷' : '×'} ${parsedRate} (${roundingMode})`}
                </div>
              </div>

              {/* Action Button & Feedback Alerts */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex-1">
                  {convertSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-sans font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{convertSuccessMsg}</span>
                    </div>
                  )}
                  {convertErrorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-sans font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>{convertErrorMsg}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleExecuteCurrencyConversion}
                  disabled={isConvertingCurrency}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-lg transition inline-flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isConvertingCurrency ? (
                    <span>جاري تطبيق التحويل على قاعدة البيانات...</span>
                  ) : (
                    <>
                      <span>تطبيق التحويل على كافة المنتجات ({products.length} مستحضر)</span>
                      <span className="font-mono">&rarr;</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Warehouse Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                <span className="text-xs text-muted-lux font-sans block">إجمالي قطع المخزون</span>
                <div className="text-2xl font-serif font-bold text-champagne tabular-nums">
                  {totalUnits.toLocaleString('ar-YE')} عبوة
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                <span className="text-xs text-muted-lux font-sans block">القيمة السوقية للمخزون</span>
                <div className="text-2xl font-serif font-bold text-champagne tabular-nums">
                  {formatCurrency(totalRetailValueCurrent, storeCurrency)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                <span className="text-xs text-muted-lux font-sans block">صافي الربح المتوقع</span>
                <div className="text-2xl font-serif font-bold text-emerald-400 tabular-nums">
                  {formatCurrency(expectedProfitCurrent, storeCurrency)}
                </div>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('all')}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold border transition ${
                      inventoryFilter === 'all'
                        ? 'bg-gold/20 border-gold text-champagne'
                        : 'bg-white/5 border-white/10 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    كل الأصناف ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('published')}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold border transition ${
                      inventoryFilter === 'published'
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    منشور في الموقع ({publishedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('warehouse_only')}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold border transition ${
                      inventoryFilter === 'warehouse_only'
                        ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                        : 'bg-white/5 border-white/10 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    في المخزن فقط — غير منشور ({warehouseOnlyCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setInventoryFilter('low_or_out')}
                    className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-bold border transition ${
                      inventoryFilter === 'low_or_out'
                        ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                        : 'bg-white/5 border-white/10 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    نقص مخزون / نفد ({lowOrOutCount})
                  </button>
                </div>

                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1 lg:max-w-md">
                  <select
                    value={inventoryCategoryFilter}
                    onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                    className="min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  >
                    <option value="all" className="bg-[#0E0E12]">جميع الأقسام</option>
                    <option value="serums" className="bg-[#0E0E12]">السيرومات</option>
                    <option value="cleansers-moisturizers" className="bg-[#0E0E12]">المنظفات والمرطبات</option>
                    <option value="makeup" className="bg-[#0E0E12]">المكياج</option>
                    <option value="skincare" className="bg-[#0E0E12]">العناية بالبشرة</option>
                  </select>

                  <input
                    type="text"
                    placeholder="بحث بالاسم، رمز SKU، أو علامة الاعتماد..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const categoryAr = CATEGORY_NAMES_AR[p.categorySlug] || p.categorySlug;
                const isPublished = p.visibilityStatus !== 'warehouse_only' && p.visibilityStatus !== 'archived' && p.isPublished !== false;
                const costYer = p.costPriceYer || Math.round((p.prices.YER || 10000) * 0.6);
                const retailYer = p.prices.YER || 0;
                const profitYer = retailYer - costYer;
                const profitMarginPercent = costYer > 0 ? Math.round((profitYer / costYer) * 100) : 0;
                const productImages = p.images && p.images.length > 0 ? p.images : [p.image];

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4 flex flex-col justify-between hover:border-gold/30 transition shadow-lg"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Brand, Category, Visibility Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gold font-serif font-bold">
                          {p.brand}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-ivory/60 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            {categoryAr}
                          </span>
                          {isPublished ? (
                            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                              منشور في الموقع
                            </span>
                          ) : (
                            <span className="text-xs text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                              في المخزن فقط
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Image Thumbnail & Multi-Image Gallery Strip */}
                      <div className="flex items-start gap-3">
                        <div className="relative w-20 h-20 min-w-[80px] min-h-[80px] rounded-xl overflow-hidden bg-surface border border-white/10 shadow-sm flex-shrink-0">
                          <SmartImage
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <h3 className="text-sm font-semibold text-ivory line-clamp-2 leading-snug">
                            {p.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-lux font-mono">
                            <span>SKU: {p.sku || '-'}</span>
                            <span>•</span>
                            <span>الاعتماد: {p.batchCode ? 'مصرح ومطابق' : '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Strip with '+ رفع صورة' */}
                      <div className="pt-1 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto pb-1">
                        <span className="text-xs text-muted-dim flex-shrink-0 font-sans">الصور ({productImages.length}):</span>
                        {productImages.slice(0, 4).map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-surface flex-shrink-0"
                          >
                            <SmartImage src={imgUrl} alt="gallery" fill className="object-cover" />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleTriggerCardUpload(p.id)}
                          className="min-h-[32px] px-2 py-1 rounded-lg bg-white/5 hover:bg-gold/20 text-champagne text-xs border border-white/10 hover:border-gold/40 flex-shrink-0 transition"
                          title="رفع صورة إضافية لهذا المنتج"
                        >
                          + رفع صورة
                        </button>
                      </div>

                      {/* Stock Quantity Stepper */}
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div className="text-xs font-sans text-muted-lux">
                          المتوفر بالمخزن:
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStockStepper(p, -1)}
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-ivory flex items-center justify-center font-bold text-sm border border-white/10"
                            aria-label="إنقاص الكمية"
                          >
                            -
                          </button>
                          <span className="min-w-[70px] text-center text-xs font-bold text-champagne font-mono">
                            {p.stockQuantity ?? 0} عبوة
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockStepper(p, 1)}
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-white/5 hover:bg-white/10 text-ivory flex items-center justify-center font-bold text-sm border border-white/10"
                            aria-label="زيادة الكمية"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Prices & Profit Margin */}
                      <div className="space-y-1 text-xs font-sans">
                        <div className="flex items-center justify-between">
                          <span className="text-champagne font-bold text-sm">
                            {formatCurrency(p.prices[storeCurrency] || p.prices.YER, storeCurrency)}
                          </span>
                          <span className="text-muted-dim font-mono">
                            {storeCurrency === 'YER'
                              ? `(${p.prices.SAR} SAR / ${p.prices.USD} USD)`
                              : storeCurrency === 'SAR'
                              ? `(${p.prices.YER.toLocaleString()} YER / ${p.prices.USD} USD)`
                              : `(${p.prices.YER.toLocaleString()} YER / ${p.prices.SAR} SAR)`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-muted-lux">
                            التكلفة: {costYer.toLocaleString('ar-YE')} ر.ي
                          </span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                            هامش الربح: +{profitMarginPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Smart Tags Chips & Interactive Tag Manager */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {p.tags && p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-champagne inline-flex items-center gap-1 group"
                          >
                            <span>#{t}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveTagFromProduct(p, t);
                              }}
                              className="w-3.5 h-3.5 rounded-full hover:bg-rose-500/20 hover:text-rose-400 text-muted-lux transition inline-flex items-center justify-center text-[10px]"
                              title={`حذف وسم #${t}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {inlineEditingProductId === p.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleAddTagToProduct(p, inlineNewTag);
                            }}
                            className="inline-flex items-center gap-1"
                          >
                            <input
                              type="text"
                              value={inlineNewTag}
                              onChange={(e) => setInlineNewTag(e.target.value)}
                              placeholder="وسم جديد..."
                              className="px-2 py-0.5 text-xs rounded bg-[#111016] border border-gold/40 text-ivory outline-none w-24"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-2 py-0.5 text-[11px] font-bold rounded bg-gold/20 text-champagne hover:bg-gold/30 border border-gold/30"
                            >
                              إضافة
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInlineEditingProductId(null);
                                setInlineNewTag('');
                              }}
                              className="px-1.5 py-0.5 text-[11px] text-muted-lux hover:text-ivory"
                            >
                              إلغاء
                            </button>
                          </form>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setInlineEditingProductId(p.id);
                              setInlineNewTag('');
                            }}
                            className="text-[11px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-muted-lux hover:text-champagne border border-dashed border-white/15 transition inline-flex items-center gap-0.5"
                          >
                            <span>+ وسم</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      {/* 1-Click Visibility Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleProductVisibility(p)}
                        className={`w-full min-h-[40px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                          isPublished
                            ? 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isPublished ? 'إخفاء في المخزن فقط (مخفي عن الموقع)' : 'نشر في الموقع الآن'}
                      </button>

                      {/* Edit, Preview, Delete */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => openEditProductModal(p)}
                          className="min-h-[40px] px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-champagne border border-white/10 transition inline-flex items-center justify-center"
                        >
                          تعديل وصور
                        </button>
                        <Link
                          href={`/product/${p.id}`}
                          target="_blank"
                          className="min-h-[40px] px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ivory/80 hover:text-ivory border border-white/10 transition inline-flex items-center justify-center"
                        >
                          معاينة ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p)}
                          className="min-h-[40px] px-2 py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/50 text-xs font-bold text-rose-400 border border-white/10 transition inline-flex items-center justify-center"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: ORDERS & POS SALES                                            */}
        {/* ================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-ivory">
                  طلبات الشراء والمبيعات (POS)
                </h2>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  إدارة دورة حياة الطلب، خصم المخزون التلقائي عند التأكيد، وتسجيل مبيعات الفروع المباشرة
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPosOrderModal(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center gap-1.5"
              >
                <span>+</span>
                <span>تسجيل طلب مبيعات يدوي / فرع (POS)</span>
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-5 rounded-2xl bg-[#0E0E12] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs text-gold font-bold">
                        {o.orderNumber}
                      </span>
                      <span className="text-sm font-semibold text-ivory">{o.customerName}</span>
                      <span className="text-xs text-muted-lux font-mono">({o.customerPhone})</span>
                      <span className="text-xs text-champagne bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {o.city} — {o.address}
                      </span>
                    </div>

                    {/* Ordered Items Preview */}
                    <div className="text-xs text-muted-lux space-y-1">
                      {o.items && o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-ivory">• {item.title}</span>
                          <span className="text-gold">×{item.quantity}</span>
                          <span>({formatCurrency(item.unitPrice?.YER || 0, 'YER')})</span>
                        </div>
                      ))}
                    </div>

                    {o.notes && (
                      <p className="text-xs text-muted-dim italic">ملاحظات: {o.notes}</p>
                    )}
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-end space-y-1">
                      <div className="text-champagne font-bold text-base tabular-nums">
                        {formatCurrency(o.totalYer, 'YER')}
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded border inline-block font-bold bg-emerald-950/60 text-emerald-300 border-emerald-500/30">
                        {getStatusLabelAr(o.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={o.status}
                        onChange={(e) => handleOrderStatusChange(o.id, e.target.value as any)}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                      >
                        <option value="pending" className="bg-[#0E0E12]">قيد المراجعة</option>
                        <option value="confirmed" className="bg-[#0E0E12]">تأكيد وخصم المخزون</option>
                        <option value="shipped" className="bg-[#0E0E12]">خرج للتوصيل</option>
                        <option value="delivered" className="bg-[#0E0E12]">تم التسليم</option>
                        <option value="cancelled" className="bg-[#0E0E12]">إلغاء الطلب</option>
                      </select>

                      <a
                        href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `مرحباً ${o.customerName}، بخصوص طلبك رقم ${o.orderNumber} من متجر مفتاح الجمال...`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-950/60 text-xs font-bold text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition inline-flex items-center gap-1.5"
                      >
                        <WhatsAppIcon size={14} color="#34D399" />
                        <span>واتساب ↗</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(o.id)}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/50 text-xs font-bold text-rose-400 border border-white/10 transition inline-flex items-center"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: CATEGORIES & STOREFRONT SECTIONS                              */}
        {/* ================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Categories Management */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-ivory">
                    أقسام وتصنيفات المتجر
                  </h2>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    إدارة تصنيفات الكتالوج، صور الأقسام، والشارات التسويقية
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCatTitle('');
                    setCatSubtitle('');
                    setCatBrand('');
                    setCatImage('/media/products/serum-vitamin-c.jpg');
                    setCatBadge('');
                    setShowAddCategoryModal(true);
                  }}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>إضافة قسم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((c) => {
                  const count = products.filter((p) => p.categorySlug === c.id).length;
                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface border border-white/10">
                          <SmartImage src={c.image} alt={c.title} fill className="object-cover" />
                          {c.badge && (
                            <span className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-gold text-obsidian-dark text-xs font-bold">
                              {c.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-ivory">{c.title}</h3>
                          <p className="text-xs text-muted-lux font-mono mt-0.5">
                            معرف الرابط: #{c.id} • {count} مستحضر
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(c);
                            setCatTitle(c.title);
                            setCatSubtitle(c.subtitle || '');
                            setCatBrand(c.brand || c.title);
                            setCatImage(c.image);
                            setCatBadge(c.badge || '');
                            setShowAddCategoryModal(true);
                          }}
                          className="min-h-[40px] px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-champagne border border-white/10"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id)}
                          className="min-h-[40px] px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-xs text-rose-400 border border-white/10"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Homepage Sections Visibility Controller */}
            <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-champagne">
                  ترتيب وإظهار أقسام الصفحة الرئيسية
                </h3>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  تحكم بظهور البلوكات الرئيسية على المتجر المباشر (تحديث فوري بدون إعادة نشر)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {homeSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-ivory block">
                        {sec.id === 'sec-hero' && 'البانر الرئيسي والعروض الملكية'}
                        {sec.id === 'sec-products' && 'شبكة المستحضرات المعتمدة'}
                        {sec.id === 'sec-authenticity' && 'بلوك فحص الأصالة التفاعلي'}
                        {sec.id === 'sec-categories' && 'شبكة تصنيفات المتجر'}
                        {sec.id === 'sec-skin-routine' && 'مستشار روتين البشرة الذكي'}
                        {sec.id === 'sec-contact' && 'خريطة الفروع والتواصل المباشر'}
                        {!['sec-hero', 'sec-products', 'sec-authenticity', 'sec-categories', 'sec-skin-routine', 'sec-contact'].includes(sec.id) && sec.id}
                      </span>
                      <span className="text-xs text-muted-dim font-mono">{sec.type}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleHomeSection(sec.id)}
                      className={`min-h-[40px] px-3 py-1 rounded-xl text-xs font-bold border transition ${
                        sec.visible
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-white/5 text-muted-dim border-white/10'
                      }`}
                    >
                      {sec.visible ? 'ظاهر' : 'مخفي'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: INBOX & LIVE AGENT TAKEOVER                                    */}
        {/* ================================================================== */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 p-4 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-3">
              <h3 className="text-sm font-serif font-bold text-champagne px-2">
                صندوق المحادثات الموحدة ({conversations.length})
              </h3>
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const isSelected = selectedConvId === conv.id;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full min-h-[44px] p-3 rounded-2xl text-start transition border ${
                        isSelected
                          ? 'bg-white/10 border-gold/40'
                          : 'bg-white/5 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ivory">{conv.customerName}</span>
                        <span className="text-xs text-muted-dim">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-xs text-muted-lux line-clamp-1 mt-1">{conv.lastMessage}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 p-5 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4">
              {activeConversation && (
                <>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-ivory">{activeConversation.customerName}</h4>
                      <p className="text-xs text-muted-lux font-mono">{activeConversation.customerIdentifier}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleBot(activeConversation.id, activeConversation.isBotActive)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                        activeConversation.isBotActive
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {activeConversation.isBotActive ? 'المستشارة الذكية تعمل' : 'المستشارة معطلة (تدخل بشري)'}
                    </button>
                  </div>

                  <div className="space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto p-2">
                    {activeConversation.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${m.sender === 'customer' ? 'items-start' : 'items-end'}`}
                      >
                        <span className="text-xs text-muted-dim mb-0.5">{m.senderName} ({m.timestamp})</span>
                        <div
                          className={`p-3 rounded-2xl text-xs max-w-md ${
                            m.sender === 'customer'
                              ? 'bg-white/10 text-ivory'
                              : 'bg-gold/20 text-champagne border border-gold/30'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendHumanReply} className="flex gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      placeholder="اكتب رداً مباشراً كخبير المتجر..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      disabled={isSendingReply}
                      className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                    >
                      {isSendingReply ? 'جارٍ الإرسال...' : 'إرسال'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: BOOKINGS                                                      */}
        {/* ================================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-ivory">
                حجوزات الاستشارات التجميلية
              </h2>
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                متابعة مواعيد استشارات البشرة، تصميم الروتين، والتأكيد عبر واتساب
              </p>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#0E0E12] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-ivory">{b.customerName}</span>
                      <span className="text-xs text-muted-lux font-mono">({b.customerPhone})</span>
                    </div>
                    <p className="text-xs text-gold">
                      الخدمة: {b.serviceType} • الموعد: {b.bookingDate} ({b.bookingTime})
                    </p>
                    {b.notes && <p className="text-xs text-muted-dim">{b.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded border font-bold bg-emerald-950/50 text-emerald-300 border-emerald-500/30">
                      {b.status === 'confirmed' ? 'مؤكد' : b.status === 'completed' ? 'تمت الجلسة' : 'ملغي'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleBookingStatusChange(b.id, 'confirmed')}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-950/60 text-xs text-emerald-300 border border-white/10"
                    >
                      تأكيد الموعد
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBookingStatusChange(b.id, 'completed')}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-ivory border border-white/10"
                    >
                      إتمام الجلسة
                    </button>
                    <a
                      href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `مرحباً ${b.customerName}، يسعدنا تأكيد موعد استشارتك في متجر مفتاح الجمال بتاريخ ${b.bookingDate}...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-950/60 text-xs text-emerald-300 border border-white/10 inline-flex items-center gap-1"
                    >
                      <WhatsAppIcon size={14} color="#34D399" />
                      <span>واتساب ↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteBooking(b.id)}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/50 text-xs text-rose-400 border border-white/10"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: AUTHENTICITY LAB                                              */}
        {/* ================================================================== */}
        {activeTab === 'authenticity' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-ivory">
                  دليل ومختبر فحص الأصالة
                </h2>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  المستحضرات المصرحة والمطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية مع أدلة كشف المقلد
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddBatchModal(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center gap-1.5"
              >
                <span>+</span>
                <span>إضافة مستحضر معتمد جديد للمختبر</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(authenticityGuides).map(([batchKey, guide]) => (
                <div
                  key={batchKey}
                  className="p-5 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gold font-bold">
                        المستحضر: {guide.productTitle || batchKey}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                        أصلي موثق
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-ivory">{guide.productTitle}</h4>
                    <p className="text-xs text-muted-lux line-clamp-2">
                      {guide.original?.formulaNotes || 'تركيبة نقية مطابقة للمواصفات الرسمية.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-muted-dim font-mono">{guide.brand}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBatch(batchKey)}
                      className="min-h-[40px] px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-xs text-rose-400 border border-white/10"
                    >
                      حذف المستحضر
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: BLOG & MAGAZINE CMS                                           */}
        {/* ================================================================== */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-ivory">
                  المجلة التحريرية ومقالات التوعية
                </h2>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  نشر مقالات كشف المقلد، نصائح الروتين، والأدلة التحريرية المرتبطة بالمتجر
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateBlogModal}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center gap-1.5"
              >
                <span>+</span>
                <span>كتابة مقال جديد للمجلة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-surface border border-white/10">
                      <SmartImage src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>

                    <div>
                      <span className="text-xs text-gold block font-mono">{post.publishedAt} • {post.readTimeMinutes} دقائق</span>
                      <h3 className="text-sm font-semibold text-ivory mt-1 line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-muted-lux line-clamp-2 mt-1">{post.excerpt}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/blog?post=${post.slug}`}
                        target="_blank"
                        className="min-h-[38px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-champagne border border-white/10 inline-flex items-center gap-1"
                      >
                        عرض ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditBlogModal(post)}
                        className="min-h-[38px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-ivory border border-white/10 inline-flex items-center gap-1"
                      >
                        تعديل
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlogPost(post.id)}
                      className="min-h-[38px] px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-950/40 text-xs text-rose-400 border border-white/10"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: COUPONS                                                       */}
        {/* ================================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-ivory">
                إدارة كوبونات الخصم والعروض
              </h2>
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                إنشاء وتفعيل كوبونات التخفيض، متابعة مرات الاستخدام، وتحديد النسب
              </p>
            </div>

            {/* Create Coupon Form */}
            <div className="p-5 rounded-3xl bg-[#0E0E12] border border-white/5">
              <form onSubmit={handleAddCoupon} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="كود الكوبون (مثال: YEMEN2026)"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="flex-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs uppercase outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="نسبة الخصم %"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-28 min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                >
                  تفعيل الكوبون
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-sm text-gold font-bold block">{c.code}</span>
                    <span className="text-xs text-muted-lux">
                      خصم {c.discountPercentage}% • استخدام {c.usageCount} مرة
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(c)}
                      className={`min-h-[40px] px-3 py-1 rounded-xl text-xs font-bold border ${
                        c.isActive
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-white/5 text-muted-dim border-white/10'
                      }`}
                    >
                      {c.isActive ? 'مفعل' : 'معطل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="min-h-[40px] px-2.5 py-1 rounded-xl bg-white/5 hover:bg-rose-950/40 text-rose-400 text-xs border border-white/10"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: REVIEWS & RATINGS MODERATION                                   */}
        {/* ================================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-ivory">
                  إدارة ومراجعة تقييمات العملاء
                </h2>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  اعتماد ظهور التقييمات في صفحات المنتجات، إخفاء غير المناسب، وحذف التقييمات المسيئة
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-gold/15 text-champagne text-xs font-bold border border-gold/30">
                  إجمالي التقييمات: {reviews.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  المعتمدة: {reviews.filter((r) => r.approved !== false).length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {reviews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0E0E12] border border-white/5 text-center text-xs text-muted-lux">
                  لا توجد تقييمات مسجلة حتى الآن.
                </div>
              ) : (
                reviews.map((r) => {
                  const prod = products.find((p) => p.id === r.productId);
                  const isApproved = r.approved !== false;
                  return (
                    <div
                      key={r.id}
                      className="p-5 rounded-2xl bg-[#0E0E12] border border-white/5 hover:border-white/10 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-bold text-ivory">{r.customerName}</span>
                          <span className="text-xs text-gold font-mono font-bold">
                            {r.rating} / 5 نجوم
                          </span>
                          {r.isVerifiedPurchase && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              شراء موثق
                            </span>
                          )}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isApproved
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          }`}>
                            {isApproved ? 'معتمد ومنشور بالمتجر' : 'مخفي وغير منشور'}
                          </span>
                        </div>

                        <p className="text-xs text-[#FAF7F2]/90 leading-relaxed font-sans">
                          {r.comment}
                        </p>

                        <div className="text-[11px] text-muted-dim flex items-center gap-3">
                          <span>المنتج: <strong className="text-champagne">{prod?.title || r.productId}</strong></span>
                          <span>التاريخ: {new Date(r.createdAt).toLocaleDateString('ar-YE')}</span>
                          {r.batchCodeVerified && (
                            <span>كود الفحص: <code className="font-mono text-gold">{r.batchCodeVerified}</code></span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={isModeratingReview === r.id}
                          onClick={() => handleModerateReview(r.id, 'toggle_approve')}
                          className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border transition ${
                            isApproved
                              ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          {isApproved ? 'إخفاء التقييم' : 'اعتماد ونشر'}
                        </button>
                        <button
                          type="button"
                          disabled={isModeratingReview === r.id}
                          onClick={() => handleModerateReview(r.id, 'delete')}
                          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: ANALYTICS & SMART CHANNELS                                     */}
        {/* ================================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-serif font-bold text-ivory">
                تقارير المبيعات والقنوات الذكية المتصلة
              </h2>
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                إحصائيات الإيرادات، تفصيل الطلبات حسب المحافظات، وحالة القنوات وروبوت الذكاء الاصطناعي
              </p>
            </div>

            {/* KPI Cards */}
            {(() => {
              const validOrders = orders.filter((o) => o.status !== 'cancelled');
              const totalRevenueYer = validOrders.reduce((sum, o) => sum + (o.totalYer || 0), 0);
              const totalRevenueUsd = Math.round(totalRevenueYer / 530);
              const avgOrderYer = validOrders.length > 0 ? Math.round(totalRevenueYer / validOrders.length) : 0;
              const completedCount = orders.filter((o) => o.status === 'delivered').length;

              const govCounts: Record<string, number> = {};
              orders.forEach((o) => {
                const c = o.city || 'صنعاء';
                govCounts[c] = (govCounts[c] || 0) + 1;
              });

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                      <span className="text-xs text-muted-lux block font-sans">إجمالي الإيرادات (ريال يمني):</span>
                      <span className="text-lg sm:text-2xl font-serif font-bold text-champagne block">
                        {totalRevenueYer.toLocaleString('ar-YE')} ر.ي
                      </span>
                      <span className="text-[11px] text-muted-dim font-mono">ما يعادل ~${totalRevenueUsd} دولار</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                      <span className="text-xs text-muted-lux block font-sans">إجمالي الطلبات المستلمة:</span>
                      <span className="text-lg sm:text-2xl font-serif font-bold text-ivory block">
                        {orders.length} طلب
                      </span>
                      <span className="text-[11px] text-emerald-400 font-sans">{completedCount} طلب مكتمل التسليم</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                      <span className="text-xs text-muted-lux block font-sans">متوسط قيمة السلة (AOV):</span>
                      <span className="text-lg sm:text-2xl font-serif font-bold text-champagne block">
                        {avgOrderYer.toLocaleString('ar-YE')} ر.ي
                      </span>
                      <span className="text-[11px] text-muted-dim font-sans">لكل طلب مؤكد</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-1">
                      <span className="text-xs text-muted-lux block font-sans">معدل التحويل وسرعة المعالجة:</span>
                      <span className="text-lg sm:text-2xl font-serif font-bold text-emerald-400 block">
                        98.4%
                      </span>
                      <span className="text-[11px] text-muted-dim font-sans">استجابة فورية بدون تأخير</span>
                    </div>
                  </div>

                  {/* Distribution by Status and City */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-3">
                      <span className="text-xs text-gold font-bold block">توزيع الطلبات حسب الحالة:</span>
                      <div className="space-y-2 text-xs">
                        {[
                          { status: 'pending', label: 'قيد المراجعة', count: orders.filter((o) => o.status === 'pending').length, color: 'text-amber-400' },
                          { status: 'confirmed', label: 'تم التأكيد وخصم المخزون', count: orders.filter((o) => o.status === 'confirmed').length, color: 'text-cyan-400' },
                          { status: 'processing', label: 'قيد التجهيز', count: orders.filter((o) => o.status === 'processing').length, color: 'text-blue-400' },
                          { status: 'shipped', label: 'خرج للتوصيل', count: orders.filter((o) => o.status === 'shipped').length, color: 'text-purple-400' },
                          { status: 'delivered', label: 'تم التسليم بنجاح', count: orders.filter((o) => o.status === 'delivered').length, color: 'text-emerald-400' },
                        ].map((item) => (
                          <div key={item.status} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                            <span className={item.color}>{item.label}</span>
                            <span className="font-mono font-bold text-ivory">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-3">
                      <span className="text-xs text-gold font-bold block">توزيع المبيعات حسب المحافظات:</span>
                      <div className="space-y-2 text-xs">
                        {Object.entries(govCounts).map(([city, count]) => (
                          <div key={city} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02]">
                            <span className="text-ivory">{city}</span>
                            <span className="font-mono font-bold text-champagne">{count} طلب</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Channels & AI Status */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-serif font-bold text-champagne">
                      حالة القنوات الآلية ومحرك الذكاء الاصطناعي
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* WhatsApp Channel */}
                      <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ivory">قناة واتساب التفاعلية</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Webhooks جاهزة
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-lux font-sans">
                          نقطة الربط: <code className="text-gold font-mono">/api/webhooks/whatsapp-android</code>
                        </p>
                        <p className="text-[11px] text-muted-dim font-sans">
                          تدعم الرد ببطاقات المنتجات، الاستعلام عن الأسعار، وفحص الباتش كود.
                        </p>
                      </div>

                      {/* Telegram Channel */}
                      <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ivory">قناة تيليجرام الآلية</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Webhook نشط
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-lux font-sans">
                          نقطة الربط: <code className="text-gold font-mono">/api/webhooks/telegram</code>
                        </p>
                        <p className="text-[11px] text-muted-dim font-sans">
                          تدعم أوامر الكتالوج والأصالة والرد التلقائي وإشعارات الطلبات الفورية.
                        </p>
                      </div>

                      {/* Instagram Channel */}
                      <div className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ivory">قناة إنستغرام وماسنجر</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            Meta Graph API
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-lux font-sans">
                          جاهز للتفعيل عبر ربط حساب المتجر الاحترافي وحساب فيسبوك بيزنس.
                        </p>
                      </div>
                    </div>

                    {/* Gemini AI Integration Card */}
                    <div className="p-5 rounded-2xl bg-[#0E0E12] border border-white/10 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-champagne block">
                            محرك الذكاء الاصطناعي (Google Gemini 2.5 Flash)
                          </span>
                          <p className="text-xs text-muted-lux font-sans mt-0.5">
                            توليد نصائح تجميلية ذكية، واقتراح الروتين، والتصنيف التلقائي للمنتجات
                          </p>
                        </div>
                        <span className={`text-[11px] px-3 py-1 rounded-full font-bold border ${
                          geminiApiKey.trim()
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/5 text-muted-lux border-white/10'
                        }`}>
                          {geminiApiKey.trim() ? 'متصل بـ Gemini 2.5 Flash السحابي' : 'البديل المحلي الذكي نشط (بدون مفتاح)'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="password"
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          placeholder="أدخل مفتاح Google Gemini API Key هنا (اختياري)..."
                          className="flex-1 min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveStoreSettings({ preventDefault: () => {} } as any);
                            showToast('تم حفظ إعداد مفتاح الذكاء الاصطناعي');
                          }}
                          className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark text-xs font-bold shadow-md hover:brightness-110 shrink-0"
                        >
                          حفظ المفتاح
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB: STORE & TEMPLATE SETTINGS (CHAMELEON REBRANDING STUDIO)        */}
        {/* ================================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            <div>
              <h2 className="text-xl font-serif font-bold text-ivory">
                إعدادات وهوية المتجر وأستوديو التخصيص الكامل
              </h2>
              <p className="text-xs text-muted-lux font-sans mt-0.5">
                تخصيص الهوية بنقرة زر لأي عميل جديد، إدارة بوابات ومحافظ الدفع، ومناطق التوصيل والفروع
              </p>
            </div>

            {settingsSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-sans font-bold">
                {settingsSuccessMsg}
              </div>
            )}

            {/* SECTION 1: 1-Click Client Presets Studio */}
            <div className="p-6 rounded-3xl bg-[#0E0E12] border border-gold/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-champagne">
                    أستوديو الهوية السريعة للعميل التالي (1-Click Client Presets)
                  </h3>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    اختر أي نمط تجاري لتطبيق الاسم والشعار ولوحة الألوان ونصوص الهيرو تلقائياً بنقرة واحدة
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/15 text-gold font-bold">
                  5 أنماط جاهزة
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(CLIENT_INDUSTRY_PRESETS).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyPreset(key)}
                    className={`p-4 rounded-2xl border text-start transition flex flex-col justify-between space-y-2 min-h-[90px] ${
                      industryPreset === key
                        ? 'border-gold bg-gold/15 shadow-lg'
                        : 'border-white/10 bg-white/5 hover:border-gold/40'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-ivory block">{p.name}</span>
                      <span className="text-[11px] text-muted-dim block mt-0.5">{p.legalName}</span>
                    </div>
                    <span className="text-[10px] text-champagne font-mono">
                      القالب: {p.themeId} {industryPreset === key ? '(النشط حالياً)' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 2: General Store Identity & Theme */}
            <form onSubmit={handleSaveStoreSettings} className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4">
                <h3 className="text-base font-serif font-bold text-champagne border-b border-white/10 pb-3">
                  بيانات المتجر الأساسية والقالب
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">اسم المتجر التجاري:</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">الاسم القانوني والشعار الصارم:</label>
                  <input
                    type="text"
                    value={storeLegalName}
                    onChange={(e) => setStoreLegalName(e.target.value)}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">الوصف التسويقي (Tagline):</label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">رقم واتساب الطلبات:</label>
                    <input
                      type="text"
                      value={storeWhatsapp}
                      onChange={(e) => setStoreWhatsapp(e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">المدينة الرئيسية:</label>
                    <input
                      type="text"
                      value={storeCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-gold/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gold font-bold block">عملة المتجر الأساسية:</span>
                      <p className="text-[11px] text-muted-lux font-sans mt-0.5">
                        العملة التي تُعرض بها الأسعار في المتجر وسلة المشتريات ورسائل طلبات الواتساب.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs text-champagne hover:underline font-bold"
                    >
                      فتح محوّل أسعار الصرف الشامل &larr;
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(['YER', 'SAR', 'USD'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setStoreCurrency(c)}
                        className={`min-h-[42px] px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          storeCurrency === c
                            ? 'bg-gold/25 border-2 border-gold text-champagne'
                            : 'bg-white/5 border border-white/10 text-ivory/70 hover:text-ivory'
                        }`}
                      >
                        <span className="font-mono">{c}</span>
                        <span className="text-[11px] opacity-75">({CURRENCY_SYMBOLS[c]})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Texts Customizer */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <span className="text-xs text-gold font-bold block">نصوص واجهة الهيرو وشريط الإعلان:</span>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-lux block">عنوان الهيرو الرئيسي:</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-lux block">العنوان الفرعي للهيرو:</label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-muted-lux block">نص شريط الإعلان العلوي:</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Custom Color Palette */}
                <div className="pt-2 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gold font-bold block">ألوان العلامة المخصصة (Custom Brand Palette):</span>
                      <p className="text-[11px] text-muted-lux mt-0.5">تفعيل ألوان حرة بدلاً من التقيد بألوان القالب الافتراضية</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCustomPalette}
                        onChange={(e) => setIsCustomPalette(e.target.checked)}
                        className="w-4 h-4 rounded text-gold bg-white/5 border-white/20"
                      />
                      <span className="text-xs text-ivory font-bold">تفعيل لوحة الألوان المخصصة</span>
                    </label>
                  </div>

                  {isCustomPalette && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-lux block">اللون الرئيسي (Primary):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-lux block">لون الخلفية (Background):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-lux block">لون البطاقات (Surface):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={surfaceColor}
                            onChange={(e) => setSurfaceColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={surfaceColor}
                            onChange={(e) => setSurfaceColor(e.target.value)}
                            className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-muted-lux block">لون النص (Text):</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full min-h-[36px] px-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-ivory"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Selector */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs text-gold font-bold block">القالب البصري النشط للمتجر:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.values(SAMIQ_THEMES).map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setActiveTheme(th.id)}
                        className={`min-h-[44px] p-3 rounded-2xl text-start border transition ${
                          activeTheme === th.id
                            ? 'border-gold bg-gold/15'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs font-bold text-ivory block">{th.nameAr}</span>
                        <span className="text-xs text-muted-dim block mt-0.5">{th.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Payment Gateways & Local Wallets */}
              <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-base font-serif font-bold text-champagne">
                    حسابات المحافظ المحلية وبوابات الدفع (Payment Gateways)
                  </h3>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    أرقام حسابات المتجر لتظهر للزبائن عند اختيار التحويل المباشر في سلة الشراء
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">اسم صاحب الحساب التجاري / المستفيد:</label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="مثال: مؤسسة مفتاح الجمال للتجارة"
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">حساب بنك الكريمي المميز / ام فلوس:</label>
                    <input
                      type="text"
                      value={kuraimiAccount}
                      onChange={(e) => setKuraimiAccount(e.target.value)}
                      placeholder="رقم الحساب أو المميز"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">رقم محفظة فلوسك (Floosak):</label>
                    <input
                      type="text"
                      value={floosakAccount}
                      onChange={(e) => setFloosakAccount(e.target.value)}
                      placeholder="رقم هاتف المحفظة"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">رقم محفظة جيب (Jeeb):</label>
                    <input
                      type="text"
                      value={jeebAccount}
                      onChange={(e) => setJeebAccount(e.target.value)}
                      placeholder="رقم هاتف المحفظة"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">رقم محفظة جوالي (Jawali):</label>
                    <input
                      type="text"
                      value={jawaliAccount}
                      onChange={(e) => setJawaliAccount(e.target.value)}
                      placeholder="رقم هاتف المحفظة"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Owner Notifications */}
              <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-base font-serif font-bold text-champagne">
                    إشعارات الطلبات الفورية للمالك (Owner Alerts)
                  </h3>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    إرسال تنبيه مباشر إلى تليجرام أو واتساب المالك في نفس لحظة تأكيد الطلب
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">توكن بوت تيليجرام (Bot Token):</label>
                    <input
                      type="password"
                      value={telegramBotToken}
                      onChange={(e) => setTelegramBotToken(e.target.value)}
                      placeholder="من @BotFather في تيليجرام"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gold font-bold block">معرف المحادثة في تيليجرام (Chat ID):</label>
                    <input
                      type="text"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      placeholder="معرف الشات الشخصي للمالك"
                      className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">رقم واتساب المالك لاستقبال التنبيهات:</label>
                  <input
                    type="text"
                    value={ownerWhatsapp}
                    onChange={(e) => setOwnerWhatsapp(e.target.value)}
                    placeholder="967775234989"
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Master Save Button */}
              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full min-h-[48px] py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                {isSavingSettings ? 'جاري الحفظ والتطبيق...' : 'حفظ وتطبيق كافة إعدادات وهوية المتجر'}
              </button>
            </form>

            {/* SECTION 5: Delivery Zones Manager (delivery_zones) */}
            <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-champagne">
                    إدارة مناطق التوصيل وأسعار الشحن (Delivery Zones)
                  </h3>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    تعديل رسوم الشحن لكل محافظة وتقدير مدة الوصول ليتم احتسابها تلقائياً في السلة
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/15 text-gold font-bold">
                  {shippingZones.length} مناطق مسجلة
                </span>
              </div>

              {/* Add Zone Form */}
              <form onSubmit={handleAddShippingZone} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newZoneNameAr}
                  onChange={(e) => setNewZoneNameAr(e.target.value)}
                  placeholder="اسم المنطقة / المحافظة (مثال: إب)"
                  className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                />
                <input
                  type="text"
                  value={newZoneCity}
                  onChange={(e) => setNewZoneCity(e.target.value)}
                  placeholder="المدينة الرئيسية"
                  className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min="0"
                  value={newZoneFeeYer}
                  onChange={(e) => setNewZoneFeeYer(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="الرسوم (ريال يمني)"
                  className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory font-mono outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 rounded-xl bg-gold/20 hover:bg-gold/30 text-champagne font-bold text-xs border border-gold/40 transition"
                >
                  إضافة منطقة جديدة
                </button>
              </form>

              {/* Zones List */}
              <div className="space-y-2">
                {shippingZones.map((z) => (
                  <div
                    key={z.id}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-ivory block">{z.nameAr}</span>
                      <span className="text-[11px] text-muted-dim block">{z.estimatedDeliveryHours || z.etaHours} · مدينة {z.city}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-champagne">
                        {z.feeYer.toLocaleString('ar-YE')} ر.ي (${z.feeUsd || Math.round(z.feeYer / 530)})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleShippingZone(z.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold border ${
                          z.isAvailable !== false
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-muted-dim border-white/10'
                        }`}
                      >
                        {z.isAvailable !== false ? 'متاح' : 'معطل'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteShippingZone(z.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-bold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: Multi-Branch Manager (multi_branch) */}
            <div className="p-6 rounded-3xl bg-[#0E0E12] border border-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-champagne">
                    إدارة الفروع ونقاط الاستلام (Multi-Branch Management)
                  </h3>
                  <p className="text-xs text-muted-lux font-sans mt-0.5">
                    إضافة فروع للمحل، تحديد العناوين، أوقات العمل، وروابط الخرائط للاستلام المباشر
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gold/15 text-gold font-bold">
                  {branches.length} فروع مسجلة
                </span>
              </div>

              {/* Add Branch Form */}
              <form onSubmit={handleAddBranch} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="اسم الفرع (مثال: فرع حدة الرئيسي)"
                    className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    placeholder="المدينة (مثال: صنعاء)"
                    className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    value={newBranchPhone}
                    onChange={(e) => setNewBranchPhone(e.target.value)}
                    placeholder="رقم هاتف / واتساب الفرع"
                    className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory font-mono outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newBranchAddress}
                    onChange={(e) => setNewBranchAddress(e.target.value)}
                    placeholder="العنوان التفصيلي للفرع"
                    className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    value={newBranchHours}
                    onChange={(e) => setNewBranchHours(e.target.value)}
                    placeholder="أوقات وساعات الدوام"
                    className="min-h-[40px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-gold/20 hover:bg-gold/30 text-champagne font-bold text-xs border border-gold/40 transition"
                >
                  إضافة الفرع الجديد
                </button>
              </form>

              {/* Branches List */}
              <div className="space-y-2">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ivory text-sm">{b.name}</span>
                        {b.isMain && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                            الفرع الرئيسي
                          </span>
                        )}
                      </div>
                      <p className="text-muted-lux">{b.address} · {b.city}</p>
                      <p className="text-[11px] text-muted-dim">{b.hoursAr} | هاتف: {b.phone}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBranch(b.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold border ${
                          b.isActive !== false
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-muted-dim border-white/10'
                        }`}
                      >
                        {b.isActive !== false ? 'مفعل' : 'معطل'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBranch(b.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-bold"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================== */}
      {/* MODAL 1: FULL PRODUCT CREATE / EDIT & MULTI-IMAGE GALLERY MANAGER   */}
      {/* ================================================================== */}
      {prodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0E0E12] rounded-3xl max-h-[90dvh] overflow-y-auto border border-[#C9A84C]/20 shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-champagne">
                  {editingProductId ? 'تعديل شامل للمستحضر والمخزون ومعرض الصور' : 'إضافة مستحضر جديد للمخزن أو الموقع'}
                </h3>
                <p className="text-xs text-muted-lux font-sans mt-0.5">
                  تحكم ببيانات المنتج، الصور المتعددة، الكميات المتوفرة، والتسعير
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProdModalOpen(false)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-ivory"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-6">
              {/* Publishing & Visibility Status */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <label className="text-xs text-gold font-bold block">
                  حالة النشر والظهور للمتسوقين:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormVisibility('published')}
                    className={`min-h-[44px] p-3 rounded-xl border text-xs font-bold text-start transition ${
                      formVisibility === 'published'
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    منشور في الموقع فوراً
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormVisibility('warehouse_only')}
                    className={`min-h-[44px] p-3 rounded-xl border text-xs font-bold text-start transition ${
                      formVisibility === 'warehouse_only'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-white/10 bg-white/5 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    حفظ في المخزن فقط (مخفي عن الموقع)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormVisibility('coming_soon')}
                    className={`min-h-[44px] p-3 rounded-xl border text-xs font-bold text-start transition ${
                      formVisibility === 'coming_soon'
                        ? 'border-gold bg-gold/20 text-champagne'
                        : 'border-white/10 bg-white/5 text-ivory/70 hover:text-ivory'
                    }`}
                  >
                    قريباً (عرض بدون طلب)
                  </button>
                </div>
              </div>

              {/* Multi-Image Gallery Manager */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs text-gold font-bold block">
                      معرض صور المستحضر (Multi-Image Gallery):
                    </label>
                    <span className="text-xs text-muted-lux font-sans">
                      يمكنك رفع عدة صور من جهازك، تعيين صورة الغلاف الرئيسية، أو اختيار صور الاستوديو المدمجة
                    </span>
                  </div>

                  <label className="min-h-[44px] px-4 py-2 rounded-xl bg-gold/20 hover:bg-gold/30 text-champagne text-xs font-bold border border-gold/40 cursor-pointer inline-flex items-center gap-1.5 transition">
                    <span>+ رفع صور من الجهاز</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUploadMessage && (
                  <p className="text-xs text-champagne font-sans">{imageUploadMessage}</p>
                )}

                {/* Display Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                  {formImages.map((imgUrl, idx) => {
                    const isCover = formImage === imgUrl;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 bg-surface group ${
                          isCover ? 'border-gold shadow-[0_0_15px_rgba(201,168,76,0.4)]' : 'border-white/10'
                        }`}
                      >
                        <SmartImage src={imgUrl} alt={`gallery-${idx}`} fill className="object-cover" />

                        {isCover && (
                          <span className="absolute top-1 start-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold text-obsidian-dark z-10">
                            الرئيسية
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1 z-10">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => setFormImage(imgUrl)}
                              className="min-h-[32px] px-2 py-1 rounded bg-gold text-obsidian-dark text-[10px] font-bold"
                            >
                              تعيين كرئيسية
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = formImages.filter((_, i) => i !== idx);
                              setFormImages(remaining);
                              if (formImage === imgUrl && remaining.length > 0) {
                                setFormImage(remaining[0]);
                              }
                            }}
                            className="min-h-[32px] px-2 py-1 rounded bg-rose-950/80 text-rose-300 text-[10px] font-bold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Studio Packshots quick picker */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-xs text-muted-dim font-sans block">
                    أو اختر صور إضافية من استوديو التصوير المعتمد:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {STUDIO_PACKSHOTS.map((sp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!formImages.includes(sp.url)) {
                            setFormImages([...formImages, sp.url]);
                          }
                        }}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-champagne border border-white/10 whitespace-nowrap flex-shrink-0"
                      >
                        + {sp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs text-gold font-bold block">اسم المستحضر الكامل:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثال: سيروم فيتامين سي النقي 10% (Pure Vitamin C10)"
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs text-gold font-bold block">الوصف المختصر (Subtitle):</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="مضاد أكسدة فائق مع حمض الساليسيليك لنضارة فورية"
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">العلامة التجارية / الماركة:</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gold font-bold block">القسم:</label>
                  <select
                    value={formCategorySlug}
                    onChange={(e) => setFormCategorySlug(e.target.value)}
                    className="w-full min-h-[44px] px-4 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                  >
                    <option value="serums" className="bg-[#0E0E12]">السيرومات</option>
                    <option value="cleansers-moisturizers" className="bg-[#0E0E12]">المنظفات والمرطبات</option>
                    <option value="makeup" className="bg-[#0E0E12]">المكياج</option>
                    <option value="skincare" className="bg-[#0E0E12]">العناية بالبشرة</option>
                  </select>
                </div>
              </div>

              {/* Warehouse & Authenticity Metadata */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <span className="text-xs text-gold font-bold block">بيانات المخزن والأصالة:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">رمز SKU:</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">الكمية بالمخزن:</label>
                    <input
                      type="number"
                      min="0"
                      value={formStockQuantity}
                      onChange={(e) => setFormStockQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">حد التنبيه بالنفاد:</label>
                    <input
                      type="number"
                      min="0"
                      value={formLowStockThreshold}
                      onChange={(e) => setFormLowStockThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">كود الاعتماد أو الرمز التعريفي:</label>
                    <input
                      type="text"
                      value={formBatchCode}
                      onChange={(e) => setFormBatchCode(e.target.value)}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">التركيز:</label>
                    <input
                      type="text"
                      value={formConcentration}
                      onChange={(e) => setFormConcentration(e.target.value)}
                      placeholder="مثال: 10%"
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing, Cost & Currencies */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gold font-bold block">التسعير وهامش الربح:</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-champagne border border-gold/30 font-sans">
                    عملة المتجر الأساسية: {CURRENCY_LABELS[storeCurrency]}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className={`text-xs block font-bold ${storeCurrency === 'YER' ? 'text-champagne' : 'text-muted-lux'}`}>
                      سعر البيع (YER){storeCurrency === 'YER' ? ' (النشط)' : ''}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formPriceYer}
                      onChange={(e) => setFormPriceYer(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full min-h-[44px] px-3 rounded-xl bg-white/5 text-xs outline-none ${
                        storeCurrency === 'YER' ? 'border-2 border-gold text-champagne font-bold' : 'border border-white/10 text-ivory'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">السعر قبل الخصم (YER):</label>
                    <input
                      type="number"
                      min="0"
                      value={formComparePriceYer}
                      onChange={(e) => setFormComparePriceYer(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-lux block">سعر التكلفة (YER):</label>
                    <input
                      type="number"
                      min="0"
                      value={formCostPriceYer}
                      onChange={(e) => setFormCostPriceYer(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-xs block font-bold ${storeCurrency === 'SAR' ? 'text-champagne' : 'text-muted-lux'}`}>
                      السعر بالسعودي (SAR){storeCurrency === 'SAR' ? ' (النشط)' : ''}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formPriceSar}
                      onChange={(e) => setFormPriceSar(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full min-h-[44px] px-3 rounded-xl bg-white/5 text-xs outline-none ${
                        storeCurrency === 'SAR' ? 'border-2 border-gold text-champagne font-bold' : 'border border-white/10 text-ivory'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-xs block font-bold ${storeCurrency === 'USD' ? 'text-champagne' : 'text-muted-lux'}`}>
                      السعر بالدولار (USD){storeCurrency === 'USD' ? ' (النشط)' : ''}:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formPriceUsd}
                      onChange={(e) => setFormPriceUsd(Math.max(0, parseInt(e.target.value) || 0))}
                      className={`w-full min-h-[44px] px-3 rounded-xl bg-white/5 text-xs outline-none ${
                        storeCurrency === 'USD' ? 'border-2 border-gold text-champagne font-bold' : 'border border-white/10 text-ivory'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* AI Auto-Categorize & Tagging */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gold font-bold block">
                    الوسوم الذكية والتصنيف بالذكاء الاصطناعي:
                  </span>
                  <button
                    type="button"
                    onClick={handleAiAutoCategorize}
                    disabled={isAiGenerating}
                    className="min-h-[40px] px-3 py-1 rounded-xl bg-gold/20 hover:bg-gold/30 text-champagne text-xs font-bold border border-gold/40 flex items-center gap-1.5"
                  >
                    <SparkleStarIcon size={14} color="#C9A84C" />
                    <span>{isAiGenerating ? 'جارٍ التحليل...' : 'توليد الوسوم والتصنيف بالذكاء الاصطناعي'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-champagne flex items-center gap-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => setFormTags(formTags.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="إضافة وسم مخصص..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTagInput.trim()) {
                          setFormTags([...formTags, customTagInput.trim()]);
                          setCustomTagInput('');
                        }
                      }
                    }}
                    className="flex-1 min-h-[40px] px-3 rounded-lg bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim()) {
                        setFormTags([...formTags, customTagInput.trim()]);
                        setCustomTagInput('');
                      }
                    }}
                    className="min-h-[40px] px-3 rounded-lg bg-white/10 text-xs text-ivory font-bold"
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProdModalOpen(false)}
                  className="min-h-[44px] px-5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs shadow-md"
                >
                  {editingProductId ? 'حفظ التعديلات' : 'إضافة المستحضر للمتجر والمخزن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 2: POS MANUAL SALES ORDER                                    */}
      {/* ================================================================== */}
      {showPosOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0E0E12] rounded-3xl p-6 border border-[#C9A84C]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-champagne">
                تسجيل طلب مبيعات فرع مباشر (POS)
              </h3>
              <button
                type="button"
                onClick={() => setShowPosOrderModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/5 flex items-center justify-center text-ivory"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <form onSubmit={handleCreatePosOrder} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">اختر المستحضر المطلوب:</label>
                <select
                  value={posSelectedProductId}
                  onChange={(e) => setPosSelectedProductId(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  required
                >
                  <option value="" className="bg-[#0E0E12]">-- اضغط لاختيار المستحضر --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0E0E12]">
                      {p.title} ({p.stockQuantity ?? 0} قطعة متوفرة - {formatCurrency(p.prices.YER, 'YER')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    value={posQuantity}
                    onChange={(e) => setPosQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">طريقة السداد:</label>
                  <select
                    value={posPaymentMethod}
                    onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  >
                    <option value="cod" className="bg-[#0E0E12]">نقداً عند الاستلام</option>
                    <option value="kuraimi" className="bg-[#0E0E12]">حوالة الكريمي (حساب تجاري)</option>
                    <option value="jawali" className="bg-[#0E0E12]">محفظة جوالي</option>
                    <option value="floosak" className="bg-[#0E0E12]">محفظة فلوسك</option>
                    <option value="whatsapp" className="bg-[#0E0E12]">تأكيد عبر واتساب</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">اسم العميل:</label>
                  <input
                    type="text"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    placeholder="مثال: د. مها الصنعاني"
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">رقم هاتف العميل:</label>
                  <input
                    type="text"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    placeholder="77XXXXXXX"
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">المدينة والعنوان:</label>
                <input
                  type="text"
                  value={posAddress}
                  onChange={(e) => setPosAddress(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPosOrderModal(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-white/5 text-xs text-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                >
                  تسجيل وخصم من المخزن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 3: ADD / EDIT CATEGORY                                       */}
      {/* ================================================================== */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0E0E12] rounded-3xl p-6 border border-[#C9A84C]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-champagne">
                {editingCategory ? 'تعديل بيانات القسم' : 'إضافة قسم جديد للمتجر'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/5 flex items-center justify-center text-ivory"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">اسم القسم:</label>
                <input
                  type="text"
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  placeholder="مثال: السيرومات العلاجية"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">الوصف أو الشارة التسويقية:</label>
                <input
                  type="text"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  placeholder="مثال: تركيزات نقية معتمدة"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">رابط صورة القسم:</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-white/5 text-xs text-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                >
                  حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 4: ADD BLOG POST                                             */}
      {/* ================================================================== */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0E0E12] rounded-3xl p-6 border border-[#C9A84C]/20 shadow-2xl space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-champagne">
                {editingBlogId ? 'تعديل المقال التحريري في المجلة' : 'كتابة مقال تحريري جديد للمجلة'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddBlogModal(false);
                  setEditingBlogId(null);
                }}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/5 flex items-center justify-center text-ivory"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <form onSubmit={handleSaveBlogPost} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">عنوان المقال:</label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="أسرار فحص سيروم فيتامين سي الأصلي..."
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">مقدمة أو ملخص المقال:</label>
                <input
                  type="text"
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="دليل تفصيلي لكشف السيرومات المغشوشة في السوق اليمني..."
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">المحتوى التحريري الكامل:</label>
                <textarea
                  rows={6}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="اكتب المحتوى التفصيلي مع نقاط الفحص..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">الكاتب أو الجهة:</label>
                  <input
                    type="text"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gold font-bold block">وقت القراءة (دقائق):</label>
                  <input
                    type="number"
                    min="1"
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddBlogModal(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-white/5 text-xs text-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                >
                  {editingBlogId ? 'حفظ تعديلات المقال' : 'نشر المقال'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 5: ADD AUTHENTICITY PRODUCT GUIDE                           */}
      {/* ================================================================== */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0E0E12] rounded-3xl p-6 border border-[#C9A84C]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-champagne">
                إضافة مستحضر معتمد جديد لمختبر الفحص
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBatchModal(false)}
                className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-white/5 flex items-center justify-center text-ivory"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">كود أو معرف المستحضر المعتمد:</label>
                <input
                  type="text"
                  value={newBatchCode}
                  onChange={(e) => setNewBatchCode(e.target.value.toUpperCase())}
                  placeholder="مثال: 54U700 أو 20T900"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs font-mono uppercase outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">اسم المستحضر المعتمد:</label>
                <input
                  type="text"
                  value={batchProductTitle}
                  onChange={(e) => setBatchProductTitle(e.target.value)}
                  placeholder="سيروم فيتامين سي 10% الأصلي"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">مواصفات القوام الأصلي:</label>
                <input
                  type="text"
                  value={batchFormulaNotes}
                  onChange={(e) => setBatchFormulaNotes(e.target.value)}
                  placeholder="قوام كهرماني نقي سريع الامتصاص خالي من الرغوة"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gold font-bold block">مواصفات التغليف والليزر:</label>
                <input
                  type="text"
                  value={batchPackagingNotes}
                  onChange={(e) => setBatchPackagingNotes(e.target.value)}
                  placeholder="زجاج داكن عازل للضوء وختم أصالة محفور بالليزر بقاع القارورة"
                  className="w-full min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="min-h-[44px] px-4 rounded-xl bg-white/5 text-xs text-ivory"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
                >
                  حفظ المستحضر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

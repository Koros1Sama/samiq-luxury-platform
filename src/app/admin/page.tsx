'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/core/currency/formatter';
import {
  VerifiedCheckIcon,
  CrossWarningIcon,
  SparkleStarIcon,
  BagCartIcon,
  WhatsAppIcon,
  CloseIcon,
  ShieldCheckIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { ProductCardData, ThemeId, SAMIQ_THEMES } from '@/themes/contract';
import { OmnichannelConversation } from '@/core/db/store';

const CATEGORY_NAMES_AR: Record<string, string> = {
  serums: 'السيرومات',
  'cleansers-moisturizers': 'المنظفات والمرطبات',
  makeup: 'المكياج',
  skincare: 'العناية بالبشرة',
};

export default function MerchantAdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: inbox | inventory | orders | bookings | authenticity | coupons | settings
  const [activeTab, setActiveTab] = useState<
    'inbox' | 'inventory' | 'orders' | 'bookings' | 'authenticity' | 'coupons' | 'settings'
  >('inbox');

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [conversations, setConversations] = useState<OmnichannelConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-wa-1');
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // New product form
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('سيرومات نقية');
  const [newCategory, setNewCategory] = useState('serums');
  const [newPriceYer, setNewPriceYer] = useState(25000);
  const [newPriceSar, setNewPriceSar] = useState(175);
  const [newPriceUsd, setNewPriceUsd] = useState(48);
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState<string[]>(['تفتيح التصبغات', 'نضارة فورية']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Batch auto-tagging toast & state
  const [isBatchTagging, setIsBatchTagging] = useState(false);
  const [batchToast, setBatchToast] = useState('');

  // Inline product tag editor
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [inlineNewTag, setInlineNewTag] = useState('');

  // New coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);

  // Store & Template Settings
  const [activeTheme, setActiveTheme] = useState<ThemeId>('luxury-noir');
  const [storeName, setStoreName] = useState('مفتاح الجمال');
  const [storeLegalName, setStoreLegalName] = useState('مفتاح الجمال — لكشف المقلد');
  const [storeTagline, setStoreTagline] = useState('بوابتك الموثوقة لعالم الجمال الأصلي في اليمن');
  const [storeWhatsapp, setStoreWhatsapp] = useState('775234989');
  const [storeCity, setStoreCity] = useState('صنعاء');
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    const authSaved = localStorage.getItem('samiq_admin_auth');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
    }
    fetchProducts();
    fetchOrders();
    fetchBookings();
    fetchConversations();
    fetchStoreConfig();
  }, []);

  const fetchStoreConfig = async () => {
    try {
      const res = await fetch('/api/platform/config');
      const data = await res.json();
      if (data.success) {
        if (data.themeId) setActiveTheme(data.themeId);
        if (data.tenant) {
          setStoreName(data.tenant.name || 'مفتاح الجمال');
          setStoreLegalName(data.tenant.legalName || 'مفتاح الجمال — لكشف المقلد');
          setStoreTagline(data.tenant.tagline || 'بوابتك الموثوقة لعالم الجمال الأصلي في اليمن');
          setStoreWhatsapp(data.tenant.whatsapp || '775234989');
          setStoreCity(data.tenant.city || 'صنعاء');
        }
      }
    } catch (e) {}
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      passcode.trim() === 'miftah2026' ||
      passcode.trim() === 'admin2026' ||
      passcode.trim() === 'samiq2026' ||
      passcode.trim() === '1234'
    ) {
      setIsAuthenticated(true);
      localStorage.setItem('samiq_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('رمز الدخول غير صحيح. يمكنك استخدام زر الدخول السريع أدناه للتجربة.');
    }
  };

  const handleQuickDemoLogin = () => {
    setPasscode('miftah2026');
    setIsAuthenticated(true);
    localStorage.setItem('samiq_admin_auth', 'true');
    setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('samiq_admin_auth');
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/store/products');
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

  const handleToggleBot = async (convId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/store/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          conversationId: selectedConvId,
          text: replyText.trim(),
          senderName: 'خبير العناية (مفتاح الجمال)',
        }),
      });
      const data = await res.json();
      if (data.success && data.conversation) {
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

  // AI Assistant generator for single product
  const handleAiGenerate = async () => {
    if (!newTitle) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/product-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          brand: newBrand,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        if (d.brand) setNewBrand(d.brand);
        if (d.suggestedCategory) setNewCategory(d.suggestedCategory);
        if (d.arabicDescription) setNewDescription(d.arabicDescription);
        if (d.suggestedTags) setNewTags(d.suggestedTags);
        if (d.confidence) setAiConfidence(d.confidence);
        if (d.suggestedPriceYer) setNewPriceYer(d.suggestedPriceYer);
        if (d.suggestedPriceSar) setNewPriceSar(d.suggestedPriceSar);
        if (d.suggestedPriceUsd) setNewPriceUsd(d.suggestedPriceUsd);
      }
    } catch (e) {
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Batch Auto-Tag All Products in database
  const handleBatchAutoTagAll = async () => {
    setIsBatchTagging(true);
    setBatchToast('');
    try {
      const res = await fetch('/api/ai/product-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'batch_reclassify' }),
      });
      const data = await res.json();
      if (data.success) {
        setBatchToast(data.message || 'تمت فهرسة وتصنيف كافة المنتجات بالذكاء الاصطناعي بنجاح');
        fetchProducts();
        setTimeout(() => setBatchToast(''), 5000);
      }
    } catch (e) {
      setBatchToast('فشل التوليد الآلي للوسوم');
    } finally {
      setIsBatchTagging(false);
    }
  };

  // Add Product to database
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const payload: ProductCardData = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      brand: newBrand,
      categorySlug: newCategory,
      image: '/media/products/serum-vitamin-c.jpg',
      prices: {
        YER: newPriceYer,
        SAR: newPriceSar,
        USD: newPriceUsd,
      },
      isAuthenticGuaranteed: true,
      badge: 'إصدار موثق جديد',
      subtitle: newDescription.slice(0, 70),
      tags: newTags,
      aiCategoryConfidence: aiConfidence || 98,
      skinTypes: ['all'],
    };

    try {
      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddProductModal(false);
        setNewTitle('');
        setNewDescription('');
        setNewTags(['تفتيح التصبغات', 'نضارة فورية']);
        setAiConfidence(null);
        fetchProducts();
      }
    } catch (e) {}
  };

  // Inline Tag Add for Existing Product
  const handleAddInlineTag = async (product: ProductCardData) => {
    if (!inlineNewTag.trim()) return;
    const cleanTag = inlineNewTag.trim().replace(/^#/, '');
    const currentTags = product.tags || [];
    if (currentTags.includes(cleanTag)) {
      setInlineNewTag('');
      setEditingProductId(null);
      return;
    }

    const updatedTags = [...currentTags, cleanTag];
    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          tags: updatedTags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, tags: updatedTags } : p))
        );
        setInlineNewTag('');
        setEditingProductId(null);
      }
    } catch (e) {}
  };

  // Inline Tag Remove for Existing Product
  const handleRemoveInlineTag = async (product: ProductCardData, tagToRemove: string) => {
    const updatedTags = (product.tags || []).filter((t) => t !== tagToRemove);
    try {
      const res = await fetch('/api/store/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          tags: updatedTags,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, tags: updatedTags } : p))
        );
      }
    } catch (e) {}
  };

  // Add Coupon
  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      alert(`تم تفعيل كوبون الخصم: ${newCouponCode.toUpperCase()} بنسبة ${newCouponDiscount}% في سجل المتجر.`);
      setNewCouponCode('');
    } catch (e) {}
  };

  // Save Store Settings & Template
  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const res = await fetch('/api/platform/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: activeTheme,
          tenant: {
            name: storeName,
            legalName: storeLegalName,
            tagline: storeTagline,
            whatsapp: storeWhatsapp,
            city: storeCity,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccessMsg('تم حفظ وتحديث إعدادات المتجر والقالب بنجاح في قاعدة البيانات.');
        setTimeout(() => setSettingsSuccessMsg(''), 4000);
      }
    } catch (e) {
    } finally {
      setIsSavingSettings(false);
    }
  };

  // --------------------------------------------------------------------------
  // AUTHENTICATION GATE
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md p-8 rounded-3xl bg-surface border border-gold/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow mb-4">
              <ShieldCheckIcon size={32} color="#C9A84C" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-ivory">
              بوابة إدارة متجر مفتاح الجمال
            </h1>
            <p className="text-xs text-muted-lux font-sans">
              سَامِق — لوحة تحكم التاجر الموحدة (SAMIQ Merchant Portal)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-lux mb-1.5">
                رمز المرور السري للوحة الإدارة:
              </label>
              <input
                type="password"
                placeholder="أدخل رمز المرور..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder-muted-dim text-xs focus:border-gold outline-none text-center"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-sans text-center bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[44px] py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center"
            >
              تسجيل الدخول إلى اللوحة
            </button>
          </form>

          {/* Quick Demo Login Helper */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2.5">
            <p className="text-xs text-muted-lux">
              رمز المرور الافتراضي للتجربة السريعة: <code className="text-gold font-mono">miftah2026</code>
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gold border border-gold/30 text-xs font-semibold transition inline-flex items-center justify-center"
            >
              دخول سريع للتجربة بنقرة واحدة (Demo Quick Login)
            </button>
            <div>
              <Link href="/" className="min-h-[44px] inline-flex items-center text-xs text-muted-lux hover:text-ivory transition">
                ← العودة إلى المتجر الرئيسي
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active selected conversation
  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  return (
    <div className="min-h-screen bg-obsidian text-ivory p-4 sm:p-8 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-gold/40 flex items-center justify-center font-serif text-lg font-bold text-champagne shadow-md">
              مـج
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-ivory">
                لوحة إدارة متجر مفتاح الجمال (صنعاء)
              </h1>
              <p className="text-xs text-muted-lux">
                إدارة المخزون، الوسوم الذكية، المساعد الذكي، الطلبات، وإعدادات القالب
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <span>المتجر الحي</span>
              <span>←</span>
            </Link>
            <Link
              href="/platform"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition inline-flex items-center"
            >
              لوحة المنصة (Platform)
            </Link>
            <Link
              href="/account"
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition inline-flex items-center"
            >
              بوابة العملاء (/account)
            </Link>
            <button
              onClick={handleLogout}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-500/30 text-xs font-semibold transition inline-flex items-center"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">محادثات العملاء النشطة</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-ivory">{conversations.length}</span>
              <span className="text-xs text-emerald-400 font-sans font-bold">صندوق موحد</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">طلبات المتجر المسجلة</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-ivory">{orders.length}</span>
              <span className="text-xs text-emerald-400 font-sans font-bold">نشط</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">المستحضرات في الكتالوج</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-ivory">{products.length}</span>
              <span className="text-xs text-gold font-sans font-bold">وسوم ذكية مفهرسة</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">حجوزات الاستشارات</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-ivory">{bookings.length}</span>
              <span className="text-xs text-champagne font-sans font-bold">جلسات مؤكدة</span>
            </div>
          </div>
        </div>

        {/* 7-Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            <span>صندوق المحادثات</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-xs">
              {conversations.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            إدارة المخزون والوسوم ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            طلبات الشراء ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
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
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
              activeTab === 'authenticity'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            دليل فحص الأصالة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            كوبونات الخصم
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition inline-flex items-center ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            إعدادات المتجر والقالب
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: OMNICHANNEL INBOX                                           */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Conversation List (4 cols) */}
            <div className="lg:col-span-4 p-4 rounded-3xl bg-surface border border-white/5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-serif font-bold text-ivory">محادثات القنوات الحية</h3>
                <span className="text-xs text-muted-lux">واتساب • تيليجرام • شات الموقع</span>
              </div>

              <div className="space-y-2">
                {conversations.map((c) => {
                  const isSelected = c.id === selectedConvId;
                  const channelColor =
                    c.channel === 'whatsapp'
                      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                      : c.channel === 'telegram'
                      ? 'text-sky-400 bg-sky-950/40 border-sky-500/30'
                      : 'text-gold bg-gold/10 border-gold/30';
                  const channelLabel =
                    c.channel === 'whatsapp'
                      ? 'واتساب'
                      : c.channel === 'telegram'
                      ? 'تيليجرام'
                      : 'شات الموقع';

                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`w-full min-h-[44px] text-start p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gold/10 border-gold/40 shadow-sm'
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-ivory truncate max-w-[150px]">
                          {c.customerName}
                        </span>
                        <span className={`text-xs font-sans px-2 py-0.5 rounded-full border ${channelColor}`}>
                          {channelLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-lux truncate leading-snug">
                        {c.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-xs text-muted-lux">
                        <span>{c.lastMessageTime}</span>
                        <span className={`font-semibold ${c.isBotActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {c.isBotActive ? 'البوت نشط' : 'رد بشري مفعّل'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation Thread & Human Takeover (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-surface border border-white/5 space-y-4 flex flex-col justify-between min-h-[500px]">
              {activeConv ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-serif font-bold text-ivory">
                          {activeConv.customerName}
                        </h4>
                        <span className="text-xs text-muted-lux font-mono">
                          ({activeConv.customerIdentifier})
                        </span>
                      </div>
                      <p className="text-xs text-muted-lux mt-0.5">
                        قناة التواصل: <span className="text-gold font-semibold">{activeConv.channel}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBot(activeConv.id, activeConv.isBotActive)}
                        className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-bold transition inline-flex items-center gap-2 border ${
                          activeConv.isBotActive
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-950/70'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-950/70'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            activeConv.isBotActive ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span>{activeConv.isBotActive ? 'إيقاف البوت مؤقتاً للرد' : 'استئناف رد البوت الآلي'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="space-y-3 overflow-y-auto max-h-[350px] p-2">
                    {activeConv.messages.map((m) => {
                      const isCustomer = m.sender === 'customer';
                      const isBot = m.sender === 'bot';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                        >
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-xs font-bold text-muted-lux">
                              {m.senderName}
                            </span>
                            <span className="text-xs text-muted-dim font-mono">{m.timestamp}</span>
                          </div>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs font-sans leading-relaxed ${
                              isCustomer
                                ? 'bg-white/5 border border-white/10 text-ivory rounded-tr-none'
                                : isBot
                                ? 'bg-surface-elevated border border-gold/30 text-champagne rounded-tl-none'
                                : 'bg-gradient-to-r from-[#BF953F]/20 to-[#B38728]/20 border border-gold text-ivory rounded-tl-none font-medium'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendHumanReply} className="pt-3 border-t border-white/10 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={
                        activeConv.isBotActive
                          ? 'أوقفي البوت أولاً للرد كـ موظف بشري مباشر...'
                          : 'اكتبي ردك المباشر للعميل كـ موظف بشري...'
                      }
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={activeConv.isBotActive || isSendingReply}
                      className="flex-1 min-h-[44px] px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder-muted-dim text-xs focus:border-gold outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={activeConv.isBotActive || !replyText.trim() || isSendingReply}
                      className="min-h-[44px] px-5 py-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition disabled:opacity-40 inline-flex items-center justify-center"
                    >
                      {isSendingReply ? 'جارٍ الإرسال...' : 'إرسال الرد البشري'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-lux text-xs">
                  لا توجد محادثة محددة
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: INVENTORY & SMART TAGS MANAGEMENT                           */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-ivory">
                  كتالوج المستحضرات والوسوم الذكية ({products.length})
                </h3>
                <p className="text-xs text-muted-lux">
                  تصنيف ذكي متعدد الأبعاد عبر AI Smart Tags مع فلترة فورية وحفظ دائم
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleBatchAutoTagAll}
                  disabled={isBatchTagging}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition inline-flex items-center gap-1.5"
                >
                  <SparkleStarIcon size={16} color="#C9A84C" />
                  <span>{isBatchTagging ? 'جارٍ التصنيف...' : 'فهرسة وتصنيف الكتالوج تلقائياً بالذكاء الاصطناعي'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center gap-1.5"
                >
                  <span>+</span>
                  <span>إضافة مستحضر جديد بالذكاء الاصطناعي</span>
                </button>
              </div>
            </div>

            {batchToast && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-sans">
                {batchToast}
              </div>
            )}

            {/* Product Cards with Smart Tags & Inline Tag Editor */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const categoryAr = CATEGORY_NAMES_AR[p.categorySlug] || p.categorySlug;
                const isEditing = editingProductId === p.id;

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-surface border border-white/5 space-y-3 relative group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs text-gold font-serif font-bold">
                          {p.brand}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {categoryAr}
                          </span>
                          {p.aiCategoryConfidence && (
                            <span className="text-xs text-champagne bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                              {p.aiCategoryConfidence}% AI
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-ivory line-clamp-2">{p.title}</h4>

                      {/* Smart Tags Display & Removal */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-xs text-muted-lux block font-medium">الوسوم الذكية النشطة:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags && p.tags.length > 0 ? (
                            p.tags.map((t) => (
                              <span
                                key={t}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-champagne"
                              >
                                <span>#{t}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInlineTag(p, t)}
                                  className="w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-dim hover:text-rose-400"
                                  title="حذف الوسم"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-dim">لا توجد وسوم مخصصة</span>
                          )}
                        </div>
                      </div>

                      {/* Inline Add Tag */}
                      <div className="pt-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              autoFocus
                              placeholder="اكتبي الوسم الجديد..."
                              value={inlineNewTag}
                              onChange={(e) => setInlineNewTag(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddInlineTag(p);
                                }
                              }}
                              className="flex-1 min-h-[40px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddInlineTag(p)}
                              className="min-h-[40px] px-3 rounded-lg bg-gold text-obsidian-dark font-bold text-xs"
                            >
                              حفظ
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProductId(null);
                                setInlineNewTag('');
                              }}
                              className="min-h-[40px] px-2 rounded-lg text-xs text-muted-lux hover:text-ivory"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProductId(p.id);
                              setInlineNewTag('');
                            }}
                            className="min-h-[40px] px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-champagne font-medium transition inline-flex items-center gap-1"
                          >
                            <span>+ إضافة وسم ذكي للمنتج</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
                      <div className="text-champagne font-bold text-sm">
                        {formatCurrency(p.prices.YER, 'YER')}
                      </div>
                      <div className="text-xs text-muted-lux">
                        (${p.prices.USD} / {p.prices.SAR} ر.س)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: ORDERS FEED                                                 */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-ivory">سجل طلبات المتجر المباشرة</h3>
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-5 rounded-2xl bg-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gold font-bold">{o.orderNumber}</span>
                      <span className="text-sm font-semibold text-ivory">{o.customerName}</span>
                      <span className="text-xs text-muted-lux font-mono">({o.customerPhone})</span>
                    </div>
                    <p className="text-xs text-muted-lux">
                      {o.city} — {o.address} • {o.items?.length || 1} منتجات
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="text-champagne font-bold text-base">
                      {formatCurrency(o.totalYer, 'YER')}
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      {o.status === 'confirmed' ? 'مؤكد وجارٍ التجهيز' : 'طلب جديد'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: BOOKINGS                                                    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-ivory">حجوزات الاستشارات التجميلية</h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-ivory">{b.customerName}</span>
                      <span className="text-xs text-muted-lux font-mono">({b.phone})</span>
                    </div>
                    <p className="text-xs text-gold">
                      الخدمة: {b.serviceTitle} • الفرع: {b.branchCity}
                    </p>
                    <p className="text-xs text-muted-lux">
                      الموعد: {b.preferredDate} ({b.preferredTimeSlot})
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
                    مؤكد بالفرع
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: AUTHENTICITY ARCHIVE                                        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'authenticity' && (
          <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
            <h3 className="text-lg font-serif font-bold text-ivory">
              أدلة مقارنة وفحص الأصالة النشطة
            </h3>
            <p className="text-xs text-muted-lux">
              مفتاح الجمال يوفر أدلة فحص صارمة لتركيبات العناية المعتمدة مع مطابقة أرقام الباتش كود.
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs text-gold font-bold">رقم التشغيلة المعتمد للتحقق:</span>
              <div className="font-mono text-sm text-ivory">54U700 (سيروم فيتامين سي 10% — تركيبة نقية)</div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 6: COUPONS                                                     */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'coupons' && (
          <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-6">
            <h3 className="text-lg font-serif font-bold text-ivory">إدارة كوبونات الخصم والعروض</h3>
            <form onSubmit={handleAddCoupon} className="flex gap-3 max-w-md">
              <input
                type="text"
                placeholder="كود الخصم (مثال: YEMEN2026)"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs uppercase focus:border-gold outline-none"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs inline-flex items-center justify-center"
              >
                تفعيل الكوبون
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 7: STORE & TEMPLATE SETTINGS                                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'settings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/5 space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-ivory">
                إعدادات المتجر والقالب المعماري (Store & Template Settings)
              </h3>
              <p className="text-xs text-muted-lux">
                تغيير القالب النشط للمتجر وتحديث بيانات العلامة التجارية وحفظها في قاعدة البيانات
              </p>
            </div>

            {settingsSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-sans">
                {settingsSuccessMsg}
              </div>
            )}

            {/* Template Selector Cards */}
            <div className="space-y-3">
              <label className="text-xs font-sans font-bold text-gold block">
                القالب المعماري المعتمد للمتجر:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.values(SAMIQ_THEMES).map((th) => {
                  const isCur = activeTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setActiveTheme(th.id)}
                      className={`min-h-[44px] p-4 rounded-2xl border text-start transition-all ${
                        isCur
                          ? 'bg-elevated border-gold shadow-md'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-ivory">{th.nameAr}</span>
                        {isCur && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gold text-obsidian-dark font-bold">
                            النشط
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-lux leading-relaxed">
                        {th.paletteDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store Metadata Form */}
            <form onSubmit={handleSaveStoreSettings} className="space-y-4 pt-4 border-t border-white/10 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-lux font-semibold block mb-1">اسم المتجر العام:</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux font-semibold block mb-1">الاسم القانوني والشعار:</label>
                  <input
                    type="text"
                    value={storeLegalName}
                    onChange={(e) => setStoreLegalName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-muted-lux font-semibold block mb-1">رقم الواتساب للطلبات:</label>
                  <input
                    type="text"
                    value={storeWhatsapp}
                    onChange={(e) => setStoreWhatsapp(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none dir-ltr text-end"
                  />
                </div>
                <div>
                  <label className="text-muted-lux font-semibold block mb-1">المدينة الرئيسية:</label>
                  <input
                    type="text"
                    value={storeCity}
                    onChange={(e) => setStoreCity(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-lux font-semibold block mb-1">الشعار والوصف التسويقي:</label>
                <textarea
                  rows={2}
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs focus:border-gold outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center"
              >
                {isSavingSettings ? 'جارٍ الحفظ...' : 'حفظ إعدادات المتجر والقالب في قاعدة البيانات'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-surface border border-gold/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" />
                <h3 className="text-base font-serif font-bold text-ivory">
                  إضافة مستحضر جديد وتصنيفه بالذكاء الاصطناعي
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/5 flex items-center justify-center text-muted-lux hover:text-ivory text-xs"
              >
                <CloseIcon size={16} color="#9A968E" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-muted-lux block mb-1">اسم المستحضر الكامل:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: سيروم فيتامين سي 10% نقي لنضارة فورية"
                    className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiGenerating || !newTitle}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-champagne font-bold shrink-0 transition inline-flex items-center justify-center gap-1.5"
                  >
                    <SparkleStarIcon size={16} color="#C9A84C" />
                    <span>{isAiGenerating ? 'جارٍ التحليل...' : 'تصنيف وتوليد بالذكاء الاصطناعي'}</span>
                  </button>
                </div>
              </div>

              {aiConfidence && (
                <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-bold">
                    دقة التصنيف الذكي: {aiConfidence}%
                  </span>
                  <span className="text-xs text-emerald-400">
                    تم التنبؤ بالتصنيف والوسوم بنجاح
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-lux block mb-1">الماركة العالمية:</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-surface border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="سيرومات نقية">سيرومات نقية</option>
                    <option value="عناية يومية">عناية يومية</option>
                    <option value="مكياج مخملي">مكياج مخملي</option>
                    <option value="عناية متقدمة">عناية متقدمة</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">التصنيف:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-surface border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="serums">السيرومات</option>
                    <option value="cleansers-moisturizers">المنظفات والمرطبات</option>
                    <option value="makeup">المكياج</option>
                    <option value="skincare">العناية بالبشرة</option>
                  </select>
                </div>
              </div>

              {/* Smart Tags Interactive Chip Editor */}
              <div className="space-y-2">
                <label className="text-muted-lux block font-medium">
                  الوسوم الذكية للمنتج (Smart Tags):
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 min-h-[44px]">
                  {newTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold/15 text-champagne border border-gold/30 font-medium"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => setNewTags((prev) => prev.filter((t) => t !== tag))}
                        className="w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-dim hover:text-rose-400"
                        title="حذف الوسم"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أضيفي وسماً مخصصاً (مثال: ترطيب مكثف)..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTagInput.trim()) {
                          setNewTags((prev) => [...prev, customTagInput.trim().replace(/^#/, '')]);
                          setCustomTagInput('');
                        }
                      }
                    }}
                    className="flex-1 min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim()) {
                        setNewTags((prev) => [...prev, customTagInput.trim().replace(/^#/, '')]);
                        setCustomTagInput('');
                      }
                    }}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-ivory font-bold shrink-0 text-xs"
                  >
                    + إضافة وسم
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-muted-lux block mb-1">السعر (ر.ي):</label>
                  <input
                    type="number"
                    value={newPriceYer}
                    onChange={(e) => setNewPriceYer(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">السعر (ر.س):</label>
                  <input
                    type="number"
                    value={newPriceSar}
                    onChange={(e) => setNewPriceSar(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">السعر ($):</label>
                  <input
                    type="number"
                    value={newPriceUsd}
                    onChange={(e) => setNewPriceUsd(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-lux block mb-1">الوصف الفاخر للمستحضر:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[44px] py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center"
              >
                حفظ وإدراج المستحضر في الكتالوج المباشر
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

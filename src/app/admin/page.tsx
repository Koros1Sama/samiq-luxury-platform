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
import { ThemeSwitcher } from '@/themes/base/luxury-noir/components/ThemeSwitcher';
import { ProductCardData } from '@/themes/contract';
import { OmnichannelConversation } from '@/core/db/store';

export default function MerchantAdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'inbox' | 'inventory' | 'orders' | 'bookings' | 'authenticity' | 'coupons'>('inbox');
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
  const [newBrand, setNewBrand] = useState('La Roche-Posay');
  const [newCategory, setNewCategory] = useState('serums');
  const [newPriceYer, setNewPriceYer] = useState(25000);
  const [newPriceSar, setNewPriceSar] = useState(175);
  const [newPriceUsd, setNewPriceUsd] = useState(48);
  const [newDescription, setNewDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);

  useEffect(() => {
    const authSaved = localStorage.getItem('samiq_admin_auth');
    if (authSaved === 'true') {
      setIsAuthenticated(true);
    }
    fetchProducts();
    fetchOrders();
    fetchBookings();
    fetchConversations();
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode.trim() === 'miftah2026' || passcode.trim() === 'admin2026' || passcode.trim() === '1234') {
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

  // AI Assistant generator
  const handleAiGenerate = async () => {
    if (!newTitle) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/product-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: newTitle,
          brand: newBrand,
          category: newCategory,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewDescription(data.copy.luxuryDescription);
      }
    } catch (e) {
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const payload: ProductCardData = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      brand: newBrand,
      categorySlug: newCategory,
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      prices: {
        YER: newPriceYer,
        SAR: newPriceSar,
        USD: newPriceUsd,
      },
      isAuthenticGuaranteed: true,
      badge: 'إصدار موثق جديد',
      subtitle: newDescription.slice(0, 70),
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
        fetchProducts();
      }
    } catch (e) {}
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      alert(`تم تفعيل كوبون الخصم: ${newCouponCode.toUpperCase()} بنسبة ${newCouponDiscount}% في سجل المتجر.`);
      setNewCouponCode('');
    } catch (e) {}
  };

  // --------------------------------------------------------------------------
  // LUXURY AUTHENTICATION GATE
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
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder-muted-dim text-sm focus:border-gold outline-none text-center tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-sans text-center bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-sm hover:brightness-110 shadow-md transition"
            >
              تسجيل الدخول إلى اللوحة
            </button>
          </form>

          {/* Quick Demo Login Helper */}
          <div className="pt-4 border-t border-white/10 text-center space-y-2.5">
            <p className="text-[11px] text-muted-lux">
              رمز المرور الافتراضي للتجربة السريعة: <code className="text-gold font-mono">miftah2026</code>
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gold border border-gold/30 text-xs font-semibold transition"
            >
              دخول سريع للتجربة بنقرة واحدة (Demo Quick Login)
            </button>
            <div>
              <Link href="/" className="text-xs text-muted-lux hover:text-ivory transition">
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
    <div className="min-h-screen bg-obsidian text-ivory p-6 sm:p-10 font-sans">
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
                إدارة المخزون، صندوق المحادثات الموحد، مساعد المنتجات الذكي، والحجوزات الفورية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <ThemeSwitcher />
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>المتجر</span>
              <span>←</span>
            </Link>
            <Link
              href="/platform"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition"
            >
              المنصة
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
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
              <span className="text-xs text-gold font-sans font-bold">موثقة 100%</span>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition flex items-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            <span>صندوق المحادثات الموحد (Omnichannel Inbox)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px]">
              {conversations.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            إدارة المخزون ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
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
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
              activeTab === 'authenticity'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            دليل الأصلي والتقليد
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
              activeTab === 'coupons'
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            كوبونات الخصم
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: OMNICHANNEL INBOX & HUMAN TAKEOVER                          */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'inbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Conversation List (4 cols) */}
            <div className="lg:col-span-4 p-4 rounded-3xl bg-surface border border-white/5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-serif font-bold text-ivory">محادثات القنوات الحية</h3>
                <span className="text-[10px] text-muted-lux">واتساب • تيليجرام • شات الموقع</span>
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
                      className={`w-full text-start p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gold/10 border-gold/40 shadow-sm'
                          : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-ivory truncate max-w-[150px]">
                          {c.customerName}
                        </span>
                        <span className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${channelColor}`}>
                          {channelLabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-lux truncate leading-snug">
                        {c.lastMessage}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] text-muted-lux">
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
                  {/* Thread Header */}
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

                    {/* Bot Pause / Resume Toggle Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleBot(activeConv.id, activeConv.isBotActive)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-2 border ${
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
                        <span>
                          {activeConv.isBotActive
                            ? 'إيقاف البوت والرد كموظف بشري'
                            : 'إعادة تفعيل الرد الآلي بالذكاء الاصطناعي'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="space-y-3.5 overflow-y-auto max-h-[350px] p-2">
                    {activeConv.messages.map((m) => {
                      const isCustomer = m.sender === 'customer';
                      const isBot = m.sender === 'bot';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                        >
                          <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[10px] font-bold text-muted-lux">
                              {m.senderName}
                            </span>
                            <span className="text-[9px] text-muted-dim font-mono">{m.timestamp}</span>
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
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder-muted-dim text-xs focus:border-gold outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={activeConv.isBotActive || !replyText.trim() || isSendingReply}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition disabled:opacity-40"
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
        {/* TAB 2: INVENTORY MANAGEMENT                                        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-ivory">
                كتالوج المستحضرات الفاخرة ({products.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition flex items-center gap-1.5"
              >
                <span>+</span>
                <span>إضافة مستحضر جديد بالذكاء الاصطناعي</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-3xl bg-surface border border-white/5 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gold font-serif font-bold uppercase tracking-wider">
                      {p.brand}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      أصلي موثق
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-ivory line-clamp-1">{p.title}</h4>

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                    <div className="text-champagne font-bold text-sm">
                      {formatCurrency(p.prices.YER, 'YER')}
                    </div>
                    <div className="text-[11px] text-muted-lux">
                      (${p.prices.USD} / {p.prices.SAR} ر.س)
                    </div>
                  </div>
                </div>
              ))}
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
                <div key={o.id} className="p-5 rounded-2xl bg-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
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
                <div key={b.id} className="p-5 rounded-2xl bg-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              أدلة مقارنة الأصلي والتقليد النشطة
            </h3>
            <p className="text-xs text-muted-lux">
              مفتاح الجمال يوفر أدلة فحص صارمة لـ La Roche-Posay و The Ordinary و CeraVe مع مطابقة أرقام الباتش كود.
            </p>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs text-gold font-bold">رقم التشغيلة المعتمد للتحقق:</span>
              <div className="font-mono text-sm text-ivory">54U700 (سيروم فيتامين سي 10% — لاروش بوزيه)</div>
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory text-xs uppercase focus:border-gold outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs"
              >
                تفعيل الكوبون
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
              <h3 className="text-base font-serif font-bold text-ivory">
                إضافة مستحضر تجميل جديد للكتالوج
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-muted-lux hover:text-ivory text-xs"
              >
                <CloseIcon size={14} color="#9A968E" />
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
                    placeholder="مثال: CeraVe SA Smoothing Cleanser 236ml"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiGenerating || !newTitle}
                    className="px-3 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-champagne font-bold shrink-0 transition"
                  >
                    {isAiGenerating ? 'جارٍ التوليد...' : 'صياغة بالذكاء الاصطناعي'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-lux block mb-1">الماركة العالمية:</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="La Roche-Posay">La Roche-Posay</option>
                    <option value="CeraVe">CeraVe</option>
                    <option value="The Ordinary">The Ordinary</option>
                    <option value="Yves Saint Laurent">Yves Saint Laurent</option>
                    <option value="Huda Beauty">Huda Beauty</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">التصنيف:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="serums">سيرومات علاجية</option>
                    <option value="cleansers">غسولات طبية</option>
                    <option value="moisturizers">مرطبات مكثفة</option>
                    <option value="makeup">مكياج فاخر</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-muted-lux block mb-1">السعر (ر.ي):</label>
                  <input
                    type="number"
                    value={newPriceYer}
                    onChange={(e) => setNewPriceYer(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">السعر (ر.س):</label>
                  <input
                    type="number"
                    value={newPriceSar}
                    onChange={(e) => setNewPriceSar(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">السعر ($):</label>
                  <input
                    type="number"
                    value={newPriceUsd}
                    onChange={(e) => setNewPriceUsd(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted-lux block mb-1">الوصف الفاخر للمستحضر:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition"
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

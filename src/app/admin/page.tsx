'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/core/currency/formatter';
import { VerifiedCheckIcon, CrossWarningIcon, SparkleStarIcon, BagCartIcon } from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { ProductCardData } from '@/themes/contract';

export default function MerchantAdminPage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'authenticity' | 'orders' | 'coupons' | 'bookings'>('inventory');
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form
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
    fetchProducts();
    fetchOrders();
    fetchBookings();
  }, []);

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

  // AI Product Assistant Generator
  const handleAiAutoFill = async () => {
    if (!newTitle.trim()) {
      alert('يرجى كتابة اسم المستحضر أولاً لتشغيل المساعد الذكي');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/product-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setNewBrand(json.data.brand);
        setNewCategory(json.data.categorySlug);
        setNewDescription(json.data.arabicDescription);
      }
    } catch (err) {
      console.error('AI assistant error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/store/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          brand: newBrand,
          categorySlug: newCategory,
          description: newDescription,
          prices: { YER: Number(newPriceYer), SAR: Number(newPriceSar), USD: Number(newPriceUsd) },
          isAuthenticGuaranteed: true,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        }),
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
                إدارة المخزون، أدلة مقارنة الأصلي، مساعد المنتجات الذكي، والحجوزات الفورية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>معاينة واجهة المتجر</span>
              <span>←</span>
            </Link>
            <Link
              href="/platform"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory border border-white/10 text-xs font-semibold transition"
            >
              لوحة منصة سَامِق
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">طلبات المتجر المسجلة</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-ivory">{orders.length}</span>
              <span className="text-xs text-emerald-400 font-sans font-bold">نشط</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-surface border border-white/5 space-y-2">
            <span className="text-xs text-muted-lux font-medium">إجمالي المبيعات التراكمية</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-serif font-bold text-champagne">
                {formatCurrency(orders.reduce((sum, o) => sum + (o.totalYer || 0), 0), 'YER')}
              </span>
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
        </div>

        {/* Tab 1: Products Inventory */}
        {activeTab === 'inventory' && (
          <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-lg font-serif font-bold text-ivory">
                كتالوج المنتجات الفعلي في متجر صنعاء
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark text-xs font-bold hover:brightness-110 shadow-md transition flex items-center gap-1.5"
              >
                <span>+ إضافة مستحضر جديد (مع الـ AI)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/10 text-muted-lux text-start">
                    <th className="py-3 px-4 font-semibold text-start">المستحضر والماركة</th>
                    <th className="py-3 px-4 font-semibold text-start">السعر (ر.ي)</th>
                    <th className="py-3 px-4 font-semibold text-start">السعر (ر.س)</th>
                    <th className="py-3 px-4 font-semibold text-start">السعر ($)</th>
                    <th className="py-3 px-4 font-semibold text-start">حالة الأصالة</th>
                    <th className="py-3 px-4 font-semibold text-start">معاينة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-serif font-bold text-ivory text-sm block">
                            {p.title}
                          </span>
                          <span className="text-[11px] text-gold font-sans">
                            {p.brand} — {p.categorySlug}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-ivory">
                        {formatCurrency(p.prices.YER, 'YER')}
                      </td>
                      <td className="py-3.5 px-4 text-ivory/80">
                        {formatCurrency(p.prices.SAR, 'SAR')}
                      </td>
                      <td className="py-3.5 px-4 text-ivory/80">
                        {formatCurrency(p.prices.USD, 'USD')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          <VerifiedCheckIcon size={12} color="#34D399" />
                          <span>موثق أصلي 100%</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/product/${p.id}`}
                          className="text-gold hover:text-champagne font-bold underline"
                        >
                          عرض الصفحة ←
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === 'orders' && (
          <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
            <h3 className="text-lg font-serif font-bold text-ivory">
              أحدث طلبات الشراء المسجلة على المنصة
            </h3>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ivory">طلب #{ord.orderNumber}</span>
                      <span className="text-xs text-gold font-sans font-semibold">({ord.customerName} - {ord.customerPhone})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300">
                        {ord.city}
                      </span>
                    </div>
                    <p className="text-xs text-muted-lux font-sans">
                      {ord.items?.map((i: any) => `${i.title} (×${i.quantity})`).join(' + ')}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="text-base font-serif font-bold text-champagne block">
                      {formatCurrency(ord.totalYer, 'YER')}
                    </span>
                    <span className="text-[10px] text-muted-lux font-sans">
                      طريقة الدفع: {ord.paymentMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
            <h3 className="text-lg font-serif font-bold text-ivory">
              مواعيد واستشارات البشرة المحجوزة
            </h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ivory">{b.customerName}</span>
                      <span className="text-gold font-bold">({b.customerPhone})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-gold/15 text-gold">
                        {b.serviceType}
                      </span>
                    </div>
                    <p className="text-muted-lux">
                      الموعد: {b.bookingDate} الساعة {b.bookingTime} — الفرع: {b.branchId}
                    </p>
                    {b.notes && <p className="text-ivory/80">ملاحظات: {b.notes}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    مؤكد
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal with AI Assistant */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-gold/40 shadow-2xl p-6 text-ivory space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif font-bold text-ivory">
                إضافة مستحضر تجميلي جديد للمخزون
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-gold font-bold block mb-1">اسم المستحضر:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="مثال: سيروم نياسيناميد 10% ذا أورديناري"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                  <button
                    type="button"
                    disabled={isAiGenerating}
                    onClick={handleAiAutoFill}
                    className="px-3.5 py-2.5 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-champagne font-bold whitespace-nowrap transition disabled:opacity-50"
                  >
                    {isAiGenerating ? 'جاري التوليد...' : 'توليد تلقائي بالـ AI ↵'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-lux block mb-1">الماركة:</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">القسم:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="serums">سيرومات (Serums)</option>
                    <option value="cleansers">غسول ومنظفات (Cleansers)</option>
                    <option value="moisturizers">مرطبات (Moisturizers)</option>
                    <option value="makeup">مكياج وأرواج (Makeup)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
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

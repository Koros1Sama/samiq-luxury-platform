'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import {
  VerifiedCheckIcon,
  BagCartIcon,
  SparkleStarIcon,
  WhatsAppIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { formatCurrency } from '@/core/currency/formatter';
import { ProductCardData } from '@/themes/contract';

export default function CustomerAccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('صنعاء');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductCardData[]>([]);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    // Check if customer session in local storage or load pilot customer
    const saved = localStorage.getItem('samiq_customer');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomer(parsed);
        setIsLoggedIn(true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    async function loadOrdersAndWishlist() {
      try {
        const res = await fetch('/api/store/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }

        const prodRes = await fetch('/api/store/products');
        const prodData = await prodRes.json();
        if (prodData.success) {
          setWishlistProducts(prodData.products.slice(0, 2));
        }
      } catch (err) {
        console.error('Error loading account data:', err);
      }
    }
    loadOrdersAndWishlist();
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;

    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          fullName: fullName.trim() || 'عميل مفتاح الجمال',
          phone: phoneOrEmail.trim(),
          city,
        }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setIsLoggedIn(true);
        localStorage.setItem('samiq_customer', JSON.stringify(data.customer));
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('samiq_customer');
    setIsLoggedIn(false);
    setCustomer(null);
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <Link href="/" className="text-xs font-sans text-ivory/80 hover:text-champagne transition">
            العودة للمتجر الرئيسي ←
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {!isLoggedIn ? (
          /* Login / Register Card */
          <div className="max-w-md mx-auto p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-gold/30 shadow-2xl">
            <div className="rounded-[calc(2rem-0.5rem)] bg-surface p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                  <SparkleStarIcon size={22} color="#C9A84C" />
                </div>
                <h1 className="text-2xl font-serif font-bold text-ivory">
                  بوابة حسابات عملاء مفتاح الجمال
                </h1>
                <p className="text-xs text-muted-lux font-sans">
                  سجلي دخولكِ برقم الهاتف لتتبع شحناتكِ والاطلاع على نقاط الولاء والمفضلة
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="text-muted-lux block mb-1">الاسم الكريم:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ريم العنسي"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">رقم الهاتف أو الواتساب:</label>
                  <input
                    type="tel"
                    required
                    placeholder="96777xxxxxxx"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">المدينة:</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value="صنعاء">صنعاء</option>
                    <option value="عدن">عدن</option>
                    <option value="تعز">تعز</option>
                    <option value="إب">إب</option>
                    <option value="حضرموت">حضرموت</option>
                    <option value="السعودية">المملكة العربية السعودية</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition"
                >
                  دخول الحساب الموثق ↵
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="space-y-8">
            {/* Customer Summary Bar */}
            <div className="p-6 rounded-3xl bg-surface border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-sans text-gold font-bold">مرحباً بكِ مجدداً</span>
                <h2 className="text-2xl font-serif font-bold text-ivory">
                  {customer?.fullName || 'عميلة مفتاح الجمال'}
                </h2>
                <span className="text-xs text-muted-lux font-sans block">
                  رقم الهاتف: {customer?.phone} • {customer?.city || 'صنعاء'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-[11px] text-muted-lux block font-sans">نقاط الولاء المكتسبة:</span>
                  <span className="text-xl font-serif font-bold text-champagne">
                    {customer?.loyaltyPoints || 350} نقطة
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl text-xs font-sans text-rose-300 hover:bg-rose-950/30 border border-rose-500/30 transition"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                    : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
                }`}
              >
                سجل الطلبات والشحنات ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wishlist')}
                className={`px-5 py-2.5 rounded-xl text-xs font-sans font-bold transition ${
                  activeTab === 'wishlist'
                    ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark shadow-md'
                    : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
                }`}
              >
                قائمة المفضلة ({wishlistProducts.length})
              </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-surface border border-white/5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ivory">طلب #{ord.orderNumber}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-sans font-bold bg-gold/15 text-gold border border-gold/30">
                          {ord.status === 'delivered' ? 'تم التوصيل' : ord.status === 'shipped' ? 'قيد الشحن' : 'قيد المعالجة'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-lux font-sans">
                        التاريخ: {new Date(ord.createdAt).toLocaleDateString('ar-YE')}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-sans">
                      {ord.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-ivory/90">
                          <span>{item.title} {item.variantTitle ? `(${item.variantTitle})` : ''} × {item.quantity}</span>
                          <span className="text-champagne font-serif font-bold">
                            {formatCurrency(item.unitPrice?.YER * item.quantity || 0, 'YER')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans gap-2">
                      <span className="text-muted-lux">
                        العنوان: {ord.city} — {ord.address}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-champagne text-sm">
                          الإجمالي: {formatCurrency(ord.totalYer, 'YER')}
                        </span>
                        <a
                          href={`https://wa.me/967775234989?text=مرحباً%20مفتاح%20الجمال،%20أستفسر%20عن%20حالة%20طلبي%20رقم%20${ord.orderNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <WhatsAppIcon size={12} color="#34D399" />
                          <span>متابعة الشحنة</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/10 hover:border-gold/40 transition flex flex-col justify-between"
                  >
                    <div className="rounded-[calc(1.75rem-0.375rem)] bg-surface p-4 space-y-3">
                      <div className="h-40 w-full rounded-2xl overflow-hidden relative bg-white/5">
                        <Image src={p.image} alt={p.title} fill className="object-cover" />
                      </div>
                      <span className="text-[10px] text-gold font-sans font-bold block">{p.brand}</span>
                      <h4 className="text-sm font-serif font-bold text-ivory line-clamp-1">{p.title}</h4>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-sm font-serif font-bold text-champagne">
                          {formatCurrency(p.prices.YER, 'YER')}
                        </span>
                        <Link
                          href={`/product/${p.id}`}
                          className="px-3 py-1.5 rounded-xl bg-gold/15 text-champagne text-xs font-bold hover:bg-gold/25 transition"
                        >
                          عرض المستحضر ←
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

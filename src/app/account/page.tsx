'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import {
  VerifiedCheckIcon,
  BagCartIcon,
  SparkleStarIcon,
  WhatsAppIcon,
  ShieldCheckIcon,
  CloseIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { formatCurrency } from '@/core/currency/formatter';
import { ProductCardData } from '@/themes/contract';
import { SubpageThemeWrapper, useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';
import { useOptionalStorefront } from '@/core/storefront/StorefrontProvider';

const CONCERN_OPTIONS = [
  'تفتيح التصبغات',
  'المسامات الواسعة',
  'الترطيب العميق',
  'مقاومة التجاعيد',
  'تنظيم الدهون',
  'تهدئة الاحمرار',
  'ترميم الحاجز الواقي',
];

export default function CustomerAccountPage() {
  return (
    <SubpageThemeWrapper activeNav="account" showNavHeader={true}>
      <CustomerAccountContent />
    </SubpageThemeWrapper>
  );
}

function CustomerAccountContent() {
  const { palette, isLight, isEn, activeTheme } = useSubpageTheme();
  const sf = useOptionalStorefront();
  const isDemoMode = sf?.isDemoMode ?? false;

  // Session & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<any>(null);

  // Auth Card Sub-Tabs (when logged out)
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');

  // Customer portal tabs (when logged in)
  const [portalTab, setPortalTab] = useState<'loyalty' | 'orders' | 'skin_profile' | 'wishlist'>('loyalty');

  // Register form fields
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('صنعاء');
  const [regSkinType, setRegSkinType] = useState<'oily' | 'dry' | 'combination' | 'sensitive' | 'all'>('dry');
  const [regConcerns, setRegConcerns] = useState<string[]>(['تفتيح التصبغات', 'الترطيب العميق']);

  // Login form fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin login fields
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  // Data
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<ProductCardData[]>([]);
  const [redeemedCoupon, setRedeemedCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Check existing customer session
    const savedCustomer = localStorage.getItem('samiq_customer');
    let initialPhone = '';
    if (savedCustomer) {
      try {
        const parsed = JSON.parse(savedCustomer);
        setCustomer(parsed);
        setIsLoggedIn(true);
        initialPhone = parsed?.phone || '';
      } catch (e) {}
    }

    // 2. Check admin auth
    const adminAuth = localStorage.getItem('samiq_admin_auth');
    if (adminAuth === 'true') {
      setIsAdminLoggedIn(true);
    }

    // 3. Load catalog products & orders
    fetchProducts();
    if (initialPhone) {
      fetchOrders(initialPhone);
    }
  }, []);

  useEffect(() => {
    if (customer && products.length > 0) {
      const wishIds = customer.wishlistProductIds || ['prod-1', 'prod-4'];
      const matched = products.filter((p) => wishIds.includes(p.id));
      setWishlistProducts(matched.length > 0 ? matched : products.slice(0, 2));
    }
  }, [customer, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/store/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {}
  };

  const fetchOrders = async (phoneFilter?: string) => {
    const targetPhone = phoneFilter || customer?.phone || '';
    if (!targetPhone) return;
    try {
      const res = await fetch(`/api/store/orders?phone=${encodeURIComponent(targetPhone)}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {}
  };

  // Toggle Concern selection in register / profile
  const toggleConcern = (concern: string) => {
    setRegConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  // Handle Customer Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          fullName: regFullName.trim(),
          phone: regPhone.trim(),
          password: regPassword.trim() || '123456',
          city: regCity,
          skinType: regSkinType,
          concerns: regConcerns,
        }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setIsLoggedIn(true);
        localStorage.setItem('samiq_customer', JSON.stringify(data.customer));
        fetchOrders(data.customer.phone);
        setAuthSuccessMsg(data.message || 'تم تسجيل العضوية بنجاح وحصلتِ على 150 نقطة مجانية');
      } else {
        setAuthError(data.message || 'فشل تسجيل الحساب، يرجى التحقق من البيانات');
      }
    } catch (err) {
      setAuthError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Customer Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          phone: loginPhone.trim(),
          password: loginPassword.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setIsLoggedIn(true);
        localStorage.setItem('samiq_customer', JSON.stringify(data.customer));
        fetchOrders(data.customer.phone);
      } else {
        setAuthError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setAuthError('تعذر تسجيل الدخول، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoCustomer = async () => {
    setLoginPhone('967775001122');
    setLoginPassword('123456');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          phone: '967775001122',
        }),
      });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
        setIsLoggedIn(true);
        localStorage.setItem('samiq_customer', JSON.stringify(data.customer));
        fetchOrders(data.customer.phone);
      }
    } catch (e) {} finally {
      setIsSubmitting(false);
    }
  };

  // Handle Admin Passcode Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_login',
          passcode: adminPasscode.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('samiq_admin_auth', 'true');
        setAuthSuccessMsg('مرحباً بك في منصة الإدارة');
      } else {
        setAuthError(data.message || 'رمز الدخول الإداري غير صحيح');
      }
    } catch (err) {
      setAuthError('حدث خطأ في التحقق من الصلاحيات');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redeem points for discount coupon
  const handleRedeemPoints = async () => {
    if (!customer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'redeem_points',
          customerId: customer.id,
          pointsToRedeem: 100,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRedeemedCoupon(data.couponCode);
        const updated = { ...customer, loyaltyPoints: data.remainingPoints };
        setCustomer(updated);
        localStorage.setItem('samiq_customer', JSON.stringify(updated));
      } else {
        alert(data.message || 'رصيد النقاط غير كافٍ');
      }
    } catch (e) {} finally {
      setIsSubmitting(false);
    }
  };

  // Update skin profile & concerns
  const handleSaveSkinProfile = async () => {
    if (!customer) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/store/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          customerId: customer.id,
          skinType: regSkinType,
          concerns: regConcerns,
          city: regCity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        localStorage.setItem('samiq_customer', JSON.stringify(data.customer));
        alert('تم حفظ وتحديث ملف البشرة بنجاح في قاعدة البيانات');
      }
    } catch (e) {} finally {
      setIsSubmitting(false);
    }
  };

  // Customer Logout
  const handleLogout = () => {
    localStorage.removeItem('samiq_customer');
    setIsLoggedIn(false);
    setCustomer(null);
  };

  // Admin Logout
  const handleAdminLogout = () => {
    localStorage.removeItem('samiq_admin_auth');
    setIsAdminLoggedIn(false);
  };

  // Filter Recommended Products by Customer's Smart Tags / Concerns
  const recommendedProducts = products.filter((p) => {
    if (!customer) return true;
    const activeConcerns = customer.concerns || regConcerns;
    if (!p.tags || p.tags.length === 0) return true;
    return p.tags.some((t: string) => activeConcerns.includes(t));
  });

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 pb-16">
        {/* ==================================================================== */}
        {/* CASE A: LOGGED IN AS ADMIN / STAFF LAUNCHPAD                        */}
        {/* ==================================================================== */}
        {isAdminLoggedIn && (
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 animate-fadeIn"
            style={{
              backgroundColor: palette.surface,
              borderColor: `${palette.accent}40`,
              color: palette.text,
            }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
              style={{ borderColor: palette.border }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    borderColor: `${palette.accent}40`,
                    color: palette.accent,
                  }}
                >
                  <ShieldCheckIcon size={24} color={palette.accent} />
                </div>
                <div>
                  <h2
                    className="text-lg sm:text-xl font-serif font-bold leading-[1.45] md:leading-[1.4]"
                    style={{ color: palette.text }}
                  >
                    منصة الإدارة والمشرفين التنفيذية (Executive Admin Launchpad)
                  </h2>
                  <p className="text-xs" style={{ color: palette.muted }}>
                    صلاحيات المشرف المعتمدة — التحكم الكامل بالمتجر وقواعد البيانات وهندسة القوالب
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-sans font-semibold transition"
              >
                تسجيل خروج الإدارة
              </button>
            </div>

            {/* Direct 1-Click Launchpad Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin"
                className="p-5 rounded-2xl border transition flex flex-col justify-between gap-3 group"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                  borderColor: palette.border,
                }}
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
                    لوحة تحكم المتجر (Store Admin)
                  </span>
                  <h3
                    className="text-sm sm:text-base font-serif font-bold transition-colors"
                    style={{ color: palette.text }}
                  >
                    إدارة المخزون، الطلبات، الكوبونات والمحادثات
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                    إضافة المستحضرات بالذكاء الاصطناعي وتوليد الوسوم الذكية فورياً
                  </p>
                </div>
                <span className="text-xs font-bold flex items-center gap-1" style={{ color: palette.accent }}>
                  فتح لوحة المتجر ←
                </span>
              </Link>

              <Link
                href="/"
                className="p-5 rounded-2xl border transition flex flex-col justify-between gap-3 group"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                  borderColor: palette.border,
                }}
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
                    معاينة واجهة المتجر الحية (Live Storefront)
                  </span>
                  <h3
                    className="text-sm sm:text-base font-serif font-bold transition-colors"
                    style={{ color: palette.text }}
                  >
                    تصفح تجربة العميل كما تظهر للجمهور
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                    معاينة السلة، الفئات، البحث السريع وتفاعل الزوار على كافة الأجهزة
                  </p>
                </div>
                <span className="text-xs font-bold flex items-center gap-1" style={{ color: palette.accent }}>
                  فتح واجهة المتجر ←
                </span>
              </Link>

              <div
                className="p-5 rounded-2xl border flex flex-col justify-between gap-3"
                style={{
                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                  borderColor: palette.border,
                }}
              >
                <div className="space-y-1">
                  <span className="text-xs font-sans font-bold text-emerald-500 block">
                    معاينة القوالب المعمارية المعتمدة
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <Link
                      href="/?theme=luxury-noir"
                      className="min-h-[40px] px-2 rounded-lg border text-center text-xs flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: isLight ? '#00000006' : 'rgba(255,255,255,0.05)',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      الليلي الفاخر
                    </Link>
                    <Link
                      href="/?theme=ivory-journal"
                      className="min-h-[40px] px-2 rounded-lg border text-center text-xs flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: isLight ? '#00000006' : 'rgba(255,255,255,0.05)',
                        borderColor: palette.border,
                        color: '#8C5E3C',
                      }}
                    >
                      المجلة العاجية
                    </Link>
                    <Link
                      href="/?theme=clinic-lab"
                      className="min-h-[40px] px-2 rounded-lg border text-center text-xs flex items-center justify-center font-bold"
                      style={{
                        backgroundColor: isLight ? '#00000006' : 'rgba(255,255,255,0.05)',
                        borderColor: palette.border,
                        color: '#0F4C4A',
                      }}
                    >
                      المعمل السريري
                    </Link>
                  </div>
                </div>
                <span className="text-xs" style={{ color: palette.muted }}>
                  تصفح فوري لأي من القوالب الثلاثة
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* CASE B: LOGGED OUT — DUAL-TAB AUTH CARD                              */}
        {/* ==================================================================== */}
        {!isLoggedIn && !isAdminLoggedIn && (
          <div
            className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.border,
            }}
          >
            <div className="text-center space-y-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-bold border"
                style={{
                  backgroundColor: `${palette.accent}15`,
                  borderColor: `${palette.accent}40`,
                  color: palette.accent,
                }}
              >
                <SparkleStarIcon size={14} color={palette.accent} />
                <span>{isEn ? 'Miftah Elite Authenticity Club' : 'نادي نخبة مفتاح الجمال الأصلي'}</span>
              </span>
              <h1
                className="text-2xl sm:text-3xl font-serif font-bold leading-[1.45] md:leading-[1.4]"
                style={{ color: palette.text }}
              >
                {isEn ? 'Customer Portal & Loyalty Rewards' : 'بوابة حساب العميلة ونقاط الولاء'}
              </h1>
              <p className="text-xs sm:text-sm font-sans leading-relaxed" style={{ color: palette.muted }}>
                {isEn
                  ? 'Sign in to track orders, save your smart skin profile, and redeem reward points on every verified purchase.'
                  : 'سجّلي عضويتك لتتبّع طلباتك، حفظ ملف بشرتك الذكي، وجمع نقاط الولاء لكل عملية شراء'}
              </p>
            </div>

            {/* 3 Tabs: Register | Login | Admin Access */}
            <div
              className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl border"
              style={{
                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#EDF5F3' : '#F5EFE6') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.border,
              }}
            >
              {[
                { id: 'login', labelAr: 'تسجيل الدخول', labelEn: 'Sign In' },
                { id: 'register', labelAr: 'إنشاء حساب جديد', labelEn: 'Create Account' },
                { id: 'admin', labelAr: 'دخول الإدارة', labelEn: 'Admin Access' },
              ].map((tab) => {
                const isActive = authMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAuthMode(tab.id as any)}
                    className="min-h-[44px] rounded-xl text-xs font-sans font-bold transition flex items-center justify-center"
                    style={
                      isActive
                        ? {
                            backgroundColor: palette.accent,
                            color: isLight ? '#FFFFFF' : '#0B0B0C',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }
                        : {
                            color: palette.muted,
                          }
                    }
                  >
                    {isEn ? tab.labelEn : tab.labelAr}
                  </button>
                );
              })}
            </div>

            {/* Error or Success Alert */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs text-center font-sans">
                {authError}
              </div>
            )}
            {authSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs text-center font-sans">
                {authSuccessMsg}
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB 1: REGISTER NEW CUSTOMER                                   */}
            {/* -------------------------------------------------------------- */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
                <div
                  className="p-3 rounded-2xl border flex items-center gap-2.5"
                  style={{
                    backgroundColor: `${palette.accent}12`,
                    borderColor: `${palette.accent}35`,
                  }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.accent }} />
                  <span className="font-bold" style={{ color: palette.accent }}>
                    هدية ترحيبية فورية: 150 نقطة مجانية تُضاف تلقائياً لرصيدك عند التسجيل
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                      الاسم الكامل:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ريم العنسي"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs outline-none transition"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                      رقم الهاتف أو الواتساب:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 775001122"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs outline-none transition"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                      كلمة المرور أو الرمز السري:
                    </label>
                    <input
                      type="password"
                      placeholder="اختر كلمة مرور آمنة..."
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs outline-none transition"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                      المدينة:
                    </label>
                    <select
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs outline-none transition"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      <option value="صنعاء">صنعاء (توصيل فوري)</option>
                      <option value="عدن">عدن (شحن آمن)</option>
                      <option value="تعز">تعز</option>
                      <option value="إب">إب</option>
                      <option value="الحديدة">الحديدة</option>
                      <option value="المكلا">المكلا</option>
                    </select>
                  </div>
                </div>

                {/* Skin Type Selector */}
                <div>
                  <label className="block font-semibold mb-1.5" style={{ color: palette.muted }}>
                    نوع البشرة الأساسي:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'oily', label: 'دهنية' },
                      { id: 'dry', label: 'جافة' },
                      { id: 'combination', label: 'مختلطة' },
                      { id: 'sensitive', label: 'حساسة' },
                      { id: 'all', label: 'عادية' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setRegSkinType(type.id as any)}
                        className="min-h-[40px] px-2 rounded-xl text-xs font-sans transition flex items-center justify-center border"
                        style={
                          regSkinType === type.id
                            ? {
                                backgroundColor: palette.accent,
                                color: isLight ? '#FFFFFF' : '#0B0B0C',
                                borderColor: palette.accent,
                                fontWeight: 'bold',
                              }
                            : {
                                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                                color: palette.muted,
                                borderColor: palette.border,
                              }
                        }
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Concerns Multi-Select Chips */}
                <div>
                  <label className="block font-semibold mb-1.5" style={{ color: palette.muted }}>
                    أهم اهتمامات ومشاكل البشرة المراد علاجها:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONCERN_OPTIONS.map((concern) => {
                      const isSelected = regConcerns.includes(concern);
                      return (
                        <button
                          key={concern}
                          type="button"
                          onClick={() => toggleConcern(concern)}
                          className="min-h-[40px] px-3 rounded-full text-xs font-sans transition flex items-center gap-1.5 border"
                          style={
                            isSelected
                              ? {
                                  backgroundColor: `${palette.accent}20`,
                                  color: palette.accent,
                                  borderColor: palette.accent,
                                  fontWeight: 'bold',
                                }
                              : {
                                  backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                                  color: palette.muted,
                                  borderColor: palette.border,
                                }
                          }
                        >
                          <span>#{concern}</span>
                          {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-3.5 rounded-2xl font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center disabled:opacity-50"
                  style={{
                    backgroundColor: palette.accent,
                    color: isLight ? '#FFFFFF' : '#0B0B0C',
                  }}
                >
                  {isSubmitting ? 'جارٍ تسجيل العضوية...' : 'تأكيد إنشاء الحساب واستلام 150 نقطة'}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB 2: LOGIN FOR REGISTERED CUSTOMERS                          */}
            {/* -------------------------------------------------------------- */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                    رقم الهاتف المسجل:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 775001122"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs outline-none transition"
                    style={{
                      backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    placeholder="أدخلي كلمة المرور..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs outline-none transition"
                    style={{
                      backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-3.5 rounded-2xl font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center disabled:opacity-50"
                  style={{
                    backgroundColor: palette.accent,
                    color: isLight ? '#FFFFFF' : '#0B0B0C',
                  }}
                >
                  {isSubmitting ? 'جارٍ التحقق...' : 'تسجيل الدخول إلى حسابي'}
                </button>

                {/* 1-Click Demo Customer Quick Login (Only visible in Demo Mode ?demo=1) */}
                {isDemoMode && (
                  <div className="pt-3 border-t text-center space-y-2" style={{ borderColor: palette.border }}>
                    <span className="text-xs block" style={{ color: palette.muted }}>
                      للتجربة السريعة بنقرة واحدة (وضع تجريبي):
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickDemoCustomer}
                      className="w-full min-h-[44px] py-2.5 rounded-xl border text-xs font-semibold transition inline-flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                        borderColor: `${palette.accent}40`,
                        color: palette.accent,
                      }}
                    >
                      <span>دخول سريع كعميلة مسجلة — ريم العنسي (350 نقطة)</span>
                      <span>←</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* -------------------------------------------------------------- */}
            {/* TAB 3: ADMIN & STAFF LOGIN                                     */}
            {/* -------------------------------------------------------------- */}
            {authMode === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-sans">
                <div
                  className="p-3.5 rounded-2xl border text-center space-y-1"
                  style={{
                    backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                    borderColor: palette.border,
                  }}
                >
                  <span className="text-xs font-bold block" style={{ color: palette.accent }}>
                    دخول إدارة المتجر (Store Manager)
                  </span>
                  <p className="text-xs" style={{ color: palette.muted }}>
                    يتيح لمدير المتجر الدخول الآمن للوحة التحكم بالمنتجات، الطلبات، المخزون والأسعار (/admin)
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: palette.muted }}>
                    رمز المرور الإداري السري:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="أدخل رمز المرور الإداري (miftah2026 أو samiq2026)..."
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-3 rounded-xl border text-xs outline-none text-center transition"
                    style={{
                      backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                      borderColor: palette.border,
                      color: palette.text,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-3.5 rounded-2xl font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center disabled:opacity-50"
                  style={{
                    backgroundColor: palette.accent,
                    color: isLight ? '#FFFFFF' : '#0B0B0C',
                  }}
                >
                  {isSubmitting ? 'جارٍ التحقق...' : 'دخول لوحة الإدارة المشتركة'}
                </button>

                {isDemoMode && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminPasscode('miftah2026');
                        setIsAdminLoggedIn(true);
                        localStorage.setItem('samiq_admin_auth', 'true');
                      }}
                      className="text-xs hover:underline inline-flex items-center min-h-[40px] px-3 font-semibold"
                      style={{ color: palette.accent }}
                    >
                      استخدام الرمز الافتراضي السريع (miftah2026)
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* CASE C: LOGGED IN AS CUSTOMER — 4 INTERACTIVE PORTAL TABS            */}
        {/* ==================================================================== */}
        {isLoggedIn && customer && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Customer Banner & Membership Badge */}
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{
                backgroundColor: palette.surface,
                borderColor: `${palette.accent}40`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-bold text-xl shadow-lg shrink-0"
                  style={{
                    backgroundColor: palette.accent,
                    color: isLight ? '#FFFFFF' : '#0B0B0C',
                  }}
                >
                  {customer.fullName ? customer.fullName.slice(0, 2) : 'عم'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1
                      className="text-xl sm:text-2xl font-serif font-bold leading-[1.45] md:leading-[1.4]"
                      style={{ color: palette.text }}
                    >
                      {customer.fullName}
                    </h1>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold border"
                      style={{
                        backgroundColor: `${palette.accent}18`,
                        color: palette.accent,
                        borderColor: `${palette.accent}40`,
                      }}
                    >
                      عضوية ذهبية موثقة
                    </span>
                  </div>
                  <p className="text-xs font-sans" style={{ color: palette.muted }}>
                    رقم الهاتف: <span className="font-mono" style={{ color: palette.text }}>{customer.phone}</span> • المدينة:{' '}
                    <span style={{ color: palette.text }}>{customer.city}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div
                  className="px-4 py-2.5 rounded-2xl border text-center"
                  style={{
                    backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                    borderColor: palette.border,
                  }}
                >
                  <span className="text-xs block" style={{ color: palette.muted }}>{isEn ? 'Loyalty Points:' : 'رصيد نقاط الولاء:'}</span>
                  <span className="text-xl font-serif font-bold" style={{ color: palette.accent }}>
                    {customer.loyaltyPoints} {isEn ? 'Pts' : 'نقطة'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl border text-xs font-sans font-semibold transition"
                  style={{
                    backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: palette.border,
                    color: palette.muted,
                  }}
                >
                  {isEn ? 'Sign Out' : 'تسجيل الخروج'}
                </button>
              </div>
            </div>

            {/* Portal Tab Switcher */}
            <div
              className="flex items-center gap-2 border-b pb-3 overflow-x-auto no-scrollbar"
              style={{ borderColor: palette.border }}
            >
              {[
                { id: 'loyalty', labelAr: 'ملخص العضوية ونقاط الولاء', labelEn: 'Loyalty & Rewards', count: customer.loyaltyPoints },
                { id: 'orders', labelAr: 'طلباتي وتتبع الشحنات', labelEn: 'My Orders', count: orders.length },
                { id: 'skin_profile', labelAr: 'ملف البشرة والروتين المخصص', labelEn: 'Skin Profile & Routine' },
                { id: 'wishlist', labelAr: `قائمة المفضلة (${wishlistProducts.length})`, labelEn: `Wishlist (${wishlistProducts.length})` },
              ].map((tab) => {
                const isActive = portalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPortalTab(tab.id as any)}
                    className="min-h-[44px] px-4 rounded-xl text-xs font-sans font-bold transition whitespace-nowrap inline-flex items-center gap-1.5"
                    style={
                      isActive
                        ? {
                            backgroundColor: palette.accent,
                            color: isLight ? '#FFFFFF' : '#0B0B0C',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }
                        : {
                            color: palette.muted,
                            backgroundColor: isLight ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                          }
                    }
                  >
                    <span>{isEn ? tab.labelEn : tab.labelAr}</span>
                    {tab.count !== undefined && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-xs"
                        style={{
                          backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : (isLight ? '#00000008' : 'rgba(255,255,255,0.1)'),
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* -------------------------------------------------------------- */}
            {/* PORTAL TAB 1: LOYALTY & REWARDS                                */}
            {/* -------------------------------------------------------------- */}
            {portalTab === 'loyalty' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Gold VIP Membership Card (7 cols) */}
                <div
                  className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden space-y-6"
                  style={{
                    backgroundColor: isLight
                      ? (activeTheme === 'clinic-lab' ? '#F0F7F5' : '#F7F3EC')
                      : '#131217',
                    borderColor: `${palette.accent}40`,
                    color: palette.text,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: palette.accent }} />
                      <span className="font-serif font-bold text-sm" style={{ color: palette.accent }}>
                        نادي نخبة مفتاح الجمال (VIP Gold)
                      </span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: palette.muted }}>ID: {customer.id}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <span className="text-xs font-sans block" style={{ color: palette.muted }}>رصيد النقاط الحالي:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-serif font-bold" style={{ color: palette.accent }}>
                        {customer.loyaltyPoints}
                      </span>
                      <span className="text-xs font-sans font-semibold" style={{ color: palette.muted }}>نقطة مكافآت</span>
                    </div>
                  </div>

                  {/* Progress to next reward */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-sans" style={{ color: palette.muted }}>
                      <span>التقدم نحو المكافأة التالية (500 نقطة)</span>
                      <span className="font-bold" style={{ color: palette.accent }}>
                        {Math.min(100, Math.round((customer.loyaltyPoints / 500) * 100))}%
                      </span>
                    </div>
                    <div
                      className="w-full h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: isLight ? '#00000010' : 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(10, Math.round((customer.loyaltyPoints / 500) * 100)))}%`,
                          backgroundColor: palette.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Redeem Button & Coupon Output */}
                  <div className="pt-4 border-t space-y-3" style={{ borderColor: palette.border }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold block" style={{ color: palette.text }}>
                          استبدال 100 نقطة بكوبون خصم فوري 15%
                        </span>
                        <p className="text-xs" style={{ color: palette.muted }}>
                          كود خصم حصري صالح للاستخدام فورياً على أي طلب
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRedeemPoints}
                        disabled={isSubmitting || customer.loyaltyPoints < 100}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs hover:brightness-110 shadow-md transition disabled:opacity-40 inline-flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: palette.accent,
                          color: isLight ? '#FFFFFF' : '#0B0B0C',
                        }}
                      >
                        {isSubmitting ? 'جارٍ الاستبدال...' : 'استبدال 100 نقطة'}
                      </button>
                    </div>

                    {redeemedCoupon && (
                      <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                        <span className="text-xs text-emerald-300 font-bold block">
                          كود الخصم الحصري الخاص بك (خصم 15%):
                        </span>
                        <div className="font-mono text-lg font-bold select-all tracking-wider" style={{ color: palette.accent }}>
                          {redeemedCoupon}
                        </div>
                        <p className="text-xs text-emerald-400/80">
                          انسخي الكود واستخدميه في سلة المشتريات أو عند الطلب عبر واتساب
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loyalty Rules & Benefits (5 cols) */}
                <div
                  className="lg:col-span-5 p-6 rounded-3xl border space-y-4"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  }}
                >
                  <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
                    مزايا نادي نخبة مفتاح الجمال
                  </h3>
                  <div className="space-y-3 text-xs font-sans leading-relaxed" style={{ color: palette.muted }}>
                    <div
                      className="p-3 rounded-2xl border space-y-1"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.02)',
                        borderColor: palette.border,
                      }}
                    >
                      <span className="font-bold block" style={{ color: palette.accent }}>
                        • نقطة لكل 100 ريال يمني
                      </span>
                      <p>تُحسب النقاط تلقائياً على كافة مشترياتك المؤكدة من المتجر.</p>
                    </div>
                    <div
                      className="p-3 rounded-2xl border space-y-1"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.02)',
                        borderColor: palette.border,
                      }}
                    >
                      <span className="font-bold block" style={{ color: palette.accent }}>
                        • أولوية في فحص الباتش كود
                      </span>
                      <p>فحص مخبري موثق مجاني قبل تسليم أي منتج لعنوانك في صنعاء.</p>
                    </div>
                    <div
                      className="p-3 rounded-2xl border space-y-1"
                      style={{
                        backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.02)',
                        borderColor: palette.border,
                      }}
                    >
                      <span className="font-bold block" style={{ color: palette.accent }}>
                        • استشارات مجانية مع الخبير
                      </span>
                      <p>جلسات استشارية حصرية لتحليل الروتين وتنسيق درجات المكياج.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* PORTAL TAB 2: ORDERS FEED                                      */}
            {/* -------------------------------------------------------------- */}
            {portalTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
                    سجل طلباتك وشحناتك السابقة ({orders.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert('تم إرسال طلب تجريبي جديد إلى قاعدة البيانات بنجاح!')}
                    className="min-h-[44px] px-4 py-2 rounded-xl border text-xs font-sans transition inline-flex items-center"
                    style={{
                      backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: palette.border,
                      color: palette.accent,
                    }}
                  >
                    + إنشاء طلب تجريبي
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: palette.border,
                      }}
                    >
                      <div className="space-y-1.5 text-xs font-sans">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold" style={{ color: palette.accent }}>{o.orderNumber}</span>
                          <span className="font-semibold" style={{ color: palette.text }}>{o.city} — {o.address}</span>
                        </div>
                        <p style={{ color: palette.muted }}>
                          تاريخ الطلب: {new Date(o.createdAt).toLocaleDateString('ar-YE')} • الدفع:{' '}
                          <span style={{ color: palette.text }}>{o.paymentMethod}</span>
                        </p>
                        <div className="flex items-center gap-2 pt-1" style={{ color: palette.muted }}>
                          <span>المنتجات:</span>
                          <span className="font-medium" style={{ color: palette.text }}>
                            {o.items?.map((i: any) => i.title).join('، ') || 'مستحضرات عناية معتمدة'}
                          </span>
                        </div>
                      </div>

                      <div className="text-end shrink-0 space-y-1">
                        <div className="text-base font-bold font-sans" style={{ color: palette.accent }}>
                          {formatCurrency(o.totalYer, 'YER')}
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                          {o.status === 'confirmed' ? 'مؤكد وجارٍ التجهيز' : 'قيد التوصيل'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* PORTAL TAB 3: SKIN PROFILE & CUSTOM ROUTINE                    */}
            {/* -------------------------------------------------------------- */}
            {portalTab === 'skin_profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Profile Editor (6 cols) */}
                <div
                  className="lg:col-span-6 p-6 rounded-3xl border space-y-5"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  }}
                >
                  <div>
                    <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
                      ملف بشرتك والاهتمامات المسجلة
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: palette.muted }}>
                      يستخدم المستشار الذكي هذا الملف لاقتراح التركيبات والوسوم المتطابقة بدقة 100%
                    </p>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block font-semibold mb-1.5" style={{ color: palette.muted }}>نوع البشرة:</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {[
                          { id: 'oily', label: 'دهنية' },
                          { id: 'dry', label: 'جافة' },
                          { id: 'combination', label: 'مختلطة' },
                          { id: 'sensitive', label: 'حساسة' },
                          { id: 'all', label: 'عادية' },
                        ].map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setRegSkinType(type.id as any)}
                            className="min-h-[40px] px-2 rounded-xl text-xs font-sans transition flex items-center justify-center border"
                            style={
                              regSkinType === type.id
                                ? {
                                    backgroundColor: palette.accent,
                                    color: isLight ? '#FFFFFF' : '#0B0B0C',
                                    borderColor: palette.accent,
                                    fontWeight: 'bold',
                                  }
                                : {
                                    backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                                    color: palette.muted,
                                    borderColor: palette.border,
                                  }
                            }
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1.5" style={{ color: palette.muted }}>
                        اهتمامات البشرة النشطة:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {CONCERN_OPTIONS.map((concern) => {
                          const isSelected = regConcerns.includes(concern);
                          return (
                            <button
                              key={concern}
                              type="button"
                              onClick={() => toggleConcern(concern)}
                              className="min-h-[40px] px-3 rounded-full text-xs font-sans transition flex items-center gap-1.5 border"
                              style={
                                isSelected
                                  ? {
                                      backgroundColor: `${palette.accent}20`,
                                      color: palette.accent,
                                      borderColor: palette.accent,
                                      fontWeight: 'bold',
                                    }
                                  : {
                                      backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.05)',
                                      color: palette.muted,
                                      borderColor: palette.border,
                                    }
                              }
                            >
                              <span>#{concern}</span>
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSkinProfile}
                      disabled={isSubmitting}
                      className="w-full min-h-[44px] py-3.5 rounded-2xl font-bold text-xs hover:brightness-110 shadow-md transition inline-flex items-center justify-center disabled:opacity-50"
                      style={{
                        backgroundColor: palette.accent,
                        color: isLight ? '#FFFFFF' : '#0B0B0C',
                      }}
                    >
                      {isSubmitting ? 'جارٍ الحفظ...' : 'حفظ التحديثات في ملف البشرة'}
                    </button>
                  </div>
                </div>

                {/* AI Tag-Matched Recommendations (6 cols) */}
                <div
                  className="lg:col-span-6 p-6 rounded-3xl border space-y-4"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
                        مستحضرات موصى بها حسب وسوم بشرتك
                      </h3>
                      <p className="text-xs" style={{ color: palette.muted }}>
                        مطابقة تلقائية باستخدام خوارزمية الوسوم الذكية Smart Multi-Tags
                      </p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: palette.accent }}>
                      {recommendedProducts.length} مستحضر متطابق
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-sans"
                        style={{
                          backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.02)',
                          borderColor: palette.border,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl border overflow-hidden shrink-0 relative"
                            style={{
                              backgroundColor: isLight ? '#FAF7F2' : '#0E0E12',
                              borderColor: palette.border,
                            }}
                          >
                            <SmartImage
                              src={p.image}
                              alt={p.title}
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold block" style={{ color: palette.accent }}>{p.brand}</span>
                            <h4 className="font-semibold line-clamp-1" style={{ color: palette.text }}>{p.title}</h4>
                            <div className="flex flex-wrap gap-1">
                              {p.tags?.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: `${palette.accent}15`,
                                    color: palette.accent,
                                  }}
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-end shrink-0">
                          <span className="font-bold block" style={{ color: palette.accent }}>
                            {formatCurrency(p.prices.YER, 'YER')}
                          </span>
                          <Link
                            href={`/product/${p.slug || p.id}`}
                            className="hover:underline text-xs font-semibold"
                            style={{ color: palette.accent }}
                          >
                            {isEn ? 'View Details' : 'عرض التفاصيل'} {isEn ? '→' : '←'}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* PORTAL TAB 4: WISHLIST                                         */}
            {/* -------------------------------------------------------------- */}
            {portalTab === 'wishlist' && (
              <div className="space-y-4">
                <h3 className="text-base font-serif font-bold" style={{ color: palette.text }}>
                  قائمة المنتجات المفضلة ({wishlistProducts.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-3xl border space-y-3 flex flex-col justify-between"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: palette.border,
                      }}
                    >
                      <div className="space-y-2">
                        <div
                          className="aspect-square w-full rounded-2xl overflow-hidden relative border"
                          style={{
                            backgroundColor: isLight ? '#FAF7F2' : '#0E0E12',
                            borderColor: palette.border,
                          }}
                        >
                          <SmartImage
                            src={p.image}
                            alt={p.title}
                            sizes="(max-width: 640px) 100vw, 300px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-semibold block" style={{ color: palette.accent }}>{p.brand}</span>
                          <h4 className="text-sm font-serif font-bold line-clamp-1" style={{ color: palette.text }}>
                            {p.title}
                          </h4>
                        </div>
                        <div className="text-sm font-bold" style={{ color: palette.accent }}>
                          {formatCurrency(p.prices.YER, 'YER')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t" style={{ borderColor: palette.border }}>
                        <Link
                          href={`/product/${p.slug || p.id}`}
                          className="min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition"
                          style={{
                            backgroundColor: isLight ? '#00000006' : 'rgba(255, 255, 255, 0.05)',
                            borderColor: palette.border,
                            color: palette.text,
                          }}
                        >
                          {isEn ? 'Details' : 'تفاصيل المستحضر'}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (sf) {
                              sf.cart.add(p);
                              sf.cart.open();
                            }
                          }}
                          style={{
                            backgroundColor: palette.accent,
                            color: isLight ? '#FFFFFF' : '#0B0B0C',
                          }}
                          className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center transition hover:brightness-110 shadow-sm"
                        >
                          {isEn ? 'Add to Cart' : 'إضافة للسلة'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* STORE SERVICES & EXPLORATION HUB                                    */}
        {/* ==================================================================== */}
        <div className="pt-6 border-t space-y-4" style={{ borderColor: palette.border }}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
                خدمات وأقسام المتجر المعتمدة
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold" style={{ color: palette.text }}>
                بوابات الفحص والمحتوى الطبي والاستشارات
              </h3>
            </div>
            <span className="text-xs font-sans hidden sm:block" style={{ color: palette.muted }}>
              وصول سريع لكافة أدوات المتجر
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              href="/authenticity-hub"
              className="p-4 rounded-2xl border transition flex flex-col justify-between gap-3 group"
              style={{
                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.border,
              }}
            >
              <div className="space-y-1.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    color: palette.accent,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h4
                  className="text-sm font-serif font-bold transition-colors"
                  style={{ color: palette.text }}
                >
                  مركز فحص الأصالة
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                  فحص الباركود والكود المرجعي للتحقق من أصل المستحضر
                </p>
              </div>
              <span className="text-xs font-bold flex items-center gap-1 pt-1" style={{ color: palette.accent }}>
                دخول المركز ←
              </span>
            </Link>

            <Link
              href="/blog"
              className="p-4 rounded-2xl border transition flex flex-col justify-between gap-3 group"
              style={{
                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.border,
              }}
            >
              <div className="space-y-1.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    color: palette.accent,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h4
                  className="text-sm font-serif font-bold transition-colors"
                  style={{ color: palette.text }}
                >
                  المدونة التحريرية
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                  أسرار العناية ودليل حماية البشرة في مناخ اليمن
                </p>
              </div>
              <span className="text-xs font-bold flex items-center gap-1 pt-1" style={{ color: palette.accent }}>
                تصفح المقالات ←
              </span>
            </Link>

            <Link
              href="/bookings"
              className="p-4 rounded-2xl border transition flex flex-col justify-between gap-3 group"
              style={{
                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.border,
              }}
            >
              <div className="space-y-1.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    color: palette.accent,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h4
                  className="text-sm font-serif font-bold transition-colors"
                  style={{ color: palette.text }}
                >
                  حجز استشارة جلدية
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                  موعد فحص سريري مباشر في فرع صنعاء الرئيسي (حدة)
                </p>
              </div>
              <span className="text-xs font-bold flex items-center gap-1 pt-1" style={{ color: palette.accent }}>
                حجز موعد ←
              </span>
            </Link>

            <Link
              href="/?tab=catalog"
              className="p-4 rounded-2xl border transition flex flex-col justify-between gap-3 group"
              style={{
                backgroundColor: isLight ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#FAF7F2') : 'rgba(255, 255, 255, 0.03)',
                borderColor: palette.border,
              }}
            >
              <div className="space-y-1.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    color: palette.accent,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
                <h4
                  className="text-sm font-serif font-bold transition-colors"
                  style={{ color: palette.text }}
                >
                  كتالوج المنتجات
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
                  تصفح كافة المستحضرات الموثقة مع الفلترة الذكية
                </p>
              </div>
              <span className="text-xs font-bold flex items-center gap-1 pt-1" style={{ color: palette.accent }}>
                تصفح الكتالوج ←
              </span>
            </Link>
          </div>
        </div>
      </main>
  );
}

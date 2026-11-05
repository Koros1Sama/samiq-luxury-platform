'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { formatCurrency } from '@/core/currency/formatter';
import { ThemeCurrencyCode, ProductCardData, CartItem } from '@/themes/contract';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  CrossWarningIcon,
  BagCartIcon,
  WhatsAppIcon,
  SparkleStarIcon,
  StarIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { CurrencySwitcher } from '@/themes/base/luxury-noir/components/CurrencySwitcher';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import { WhatsAppCartDrawer } from '@/themes/base/luxury-noir/components/WhatsAppCartDrawer';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [product, setProduct] = useState<ProductCardData | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [authenticityGuide, setAuthenticityGuide] = useState<any>(null);
  const [currentCurrency, setCurrentCurrency] = useState<ThemeCurrencyCode>('YER');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/store/products');
        const data = await res.json();
        if (data.success && data.products) {
          const found = data.products.find(
            (p: ProductCardData) => p.id === slug || p.categorySlug === slug
          ) || data.products[0];
          setProduct(found);
          setActiveImage(found.image || (found.images && found.images[0]) || '');
          if (found.variants && found.variants.length > 0) {
            setSelectedVariantId(found.variants[0].id);
          }

          // Fetch reviews
          const revRes = await fetch(`/api/store/reviews?productId=${found.id}`);
          const revData = await revRes.json();
          if (revData.success) setReviews(revData.reviews || []);

          // Fetch guide
          const authRes = await fetch('/api/store/authenticity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: found.id }),
          });
          const authData = await authRes.json();
          if (authData.success) setAuthenticityGuide(authData.guide);
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      }
    }
    loadData();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <p className="text-sm font-serif text-champagne">جاري تحميل بيانات المستحضر الملكي...</p>
        </div>
      </div>
    );
  }

  const price = product.prices[currentCurrency] || product.prices.YER;
  const comparePrice = product.comparePrices?.[currentCurrency];
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];

  const handleAddToCart = () => {
    setCartItems((prev) => {
      const key = `${product.id}-${selectedVariantId || 'default'}`;
      const existing = prev.find((i) => i.id === key);
      if (existing) {
        return prev.map((i) => (i.id === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: key,
          productId: product.id,
          variantId: selectedVariantId,
          title: product.title,
          variantTitle: activeVariant?.title,
          unitPrice: product.prices,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleDirectWhatsApp = () => {
    const formattedPrice = formatCurrency(price, currentCurrency);
    const varText = activeVariant ? ` (${activeVariant.title})` : '';
    const text = `مرحباً متجر مفتاح الجمال، أود طلب المستحضر الأصلي: *${product.title}*${varText} بسعر ${formattedPrice}، مع التأكد من مطابقة معايير الهيئة العليا للأدوية والمستلزمات الطبية.`;
    window.open(`https://wa.me/967775234989?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    try {
      const res = await fetch('/api/store/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewerName,
          rating: reviewRating,
          comment: reviewComment,
          batchCodeVerified: batchCodeInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewSubmitted(true);
        setReviewComment('');
      }
    } catch (err) {
      console.error('Review submit error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans">
      {/* Top Navigation */}
      <header data-testid="header" className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <div className="flex items-center gap-4">
            <CurrencySwitcher currentCurrency={currentCurrency} onCurrencyChange={setCurrentCurrency} />
            <button
              type="button"
              data-testid="cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold/40 text-champagne flex items-center justify-center"
            >
              <BagCartIcon size={18} color="#E6CFA0" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -end-1 w-4 h-4 rounded-full bg-gold text-obsidian-dark text-xs font-bold flex items-center justify-center">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-lux font-sans flex items-center gap-2">
        <Link href="/" className="min-h-[44px] inline-flex items-center hover:text-champagne transition">الرئيسية</Link>
        <span>/</span>
        <span className="text-gold">{product.brand}</span>
        <span>/</span>
        <span className="text-ivory line-clamp-1">{product.title}</span>
      </div>

      {/* Main Product Showcase Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery Area (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-2 rounded-[2rem] bg-white/[0.03] border border-white/[0.08] shadow-2xl">
              <div className="relative rounded-[calc(2rem-0.5rem)] overflow-hidden aspect-[4/3] bg-surface">
                <SmartImage
                  src={activeImage || product.image}
                  alt={product.title}
                  fill
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center contrast-105"
                />
                <div className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-sans font-bold flex items-center gap-1.5">
                  <VerifiedCheckIcon size={14} color="#34D399" />
                  <span>ضمان الأصالة 100%</span>
                </div>
              </div>
            </div>

            {/* Multi-Image Gallery Switcher Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {product.images.map((imgUrl, imgIdx) => {
                  const isCurrent = (activeImage || product.image) === imgUrl;
                  return (
                    <button
                      key={imgIdx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative min-w-[56px] min-h-[56px] w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-surface ${
                        isCurrent
                          ? 'border-gold shadow-[0_0_12px_rgba(201,168,76,0.4)] scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                      aria-label={`عرض صورة المنتج ${imgIdx + 1}`}
                    >
                      <SmartImage
                        src={imgUrl}
                        alt={`${product.title} ${imgIdx + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details & Action (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-sans text-gold font-bold block">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-ivory leading-snug">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-sm text-muted-lux font-sans leading-[1.75]">{product.subtitle}</p>
              )}
            </div>

            {/* Price Row & Warehouse Stock Badge */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold text-champagne">
                  {formatCurrency(price, currentCurrency)}
                </span>
                {comparePrice && (
                  <span className="text-sm text-muted-lux line-through font-sans">
                    {formatCurrency(comparePrice, currentCurrency)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded text-xs font-sans font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  تسليم فوري بصنعاء
                </span>
                {typeof product.stockQuantity === 'number' && (
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-sans font-bold border ${
                      product.stockQuantity > 0
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {product.stockQuantity > 0
                      ? `متوفر في المخزن (${product.stockQuantity} قطعة)`
                      : 'نفدت الكمية حالياً'}
                  </span>
                )}
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-gold font-bold font-sans block">
                  الحجم أو الدرجة المتوفرة:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-sans font-bold border transition inline-flex items-center ${
                          isSelected
                            ? 'bg-gold/20 border-gold text-champagne'
                            : 'bg-white/5 border-white/10 text-ivory/70 hover:text-ivory'
                        }`}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="min-h-[44px] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_25px_rgba(201,168,76,0.35)] hover:brightness-110 flex items-center justify-center gap-2.5 transition"
              >
                <BagCartIcon size={18} color="#070709" />
                <span>إضافة إلى حقيبة المشتريات</span>
              </button>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="min-h-[44px] py-4 px-6 rounded-2xl bg-white/5 hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/40 text-ivory hover:text-emerald-300 font-sans font-bold text-sm flex items-center justify-center gap-2.5 transition"
              >
                <WhatsAppIcon size={18} color="currentColor" />
                <span>طلب مباشر عبر واتساب</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="p-4 rounded-2xl bg-surface border border-white/5 space-y-2 text-xs font-sans text-muted-lux">
              <div className="flex items-center gap-2 text-ivory">
                <ShieldCheckIcon size={16} color="#C9A84C" />
                <span>مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية</span>
              </div>
              <div className="flex items-center gap-2 text-ivory">
                <VerifiedCheckIcon size={14} color="#34D399" />
                <span>توصيل فوري خلال ساعات لكافة أحياء أمانة العاصمة صنعاء</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Authenticity Verification Section */}
        {authenticityGuide && (
          <div className="p-6 sm:p-8 rounded-[2rem] bg-surface border border-gold/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon size={24} color="#C9A84C" />
                <h3 className="text-xl font-serif font-bold text-ivory">
                  معايير التحقق من أصالة {product.title}
                </h3>
              </div>
              <span className="text-xs font-sans text-champagne bg-gold/15 border border-gold/30 px-3 py-1 rounded-full">
                حالة المستحضر: مصرح ومطابق لمعايير الهيئة العليا للأدوية
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <span className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <VerifiedCheckIcon size={16} color="#34D399" />
                  <span>المواصفات الأصلية المضمونة</span>
                </span>
                <p className="text-sm text-ivory/80 font-sans leading-[1.75]">
                  {authenticityGuide.original?.formulaNotes}
                </p>
                <p className="text-sm text-muted-lux font-sans leading-[1.75]">
                  {authenticityGuide.original?.packagingNotes}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <span className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <CrossWarningIcon size={16} color="#FB7185" />
                  <span>علامات التقليد التجاري المغشوش</span>
                </span>
                <p className="text-sm text-ivory/80 font-sans leading-[1.75]">
                  {authenticityGuide.counterfeit?.formulaNotes}
                </p>
                <p className="text-sm text-muted-lux font-sans leading-[1.75]">
                  {authenticityGuide.counterfeit?.packagingNotes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews & Verification Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Reviews List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-serif font-bold text-ivory">
              آراء وتجارب العملاء الموثقة ({reviews.length})
            </h3>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={r.id || i} className="p-4 rounded-2xl bg-surface border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ivory">{r.customerName}</span>
                    {r.isVerifiedPurchase && (
                      <span className="text-xs font-sans font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <VerifiedCheckIcon size={12} color="#34D399" />
                        <span>شراء مؤكد (باتش: {r.batchCodeVerified || '54U700'})</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: r.rating || 5 }).map((_, starIdx) => (
                      <StarIcon key={starIdx} size={12} color="#C9A84C" fill="#C9A84C" />
                    ))}
                  </div>
                  <p className="text-sm text-ivory/90 font-sans leading-[1.75]">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-white/5 space-y-4">
            <h4 className="text-base font-serif font-bold text-ivory">
              أضيفي تقييمكِ وخبرتكِ مع المستحضر
            </h4>
            {reviewSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-sans text-center">
                شكراً لمشاركتكِ، تم تسجيل تقييمكِ بنجاح في سجل المنتجات الموثقة.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs font-sans">
                <div>
                  <label className="text-muted-lux block mb-1">اسمك الكريم:</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">التقييم:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none"
                  >
                    <option value={5} className="bg-surface">5 من 5 نجوم (ممتاز وأصلي)</option>
                    <option value={4} className="bg-surface">4 من 5 نجوم (جيد جداً)</option>
                    <option value={3} className="bg-surface">3 من 5 نجوم (متوسط)</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">رقم الباتش الموجود على عبوتكِ (اختياري للتوثيق):</label>
                  <input
                    type="text"
                    placeholder="مثال: 54U700"
                    value={batchCodeInput}
                    onChange={(e) => setBatchCodeInput(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory uppercase focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-lux block mb-1">رأيكِ الصادق بالنتيجة والقوام:</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-ivory focus:border-gold outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 transition inline-flex items-center justify-center"
                >
                  نشر التقييم الموثق
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <WhatsAppCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, q) =>
          setCartItems((prev) =>
            q <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity: q } : i))
          )
        }
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
        currentCurrency={currentCurrency}
        whatsappNumber="967775234989"
      />
    </div>
  );
}

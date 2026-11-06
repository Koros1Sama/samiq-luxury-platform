'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { formatCurrency } from '@/core/currency/formatter';
import { ProductCardData } from '@/themes/contract';
import {
  ShieldCheckIcon,
  VerifiedCheckIcon,
  BagCartIcon,
  WhatsAppIcon,
  StarIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { SubpageThemeWrapper, useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { isValidThemeId, ThemeId } from '@/themes/contract';
import { resolveThemePalette } from '@/core/storefront/themePalette';

function ProductDetailContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const router = useRouter();
  const sf = useStorefront();
  const subCtx = useSubpageTheme();
  const [urlTheme, setUrlTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const q = new URLSearchParams(window.location.search).get('theme');
        if (q && isValidThemeId(q)) {
          setUrlTheme(q as ThemeId);
        }
      } catch {
        // fallback
      }
    }
  }, []);

  const activeTheme = urlTheme || subCtx.activeTheme;
  const palette = resolveThemePalette(activeTheme, sf.customPalette);
  const isLight = palette.isLight;
  const locale = subCtx.locale || 'ar';
  const isEn = locale === 'en';
  const currentCurrency = sf.currency || 'YER';

  const [product, setProduct] = useState<ProductCardData | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [authenticityGuide, setAuthenticityGuide] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  // Review form
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [batchCodeInput, setBatchCodeInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [features, setFeatures] = useState<any>({ reviews_ratings: true });

  useEffect(() => {
    async function loadData() {
      try {
        try {
          const featRes = await fetch('/api/store/features');
          const featData = await featRes.json();
          if (featData && featData.features) {
            setFeatures(featData.features);
          }
        } catch {
          // fallback
        }

        const res = await fetch('/api/store/products');
        const data = await res.json();
        if (data.success && data.products) {
          const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();
          const found =
            data.products.find(
              (p: ProductCardData) =>
                p.id === slug ||
                p.id?.toLowerCase() === normalizedSlug ||
                (p.slug && p.slug.toLowerCase() === normalizedSlug) ||
                (p.title && p.title.toLowerCase().includes(normalizedSlug)) ||
                (normalizedSlug.includes('vitamin-c') && p.id === 'prod-1') ||
                (normalizedSlug.includes('cleanser') && p.id === 'prod-2') ||
                (normalizedSlug.includes('niacinamide') && p.id === 'prod-3') ||
                p.categorySlug === slug
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
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <p className="text-xs" style={{ color: palette.muted }}>
            {isEn ? 'Locating authentic product records...' : 'جاري جلب بيانات المستحضر المعتمد...'}
          </p>
        </div>
      </div>
    );
  }

  const price = product.prices[currentCurrency] || product.prices.YER;
  const comparePrice = product.comparePrices?.[currentCurrency];
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];

  const handleAddToCart = () => {
    if (product) {
      sf.cart.add(product, selectedVariantId);
    }
  };

  const handleDirectWhatsApp = () => {
    const formattedPrice = formatCurrency(price, currentCurrency);
    const varText = activeVariant ? ` (${activeVariant.title})` : '';
    const text = isEn
      ? `Hello Miftah Al-Jamal, I would like to order the authentic product: *${product.title}*${varText} priced at ${formattedPrice}, compliant with SBDMA standards.`
      : `مرحباً متجر مفتاح الجمال، أود طلب المستحضر الأصلي: *${product.title}*${varText} بسعر ${formattedPrice}، مع التأكد من مطابقة معايير الهيئة العليا للأدوية والمستلزمات الطبية.`;
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
          customerName: reviewerName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
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
    <div className="min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs font-sans flex items-center gap-2" style={{ color: palette.muted }}>
        <Link href="/" className="min-h-[44px] inline-flex items-center hover:underline">
          {isEn ? 'Home' : 'الرئيسية'}
        </Link>
        <span>/</span>
        <span style={{ color: palette.accent }}>{product.brand}</span>
        <span>/</span>
        <span className="truncate max-w-xs" style={{ color: palette.text }}>
          {product.title}
        </span>
      </div>

      {/* Main Product Showcase Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery Area (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="p-2 rounded-[2rem] border shadow-2xl"
              style={{
                backgroundColor: isLight ? '#00000004' : '#FFFFFF04',
                borderColor: palette.border,
              }}
            >
              <div
                className="relative rounded-[calc(2rem-0.5rem)] overflow-hidden aspect-[4/3]"
                style={{ backgroundColor: palette.surface }}
              >
                <SmartImage
                  src={activeImage || product.image}
                  alt={product.title}
                  fill
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center contrast-105"
                />
                <div
                  className="absolute top-4 start-4 px-3 py-1.5 rounded-full border text-xs font-sans font-bold flex items-center gap-1.5 shadow-md"
                  style={{
                    backgroundColor: isLight ? '#EAF4F2' : '#052e16',
                    borderColor: isLight ? '#10b981' : '#22c55e',
                    color: isLight ? '#0F4C4A' : '#86efac',
                  }}
                >
                  <VerifiedCheckIcon size={14} color={isLight ? '#0F4C4A' : '#34D399'} />
                  <span>{isEn ? '100% Authenticity Guaranteed' : 'ضمان الأصالة 100%'}</span>
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
                      className="relative min-w-[56px] min-h-[56px] w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: isCurrent ? palette.accent : palette.border,
                        transform: isCurrent ? 'scale(1.05)' : 'none',
                        boxShadow: isCurrent ? `0 0 10px ${palette.accent}40` : 'none',
                      }}
                      aria-label={`${isEn ? 'View product image' : 'عرض صورة المنتج'} ${imgIdx + 1}`}
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
              <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-sm font-sans leading-relaxed" style={{ color: palette.muted }}>
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Price Row & Warehouse Stock Badge */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b" style={{ borderColor: palette.border }}>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-serif font-bold" style={{ color: palette.accent }}>
                  {formatCurrency(price, currentCurrency)}
                </span>
                {comparePrice && (
                  <span className="text-sm line-through font-sans" style={{ color: palette.muted }}>
                    {formatCurrency(comparePrice, currentCurrency)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-1 rounded text-xs font-sans font-bold border"
                  style={{
                    backgroundColor: `${palette.accent}15`,
                    borderColor: `${palette.accent}40`,
                    color: palette.accent,
                  }}
                >
                  {isEn ? 'Instant Sanaa Delivery' : 'تسليم فوري بصنعاء'}
                </span>
                {typeof product.stockQuantity === 'number' && (
                  <span
                    className="px-2.5 py-1 rounded text-xs font-sans font-bold border"
                    style={{
                      backgroundColor: product.stockQuantity > 0 ? '#052e16' : '#4c0519',
                      borderColor: product.stockQuantity > 0 ? '#22c55e' : '#f43f5e',
                      color: product.stockQuantity > 0 ? '#86efac' : '#fecdd3',
                    }}
                  >
                    {product.stockQuantity > 0
                      ? isEn
                        ? `In Stock (${product.stockQuantity} units)`
                        : `متوفر في المخزن (${product.stockQuantity} قطعة)`
                      : isEn
                      ? 'Out of Stock'
                      : 'نفدت الكمية حالياً'}
                  </span>
                )}
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold font-sans block" style={{ color: palette.accent }}>
                  {isEn ? 'Available Shade / Size:' : 'الحجم أو الدرجة المتوفرة:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariantId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(v.id)}
                        className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-sans font-bold border transition inline-flex items-center"
                        style={{
                          backgroundColor: isSelected ? `${palette.accent}25` : palette.surface,
                          borderColor: isSelected ? palette.accent : palette.border,
                          color: isSelected ? palette.accent : palette.text,
                        }}
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
                className="min-h-[44px] py-4 px-6 rounded-2xl font-sans font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2.5 transition"
                style={{
                  backgroundColor: palette.accent,
                  color: isLight && palette.accent !== '#0F4C4A' ? '#FFFFFF' : '#0B0B0C',
                }}
              >
                <BagCartIcon size={18} color="currentColor" />
                <span>{isEn ? 'Add to Shopping Bag' : 'إضافة إلى حقيبة المشتريات'}</span>
              </button>
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="min-h-[44px] py-4 px-6 rounded-2xl border font-sans font-bold text-sm flex items-center justify-center gap-2.5 transition"
                style={{
                  backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
                  borderColor: palette.border,
                  color: palette.text,
                }}
              >
                <WhatsAppIcon size={18} color="currentColor" />
                <span>{isEn ? 'Direct WhatsApp Order' : 'طلب مباشر عبر واتساب'}</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div
              className="p-4 rounded-2xl border space-y-2 text-xs font-sans"
              style={{ backgroundColor: palette.surface, borderColor: palette.border, color: palette.muted }}
            >
              <div className="flex items-center gap-2 font-medium" style={{ color: palette.text }}>
                <ShieldCheckIcon size={16} color={palette.accent} />
                <span>
                  {isEn
                    ? 'Certified products compliant with Supreme Board of Drugs & Medical Appliances (SBDMA) standards'
                    : 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium" style={{ color: palette.text }}>
                <VerifiedCheckIcon size={14} color="#34D399" />
                <span>
                  {isEn
                    ? 'Express delivery within hours across all Sanaa capital districts'
                    : 'توصيل فوري خلال ساعات لكافة أحياء أمانة العاصمة صنعاء'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Authenticity Guide Details (if available) */}
        {authenticityGuide && (
          <div
            className="p-6 sm:p-8 rounded-3xl border space-y-6"
            style={{ backgroundColor: palette.surface, borderColor: palette.border }}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                {isEn ? 'Authenticity Protocol' : 'بروتوكول التحقق والمطابقة المعتمد'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
                {isEn ? 'How to Verify This Authentic Product' : 'كيف تتأكدين من أصالة هذا المستحضر؟'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{ backgroundColor: isLight ? '#00000004' : '#FFFFFF04', borderColor: palette.border }}
              >
                <span className="text-xs font-bold block" style={{ color: '#10b981' }}>
                  {isEn ? 'Verified Genuine Features:' : 'علامات المنتج الأصلي المعتمد:'}
                </span>
                <p className="text-xs font-sans leading-relaxed" style={{ color: palette.text }}>
                  {authenticityGuide.originalFeatures ||
                    (isEn
                      ? 'Features pure amber tint, airtight dropper gasket, and official SBDMA barcode stamp.'
                      : 'قوام نقي، سدادة قطارة محكمة تمنع دخول الأكسجين، وختم باركود الهيئة العليا للأدوية.')}
                </p>
              </div>
              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{ backgroundColor: isLight ? '#00000004' : '#FFFFFF04', borderColor: palette.border }}
              >
                <span className="text-xs font-bold block" style={{ color: '#f43f5e' }}>
                  {isEn ? 'Counterfeit Warning Signs:' : 'علامات وخطر المستحضرات المغشوشة:'}
                </span>
                <p className="text-xs font-sans leading-relaxed" style={{ color: palette.text }}>
                  {authenticityGuide.fakeRisks ||
                    (isEn
                      ? 'Frothy foam upon shaking, chemical stinging odor, missing regulatory seals.'
                      : 'ظهور رغوة بيضاء عائمة عند الرج، ورائحة كيميائية لاذعة، مع غياب أختام الاستيراد الرسمية.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        {features.reviews_ratings !== false && (
          <div className="space-y-8 pt-6 border-t" style={{ borderColor: palette.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
                  {isEn ? 'Verified Customer Reviews' : 'تقييمات وتجارب العملاء الموثقة'}
                </h3>
                <p className="text-xs font-sans mt-0.5" style={{ color: palette.muted }}>
                  {reviews.length} {isEn ? 'verified reviews' : 'تقييم موثق من مشتريات مؤكدة'}
                </p>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl border space-y-3"
                    style={{ backgroundColor: palette.surface, borderColor: palette.border }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs" style={{ color: palette.text }}>
                        {rev.customerName}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <StarIcon
                            key={idx}
                            size={14}
                            color={idx < rev.rating ? palette.accent : '#555555'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-sans leading-relaxed" style={{ color: palette.muted }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-sans" style={{ color: palette.muted }}>
                {isEn ? 'No reviews submitted yet for this product.' : 'لا توجد تقييمات منشورة حتى الآن لهذا المستحضر.'}
              </p>
            )}

            {/* Review Form */}
            <div
              className="p-6 rounded-2xl border max-w-xl space-y-4"
              style={{ backgroundColor: palette.surface, borderColor: palette.border }}
            >
              <h4 className="text-sm font-serif font-bold" style={{ color: palette.text }}>
                {isEn ? 'Write a Verified Review' : 'أضيفي تقييمكِ وتجربتكِ'}
              </h4>
              {reviewSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-sans">
                  {isEn ? 'Thank you! Your verified review has been submitted.' : 'شكراً لكِ! تم تسجيل تقييمكِ بنجاح.'}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs font-sans">
                  <div>
                    <label className="block mb-1" style={{ color: palette.muted }}>
                      {isEn ? 'Your Name:' : 'اسمكِ الكريمة:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border outline-hidden"
                      style={{
                        backgroundColor: isLight ? '#FFFFFF' : '#FFFFFF08',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: palette.muted }}>
                      {isEn ? 'Rating:' : 'التقييم:'}
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border outline-hidden"
                      style={{
                        backgroundColor: isLight ? '#FFFFFF' : '#0B0B0C',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    >
                      <option value={5}>5 / 5 — ممتازة ومطابقة للأصلي</option>
                      <option value={4}>4 / 5 — جيدة جداً</option>
                      <option value={3}>3 / 5 — مقبولة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1" style={{ color: palette.muted }}>
                      {isEn ? 'Review Comments:' : 'رأيكِ الصادق بالنتيجة والقوام:'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl border outline-hidden resize-none"
                      style={{
                        backgroundColor: isLight ? '#FFFFFF' : '#FFFFFF08',
                        borderColor: palette.border,
                        color: palette.text,
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-3 rounded-xl font-bold text-xs hover:brightness-110 transition inline-flex items-center justify-center"
                    style={{
                      backgroundColor: palette.accent,
                      color: isLight && palette.accent !== '#0F4C4A' ? '#FFFFFF' : '#0B0B0C',
                    }}
                  >
                    {isEn ? 'Publish Verified Review' : 'نشر التقييم الموثق'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <SubpageThemeWrapper activeNav="product" showNavHeader={true} showFooter={true} showSimulator={true}>
      <ProductDetailContent />
    </SubpageThemeWrapper>
  );
}

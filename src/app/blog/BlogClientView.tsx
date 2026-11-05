'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SmartImage } from '@/core/ui/SmartImage';
import { BlogPostRecord } from '@/core/db/store';
import { useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { formatCurrency } from '@/core/currency/formatter';

interface LinkedProductMeta {
  productId: string;
  productSlug: string;
  titleAr: string;
  titleEn: string;
  brand: string;
  priceYer: number;
  image: string;
  activeIngredients: string;
  climateTipAr: string;
  climateTipEn: string;
  verificationTipAr: string;
  verificationTipEn: string;
}

const ARTICLE_ENRICHMENTS: Record<string, { category: string; linkedProduct: LinkedProductMeta }> = {
  'how-to-verify-vitamin-c-serum': {
    category: 'authenticity',
    linkedProduct: {
      productId: 'prod-1',
      productSlug: 'prod-1',
      titleAr: 'سيروم فيتامين سي النقي 10% (Pure Vitamin C10)',
      titleEn: 'Pure Vitamin C10 Radiance Serum',
      brand: 'سيرومات نقية',
      priceYer: 28500,
      image: '/media/products/serum-vitamin-c.jpg',
      activeIngredients: '10% L-Ascorbic Acid + Salicylic Acid + Neurosensine + Hyaluronic Acid',
      climateTipAr:
        'نظراً لارتفاع الإشعاع الشمسي في مدن المرتفعات اليمنية (صنعاء، ذمار، إب)، يجب تطبيق واقي شمس بحماية SPF 50+ بعد امتصاص السيروم تماماً لمنع أكسدة البشرة.',
      climateTipEn:
        'Due to elevated solar UV radiation at high altitude in Yemeni highland cities (Sanaa, Dhamar, Ibb), always pair with SPF 50+ broad-spectrum sunscreen after full absorption.',
      verificationTipAr:
        'تأكد من مطابقة ختم الهيئة العليا للأدوية والمستلزمات الطبية، واللون الكهرماني الذهبي الخالي من أي رغوة عائمة عند رج العبوة.',
      verificationTipEn:
        'Verify the Supreme Board of Drugs & Medical Appliances (SBDMA) compliance stamp and ensure the pure golden amber liquid has no foamy froth upon shaking.',
    },
  },
  'hydrating-cleanser-original-guide': {
    category: 'routine',
    linkedProduct: {
      productId: 'prod-2',
      productSlug: 'prod-2',
      titleAr: 'الغسول المرطب للبشرة العادية والجافة (Hydrating Cleanser)',
      titleEn: 'Hydrating Cleanser with Essential Ceramides',
      brand: 'عناية يومية',
      priceYer: 14500,
      image: '/media/products/cleanser-hydrating.jpg',
      activeIngredients: 'Ceramides 1, 3, 6-II + Hyaluronic Acid + MVE Delivery Technology',
      climateTipAr:
        'تركيبة مثالية لمواجهة الجفاف الشديد والرياح الجافة في صنعاء والمناطق الجبلية، حيث تعيد بناء الحاجز الدهني المتضرر دون تجريد البشرة من ترطيبها الطبيعي.',
      climateTipEn:
        'Formulated to counteract severe low humidity and drying winds in Sanaa and mountainous regions by reinforcing the stratum corneum lipid barrier.',
      verificationTipAr:
        'تحقق من نعومة آلية المضخة بلون أزرق موحد بدون أي نتوءات خشنة، وقوام اللوشن الأبيض الحليبي غير الرغوي.',
      verificationTipEn:
        'Inspect the smooth blue pump actuator with no moulding burrs, and confirm the silky non-foaming white lotion texture.',
    },
  },
};

export function BlogClientView({ initialPosts }: { initialPosts: BlogPostRecord[] }) {
  const { palette, isLight, locale } = useSubpageTheme();
  const sf = useStorefront();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEn = locale === 'en';
  const currency = sf.currency || 'YER';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'authenticity' | 'science' | 'routine'>('all');
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Sync with URL ?post=<slug>
  useEffect(() => {
    const postSlugFromUrl = searchParams.get('post');
    if (postSlugFromUrl) {
      setSelectedPostSlug(postSlugFromUrl);
    }
  }, [searchParams]);

  const openArticle = useCallback(
    (slug: string) => {
      setSelectedPostSlug(slug);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('post', slug);
        window.history.pushState({}, '', url.toString());
      } catch {
        // fallback
      }
    },
    []
  );

  const closeArticle = useCallback(() => {
    setSelectedPostSlug(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('post');
      window.history.pushState({}, '', url.toString());
    } catch {
      // fallback
    }
  }, []);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const enrichment = ARTICLE_ENRICHMENTS[post.slug];
      const category = enrichment ? enrichment.category : 'science';

      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchesAuthor = post.author.toLowerCase().includes(q);
      const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesTitle || matchesExcerpt || matchesAuthor || matchesTags;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const activeArticle = useMemo(() => {
    if (!selectedPostSlug) return null;
    return initialPosts.find((p) => p.slug === selectedPostSlug) || null;
  }, [initialPosts, selectedPostSlug]);

  const activeEnrichment = activeArticle ? ARTICLE_ENRICHMENTS[activeArticle.slug] : null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const categories = [
    { id: 'all', labelAr: 'كافة المقالات', labelEn: 'All Articles' },
    { id: 'authenticity', labelAr: 'أدلة الأصالة والمطابقة', labelEn: 'Authenticity Guides' },
    { id: 'science', labelAr: 'علم التراكيب الصيدلانية', labelEn: 'Clinical Science' },
    { id: 'routine', labelAr: 'روتين ومناخ اليمن', labelEn: 'Yemen Climate Routine' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* 1. Header Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-sans font-bold"
          style={{
            borderColor: `${palette.accent}50`,
            backgroundColor: `${palette.accent}15`,
            color: palette.accent,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.accent }} />
          <span>{isEn ? 'Scientific & Clinical Dermatology Journal' : 'مجلة التوثيق المخبري والعناية السريرية'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight" style={{ color: palette.text }}>
          {isEn ? 'Skincare Secrets & Verified Authenticity' : 'أسرار العناية ودليل حماية البشرة في اليمن'}
        </h1>
        <p className="text-xs sm:text-sm font-sans leading-relaxed max-w-2xl mx-auto" style={{ color: palette.muted }}>
          {isEn
            ? 'Peer-reviewed clinical guides, formulation breakdowns, and practical steps to ensure verified authenticity under Yemen climatic conditions.'
            : 'مقالات وأدلة عملية معتمدة لحماية بشرتكِ من التلف وتوثيق المطابقة وفق معايير الهيئة العليا للأدوية والمستلزمات الطبية.'}
        </p>
      </div>

      {/* 2. Search & Category Filters Bar */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Search Input (Double-Bezel Design) */}
        <div
          className="p-1 rounded-2xl border transition-all"
          style={{
            backgroundColor: isLight ? '#00000005' : '#FFFFFF05',
            borderColor: palette.border,
          }}
        >
          <div
            className="rounded-xl flex items-center px-4 py-2 gap-3"
            style={{ backgroundColor: palette.surface }}
          >
            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? 'Search by keyword, active ingredient, or concern...'
                  : 'ابحثي بعنوان المقال، المادة الفعالة (فيتامين سي، سيراميدات)، أو اسم الخبير...'
              }
              className="w-full bg-transparent text-xs sm:text-sm font-sans outline-hidden border-none"
              style={{ color: palette.text }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs px-2 py-1 rounded opacity-60 hover:opacity-100"
                style={{ color: palette.muted }}
              >
                {isEn ? 'Clear' : 'مسح'}
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-center flex-wrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`min-h-[38px] px-4 rounded-full text-xs font-sans font-medium transition-all ${
                  isSelected ? 'font-bold shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? palette.accent : isLight ? '#00000008' : '#FFFFFF0A',
                  color: isSelected ? (isLight && palette.accent !== '#0F4C4A' ? '#FFFFFF' : '#0B0B0C') : palette.text,
                  border: `1px solid ${isSelected ? palette.accent : palette.border}`,
                }}
              >
                {isEn ? cat.labelEn : cat.labelAr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Empty State */}
      {filteredPosts.length === 0 && (
        <div
          className="text-center py-16 px-4 rounded-3xl border space-y-4 max-w-xl mx-auto"
          style={{ backgroundColor: palette.surface, borderColor: palette.border }}
        >
          <p className="text-sm font-sans" style={{ color: palette.muted }}>
            {isEn ? 'No articles match your search criteria.' : 'لم يتم العثور على مقالات تطابق معايير البحث الحالية.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold"
            style={{ backgroundColor: palette.accent, color: '#0B0B0C' }}
          >
            {isEn ? 'Reset Filters' : 'إعادة ضبط التصفية'}
          </button>
        </div>
      )}

      {/* 4. Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {filteredPosts.map((post) => {
          const enrichment = ARTICLE_ENRICHMENTS[post.slug];
          return (
            <article
              key={post.id}
              className="group p-2 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
              style={{
                backgroundColor: isLight ? '#00000003' : '#FFFFFF04',
                borderColor: palette.border,
              }}
            >
              <div
                className="rounded-[calc(2rem-0.5rem)] p-5 sm:p-6 space-y-5 flex flex-col justify-between h-full"
                style={{ backgroundColor: palette.surface }}
              >
                <div className="space-y-4">
                  {/* Article Thumbnail */}
                  <div
                    onClick={() => openArticle(post.slug)}
                    className="cursor-pointer relative h-52 sm:h-64 w-full rounded-2xl overflow-hidden bg-black/10"
                  >
                    <SmartImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority={false}
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 start-3 px-3 py-1 rounded-full text-[11px] font-sans font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {post.readTimeMinutes} {isEn ? 'min read' : 'دقائق قراءة'}
                    </div>
                  </div>

                  {/* Meta: Author & Tags */}
                  <div className="flex items-center justify-between text-xs font-sans" style={{ color: palette.muted }}>
                    <span className="font-semibold" style={{ color: palette.accent }}>
                      {post.author}
                    </span>
                    <span>{post.publishedAt}</span>
                  </div>

                  {/* Title */}
                  <h2
                    onClick={() => openArticle(post.slug)}
                    className="cursor-pointer text-lg sm:text-xl font-serif font-bold leading-snug hover:underline"
                    style={{ color: palette.text }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm font-sans leading-relaxed line-clamp-3" style={{ color: palette.muted }}>
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer of Card: Linked Product Pill & Interactive Read Button */}
                <div className="pt-4 border-t space-y-3" style={{ borderColor: palette.border }}>
                  {enrichment && (
                    <div className="text-[11px] font-sans flex items-center justify-between" style={{ color: palette.muted }}>
                      <span className="truncate max-w-[200px]">
                        {isEn ? 'Linked Product: ' : 'المستحضر المرتبط: '}
                        <strong style={{ color: palette.text }}>{enrichment.linkedProduct.brand}</strong>
                      </span>
                      <span className="font-mono font-bold" style={{ color: palette.accent }}>
                        {formatCurrency(enrichment.linkedProduct.priceYer, currency)}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => openArticle(post.slug)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-sans font-bold flex items-center justify-between transition-all group-hover:brightness-105"
                    style={{
                      backgroundColor: `${palette.accent}20`,
                      color: palette.accent,
                      border: `1px solid ${palette.accent}40`,
                    }}
                  >
                    <span>{isEn ? 'Read Complete Clinical Analysis' : 'قراءة التحليل والمقال كاملاً'}</span>
                    <span className="rtl:-scale-x-100 transition-transform group-hover:translate-x-1">←</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 5. FULL ARTICLE READER MODAL / VIEW (Rich Clinical Skincare Engine) */}
      {/* ==================================================================== */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div
            className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl space-y-8 relative"
            style={{
              backgroundColor: palette.background,
              borderColor: palette.border,
              color: palette.text,
            }}
          >
            {/* Top Modal Controls Sticky Bar */}
            <div
              className="sticky top-0 z-20 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md"
              style={{
                backgroundColor: isLight ? `${palette.surface}F5` : `${palette.surface}E6`,
                borderColor: palette.border,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${palette.accent}20`, color: palette.accent }}
                >
                  {isEn ? 'Scientific Paper' : 'ورقة توثيق سريرية'}
                </span>
                <span className="text-xs font-sans" style={{ color: palette.muted }}>
                  {activeArticle.readTimeMinutes} {isEn ? 'min read' : 'دقائق قراءة'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="min-h-[38px] px-3 rounded-lg border text-xs font-sans font-medium transition flex items-center gap-1.5"
                  style={{ borderColor: palette.border, color: palette.text }}
                  title={isEn ? 'Copy link to article' : 'نسخ رابط المقال'}
                >
                  <span>{copyFeedback ? (isEn ? 'Copied' : 'تم النسخ') : isEn ? 'Share Link' : 'مشاركة الرابط'}</span>
                </button>
                <button
                  type="button"
                  onClick={closeArticle}
                  className="min-w-[38px] min-h-[38px] rounded-lg border flex items-center justify-center font-bold hover:opacity-80 transition"
                  style={{ borderColor: palette.border, color: palette.text }}
                  aria-label="إغلاق المقال"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="px-5 sm:px-10 pb-10 space-y-8">
              {/* Cover Hero */}
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-black/10">
                <SmartImage
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  fill
                  priority={true}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 inset-x-6 space-y-2 text-white">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs">
                    {activeArticle.author} — {activeArticle.publishedAt}
                  </span>
                  <h1 className="text-xl sm:text-3xl font-serif font-bold leading-tight">
                    {activeArticle.title}
                  </h1>
                </div>
              </div>

              {/* Core Thesis / Excerpt Lead */}
              <div
                className="p-4 sm:p-6 rounded-2xl border font-sans text-sm sm:text-base leading-relaxed"
                style={{
                  backgroundColor: `${palette.accent}0C`,
                  borderColor: `${palette.accent}30`,
                  color: palette.text,
                }}
              >
                <strong className="block mb-1" style={{ color: palette.accent }}>
                  {isEn ? 'Clinical Abstract & Executive Overview:' : 'الملخص السريري التنفيذي:'}
                </strong>
                <p>{activeArticle.excerpt}</p>
              </div>

              {/* Main Content Paragraphs */}
              <div className="prose max-w-none text-xs sm:text-sm font-sans leading-loose space-y-4">
                {activeArticle.content.split('\n\n').map((paragraph, idx) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={idx} className="leading-[2]" style={{ color: palette.text }}>
                      {paragraph.trim()}
                    </p>
                  );
                })}
              </div>

              {/* Structured Skincare & Yemen Climate Sections */}
              {activeEnrichment && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Card 1: Active Ingredients */}
                  <div
                    className="p-5 rounded-2xl border space-y-2"
                    style={{ backgroundColor: palette.surface, borderColor: palette.border }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                      {isEn ? 'Pharmaceutical Formulation' : 'التركيز والمكونات الفعالة'}
                    </span>
                    <p className="text-xs font-mono font-bold leading-relaxed" style={{ color: palette.text }}>
                      {activeEnrichment.linkedProduct.activeIngredients}
                    </p>
                  </div>

                  {/* Card 2: Yemen Climate Adaptation */}
                  <div
                    className="p-5 rounded-2xl border space-y-2"
                    style={{ backgroundColor: palette.surface, borderColor: palette.border }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                      {isEn ? 'Yemen Climate Guidance' : 'إرشادات الاستخدام في مناخ اليمن'}
                    </span>
                    <p className="text-xs font-sans leading-relaxed" style={{ color: palette.muted }}>
                      {isEn
                        ? activeEnrichment.linkedProduct.climateTipEn
                        : activeEnrichment.linkedProduct.climateTipAr}
                    </p>
                  </div>

                  {/* Card 3: Anti-Counterfeit Verification */}
                  <div
                    className="p-5 rounded-2xl border space-y-2 md:col-span-2"
                    style={{
                      backgroundColor: isLight ? '#00000004' : '#FFFFFF04',
                      borderColor: palette.border,
                    }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.accent }}>
                      {isEn ? 'SBDMA Authenticity Verification Protocol' : 'بروتوكول فحص الأصالة المعتمد من الهيئة'}
                    </span>
                    <p className="text-xs font-sans leading-relaxed" style={{ color: palette.text }}>
                      {isEn
                        ? activeEnrichment.linkedProduct.verificationTipEn
                        : activeEnrichment.linkedProduct.verificationTipAr}
                    </p>
                  </div>
                </div>
              )}

              {/* Linked Product Direct Purchase Card */}
              {activeEnrichment && (
                <div
                  className="p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: `${palette.accent}50`,
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border" style={{ borderColor: palette.border }}>
                      <SmartImage
                        src={activeEnrichment.linkedProduct.image}
                        alt={activeEnrichment.linkedProduct.titleAr}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-sans font-bold block" style={{ color: palette.accent }}>
                        {activeEnrichment.linkedProduct.brand}
                      </span>
                      <h4 className="text-sm sm:text-base font-serif font-bold truncate" style={{ color: palette.text }}>
                        {isEn ? activeEnrichment.linkedProduct.titleEn : activeEnrichment.linkedProduct.titleAr}
                      </h4>
                      <p className="text-xs font-mono font-bold" style={{ color: palette.text }}>
                        {formatCurrency(activeEnrichment.linkedProduct.priceYer, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <Link
                      href={`/product/${activeEnrichment.linkedProduct.productSlug}`}
                      className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 rounded-xl border text-xs font-sans font-semibold text-center inline-flex items-center justify-center transition"
                      style={{ borderColor: palette.border, color: palette.text }}
                    >
                      {isEn ? 'View Product' : 'تفاصيل المستحضر'}
                    </Link>
                    <a
                      href={`https://wa.me/967775234989?text=${encodeURIComponent(
                        `مرحباً مفتاح الجمال، أود طلب المستحضر الأصلي المذكور في مقال المجلة:\n*${activeEnrichment.linkedProduct.titleAr}*\nالسعر: ${formatCurrency(
                          activeEnrichment.linkedProduct.priceYer,
                          currency
                        )}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-sans font-bold text-center inline-flex items-center justify-center shadow-md transition hover:brightness-110"
                      style={{
                        backgroundColor: palette.accent,
                        color: isLight && palette.accent !== '#0F4C4A' ? '#FFFFFF' : '#0B0B0C',
                      }}
                    >
                      {isEn ? 'Order via WhatsApp' : 'طلب فوري عبر واتساب'}
                    </a>
                  </div>
                </div>
              )}

              {/* Close Bottom Button */}
              <div className="pt-6 border-t flex justify-end" style={{ borderColor: palette.border }}>
                <button
                  type="button"
                  onClick={closeArticle}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl border text-xs font-sans font-bold"
                  style={{ borderColor: palette.border, color: palette.text }}
                >
                  {isEn ? 'Back to All Articles' : 'العودة لكافة مقالات المجلة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

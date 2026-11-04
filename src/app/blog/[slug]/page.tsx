import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/core/db/store';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import { SparkleStarIcon, ShieldCheckIcon } from '@/themes/base/luxury-noir/components/LuxuryIcons';

export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <div className="flex items-center gap-4 text-xs font-sans">
            <Link href="/blog" className="min-h-[44px] inline-flex items-center text-muted-lux hover:text-champagne transition">
              أرشيف المجلة
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/" className="min-h-[44px] inline-flex items-center text-champagne hover:text-gold transition">
              المتجر الرئيسي ←
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Article Meta */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <span>{post.tags[0] || 'أسرار العناية'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-lux font-sans">
            <span className="text-gold font-semibold">{post.author}</span>
            <span>•</span>
            <span>تاريخ النشر: {post.publishedAt}</span>
            <span>•</span>
            <span>{post.readTimeMinutes} دقائق قراءة</span>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] w-full border border-white/10 shadow-2xl">
          <SmartImage
            src={post.coverImage}
            alt={post.title}
            fill
            priority={true}
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover object-center"
          />
        </div>

        {/* Content Body */}
        <article className="prose prose-invert max-w-none text-sm sm:text-base leading-[1.75] text-ivory/90 space-y-6 whitespace-pre-line font-sans border-b border-white/10 pb-10">
          {post.content}
        </article>

        {/* Trust Banner Callout */}
        <div className="p-6 rounded-3xl bg-surface border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-2 text-champagne font-serif font-bold text-base">
              <ShieldCheckIcon size={18} color="#C9A84C" />
              <span>تسوقي المستحضرات الأصلية المذكورة في المقال</span>
            </div>
            <p className="text-sm text-muted-lux font-sans leading-[1.75]">
              جميع المنتجات متوفرة بتسليم فوري في صنعاء وشحن لكافة المحافظات مع ضمان مطابقة الباركود.
            </p>
          </div>
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs whitespace-nowrap hover:brightness-110 transition flex-shrink-0"
          >
            تصفح الكتالوج المعتمد ←
          </Link>
        </div>
      </main>
    </div>
  );
}

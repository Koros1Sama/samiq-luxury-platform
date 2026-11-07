'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';

interface BlogPostClientViewProps {
  post: {
    id: string;
    slug: string;
    title: string;
    author: string;
    readTimeMinutes: number;
    publishedAt: string;
    coverImage: string;
    excerpt: string;
    content: string;
  };
  relatedPosts: Array<{
    id: string;
    slug: string;
    title: string;
    author: string;
  }>;
}

export function BlogPostClientView({ post, relatedPosts }: BlogPostClientViewProps) {
  const { palette, isLight, activeTheme } = useSubpageTheme();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs font-sans" style={{ color: palette.muted }}>
        <Link href="/" className="hover:underline" style={{ color: palette.muted }}>
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:underline" style={{ color: palette.muted }}>
          المجلة العلمية
        </Link>
        <span>/</span>
        <span className="truncate max-w-xs font-bold" style={{ color: palette.accent }}>
          {post.title}
        </span>
      </nav>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold border transition-colors"
            style={{
              backgroundColor: `${palette.accent}15`,
              borderColor: `${palette.accent}40`,
              color: palette.accent,
            }}
          >
            توثيق سريري معتمد
          </span>
          <span className="text-xs font-sans" style={{ color: palette.muted }}>
            {post.readTimeMinutes} دقائق قراءة
          </span>
          <span className="text-xs font-sans" style={{ color: palette.muted }}>•</span>
          <span className="text-xs font-sans" style={{ color: palette.muted }}>
            {post.publishedAt}
          </span>
        </div>
        <h1
          className="text-2xl sm:text-4xl font-serif font-bold leading-[1.55] md:leading-[1.5]"
          style={{ color: palette.text }}
        >
          {post.title}
        </h1>
        <p className="text-xs sm:text-sm font-sans font-semibold" style={{ color: palette.accent }}>
          بقلم: {post.author}
        </p>
      </div>

      {/* Cover Image */}
      <div
        className="relative h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden border shadow-2xl transition-colors"
        style={{
          backgroundColor: isLight ? '#FAF7F2' : 'rgba(255, 255, 255, 0.05)',
          borderColor: palette.border,
        }}
      >
        <SmartImage
          src={post.coverImage}
          alt={post.title}
          fill
          priority={true}
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover object-center"
        />
      </div>

      {/* Executive Abstract */}
      <div
        className="p-6 rounded-2xl border space-y-2 transition-colors"
        style={{
          backgroundColor: isLight
            ? (activeTheme === 'clinic-lab' ? '#F4F8F7' : '#F5EFE6')
            : 'rgba(255, 255, 255, 0.03)',
          borderColor: `${palette.accent}40`,
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-wider block"
          style={{ color: palette.accent }}
        >
          الملخص التنفيذي للبحث:
        </span>
        <p className="text-sm font-sans leading-relaxed" style={{ color: palette.text }}>
          {post.excerpt}
        </p>
      </div>

      {/* Full Content */}
      <div className="space-y-6 text-sm font-sans leading-loose" style={{ color: palette.text }}>
        {post.content.split('\n\n').map((para, i) => {
          if (!para.trim()) return null;
          return (
            <p key={i} className="leading-[2]">
              {para.trim()}
            </p>
          );
        })}
      </div>

      {/* Clinical Callout Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div
          className="p-5 rounded-2xl border space-y-2 transition-colors"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.border,
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: palette.accent }}>
            إرشادات الاستخدام في مناخ اليمن
          </span>
          <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
            احرصي على تطبيق المستحضر بالتزامن مع واقي الشمس الفيزيائي ذي الحماية العالية (SPF 50+)، وتجنبي التعرض المباشر لأشعة الشمس في المرتفعات الجبلية ذات الهواء الجاف.
          </p>
        </div>

        <div
          className="p-5 rounded-2xl border space-y-2 transition-colors"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.border,
          }}
        >
          <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: palette.accent }}>
            كفالة الهيئة العليا للأدوية
          </span>
          <p className="text-xs leading-relaxed" style={{ color: palette.muted }}>
            كافة المستحضرات المعروضة في المتجر تأتي بختم أصالة رسمي مسجل ومطابق لتعليمات الاستيراد القانوني والفحص المخبري.
          </p>
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="pt-10 border-t space-y-6" style={{ borderColor: palette.border }}>
          <h3 className="text-lg font-serif font-bold" style={{ color: palette.text }}>
            مقالات ذات صلة في المجلة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="p-4 rounded-2xl border transition block space-y-2 group"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                }}
              >
                <span className="text-xs block" style={{ color: palette.accent }}>{rel.author}</span>
                <h4
                  className="text-sm font-serif font-bold line-clamp-2 transition-colors"
                  style={{ color: palette.text }}
                >
                  {rel.title}
                </h4>
                <span className="text-xs inline-flex items-center gap-1 pt-1 font-semibold" style={{ color: palette.accent }}>
                  <span>قراءة المقال</span>
                  <span>←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

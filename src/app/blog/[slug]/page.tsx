import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/core/db/store';
import { SubpageThemeWrapper } from '@/core/storefront/SubpageThemeWrapper';
import { SmartImage } from '@/core/ui/SmartImage';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <SubpageThemeWrapper activeNav="blog" showNavHeader={true} showFooter={true}>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-2xl font-serif font-bold">المقال غير موجود</h1>
          <p className="text-xs text-muted-lux">
            عذراً، المقال المطلوب لم يتم العثور عليه في أرشيف المجلة العلمية.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gold/20 text-gold border border-gold/40 text-xs font-bold"
          >
            العودة للمجلة العلمية
          </Link>
        </div>
      </SubpageThemeWrapper>
    );
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <SubpageThemeWrapper activeNav="blog" showNavHeader={true} showFooter={true} showSimulator={true}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="مسار التصفح" className="flex items-center gap-2 text-xs font-sans text-muted-lux">
          <Link href="/" className="hover:underline">
            الرئيسية
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:underline">
            المجلة العلمية
          </Link>
          <span>/</span>
          <span className="text-gold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
              توثيق سريري معتمد
            </span>
            <span className="text-xs text-muted-lux font-sans">{post.readTimeMinutes} دقائق قراءة</span>
            <span className="text-xs text-muted-lux font-sans">•</span>
            <span className="text-xs text-muted-lux font-sans">{post.publishedAt}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-ivory leading-tight">
            {post.title}
          </h1>
          <p className="text-xs sm:text-sm text-gold font-sans font-semibold">
            بقلم: {post.author}
          </p>
        </div>

        {/* Cover Image */}
        <div className="relative h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
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
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-gold/30 space-y-2">
          <span className="text-xs font-bold text-gold uppercase tracking-wider block">
            الملخص التنفيذي للبحث:
          </span>
          <p className="text-sm text-ivory font-sans leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Full Content */}
        <div className="space-y-6 text-sm font-sans leading-loose text-ivory/90">
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
          <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-2">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              إرشادات الاستخدام في مناخ اليمن
            </span>
            <p className="text-xs text-muted-lux leading-relaxed">
              احرصي على تطبيق المستحضر بالتزامن مع واقي الشمس الفيزيائي ذي الحماية العالية (SPF 50+)، وتجنبي التعرض المباشر لأشعة الشمس في المرتفعات الجبلية ذات الهواء الجاف.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-2">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              كفالة الهيئة العليا للأدوية
            </span>
            <p className="text-xs text-muted-lux leading-relaxed">
              كافة المستحضرات المعروضة في المتجر تأتي بختم أصالة رسمي مسجل ومطابق لتعليمات الاستيراد القانوني والفحص المخبري.
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-10 border-t border-white/10 space-y-6">
            <h3 className="text-lg font-serif font-bold text-ivory">مقالات ذات صلة في المجلة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="p-4 rounded-2xl bg-surface border border-white/10 hover:border-gold/40 transition block space-y-2 group"
                >
                  <span className="text-xs text-gold block">{rel.author}</span>
                  <h4 className="text-sm font-serif font-bold text-ivory group-hover:text-champagne transition line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-champagne inline-flex items-center gap-1 pt-1">
                    <span>قراءة المقال</span>
                    <span>←</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </SubpageThemeWrapper>
  );
}

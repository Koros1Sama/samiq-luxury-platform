import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { getAllBlogPosts } from '@/core/db/store';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import { SparkleStarIcon } from '@/themes/base/luxury-noir/components/LuxuryIcons';

export const revalidate = 0;

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = posts.filter((p) => p.id !== featuredPost?.id);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <SparkleStarIcon size={16} color="#C9A84C" />
            <span>مجلة مفتاح الجمال التحريرية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-ivory">
            أسرار العناية ودليل حماية البشرة
          </h1>
          <p className="text-sm text-muted-lux font-sans leading-relaxed">
            مقالات وأدلة عملية بقلم نخبة من خبيرات التجميل والتوثيق المخبري لحماية بشرتكِ من المنتجات المقلدة.
          </p>
        </div>

        {/* Featured Article Card */}
        {featuredPost && (
          <div className="p-2 sm:p-3 rounded-[2rem] bg-white/[0.03] border border-gold/30 shadow-2xl">
            <div className="rounded-[calc(2rem-0.5rem)] bg-surface grid grid-cols-1 lg:grid-cols-12 overflow-hidden items-center">
              <div className="lg:col-span-7 relative h-72 lg:h-[400px] w-full">
                <SmartImage
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface" />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold bg-gold/15 text-gold border border-gold/30">
                    مقال مميز
                  </span>
                  <span className="text-xs text-muted-lux font-sans">{featuredPost.readTimeMinutes} دقائق قراءة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-gold font-sans font-semibold">{featuredPost.author}</span>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 transition"
                  >
                    <span>قراءة المقال بالكامل</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="p-1.5 rounded-[1.75rem] bg-white/[0.03] border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-surface p-5 space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="h-44 w-full rounded-2xl overflow-hidden relative mb-4 bg-white/5">
                    <SmartImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-lux font-sans mb-2">
                    <span className="text-gold font-medium">{post.author}</span>
                    <span>{post.readTimeMinutes} دقائق قراءة</span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-ivory line-clamp-2 leading-relaxed">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-lux font-sans line-clamp-2 mt-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] text-muted-lux bg-white/5 px-2 py-0.5 rounded font-sans">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-sans font-bold text-champagne hover:text-gold transition"
                  >
                    قراءة ←
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

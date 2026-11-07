import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/core/db/store';
import { SubpageThemeWrapper } from '@/core/storefront/SubpageThemeWrapper';
import { BlogPostClientView } from './BlogPostClientView';

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
      <BlogPostClientView post={post} relatedPosts={relatedPosts} />
    </SubpageThemeWrapper>
  );
}

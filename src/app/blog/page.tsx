import React, { Suspense } from 'react';
import { getAllBlogPosts } from '@/core/db/store';
import { SubpageThemeWrapper } from '@/core/storefront/SubpageThemeWrapper';
import { BlogClientView } from './BlogClientView';

export const revalidate = 0;

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <SubpageThemeWrapper activeNav="blog" showNavHeader={true} showFooter={true} showSimulator={true}>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-24 text-center text-sm font-sans">
            جاري تحميل المجلة العلمية والمقالات...
          </div>
        }
      >
        <BlogClientView initialPosts={posts} />
      </Suspense>
    </SubpageThemeWrapper>
  );
}

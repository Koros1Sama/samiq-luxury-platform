import { NextResponse } from 'next/server';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPost,
  BlogPostRecord,
} from '@/core/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const post = getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: false, message: 'المقال غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, post });
  }

  const posts = getAllBlogPosts();
  return NextResponse.json({ success: true, count: posts.length, posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'عنوان المقال والمحتوى مطلوبان' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `post-${Date.now()}`;

    const newPost: BlogPostRecord = {
      id: body.id || `post-${Date.now()}`,
      tenantId: '11111111-1111-1111-1111-111111111111',
      slug,
      title: body.title,
      excerpt: body.excerpt || body.content.slice(0, 140) + '...',
      content: body.content,
      author: body.author || 'خبيرات مفتاح الجمال',
      coverImage: body.coverImage || '/media/hero/hero-noir.jpg',
      tags: Array.isArray(body.tags) ? body.tags : ['العناية بالبشرة', 'كشف الأصلي'],
      readTimeMinutes: Number(body.readTimeMinutes) || 4,
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      isFeatured: !!body.isFeatured,
    };

    const saved = saveBlogPost(newPost);
    return NextResponse.json({ success: true, post: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حفظ المقال' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id && !body.slug) {
      return NextResponse.json(
        { success: false, message: 'معرف المقال أو الرابط المختصر مطلوب' },
        { status: 400 }
      );
    }

    const posts = getAllBlogPosts();
    const existing = posts.find((p) => p.id === body.id || p.slug === body.slug);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'المقال غير موجود' },
        { status: 404 }
      );
    }

    const updated: BlogPostRecord = {
      ...existing,
      ...body,
      id: existing.id,
      slug: body.slug || existing.slug,
    };

    saveBlogPost(updated);
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل تعديل المقال' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('slug');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف المقال مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteBlogPost(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف المقال' },
      { status: 500 }
    );
  }
}

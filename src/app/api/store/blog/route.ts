import { NextResponse } from 'next/server';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  deleteBlogPost,
  BlogPostRecord,
} from '@/core/db/store';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeNumber,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = sanitizeText(searchParams.get('slug') || '', 100);

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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بنشر المقالات' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const title = sanitizeText(body.title, 150);
    const content = sanitizeText(body.content, 10_000);

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'عنوان المقال والمحتوى مطلوبان' },
        { status: 400 }
      );
    }

    const slug =
      sanitizeText(body.slug, 100) ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `post-${Date.now()}`;

    const newPost: BlogPostRecord = {
      id: sanitizeText(body.id, 50) || `post-${Date.now()}`,
      tenantId: '11111111-1111-1111-1111-111111111111',
      slug,
      title,
      excerpt: sanitizeText(body.excerpt, 300) || content.slice(0, 140) + '...',
      content,
      author: sanitizeText(body.author || 'خبيرات مفتاح الجمال', 100),
      coverImage: sanitizeText(body.coverImage || '/media/hero/hero-noir.jpg', 300),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: string) => sanitizeText(t, 50))
        : ['العناية بالبشرة', 'كشف الأصلي'],
      readTimeMinutes: sanitizeNumber(body.readTimeMinutes, 4, 1, 60),
      publishedAt: sanitizeText(body.publishedAt, 30) || new Date().toISOString().split('T')[0],
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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل المقالات' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const id = sanitizeText(body.id, 50);
    const slug = sanitizeText(body.slug, 100);

    if (!id && !slug) {
      return NextResponse.json(
        { success: false, message: 'معرف المقال أو الرابط المختصر مطلوب' },
        { status: 400 }
      );
    }

    const posts = getAllBlogPosts();
    const existing = posts.find((p) => p.id === id || p.slug === slug);
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
      slug: slug || existing.slug,
      title: body.title ? sanitizeText(body.title, 150) : existing.title,
      content: body.content ? sanitizeText(body.content, 10_000) : existing.content,
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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف المقال' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || searchParams.get('slug') || '', 100);
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

import { NextResponse } from 'next/server';
import {
  getAllCategories,
  saveCategory,
  deleteCategory,
  updateHomeSections,
  getDb,
  saveDb,
} from '@/core/db/store';
import { CategoryItem } from '@/themes/contract';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeMediaUrl,
  sanitizeText,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET() {
  const categories = getAllCategories();
  const db = getDb();
  return NextResponse.json({
    success: true,
    categories,
    homeSections: db.tenant?.homeSections || [],
  });
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بإضافة أو تعديل الأقسام' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    // Check if updating homepage sections
    if (body.action === 'update_sections' && Array.isArray(body.homeSections)) {
      updateHomeSections(body.homeSections);
      return NextResponse.json({ success: true, homeSections: body.homeSections });
    }

    const title = sanitizeText(body.title, 100);
    if (!title) {
      return NextResponse.json(
        { success: false, message: 'عنوان القسم مطلوب' },
        { status: 400 }
      );
    }

    const categoryId = sanitizeText(body.id, 50) || `cat-${Date.now()}`;
    const category: CategoryItem = {
      id: categoryId,
      title,
      subtitle: sanitizeText(body.subtitle, 200),
      brand: sanitizeText(body.brand || body.title, 100),
      image: sanitizeMediaUrl(body.image, '/media/products/serum-vitamin-c.jpg'),
      ctaText: sanitizeText(body.ctaText || body.title, 50),
      href: sanitizeText(body.href || `#${categoryId}`, 100),
      badge: sanitizeText(body.badge, 50),
    };

    const saved = saveCategory(category);
    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حفظ بيانات القسم' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل الأقسام' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    if (body.action === 'update_sections' && Array.isArray(body.homeSections)) {
      updateHomeSections(body.homeSections);
      return NextResponse.json({ success: true, homeSections: body.homeSections });
    }

    const id = sanitizeText(body.id, 50);
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف القسم مطلوب' },
        { status: 400 }
      );
    }

    const db = getDb();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: 'القسم غير موجود' },
        { status: 404 }
      );
    }

    const existing = db.categories[idx];
    const updated: CategoryItem = {
      ...existing,
      ...body,
      id: existing.id,
      title: body.title ? sanitizeText(body.title, 100) : existing.title,
      subtitle: body.subtitle !== undefined ? sanitizeText(body.subtitle, 200) : existing.subtitle,
      brand: body.brand !== undefined ? sanitizeText(body.brand, 100) : existing.brand,
      image: body.image !== undefined ? sanitizeMediaUrl(body.image, existing.image) : existing.image,
      ctaText: body.ctaText !== undefined ? sanitizeText(body.ctaText, 50) : existing.ctaText,
      href: body.href !== undefined ? sanitizeText(body.href, 100) : existing.href,
      badge: body.badge !== undefined ? sanitizeText(body.badge, 50) : existing.badge,
    };

    db.categories[idx] = updated;
    saveDb(db);

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل تعديل القسم' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف الأقسام' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || '', 50);
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف القسم مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteCategory(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف القسم' },
      { status: 500 }
    );
  }
}

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
    const body = await req.json();

    // Check if updating homepage sections
    if (body.action === 'update_sections' && Array.isArray(body.homeSections)) {
      updateHomeSections(body.homeSections);
      return NextResponse.json({ success: true, homeSections: body.homeSections });
    }

    if (!body.title) {
      return NextResponse.json(
        { success: false, message: 'عنوان القسم مطلوب' },
        { status: 400 }
      );
    }

    const categoryId = body.id || `cat-${Date.now()}`;
    const category: CategoryItem = {
      id: categoryId,
      title: body.title,
      subtitle: body.subtitle || '',
      brand: body.brand || body.title,
      image: body.image || '/media/products/serum-vitamin-c.jpg',
      ctaText: body.ctaText || body.title,
      href: body.href || `#${categoryId}`,
      badge: body.badge || '',
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
    const body = await req.json();

    if (body.action === 'update_sections' && Array.isArray(body.homeSections)) {
      updateHomeSections(body.homeSections);
      return NextResponse.json({ success: true, homeSections: body.homeSections });
    }

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'معرف القسم مطلوب' },
        { status: 400 }
      );
    }

    const db = getDb();
    const idx = db.categories.findIndex((c) => c.id === body.id);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
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

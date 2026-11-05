import { NextResponse } from 'next/server';
import { getAllProducts, saveProduct, deleteProduct, getDb, saveDb } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeWarehouse =
    searchParams.get('includeWarehouse') === '1' || searchParams.get('all') === '1';

  const allProducts = getAllProducts();
  const products = includeWarehouse
    ? allProducts
    : allProducts.filter(
        (p) =>
          p.visibilityStatus !== 'warehouse_only' &&
          p.visibilityStatus !== 'archived' &&
          p.isPublished !== false
      );

  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.brand || !body.prices) {
      return NextResponse.json(
        { success: false, message: 'بيانات المنتج غير مكتملة' },
        { status: 400 }
      );
    }

    const primaryImg = body.image || '/media/products/serum-vitamin-c.jpg';
    const galleryImgs = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : [primaryImg];

    const visibilityStatus = body.visibilityStatus || (body.isPublished === false ? 'warehouse_only' : 'published');
    const isPublished = visibilityStatus === 'published' || visibilityStatus === 'coming_soon';
    const stockQuantity = typeof body.stockQuantity === 'number' ? body.stockQuantity : 10;
    const lowStockThreshold = typeof body.lowStockThreshold === 'number' ? body.lowStockThreshold : 5;
    const inStock = typeof body.inStock === 'boolean' ? body.inStock : stockQuantity > 0;

    const product: ProductCardData = {
      id: body.id || `prod-${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle || '',
      brand: body.brand,
      categorySlug: body.categorySlug || 'skincare',
      image: primaryImg,
      images: galleryImgs,
      prices: body.prices,
      comparePrices: body.comparePrices,
      isAuthenticGuaranteed: body.isAuthenticGuaranteed !== false,
      isFeatured: !!body.isFeatured,
      badge: body.badge,
      variants: body.variants || [],
      description: body.description,
      tags: Array.isArray(body.tags) ? body.tags : [],
      skinTypes: Array.isArray(body.skinTypes) ? body.skinTypes : ['all'],
      aiCategoryConfidence: typeof body.aiCategoryConfidence === 'number' ? body.aiCategoryConfidence : 98,
      visibilityStatus,
      isPublished,
      stockQuantity,
      lowStockThreshold,
      inStock,
      sku: body.sku || `MFT-${Date.now().toString().slice(-5)}`,
      costPriceYer: typeof body.costPriceYer === 'number' ? body.costPriceYer : Math.round((body.prices?.YER || 10000) * 0.6),
      batchCode: body.batchCode || '2026-MFT',
      concentration: body.concentration || '',
      keyIngredients: Array.isArray(body.keyIngredients) ? body.keyIngredients : [],
      usageInstructions: body.usageInstructions || '',
    };

    const saved = saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حفظ المنتج' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مطلوب' }, { status: 400 });
    }

    const db = getDb();
    const productIdx = db.products.findIndex((p) => p.id === body.id);
    if (productIdx === -1) {
      return NextResponse.json({ success: false, message: 'المنتج غير موجود' }, { status: 404 });
    }

    const existing = db.products[productIdx];

    const visibilityStatus = body.visibilityStatus || existing.visibilityStatus || 'published';
    const isPublished =
      typeof body.isPublished === 'boolean'
        ? body.isPublished
        : visibilityStatus === 'published' || visibilityStatus === 'coming_soon';

    const stockQuantity =
      typeof body.stockQuantity === 'number' ? body.stockQuantity : existing.stockQuantity ?? 10;
    const inStock =
      typeof body.inStock === 'boolean'
        ? body.inStock
        : stockQuantity > 0;

    const updated: ProductCardData = {
      ...existing,
      ...body,
      id: existing.id, // preserve ID
      tags: Array.isArray(body.tags) ? body.tags : existing.tags || [],
      prices: body.prices || existing.prices,
      images: Array.isArray(body.images) ? body.images : existing.images || [existing.image],
      visibilityStatus,
      isPublished,
      stockQuantity,
      inStock,
    };

    db.products[productIdx] = updated;
    saveDb(db);

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل تحديث بيانات المنتج' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مفقود' }, { status: 400 });
    }
    const deleted = deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حذف المنتج' }, { status: 500 });
  }
}

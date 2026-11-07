import { NextResponse } from 'next/server';
import { getAllProducts, saveProduct, deleteProduct, getDb, saveDb } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeObjectDeep,
  sanitizeText,
  sanitizeNumber,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const auth = verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
  }

  const products = getAllProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بإضافة منتجات' }, { status: 401 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(`admin_prod:${ip}`, 60, 60_000)) {
      return NextResponse.json({ success: false, message: 'تجاوزت معدل الطلبات' }, { status: 429 });
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const title = sanitizeText(body.title, 150);
    const brand = sanitizeText(body.brand, 100);

    if (!title || !brand || !body.prices) {
      return NextResponse.json({ success: false, message: 'بيانات المنتج غير مكتملة' }, { status: 400 });
    }

    const primaryImg = sanitizeText(body.image || '/media/products/serum-vitamin-c.jpg', 300);
    const galleryImgs = Array.isArray(body.images) && body.images.length > 0
      ? body.images.map((img: string) => sanitizeText(img, 300))
      : [primaryImg];

    const visibilityStatus = body.visibilityStatus || 'published';
    const isPublished = visibilityStatus === 'published' || visibilityStatus === 'coming_soon';
    const stockQuantity = sanitizeNumber(body.stockQuantity, 10, 0, 100_000);
    const lowStockThreshold = sanitizeNumber(body.lowStockThreshold, 5, 0, 10_000);
    const inStock = typeof body.inStock === 'boolean' ? body.inStock : stockQuantity > 0;

    const priceYer = sanitizeNumber(body.prices?.YER, 10000, 0, 100_000_000);
    const priceSar = sanitizeNumber(body.prices?.SAR, Math.round(priceYer / 140), 0, 1_000_000);
    const priceUsd = sanitizeNumber(body.prices?.USD, Math.round(priceYer / 530), 0, 500_000);

    const id = sanitizeText(body.id, 100) || `prod-${Date.now()}`;
    const slug =
      sanitizeText(body.slug, 120) ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-|-$/g, '') ||
      id;

    const product: ProductCardData = {
      id,
      slug,
      title,
      subtitle: sanitizeText(body.subtitle, 200),
      brand,
      categorySlug: sanitizeText(body.categorySlug || 'skincare', 80),
      image: primaryImg,
      images: galleryImgs,
      prices: {
        YER: priceYer,
        SAR: priceSar,
        USD: priceUsd,
      },
      comparePrices: body.comparePrices ? {
        YER: sanitizeNumber(body.comparePrices.YER, 0, 0, 100_000_000),
        SAR: sanitizeNumber(body.comparePrices.SAR, 0, 0, 1_000_000),
        USD: sanitizeNumber(body.comparePrices.USD, 0, 0, 500_000),
      } : undefined,
      isAuthenticGuaranteed: body.isAuthenticGuaranteed !== false,
      isFeatured: !!body.isFeatured,
      badge: sanitizeText(body.badge, 50),
      variants: Array.isArray(body.variants) ? body.variants : [],
      description: sanitizeText(body.description, 2000),
      tags: Array.isArray(body.tags) ? body.tags.map((t: string) => sanitizeText(t, 50)) : [],
      skinTypes: Array.isArray(body.skinTypes) ? body.skinTypes : ['all'],
      aiCategoryConfidence: sanitizeNumber(body.aiCategoryConfidence, 98, 0, 100),
      visibilityStatus,
      isPublished,
      stockQuantity,
      lowStockThreshold,
      inStock,
      sku: sanitizeText(body.sku, 50) || `MFT-${Date.now().toString().slice(-5)}`,
      costPriceYer: sanitizeNumber(body.costPriceYer, Math.round(priceYer * 0.6), 0, 100_000_000),
      batchCode: sanitizeText(body.batchCode || '2026-MFT', 50),
      concentration: sanitizeText(body.concentration, 80),
      keyIngredients: Array.isArray(body.keyIngredients)
        ? body.keyIngredients.map((ing: string) => sanitizeText(ing, 80))
        : [],
      usageInstructions: sanitizeText(body.usageInstructions, 1000),
    };

    const saved = saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ المنتج' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بتعديل منتجات' }, { status: 401 });
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

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

    const stockQuantity = typeof body.stockQuantity === 'number'
      ? sanitizeNumber(body.stockQuantity, existing.stockQuantity ?? 10, 0, 100_000)
      : existing.stockQuantity ?? 10;

    const inStock = typeof body.inStock === 'boolean' ? body.inStock : stockQuantity > 0;

    let slug = body.slug ? sanitizeText(body.slug, 120) : existing.slug;
    if (!slug && (body.title || existing.title)) {
      slug = (body.title || existing.title)
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/^-|-$/g, '') || existing.id;
    }

    const updated: ProductCardData = {
      ...existing,
      ...body,
      id: existing.id,
      slug: slug || existing.id,
      title: body.title ? sanitizeText(body.title, 150) : existing.title,
      brand: body.brand ? sanitizeText(body.brand, 100) : existing.brand,
      stockQuantity,
      inStock,
      visibilityStatus,
      isPublished,
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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بحذف منتجات' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || '', 100);
    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مفقود' }, { status: 400 });
    }
    const deleted = deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حذف المنتج' }, { status: 500 });
  }
}

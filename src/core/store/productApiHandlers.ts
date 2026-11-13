import { NextResponse } from 'next/server';
import { getAllProducts, getDb, getPublishedProducts, saveDb, saveProduct, deleteProduct } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';
import {
  checkRateLimit,
  getClientIp,
  sanitizeMediaUrl,
  sanitizeNumber,
  sanitizeObjectDeep,
  sanitizeText,
  verifyAdminAuth,
} from '@/core/security/guard';

const DEFAULT_PRODUCT_IMAGE = '/media/products/serum-vitamin-c.jpg';

export type PublicProductCardData = Omit<ProductCardData, 'costPriceYer'>;

/**
 * Strips sensitive wholesale/cost fields before returning products on public routes.
 */
export function toPublicProduct(product: ProductCardData): PublicProductCardData {
  const { costPriceYer: _costPriceYer, ...publicProduct } = product;
  return publicProduct;
}

/**
 * Maps a list of products into public storefront payloads without `costPriceYer`.
 */
export function toPublicProducts(products: ProductCardData[]): PublicProductCardData[] {
  return products.map(toPublicProduct);
}

function buildSlug(rawSlug: unknown, title: string, fallbackId: string): string {
  const cleaned = sanitizeText(rawSlug, 120);
  if (cleaned) return cleaned;
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '') || fallbackId
  );
}

function sanitizeGallery(rawImages: unknown, primaryImg: string): string[] {
  if (!Array.isArray(rawImages) || rawImages.length === 0) return [primaryImg];
  const cleaned = rawImages
    .map((img) => sanitizeMediaUrl(img))
    .filter((url): url is string => url.length > 0);
  return cleaned.length > 0 ? cleaned : [primaryImg];
}

function sanitizeStringArray(rawList: unknown, maxItemLen: number, fallback: string[]): string[] {
  if (!Array.isArray(rawList)) return fallback;
  return rawList.map((item) => sanitizeText(item, maxItemLen)).filter(Boolean);
}

const VALID_SKIN_TYPES = new Set(['oily', 'dry', 'combination', 'sensitive', 'all']);

function sanitizeSkinTypes(rawList: unknown): ProductCardData['skinTypes'] {
  if (!Array.isArray(rawList)) return ['all'];
  const cleaned = rawList
    .map((item) => sanitizeText(item, 40))
    .filter((item): item is NonNullable<ProductCardData['skinTypes']>[number] =>
      VALID_SKIN_TYPES.has(item)
    );
  return cleaned.length > 0 ? cleaned : ['all'];
}

/**
 * Shared GET handler for store & admin product listings.
 */
export function handleGetProducts(req: Request, adminOnly = false): NextResponse {
  const auth = verifyAdminAuth(req);
  if (adminOnly) {
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }
    const products = getAllProducts();
    return NextResponse.json({ success: true, count: products.length, products });
  }

  const { searchParams } = new URL(req.url);
  const includeWarehouse =
    auth.authorized &&
    (searchParams.get('includeWarehouse') === '1' || searchParams.get('all') === '1');

  const products = includeWarehouse
    ? getAllProducts()
    : toPublicProducts(getPublishedProducts());

  return NextResponse.json({ success: true, count: products.length, products });
}

/**
 * Shared POST handler for creating/saving a catalog product.
 */
export async function handleCreateProduct(
  req: Request,
  rateKeyPrefix: string
): Promise<NextResponse> {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بإضافة منتجات' }, { status: 401 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(`${rateKeyPrefix}:${ip}`, 60, 60_000)) {
      return NextResponse.json({ success: false, message: 'تجاوزت معدل الطلبات المسموح' }, { status: 429 });
    }

    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);
    const title = sanitizeText(body.title, 150);
    const brand = sanitizeText(body.brand, 100);
    const rawPrices = body.prices as Record<string, unknown> | undefined;

    if (!title || !brand || !rawPrices) {
      return NextResponse.json({ success: false, message: 'بيانات المنتج غير مكتملة' }, { status: 400 });
    }

    const primaryImg = sanitizeMediaUrl(body.image, DEFAULT_PRODUCT_IMAGE);
    const galleryImgs = sanitizeGallery(body.images, primaryImg);
    const visibilityStatus =
      (typeof body.visibilityStatus === 'string' && body.visibilityStatus) ||
      (body.isPublished === false ? 'warehouse_only' : 'published');
    const isPublished = visibilityStatus === 'published' || visibilityStatus === 'coming_soon';
    const stockQuantity = sanitizeNumber(body.stockQuantity, 10, 0, 100_000);
    const lowStockThreshold = sanitizeNumber(body.lowStockThreshold, 5, 0, 10_000);
    const inStock = typeof body.inStock === 'boolean' ? body.inStock : stockQuantity > 0;

    const priceYer = sanitizeNumber(rawPrices.YER, 10_000, 0, 100_000_000);
    const priceSar = sanitizeNumber(rawPrices.SAR, Math.round(priceYer / 140), 0, 1_000_000);
    const priceUsd = sanitizeNumber(rawPrices.USD, Math.round(priceYer / 530), 0, 500_000);
    const rawCompare = body.comparePrices as Record<string, unknown> | undefined;

    const id = sanitizeText(body.id, 100) || `prod-${Date.now()}`;
    const slug = buildSlug(body.slug, title, id);

    const product: ProductCardData = {
      id,
      slug,
      title,
      subtitle: sanitizeText(body.subtitle, 200),
      brand,
      categorySlug: sanitizeText(body.categorySlug || 'skincare', 80),
      image: primaryImg,
      images: galleryImgs,
      prices: { YER: priceYer, SAR: priceSar, USD: priceUsd },
      comparePrices: rawCompare
        ? {
            YER: sanitizeNumber(rawCompare.YER, 0, 0, 100_000_000),
            SAR: sanitizeNumber(rawCompare.SAR, 0, 0, 1_000_000),
            USD: sanitizeNumber(rawCompare.USD, 0, 0, 500_000),
          }
        : undefined,
      isAuthenticGuaranteed: body.isAuthenticGuaranteed !== false,
      isFeatured: !!body.isFeatured,
      badge: sanitizeText(body.badge, 50),
      variants: Array.isArray(body.variants) ? (body.variants as ProductCardData['variants']) : [],
      description: sanitizeText(body.description, 2000),
      tags: sanitizeStringArray(body.tags, 50, []),
      skinTypes: sanitizeSkinTypes(body.skinTypes),
      aiCategoryConfidence: sanitizeNumber(body.aiCategoryConfidence, 98, 0, 100),
      visibilityStatus: visibilityStatus as ProductCardData['visibilityStatus'],
      isPublished,
      stockQuantity,
      lowStockThreshold,
      inStock,
      sku: sanitizeText(body.sku, 50) || `MFT-${Date.now().toString().slice(-5)}`,
      costPriceYer: sanitizeNumber(body.costPriceYer, Math.round(priceYer * 0.6), 0, 100_000_000),
      batchCode: sanitizeText(body.batchCode || '2026-MFT', 50),
      concentration: sanitizeText(body.concentration, 80),
      keyIngredients: sanitizeStringArray(body.keyIngredients, 80, []),
      usageInstructions: sanitizeText(body.usageInstructions, 1000),
    };

    const saved = saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ المنتج' }, { status: 500 });
  }
}

/**
 * Shared PUT handler for partial or full product updates.
 */
export async function handleUpdateProduct(req: Request): Promise<NextResponse> {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بتعديل بيانات المنتج' }, { status: 401 });
    }

    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);
    const targetId = sanitizeText(body.id, 100);
    if (!targetId) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مطلوب' }, { status: 400 });
    }

    const db = getDb();
    const productIdx = db.products.findIndex((p) => p.id === targetId);
    if (productIdx === -1) {
      return NextResponse.json({ success: false, message: 'المنتج غير موجود' }, { status: 404 });
    }

    const existing = db.products[productIdx];
    const nextTitle = body.title !== undefined ? sanitizeText(body.title, 150) || existing.title : existing.title;
    const nextImage =
      body.image !== undefined ? sanitizeMediaUrl(body.image, existing.image || DEFAULT_PRODUCT_IMAGE) : existing.image;
    const nextImages =
      body.images !== undefined ? sanitizeGallery(body.images, nextImage) : existing.images;

    const visibilityStatus =
      (typeof body.visibilityStatus === 'string' && body.visibilityStatus) ||
      existing.visibilityStatus ||
      'published';
    const isPublished =
      typeof body.isPublished === 'boolean'
        ? body.isPublished
        : visibilityStatus === 'published' || visibilityStatus === 'coming_soon';
    const stockQuantity =
      typeof body.stockQuantity === 'number'
        ? sanitizeNumber(body.stockQuantity, existing.stockQuantity ?? 10, 0, 100_000)
        : existing.stockQuantity ?? 10;
    const inStock = typeof body.inStock === 'boolean' ? body.inStock : stockQuantity > 0;
    const slug = body.slug !== undefined ? buildSlug(body.slug, nextTitle, existing.id) : existing.slug || buildSlug('', nextTitle, existing.id);

    const updated: ProductCardData = {
      ...existing,
      ...(body as Partial<ProductCardData>),
      id: existing.id,
      slug,
      title: nextTitle,
      brand: body.brand !== undefined ? sanitizeText(body.brand, 100) || existing.brand : existing.brand,
      image: nextImage,
      images: nextImages,
      visibilityStatus: visibilityStatus as ProductCardData['visibilityStatus'],
      isPublished,
      stockQuantity,
      inStock,
    };

    db.products[productIdx] = updated;
    saveDb(db);

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'فشل تحديث بيانات المنتج' }, { status: 500 });
  }
}

/**
 * Shared DELETE handler for removing a product by query `id`.
 */
export async function handleDeleteProduct(req: Request): Promise<NextResponse> {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بحذف المنتج' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || '', 100);
    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مفقود' }, { status: 400 });
    }

    const deleted = deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, message: 'فشل حذف المنتج' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  CouponRecord,
  deleteCoupon,
  getAllCoupons,
  saveCoupon,
} from '@/core/db/store';
import {
  checkRateLimit,
  getClientIp,
  sanitizeNumber,
  sanitizeObjectDeep,
  sanitizeText,
  verifyAdminAuth,
} from '@/core/security/guard';

/**
 * Creates a coupon from an authenticated admin request payload.
 */
export function handleAdminCreateCoupon(
  req: Request,
  body: Record<string, unknown>,
  rateKeyPrefix: string
): NextResponse {
  const auth = verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, message: 'غير مصرح لك بإضافة كوبونات' }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(`${rateKeyPrefix}:${ip}`, 30, 60_000)) {
    return NextResponse.json({ success: false, message: 'تجاوزت الحد المسموح من الطلبات' }, { status: 429 });
  }

  const code = sanitizeText(body.code || '', 30).toUpperCase();
  if (!code) {
    return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
  }

  const newCoupon: CouponRecord = {
    code,
    discountPercentage: sanitizeNumber(body.discountPercentage, 0, 0, 100),
    fixedDiscountYer: body.fixedDiscountYer ? sanitizeNumber(body.fixedDiscountYer, 0, 0, 10_000_000) : undefined,
    minOrderAmountYer: body.minOrderAmountYer ? sanitizeNumber(body.minOrderAmountYer, 0, 0, 10_000_000) : undefined,
    isActive: body.isActive !== false,
    usageCount: 0,
  };

  const saved = saveCoupon(newCoupon);
  return NextResponse.json({ success: true, coupon: saved });
}

/**
 * Shared PUT handler for updating an existing coupon record.
 */
export async function handleUpdateCoupon(req: Request): Promise<NextResponse> {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بتعديل الكوبونات' }, { status: 401 });
    }

    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);
    const code = sanitizeText(body.code || '', 30).toUpperCase();
    if (!code) {
      return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const existing = getAllCoupons().find((c) => c.code.toUpperCase() === code);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'الكوبون غير موجود' }, { status: 404 });
    }

    const updated: CouponRecord = {
      ...existing,
      ...(body as Partial<CouponRecord>),
      code: existing.code,
      discountPercentage:
        body.discountPercentage !== undefined
          ? sanitizeNumber(body.discountPercentage, existing.discountPercentage, 0, 100)
          : existing.discountPercentage,
      fixedDiscountYer:
        body.fixedDiscountYer !== undefined
          ? (body.fixedDiscountYer ? sanitizeNumber(body.fixedDiscountYer, 0, 0, 10_000_000) : undefined)
          : existing.fixedDiscountYer,
      minOrderAmountYer:
        body.minOrderAmountYer !== undefined
          ? (body.minOrderAmountYer ? sanitizeNumber(body.minOrderAmountYer, 0, 0, 10_000_000) : undefined)
          : existing.minOrderAmountYer,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
    };

    saveCoupon(updated);
    return NextResponse.json({ success: true, coupon: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'فشل تعديل الكوبون' }, { status: 500 });
  }
}

/**
 * Shared DELETE handler for deleting a coupon by query `code`.
 */
export async function handleDeleteCoupon(req: Request): Promise<NextResponse> {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بحذف الكوبونات' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const code = sanitizeText(searchParams.get('code') || '', 30);
    if (!code) {
      return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const deleted = deleteCoupon(code);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, message: 'فشل حذف الكوبون' }, { status: 500 });
  }
}

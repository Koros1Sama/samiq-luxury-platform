import { NextResponse } from 'next/server';
import {
  validateCoupon,
  getAllCoupons,
  saveCoupon,
  deleteCoupon,
  CouponRecord,
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
  const auth = verifyAdminAuth(req);
  const allCoupons = getAllCoupons();

  // If public storefront, only return active coupon codes
  if (!auth.authorized) {
    const publicCoupons = allCoupons
      .filter((c) => c.isActive)
      .map((c) => ({
        code: c.code,
        discountPercentage: c.discountPercentage,
        fixedDiscountYer: c.fixedDiscountYer,
        minOrderAmountYer: c.minOrderAmountYer,
      }));
    return NextResponse.json({ success: true, count: publicCoupons.length, coupons: publicCoupons });
  }

  return NextResponse.json({ success: true, count: allCoupons.length, coupons: allCoupons });
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    // 1. Admin coupon creation
    if (body.action === 'create' || body.action === 'add') {
      const auth = verifyAdminAuth(req);
      if (!auth.authorized) {
        return NextResponse.json(
          { success: false, message: 'غير مصرح لك بإضافة كوبونات' },
          { status: 401 }
        );
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

    // 2. Public Coupon Validation
    const ip = getClientIp(req);
    if (!checkRateLimit(`coupon_validate:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { isValid: false, message: 'تجاوزت عدد محاولات فحص الكوبونات، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const code = sanitizeText(body.code || '', 30);
    const subtotalYer = sanitizeNumber(body.subtotalYer, 0, 0, 500_000_000);

    if (!code) {
      return NextResponse.json(
        { isValid: false, message: 'يرجى إدخال كود الخصم' },
        { status: 400 }
      );
    }

    const result = validateCoupon(code, subtotalYer);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { isValid: false, message: 'خطأ في معالجة الكوبون' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل الكوبونات' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const code = sanitizeText(body.code || '', 30).toUpperCase();

    if (!code) {
      return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const coupons = getAllCoupons();
    const existing = coupons.find((c) => c.code.toUpperCase() === code);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'الكوبون غير موجود' }, { status: 404 });
    }

    const updated: CouponRecord = {
      ...existing,
      ...body,
      code: existing.code,
      discountPercentage: body.discountPercentage !== undefined
        ? sanitizeNumber(body.discountPercentage, existing.discountPercentage, 0, 100)
        : existing.discountPercentage,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
    };

    saveCoupon(updated);
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل تعديل الكوبون' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف الكوبونات' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const code = sanitizeText(searchParams.get('code') || '', 30);
    if (!code) {
      return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const deleted = deleteCoupon(code);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حذف الكوبون' }, { status: 500 });
  }
}

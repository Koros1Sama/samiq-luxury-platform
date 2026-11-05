import { NextResponse } from 'next/server';
import {
  getAllCoupons,
  saveCoupon,
  deleteCoupon,
  CouponRecord,
} from '@/core/db/store';
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

  const coupons = getAllCoupons();
  return NextResponse.json({ success: true, count: coupons.length, coupons });
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(`admin_coupon:${ip}`, 30, 60_000)) {
      return NextResponse.json({ success: false, message: 'تجاوزت الحد المسموح من الطلبات' }, { status: 429 });
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const code = sanitizeText(body.code || '', 30).toUpperCase();
    if (!code) {
      return NextResponse.json({ success: false, message: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    const discountPercentage = sanitizeNumber(body.discountPercentage, 0, 0, 100);
    const fixedDiscountYer = body.fixedDiscountYer ? sanitizeNumber(body.fixedDiscountYer, 0, 0, 10_000_000) : undefined;
    const minOrderAmountYer = body.minOrderAmountYer ? sanitizeNumber(body.minOrderAmountYer, 0, 0, 10_000_000) : undefined;

    const newCoupon: CouponRecord = {
      code,
      discountPercentage,
      fixedDiscountYer,
      minOrderAmountYer,
      isActive: body.isActive !== false,
      usageCount: 0,
    };

    const saved = saveCoupon(newCoupon);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في حفظ الكوبون' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
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
      return NextResponse.json({ success: false, message: 'غير مصرح' }, { status: 401 });
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

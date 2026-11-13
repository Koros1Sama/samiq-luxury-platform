import { NextResponse } from 'next/server';
import { getAllCoupons, validateCoupon } from '@/core/db/store';
import { ThemeCurrencyCode } from '@/themes/contract';
import {
  checkRateLimit,
  getClientIp,
  sanitizeNumber,
  sanitizeObjectDeep,
  sanitizeText,
  verifyAdminAuth,
} from '@/core/security/guard';
import {
  handleAdminCreateCoupon,
  handleDeleteCoupon,
  handleUpdateCoupon,
} from '@/core/store/couponApiHandlers';

export async function GET(req: Request) {
  const auth = verifyAdminAuth(req);
  const allCoupons = getAllCoupons();

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
    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);

    if (body.action === 'create' || body.action === 'add') {
      return handleAdminCreateCoupon(req, body, 'store_coupon');
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(`coupon_validate:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { isValid: false, message: 'تجاوزت عدد محاولات فحص الكوبونات، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const code = sanitizeText(body.code || '', 30);
    const subtotal = sanitizeNumber(body.subtotal ?? body.subtotalYer, 0, 0, 500_000_000);
    const rawCur = typeof body.currency === 'string' ? body.currency.toUpperCase() : '';
    const currency: ThemeCurrencyCode | undefined =
      rawCur === 'YER' || rawCur === 'SAR' || rawCur === 'USD' ? rawCur : undefined;

    if (!code) {
      return NextResponse.json({ isValid: false, message: 'يرجى إدخال كود الخصم' }, { status: 400 });
    }

    return NextResponse.json(validateCoupon(code, subtotal, currency));
  } catch {
    return NextResponse.json({ isValid: false, message: 'خطأ في معالجة الكوبون' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return handleUpdateCoupon(req);
}

export async function DELETE(req: Request) {
  return handleDeleteCoupon(req);
}

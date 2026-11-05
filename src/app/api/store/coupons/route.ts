import { NextResponse } from 'next/server';
import {
  validateCoupon,
  getAllCoupons,
  saveCoupon,
  deleteCoupon,
  CouponRecord,
} from '@/core/db/store';

export async function GET() {
  const coupons = getAllCoupons();
  return NextResponse.json({ success: true, count: coupons.length, coupons });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'create' || body.action === 'add') {
      const code = (body.code || '').trim().toUpperCase();
      if (!code) {
        return NextResponse.json(
          { success: false, message: 'كود الكوبون مطلوب' },
          { status: 400 }
        );
      }

      const newCoupon: CouponRecord = {
        code,
        discountPercentage: Number(body.discountPercentage) || 0,
        fixedDiscountYer: body.fixedDiscountYer ? Number(body.fixedDiscountYer) : undefined,
        minOrderAmountYer: body.minOrderAmountYer ? Number(body.minOrderAmountYer) : undefined,
        isActive: body.isActive !== false,
        usageCount: 0,
      };

      const saved = saveCoupon(newCoupon);
      return NextResponse.json({ success: true, coupon: saved });
    }

    const { code, subtotalYer } = body;
    if (!code) {
      return NextResponse.json(
        { isValid: false, message: 'يرجى إدخال كود الخصم' },
        { status: 400 }
      );
    }
    const result = validateCoupon(code, Number(subtotalYer) || 0);
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
    const body = await req.json();
    const code = (body.code || '').trim().toUpperCase();
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'كود الكوبون مطلوب' },
        { status: 400 }
      );
    }

    const coupons = getAllCoupons();
    const existing = coupons.find((c) => c.code.toUpperCase() === code);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'الكوبون غير موجود' },
        { status: 404 }
      );
    }

    const updated: CouponRecord = {
      ...existing,
      ...body,
      code: existing.code,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : existing.isActive,
    };

    saveCoupon(updated);
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل تعديل الكوبون' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json(
        { success: false, message: 'كود الكوبون مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteCoupon(code);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف الكوبون' },
      { status: 500 }
    );
  }
}

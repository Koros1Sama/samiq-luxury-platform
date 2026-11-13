import { NextResponse } from 'next/server';
import { getAllCoupons } from '@/core/db/store';
import { sanitizeObjectDeep, verifyAdminAuth } from '@/core/security/guard';
import {
  handleAdminCreateCoupon,
  handleDeleteCoupon,
  handleUpdateCoupon,
} from '@/core/store/couponApiHandlers';

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
    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);
    return handleAdminCreateCoupon(req, body, 'admin_coupon');
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في حفظ الكوبون' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return handleUpdateCoupon(req);
}

export async function DELETE(req: Request) {
  return handleDeleteCoupon(req);
}

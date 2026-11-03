import { NextResponse } from 'next/server';
import { validateCoupon } from '@/core/db/store';

export async function POST(req: Request) {
  try {
    const { code, subtotalYer } = await req.json();
    if (!code) {
      return NextResponse.json({ isValid: false, message: 'يرجى إدخال كود الخصم' }, { status: 400 });
    }
    const result = validateCoupon(code, Number(subtotalYer) || 0);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ isValid: false, message: 'خطأ في معالجة الكوبون' }, { status: 500 });
  }
}

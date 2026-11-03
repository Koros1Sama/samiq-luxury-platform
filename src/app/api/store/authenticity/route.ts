import { NextResponse } from 'next/server';
import { verifyBatchCode, getAuthenticityGuide } from '@/core/db/store';

export async function POST(req: Request) {
  try {
    const { batchCode, productId } = await req.json();

    if (batchCode) {
      const verification = verifyBatchCode(batchCode);
      return NextResponse.json({ success: true, verification });
    }

    if (productId) {
      const guide = getAuthenticityGuide(productId);
      return NextResponse.json({ success: true, guide });
    }

    return NextResponse.json({ success: false, message: 'يرجى تقديم رقم الدفعة أو معرف المنتج' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في التحقق من الأصالة' }, { status: 500 });
  }
}

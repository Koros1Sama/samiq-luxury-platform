import { NextResponse } from 'next/server';
import { getProductReviews, addReview } from '@/core/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId') || 'prod-1';
  const reviews = getProductReviews(productId);
  return NextResponse.json({ success: true, reviews });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.productId || !body.customerName || !body.comment) {
      return NextResponse.json({ success: false, message: 'بيانات التقييم غير مكتملة' }, { status: 400 });
    }

    const review = addReview({
      tenantId: '11111111-1111-1111-1111-111111111111',
      productId: body.productId,
      customerName: body.customerName,
      rating: Math.max(1, Math.min(5, Number(body.rating) || 5)),
      comment: body.comment,
      isVerifiedPurchase: !!body.batchCodeVerified,
      batchCodeVerified: body.batchCodeVerified,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حفظ التقييم' }, { status: 500 });
  }
}

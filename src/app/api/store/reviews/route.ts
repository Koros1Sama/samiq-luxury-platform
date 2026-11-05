import { NextResponse } from 'next/server';
import { getProductReviews, addReview } from '@/core/db/store';
import {
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeNumber,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = sanitizeText(searchParams.get('productId') || 'prod-1', 100);
  const reviews = getProductReviews(productId);
  return NextResponse.json({ success: true, reviews });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`reviews_post:${ip}`, 10, 300_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من التقييمات، يرجى الانتظار قليلاً' },
        { status: 429 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const productId = sanitizeText(body.productId, 100);
    const customerName = sanitizeText(body.customerName, 100);
    const comment = sanitizeText(body.comment, 1000);
    const batchCodeVerified = sanitizeText(body.batchCodeVerified, 50);

    if (!productId || !customerName || !comment) {
      return NextResponse.json(
        { success: false, message: 'بيانات التقييم غير مكتملة' },
        { status: 400 }
      );
    }

    const rating = sanitizeNumber(body.rating, 5, 1, 5);

    const review = addReview({
      tenantId: '11111111-1111-1111-1111-111111111111',
      productId,
      customerName,
      rating,
      comment,
      isVerifiedPurchase: !!batchCodeVerified,
      batchCodeVerified: batchCodeVerified || undefined,
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حفظ التقييم' }, { status: 500 });
  }
}

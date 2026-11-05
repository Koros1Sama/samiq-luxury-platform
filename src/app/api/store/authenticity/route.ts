import { NextResponse } from 'next/server';
import {
  verifyBatchCode,
  getAuthenticityGuide,
  getAllAuthenticityGuides,
  saveAuthenticityGuide,
  deleteAuthenticityGuide,
} from '@/core/db/store';
import { AuthenticityComparisonData } from '@/modules/blocks/types';

export async function GET() {
  const guides = getAllAuthenticityGuides();
  return NextResponse.json({ success: true, guides });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if adding/updating a verified batch guide
    if (body.action === 'add_batch' || body.action === 'create_guide') {
      const batchCode = (body.batchCode || '').trim().toUpperCase();
      if (!batchCode) {
        return NextResponse.json(
          { success: false, message: 'رقم التشغيلة / الباتش كود مطلوب' },
          { status: 400 }
        );
      }

      const guide: AuthenticityComparisonData = {
        productId: body.productId || `prod-batch-${batchCode.toLowerCase()}`,
        productTitle: body.productTitle || `مستحضر تشغيلة ${batchCode}`,
        brand: body.brand || 'سيرومات نقية',
        original: {
          title: body.originalTitle || 'الأصلي المعتمد',
          image: body.image || '/media/products/serum-vitamin-c.jpg',
          batchCode,
          formulaNotes: body.formulaNotes || 'قوام نقي متجانس مطابق لمواصفات المختبر الأصلي',
          packagingNotes: body.packagingNotes || 'زجاج معتم عازل للضوء مع رقم الباتش محفور بالليزر',
        },
        counterfeit: {
          title: 'التقليد المغشوش',
          image: body.image || '/media/products/serum-vitamin-c.jpg',
          batchCode: 'بدون كود أو مطبوع بحبر باهت',
          formulaNotes: 'سائل معكر سريع التأكسد يسبب تهيج الجلد',
          packagingNotes: 'عبوة رديئة ومطاط يسرب الهواء',
        },
        checklist: Array.isArray(body.checklist)
          ? body.checklist
          : [
              {
                title: 'رقم التشغيلة (Batch Code)',
                originalFeature: `محفور بدقة في أسفل الزجاجة ومطابق للكرتون الخارجي (${batchCode}).`,
                fakeRisk: 'مفقود نهائياً أو ملصق ورقي باهت يمكن تقشيره.',
              },
              {
                title: 'نقاء وتجانس التركيبة',
                originalFeature: 'قوام متجانس بلون نقي طبيعي سريع الامتصاص.',
                fakeRisk: 'رغوة بيضاء عائمة وتعكر واضح.',
              },
            ],
      };

      saveAuthenticityGuide(batchCode, guide);
      return NextResponse.json({ success: true, guide });
    }

    const { batchCode, productId } = body;

    if (batchCode) {
      const verification = verifyBatchCode(batchCode);
      return NextResponse.json({ success: true, verification });
    }

    if (productId) {
      const guide = getAuthenticityGuide(productId);
      return NextResponse.json({ success: true, guide });
    }

    return NextResponse.json(
      { success: false, message: 'يرجى تقديم رقم الدفعة أو معرف المنتج' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'خطأ في التحقق من الأصالة' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || searchParams.get('batchCode') || '';
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'معرف التشغيلة مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteAuthenticityGuide(key);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف التشغيلة' },
      { status: 500 }
    );
  }
}

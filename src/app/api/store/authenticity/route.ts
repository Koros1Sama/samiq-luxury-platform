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

    // Check if adding/updating an authenticity guide
    if (body.action === 'add_batch' || body.action === 'create_guide') {
      const productCode = (body.batchCode || body.productId || body.productTitle || '').trim();
      if (!productCode) {
        return NextResponse.json(
          { success: false, message: 'اسم أو معرف المستحضر مطلوب' },
          { status: 400 }
        );
      }

      const guide: AuthenticityComparisonData = {
        productId: body.productId || `prod-auth-${productCode.toLowerCase().replace(/\s+/g, '-')}`,
        productTitle: body.productTitle || `مستحضر ${productCode}`,
        brand: body.brand || 'سيرومات نقية',
        original: {
          title: body.originalTitle || 'الأصلي المعتمد',
          image: body.image || '/media/products/serum-vitamin-c.jpg',
          batchCode: 'مصرح ومطابق لمعايير الهيئة',
          formulaNotes: body.formulaNotes || 'قوام نقي متجانس مطابق لمواصفات المختبر الأصلي ومعايير الهيئة العليا للأدوية',
          packagingNotes: body.packagingNotes || 'زجاج معتم عازل للضوء مع ختم الأصالة والباركود المعتمد',
        },
        counterfeit: {
          title: 'التقليد المغشوش',
          image: body.image || '/media/products/serum-vitamin-c.jpg',
          batchCode: 'بدون ختم اعتماد أو مطبوع بحبر باهت',
          formulaNotes: 'سائل معكر سريع التأكسد يسبب تهيج الجلد',
          packagingNotes: 'عبوة رديئة ومطاط يسرب الهواء',
        },
        checklist: Array.isArray(body.checklist)
          ? body.checklist
          : [
              {
                title: 'ختم وتصريح الهيئة العليا للأدوية والمستلزمات الطبية',
                originalFeature: `مصرح ومطابق للمواصفات الرسمية مع ختم الأصالة والباركود المعتمد.`,
                fakeRisk: 'مفقود نهائياً أو ملصق تجاري باهت يمكن تقشيره.',
              },
              {
                title: 'نقاء وتجانس التركيبة',
                originalFeature: 'قوام متجانس بلون نقي طبيعي سريع الامتصاص وخالٍ من الروائح الكيميائية.',
                fakeRisk: 'رغوة بيضاء عائمة وتعكر واضح.',
              },
            ],
      };

      saveAuthenticityGuide(productCode, guide);
      return NextResponse.json({ success: true, guide });
    }

    const query = (body.query || body.productName || body.batchCode || body.productId || '').trim();

    if (query) {
      const verification = verifyBatchCode(query);
      return NextResponse.json({ success: true, verification });
    }

    if (body.productId) {
      const guide = getAuthenticityGuide(body.productId);
      return NextResponse.json({ success: true, guide });
    }

    return NextResponse.json(
      { success: false, message: 'يرجى كتابة اسم المستحضر للتحقق' },
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
    const key = searchParams.get('key') || searchParams.get('productId') || searchParams.get('batchCode') || '';
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'معرف المستحضر مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteAuthenticityGuide(key);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف المستحضر' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import {
  verifyBatchCode,
  getAuthenticityGuide,
  getAllAuthenticityGuides,
  saveAuthenticityGuide,
  deleteAuthenticityGuide,
} from '@/core/db/store';
import { AuthenticityComparisonData } from '@/modules/blocks/types';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET() {
  const guides = getAllAuthenticityGuides();
  return NextResponse.json({ success: true, guides });
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    // 1. Admin add/update an authenticity guide
    if (body.action === 'add_batch' || body.action === 'create_guide') {
      const auth = verifyAdminAuth(req);
      if (!auth.authorized) {
        return NextResponse.json(
          { success: false, message: 'غير مصرح لك بإضافة أدلة الفحص' },
          { status: 401 }
        );
      }

      const productCode = sanitizeText(body.batchCode || body.productId || body.productTitle || '', 100);
      if (!productCode) {
        return NextResponse.json(
          { success: false, message: 'اسم أو معرف المستحضر مطلوب' },
          { status: 400 }
        );
      }

      const guide: AuthenticityComparisonData = {
        productId: sanitizeText(body.productId, 100) || `prod-auth-${productCode.toLowerCase().replace(/\s+/g, '-')}`,
        productTitle: sanitizeText(body.productTitle, 150) || `مستحضر ${productCode}`,
        brand: sanitizeText(body.brand, 100) || 'سيرومات نقية',
        original: {
          title: sanitizeText(body.originalTitle, 100) || 'الأصلي المعتمد',
          image: sanitizeText(body.image, 300) || '/media/products/serum-vitamin-c.jpg',
          batchCode: 'مصرح ومطابق لمعايير الهيئة',
          formulaNotes: sanitizeText(body.formulaNotes, 500) || 'قوام نقي متجانس مطابق لمواصفات المختبر الأصلي ومعايير الهيئة العليا للأدوية',
          packagingNotes: sanitizeText(body.packagingNotes, 500) || 'زجاج معتم عازل للضوء مع ختم الأصالة والباركود المعتمد',
        },
        counterfeit: {
          title: 'التقليد المغشوش',
          image: sanitizeText(body.image, 300) || '/media/products/serum-vitamin-c.jpg',
          batchCode: 'بدون ختم اعتماد أو مطبوع بحبر باهت',
          formulaNotes: 'سائل معكر سريع التأكسد يسبب تهيج الجلد',
          packagingNotes: 'عبوة رديئة ومطاط يسرب الهواء',
        },
        checklist: Array.isArray(body.checklist)
          ? body.checklist
          : [
              {
                title: 'ختم وتصريح الهيئة العليا للأدوية والمستلزمات الطبية',
                originalFeature: 'مصرح ومطابق للمواصفات الرسمية مع ختم الأصالة والباركود المعتمد.',
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

    // 2. Public verification query
    const ip = getClientIp(req);
    if (!checkRateLimit(`auth_verify:${ip}`, 40, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت عدد طلبات التحقق المسموح بها في الدقيقة' },
        { status: 429 }
      );
    }

    const query = sanitizeText(body.query || body.productName || body.batchCode || body.productId || '', 150);

    if (query) {
      const verification = verifyBatchCode(query);
      return NextResponse.json({ success: true, verification });
    }

    if (body.productId) {
      const pId = sanitizeText(body.productId, 100);
      const guide = getAuthenticityGuide(pId);
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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف أدلة الفحص' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const key = sanitizeText(
      searchParams.get('key') || searchParams.get('productId') || searchParams.get('batchCode') || '',
      100
    );

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

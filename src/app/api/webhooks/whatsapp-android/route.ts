import { NextResponse } from 'next/server';
import { getAllProducts, verifyBatchCode } from '@/core/db/store';

/**
 * AutoResponder for WA Integration
 * Free, zero-ban Android automation integration:
 * Receives: {"query": {"sender": "...", "message": "..."}}
 * Responds: {"replies": [{"message": "..."}]}
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const message = (payload?.query?.message || '').trim().toLowerCase();
    const sender = payload?.query?.sender || 'العميل';

    let reply = 'أهلاً بك في متجر مفتاح الجمال (لكشف المقلد). يمكنك كتابة "الاسعار" لمعرفة قائمة المنتجات، أو "الاصلي" لفحص رقم الدفعة، أو "طلب" لإتمام الشراء فوراً.';

    if (message.includes('اسعار') || message.includes('منتجات') || message.includes('كتالوج')) {
      const products = getAllProducts();
      reply = `قائمة المنتجات الأكثر طلباً في مفتاح الجمال:\n`;
      products.slice(0, 4).forEach((p, idx) => {
        reply += `${idx + 1}. ${p.title} (${p.brand}) - السعر: ${p.prices.YER} ر.ي\n`;
      });
      reply += `\nلتصفح المتجر بالكامل ومقارنة الأصلي والتقليد:\nhttps://miftah.samiq.ye`;
    } else if (message.includes('اصلي') || message.includes('فحص') || message.includes('باتش') || message.includes('54u700')) {
      reply = `خدمة التحقق من الأصالة الفورية:
- سيروم فيتامين سي الأصلي: رقم الباتش محفور بالليزر في قاع الزجاج (مثل: 54U700) وقوامه نقي خالي من الرغوة.
- يمكنك كتابة رقم الدفعة مباشرة لفحصه الآن في قاعدة بيانات الوكالة المعتمدة.`;
    } else if (message.includes('توصيل') || message.includes('صنعاء')) {
      reply = `نوفر توصيلاً فورياً خلال ساعات قليلة داخل كافة أحياء صنعاء، وشحناً لكافة المحافظات مع خيار المعاينة وفحص الباركود قبل الدفع.`;
    } else if (message.includes('طلب')) {
      reply = `يسعدنا استلام طلبك. يرجى إرسال:
1. اسم المنتج المطلوب
2. الاسم الكريم
3. عنوانك بالتفصيل في صنعاء أو المحافظة
وسيتواصل معك فريق التجهيز فوراً.`;
    }

    return NextResponse.json({
      replies: [{ message: reply }],
    });
  } catch (error) {
    return NextResponse.json({
      replies: [
        {
          message: 'مرحباً بك في مفتاح الجمال. لطلب المنتجات المضمونة يرجى التواصل معنا أو زيارة متجرنا: https://miftah.samiq.ye',
        },
      ],
    });
  }
}

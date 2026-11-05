import { NextResponse } from 'next/server';
import { getAllProducts, getDb } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';
import {
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate limiting: max 15 AI requests per minute per IP
    if (!checkRateLimit(`ai_chat:${ip}`, 15, 60_000)) {
      return NextResponse.json(
        {
          success: false,
          text: 'تم تجاوز الحد الأقصى للمحادثات الفورية بالدقيقة. يرجى الانتظار بضع ثوانٍ أو التواصل مباشرة عبر واتساب المتجر.',
          recommendedProducts: [],
          quickPills: ['طلب مباشر عبر واتساب', 'تصفح كافة المنتجات'],
          escalateToHuman: true,
        },
        { status: 429 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const query = sanitizeText(body.message || '', 400);
    const queryLower = query.toLowerCase();

    const db = getDb();
    const products = getAllProducts();
    const storeName = sanitizeText(db.tenant?.name || 'مفتاح الجمال', 100);

    const apiKey = db.tenant?.notificationConfig?.geminiApiKey || process.env.GEMINI_API_KEY;

    // Try Gemini API first if key is present
    if (apiKey && query) {
      try {
        const productContext = products
          .slice(0, 10)
          .map((p) => `- ${p.title} (${p.brand}): ${p.prices.YER} ر.ي / ${p.prices.USD}$ [فئة: ${p.categorySlug}]`)
          .join('\n');

        const systemPrompt =
          `أنت مستشار المبيعات الذكي الرسمي لمتجر "${storeName}".\n` +
          `قائمة منتجات المتجر الحالية المتاحة:\n${productContext}\n\n` +
          `قواعد صارمة:\n` +
          `1. تحدث بأسلوب عربي فصيح ومهني ولبق ومختصر.\n` +
          `2. يمنع منعاً باتاً استخدام أي رموز تعبيرية (emojis) نهائياً.\n` +
          `3. قدم نصيحة دقيقة واقترح المنتجات المناسبة من القائمة أعلاه فقط بالأسعار الحقيقية.\n` +
          `4. إذا طلب العميل التواصل مع موظف بشري أو الاستلام، وجهه للتواصل مع رقم الإدارة المعتمد.\n` +
          `5. لا تذكر أي علامات أو شعارات محظورة.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nسؤال العميل: ${query}` }],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText && candidateText.trim()) {
            const cleanText = candidateText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
            const sanitizedClean = sanitizeText(cleanText, 1000);
            const recommended = products.filter((p) =>
              queryLower.includes(p.categorySlug) ||
              sanitizedClean.includes(p.title) ||
              (p.tags && p.tags.some((t) => queryLower.includes(t.toLowerCase())))
            ).slice(0, 3);

            return NextResponse.json({
              success: true,
              text: sanitizedClean,
              recommendedProducts: recommended.length > 0 ? recommended : products.slice(0, 2),
              quickPills: ['طلب مباشر عبر واتساب', 'تصفح كافة المنتجات', 'موقع الفرع'],
              escalateToHuman: sanitizedClean.includes('واتساب') || sanitizedClean.includes('موظف'),
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using local smart fallback:', geminiErr);
      }
    }

    // Smart Local Heuristic Fallback
    let replyText = `يسعدني استشارتك في ${storeName}. جميع منتجاتنا في الكتالوج أصلية 100% ومستحضرات مصرحة ومطابقة للمواصفات والضمانات الرسمية.`;
    let recommendedProducts: ProductCardData[] = [];
    let quickPills = ['فحص سيروم فيتامين سي', 'روتين البشرة الدهنية', 'خدمة التوصيل بصنعاء'];
    let escalateToHuman = false;

    if (queryLower.includes('أصلي') || queryLower.includes('مقلد') || queryLower.includes('سيروم') || queryLower.includes('فيتامين')) {
      replyText = `بالنسبة لسيروم فيتامين سي النقي 10% (Pure Vitamin C10) الأصلي:
1. مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية مع ختم الأصالة والباركود المعتمد.
2. القوام انسيابي نقي بلون ذهبي كهرماني دون أي رغوة بيضاء.
3. القطارة تحتوي سدادة مطاطية أصلية تمنع الأكسدة وتغير اللون.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'serums');
      quickPills = ['فحص المستحضر في دليل الأصالة', 'طلب سيروم فيتامين سي', 'طريقة الاستخدام الصحيحة'];
    } else if (queryLower.includes('دهنية') || queryLower.includes('مسامات') || queryLower.includes('حبوب')) {
      replyText = `للبشرة الدهنية والمسامات الواسعة، ننصحك بالروتين الثلاثي المعتمد:
1. تنظيف عميق بالغسول الرغوي المعتمد صباحاً ومساءً.
2. سيروم النياسيناميد 10% والزنك 1% لضبط إفراز الدهون وتضييق المسام.
3. ترطيب مائي خفيف خال من الزيوت مع واقي شمس غير لامع.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'serums' || p.categorySlug === 'cleansers-moisturizers');
      quickPills = ['إضافة روتين البشرة الدهنية', 'استشارة أخصائية بشرة', 'أسعار منتجات العناية'];
    } else if (queryLower.includes('جافة') || queryLower.includes('تقشر') || queryLower.includes('ترطيب')) {
      replyText = `للبشرة الجافة التي تعاني من الشد والتقشر، الروتين الأمثل يعتمد على السيراميدات وحمض الهيالورونيك:
1. الغسول المرطب اللطيف بالسيراميدات الثلاث الأساسية.
2. كريم الترطيب المكثف لحبس الرطوبة 24 ساعة.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'cleansers-moisturizers');
      quickPills = ['كريم ترطيب مكثف', 'الغسول المرطب', 'شحن إلى محافظتي'];
    } else if (queryLower.includes('مكياج') || queryLower.includes('روج') || queryLower.includes('شفايف') || queryLower.includes('عيون')) {
      replyText = 'مجموعتنا من المكياج الفاخر تضم أرقى الدرجات الأصلية ذات الثبات المخملي والترطيب الحريري كأحمر الشفاه الكوتور وباليت ظلال العيون الملكي.';
      recommendedProducts = products.filter((p) => p.categorySlug === 'makeup');
      quickPills = ['أحمر شفاه كوتور', 'باليت ظلال العيون', 'مطابقة درجات المكياج'];
    } else if (queryLower.includes('توصيل') || queryLower.includes('شحن') || queryLower.includes('صنعاء') || queryLower.includes('عدن')) {
      replyText = 'نوفر توصيلاً فورياً خلال ساعات قليلة داخل أمانة العاصمة صنعاء، وشحناً آمناً لكافة المحافظات (عدن، تعز، إب، حضرموت) خلال 24 إلى 48 ساعة مع إمكانية المعاينة وفحص الباركود قبل الدفع.';
      quickPills = ['مناطق ورسوم التوصيل', 'تأكيد طلب مباشر', 'موقع فرع صنعاء'];
    } else if (queryLower.includes('موظف') || queryLower.includes('إنسان') || queryLower.includes('واتساب') || queryLower.includes('رقم')) {
      const waNumber = db.tenant?.whatsapp || '967775234989';
      replyText = `يمكنك التواصل المباشر مع خدمة العملاء في متجر ${storeName} عبر تطبيق واتساب على الرقم ${waNumber}+، وسيسعدنا خدمتكم فوراً.`;
      escalateToHuman = true;
      quickPills = ['محادثة واتساب مباشرة', 'حجز موعد استشارة', 'العودة للكتالوج'];
    }

    return NextResponse.json({
      success: true,
      text: replyText,
      recommendedProducts,
      quickPills,
      escalateToHuman,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      text: 'يسعدنا خدمتك عبر واتساب المتجر المعتمد.',
      recommendedProducts: [],
      quickPills: ['الرئيسية', 'المنتجات', 'دليل الأصالة'],
      escalateToHuman: true,
    });
  }
}

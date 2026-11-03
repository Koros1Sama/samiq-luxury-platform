import { NextResponse } from 'next/server';
import { getAllProducts, getAuthenticityGuide } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();
    const query = (message || '').trim().toLowerCase();
    const products = getAllProducts();

    let replyText = 'يسعدني استشارتك في مفتاح الجمال. جميع منتجاتنا في الكتالوج أصلية 100% برقم تشغيلة موثق وباركود معتمد.';
    let recommendedProducts: ProductCardData[] = [];
    let quickPills = ['فحص سيروم فيتامين سي', 'روتين البشرة الدهنية', 'خدمة التوصيل بصنعاء'];
    let escalateToHuman = false;

    if (query.includes('أصلي') || query.includes('تقليد') || query.includes('سيروم') || query.includes('فيتامين') || query.includes('لاروش')) {
      replyText = `بالنسبة لسيروم La Roche-Posay Pure Vitamin C10 الأصلي:
1. رقم الباتش محفور بالليزر أسفل الزجاج (مثل: 54U700) ومطابق تماماً للكرتون.
2. القوام انسيابي نقي بلون ذهبي كهرماني دون أي رغوة بيضاء.
3. القطارة تحتوي سدادة مطاطية أصلية تمنع الأكسدة وتغير اللون.`;
      recommendedProducts = products.filter((p) => p.brand === 'La Roche-Posay');
      quickPills = ['فحص رقم الباتش في الموسوعة', 'طلب سيروم فيتامين سي', 'طريقة الاستخدام الصحيحة'];
    } else if (query.includes('دهنية') || query.includes('مسامات') || query.includes('حبوب')) {
      replyText = `للبشرة الدهنية والمسامات الواسعة، ننصحك بالروتين الثلاثي المعتمد:
1. تنظيف عميق بغسول CeraVe الرغوي صباحاً ومساءً.
2. سيروم The Ordinary Niacinamide 10% + Zinc 1% لضبط إفراز الدهون وتضييق المسام.
3. ترطيب مائي خفيف خالٍ من الزيوت مع واقي شمس غير لامع.`;
      recommendedProducts = products.filter((p) => p.brand === 'CeraVe' || p.brand === 'The Ordinary');
      quickPills = ['إضافة روتين البشرة الدهنية', 'استشارة أخصائية بشرة', 'أسعار منتجات سيرافي'];
    } else if (query.includes('جافة') || query.includes('تقشر') || query.includes('ترطيب')) {
      replyText = `للبشرة الجافة التي تعاني من الشد والتقشر، الروتين الأمثل يعتمد على السيراميدات وحمض الهيالورونيك:
1. غسول CeraVe Hydrating Cleanser اللطيف بالسيراميدات الثلاث الأساسية.
2. كريم سيرافي المرطب المكثف لحبس الرطوبة 24 ساعة بتقنية MVE.`;
      recommendedProducts = products.filter((p) => p.brand === 'CeraVe');
      quickPills = ['كريم سيرافي 454g', 'غسول سيرافي المرطب', 'شحن إلى محافظتي'];
    } else if (query.includes('مكياج') || query.includes('روج') || query.includes('شفايف') || query.includes('عيون')) {
      replyText = 'مجموعتنا من المكياج الفاخر تضم أرقى الدرجات الأصلية ذات الثبات المخملي والترطيب الحريري كأحمر شفاه YSL وباليت هدى بيوتي الملكي.';
      recommendedProducts = products.filter((p) => p.categorySlug === 'makeup');
      quickPills = ['أحمر شفاه YSL لو روج', 'باليت هدى بيوتي', 'مطابقة درجات المكياج'];
    } else if (query.includes('توصيل') || query.includes('شحن') || query.includes('صنعاء') || query.includes('عدن')) {
      replyText = 'نوفر توصيلاً فورياً خلال ساعات قليلة داخل أمانة العاصمة صنعاء، وشحناً آمناً لكافة المحافظات (عدن، تعز، إب، حضرموت) خلال 24 إلى 48 ساعة مع إمكانية المعاينة وفحص الباركود قبل الدفع.';
      quickPills = ['مناطق ورسوم التوصيل', 'تأكيد طلب مباشر', 'موقع فرع صنعاء'];
    } else if (query.includes('موظف') || query.includes('إنسان') || query.includes('واتساب') || query.includes('رقم')) {
      replyText = 'يمكنك التواصل المباشر مع خبيرات العناية وخدمة العملاء في متجر مفتاح الجمال عبر تطبيق واتساب على الرقم 967775234989+، وسيسعدنا خدمتكم فوراً.';
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
      text: 'يسعدنا خدمتك عبر واتساب متجر مفتاح الجمال: 967775234989+',
      recommendedProducts: [],
      quickPills: ['الرئيسية', 'المنتجات', 'دليل الأصلي والتقليد'],
      escalateToHuman: true,
    });
  }
}

import { NextResponse } from 'next/server';
import { getAllProducts, getAuthenticityGuide } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json();
    const query = (message || '').trim().toLowerCase();
    const products = getAllProducts();

    let replyText = 'يسعدني استشارتك في مفتاح الجمال. جميع منتجاتنا في الكتالوج أصلية 100% ومستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.';
    let recommendedProducts: ProductCardData[] = [];
    let quickPills = ['فحص سيروم فيتامين سي', 'روتين البشرة الدهنية', 'خدمة التوصيل بصنعاء'];
    let escalateToHuman = false;

    if (query.includes('أصلي') || query.includes('تقليد') || query.includes('سيروم') || query.includes('فيتامين')) {
      replyText = `بالنسبة لسيروم فيتامين سي النقي 10% (Pure Vitamin C10) الأصلي:
1. مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية مع ختم الأصالة والباركود المعتمد.
2. القوام انسيابي نقي بلون ذهبي كهرماني دون أي رغوة بيضاء.
3. القطارة تحتوي سدادة مطاطية أصلية تمنع الأكسدة وتغير اللون.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'serums');
      quickPills = ['فحص المستحضر في دليل الأصالة', 'طلب سيروم فيتامين سي', 'طريقة الاستخدام الصحيحة'];
    } else if (query.includes('دهنية') || query.includes('مسامات') || query.includes('حبوب')) {
      replyText = `للبشرة الدهنية والمسامات الواسعة، ننصحك بالروتين الثلاثي المعتمد:
1. تنظيف عميق بالغسول الرغوي المعتمد صباحاً ومساءً.
2. سيروم النياسيناميد 10% والزنك 1% لضبط إفراز الدهون وتضييق المسام.
3. ترطيب مائي خفيف خالٍ من الزيوت مع واقي شمس غير لامع.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'serums' || p.categorySlug === 'cleansers-moisturizers');
      quickPills = ['إضافة روتين البشرة الدهنية', 'استشارة أخصائية بشرة', 'أسعار منتجات العناية'];
    } else if (query.includes('جافة') || query.includes('تقشر') || query.includes('ترطيب')) {
      replyText = `للبشرة الجافة التي تعاني من الشد والتقشر، الروتين الأمثل يعتمد على السيراميدات وحمض الهيالورونيك:
1. الغسول المرطب اللطيف بالسيراميدات الثلاث الأساسية.
2. كريم الترطيب المكثف لحبس الرطوبة 24 ساعة.`;
      recommendedProducts = products.filter((p) => p.categorySlug === 'cleansers-moisturizers');
      quickPills = ['كريم ترطيب مكثف', 'الغسول المرطب', 'شحن إلى محافظتي'];
    } else if (query.includes('مكياج') || query.includes('روج') || query.includes('شفايف') || query.includes('عيون')) {
      replyText = 'مجموعتنا من المكياج الفاخر تضم أرقى الدرجات الأصلية ذات الثبات المخملي والترطيب الحريري كأحمر الشفاه الكوتور وباليت ظلال العيون الملكي.';
      recommendedProducts = products.filter((p) => p.categorySlug === 'makeup');
      quickPills = ['أحمر شفاه كوتور', 'باليت ظلال العيون', 'مطابقة درجات المكياج'];
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

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ success: false, message: 'اسم المنتج مطلوب' }, { status: 400 });
    }

    const t = title.toLowerCase();

    // Smart heuristic copywriting generation
    let brand = 'ماركة عالمية فاخرة';
    let categorySlug = 'skincare';
    let ingredients = ['مكونات طبيعية نقية', 'فيتامينات مهدئة للبشرة'];
    let arabicDescription = `مستحضر استثنائي يعزز نضارة البشرة ويحمي حاجزها الطبيعي بتركيبة نقية مختبرة سريرياً.`;
    let englishDescription = `A premium formula designed to enhance skin radiance and support natural moisture barrier with clinically verified actives.`;
    let authenticityPoints = [
      'رقم التشغيلة (Batch Code) محفور بالليزر ومطابق لكرتون الوكالة الرسمي',
      'الباركود الدولي يقرأ بلد المنشأ وتاريخ الصلاحية الرسمي',
      'خلو التركيبة تماماً من الروائح الكيميائية الحادة أو الرغوة الشائبة',
    ];

    if (t.includes('laroche') || t.includes('لاروش') || t.includes('vitaminc') || t.includes('فيتامين')) {
      brand = 'La Roche-Posay';
      categorySlug = 'serums';
      ingredients = ['Pure Vitamin C 10%', 'Salicylic Acid', 'Neurosensine', 'Hyaluronic Acid'];
      arabicDescription = 'سيروم فيتامين سي النقي المركز بنسبة 10%، مصمم خصيصاً لإعادة الحيوية والنضارة الفورية للبشرة وتوحيد لونها ومكافحة التجاعيد الدقيقة دون أي تحسس.';
      englishDescription = 'Pure 10% Vitamin C anti-aging serum with salicylic acid and neurosensine to visibly boost skin radiance and smooth texture.';
    } else if (t.includes('cerave') || t.includes('سيرافي') || t.includes('غسول')) {
      brand = 'CeraVe';
      categorySlug = 'cleansers';
      ingredients = ['Ceramide NP', 'Ceramide AP', 'Ceramide EOP', 'Hyaluronic Acid', 'Niacinamide'];
      arabicDescription = 'غسول علاجي مركب بالتعاون مع أطباء الجلد يحتوي على 3 سيراميدات أساسية مطابقة للبشرة لترميم الحاجز الواقي وحبس الرطوبة طوال اليوم.';
      englishDescription = 'Dermatologist-developed cleanser formulated with three essential ceramides and hyaluronic acid to cleanse without stripping natural moisture.';
    } else if (t.includes('ordinary') || t.includes('اورديناري') || t.includes('niacinamide') || t.includes('نياسيناميد')) {
      brand = 'The Ordinary';
      categorySlug = 'serums';
      ingredients = ['Niacinamide 10%', 'Zinc PCA 1%'];
      arabicDescription = 'تركيبة عالية التركيز من فيتامين B3 (النياسيناميد) مع ملح الزنك لتنظيم إفراز الدهون وتضييق المسامات الواسعة وتهدئة آثار الحبوب.';
      englishDescription = 'High-strength vitamin and mineral blemish formula with 10% pure niacinamide and 1% zinc PCA to reduce skin congestion and visible pores.';
    } else if (t.includes('ysl') || t.includes('روج') || t.includes('lipstick') || t.includes('مكياج')) {
      brand = 'YSL Beauty';
      categorySlug = 'makeup';
      ingredients = ['زبدة الشيا النقية', 'شمع طبيعي مرطب', 'مستخلصات الذهب الدقيقة'];
      arabicDescription = 'أحمر شفاه كوتور الفاخر بقوام حريري يمنح الشفاه لوناً غنياً بتمريرة واحدة مع ترطيب عميق يدوم 12 ساعة في علبة ذهبية ملكية.';
      englishDescription = 'A luxurious satin lipstick that delivers rich, couture color and supreme hydration in one stroke with up to 12 hours of comfort.';
    }

    return NextResponse.json({
      success: true,
      data: {
        brand,
        categorySlug,
        arabicDescription,
        englishDescription,
        ingredients,
        authenticityPoints,
        suggestedTags: [brand, 'أصلي 100%', 'مفتاح الجمال', 'صنعاء'],
        seoTitle: `${title} - الأصلي المعتمد | مفتاح الجمال صنعاء`,
        seoDescription: arabicDescription.substring(0, 155),
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل المساعد الذكي' }, { status: 500 });
  }
}

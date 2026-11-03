import React from 'react';
import { resolveTenant } from '@/core/tenant/resolver';
import { getDb } from '@/core/db/store';
import { LuxuryNoirTheme } from '@/themes/base/luxury-noir';

export const revalidate = 0; // Dynamic real-time persistence

export default function StorefrontHomePage() {
  const tenantContext = resolveTenant();
  const db = getDb();

  // Load live data from real-time database store
  const storefrontData = {
    tenant: {
      ...db.tenant,
      id: tenantContext.tenant.id,
      name: tenantContext.tenant.name,
      legalName: tenantContext.tenant.legalName,
      whatsapp: tenantContext.tenant.whatsapp,
      phone: tenantContext.tenant.phone,
      city: tenantContext.tenant.city,
      noindex: tenantContext.tenant.noindex,
    },
    features: db.features,
    initialCurrency: 'YER' as const,
    products: db.products,
    categories: db.categories,
    authenticityGuide: db.authenticityGuides['prod-1'] || db.authenticityGuides[Object.keys(db.authenticityGuides)[0]],
    skinRoutine: {
      title: 'روتين العناية ببشرتك لإشراقة تدوم',
      subtitle: 'اختاري نوع بشرتك لتكتشفي الروتين المثالي والمكونات الفعالة',
      skinTypes: [
        {
          id: 'oily' as const,
          label: 'بشرة دهنية',
          icon: 'drop',
          tagline: 'تنقية المسامات والتحكم باللمعان دون جفاف',
          routineDescription: 'روتين متوازن يركز على تنظيم الإفرازات الزهمية وتضييق المسام الواسعة مع ترطيب مائي خفيف.',
          steps: [
            'تنظيف عميق صباحاً ومساءً بغسول رغوي يحتوي على النياسيناميد وحمض الهيالورونيك.',
            'تطبيق قطرات من سيروم النياسيناميد 10% والزنك لتنظيم دهون البشرة ومكافحة البثور.',
            'ترطيب خفيف بجل مائي غير زيتي وواقي شمس سائل بدون لمعة دهنية.',
          ],
          recommendedProductIds: ['prod-2', 'prod-3'],
          activeIngredientIds: ['niacinamide', 'hyaluronic', 'vitaminc'],
        },
        {
          id: 'dry' as const,
          label: 'بشرة جافة',
          icon: 'wave',
          tagline: 'ترطيب عميق وحماية حاجز البشرة الحساس',
          routineDescription: 'روتين مغذٍ يدعم حاجز الدهون الواقي ويمنح ترطيباً مضاعفاً يمنع التقشر والشد.',
          steps: [
            'غسول كريمي لطيف جداً بالسيراميد خالي من الصابون والعطور يحافظ على رطوبة الجلد.',
            'سيروم فيتامين سي أو حمض الهيالورونيك لضخ الرطوبة في خلايا البشرة واستعادة المرونة.',
            'كريم ترطيب غني بالسيراميد صباحاً ومساءً لقفل الرطوبة داخل البشرة طوال 24 ساعة.',
          ],
          recommendedProductIds: ['prod-1', 'prod-2', 'prod-6'],
          activeIngredientIds: ['hyaluronic', 'vitaminc', 'niacinamide'],
        },
        {
          id: 'sensitive' as const,
          label: 'بشرة حساسة',
          icon: 'feather',
          tagline: 'تهدئة الاحمرار ودعم المقاومة الطبيعية',
          routineDescription: 'روتين هادئ جداً بمكونات نقية مختبرة جلدياً خالية من المواد المهيجة والعطور الصناعية.',
          steps: [
            'تنظيف فائق اللطف بغسول مهدئ لا يسبب أي وخز أو احمرار.',
            'سيروم مرطب خفيف مدعم بالنياسيناميد بتركيز معتدل لتهدئة التحسس وتقوية الجدار الواقي.',
            'مرطب مهدئ خالٍ من العطور وواقي شمس فيزيائي بنسبة 100%.',
          ],
          recommendedProductIds: ['prod-2', 'prod-6'],
          activeIngredientIds: ['hyaluronic', 'niacinamide', 'vitaminc'],
        },
      ],
      ingredients: [
        {
          id: 'vitaminc',
          nameEn: 'Vitamin C',
          nameAr: 'فيتامين سي النقي',
          iconType: 'citrus' as const,
          benefitsAr: 'مضاد أكسدة فائق، يفتح التصبغات، ويوحد لون البشرة ويحفز إنتاج الكولاجين الطبيعي.',
          concentration: '10% Pure',
        },
        {
          id: 'hyaluronic',
          nameEn: 'Hyaluronic Acid',
          nameAr: 'حمض الهيالورونيك',
          iconType: 'drop' as const,
          benefitsAr: 'يحبس الرطوبة حتى 1000 ضعف وزنه بالماء، ليمنح البشرة امتلاءً ونعومة مخملية فورية.',
          concentration: '2% Multi-Weight',
        },
        {
          id: 'niacinamide',
          nameEn: 'Niacinamide',
          nameAr: 'نياسيناميد (فيتامين B3)',
          iconType: 'molecule' as const,
          benefitsAr: 'يقلل المسامات الواسعة، ينظم إفراز الدهون، ويهدئ الاحمرار ويعالج آثار الحبوب.',
          concentration: '10% + Zinc 1%',
        },
      ],
    },
  };

  return <LuxuryNoirTheme {...storefrontData} />;
}

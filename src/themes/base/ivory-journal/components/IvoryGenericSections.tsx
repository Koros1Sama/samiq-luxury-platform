'use client';

import React, { useState } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps, BlockRendererProps } from '@/themes/contract';
import {
  VerifiedStampIcon,
  ChevronDownIcon,
  CheckIcon,
  EditorialSparkleIcon,
  ArrowIcon,
} from './IvoryIcons';

// 1. Feature Strip (Value Proposition Row)
export function IvoryFeatureStrip({ section }: Partial<SectionComponentProps>) {
  const features = [
    {
      title: 'توثيق معملي معتمد',
      desc: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية',
    },
    {
      title: 'شحن مبرد ومحمي',
      desc: 'توصيل سريع بصنعاء وشحن آمن لكافة المحافظات اليمنية',
    },
    {
      title: 'فحص مادي عند الاستلام',
      desc: 'حق المعاينة الكاملة ومطابقة الباركود قبل الاستلام والسداد',
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-s divide-[#E8E2D8]">
          {features.map((f, i) => (
            <div key={i} className="pt-4 md:pt-0 ps-0 md:ps-6 space-y-1">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#1B1612]">
                <VerifiedStampIcon size={16} color="#5E6B5A" />
                <span className="font-serif font-bold text-sm sm:text-base">
                  {f.title}
                </span>
              </div>
              <p className="font-sans text-sm text-[#554D46] leading-[1.75] ps-6">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. Editorial Gallery
export function IvoryGallery(_props: Partial<SectionComponentProps>) {
  const galleryItems = [
    {
      image: '/media/products/serum-vitamin-c.jpg',
      caption: 'نقاء المكونات الفعالة في سيروم فيتامين سي',
    },
    {
      image: '/media/products/cleanser-hydrating.jpg',
      caption: 'تركيبة التنظيف اللطيفة المعززة بالسيراميدات',
    },
    {
      image: '/media/products/cream-moisturizing.jpg',
      caption: 'ترطيب عميق يحافظ على حاجز البشرة الوقائي',
    },
  ];

  return (
    <section className="w-full bg-[#F7F4ED] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-start mb-10">
          <span className="text-xs font-mono font-semibold text-[#5E6B5A] block mb-1">
            EDITORIAL SPREAD · لقطات من المختبر
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B1612]">
            ملف الصور والتراكيب المخبرية
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {galleryItems.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="relative aspect-[4/5] bg-[#EFEAE1] rounded-md overflow-hidden border border-[#E8E2D8]">
                <SmartImage
                  src={item.image}
                  alt={item.caption}
                  priority={false}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center w-full h-full mix-blend-multiply transition-transform duration-500 hover:scale-105"
                />
              </div>
              <p className="font-serif text-sm text-[#554D46] italic leading-[1.75]">
                {item.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3. Editorial Testimonials
export function IvoryTestimonials(_props: Partial<SectionComponentProps>) {
  const testimonials = [
    {
      quote:
        'الاطلاع على دليل فحص الأصالة المعتمد على موقع مفتاح الجمال قبل استلام السيروم منحني ثقة كاملة. المنتج أصلي 100% ومطابق للمعايير والفرق واضح على بشرتي.',
      author: 'د. نادية العنسي · صنعاء',
    },
    {
      quote:
        'خدمة التوصيل استغرقت ساعتين فقط، ومندوب التوصيل انتظر حتى طابقت الباركود مع الكرتون الخارجي. احترافية عالية جداً.',
      author: 'أروى الحكيمي · حدة',
    },
    {
      quote:
        'أول متجر في اليمن يوثق مطابقة معايير الهيئة العليا للأدوية ويكشف علامات المقلد بدقة. انتهت معاناتي مع السيرومات المغشوشة في الأسواق.',
      author: 'سمية المقالح · صنعاء',
    },
  ];

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-start mb-10">
          <span className="text-xs font-mono font-semibold text-[#5E6B5A] block mb-1">
            TESTIMONIALS · آراء وملاحظات القراء
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B1612]">
            تجارب موثقة من مجتمعنا
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-md bg-[#F7F4ED] border border-[#E8E2D8] flex flex-col justify-between space-y-4"
            >
              <p className="font-serif text-sm sm:text-base text-[#1B1612] leading-[1.8] italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-[#E8E2D8]/60">
                <span className="font-sans font-bold text-xs sm:text-sm text-[#5E6B5A]">
                  {t.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. FAQ Section (Accordion)
export function IvoryFaq(_props: Partial<SectionComponentProps>) {
  const faqs = [
    {
      q: 'كيف أتحقق من أن المنتج أصلي وغير مقلد؟',
      a: 'يمكنكِ كتابة اسم المستحضر في أداة "فحص المستحضر باسم المنتج" أعلاه، وستظهر لكِ علامات الأصلي وكشف المقلد وتأكيد مطابقة معايير الهيئة العليا للأدوية والمستلزمات الطبية. كما يمكنكِ معاينة العبوة والختم عند الاستلام.',
    },
    {
      q: 'ما هي مدة التوصيل داخل صنعاء والمحافظات؟',
      a: 'نوفر توصيلاً فورياً خلال 2 إلى 4 ساعات في كافة مديريات أمانة العاصمة صنعاء. وبالنسبة للمحافظات (عدن، تعز، حضرموت، إب) يتم الشحن عبر ناقل موثوق خلال 24 إلى 48 ساعة.',
    },
    {
      q: 'هل يمكنني معاينة المستحضر قبل سداد قيمته؟',
      a: 'بكل تأكيد. سياسة متجرنا تمنحكِ كامل الحق في فحص العبوة، والتأكد من سلامة الختم الحراري ومطابقة الباركود قبل تسليم المبلغ للمندوب.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-start mb-10">
          <span className="text-xs font-mono font-semibold text-[#5E6B5A] block mb-1">
            FAQ · الأسئلة الشائعة
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B1612]">
            كل ما يهمكِ معرفته حول الأصالة والطلب
          </h2>
        </div>

        <div className="divide-y divide-[#E8E2D8] border-y border-[#E8E2D8]">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full min-h-[44px] py-2 flex items-center justify-between text-start group"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-[#1B1612] group-hover:text-[#5E6B5A] transition-colors">
                    {faq.q}
                  </span>
                  <div
                    className={`w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDownIcon size={18} color="#5E6B5A" />
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-2 pb-4 ps-2">
                    <p className="font-sans text-sm text-[#554D46] leading-[1.75]">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 5. Editorial Call To Action (CTA Banner)
export function IvoryCta({ section }: Partial<SectionComponentProps>) {
  const { tenant } = useStorefront();
  const title = (section?.props?.title as string) || 'انضمي إلى مجتمع الجمال الموثق';
  const subtitle =
    (section?.props?.subtitle as string) ||
    'احصلي على استشارات مخصصة وتنبيهات فورية بأحدث المستحضرات المصرحة والأصلية الواصلة حديثاً.';

  const whatsappUrl = `https://wa.me/${(tenant.whatsapp || '775234989').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('أود الانضمام لقائمة العملاء المميزين في مفتاح الجمال')}`;

  return (
    <section className="w-full bg-[#1B1612] text-[#FAF7F2] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <div className="w-12 h-px bg-[#B89B5E] mx-auto" />
        <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#FAF7F2]">
          {title}
        </h2>
        <p className="font-sans text-sm text-[#D1C7BD] max-w-lg mx-auto leading-[1.75]">
          {subtitle}
        </p>
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] px-8 py-3 rounded-full bg-[#FAF7F2] text-[#1B1612] hover:bg-[#E8E2D8] font-sans font-bold text-xs sm:text-sm transition-colors shadow-lg"
          >
            <span>التسجيل واستشارة الخبيرة التحريرية</span>
            <span className="rtl:-scale-x-100">
              <ArrowIcon size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// 6. Modular Block: Skin Routine
export function IvorySkinRoutineBlock({ data }: BlockRendererProps) {
  const skinData = data as any;
  const steps = [
    {
      step: '01',
      title: 'الصباح: الحماية والإشراقة',
      desc: 'تنظيف لطيف بغسول حمض الهيالورونيك، يليه سيروم فيتامين سي النقي 10% لتعزيز النضارة وحماية خلايا البشرة من الأكسدة البيئية طوال اليوم.',
    },
    {
      step: '02',
      title: 'المساء: التجديد والترميم',
      desc: 'إزالة الشوائب وسيروم نياسيناميد 10% لتنظيم الإفرازات وقبض المسام، يليه كريم الترطيب الغني بالسيراميدات الثلاثية لترميم الحاجز الطبيعي أثناء النوم.',
    },
  ];

  return (
    <section className="w-full bg-[#F5F1E9] py-16 sm:py-24 border-b border-[#E8E2D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-start mb-10">
          <span className="text-xs font-mono font-semibold text-[#5E6B5A] block mb-1">
            ROUTINE GUIDE · جدول العناية الموصى به
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B1612]">
            روتين العناية اليومي المتكامل
          </h2>
          <p className="font-sans text-sm text-[#554D46] mt-1 leading-[1.75]">
            خطوات علمية متسلسلة تحقق أفضل النتائج الحيوية لمختلف أنواع البشرة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-6 sm:p-8 rounded-md bg-[#FAF7F2] border border-[#E8E2D8] space-y-3"
            >
              <div className="flex items-center gap-3 border-b border-[#E8E2D8] pb-3">
                <span className="font-mono text-sm font-bold text-[#5E6B5A]">
                  {s.step}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1B1612]">
                  {s.title}
                </h3>
              </div>
              <p className="font-sans text-sm text-[#554D46] leading-[1.75]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

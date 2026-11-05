'use client';

import React from 'react';
import { SectionComponentProps } from '@/themes/contract';
import {
  ShieldCheckIcon,
  FlaskIcon,
  ClockIcon,
  DropletIcon,
  SparklesIcon,
  ArrowStartIcon,
} from './ClinicIcons';

export function ClinicFeatureStrip(_props: SectionComponentProps) {
  const features = [
    {
      title: 'فحص مخبري موثق',
      desc: 'مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية',
      icon: ShieldCheckIcon,
    },
    {
      title: 'تركيزات نقية مدروسة',
      desc: 'مستحضرات علاجية خالية من المركبات المجهولة أو الضارة',
      icon: FlaskIcon,
    },
    {
      title: 'توصيل فوري مبرد',
      desc: 'نقل آمن يحافظ على استقرار المواد الفعالة وحرارتها',
      icon: ClockIcon,
    },
  ];

  return (
    <section className="w-full py-6 bg-white border-y border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F2F7F5] border border-[#D4E5E0] flex items-center gap-3 text-start"
              >
                <div className="w-10 h-10 rounded-lg bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center shrink-0 border border-[#0F4C4A]/15">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-[#0F4C4A]">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-[1.75] mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ClinicRichText(props: SectionComponentProps) {
  const title = (props.section.props?.title as string) || 'معايير الجودة والمطابقة السريرية';
  const body =
    (props.section.props?.body as string) ||
    'يلتزم معمل مفتاح الجمال السريري بتوفير مستحضرات علاجية أصلية 100% معتمدة من جهات التصنيع ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية لضمان سلامة البشرة وفاعلية النتائج.';

  return (
    <section className="w-full py-8 bg-[#F2F7F5] border-t border-[#E2ECE9]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-start">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F4C4A] mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-[#4A5568] leading-[1.75]">
          {body}
        </p>
      </div>
    </section>
  );
}

export function ClinicFaq(_props: SectionComponentProps) {
  const faqs = [
    {
      q: 'كيف أتحقق من أن المستحضر أصلي ومصرح؟',
      a: 'يمكنك كتابة اسم المستحضر في أداة "فحص المستحضر ودليل كشف المقلد" بالأعلى لمعرفة علامات المنتج الأصلي والتأكد من مطابقته لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.',
    },
    {
      q: 'هل السيرومات المحفوظة لديكم مبردة؟',
      a: 'نعم، تخضع كافة المستحضرات الحاوية على فيتامين سي أو أحماض نشطة لظروف تخزين وتبريد محكمة لحمايتها من الأكسدة والتلف الحراري.',
    },
    {
      q: 'كم يستغرق التوصيل داخل صنعاء؟',
      a: 'التوصيل يتم خلال ساعتين إلى أربع ساعات لكافة أحياء ومديريات أمانة العاصمة مع إمكانية المعاينة قبل الاستلام والسداد.',
    },
  ];

  return (
    <section className="w-full py-8 sm:py-12 bg-white border-t border-[#E2ECE9]">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-start">
        <div className="mb-6">
          <span className="text-xs font-bold text-[#0F4C4A] block mb-1">
            الأسئلة الشائعة
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F4C4A]">
            إجابات سريرية ومخبرية موثقة
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F2F7F5] border border-[#D4E5E0] text-start"
            >
              <h3 className="font-bold text-sm sm:text-base text-[#0F4C4A] mb-1">
                {faq.q}
              </h3>
              <p className="text-sm text-[#4A5568] leading-[1.75]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClinicCta(_props: SectionComponentProps) {
  return (
    <section className="w-full py-8 sm:py-12 bg-[#0F4C4A] text-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center flex flex-col items-center gap-3">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#CFE8E1] text-[#0F4C4A]">
          استشارة سريرية مجانية
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
          هل تحتاجين مساعدة في اختيار الروتين المناسب لبشرتك؟
        </h2>
        <p className="text-sm sm:text-base text-[#CFE8E1] leading-[1.75] max-w-xl">
          أخصائيو المختبر الطبي جاهزون لتحليل احتياجات بشرتك واقتراح المستحضرات المصرحة والمطابقة لمعايير الهيئة العليا للأدوية.
        </p>
        <a
          href="#contact"
          className="mt-2 min-h-[44px] px-6 py-2.5 rounded-xl bg-white text-[#0F4C4A] hover:bg-[#CFE8E1] text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors focus:outline-hidden focus:ring-2 focus:ring-white"
        >
          <span>تواصل مع أخصائي المختبر</span>
          <ArrowStartIcon size={16} />
        </a>
      </div>
    </section>
  );
}

export function ClinicTestimonials(_props: SectionComponentProps) {
  const reviews = [
    {
      author: 'د. ريم الشامي',
      role: 'طبيبة جلدية — صنعاء',
      text: 'أوصي دائماً مريضاتي بفحص علامات الأصلي المعتمدة عبر هذه المنصة قبل الاستخدام، مطابقة معايير الهيئة العليا للأدوية هنا تمنح ثقة كاملة بنقاء المكونات.',
    },
    {
      author: 'أميرة الحداد',
      role: 'عميلة دائمة — حدة',
      text: 'فرق كبير بين المنتجات المعتمدة هنا والمنتجات المغشوشة المنتشرة في السوق. النتيجة ظهرت على بشرتي خلال أسبوعين.',
    },
  ];

  return (
    <section className="w-full py-8 bg-[#F2F7F5] border-t border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 text-start">
        <div className="mb-6">
          <span className="text-xs font-bold text-[#0F4C4A] block mb-1">
            آراء المتخصصين والعملاء
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F4C4A]">
            تجارب حقيقية موثقة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-[#D4E5E0] shadow-xs text-start flex flex-col justify-between gap-3"
            >
              <p className="text-sm text-[#2D3748] leading-[1.75]">
                "{rev.text}"
              </p>
              <div className="pt-2 border-t border-[#F2F7F5]">
                <span className="font-bold text-xs sm:text-sm text-[#0F4C4A] block">
                  {rev.author}
                </span>
                <span className="text-xs text-[#64748B] block">
                  {rev.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

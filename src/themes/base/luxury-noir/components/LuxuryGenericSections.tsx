'use client';

import React, { useState } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { SectionComponentProps } from '../../../contract';
import { ShieldCheckIcon, VerifiedCheckIcon, SparkleStarIcon } from './LuxuryIcons';

export function LuxuryFeatureStrip(_props: Partial<SectionComponentProps>) {
  const items = [
    { title: 'فحص مخبري موثق', desc: 'مطابقة تامة لختم الهيئة العليا للأدوية والمستلزمات الطبية' },
    { title: 'نقل وتخزين مبرد', desc: 'سلسلة حفظ حراري تضمن ثبات الفيتامينات والمواد النشطة' },
    { title: 'معاينة فورية حرة', desc: 'حق الفحص الكامل ومطابقة الباركود قبل السداد عند الاستلام' },
  ];

  return (
    <section className="w-full py-8 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-s divide-white/[0.08] rounded-2xl bg-[#0D0D12] border border-white/[0.08]">
          {items.map((item, idx) => (
            <div key={idx} className="p-5 flex items-start gap-3 text-start">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold shrink-0">
                <ShieldCheckIcon size={18} color="#C9A84C" />
              </div>
              <div>
                <h3 className="text-sm font-serif font-bold text-ivory">{item.title}</h3>
                <p className="text-xs text-muted-lux font-sans mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LuxuryRichText({ section }: Partial<SectionComponentProps>) {
  const title = (section?.props?.title as string) || 'ميثاق مفتاح الجمال للجودة والأصالة';
  const body =
    (section?.props?.body as string) ||
    'ننتقي في مفتاح الجمال مستحضرات عناية وتجميل معتمدة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية، مع فحص مخبري مستمر لحماية بشرتك من المنتجات المغشوشة.';

  return (
    <section className="w-full py-12 sm:py-16 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs text-gold font-sans font-semibold">
          <SparkleStarIcon size={14} color="#C9A84C" />
          <span>بيان الدار الموثق</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">{title}</h2>
        <p className="text-sm sm:text-base text-muted-lux font-sans leading-relaxed">{body}</p>
      </div>
    </section>
  );
}

export function LuxuryFaq(_props: Partial<SectionComponentProps>) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = [
    {
      q: 'كيف أتحقق بنفسي من أصلية المستحضر عند الاستلام؟',
      a: 'نوفر لكِ أداة فحص فورية على الموقع لمطابقة مواصفات العبوة والختم والباركود الرسمي، كما يحق لكِ معاينة المستحضر بالكامل قبل السداد.',
    },
    {
      q: 'هل تتوفر خدمة التوصيل المبرد خارج صنعاء؟',
      a: 'نعم، نشحن كافة المستحضرات النشطة في عبوات عازلة للحرارة لكافة محافظات الجمهورية اليمنية مع تتبع مباشر.',
    },
    {
      q: 'هل يمكن حجز استشارة مجانية لاختيار الروتين المناسب لبشرتي؟',
      a: 'نعم، استشاراتنا الحضورية في فرع حدة وعبر الواتساب متاحة مجاناً مع كل طلب.',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-start space-y-1">
          <span className="text-xs font-sans text-gold font-semibold">إجابات موثقة</span>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory">الأسئلة الشائعة</h2>
        </div>

        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="py-2">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full min-h-[48px] py-3 flex items-center justify-between gap-4 text-start"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-ivory">{item.q}</span>
                  <span className="text-gold text-base shrink-0">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed pb-3">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LuxuryTestimonials(_props: Partial<SectionComponentProps>) {
  const reviews = [
    { name: 'سارة الهمداني', city: 'صنعاء — حدة', text: 'التوثيق والفحص السريع بالاسم أعطاني ثقة تامة قبل الطلب، والمنتج وصل مبرد ومطابق 100%.' },
    { name: 'ريم المنصور', city: 'عدن — المنصورة', text: 'تغليف فاخر واهتمام بالتفاصيل، والمستشارة ساعدتني أختار روتين مناسب لجفاف البشرة.' },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-start space-y-1">
          <span className="text-xs font-sans text-gold font-semibold">تجارب عميلاتنا</span>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory">شهادات الثقة الموثقة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="samiq-bezel-noir">
              <div className="samiq-bezel-noir-inner p-6 space-y-3 text-start">
                <div className="flex items-center gap-1.5 text-xs text-champagne font-sans">
                  <VerifiedCheckIcon size={14} color="#C9A84C" />
                  <span>تجربة شراء موثقة</span>
                </div>
                <p className="text-sm font-serif text-ivory leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-muted-lux">
                  <span className="font-bold text-champagne">{r.name}</span>
                  <span>{r.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LuxuryCta({ section }: Partial<SectionComponentProps>) {
  const title = (section?.props?.title as string) || 'تحتاجين استشارة دقيقة لاختيار مستحضراتك؟';
  return (
    <section className="w-full py-14 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="samiq-bezel-noir">
          <div className="samiq-bezel-noir-inner p-8 sm:p-10 text-center space-y-4">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory">{title}</h2>
            <p className="text-xs sm:text-sm text-muted-lux font-sans max-w-xl mx-auto leading-relaxed">
              تواصلي مع خبيرات مفتاح الجمال مجاناً لفحص مستحضراتك أو تصميم روتينكِ الصباحي والمسائي.
            </p>
            <div className="pt-2">
              <a
                href="/bookings"
                className="min-h-[44px] px-7 py-3 rounded-full bg-gradient-to-r from-[#BF953F] via-[#F2E2A8] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs sm:text-sm inline-flex items-center gap-2 hover:brightness-105 transition"
              >
                <span>حجز استشارة مجانية</span>
                <span className="rtl:-scale-x-100">←</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LuxuryGallery(_props: Partial<SectionComponentProps>) {
  const gallery = [
    { image: '/media/products/serum-vitamin-c.jpg', label: 'سيروم فيتامين سي النقي' },
    { image: '/media/products/cleanser-hydrating.jpg', label: 'الغسول المرطب بالسيراميدات' },
    { image: '/media/products/cream-moisturizing.jpg', label: 'كريم الترطيب المكثف' },
  ];

  return (
    <section className="w-full py-12 bg-[#070709] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory text-start">معرض التركيبات النقية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gallery.map((g, i) => (
            <div key={i} className="samiq-bezel-noir">
              <div className="samiq-bezel-noir-inner p-3 space-y-2.5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#EDE6DB] to-[#DAD0C1]">
                  <SmartImage src={g.image} alt={g.label} priority={false} sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <p className="text-xs font-serif font-bold text-champagne text-center">{g.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { SectionComponentProps } from '@/themes/contract';
import { EditorialSparkleIcon } from './IvoryIcons';

export function IvoryEditorialQuote({ section }: Partial<SectionComponentProps>) {
  const quoteText =
    (section?.props?.quote as string) ||
    'الجمال الأصيل ليس مجرد مظهر خارجي، بل ثقة مطلقة واطمئنان بما يلامس بشرتكِ كل يوم. في مفتاح الجمال، نتحقق مخبرياً من أرقام التشغيلات وشهادات المنشأ لكل مستحضر لتصلكِ العناية النقية كما صُنعت.';

  const author = (section?.props?.author as string) || 'افتتاحية العدد التحريري · مفتاح الجمال';

  return (
    <section className="w-full bg-[#FAF7F2] py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
        {/* Subtle Champagne Hairline & Icon */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-[#B89B5E]" />
          <EditorialSparkleIcon size={18} color="#B89B5E" />
          <div className="w-12 h-px bg-[#B89B5E]" />
        </div>

        {/* The Pull-Quote in Amiri Serif */}
        <blockquote className="font-serif font-medium text-xl sm:text-3xl lg:text-4xl text-[#1B1612] leading-[1.6] sm:leading-[1.7]">
          &ldquo;{quoteText}&rdquo;
        </blockquote>

        {/* Attribution */}
        <div className="pt-2">
          <span className="font-sans text-xs sm:text-sm font-semibold text-[#5E6B5A]">
            {author}
          </span>
        </div>

        {/* Bottom Hairline */}
        <div className="w-16 h-px bg-[#B89B5E]/40 mx-auto" />
      </div>
    </section>
  );
}

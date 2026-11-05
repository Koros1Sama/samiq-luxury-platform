'use client';

import React from 'react';
import { SectionComponentProps } from '@/themes/contract';
import { EditorialSparkleIcon } from './IvoryIcons';

export function IvoryEditorialQuote({ section }: Partial<SectionComponentProps>) {
  const quoteText =
    (section?.props?.quote as string) ||
    'الجمال الأصيل ليس مجرد مظهر خارجي، بل ثقة مطلقة واطمئنان بما يلامس بشرتكِ كل يوم. في مفتاح الجمال، نلتزم بمطابقة معايير الهيئة العليا للأدوية والمستلزمات الطبية وتوثيق الأصالة لكل مستحضر لتصلكِ العناية النقية كما صُنعت.';

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

        {/* Featured Journal Articles Link Pills */}
        <div className="pt-4 flex items-center justify-center gap-3 flex-wrap text-xs font-sans">
          <a
            href="/blog?post=how-to-verify-vitamin-c-serum"
            className="px-4 py-2 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#1B1612] font-medium transition inline-flex items-center gap-2 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89B5E]" />
            <span>مقال: أسرار فحص سيروم فيتامين سي الأصلي</span>
            <span className="text-[#5E6B5A] rtl:-scale-x-100">←</span>
          </a>
          <a
            href="/blog?post=hydrating-cleanser-original-guide"
            className="px-4 py-2 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#1B1612] font-medium transition inline-flex items-center gap-2 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89B5E]" />
            <span>مقال: دليل الغسول المرطب الأصلي وحماية السيراميدات</span>
            <span className="text-[#5E6B5A] rtl:-scale-x-100">←</span>
          </a>
        </div>

        {/* Bottom Hairline */}
        <div className="w-16 h-px bg-[#B89B5E]/40 mx-auto" />
      </div>
    </section>
  );
}

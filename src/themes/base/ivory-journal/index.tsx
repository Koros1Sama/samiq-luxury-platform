'use client';

import React from 'react';
import { ThemeLayoutProps } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

export function IvoryJournalStubLayout(_props: ThemeLayoutProps) {
  const { tenant } = useStorefront();

  return (
    <div className="min-h-[100dvh] bg-[#FAF7F2] text-[#181512] font-sans flex flex-col justify-between p-6 antialiased">
      <header className="max-w-4xl mx-auto w-full py-6 flex items-center justify-between border-b border-[#181512]/10">
        <h1 className="text-xl font-serif font-bold text-[#181512]">{tenant.name}</h1>
        <span className="text-xs uppercase tracking-widest text-[#B8860B] font-mono">Ivory Journal</span>
      </header>

      <main className="max-w-xl mx-auto text-center space-y-4 my-16">
        <div className="inline-block px-3 py-1 rounded-full bg-[#B8860B]/10 text-[#B8860B] text-xs font-semibold">
          قالب جديد قيد التطوير (Phase C)
        </div>
        <h2 className="text-3xl font-serif font-bold">قالب مجلة العاج (Ivory Journal)</h2>
        <p className="text-sm text-[#6E675F] leading-relaxed">
          هذا القالب التحريري الراقي المخصص للمجلات وعيادات التجميل العالمية يجري بناؤه حالياً ضمن المرحلة C.
          يمكنك تصفح متجر {tenant.name} عبر القالب الافتراضي Luxury Noir.
        </p>
        <div className="pt-4">
          <a
            href="/?theme=luxury-noir"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181512] text-[#FAF7F2] text-xs font-semibold hover:bg-[#332E27] transition"
          >
            العودة إلى قالب Luxury Noir ←
          </a>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto w-full py-6 text-center text-xs text-[#8C8479] border-t border-[#181512]/10">
        منصة سامق — {tenant.legalName || tenant.name}
      </footer>
    </div>
  );
}

export default IvoryJournalStubLayout;

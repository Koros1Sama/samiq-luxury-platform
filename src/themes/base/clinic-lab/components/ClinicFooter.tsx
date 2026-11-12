'use client';

import React from 'react';
import Link from 'next/link';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { ShieldCheckIcon, FlaskIcon } from './ClinicIcons';

/**
 * Dedicated Swiss Clinical Footer for Clinic Lab theme (footer parity).
 * Clears the fixed 56px mobile bottom navigation bar with pb-24 on mobile viewports.
 */
export function ClinicFooter() {
  const { tenant, locale } = useStorefront();
  const isEn = locale === 'en';

  return (
    <footer className="w-full bg-[#0B3A38] text-white pt-12 pb-24 md:pb-12 border-t border-[#18605D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-start">
          {/* Brand & Regulatory Statement */}
          <div className="md:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9ED8CB]">
              <FlaskIcon size={16} />
              <span>{isEn ? 'SWISS DERM PROTOCOL' : 'المعمل السريري المعتمد'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{tenant.name}</h2>
            <p className="text-xs sm:text-sm text-[#CDE7E1] leading-[1.8]">
              {isEn
                ? 'Authorized skincare formulation house compliant with SBDMA regulatory batch audits and cold-chain storage standards.'
                : 'منصة ومعمل مستحضرات عناية أصلية مفحوصة تشغيلة بتشغيلة وفق اشتراطات الهيئة العليا للأدوية والمستلزمات الطبية مع حفظ حراري معتمد.'}
            </p>
          </div>

          {/* Navigation Portal Links */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[#9ED8CB]">
              {isEn ? 'Clinical Portals' : 'البوابات والخدمات السريرية'}
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>
                <Link
                  href="/authenticity-hub"
                  className="min-h-[44px] inline-flex items-center text-white hover:text-[#9ED8CB] transition-colors"
                >
                  {isEn ? 'Authenticity & Batch Verification Hub' : 'موسوعة الفحص وكشف المقلد'}
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="min-h-[44px] inline-flex items-center text-white hover:text-[#9ED8CB] transition-colors"
                >
                  {isEn ? 'Clinical Skin Consultation' : 'حجز استشارة جلدية سريرية'}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="min-h-[44px] inline-flex items-center text-white hover:text-[#9ED8CB] transition-colors"
                >
                  {isEn ? 'Research & Dermatology Journal' : 'المجلة البحثية والعلمية'}
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="min-h-[44px] inline-flex items-center text-white hover:text-[#9ED8CB] transition-colors"
                >
                  {isEn ? 'My Clinical Account & Invoices' : 'ملفي الطبي وفواتيري'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory Seal */}
          <div className="md:col-span-3 p-4 rounded-2xl bg-[#0F4C4A] border border-[#1E6E6A] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#9ED8CB]">
              <ShieldCheckIcon size={16} />
              <span>{isEn ? '100% Genuine Dispatch' : 'ميثاق المعاينة قبل السداد'}</span>
            </div>
            <p className="text-xs text-[#E4F3EF] leading-[1.75]">
              {isEn
                ? 'Full customer right to inspect outer seal, hologram, and batch barcode before cash settlement.'
                : 'حق المعاينة الميدانية ومطابقة الفاتورة والباركود قبل استلام الطلب وسداد قيمته بالكامل.'}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#18605D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9ED8CB]">
          <span>
            © 2026 {tenant.legalName || tenant.name} ·{' '}
            {isEn ? 'All regulatory rights reserved' : 'جميع الحقوق السريرية والتجارية محفوظة'}
          </span>
          <span className="font-mono font-bold tabular-nums">SAMIQ · CLINICAL ARCHITECTURE</span>
        </div>
      </div>
    </footer>
  );
}

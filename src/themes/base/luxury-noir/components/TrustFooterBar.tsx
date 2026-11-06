'use client';

import React from 'react';
import Link from 'next/link';
import { MiftahLogoSvg } from './MiftahLogoSvg';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

export function TrustFooterBar() {
  const { tenant, platformMeta } = useStorefront();

  const contact = tenant.contact || {
    whatsapp: tenant.whatsapp || '775234989',
    phone: tenant.phone || '775234989',
    map: {
      url: tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: tenant.city || 'صنعاء',
    },
  };

  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] relative pt-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-2">
            <MiftahLogoSvg size={42} showText={true} />
            <p className="text-xs text-muted-lux font-sans max-w-sm leading-relaxed">
              {tenant.tagline || 'بوابتك الموثوقة للمنتجات الأصلية وخدمات التسوق الفاخرة في اليمن.'}
            </p>
          </div>

          <div className="md:col-span-6 text-start md:text-end space-y-2">
            <div className="text-xs text-ivory/80 space-y-1 font-sans">
              <p>{contact.map?.label || 'صنعاء — شارع حدة الرئيسي — توصيل فوري'}</p>
              <p className="dir-ltr text-end">خدمة العملاء: +967 {contact.whatsapp}</p>
              <p>أوقات الدوام: يومياً من 9:00 صباحاً حتى 10:00 مساءً</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/30">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs font-serif font-bold text-champagne">
                {tenant.legalName || 'مفتاح الجمال — لكشف المقلد'}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1 flex-wrap justify-start md:justify-end">
              <Link
                href="/account"
                className="min-h-[44px] px-3.5 rounded-lg bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-xs font-sans text-ivory/80 hover:text-champagne transition inline-flex items-center"
              >
                بوابة الحساب والولاء
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-lux font-sans gap-2">
          <p>جميع الحقوق محفوظة {new Date().getFullYear()} {tenant.legalName || tenant.name}.</p>
          <p>
            Designed with Luxury Noir DNA — Verified Authentic Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}

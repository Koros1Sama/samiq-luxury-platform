'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '@/themes/contract';
import {
  LocationPinIcon,
  PhoneIcon,
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  FacebookIcon,
  VerifiedStampIcon,
} from './IvoryIcons';

export function IvoryColophonContact(_props: Partial<SectionComponentProps>) {
  const { tenant } = useStorefront();

  const mapUrl = tenant.contact?.map?.url || tenant.googleMaps || 'https://maps.google.com';
  const whatsappNum = tenant.contact?.whatsapp || tenant.whatsapp || '775234989';
  const phoneNum = tenant.contact?.phone || tenant.phone || '775234989';

  return (
    <footer id="colophon" className="w-full bg-[#F3EFE6] text-[#1B1612] pt-16 sm:pt-24 pb-12 border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        {/* Magazine Colophon Header */}
        <div className="border-b border-[#E8E2D8] pb-6 sm:pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-[#5E6B5A] block mb-1">
              THE COLOPHON · بيانات الإصدار
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B1612]">
              {tenant.name}
            </h2>
            <p className="font-sans text-sm text-[#554D46] mt-1 leading-[1.75]">
              {tenant.tagline || 'المجلة الموثقة للجمال والعناية الفاخرة'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-sans text-[#5E6B5A] border border-[#5E6B5A]/30 px-3 py-1.5 rounded-full bg-[#FAF7F2]">
            <VerifiedStampIcon size={14} color="#5E6B5A" />
            <span>توثيق مخبري معتمد لعام 2026</span>
          </div>
        </div>

        {/* 4-Column Editorial Colophon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-xs sm:text-sm font-sans">
          {/* Column 1: Headquarters & Distribution */}
          <div className="space-y-3">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1B1612] block border-b border-[#E8E2D8] pb-2">
              المقر الرئيسي والتوزيع
            </span>
            <div className="space-y-2 text-[#554D46] leading-[1.75]">
              <p className="font-medium text-[#1B1612] text-sm">
                {tenant.city} — فرع حدة الرئيسي
              </p>
              <p className="text-sm">
                {tenant.deliveryCoverage || 'توصيل فوري لجميع مديريات صنعاء وشحن آمن لكافة المحافظات'}
              </p>
              <div className="pt-2">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 text-[#5E6B5A] hover:text-[#1B1612] font-semibold underline underline-offset-4 transition-colors"
                >
                  <LocationPinIcon size={16} />
                  <span>موقع الفرع على الخريطة</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact Channels */}
          <div className="space-y-3">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1B1612] block border-b border-[#E8E2D8] pb-2">
              الاتصال والاستفسار
            </span>
            <div className="space-y-2 text-[#554D46] leading-[1.75]">
              <p className="text-sm">خدمة العملاء والاستشارات اليومية:</p>
              <div>
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 text-[#1B1612] hover:text-[#5E6B5A] font-mono font-bold transition-colors"
                >
                  <WhatsAppIcon size={16} color="#5E6B5A" />
                  <span>+{whatsappNum}</span>
                </a>
              </div>
              <div>
                <a
                  href={`tel:${phoneNum}`}
                  className="min-h-[44px] inline-flex items-center gap-2 text-[#1B1612] hover:text-[#5E6B5A] font-mono font-bold transition-colors"
                >
                  <PhoneIcon size={16} color="#5E6B5A" />
                  <span>+{phoneNum}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Imprint & Verification */}
          <div className="space-y-3">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1B1612] block border-b border-[#E8E2D8] pb-2">
              الاعتماد والملكية
            </span>
            <div className="space-y-2 text-[#554D46] leading-[1.75]">
              <p className="font-medium text-[#1B1612] text-sm">
                {tenant.legalName || tenant.name}
              </p>
              <p className="text-sm">
                المنصة: سامق للتجارة الإلكترونية الموثقة (SAMIQ Engine).
              </p>
              <p className="text-sm">
                فحص الدفعات: يتم التحقق من كل تشغيلة عبر مطابقة أرقام الباركود والشهادات الجمركية الرسمية.
              </p>
            </div>
          </div>

          {/* Column 4: Official Accounts */}
          <div className="space-y-3">
            <span className="font-serif font-bold text-sm sm:text-base text-[#1B1612] block border-b border-[#E8E2D8] pb-2">
              القنوات الرسمية
            </span>
            <div className="space-y-2">
              <p className="text-[#554D46] text-sm leading-[1.75]">
                تابعي تحديثات أعداد المجلة والتنبيهات المباشرة:
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {tenant.contact?.social?.instagram && (
                  <a
                    href={tenant.contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="حساب انستغرام الرسمي"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full bg-[#FAF7F2] text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                  >
                    <InstagramIcon size={18} />
                  </a>
                )}
                {tenant.contact?.social?.tiktok && (
                  <a
                    href={tenant.contact.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="حساب تيك توك الرسمي"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full bg-[#FAF7F2] text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                  >
                    <TikTokIcon size={18} />
                  </a>
                )}
                {tenant.contact?.social?.facebook && (
                  <a
                    href={tenant.contact.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="صفحة فيسبوك الرسمية"
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#E8E2D8] rounded-full bg-[#FAF7F2] text-[#1B1612] hover:border-[#1B1612] hover:text-[#5E6B5A] transition-colors"
                  >
                    <FacebookIcon size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Hairline & Copyright */}
        <div className="border-t border-[#E8E2D8] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#877E75]">
          <p className="text-sm">
            جميع الحقوق محفوظة لـ {tenant.name} © 2026 · صُمم بنظام المجلة التحريرية العاجية
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[#5E6B5A]">SAMIQ IVORY JOURNAL</span>
            <span>·</span>
            <span>الأصالة أولاً</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

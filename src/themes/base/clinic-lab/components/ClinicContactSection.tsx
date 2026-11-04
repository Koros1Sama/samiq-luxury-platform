'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import {
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
  ClockIcon,
  ShieldCheckIcon,
} from './ClinicIcons';

export function ClinicContactSection() {
  const { tenant } = useStorefront();

  const phone = tenant.contact?.phone || tenant.phone || '775234989';
  const whatsapp = tenant.contact?.whatsapp || tenant.whatsapp || '775234989';
  const mapUrl = tenant.contact?.map?.url || tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9';
  const mapLabel = tenant.contact?.map?.label || 'فرع صنعاء الرئيسي (حدة)';
  const deliveryText = tenant.deliveryCoverage || 'توصيل فوري لجميع مديريات صنعاء وشحن آمن لكافة المحافظات';

  return (
    <section id="contact" className="w-full py-8 sm:py-12 bg-white border-t border-[#E2ECE9]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 text-start">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CFE8E1] text-[#0F4C4A] text-xs font-bold mb-2">
            <ShieldCheckIcon size={14} />
            <span>التواصل المباشر والاعتماد</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F4C4A] leading-tight">
            موقع الفرع وخدمة العملاء
          </h2>
          <p className="text-sm text-[#4A5568] leading-[1.75] mt-1">
            نسعد باستقبالكم في مركز الفحص والاستشارة في صنعاء أو خدمتكم هاتفياً عبر واتساب
          </p>
        </div>

        {/* Plain Clinical Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Branch Location */}
          <div className="bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D4E5E0] text-[#0F4C4A] flex items-center justify-center shrink-0">
                <MapPinIcon size={20} />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0F4C4A] block">
                  المركز الرئيسي والمعمل
                </span>
                <span className="text-xs sm:text-sm text-[#4A5568] leading-[1.75] block mt-1">
                  {mapLabel} — صنعاء، اليمن
                </span>
                <span className="text-xs text-[#0F4C4A]/80 font-medium block mt-1">
                  {deliveryText}
                </span>
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#CFE8E1] text-[#0F4C4A] border border-[#D4E5E0] inline-flex items-center justify-center gap-2 text-xs font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
            >
              <MapPinIcon size={16} />
              <span>فتح الموقع على خرائط Google</span>
            </a>
          </div>

          {/* Card 2: Contact Numbers & WhatsApp */}
          <div className="bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D4E5E0] text-[#0F4C4A] flex items-center justify-center shrink-0">
                <WhatsAppIcon size={20} />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0F4C4A] block">
                  خدمة الطلبات والاستشارة
                </span>
                <span className="text-xs sm:text-sm text-[#4A5568] leading-[1.75] block mt-1">
                  متاحون للرد السريع وتأكيد الطلبات وإرسال نتائج الفحص
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0F4C4A] block mt-1" dir="ltr">
                  +967 {whatsapp}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/967${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white inline-flex items-center justify-center gap-2 text-xs font-bold transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
            >
              <WhatsAppIcon size={16} />
              <span>مراسلة واتساب الفورية</span>
            </a>
          </div>

          {/* Card 3: Working Hours & Quality Guarantee */}
          <div className="bg-[#F2F7F5] rounded-2xl border border-[#D4E5E0] p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D4E5E0] text-[#0F4C4A] flex items-center justify-center shrink-0">
                <ClockIcon size={20} />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-[#0F4C4A] block">
                  ساعات الدوام والفحص
                </span>
                <span className="text-xs sm:text-sm text-[#4A5568] leading-[1.75] block mt-1">
                  السبت إلى الخميس: 9:00 صباحاً – 10:00 مساءً
                </span>
                <span className="text-xs sm:text-sm text-[#4A5568] leading-[1.75] block">
                  الجمعة: 4:00 عصراً – 10:00 مساءً
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#D4E5E0] flex items-center gap-2 text-xs text-[#0F4C4A] font-semibold">
              <ShieldCheckIcon size={16} className="text-[#0F4C4A] shrink-0" />
              <span>ضمان استرجاع فوري 100% في حال عدم مطابقة المنتج</span>
            </div>
          </div>
        </div>

        {/* Bottom Micro Legal / Identity Strip */}
        <div className="mt-8 pt-6 border-t border-[#E2ECE9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <span>© 2026 {tenant.name || 'مفتاح الجمال'}. جميع الحقوق محفوظة — منصة سامق SAMIQ.</span>
          <span className="text-[#0F4C4A] font-semibold">
            معمل سريري مرخص · صنعاء · اليمن
          </span>
        </div>
      </div>
    </section>
  );
}

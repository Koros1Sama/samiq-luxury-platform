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
  const { tenant, platformMeta, features, branches } = useStorefront();

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
                فحص الأصالة: مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية.
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

        {/* Multi-Branch Network (Gated by multi_branch feature) */}
        {features?.multi_branch !== false && branches && branches.length > 0 && (
          <div className="pt-8 border-t border-[#E8E2D8] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-base sm:text-lg text-[#1B1612]">
                فروع ومنافذ التوزيع المعتمدة ({branches.length})
              </span>
              <span className="text-xs font-sans text-[#5E6B5A]">
                استلام فوري وفحص معتمد
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((b: any) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs font-sans"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#1B1612]">
                      {b.nameAr || b.name}
                    </span>
                    {b.isMain && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF5EE] text-[#2D6A4F] font-bold">
                        المقر الرئيسي
                      </span>
                    )}
                  </div>
                  <p className="text-[#554D46] leading-[1.6]">
                    {b.cityAr || b.city} — {b.addressAr || b.address}
                  </p>
                  <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-[#877E75]">
                    <span>{b.hoursAr || b.workingHours || 'يومياً 9 ص - 10 م'}</span>
                    <a href={`tel:${b.phone}`} className="font-mono font-bold text-[#1B1612] hover:underline">
                      {b.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated SAMIQ Engine Developer Signature Bar */}
        <div className="border border-[#DCD3C5] bg-[#EFE9DC] p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="text-center md:text-start space-y-1">
            <p className="font-serif font-bold text-[#1B1612] text-sm">
              يعمل بمحرك سَامِق (SAMIQ) للمتاجر الفاخرة — هل ترغب بمتجر مماثل لعلامتك التجارية؟
            </p>
            <p className="text-[#6B6157] text-xs">
              منصة هندسة المتاجر الرقمية الفاخرة والذكاء الاصطناعي للمتاجر التخصصية
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={platformMeta?.showcasePath || '/samiq'}
              className="min-h-[44px] px-4 rounded-full bg-[#1B1612] hover:bg-[#3D332A] text-[#FAF7F2] text-xs font-bold transition inline-flex items-center"
            >
              استعراض المزايا وقائمة الأسعار
            </a>
            <a
              href={platformMeta?.developerTelegramUrl || 'https://t.me/KorosSenpai'}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 rounded-full bg-[#FAF7F2] hover:bg-[#E8E2D8] text-[#1B1612] border border-[#DCD3C5] text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <span>تواصل مع المطور عبر تيليجرام (@{platformMeta?.developerTelegramHandle || 'KorosSenpai'})</span>
            </a>
          </div>
        </div>

        {/* Bottom Colophon Hairline & Copyright */}
        <div className="border-t border-[#E8E2D8] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#877E75]">
          <p className="text-sm">
            جميع الحقوق محفوظة لـ {tenant.legalName || tenant.name} © 2026 · صُمم بنظام المجلة التحريرية العاجية
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="/account"
              className="min-h-[44px] px-3.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#1B1612] hover:bg-[#1B1612] hover:text-[#FAF7F2] transition inline-flex items-center"
            >
              حسابي والولاء
            </a>
            <a
              href="/admin"
              className="min-h-[44px] px-3.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#1B1612] hover:bg-[#1B1612] hover:text-[#FAF7F2] transition inline-flex items-center"
            >
              الإدارة
            </a>
            <a
              href="/platform"
              className="min-h-[44px] px-3.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#1B1612] hover:bg-[#1B1612] hover:text-[#FAF7F2] transition inline-flex items-center"
            >
              منصة سامق
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

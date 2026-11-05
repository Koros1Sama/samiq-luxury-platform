'use client';

import React from 'react';
import {
  TikTokIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  MapPinIcon,
} from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionComponentProps } from '../../../contract';

export function StoreLocationAndSocial(_props: Partial<SectionComponentProps>) {
  const { tenant, features, branches } = useStorefront();

  const contact = tenant.contact || {
    whatsapp: tenant.whatsapp || '775234989',
    phone: tenant.phone || '775234989',
    social: {
      tiktok: tenant.tiktok || 'https://www.tiktok.com/@tamiffttah',
      instagram: tenant.instagram || 'https://www.instagram.com/tamifttah',
      facebook: tenant.facebook || 'https://www.facebook.com',
      tiktokHandle: '@tamiffttah',
    },
    map: {
      url: tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: tenant.city || 'صنعاء',
    },
  };

  const channels = [
    {
      name: `تيك توك (${contact.social?.tiktokHandle || '@tamiffttah'})`,
      role: 'مقاطع فحص الباركود ومراجعات المستحضرات',
      url: contact.social?.tiktok || 'https://www.tiktok.com',
      icon: <TikTokIcon size={20} color="#C9A84C" />,
    },
    {
      name: `إنستغرام ${tenant.name}`,
      role: 'إعلانات الشحنات وتجارب العملاء الموثقة',
      url: contact.social?.instagram || 'https://www.instagram.com',
      icon: <InstagramIcon size={20} color="#C9A84C" />,
    },
    {
      name: 'واتساب خدمة العملاء والطلبات',
      role: 'استشارة فورية والطلب المباشر مع خبراء التجميل',
      url: `https://wa.me/${contact.whatsapp?.startsWith('967') ? contact.whatsapp : `967${contact.whatsapp}`}`,
      icon: <WhatsAppIcon size={20} color="#C9A84C" />,
    },
    {
      name: `فيسبوك ${tenant.name}`,
      role: 'مجتمع المتجر ومشاركات العملاء الرسمية',
      url: contact.social?.facebook || 'https://www.facebook.com',
      icon: <FacebookIcon size={20} color="#C9A84C" />,
    },
  ];

  return (
    <section id="store-location" className="py-8 sm:py-14 border-t border-white/[0.08] bg-[#070709]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-xs text-champagne font-sans">
            <MapPinIcon size={14} color="#C9A84C" />
            <span>زورونا وتواصلوا معنا</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-ivory">
            القنوات الرسمية وموقع المتجر
          </h2>
          <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
            نسعد باستقبالكم في فرعنا الرئيسي بصنعاء أو عبر قنواتنا المعتمدة لتقديم الاستشارات والمطابقة.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Map Location Card (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0E0E12] border border-white/10 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <MapPinIcon size={22} color="#C9A84C" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-ivory">
                    {contact.map?.label}
                  </h3>
                  <span className="text-xs text-muted-lux font-sans block">
                    {contact.map?.city} — شارع حدة الرئيسي
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-lux font-sans leading-relaxed">
                معرضنا مجهز بدليل كشف المقلد وفحص علامات الأصلي ومطابقة معايير الهيئة العليا للأدوية أمام العميل فوراً قبل الشراء.
              </p>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 text-xs font-sans text-ivory/80">
                <p>أوقات الدوام: يومياً من 9:00 صباحاً حتى 10:00 مساءً</p>
                <p>خدمة التوصيل: فوري خلال ساعتين داخل صنعاء</p>
              </div>
            </div>

            <a
              href={contact.map?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:brightness-110 transition shadow-md"
            >
              <MapPinIcon size={16} color="#070709" />
              <span>فتح الموقع المباشر في خرائط Google</span>
            </a>
          </div>

          {/* Channels Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {channels.map((ch, idx) => (
              <a
                key={idx}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] p-3.5 rounded-2xl bg-[#0E0E12] border border-white/5 hover:border-gold/40 flex flex-col justify-between space-y-2.5 transition group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-champagne shrink-0 group-hover:scale-105 transition">
                    {ch.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-ivory group-hover:text-champagne transition line-clamp-1">
                      {ch.name}
                    </h4>
                    <p className="text-xs text-muted-lux font-sans line-clamp-1 mt-0.5">
                      {ch.role}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gold font-sans font-bold">
                  <span>متابعة القناة</span>
                  <span className="rtl:-scale-x-100">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Multi-Branch Network (Gated by multi_branch feature) */}
        {features?.multi_branch !== false && branches && branches.length > 0 && (
          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                شبكة فروع ومراكز الخدمة المعتمدة ({branches.length})
              </h3>
              <span className="text-xs text-gold font-sans font-semibold">
                فحص فوري وتسليم مباشر
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {branches.map((b: any) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-[#0E0E12] border border-white/5 hover:border-gold/30 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ivory">
                      {b.nameAr || b.name}
                    </span>
                    {b.isMain && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                        الفرع الرئيسي
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-lux font-sans leading-relaxed">
                    {b.cityAr || b.city} — {b.addressAr || b.address}
                  </p>

                  <div className="text-[11px] text-ivory/70 font-sans flex items-center justify-between pt-1 border-t border-white/5">
                    <span>{b.hoursAr || b.workingHours || 'يومياً: 9 ص - 10 م'}</span>
                    <a
                      href={`tel:${b.phone}`}
                      className="text-gold hover:underline font-mono"
                    >
                      {b.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

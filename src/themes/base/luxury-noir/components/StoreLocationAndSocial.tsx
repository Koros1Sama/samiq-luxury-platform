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
  const { tenant } = useStorefront();

  const contact = tenant.contact || {
    whatsapp: tenant.whatsapp || '775234989',
    phone: tenant.phone || '775234989',
    social: {
      tiktok: tenant.tiktok || 'https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0',
      instagram: tenant.instagram || 'https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53',
      facebook: tenant.facebook || 'https://www.facebook.com/share/1XjEnK4CeM/',
      tiktokHandle: '@tamiffttah',
      instagramHandle: '@tamifttah',
    },
    map: {
      url: tenant.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: 'فرع صنعاء الرئيسي (حدة)',
      city: tenant.city || 'صنعاء',
    },
  };

  const channels = [
    ...(contact.social.tiktok
      ? [
          {
            id: 'tiktok',
            name: `تيك توك الرسمي (${contact.social.tiktokHandle || '@tamiffttah'})`,
            role: 'مقاطع فحص الباركود ومراجعات المستحضرات',
            handle: contact.social.tiktokHandle || '@tamiffttah',
            url: contact.social.tiktok,
            icon: <TikTokIcon size={20} color="#C9A84C" />,
            cta: 'مشاهدة المقاطع الحصرية ←',
          },
        ]
      : []),
    ...(contact.social.instagram
      ? [
          {
            id: 'instagram',
            name: `إنستغرام ${tenant.name}`,
            role: 'إعلانات الشحنات وتجارب العملاء',
            handle: contact.social.instagramHandle || '@tamifttah',
            url: contact.social.instagram,
            icon: <InstagramIcon size={20} color="#C9A84C" />,
            cta: 'متابعة الحساب الموثق ←',
          },
        ]
      : []),
    ...(contact.whatsapp
      ? [
          {
            id: 'whatsapp',
            name: 'واتساب خدمة العملاء والطلبات',
            role: 'استشارة فورية والطلب المباشر',
            handle: contact.whatsapp,
            url: `https://wa.me/${contact.whatsapp.startsWith('967') ? contact.whatsapp : `967${contact.whatsapp}`}`,
            icon: <WhatsAppIcon size={20} color="#C9A84C" />,
            cta: 'محادثة فورية عبر واتساب ←',
          },
        ]
      : []),
    ...(contact.social.facebook
      ? [
          {
            id: 'facebook',
            name: `فيسبوك ${tenant.name}`,
            role: 'مجتمع المتجر ومشاركات العملاء',
            handle: tenant.name,
            url: contact.social.facebook,
            icon: <FacebookIcon size={20} color="#C9A84C" />,
            cta: 'زيارة الصفحة الرسمية ←',
          },
        ]
      : []),
  ];

  return (
    <section id="store-location" className="py-10 md:py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-[11px] text-champagne font-sans">
            <MapPinIcon size={13} color="#C9A84C" />
            <span>زورونا وتواصلوا معنا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
            القنوات الرسمية وموقع المتجر
          </h2>
          <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
            تابعي مقاطع الفحص الحصرية على منصاتنا الرسمية أو تفضلي بزيارتنا
          </p>
        </div>

        {/* 2 Columns: Official Social Channels + Google Maps Location Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Social Channels (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {channels.map((ch) => (
              <a
                key={ch.id}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-surface border border-white/5 hover:border-gold/40 hover:bg-surface-elevated transition-all flex flex-col justify-between group space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/40 transition-colors">
                    {ch.icon}
                  </div>
                  <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20">
                    رسمي موثق
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-ivory group-hover:text-champagne transition-colors">
                    {ch.name}
                  </h3>
                  <p className="text-[11px] text-muted-lux mt-0.5 leading-snug">{ch.role}</p>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gold font-medium">
                  <span>{ch.cta}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Google Maps Location Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-surface border border-gold/30 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-champagne flex items-center gap-1.5">
                  <MapPinIcon size={15} color="#C9A84C" />
                  <span>{contact.map.label || `فرع ${tenant.name}`}</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  مفتوح الآن
                </span>
              </div>

              <h3 className="text-base font-serif font-bold text-ivory">
                {contact.map.label}
              </h3>
              <p className="text-xs text-muted-lux font-sans leading-relaxed">
                {contact.map.city}. متوفر خدمة معاينة المنتجات وفحص الباركود والاستشارات المباشرة.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-muted-lux font-sans">
                <div className="flex items-center justify-between">
                  <span>ساعات الدوام اليومية:</span>
                  <span className="text-ivory font-medium">9:00 ص — 10:00 م</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>خدمة التوصيل:</span>
                  <span className="text-gold font-medium">{tenant.deliveryCoverage || 'توصيل فوري'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>رقم التواصل المباشر:</span>
                  <span className="text-ivory font-mono">{contact.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <a
                href={contact.map.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold text-xs hover:brightness-110 shadow-md transition flex items-center justify-center gap-2"
              >
                <MapPinIcon size={14} color="#070709" />
                <span>افتح الموقع في خرائط Google ←</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

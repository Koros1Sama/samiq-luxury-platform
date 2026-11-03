import React from 'react';
import { MiftahLogoSvg } from './MiftahLogoSvg';
import {
  ShieldCheckIcon,
  DeliveryVanIcon,
  ConciergeHeadsetIcon,
  TikTokIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  MapPinIcon,
} from './LuxuryIcons';

export function TrustFooterBar() {
  const trustFeatures = [
    {
      icon: <ShieldCheckIcon size={26} color="#C9A84C" />,
      title: 'ضمان الأصالة',
      desc: 'فحص الباركود والباتش محلياً قبل الاستلام',
    },
    {
      icon: <DeliveryVanIcon size={26} color="#C9A84C" />,
      title: 'شحن سريع لكل المناطق',
      desc: 'توصيل فوري بصنعاء وشحن آمن لكافة المحافظات',
    },
    {
      icon: <ConciergeHeadsetIcon size={26} color="#C9A84C" />,
      title: 'دعم متخصص لجمالك',
      desc: 'استشارات مجانية وروتين مخصص مع خبيراتنا',
    },
  ];

  return (
    <footer className="bg-obsidian-dark border-t border-white/[0.08] relative pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Trust Badges (Matching Phone Screen Dock in Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-white/5">
          {trustFeatures.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-surface/50 border border-white/5 flex items-center gap-4 hover:border-gold/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-serif font-bold text-ivory">
                  {f.title}
                </h4>
                <p className="text-xs text-muted-lux font-sans">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Main Content */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 space-y-3">
            <MiftahLogoSvg size={54} />
            <p className="text-xs text-muted-lux font-sans max-w-sm leading-relaxed mt-2">
              المتجر الأول في اليمن المتخصص في كشف ومقارنة المستحضرات الأصلية والبدائل
              المغشوشة، لضمان صحة بشرتكِ وجمالكِ الدائم.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-start">
            <span className="text-xs font-sans text-gold font-semibold uppercase tracking-wider block">
              خدمة العملاء والطلبات المباشرة
            </span>
            <div className="text-xs text-ivory/80 space-y-1 font-sans">
              <p>صنعاء — شارع حدة / توصيل فوري لكافة المحافظات</p>
              <p className="dir-ltr text-end sm:text-start">WhatsApp: +967 775 234 989</p>
              <p>أوقات العمل: يومياً من 9:00 صباحاً حتى 10:00 مساءً</p>
            </div>
            {/* Official Social Links */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://www.tiktok.com/@tamiffttah?_r=1&_t=ZS-9B6mlZDXTA0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 flex items-center justify-center text-champagne transition"
                title="تيك توك"
              >
                <TikTokIcon size={15} color="#C9A84C" />
              </a>
              <a
                href="https://www.instagram.com/tamifttah?rpxt=dXlocW9teTEyMW53"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 flex items-center justify-center text-champagne transition"
                title="إنستغرام"
              >
                <InstagramIcon size={15} color="#C9A84C" />
              </a>
              <a
                href="https://wa.me/967775234989"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 flex items-center justify-center text-champagne transition"
                title="واتساب"
              >
                <WhatsAppIcon size={15} color="#C9A84C" />
              </a>
              <a
                href="https://www.facebook.com/share/1XjEnK4CeM/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 flex items-center justify-center text-champagne transition"
                title="فيسبوك"
              >
                <FacebookIcon size={15} color="#C9A84C" />
              </a>
              <a
                href="https://maps.app.goo.gl/DxsZTHrv2r386bXa9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 flex items-center justify-center text-champagne transition"
                title="موقع المتجر على خرائط جوجل"
              >
                <MapPinIcon size={15} color="#C9A84C" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 text-start md:text-end space-y-2">
            <span className="text-[11px] font-sans text-muted-lux block">
              نظام المنصة والبنية التحتية:
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/30">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs font-serif font-bold text-champagne">
                منصة سَامِق (SAMIQ Engine)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-lux font-sans gap-3">
          <p>جميع الحقوق محفوظة {new Date().getFullYear()} مفتاح الجمال.</p>
          <p className="text-[11px]">
            Designed with Luxury Noir DNA — Verified Authentic Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}

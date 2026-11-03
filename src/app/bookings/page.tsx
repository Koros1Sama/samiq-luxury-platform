'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MiftahLogoSvg } from '@/themes/base/luxury-noir/components/MiftahLogoSvg';
import {
  ConciergeHeadsetIcon,
  VerifiedCheckIcon,
  SparkleStarIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';

const SERVICES = [
  {
    id: 'skin_consultation',
    title: 'فحص حاجز البشرة وتشخيص المشكلات',
    duration: '30 دقيقة',
    priceYer: 'مجاناً مع كل طلب',
    description: 'جلسة تقييم شاملة لنوع بشرتكِ وإفرازات الدهون وتحديد المستحضرات المناسبة دون أي مجازفة.',
  },
  {
    id: 'routine_design',
    title: 'تصميم روتين علاجي متكامل (صباحي / مسائي)',
    duration: '45 دقيقة',
    priceYer: 'مجاناً',
    description: 'خطة علاجية مخصصة تجمع بين التنظيف، الترطيب، السيرومات العلاجية، وحماية الشمس.',
  },
  {
    id: 'makeup_match',
    title: 'مطابقة درجات كريم الأساس والأرواج',
    duration: '20 دقيقة',
    priceYer: 'مجاناً',
    description: 'مساعدتكِ في اختيار الدرجة المتطابقة تماماً مع الأندرتون الطبيعي لبشرتكِ لمنع التكتل أو التأكسد.',
  },
  {
    id: 'authenticity_check',
    title: 'فحص مستحضراتكِ الحالية والتأكد من أصالتها',
    duration: '15 دقيقة',
    priceYer: 'مجاناً (خدمة مجتمعية)',
    description: 'احضري أي عبوة مشكوك بأمرها لفرعنا وسيقوم خبراؤنا بفحص الباركود والتشغيلة والقوام مجاناً.',
  },
];

export default function BookingsPage() {
  const [selectedService, setSelectedService] = useState('skin_consultation');
  const [selectedBranch, setSelectedBranch] = useState('branch-sanaa');
  const [bookingDate, setBookingDate] = useState('2026-11-10');
  const [bookingTime, setBookingTime] = useState('04:30 PM');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/store/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          serviceType: selectedService,
          branchId: selectedBranch,
          bookingDate,
          bookingTime,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-obsidian/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <MiftahLogoSvg size={46} />
          </Link>
          <Link href="/" className="text-xs font-sans text-ivory/80 hover:text-champagne transition">
            العودة للمتجر الرئيسي ←
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-champagne text-xs font-sans font-semibold">
            <ConciergeHeadsetIcon size={16} color="#C9A84C" />
            <span>حجز موعد استشارة مجانية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ivory">
            استشارة مخصصة لجمالكِ مع خبيراتنا
          </h1>
          <p className="text-xs sm:text-sm text-muted-lux font-sans leading-relaxed">
            احجزي جلستكِ الشخصية حضورياً في فرع صنعاء (حدة) أو عبر اتصال مرئي موجه لتحديد الروتين المناسب لبشرتكِ.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-3xl bg-surface border border-emerald-500/40 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <VerifiedCheckIcon size={28} color="#34D399" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-ivory">
              تم تأكيد حجز موعدكِ بنجاح
            </h2>
            <p className="text-xs sm:text-sm text-muted-lux font-sans max-w-md mx-auto leading-relaxed">
              سنتواصل معكِ على الرقم ({customerPhone}) للتأكيد وإرسال رابط الجلسة أو تفاصيل زيارة الفرع في صنعاء.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex px-6 py-3 rounded-full bg-gold text-obsidian-dark font-sans font-bold text-xs"
              >
                العودة إلى المتجر
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Select Service */}
            <div className="space-y-3">
              <span className="text-xs font-sans text-gold font-bold uppercase tracking-wider block">
                1. اختاري نوع الاستشارة:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((srv) => {
                  const isSelected = selectedService === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#1E1B15] to-[#121118] border-gold text-champagne shadow-md'
                          : 'bg-surface/80 border-white/10 hover:border-white/20 text-ivory/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-serif font-bold text-ivory">{srv.title}</h3>
                        <span className="text-[10px] text-gold font-sans font-bold">{srv.priceYer}</span>
                      </div>
                      <p className="text-xs text-muted-lux font-sans leading-relaxed">{srv.description}</p>
                      <span className="text-[10px] text-muted-lux mt-2 block font-sans">المدة: {srv.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location and Timing */}
            <div className="space-y-3">
              <span className="text-xs font-sans text-gold font-bold uppercase tracking-wider block">
                2. المكان والموعد المناسب:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-lux block mb-1">الفرع / طريقة الجلسة:</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  >
                    <option value="branch-sanaa">فرع صنعاء الرئيسي (شارع حدة)</option>
                    <option value="branch-aden">نقطة تسليم عدن (المنصورة)</option>
                    <option value="online-whatsapp">استشارة أونلاين عبر مكالمة واتساب</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-lux block mb-1">التاريخ المفضل:</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-lux block mb-1">الوقت المناسب:</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  >
                    <option value="11:00 AM">11:00 صباحاً</option>
                    <option value="04:30 PM">04:30 عصراً</option>
                    <option value="06:00 PM">06:00 مساءً</option>
                    <option value="08:30 PM">08:30 مساءً</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Contact Info */}
            <div className="space-y-3">
              <span className="text-xs font-sans text-gold font-bold uppercase tracking-wider block">
                3. بيانات التواصل:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="الاسم الكريم"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="رقم الهاتف أو الواتساب للتأكيد"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                />
              </div>
              <textarea
                rows={2}
                placeholder="أية ملاحظات أو استفسار عن نوع بشرتكِ أو المشكلة التي تعانين منها..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-xs text-ivory focus:border-gold outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_25px_rgba(201,168,76,0.35)] hover:brightness-110 transition disabled:opacity-50"
            >
              {isLoading ? 'جاري تثبيت الحجز...' : 'تأكيد حجز الموعد المجاني ↵'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ConciergeHeadsetIcon,
  VerifiedCheckIcon,
} from '@/themes/base/luxury-noir/components/LuxuryIcons';
import { SubpageThemeWrapper, useSubpageTheme } from '@/core/storefront/SubpageThemeWrapper';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { isValidThemeId, ThemeId } from '@/themes/contract';
import { resolveThemePalette } from '@/core/storefront/themePalette';

const SERVICES = [
  {
    id: 'skin_consultation',
    titleAr: 'فحص حاجز البشرة وتشخيص المشكلات',
    titleEn: 'Skin Barrier Assessment & Consultation',
    durationAr: '30 دقيقة',
    durationEn: '30 min',
    priceAr: 'مجاناً مع كل طلب',
    priceEn: 'Complimentary with any order',
    descriptionAr: 'جلسة تقييم شاملة لنوع بشرتكِ وإفرازات الدهون وتحديد المستحضرات المناسبة دون أي مجازفة.',
    descriptionEn: 'Comprehensive evaluation of sebum production, lipid barrier integrity, and customized curation.',
  },
  {
    id: 'routine_design',
    titleAr: 'تصميم روتين علاجي متكامل (صباحي / مسائي)',
    titleEn: 'Day & Night Treatment Routine Design',
    durationAr: '45 دقيقة',
    durationEn: '45 min',
    priceAr: 'مجاناً',
    priceEn: 'Complimentary',
    descriptionAr: 'خطة علاجية مخصصة تجمع بين التنظيف، الترطيب، السيرومات العلاجية، وحماية الشمس.',
    descriptionEn: 'Personalized clinical regimen integrating active serums, hydration, and UV defense.',
  },
  {
    id: 'makeup_match',
    titleAr: 'مطابقة درجات كريم الأساس والأرواج',
    titleEn: 'Foundation Undertone & Shade Match',
    durationAr: '20 دقيقة',
    durationEn: '20 min',
    priceAr: 'مجاناً',
    priceEn: 'Complimentary',
    descriptionAr: 'مساعدتكِ في اختيار الدرجة المتطابقة تماماً مع الأندرتون الطبيعي لبشرتكِ لمنع التكتل أو التأكسد.',
    descriptionEn: 'Expert shade matching tailored to prevent flash-back, oxidizing, or caking.',
  },
  {
    id: 'authenticity_check',
    titleAr: 'فحص مستحضراتكِ الحالية والتأكد من أصالتها',
    titleEn: 'In-Store Physical Authenticity Verification',
    durationAr: '15 دقيقة',
    durationEn: '15 min',
    priceAr: 'مجاناً (خدمة مجتمعية)',
    priceEn: 'Complimentary community service',
    descriptionAr: 'احضري أي عبوة مشكوك بأمرها لفرعنا وسيقوم خبراؤنا بفحص الباركود وختم الأصالة والقوام مجاناً.',
    descriptionEn: 'Bring any questionable cosmetics to our Sanaa flagship for physical and barcode verification.',
  },
];

function BookingsContent() {
  const subCtx = useSubpageTheme();
  const sf = useStorefront();
  const [urlTheme, setUrlTheme] = useState<ThemeId | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const q = new URLSearchParams(window.location.search).get('theme');
        if (q && isValidThemeId(q)) {
          setUrlTheme(q as ThemeId);
          subCtx.setActiveTheme(q as ThemeId);
        }
      } catch {
        // fallback
      }
    }
  }, [subCtx]);

  const activeTheme = subCtx.activeTheme || urlTheme || 'luxury-noir';
  const palette = resolveThemePalette(activeTheme, sf.customPalette);
  const isLight = palette.isLight;
  const isEn = subCtx.locale === 'en';

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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-sans font-bold"
          style={{
            borderColor: `${palette.accent}50`,
            backgroundColor: `${palette.accent}15`,
            color: palette.accent,
          }}
        >
          <ConciergeHeadsetIcon size={16} color={palette.accent} />
          <span>{isEn ? 'Complimentary Beauty Consultation' : 'حجز موعد استشارة مجانية'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
          {isEn ? 'Personalized Skincare Consultation' : 'استشارة مخصصة لجمالكِ مع خبيراتنا'}
        </h1>
        <p className="text-xs sm:text-sm font-sans leading-relaxed" style={{ color: palette.muted }}>
          {isEn
            ? 'Schedule your private appointment at our Sanaa (Hadda) flagship or via interactive WhatsApp video call.'
            : 'احجزي جلستكِ الشخصية حضورياً في فرع صنعاء (حدة) أو عبر اتصال مرئي موجه لتحديد الروتين المناسب لبشرتكِ.'}
        </p>
      </div>

      {isSuccess ? (
        <div
          className="p-8 rounded-3xl border text-center space-y-4 animate-fadeIn"
          style={{ backgroundColor: palette.surface, borderColor: `${palette.accent}60` }}
        >
          <div
            className="w-16 h-16 mx-auto rounded-full border flex items-center justify-center"
            style={{
              backgroundColor: `${palette.accent}20`,
              borderColor: palette.accent,
              color: palette.accent,
            }}
          >
            <VerifiedCheckIcon size={28} color={palette.accent} />
          </div>
          <h2 className="text-2xl font-serif font-bold leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
            {isEn ? 'Your Consultation is Confirmed!' : 'تم تأكيد حجز موعدكِ بنجاح'}
          </h2>
          <p className="text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed" style={{ color: palette.muted }}>
            {isEn
              ? `We will reach out at (${customerPhone}) to confirm session details and share appointment reminders.`
              : `سنتواصل معكِ على الرقم (${customerPhone}) للتأكيد وإرسال رابط الجلسة أو تفاصيل زيارة الفرع في صنعاء.`}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center min-h-[44px] px-6 py-2.5 rounded-full font-sans font-bold text-xs transition hover:brightness-110"
              style={{
                backgroundColor: palette.accent,
                color: isLight ? '#FFFFFF' : '#0B0B0C',
              }}
            >
              {isEn ? 'Return to Storefront' : 'العودة إلى المتجر'}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Select Service */}
          <div className="space-y-3">
            <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
              {isEn ? '1. Select Consultation Type:' : '1. اختاري نوع الاستشارة:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv) => {
                const isSelected = selectedService === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className="cursor-pointer p-4 rounded-2xl border transition-all"
                    style={{
                      backgroundColor: isSelected ? `${palette.accent}15` : palette.surface,
                      borderColor: isSelected ? palette.accent : palette.border,
                      boxShadow: isSelected ? `0 0 12px ${palette.accent}25` : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-serif font-bold leading-[1.45] md:leading-[1.4]" style={{ color: palette.text }}>
                        {isEn ? srv.titleEn : srv.titleAr}
                      </h3>
                      <span className="text-xs font-sans font-bold" style={{ color: palette.accent }}>
                        {isEn ? srv.priceEn : srv.priceAr}
                      </span>
                    </div>
                    <p className="text-xs font-sans leading-relaxed" style={{ color: palette.muted }}>
                      {isEn ? srv.descriptionEn : srv.descriptionAr}
                    </p>
                    <span className="text-[11px] mt-2 block font-sans" style={{ color: palette.muted }}>
                      {isEn ? `Duration: ${srv.durationEn}` : `المدة: ${srv.durationAr}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Location and Timing */}
          <div className="space-y-3">
            <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
              {isEn ? '2. Location & Date:' : '2. المكان والموعد المناسب:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs block mb-1" style={{ color: palette.muted }}>
                  {isEn ? 'Branch / Format:' : 'الفرع / طريقة الجلسة:'}
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border text-xs outline-hidden"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    color: palette.text,
                  }}
                >
                  <option value="branch-sanaa">
                    {isEn ? 'Sanaa Flagship (Hadda St)' : 'فرع صنعاء الرئيسي (شارع حدة)'}
                  </option>
                  <option value="branch-aden">
                    {isEn ? 'Aden Delivery Hub (Al-Mansoura)' : 'نقطة تسليم عدن (المنصورة)'}
                  </option>
                  <option value="online-whatsapp">
                    {isEn ? 'Online Video Consultation' : 'استشارة أونلاين عبر مكالمة واتساب'}
                  </option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: palette.muted }}>
                  {isEn ? 'Preferred Date:' : 'التاريخ المفضل:'}
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border text-xs outline-hidden"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    color: palette.text,
                  }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: palette.muted }}>
                  {isEn ? 'Time Slot:' : 'الوقت المناسب:'}
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border text-xs outline-hidden"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    color: palette.text,
                  }}
                >
                  <option value="11:00 AM">{isEn ? '11:00 AM' : '11:00 صباحاً'}</option>
                  <option value="04:30 PM">{isEn ? '04:30 PM' : '04:30 عصراً'}</option>
                  <option value="06:00 PM">{isEn ? '06:00 PM' : '06:00 مساءً'}</option>
                  <option value="08:30 PM">{isEn ? '08:30 PM' : '08:30 مساءً'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Contact Info */}
          <div className="space-y-3">
            <span className="text-xs font-sans font-bold block" style={{ color: palette.accent }}>
              {isEn ? '3. Contact Information:' : '3. بيانات التواصل:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder={isEn ? 'Full Name' : 'الاسم الكريم'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="min-h-[44px] px-4 py-3 rounded-xl border text-xs outline-hidden"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  color: palette.text,
                }}
              />
              <input
                type="tel"
                required
                placeholder={isEn ? 'Phone / WhatsApp Number' : 'رقم الهاتف أو الواتساب للتأكيد'}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="min-h-[44px] px-4 py-3 rounded-xl border text-xs outline-hidden"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                  color: palette.text,
                }}
              />
            </div>
            <textarea
              rows={2}
              placeholder={
                isEn
                  ? 'Notes on skin concerns, allergies, or current products...'
                  : 'أية ملاحظات أو استفسار عن نوع بشرتكِ أو المشكلة التي تعانين منها...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border text-xs outline-hidden resize-none"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.border,
                color: palette.text,
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-4 rounded-2xl font-sans font-bold text-sm shadow-md hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 inline-flex items-center justify-center"
            style={{
              backgroundColor: palette.accent,
              color: isLight ? '#FFFFFF' : '#0B0B0C',
            }}
          >
            {isLoading
              ? isEn
                ? 'Securing Consultation...'
                : 'جاري تثبيت الحجز...'
              : isEn
              ? 'Confirm Free Consultation Appointment'
              : 'تأكيد حجز الموعد المجاني'}
          </button>
        </form>
      )}
    </main>
  );
}

export default function BookingsPage() {
  return (
    <SubpageThemeWrapper activeNav="bookings" showNavHeader={true} showFooter={true} showSimulator={true}>
      <BookingsContent />
    </SubpageThemeWrapper>
  );
}

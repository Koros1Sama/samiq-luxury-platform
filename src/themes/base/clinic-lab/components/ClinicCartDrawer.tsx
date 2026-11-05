'use client';

import React, { useState } from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { useCheckout } from '@/core/storefront/useCheckout';
import { formatCurrency } from '@/core/currency/formatter';
import { SmartImage } from '@/core/ui/SmartImage';
import {
  BagIcon,
  CloseIcon,
  PlusIcon,
  MinusIcon,
  WhatsAppIcon,
  ShieldCheckIcon,
  CheckIcon,
} from './ClinicIcons';

export function ClinicCartDrawer(_props?: Record<string, never>) {
  const { cart, currency, features } = useStorefront();
  const checkout = useCheckout();
  const [step, setStep] = useState<'items' | 'checkout' | 'success'>('items');

  if (!cart.isOpen) return null;

  const paymentOptions = [
    { id: 'cod' as const, label: 'الدفع عند الاستلام (كاش)' },
    { id: 'kuraimi' as const, label: 'بنك الكريمي (ام فلوس)' },
    { id: 'floosak' as const, label: 'محفظة فلوسك' },
    { id: 'jeeb' as const, label: 'محفظة جيب / جوالي' },
  ];

  const handleWhatsAppCheckout = () => {
    const orderNumber = `CLN-${Date.now().toString().slice(-6)}`;
    const url = checkout.buildWhatsAppOrderUrl(orderNumber);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkout.submitOrder({ redirectWhatsApp: false });
    if (res?.success) {
      setStep('success');
      cart.clear();
    }
  };

  const formattedSubtotal = formatCurrency(checkout.subtotalCurrent, currency);
  const formattedShipping = formatCurrency(checkout.shippingFeeCurrent, currency);
  const formattedFinalTotal = formatCurrency(checkout.totalCurrent, currency);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="سلة المشتريات والطلب"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity"
    >
      {/* Backdrop overlay dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={cart.close}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden text-start">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2ECE9] flex items-center justify-between gap-3 bg-[#F2F7F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center">
              <BagIcon size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F4C4A] leading-tight">
                سلة المستحضرات الطبية
              </h2>
              <span className="text-xs text-[#0F4C4A]/80 font-medium">
                {cart.count} منتجات مختارة
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={cart.close}
            className="min-w-[44px] min-h-[44px] rounded-lg bg-white border border-[#D4E5E0] text-[#4A5568] hover:text-[#0F4C4A] flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
            aria-label="إغلاق السلة"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {step === 'success' ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center">
                <CheckIcon size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#0F4C4A]">
                تم استلام طلبك بنجاح!
              </h3>
              <p className="text-sm text-[#4A5568] leading-[1.75]">
                سيتم التواصل معك فوراً من قبل صيدلي مفتاح الجمال لتأكيد موعد التوصيل ومطابقة بيانات المستحضر المعتمد.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep('items');
                  cart.close();
                }}
                className="mt-4 min-h-[44px] px-6 py-2 rounded-xl bg-[#0F4C4A] text-white text-sm font-bold"
              >
                العودة للمتجر
              </button>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#F2F7F5] border border-[#D4E5E0] text-[#0F4C4A]/50 flex items-center justify-center">
                <BagIcon size={24} />
              </div>
              <p className="text-sm font-semibold text-[#0F4C4A]">
                سلتك فارغة حالياً
              </p>
              <p className="text-sm text-[#64748B] leading-[1.75]">
                تصفحي المستحضرات الطبية وأضيفي ما يناسب نوع بشرتك
              </p>
            </div>
          ) : step === 'items' ? (
            /* Items List */
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-[#E2ECE9] bg-[#F2F7F5]/50 flex items-center justify-between gap-3"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E2ECE9] bg-white shrink-0">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={false}
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-[#0F4C4A] block truncate">
                      {item.title}
                    </span>
                    <span className="text-xs font-semibold text-[#0F4C4A] block mt-0.5">
                      {formatCurrency(
                        (item.unitPrice[currency] ?? item.unitPrice.YER) * item.quantity,
                        currency
                      )}
                    </span>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-1 bg-white border border-[#D4E5E0] rounded-lg p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => cart.setQty(item.id, item.quantity - 1)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A5568] hover:text-[#0F4C4A]"
                      aria-label="تقليل الكمية"
                    >
                      <MinusIcon size={14} />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#0F4C4A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => cart.setQty(item.id, item.quantity + 1)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#4A5568] hover:text-[#0F4C4A]"
                      aria-label="زيادة الكمية"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery Zone Selector (Gated by delivery_zones feature) */}
              {features?.delivery_zones !== false && (
                <div className="mt-4 pt-3 border-t border-[#E2ECE9]">
                  <label className="text-xs font-bold text-[#0F4C4A] block mb-1.5">
                    منطقة التوصيل:
                  </label>
                  <select
                    aria-label="منطقة التوصيل والشحن"
                    value={checkout.selectedZoneId}
                    onChange={(e) => checkout.setSelectedZoneId(e.target.value)}
                    className="w-full min-h-[44px] px-3 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm font-semibold text-[#0F4C4A] focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                  >
                    {checkout.shippingZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.nameAr} ({z.estimatedDeliveryHours})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Coupon Code Input (Gated by coupons feature) */}
              {features?.coupons !== false && (
                <div className="mt-3 pt-3 border-t border-[#E2ECE9] space-y-2">
                  <label className="text-xs font-bold text-[#0F4C4A] block">
                    كود الخصم:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkout.couponCode}
                      onChange={(e) => checkout.setCouponCode(e.target.value)}
                      placeholder="أدخل كود الخصم"
                      className="flex-1 min-h-[44px] px-3 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm text-[#0F4C4A] uppercase font-mono outline-none focus:border-[#0F4C4A]"
                    />
                    <button
                      type="button"
                      onClick={checkout.applyCoupon}
                      disabled={checkout.isApplyingCoupon}
                      className="min-h-[44px] px-4 rounded-xl bg-[#0F4C4A] text-white text-xs font-bold hover:bg-[#0B3A38] transition"
                    >
                      تطبيق
                    </button>
                  </div>
                  {checkout.couponError && (
                    <span className="text-xs text-rose-500 font-sans block">{checkout.couponError}</span>
                  )}
                  {checkout.appliedCoupon && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#CFE8E1] text-[#0F4C4A] text-xs font-sans">
                      <span>تم تطبيق الخصم: {checkout.appliedCoupon.code}</span>
                      <button
                        type="button"
                        onClick={checkout.removeCoupon}
                        className="text-xs underline text-rose-600"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Checkout Details Step */
            <form id="checkout-form" onSubmit={handleDirectSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#0F4C4A] block mb-1">
                  الاسم الكامل:
                </label>
                <input
                  type="text"
                  required
                  value={checkout.customerName}
                  onChange={(e) => checkout.setCustomerName(e.target.value)}
                  placeholder="مثال: د. سارة الأحمدي"
                  className="w-full min-h-[44px] px-3 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm text-[#0F4C4A] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F4C4A] block mb-1">
                  رقم الهاتف (واتساب):
                </label>
                <input
                  type="tel"
                  required
                  value={checkout.customerPhone}
                  onChange={(e) => checkout.setCustomerPhone(e.target.value)}
                  placeholder="77XXXXXXX"
                  className="w-full min-h-[44px] px-3 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm text-[#0F4C4A] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F4C4A] block mb-1">
                  عنوان التوصيل بالتفصيل:
                </label>
                <textarea
                  rows={2}
                  required
                  value={checkout.customerAddress}
                  onChange={(e) => checkout.setCustomerAddress(e.target.value)}
                  placeholder="صنعاء - حدة - بجوار..."
                  className="w-full p-2.5 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm text-[#0F4C4A] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A]"
                />
              </div>

              {/* Payment Method Selector (Gated by payment_gateways feature) */}
              {features?.payment_gateways !== false && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-[#0F4C4A] block">
                    طريقة الدفع:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => checkout.setPaymentMethod(opt.id)}
                        className={`min-h-[40px] px-2.5 py-2 rounded-xl text-xs font-semibold border text-start transition-all ${
                          checkout.paymentMethod === opt.id
                            ? 'bg-[#0F4C4A] text-white border-[#0F4C4A]'
                            : 'bg-[#F2F7F5] text-[#0F4C4A] border-[#D4E5E0] hover:border-[#0F4C4A]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Merchant Wallet Information Box */}
                  {checkout.paymentMethod !== 'cod' && (
                    <div className="p-3 rounded-xl bg-[#CFE8E1]/40 border border-[#0F4C4A]/20 text-xs font-sans space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[#0F4C4A] font-bold">
                        <span>
                          {checkout.paymentMethod === 'kuraimi'
                            ? 'بيانات التحويل — بنك الكريمي (ام فلوس):'
                            : checkout.paymentMethod === 'floosak'
                            ? 'بيانات التحويل — محفظة فلوسك:'
                            : 'بيانات التحويل — محفظة جيب / جوالي:'}
                        </span>
                        <span className="font-mono text-[#0F4C4A] text-sm font-extrabold">
                          {checkout.paymentMethod === 'kuraimi'
                            ? checkout.kuraimiAccount
                            : checkout.paymentMethod === 'floosak'
                            ? checkout.floosakAccount
                            : checkout.jeebAccount}
                        </span>
                      </div>
                      <p className="text-[#4A5568] text-[11px]">
                        اسم صاحب الحساب: <span className="font-semibold text-[#0F4C4A]">{checkout.accountHolder}</span>
                      </p>
                      <div className="pt-1">
                        <input
                          type="text"
                          value={checkout.transferRef}
                          onChange={(e) => checkout.setTransferRef(e.target.value)}
                          placeholder="رقم إشعار الحوالة (اختياري)"
                          className="w-full h-9 px-3 rounded-lg border border-[#D4E5E0] bg-white text-xs text-[#0F4C4A] outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-[#CFE8E1]/30 border border-[#0F4C4A]/20 flex items-center gap-2 text-xs text-[#0F4C4A] font-medium">
                <ShieldCheckIcon size={16} className="shrink-0" />
                <span>الدفع بعد معاينة سلامة العبوة وختم الأصالة المعتمد</span>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer & Action Totals */}
        {cart.items.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-[#E2ECE9] bg-[#F2F7F5] space-y-3">
            {/* Totals Breakdown */}
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between text-[#4A5568]">
                <span>قيمة المنتجات:</span>
                <span className="font-semibold">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span>رسوم التوصيل:</span>
                <span className="font-semibold">{formattedShipping}</span>
              </div>
              {checkout.discountCurrent > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{formatCurrency(checkout.discountCurrent, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#0F4C4A] pt-1.5 border-t border-[#D4E5E0]">
                <span>الإجمالي النهائي:</span>
                <span>{formattedFinalTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {step === 'items' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                >
                  <WhatsAppIcon size={18} />
                  <span>طلب واتساب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-[#0F4C4A] text-[#0F4C4A] hover:bg-[#CFE8E1] text-xs sm:text-sm font-bold inline-flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                >
                  <span>متابعة الطلب</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStep('items')}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white border border-[#D4E5E0] text-[#4A5568] hover:text-[#0F4C4A] text-xs sm:text-sm font-bold inline-flex items-center justify-center transition-colors"
                >
                  <span>تعديل السلة</span>
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={checkout.isSubmitting}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#0F4C4A] hover:bg-[#0B3A38] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
                >
                  {checkout.isSubmitting ? (
                    <span>جارٍ الإرسال...</span>
                  ) : (
                    <span>تأكيد الطلب الفوري</span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

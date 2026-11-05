'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { useCheckout, PaymentMethodType } from '@/core/storefront/useCheckout';
import { formatCurrency } from '@/core/currency/formatter';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  BagIcon,
  WhatsAppIcon,
  VerifiedStampIcon,
} from './IvoryIcons';

export function IvoryCartDrawer() {
  const { cart, currency } = useStorefront();
  const checkout = useCheckout();

  if (!cart.isOpen) return null;

  const paymentOptions: { id: PaymentMethodType; label: string }[] = [
    { id: 'whatsapp', label: 'واتساب مباشر' },
    { id: 'cod', label: 'دفع عند الاستلام' },
    { id: 'kuraimi', label: 'حساب الكريمي' },
    { id: 'jawali', label: 'محفظة جوالي' },
    { id: 'floosak', label: 'محفظة فلوسك' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={() => cart.close()} />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF7F2] h-full flex flex-col justify-between shadow-2xl border-s border-[#E8E2D8] overflow-hidden">
        {/* Header */}
        <div className="h-[52px] px-4 sm:px-6 bg-[#FAF7F2] border-b border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BagIcon size={18} color="#1B1612" />
            <h2 className="font-serif font-bold text-lg text-[#1B1612]">
              حقيبة المشتريات ({cart.count})
            </h2>
          </div>
          <button
            type="button"
            aria-label="إغلاق الحقيبة"
            onClick={() => cart.close()}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-full"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cart.items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mx-auto text-[#877E75]">
                <BagIcon size={28} />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1B1612]">
                الحقيبة فارغة حالياً
              </h3>
              <p className="font-sans text-sm text-[#554D46] max-w-xs mx-auto leading-[1.75]">
                تصفحي مختارات هذا العدد وأضيفي المستحضرات الموثقة لتأكيد طلبكِ
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="divide-y divide-[#E8E2D8] border-y border-[#E8E2D8]">
                {cart.items.map((item) => {
                  const unitPrice = item.unitPrice[currency] || item.unitPrice.YER || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div key={item.id} className="py-4 flex gap-3 items-center">
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-16 rounded bg-[#EFEAE1] border border-[#E8E2D8] overflow-hidden flex-shrink-0">
                        <SmartImage
                          src={item.image}
                          alt={item.title}
                          priority={false}
                          sizes="64px"
                          className="object-cover object-center w-full h-full mix-blend-multiply"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1B1612] truncate">
                          {item.title}
                        </h4>
                        {item.variantTitle && (
                          <span className="text-xs font-sans text-[#5E6B5A] block leading-none">
                            {item.variantTitle}
                          </span>
                        )}
                        <span className="font-sans font-bold text-xs sm:text-sm text-[#1B1612] block">
                          {formatCurrency(itemTotal, currency)}
                        </span>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center border border-[#E8E2D8] rounded bg-[#FAF7F2]">
                        <button
                          type="button"
                          aria-label="تقليل الكمية"
                          onClick={() => cart.setQty(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center text-[#1B1612] hover:bg-[#E8E2D8]"
                        >
                          <MinusIcon size={14} />
                        </button>
                        <span className="w-8 text-center font-sans font-bold text-xs text-[#1B1612]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="زيادة الكمية"
                          onClick={() => cart.setQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center text-[#1B1612] hover:bg-[#E8E2D8]"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        aria-label="حذف المستحضر"
                        onClick={() => cart.remove(item.id)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#877E75] hover:text-[#A93226]"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Shipping Zone Selector */}
              <div className="space-y-2">
                <label className="text-xs font-sans font-bold text-[#1B1612] block">
                  منطقة التوصيل والشحن:
                </label>
                <select
                  value={checkout.selectedZoneId}
                  onChange={(e) => checkout.setSelectedZoneId(e.target.value)}
                  className="w-full h-11 min-h-[44px] px-3 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] font-sans text-xs sm:text-sm text-[#1B1612] focus:outline-none focus:border-[#5E6B5A]"
                >
                  {checkout.shippingZones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nameAr} ({z.estimatedDeliveryHours}) — {formatCurrency(currency === 'SAR' ? z.feeSar : currency === 'USD' ? z.feeUsd : z.feeYer, currency)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-sans font-medium text-[#554D46] block mb-1">
                    الاسم الكريم:
                  </label>
                  <input
                    type="text"
                    value={checkout.customerName}
                    onChange={(e) => checkout.setCustomerName(e.target.value)}
                    placeholder="اسم المستلم"
                    className="w-full h-11 min-h-[44px] px-3 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] font-sans text-xs sm:text-sm text-[#1B1612] focus:outline-none focus:border-[#5E6B5A]"
                  />
                </div>
                <div>
                  <label className="text-xs font-sans font-medium text-[#554D46] block mb-1">
                    رقم الهاتف للتأكيد (واتساب):
                  </label>
                  <input
                    type="tel"
                    value={checkout.customerPhone}
                    onChange={(e) => checkout.setCustomerPhone(e.target.value)}
                    placeholder="مثال: 775234989"
                    className="w-full h-11 min-h-[44px] px-3 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] font-mono text-xs sm:text-sm text-[#1B1612] focus:outline-none focus:border-[#5E6B5A]"
                  />
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-sans font-medium text-[#554D46] block">
                  كود الخصم التحريري:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkout.couponCode}
                    onChange={(e) => checkout.setCouponCode(e.target.value)}
                    placeholder="كود الخصم"
                    className="flex-1 h-11 min-h-[44px] px-3 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] font-mono text-xs text-[#1B1612] uppercase focus:outline-none focus:border-[#5E6B5A]"
                  />
                  <button
                    type="button"
                    onClick={checkout.applyCoupon}
                    disabled={checkout.isApplyingCoupon}
                    className="min-h-[44px] px-4 rounded-md border border-[#1B1612] text-[#1B1612] hover:bg-[#1B1612] hover:text-[#FAF7F2] text-xs font-sans font-bold transition-colors"
                  >
                    تطبيق
                  </button>
                </div>
                {checkout.couponError && (
                  <span className="text-xs text-[#A93226] font-sans block">
                    {checkout.couponError}
                  </span>
                )}
                {checkout.appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded bg-[#EBF5EE] text-[#2D6A4F] text-xs font-sans">
                    <span>تم تطبيق الخصم: {checkout.appliedCoupon.code}</span>
                    <button
                      type="button"
                      onClick={checkout.removeCoupon}
                      className="text-xs underline text-[#A93226]"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-sans font-bold text-[#1B1612] block">
                  طريقة الدفع:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => checkout.setPaymentMethod(opt.id)}
                      className={`min-h-[40px] px-2.5 py-2 rounded-md text-xs font-sans font-medium border text-start transition-all ${
                        checkout.paymentMethod === opt.id
                          ? 'border-[#1B1612] bg-[#1B1612] text-[#FAF7F2]'
                          : 'border-[#E8E2D8] bg-[#FAF7F2] text-[#554D46] hover:border-[#1B1612]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Confirmation */}
        {cart.items.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#F7F4ED] border-t border-[#E8E2D8] space-y-4">
            {/* Totals Breakdown */}
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-[#554D46]">
                <span>المجموع الفرعي:</span>
                <span className="font-mono font-bold text-[#1B1612]">
                  {formatCurrency(checkout.subtotalCurrent, currency)}
                </span>
              </div>
              <div className="flex justify-between text-[#554D46]">
                <span>رسوم التوصيل:</span>
                <span className="font-mono font-bold text-[#1B1612]">
                  {formatCurrency(checkout.shippingFeeCurrent, currency)}
                </span>
              </div>
              {checkout.discountCurrent > 0 && (
                <div className="flex justify-between text-[#2D6A4F]">
                  <span>الخصم المطبق:</span>
                  <span className="font-mono font-bold">
                    -{formatCurrency(checkout.discountCurrent, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-serif font-bold text-[#1B1612] pt-2 border-t border-[#E8E2D8]">
                <span>الإجمالي المطلوب:</span>
                <span className="font-mono">
                  {formatCurrency(checkout.totalCurrent, currency)}
                </span>
              </div>
            </div>

            {/* Submit Order via WhatsApp */}
            <button
              type="button"
              disabled={checkout.isSubmitting}
              onClick={() => checkout.submitOrder({ redirectWhatsApp: true })}
              className="w-full min-h-[44px] px-6 py-3.5 rounded-md bg-[#1B1612] text-[#FAF7F2] hover:bg-[#332E27] font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
            >
              <WhatsAppIcon size={18} color="#25D366" />
              <span>
                {checkout.isSubmitting ? 'جارٍ تأكيد الطلب...' : 'تأكيد الطلب الموثق عبر واتساب'}
              </span>
            </button>

            {/* Authenticity Assurance Note */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-sans text-[#5E6B5A]">
              <VerifiedStampIcon size={14} color="#5E6B5A" />
              <span>معاينة المستحضر والتحقق من ختم الأصالة متاحة عند الاستلام</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

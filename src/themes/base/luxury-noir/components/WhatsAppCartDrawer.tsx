'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, ThemeCurrencyCode } from '../../../contract';
import { formatCurrency, convertCurrency } from '@/core/currency/formatter';
import { BagCartIcon, TrashIcon, WhatsAppIcon, VerifiedCheckIcon, CloseIcon } from './LuxuryIcons';

interface ShippingZone {
  id: string;
  nameAr: string;
  city: string;
  feeYer: number;
  feeSar: number;
  feeUsd: number;
  estimatedDeliveryHours: string;
}

const SHIPPING_ZONES: ShippingZone[] = [
  { id: 'zone-sanaa', nameAr: 'صنعاء (توصيل فوري)', city: 'صنعاء', feeYer: 1000, feeSar: 7, feeUsd: 2, estimatedDeliveryHours: '2-4 ساعات' },
  { id: 'zone-aden', nameAr: 'عدن ولحج', city: 'عدن', feeYer: 3000, feeSar: 21, feeUsd: 6, estimatedDeliveryHours: '24-48 ساعة' },
  { id: 'zone-taiz-ibb', nameAr: 'تعز وإب', city: 'تعز', feeYer: 2500, feeSar: 18, feeUsd: 5, estimatedDeliveryHours: '24-36 ساعة' },
  { id: 'zone-hadramout', nameAr: 'حضرموت وشبوة', city: 'المكلا', feeYer: 4000, feeSar: 28, feeUsd: 8, estimatedDeliveryHours: '48 ساعة' },
  { id: 'zone-saudi', nameAr: 'السعودية (شحن دولي)', city: 'الرياض', feeYer: 8500, feeSar: 35, feeUsd: 10, estimatedDeliveryHours: '3-5 أيام' },
];

interface WhatsAppCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  currentCurrency: ThemeCurrencyCode;
  whatsappNumber: string;
}

export function WhatsAppCartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currentCurrency,
  whatsappNumber,
}: WhatsAppCartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('شارع حدة');
  const [selectedZoneId, setSelectedZoneId] = useState('zone-sanaa');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountYer: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'cod' | 'kuraimi' | 'jawali' | 'floosak' | 'mada'>('whatsapp');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedZone = SHIPPING_ZONES.find((z) => z.id === selectedZoneId) || SHIPPING_ZONES[0];

  // Subtotal in YER and current currency
  const subtotalYer = items.reduce((sum, item) => sum + (item.unitPrice.YER || 0) * item.quantity, 0);
  const subtotalCurrent = items.reduce((sum, item) => {
    const price = item.unitPrice[currentCurrency] || item.unitPrice.YER || 0;
    return sum + price * item.quantity;
  }, 0);

  // Shipping fee converted to current currency
  const shippingFeeCurrent =
    currentCurrency === 'SAR' ? selectedZone.feeSar : currentCurrency === 'USD' ? selectedZone.feeUsd : selectedZone.feeYer;

  // Discount in current currency
  const discountCurrent = appliedCoupon
    ? currentCurrency === 'YER'
      ? appliedCoupon.discountYer
      : convertCurrency(appliedCoupon.discountYer, 'YER', currentCurrency)
    : 0;

  const totalCurrent = Math.max(0, subtotalCurrent + shippingFeeCurrent - discountCurrent);

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    try {
      const res = await fetch('/api/store/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotalYer }),
      });
      const data = await res.json();
      if (data.isValid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discountYer: data.discountAmountYer,
          message: data.message,
        });
      } else {
        setCouponError(data.message || 'الكوبون غير صالح');
      }
    } catch (err) {
      setCouponError('تعذر تطبيق الكوبون حالياً');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!customerPhone.trim()) {
      alert('يرجى كتابة رقم الهاتف للتأكيد');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to database store
      const orderPayload = {
        customerName: customerName.trim() || 'عميل المتجر',
        customerPhone: customerPhone.trim(),
        city: selectedZone.city,
        address: customerAddress.trim(),
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          variantTitle: i.variantTitle,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        subtotalYer,
        shippingFeeYer: selectedZone.feeYer,
        discountYer: appliedCoupon ? appliedCoupon.discountYer : 0,
        totalYer: Math.max(0, subtotalYer + selectedZone.feeYer - (appliedCoupon?.discountYer || 0)),
        currency: currentCurrency,
        appliedCoupon: appliedCoupon?.code,
        paymentMethod,
        paymentReference: transferRef.trim() || undefined,
      };

      const res = await fetch('/api/store/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      const orderNumber = data?.order?.orderNumber || `MIFTAH-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Build formatted WhatsApp message
      let message = `*طلب موثق جديد: ${orderNumber}*\n`;
      message += `متجر مفتاح الجمال (لكشف المقلد)\n\n`;
      message += `الاسم: ${orderPayload.customerName}\n`;
      message += `الهاتف: ${orderPayload.customerPhone}\n`;
      message += `المنطقة: ${selectedZone.nameAr} - ${orderPayload.address}\n`;
      message += `طريقة الدفع: ${paymentMethod.toUpperCase()}${transferRef ? ` (رقم الحوالة: ${transferRef})` : ''}\n\n`;
      message += `المنتجات المطلوبة:\n`;

      items.forEach((item, index) => {
        const itemPrice = item.unitPrice[currentCurrency] || item.unitPrice.YER;
        message += `${index + 1}. ${item.title}${item.variantTitle ? ` (${item.variantTitle})` : ''} × ${item.quantity} = ${formatCurrency(itemPrice * item.quantity, currentCurrency)}\n`;
      });

      message += `\nرسوم التوصيل: ${formatCurrency(shippingFeeCurrent, currentCurrency)}\n`;
      if (discountCurrent > 0) {
        message += `الخصم (${appliedCoupon?.code}): -${formatCurrency(discountCurrent, currentCurrency)}\n`;
      }
      message += `*الإجمالي المطلوب:* ${formatCurrency(totalCurrent, currentCurrency)}\n`;
      message += `ضمان الأصالة: فحص الباركود والتشغيلة عند الاستلام\n`;

      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
      onClose();
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface border-s border-gold/30 h-full flex flex-col justify-between shadow-2xl z-10 text-ivory">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-obsidian/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <BagCartIcon size={18} color="#C9A84C" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                حقيبة المشتريات الفاخرة
              </h3>
              <p className="text-[11px] text-muted-lux font-sans">
                {items.length} {items.length === 1 ? 'مستحضر مختار' : 'مستحضرات مختارة'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux hover:text-ivory text-xs"
          >
            <CloseIcon size={16} color="#9A968E" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center text-muted-lux">
                <BagCartIcon size={24} color="#9A968E" />
              </div>
              <p className="text-base font-serif text-ivory">حقيبتك فارغة حالياً</p>
              <p className="text-xs text-muted-lux font-sans max-w-xs mx-auto">
                تصفحي تشكيلة العناية والمكياج الأصلية وأضيفي مستحضراتك المفضلة.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const unitPrice = item.unitPrice[currentCurrency] || item.unitPrice.YER || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 space-y-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-ivory line-clamp-1">
                          {item.title}
                        </h4>
                        {item.variantTitle && (
                          <span className="text-[11px] text-gold/80 font-sans block">
                            {item.variantTitle}
                          </span>
                        )}
                        <span className="text-xs font-serif text-champagne block">
                          {formatCurrency(unitPrice * item.quantity, currentCurrency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs text-ivory hover:text-gold"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-sans font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs text-ivory hover:text-gold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/20"
                        >
                          <TrashIcon size={16} color="#FB7185" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Shipping Zone Selector */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-xs font-sans text-gold font-semibold block">
                  منطقة التوصيل والشحن:
                </span>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                >
                  {SHIPPING_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id} className="bg-surface text-ivory">
                      {zone.nameAr} — ({formatCurrency(currentCurrency === 'SAR' ? zone.feeSar : currentCurrency === 'USD' ? zone.feeUsd : zone.feeYer, currentCurrency)})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-muted-lux block">
                  مدة التوصيل المقدرة: {selectedZone.estimatedDeliveryHours}
                </span>
              </div>

              {/* Coupon Code Field */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-sans text-gold font-semibold block">
                  كود الخصم (كوبون):
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MIFTAH10 أو ASLI20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory uppercase focus:border-gold outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 text-champagne border border-gold/40 text-xs font-bold transition"
                  >
                    تطبيق
                  </button>
                </div>
                {appliedCoupon && (
                  <span className="text-[11px] text-emerald-400 block font-sans">
                    {appliedCoupon.message}
                  </span>
                )}
                {couponError && (
                  <span className="text-[11px] text-rose-400 block font-sans">
                    {couponError}
                  </span>
                )}
              </div>

              {/* Customer Details */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-sans text-gold font-semibold block">
                  بيانات العميل للتسليم:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="الاسم الكريم"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف (ضروري)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="العنوان التفصيلي (الشارع / المعلم)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-2 space-y-2">
                <span className="text-xs font-sans text-gold font-semibold block">
                  طريقة الدفع المختارة:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-2.5 rounded-xl border text-start transition ${
                      paymentMethod === 'whatsapp'
                        ? 'bg-gold/15 border-gold text-champagne font-bold'
                        : 'bg-white/5 border-white/10 text-ivory/70'
                    }`}
                  >
                    واتساب والدفع عند الاستلام
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kuraimi')}
                    className={`p-2.5 rounded-xl border text-start transition ${
                      paymentMethod === 'kuraimi'
                        ? 'bg-gold/15 border-gold text-champagne font-bold'
                        : 'bg-white/5 border-white/10 text-ivory/70'
                    }`}
                  >
                    حوالة الكريمي (حساب مميز)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jawali')}
                    className={`p-2.5 rounded-xl border text-start transition ${
                      paymentMethod === 'jawali'
                        ? 'bg-gold/15 border-gold text-champagne font-bold'
                        : 'bg-white/5 border-white/10 text-ivory/70'
                    }`}
                  >
                    محفظة جوالي / فلوسك
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mada')}
                    className={`p-2.5 rounded-xl border text-start transition ${
                      paymentMethod === 'mada'
                        ? 'bg-gold/15 border-gold text-champagne font-bold'
                        : 'bg-white/5 border-white/10 text-ivory/70'
                    }`}
                  >
                    مدى وApple Pay (السعودية)
                  </button>
                </div>

                {paymentMethod !== 'whatsapp' && paymentMethod !== 'cod' && (
                  <input
                    type="text"
                    placeholder="رقم الحوالة أو العملية للتأكيد الفوري"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory focus:border-gold outline-none"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-obsidian/95 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-lux font-sans">
                <span>المجموع الفرعي:</span>
                <span>{formatCurrency(subtotalCurrent, currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-muted-lux font-sans">
                <span>رسوم التوصيل ({selectedZone.city}):</span>
                <span>{formatCurrency(shippingFeeCurrent, currentCurrency)}</span>
              </div>
              {discountCurrent > 0 && (
                <div className="flex justify-between text-emerald-400 font-sans">
                  <span>الخصم المطبق ({appliedCoupon?.code}):</span>
                  <span>-{formatCurrency(discountCurrent, currentCurrency)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-ivory">الإجمالي النهائي:</span>
                <span className="text-2xl font-serif font-bold text-champagne">
                  {formatCurrency(totalCurrent, currentCurrency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_25px_rgba(201,168,76,0.35)] hover:brightness-110 flex items-center justify-center gap-2.5 transition disabled:opacity-60"
            >
              <WhatsAppIcon size={18} color="#070709" />
              <span>{isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد الطلب الفوري عبر واتساب'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-lux font-sans">
              <VerifiedCheckIcon size={12} color="#C9A84C" />
              <span>فحص الباركود ورقم التشغيلة قبل الاستلام</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

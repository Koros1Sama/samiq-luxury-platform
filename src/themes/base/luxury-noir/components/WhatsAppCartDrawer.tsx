'use client';

import React from 'react';
import { CartItem, ThemeCurrencyCode } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import { BagCartIcon, TrashIcon, WhatsAppIcon, VerifiedCheckIcon, CloseIcon } from './LuxuryIcons';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { useCheckout } from '@/core/storefront/useCheckout';

interface WhatsAppCartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  currentCurrency?: ThemeCurrencyCode;
  whatsappNumber?: string;
}

export function WhatsAppCartDrawer(props: WhatsAppCartDrawerProps) {
  const sf = useStorefront();
  const features = sf.features;

  const isOpen = props.isOpen !== undefined ? props.isOpen : sf.cart.isOpen;
  const onClose = props.onClose || sf.cart.close;
  const items = props.items || sf.cart.items;
  const onUpdateQuantity =
    props.onUpdateQuantity ||
    ((id: string, qty: number) => {
      sf.cart.setQty(id, qty);
    });
  const onRemoveItem = props.onRemoveItem || sf.cart.remove;
  const currentCurrency = props.currentCurrency || sf.currency;
  const whatsappNumber =
    props.whatsappNumber || sf.tenant.contact?.whatsapp || sf.tenant.whatsapp || '775234989';

  const {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    shippingZones,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    paymentMethod,
    setPaymentMethod,
    transferRef,
    setTransferRef,
    kuraimiAccount,
    floosakAccount,
    jeebAccount,
    accountHolder,
    isSubmitting,
    subtotalCurrent,
    shippingFeeCurrent,
    discountCurrent,
    totalCurrent,
    submitOrder,
  } = useCheckout({
    items,
    currency: currentCurrency,
    whatsappNumber,
    onOrderSuccess: () => {
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleCheckout = async () => {
    await submitOrder();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface border-s border-gold/30 h-full flex flex-col justify-between shadow-2xl z-10 text-ivory">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-obsidian/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <BagCartIcon size={20} color="#C9A84C" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
                حقيبة المشتريات الفاخرة
              </h3>
              <p className="text-xs text-muted-lux font-sans">
                {items.length} {items.length === 1 ? 'مستحضر مختار' : 'مستحضرات مختارة'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux hover:text-ivory"
            aria-label="إغلاق"
          >
            <CloseIcon size={18} color="#9A968E" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center text-muted-lux">
                <BagCartIcon size={26} color="#9A968E" />
              </div>
              <p className="text-base font-serif text-ivory">حقيبتك فارغة حالياً</p>
              <p className="text-xs text-muted-lux font-sans max-w-xs mx-auto leading-relaxed">
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
                          <span className="text-xs text-gold/80 font-sans block">
                            {item.variantTitle}
                          </span>
                        )}
                        <span className="text-xs font-serif text-champagne block">
                          {formatCurrency(unitPrice * item.quantity, currentCurrency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quantity Controls with min 40px hit area */}
                        <div className="flex items-center rounded-xl bg-white/5 border border-white/10">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-sm text-ivory hover:text-gold transition font-bold"
                            aria-label="تقليل الكمية"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold font-sans">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-sm text-ivory hover:text-gold transition font-bold"
                            aria-label="زيادة الكمية"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-rose-950/30 border border-white/10 hover:border-rose-500/40 text-muted-lux hover:text-rose-400 flex items-center justify-center transition"
                          aria-label="حذف المستحضر"
                        >
                          <TrashIcon size={16} color="currentColor" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Zone Selection (Gated by delivery_zones feature) */}
              {features?.delivery_zones !== false && (
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-semibold text-champagne block">
                    منطقة التوصيل والشحن:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {shippingZones.map((zone) => {
                      const isSelected = selectedZoneId === zone.id;
                      const fee =
                        currentCurrency === 'SAR'
                          ? zone.feeSar
                          : currentCurrency === 'USD'
                          ? zone.feeUsd
                          : zone.feeYer;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setSelectedZoneId(zone.id)}
                          className={`min-h-[44px] p-3 rounded-xl border text-start transition flex items-center justify-between text-xs font-sans ${
                            isSelected
                              ? 'bg-gold/15 border-gold text-champagne font-bold'
                              : 'bg-white/5 border-white/10 text-ivory/70 hover:border-white/20'
                          }`}
                        >
                          <span className="truncate">{zone.nameAr}</span>
                          <span className="text-xs font-bold text-gold shrink-0 ms-2">
                            {formatCurrency(fee, currentCurrency)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Coupon Code Input (Gated by coupons feature) */}
              {features?.coupons !== false && (
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-semibold text-champagne block">
                    كود الخصم:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="أدخل كود الخصم"
                      className="flex-1 min-h-[44px] px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory uppercase font-mono outline-none focus:border-gold/50"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="min-h-[44px] px-4 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/40 text-xs font-sans font-bold text-champagne transition"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponError && (
                    <span className="text-xs text-rose-400 font-sans block">{couponError}</span>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-sans">
                      <span>تم تطبيق الخصم: {appliedCoupon.code}</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs underline text-rose-400"
                      >
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-muted-lux font-sans block mb-1">
                    الاسم الكريم:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسم المستلم"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-ivory outline-none focus:border-gold/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-lux font-sans block mb-1">
                    رقم الهاتف للتأكيد:
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 775234989"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-ivory outline-none focus:border-gold/50 transition dir-ltr text-end"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-lux font-sans block mb-1">
                    العنوان التفصيلي:
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="الشارع، الحي، المعلم القريب"
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-ivory outline-none focus:border-gold/50 transition"
                  />
                </div>
              </div>

              {/* Payment Method Selector (Gated by payment_gateways feature) */}
              {features?.payment_gateways !== false && (
                <div className="pt-2 space-y-2">
                  <label className="text-xs font-semibold text-champagne block">
                    طريقة الدفع والتأكيد:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-sans font-medium transition ${
                        paymentMethod === 'cod'
                          ? 'bg-gold/15 border-gold text-champagne font-bold'
                          : 'bg-white/5 border-white/10 text-ivory/70 hover:border-white/20'
                      }`}
                    >
                      الدفع عند الاستلام (كاش)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('kuraimi')}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-sans font-medium transition ${
                        paymentMethod === 'kuraimi'
                          ? 'bg-gold/15 border-gold text-champagne font-bold'
                          : 'bg-white/5 border-white/10 text-ivory/70 hover:border-white/20'
                      }`}
                    >
                      بنك الكريمي (ام فلوس)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('floosak')}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-sans font-medium transition ${
                        paymentMethod === 'floosak'
                          ? 'bg-gold/15 border-gold text-champagne font-bold'
                          : 'bg-white/5 border-white/10 text-ivory/70 hover:border-white/20'
                      }`}
                    >
                      محفظة فلوسك
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('jeeb')}
                      className={`min-h-[44px] p-2.5 rounded-xl border text-center text-xs font-sans font-medium transition ${
                        paymentMethod === 'jeeb' || paymentMethod === 'jawali'
                          ? 'bg-gold/15 border-gold text-champagne font-bold'
                          : 'bg-white/5 border-white/10 text-ivory/70 hover:border-white/20'
                      }`}
                    >
                      محفظة جيب / جوالي
                    </button>
                  </div>

                  {/* Merchant Wallet Information Box */}
                  {paymentMethod !== 'cod' && paymentMethod !== 'whatsapp' && (
                    <div className="p-3.5 rounded-2xl bg-gold/10 border border-gold/30 text-xs font-sans space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-champagne font-bold">
                        <span>
                          {paymentMethod === 'kuraimi'
                            ? 'بيانات التحويل — بنك الكريمي (ام فلوس):'
                            : paymentMethod === 'floosak'
                            ? 'بيانات التحويل — محفظة فلوسك:'
                            : 'بيانات التحويل — محفظة جيب / جوالي:'}
                        </span>
                        <span className="font-mono text-gold text-sm font-extrabold">
                          {paymentMethod === 'kuraimi'
                            ? kuraimiAccount
                            : paymentMethod === 'floosak'
                            ? floosakAccount
                            : jeebAccount}
                        </span>
                      </div>
                      <p className="text-ivory/80 text-[11px]">
                        اسم صاحب الحساب: <span className="font-semibold text-ivory">{accountHolder}</span>
                      </p>
                      <div className="pt-1">
                        <input
                          type="text"
                          value={transferRef}
                          onChange={(e) => setTransferRef(e.target.value)}
                          placeholder="رقم إشعار الحوالة (اختياري)"
                          className="w-full min-h-[38px] px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-ivory outline-none focus:border-gold/50 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Summary & Action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-obsidian space-y-3">
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex justify-between text-muted-lux">
                <span>المجموع الفرعي:</span>
                <span>{formatCurrency(subtotalCurrent, currentCurrency)}</span>
              </div>
              <div className="flex justify-between text-muted-lux">
                <span>رسوم التوصيل:</span>
                <span>{formatCurrency(shippingFeeCurrent, currentCurrency)}</span>
              </div>
              {discountCurrent > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>-{formatCurrency(discountCurrent, currentCurrency)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/5 flex justify-between items-baseline text-sm sm:text-base font-bold">
                <span className="text-ivory font-serif">الإجمالي المطلوب:</span>
                <span className="text-champagne font-serif text-lg">
                  {formatCurrency(totalCurrent, currentCurrency)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-3 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-obsidian-dark font-sans font-bold text-sm shadow-[0_4px_25px_rgba(201,168,76,0.35)] hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <WhatsAppIcon size={18} color="#070709" />
              <span>{isSubmitting ? 'جاري تجهيز الطلب...' : 'إتمام وتأكيد الطلب الفوري'}</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-lux font-sans">
              <VerifiedCheckIcon size={13} color="#34D399" />
              <span>معاينة الختم والباركود وضمان الأصالة عند الاستلام</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

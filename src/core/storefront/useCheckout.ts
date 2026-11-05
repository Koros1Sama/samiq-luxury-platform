'use client';

import { useState, useMemo, useCallback } from 'react';
import { CartItem, ThemeCurrencyCode } from '@/themes/contract';
import { formatCurrency, convertCurrency } from '@/core/currency/formatter';
import { useStorefront } from './StorefrontProvider';

export interface ShippingZone {
  id: string;
  nameAr: string;
  city: string;
  feeYer: number;
  feeSar: number;
  feeUsd: number;
  estimatedDeliveryHours: string;
}

export const DEFAULT_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-sanaa',
    nameAr: 'صنعاء (توصيل فوري)',
    city: 'صنعاء',
    feeYer: 1000,
    feeSar: 7,
    feeUsd: 2,
    estimatedDeliveryHours: '2-4 ساعات',
  },
  {
    id: 'zone-aden',
    nameAr: 'عدن ولحج',
    city: 'عدن',
    feeYer: 3000,
    feeSar: 21,
    feeUsd: 6,
    estimatedDeliveryHours: '24-48 ساعة',
  },
  {
    id: 'zone-taiz-ibb',
    nameAr: 'تعز وإب',
    city: 'تعز',
    feeYer: 2500,
    feeSar: 18,
    feeUsd: 5,
    estimatedDeliveryHours: '24-36 ساعة',
  },
  {
    id: 'zone-hadramout',
    nameAr: 'حضرموت وشبوة',
    city: 'المكلا',
    feeYer: 4000,
    feeSar: 28,
    feeUsd: 8,
    estimatedDeliveryHours: '48 ساعة',
  },
  {
    id: 'zone-saudi',
    nameAr: 'السعودية (شحن دولي)',
    city: 'الرياض',
    feeYer: 8500,
    feeSar: 35,
    feeUsd: 10,
    estimatedDeliveryHours: '3-5 أيام',
  },
];

export type PaymentMethodType =
  | 'cod'
  | 'kuraimi'
  | 'floosak'
  | 'jeeb'
  | 'jawali'
  | 'whatsapp';

export interface AppliedCoupon {
  code: string;
  discountYer: number;
  message: string;
}

export interface UseCheckoutOptions {
  customZones?: ShippingZone[];
  defaultZoneId?: string;
  whatsappNumber?: string;
  items?: CartItem[];
  currency?: ThemeCurrencyCode;
  onOrderSuccess?: (orderNumber: string) => void;
}

export function useCheckout(options?: UseCheckoutOptions) {
  const sf = useStorefront();

  const items = options?.items || sf.cart.items;
  const currentCurrency = options?.currency || sf.currency;
  const whatsappNumber =
    options?.whatsappNumber ||
    sf.tenant.contact?.whatsapp ||
    sf.tenant.whatsapp ||
    '967775234989';

  const dynamicZones =
    options?.customZones ||
    (typeof window !== 'undefined' && (window as any).__SAMIQ_SHIPPING_ZONES__?.length > 0
      ? (window as any).__SAMIQ_SHIPPING_ZONES__
      : DEFAULT_SHIPPING_ZONES);
  const shippingZones: ShippingZone[] = dynamicZones;

  const [selectedZoneId, setSelectedZoneId] = useState(
    options?.defaultZoneId || shippingZones[0]?.id || 'zone-sanaa'
  );

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('شارع حدة');

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [transferRef, setTransferRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentAccounts = (sf.tenant as any).paymentAccounts || {};
  const kuraimiAccount = paymentAccounts.kuraimiAccount || '3094821';
  const floosakAccount = paymentAccounts.floosakAccount || '775234989';
  const jeebAccount = paymentAccounts.jeebAccount || paymentAccounts.jawaliAccount || '775234989';
  const accountHolder = paymentAccounts.accountHolderName || sf.tenant.name || 'مفتاح الجمال';

  const selectedZone = useMemo(
    () => shippingZones.find((z) => z.id === selectedZoneId) || shippingZones[0],
    [shippingZones, selectedZoneId]
  );

  // Subtotal calculations
  const subtotalYer = useMemo(
    () => items.reduce((sum, item) => sum + (item.unitPrice.YER || 0) * item.quantity, 0),
    [items]
  );

  const subtotalCurrent = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.unitPrice[currentCurrency] || item.unitPrice.YER || 0;
        return sum + price * item.quantity;
      }, 0),
    [items, currentCurrency]
  );

  // Shipping fee in current currency
  const shippingFeeCurrent = useMemo(() => {
    if (!selectedZone) return 0;
    if (currentCurrency === 'SAR') return selectedZone.feeSar;
    if (currentCurrency === 'USD') return selectedZone.feeUsd;
    return selectedZone.feeYer;
  }, [selectedZone, currentCurrency]);

  const shippingFeeYer = selectedZone ? selectedZone.feeYer : 0;

  // Discount in current currency
  const discountYer = appliedCoupon ? appliedCoupon.discountYer : 0;
  const discountCurrent = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (currentCurrency === 'YER') return appliedCoupon.discountYer;
    return convertCurrency(appliedCoupon.discountYer, 'YER', currentCurrency);
  }, [appliedCoupon, currentCurrency]);

  const totalYer = Math.max(0, subtotalYer + shippingFeeYer - discountYer);
  const totalCurrent = Math.max(0, subtotalCurrent + shippingFeeCurrent - discountCurrent);

  const applyCoupon = useCallback(async () => {
    setCouponError('');
    const code = couponCode.trim();
    if (!code) return;

    setIsApplyingCoupon(true);
    try {
      const res = await fetch('/api/store/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalYer }),
      });
      const data = await res.json();
      if (data.isValid) {
        setAppliedCoupon({
          code: code.toUpperCase(),
          discountYer: data.discountAmountYer,
          message: data.message,
        });
      } else {
        setCouponError(data.message || 'الكوبون غير صالح');
      }
    } catch (err) {
      setCouponError('تعذر التحقق من الكوبون حالياً');
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [couponCode, subtotalYer]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  }, []);

  const buildWhatsAppOrderUrl = useCallback(
    (orderNumber: string) => {
      let paymentDesc = 'الدفع عند الاستلام (كاش)';
      if (paymentMethod === 'kuraimi') {
        paymentDesc = `بنك الكريمي (ام فلوس) - حساب: ${kuraimiAccount} باسم: ${accountHolder}`;
      } else if (paymentMethod === 'floosak') {
        paymentDesc = `محفظة فلوسك - حساب: ${floosakAccount} باسم: ${accountHolder}`;
      } else if (paymentMethod === 'jeeb' || paymentMethod === 'jawali') {
        paymentDesc = `محفظة جيب / جوالي - حساب: ${jeebAccount} باسم: ${accountHolder}`;
      }
      if (transferRef.trim()) {
        paymentDesc += ` (رقم الحوالة: ${transferRef.trim()})`;
      }

      let message = `*طلب موثق جديد: ${orderNumber}*\n`;
      message += `متجر ${sf.tenant.name}\n\n`;
      message += `الاسم: ${customerName.trim() || 'عميل المتجر'}\n`;
      message += `الهاتف: ${customerPhone.trim()}\n`;
      message += `المنطقة: ${selectedZone?.nameAr || ''} - ${customerAddress.trim()}\n`;
      message += `طريقة الدفع: ${paymentDesc}\n\n`;
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
      message += `ضمان الأصالة: مستحضرات مصرحة ومطابقة لمعايير الهيئة العليا للأدوية والمستلزمات الطبية\n`;

      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    },
    [
      sf.tenant.name,
      customerName,
      customerPhone,
      customerAddress,
      selectedZone,
      paymentMethod,
      transferRef,
      items,
      currentCurrency,
      shippingFeeCurrent,
      discountCurrent,
      appliedCoupon,
      totalCurrent,
      whatsappNumber,
    ]
  );

  const submitOrder = useCallback(
    async (submitOptions?: { redirectWhatsApp?: boolean }) => {
      const shouldRedirect = submitOptions?.redirectWhatsApp !== false;
      if (items.length === 0) {
        return { success: false, error: 'سلة المشتريات فارغة' };
      }
      if (!customerPhone.trim()) {
        return { success: false, error: 'يرجى كتابة رقم الهاتف للتأكيد' };
      }

      setIsSubmitting(true);
      try {
        const orderPayload = {
          customerName: customerName.trim() || 'عميل المتجر',
          customerPhone: customerPhone.trim(),
          city: selectedZone?.city || 'صنعاء',
          address: customerAddress.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            variantTitle: i.variantTitle,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          subtotalYer,
          shippingFeeYer,
          discountYer,
          totalYer,
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
        const orderNumber =
          data?.order?.orderNumber || `MIFTAH-${Math.floor(1000 + Math.random() * 9000)}`;

        if (shouldRedirect) {
          const waUrl = buildWhatsAppOrderUrl(orderNumber);
          window.open(waUrl, '_blank');
        }

        if (options?.onOrderSuccess) {
          options.onOrderSuccess(orderNumber);
        }

        sf.cart.clear();
        return { success: true, orderNumber };
      } catch (err) {
        return { success: false, error: 'تعذر إتمام الطلب، يرجى المحاولة لاحقاً' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      items,
      customerPhone,
      customerName,
      selectedZone,
      customerAddress,
      subtotalYer,
      shippingFeeYer,
      discountYer,
      totalYer,
      currentCurrency,
      appliedCoupon,
      paymentMethod,
      transferRef,
      buildWhatsAppOrderUrl,
      options,
      sf.cart,
    ]
  );

  return {
    items,
    shippingZones,
    selectedZoneId,
    setSelectedZoneId,
    selectedZone,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerAddress,
    setCustomerAddress,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    isApplyingCoupon,
    applyCoupon,
    removeCoupon,
    paymentMethod,
    setPaymentMethod,
    transferRef,
    setTransferRef,
    isSubmitting,
    // Accounts
    paymentAccounts,
    kuraimiAccount,
    floosakAccount,
    jeebAccount,
    accountHolder,
    // Totals
    subtotalYer,
    subtotalCurrent,
    shippingFeeYer,
    shippingFeeCurrent,
    discountYer,
    discountCurrent,
    totalYer,
    totalCurrent,
    // Actions
    submitOrder,
    buildWhatsAppOrderUrl,
  };
}

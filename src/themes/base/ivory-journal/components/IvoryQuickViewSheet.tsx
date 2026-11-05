'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { getProductQuickInfo } from '@/core/storefront/productQuickInfo';
import { ProductCardData } from '@/themes/contract';
import {
  CloseIcon,
  PlusIcon,
  MinusIcon,
  BagIcon,
  VerifiedStampIcon,
  WhatsAppIcon,
} from './IvoryIcons';

interface IvoryQuickViewSheetProps {
  product: ProductCardData | null;
  onClose: () => void;
}

export function IvoryQuickViewSheet({ product, onClose }: IvoryQuickViewSheetProps) {
  const { cart, currency, tenant } = useStorefront();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');

  if (!product) return null;

  const info = getProductQuickInfo(product, currency);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      cart.add(product, selectedVariantId);
    }
    onClose();
  };

  const whatsappInquiryUrl = () => {
    const cleanNum = (tenant.whatsapp || '775234989').replace(/[^0-9]/g, '');
    const msg = `مرحباً، أود الاستفسار عن توفر وشهادة فحص: ${product.title}`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Tall Bottom Sheet Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#FAF7F2] rounded-t-2xl sm:rounded-2xl max-h-[90dvh] overflow-y-auto border border-[#E8E2D8] shadow-2xl flex flex-col">
        {/* Top Header Row with Close Button */}
        <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-[#E8E2D8] flex items-center justify-between z-10">
          <span className="text-xs font-mono font-semibold text-[#5E6B5A]">
            نظرة سريعة على المستحضر
          </span>
          <button
            type="button"
            aria-label="إغلاق تفاصيل المنتج"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-full border border-[#1B1612]/10"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Image Showcase with Greige Backdrop & Multi-Image Gallery */}
          <div className="space-y-3">
            <div className="relative w-full aspect-square bg-[#EFEAE1] rounded-lg overflow-hidden border border-[#E8E2D8]">
              <SmartImage
                src={activeImage || product.image}
                alt={product.title}
                priority={false}
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover object-center w-full h-full mix-blend-multiply"
              />
              {info.isAuthenticGuaranteed && (
                <div className="absolute top-3 start-3 px-3 py-1 rounded-full bg-[#FAF7F2]/95 border border-[#5E6B5A]/40 flex items-center gap-1.5 shadow-sm">
                  <VerifiedStampIcon size={14} color="#5E6B5A" />
                  <span className="text-xs font-sans font-bold text-[#5E6B5A]">
                    أصلي مضمون
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails row */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((imgUrl, idx) => {
                  const isCurrent = (activeImage || product.image) === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg overflow-hidden border transition-all bg-[#EFEAE1] ${
                        isCurrent
                          ? 'border-[#1B1612] shadow-sm scale-105'
                          : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`معاينة الصورة ${idx + 1}`}
                    >
                      <SmartImage
                        src={imgUrl}
                        alt={`${product.title} ${idx + 1}`}
                        fill
                        className="object-cover rounded-md mix-blend-multiply"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details & Controls */}
          <div className="flex flex-col space-y-4">
            <div>
              {info.concentration && (
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#F4EFE6] text-[#5E6B5A] text-xs font-sans font-medium mb-1">
                  تركيز {info.concentration}
                </span>
              )}
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#1B1612] leading-[1.3]">
                {product.title}
              </h2>
              {product.subtitle && (
                <p className="font-sans text-sm text-[#554D46] mt-1.5 leading-[1.75]">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Ingredients Tags if available */}
            {info.ingredients && info.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {info.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="text-xs font-sans px-2.5 py-1 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] text-[#554D46]"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            )}

            {/* Price Display & Stock Badge */}
            <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-3">
                <span className="font-sans font-bold text-xl sm:text-2xl text-[#1B1612]">
                  {info.formattedPrice}
                </span>
                {info.hasDiscount && info.formattedComparePrice && (
                  <span className="text-sm font-sans text-[#877E75] line-through">
                    {info.formattedComparePrice}
                  </span>
                )}
              </div>
              {typeof product.stockQuantity === 'number' && (
                <span
                  className={`px-2.5 py-1 rounded text-xs font-sans font-bold border ${
                    product.stockQuantity > 0
                      ? 'bg-[#EFEAE1] text-[#5E6B5A] border-[#5E6B5A]/30'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {product.stockQuantity > 0
                    ? `متوفر في المخزن (${product.stockQuantity} قطعة)`
                    : 'نفدت الكمية حالياً'}
                </span>
              )}
            </div>

            {/* Variants Selector if present */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-xs font-sans font-semibold text-[#554D46]">
                  الدرجة أو الحجم:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-md text-xs font-sans font-medium border transition-all ${
                        selectedVariantId === v.id
                          ? 'border-[#1B1612] bg-[#1B1612] text-[#FAF7F2]'
                          : 'border-[#E8E2D8] bg-[#FAF7F2] text-[#554D46] hover:border-[#1B1612]'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add Button */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans text-[#554D46]">الكمية:</span>
                <div className="flex items-center border border-[#E8E2D8] rounded-md bg-[#FAF7F2]">
                  <button
                    type="button"
                    aria-label="إنقاص الكمية"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1B1612] hover:bg-[#E8E2D8] transition-colors"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="w-10 text-center font-sans font-bold text-sm text-[#1B1612]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="زيادة الكمية"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#1B1612] hover:bg-[#E8E2D8] transition-colors"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Primary Add to Cart Button (min-h-[44px]) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full min-h-[44px] px-6 py-3 rounded-md bg-[#1B1612] text-[#FAF7F2] hover:bg-[#332E27] font-sans font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
              >
                <BagIcon size={18} color="#FAF7F2" />
                <span>إضافة إلى الحقيبة</span>
              </button>

              {/* WhatsApp direct consultation button */}
              <a
                href={whatsappInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-md border border-[#E8E2D8] bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#554D46] hover:text-[#1B1612] font-sans font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon size={16} color="#5E6B5A" />
                <span>طلب استشارة أو تأكيد توفر عبر واتساب</span>
              </a>

              {/* Direct Full Product Detail Page Link */}
              <Link
                href={`/product/${product.slug || product.id}`}
                onClick={onClose}
                className="w-full min-h-[44px] px-4 py-2 rounded-md border border-[#E8E2D8] text-center font-sans font-semibold text-xs text-[#1B1612] hover:bg-[#FAF7F2] transition flex items-center justify-center gap-1.5"
              >
                <span>عرض صفحة المستحضر وتفاصيل الأصالة كاملة</span>
                <span className="rtl:-scale-x-100 font-serif">←</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

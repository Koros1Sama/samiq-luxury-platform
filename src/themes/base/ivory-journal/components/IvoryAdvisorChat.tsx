'use client';

import React, { useRef, useEffect } from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useAdvisorChat } from '@/core/storefront/useAdvisorChat';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { formatCurrency } from '@/core/currency/formatter';
import { ProductCardData } from '@/themes/contract';
import {
  CloseIcon,
  AdvisorStarIcon,
  ArrowIcon,
  WhatsAppIcon,
  PlusIcon,
} from './IvoryIcons';

interface IvoryAdvisorChatProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: ProductCardData) => void;
}

export function IvoryAdvisorChat({
  isOpen,
  onClose,
  onSelectProduct,
}: IvoryAdvisorChatProps) {
  const { tenant, cart, currency } = useStorefront();
  const advisor = useAdvisorChat({
    fallbackSupportPhone: tenant.whatsapp || '775234989',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, advisor.messages, advisor.isTyping]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    advisor.sendMessage();
  };

  const whatsappSupportUrl = () => {
    const rawNum = (tenant.contact?.whatsapp || tenant.whatsapp || '775234989').replace(/[^0-9]/g, '');
    const cleanNum = rawNum.startsWith('967') ? rawNum : `967${rawNum.replace(/^0+/, '')}`;
    const msg = 'مرحباً، أود الحصول على استشارة مخصصة لروتين العناية بالبشرة';
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#FAF7F2] rounded-t-2xl sm:rounded-2xl border border-[#E8E2D8] shadow-2xl flex flex-col h-[85dvh] max-h-[680px] overflow-hidden">
        {/* Header */}
        <div className="h-[56px] px-4 sm:px-6 bg-[#FAF7F2] border-b border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F4EFE6] border border-[#5E6B5A]/30 flex items-center justify-center text-[#5E6B5A]">
              <AdvisorStarIcon size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#1B1612]">
                مستشار الجمال التحريري
              </h3>
              <span className="text-[12px] font-sans text-[#5E6B5A] block leading-none">
                استشارات الأصالة واختيار الروتين
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="إغلاق المستشار"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-full"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {advisor.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3.5 sm:p-4 text-xs sm:text-sm font-sans leading-[1.75] ${
                  msg.sender === 'user'
                    ? 'bg-[#1B1612] text-[#FAF7F2] rounded-es-none'
                    : 'bg-[#F4EFE6] text-[#1B1612] border border-[#E8E2D8] rounded-ee-none'
                }`}
              >
                {msg.text}

                {/* Quick Pills if present in AI message */}
                {msg.quickPills && msg.quickPills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-2 border-t border-[#E8E2D8]/60">
                    {msg.quickPills.map((pill) => (
                      <button
                        key={pill}
                        type="button"
                        onClick={() => advisor.sendMessage(pill)}
                        className="min-h-[40px] px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] text-[#1B1612] hover:border-[#5E6B5A] hover:text-[#5E6B5A] text-xs font-sans font-medium transition-colors"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                )}

                {/* Recommended Product Cards inside AI Message */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-3 mt-2 border-t border-[#E8E2D8]/60">
                    <span className="text-[12px] font-sans font-bold text-[#5E6B5A] block">
                      المستحضرات المقترحة:
                    </span>
                    {msg.recommendedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-10 h-10 rounded bg-[#EFEAE1] overflow-hidden flex-shrink-0">
                            <SmartImage
                              src={p.image}
                              alt={p.title}
                              priority={false}
                              sizes="40px"
                              className="object-cover object-center w-full h-full mix-blend-multiply"
                            />
                          </div>
                          <div className="truncate">
                            <span className="font-serif font-bold text-xs text-[#1B1612] block truncate">
                              {p.title}
                            </span>
                            <span className="font-sans font-bold text-xs text-[#5E6B5A]">
                              {formatCurrency(p.prices[currency] || p.prices.YER, currency)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`إضافة ${p.title}`}
                          onClick={() => cart.add(p)}
                          className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center border border-[#1B1612]/20 rounded-full hover:bg-[#1B1612] hover:text-[#FAF7F2] text-[#1B1612] transition-colors"
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {advisor.isTyping && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F4EFE6] border border-[#E8E2D8] max-w-[120px]">
              <span className="w-2 h-2 rounded-full bg-[#5E6B5A] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#5E6B5A] animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-[#5E6B5A] animate-pulse delay-300" />
            </div>
          )}

          {/* Handoff to WhatsApp if requested */}
          {advisor.handoff && (
            <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#5E6B5A]/40 text-center space-y-3">
              <span className="font-serif font-bold text-sm text-[#1B1612] block">
                تفضلي بالتواصل المباشر مع أخصائية البشرة
              </span>
              <a
                href={whatsappSupportUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 rounded-md bg-[#25D366] text-white font-sans font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
              >
                <WhatsAppIcon size={16} color="#FFFFFF" />
                <span>متابعة الاستشارة عبر واتساب</span>
              </a>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-[#FAF7F2] border-t border-[#E8E2D8] flex gap-2">
          <input
            type="text"
            value={advisor.inputVal}
            onChange={(e) => advisor.setInputVal(e.target.value)}
            placeholder="اكتبي استفساركِ أو اسألي عن روتينكِ..."
            className="flex-1 h-11 min-h-[44px] px-4 rounded-md border border-[#E8E2D8] bg-[#F7F4ED] font-sans text-xs sm:text-sm text-[#1B1612] placeholder:text-[#A0988E] focus:outline-none focus:border-[#5E6B5A]"
          />
          <button
            type="submit"
            disabled={!advisor.inputVal.trim() || advisor.isTyping}
            className="min-h-[44px] min-w-[44px] px-4 rounded-md bg-[#1B1612] text-[#FAF7F2] hover:bg-[#332E27] font-sans font-bold text-xs sm:text-sm flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
}

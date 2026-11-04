'use client';

import React from 'react';
import { useAdvisorChat } from '@/core/storefront/useAdvisorChat';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SmartImage } from '@/core/ui/SmartImage';
import {
  StethoscopeIcon,
  CloseIcon,
  SendIcon,
  BagIcon,
  WhatsAppIcon,
  FlaskIcon,
} from './ClinicIcons';

export interface ClinicAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClinicAdvisorModal({ isOpen, onClose }: ClinicAdvisorModalProps) {
  const { cart, tenant } = useStorefront();
  const {
    messages,
    inputVal,
    setInputVal,
    isTyping,
    sendMessage,
    handoff,
  } = useAdvisorChat();

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isTyping) {
      sendMessage();
    }
  };

  const handleQuickPill = (pillText: string) => {
    sendMessage(pillText);
  };

  const whatsapp = tenant.contact?.whatsapp || tenant.whatsapp || '775234989';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="المستشار السريري الذكي"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#D4E5E0] h-[90dvh] max-h-[640px] flex flex-col justify-between overflow-hidden text-start">
        {/* Header */}
        <div className="p-4 border-b border-[#E2ECE9] flex items-center justify-between gap-3 bg-[#F2F7F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CFE8E1] text-[#0F4C4A] flex items-center justify-center border border-[#0F4C4A]/20">
              <StethoscopeIcon size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F4C4A] leading-tight">
                المستشار السريري الذكي
              </h2>
              <span className="text-xs text-[#0F4C4A]/70 font-medium">
                تحليل نوع البشرة ومطابقة الأرقام التشغيلية
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-lg bg-white border border-[#D4E5E0] text-[#4A5568] hover:text-[#0F4C4A] flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
            aria-label="إغلاق المستشار"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-white to-[#F2F7F5]/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-[1.75] ${
                  msg.sender === 'user'
                    ? 'bg-[#0F4C4A] text-white rounded-ee-xs'
                    : 'bg-[#F2F7F5] border border-[#D4E5E0] text-[#2D3748] rounded-es-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Quick Suggestion Pills */}
              {msg.quickPills && msg.quickPills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.quickPills.map((pill, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleQuickPill(pill)}
                      className="min-h-[40px] px-2.5 py-1 rounded-lg bg-white border border-[#0F4C4A]/30 text-[#0F4C4A] hover:bg-[#CFE8E1] text-xs font-semibold transition-colors"
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              )}

              {/* Recommended Product Cards inside Chat */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="w-full mt-2.5 space-y-2">
                  {msg.recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white p-2.5 rounded-xl border border-[#D4E5E0] flex items-center justify-between gap-2.5 shadow-xs"
                    >
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#E2ECE9] shrink-0">
                        <SmartImage
                          src={prod.image}
                          alt={prod.title}
                          fill
                          priority={false}
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-[#0F4C4A] block truncate">
                          {prod.title}
                        </span>
                        <span className="text-xs text-[#0F4C4A]/80 font-semibold block">
                          {prod.prices.YER?.toLocaleString()} YER
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => cart.add(prod)}
                        className="min-w-[40px] min-h-[40px] px-2.5 rounded-lg bg-[#0F4C4A] text-white hover:bg-[#0B3A38] flex items-center justify-center text-xs font-bold transition-colors"
                        aria-label={`إضافة ${prod.title}`}
                      >
                        <BagIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#F2F7F5] border border-[#D4E5E0] w-24 text-[#0F4C4A]">
              <span className="w-2 h-2 rounded-full bg-[#0F4C4A] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[#0F4C4A] animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-[#0F4C4A] animate-pulse delay-150" />
            </div>
          )}

          {handoff && (
            <div className="p-3 rounded-xl bg-[#CFE8E1]/40 border border-[#0F4C4A]/30 text-start">
              <span className="text-xs font-bold text-[#0F4C4A] block mb-1">
                هل تحتاجين فحصاً مخبرياً خاصاً؟
              </span>
              <a
                href={`https://wa.me/967${whatsapp}?text=${encodeURIComponent('مرحباً، أود استشارة صيدلي مفتاح الجمال بشأن فحص منتج')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-3 py-2 rounded-lg bg-[#0F4C4A] text-white inline-flex items-center justify-center gap-1.5 text-xs font-bold hover:bg-[#0B3A38] transition-colors mt-1"
              >
                <WhatsAppIcon size={16} />
                <span>التحدث مباشرة مع أخصائي المختبر</span>
              </a>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-[#E2ECE9] bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="اكتبي استشارتك أو رقم التشغيلة..."
            disabled={isTyping}
            className="flex-1 min-h-[44px] px-3.5 bg-[#F2F7F5] border border-[#D4E5E0] rounded-xl text-xs sm:text-sm text-[#0F4C4A] placeholder:text-[#64748B] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0F4C4A]"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#0F4C4A] text-white hover:bg-[#0B3A38] disabled:opacity-50 flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A]"
            aria-label="إرسال الرسالة"
          >
            <SendIcon size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

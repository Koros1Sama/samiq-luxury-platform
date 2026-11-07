'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/core/ui/SmartImage';
import { SparkleStarIcon, CloseIcon, WhatsAppIcon, VerifiedCheckIcon } from './LuxuryIcons';
import { useAdvisorChat } from '@/core/storefront/useAdvisorChat';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

interface AiBeautyAdvisorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AiBeautyAdvisor({ isOpen: externalIsOpen, onClose: externalOnClose }: AiBeautyAdvisorProps) {
  const sf = useStorefront();
  const chat = useAdvisorChat();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : chat.isOpen;
  const onClose = externalOnClose || chat.close;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer on Mobile / Centered Card on Desktop */}
      <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[560px] rounded-t-[2rem] sm:rounded-3xl bg-surface border-t sm:border border-gold/40 shadow-2xl flex flex-col justify-between overflow-hidden z-10 text-ivory">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-obsidian border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
              <SparkleStarIcon size={18} color="#C9A84C" />
            </div>
            <div>
              <h4 className="text-sm font-serif font-bold text-ivory">
                مستشار الأصالة والعناية الذكي
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-muted-lux font-sans">
                  متصل الآن (محرك سَامِق الذكي)
                </span>
              </div>
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

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {chat.messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div key={m.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-2`}>
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line ${
                    isAi
                      ? 'bg-elevated border border-gold/20 text-ivory/95 rounded-ts-none shadow-sm'
                      : 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-semibold rounded-te-none'
                  }`}
                >
                  {m.text}

                  {/* Escalate to Human WhatsApp Button */}
                  {m.escalateToHuman && (
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <a
                        href="https://wa.me/967775234989"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-sans font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#25D366]/30 transition"
                      >
                        <WhatsAppIcon size={16} color="#25D366" />
                        <span>محادثة خبير الأصالة مباشرة على واتساب</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Suggested Products (if any) */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="w-full space-y-2 pt-1">
                    <span className="text-xs text-champagne font-sans font-bold block">
                      المستحضرات المقترحة لكِ:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {m.recommendedProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={onClose}
                          className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/40 flex items-center gap-3 transition min-h-[44px]"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-white/5 flex-shrink-0">
                            <SmartImage
                              src={p.image}
                              alt={p.title}
                              fill
                              priority={false}
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-serif font-bold text-ivory truncate">
                              {p.title}
                            </h5>
                            <span className="text-xs text-champagne font-sans block mt-0.5">
                              {p.prices ? sf.formatPrice(p.prices) : ''}
                            </span>
                          </div>
                          <VerifiedCheckIcon size={14} color="#34D399" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Pills */}
                {m.quickPills && m.quickPills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.quickPills.map((pill, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => chat.sendMessage(pill)}
                        className="min-h-[40px] px-3.5 py-2 rounded-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-champagne text-xs font-sans transition flex items-center justify-center"
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {chat.isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-lux font-sans p-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
              <span className="ms-1">المستشار يكتب الرد...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            chat.sendMessage();
          }}
          className="p-3 sm:p-4 bg-obsidian border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={chat.inputVal}
            onChange={(e) => chat.setInputVal(e.target.value)}
            placeholder="اكتبي استفساركِ عن الأصالة أو الروتين..."
            className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-surface border border-white/10 text-xs sm:text-sm text-ivory placeholder-muted-lux outline-none focus:border-gold/50 transition"
          />
          <button
            type="submit"
            disabled={!chat.inputVal.trim() || chat.isTyping}
            className="min-w-[44px] min-h-[44px] px-4 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs flex items-center justify-center disabled:opacity-40 transition"
            aria-label="إرسال"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SparkleStarIcon, CloseIcon, WhatsAppIcon, VerifiedCheckIcon } from './LuxuryIcons';
import { ProductCardData } from '../../../contract';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: ProductCardData[];
  quickPills?: string[];
  escalateToHuman?: boolean;
  time: string;
}

export function AiBeautyAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'أهلاً بكِ في مفتاح الجمال. أنا مستشاركِ الذكي لفحص الأصالة واقتراح روتين العناية المثالي. كيف يمكنني مساعدتكِ اليوم؟',
      quickPills: ['فحص سيروم فيتامين سي', 'روتين البشرة الدهنية', 'خدمة التوصيل بصنعاء'],
      time: 'الآن',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: 'الآن',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'يسعدنا استشارتك. فريق مفتاح الجمال مستعد لخدمتك.',
        recommendedProducts: data.recommendedProducts || [],
        quickPills: data.quickPills || [],
        escalateToHuman: data.escalateToHuman,
        time: 'الآن',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'يسعدنا تواصلك معنا مباشرة عبر واتساب مفتاح الجمال: 967775234989+',
        escalateToHuman: true,
        time: 'الآن',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 end-5 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#1C180E] to-[#121118] border border-gold/50 shadow-[0_4px_30px_rgba(201,168,76,0.35)] text-ivory hover:scale-105 transition-all group"
        aria-label="المستشار الذكي"
      >
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:rotate-12 transition-transform">
          <SparkleStarIcon size={16} color="#C9A84C" />
        </div>
        <div className="text-start hidden sm:block">
          <span className="text-xs font-sans font-bold bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent block">
            اسأل خبير أصلي وتقليد
          </span>
          <span className="text-[10px] text-muted-lux font-sans block">
            استشارة ذكية فورية 24/7
          </span>
        </div>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-20 end-5 z-50 w-full max-w-sm sm:max-w-md h-[520px] rounded-3xl bg-surface border border-gold/30 shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn text-ivory">
          {/* Header */}
          <div className="p-4 bg-obsidian border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <SparkleStarIcon size={14} color="#C9A84C" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-ivory">
                  مستشار مفتاح الجمال الذكي
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-muted-lux font-sans">
                    متصل الآن (ذكاء سَامِق)
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux text-xs"
            >
              <CloseIcon size={14} color="#9A968E" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div key={m.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} space-y-2`}>
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs font-sans leading-relaxed whitespace-pre-line ${
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
                          href="https://wa.me/967775234989?text=مرحباً%20مفتاح%20الجمال،%20أرغب%20في%20التحدث%20مع%20أخصائية%20بشرة"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans font-bold transition"
                        >
                          <WhatsAppIcon size={13} color="#34D399" />
                          <span>تحويل لأخصائية العناية عبر واتساب</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Render Recommended Product Cards within Chat */}
                  {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                    <div className="w-full space-y-2 pt-1">
                      <span className="text-[10px] text-gold font-sans font-semibold block">
                        مستحضرات مقترحة لروتينكِ:
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {m.recommendedProducts.map((p) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.id}`}
                            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold/40 flex items-center justify-between gap-3 group transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-white/5 flex-shrink-0">
                                <Image src={p.image} alt={p.title} fill className="object-cover" />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-gold block font-sans">{p.brand}</span>
                                <h5 className="text-xs font-serif font-bold text-ivory group-hover:text-champagne transition line-clamp-1">
                                  {p.title}
                                </h5>
                              </div>
                            </div>
                            <span className="text-[10px] font-sans font-bold text-champagne flex-shrink-0">
                              عرض ←
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Pills */}
                  {m.quickPills && m.quickPills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.quickPills.map((pill, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(pill)}
                          className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-champagne whitespace-nowrap transition"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-lux font-sans py-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
                <span>المستشار الذكي يحلل طلبكِ...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="p-3 bg-obsidian border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اكتبي استفسارك عن الأصلي أو روتين بشرتك..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-ivory placeholder-muted-lux focus:border-gold outline-none"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 transition disabled:opacity-50"
            >
              إرسال
            </button>
          </form>
        </div>
      )}
    </>
  );
}

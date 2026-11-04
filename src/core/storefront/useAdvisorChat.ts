'use client';

import { useState, useCallback } from 'react';
import { ProductCardData } from '@/themes/contract';

export interface AdvisorMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedProducts?: ProductCardData[];
  quickPills?: string[];
  escalateToHuman?: boolean;
  time: string;
}

export interface UseAdvisorChatOptions {
  initialMessages?: AdvisorMessage[];
  apiEndpoint?: string;
  fallbackSupportPhone?: string;
}

const DEFAULT_INITIAL_MESSAGES: AdvisorMessage[] = [
  {
    id: 'welcome-1',
    sender: 'ai',
    text: 'أهلاً بكِ في مفتاح الجمال. أنا مستشاركِ الذكي لفحص الأصالة واقتراح روتين العناية المثالي. كيف يمكنني مساعدتكِ اليوم؟',
    quickPills: ['فحص سيروم فيتامين سي', 'روتين البشرة الدهنية', 'خدمة التوصيل بصنعاء'],
    time: 'الآن',
  },
];

export function useAdvisorChat(options?: UseAdvisorChatOptions) {
  const apiEndpoint = options?.apiEndpoint || '/api/ai/chat';
  const fallbackSupportPhone = options?.fallbackSupportPhone || '967775234989';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AdvisorMessage[]>(
    options?.initialMessages || DEFAULT_INITIAL_MESSAGES
  );
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductCardData[]>([]);
  const [handoff, setHandoff] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend !== undefined ? textToSend : inputVal).trim();
      if (!text || isTyping) return;

      const userMsg: AdvisorMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text,
        time: 'الآن',
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputVal('');
      setIsTyping(true);

      try {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();

        const recommended = data.recommendedProducts || [];
        const aiMsg: AdvisorMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.text || 'يسعدنا استشارتك. فريق مفتاح الجمال مستعد لخدمتك.',
          recommendedProducts: recommended,
          quickPills: data.quickPills || [],
          escalateToHuman: Boolean(data.escalateToHuman),
          time: 'الآن',
        };

        setMessages((prev) => [...prev, aiMsg]);
        setSuggestedProducts(recommended);
        if (data.escalateToHuman) {
          setHandoff(true);
        }
      } catch (err) {
        const fallbackMsg: AdvisorMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `يسعدنا تواصلك معنا مباشرة عبر واتساب مفتاح الجمال: +${fallbackSupportPhone}`,
          escalateToHuman: true,
          time: 'الآن',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setHandoff(true);
      } finally {
        setIsTyping(false);
      }
    },
    [inputVal, isTyping, apiEndpoint, fallbackSupportPhone]
  );

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
    messages,
    inputVal,
    setInputVal,
    isTyping,
    suggestedProducts,
    handoff,
    sendMessage,
  };
}

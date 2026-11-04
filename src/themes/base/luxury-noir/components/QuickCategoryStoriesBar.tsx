'use client';

import React from 'react';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

interface QuickCategoryStoriesBarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function QuickCategoryStoriesBar(props: QuickCategoryStoriesBarProps) {
  const sf = useStorefront();
  const activeCategory = props.activeCategory || sf.activeCategory || 'all';
  const onSelectCategory = props.onSelectCategory || sf.setActiveCategory;

  const defaultStories = [
    { id: 'all', title: 'الكل', brand: '', target: '#products-catalog' },
    { id: 'serums', title: 'سيرومات البشرة', brand: 'La Roche-Posay', target: '#products-catalog' },
    { id: 'cerave', title: 'مرطبات CeraVe', brand: 'CeraVe', target: '#products-catalog' },
    { id: 'the-ordinary', title: 'The Ordinary', brand: 'The Ordinary', target: '#products-catalog' },
    { id: 'cleansers', title: 'غسولات طبية', brand: 'CeraVe', target: '#products-catalog' },
    { id: 'makeup', title: 'المكياج الفاخر', brand: 'YSL & Huda', target: '#products-catalog' },
    { id: 'authenticity', title: 'مختبر كشف المقلد', brand: 'Batch Check', target: '#authenticity-lab' },
  ];

  // If merchant has custom categories, use them; otherwise use default stories
  const stories =
    sf.categories && sf.categories.length > 0 && sf.tenant.id !== '11111111-1111-1111-1111-111111111111'
      ? [
          { id: 'all', title: 'الكل', brand: '', target: '#products-catalog' },
          ...sf.categories.map((c) => ({
            id: c.id,
            title: c.title,
            brand: c.brand || '',
            target: '#products-catalog',
          })),
        ]
      : defaultStories;

  const handleClick = (s: typeof stories[0]) => {
    onSelectCategory(s.id);
    if (s.target) {
      const el = document.querySelector(s.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full bg-surface/80 backdrop-blur-md border-b border-white/5 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth">
        {stories.map((s) => {
          const isSelected = activeCategory === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleClick(s)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-300 whitespace-nowrap ${
                isSelected
                  ? 'bg-[#C9A84C]/15 text-[#FCF6BA] border border-[#C9A84C]/60 shadow-[0_0_18px_rgba(201,168,76,0.28),inset_0_1px_0_rgba(252,246,186,0.25)] font-bold scale-[1.02]'
                  : 'bg-white/[0.03] text-[#9A968E] border border-white/[0.07] hover:border-[#C9A84C]/30 hover:text-[#F5F2EB]'
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

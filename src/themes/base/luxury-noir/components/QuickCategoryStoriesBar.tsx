'use client';

import React from 'react';

interface QuickCategoryStoriesBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function QuickCategoryStoriesBar({
  activeCategory,
  onSelectCategory,
}: QuickCategoryStoriesBarProps) {
  const stories = [
    { id: 'all', title: 'الكل', brand: '', target: '#products-catalog' },
    { id: 'serums', title: 'سيرومات البشرة', brand: 'La Roche-Posay', target: '#products-catalog' },
    { id: 'cerave', title: 'مرطبات CeraVe', brand: 'CeraVe', target: '#products-catalog' },
    { id: 'the-ordinary', title: 'The Ordinary', brand: 'The Ordinary', target: '#products-catalog' },
    { id: 'cleansers', title: 'غسولات طبية', brand: 'CeraVe', target: '#products-catalog' },
    { id: 'makeup', title: 'المكياج الفاخر', brand: 'YSL & Huda', target: '#products-catalog' },
    { id: 'authenticity', title: 'مختبر كشف المقلد', brand: 'Batch Check', target: '#authenticity-lab' },
  ];

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
              className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold shadow-md scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 text-ivory/80 hover:text-ivory border border-white/10'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-obsidian' : 'bg-gold'}`} />
              <span className="whitespace-nowrap">{s.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

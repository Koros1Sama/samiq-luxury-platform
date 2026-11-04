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

  const categories = [
    { id: 'all', title: 'الكل' },
    ...(sf.categories || []).map((c) => ({
      id: c.id,
      title: c.title,
    })),
  ];

  const handleClick = (catId: string) => {
    onSelectCategory(catId);
    const el = document.querySelector('#products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#070709] border-b border-white/[0.06] h-11 flex items-center px-3 sm:px-6 relative z-20">
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((c) => {
          const isSelected = activeCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleClick(c.id)}
              className={`shrink-0 min-h-[40px] px-4 py-2 rounded-full text-xs font-sans transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                isSelected
                  ? 'bg-[#C9A84C]/15 text-[#FCF6BA] border border-[#C9A84C]/40 shadow-[0_0_12px_rgba(201,168,76,0.2)] font-bold'
                  : 'bg-white/[0.03] text-[#9A968E] border border-white/[0.07] hover:border-[#C9A84C]/30 hover:text-[#F5F2EB]'
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

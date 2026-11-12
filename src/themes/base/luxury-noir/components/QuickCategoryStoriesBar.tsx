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
      <div className="max-w-7xl mx-auto w-full flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        {categories.map((c) => {
          const isSelected = activeCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleClick(c.id)}
              className={`relative shrink-0 min-w-[48px] h-11 min-h-[44px] px-3 text-xs font-sans transition-colors duration-300 whitespace-nowrap flex items-center justify-center ${
                isSelected
                  ? 'text-[#FCF6BA] font-bold'
                  : 'text-[#9A968E] hover:text-[#F5F2EB]'
              }`}
            >
              <span>{c.title}</span>
              {isSelected && (
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

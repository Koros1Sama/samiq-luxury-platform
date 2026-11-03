'use client';

import React, { useState, useEffect } from 'react';
import { SamiqThemeId, SAMIQ_THEMES } from '@/themes/contract';

interface ThemeSwitcherProps {
  currentTheme?: SamiqThemeId;
  onThemeChange?: (theme: SamiqThemeId) => void;
  className?: string;
  isCompact?: boolean;
}

export function ThemeSwitcher({
  currentTheme = 'luxury-noir',
  onThemeChange,
  className = '',
  isCompact = false,
}: ThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<SamiqThemeId>(currentTheme);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check saved preference or attribute
    const saved = localStorage.getItem('samiq_theme') as SamiqThemeId;
    if (saved && SAMIQ_THEMES[saved]) {
      setActiveTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme]);

  const handleSelect = (id: SamiqThemeId) => {
    setActiveTheme(id);
    localStorage.setItem('samiq_theme', id);
    document.documentElement.setAttribute('data-theme', id);
    if (onThemeChange) {
      onThemeChange(id);
    }
    setIsOpen(false);
  };

  const currentMeta = SAMIQ_THEMES[activeTheme] || SAMIQ_THEMES['luxury-noir'];

  return (
    <div className={`relative inline-block text-xs font-sans ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-ivory text-xs"
        title="تبديل مظهر المتجر"
      >
        <span
          className="w-2.5 h-2.5 rounded-full border border-gold/60 inline-block shrink-0"
          style={{ backgroundColor: currentMeta.primaryColor }}
        />
        {!isCompact && (
          <span className="font-medium truncate max-w-[110px]">
            {currentMeta.nameEn}
          </span>
        )}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          className={`opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute end-0 mt-2 w-64 p-2 rounded-2xl bg-surface border border-white/15 shadow-2xl backdrop-blur-xl z-50 space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-lux border-b border-white/10 mb-1">
              اختر ثيم وهوية المتجر
            </div>
            {(Object.keys(SAMIQ_THEMES) as SamiqThemeId[]).map((tId) => {
              const meta = SAMIQ_THEMES[tId];
              const isSelected = activeTheme === tId;
              return (
                <button
                  key={tId}
                  onClick={() => handleSelect(tId)}
                  className={`w-full text-start p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-gold/15 border border-gold/30 text-ivory'
                      : 'hover:bg-white/5 border border-transparent text-muted-lux hover:text-ivory'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 mt-0.5 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: meta.primaryColor }}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.accentColor }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-ivory">{meta.nameEn}</span>
                      <span className="text-[10px] text-gold/80 px-1.5 py-0.2 bg-gold/10 rounded">
                        {meta.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-lux mt-0.5 leading-snug">
                      {meta.paletteDescription}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

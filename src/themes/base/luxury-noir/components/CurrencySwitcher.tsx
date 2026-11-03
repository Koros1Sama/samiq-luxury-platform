'use client';

import React from 'react';
import { ThemeCurrencyCode } from '../../../contract';

interface CurrencySwitcherProps {
  currentCurrency: ThemeCurrencyCode;
  onCurrencyChange: (currency: ThemeCurrencyCode) => void;
  className?: string;
}

const CURRENCIES: Array<{ code: ThemeCurrencyCode; label: string }> = [
  { code: 'YER', label: 'ر.ي' },
  { code: 'SAR', label: 'ر.س' },
  { code: 'USD', label: '$' },
];

export function CurrencySwitcher({
  currentCurrency,
  onCurrencyChange,
  className = '',
}: CurrencySwitcherProps) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-full bg-surface/90 border border-white/10 shadow-inner ${className}`}
    >
      {CURRENCIES.map((curr) => {
        const isActive = currentCurrency === curr.code;
        return (
          <button
            key={curr.code}
            type="button"
            onClick={() => onCurrencyChange(curr.code)}
            className={`px-2.5 py-1 text-xs font-sans font-medium rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-obsidian-dark font-bold shadow-[0_2px_10px_rgba(201,168,76,0.4)]'
                : 'text-ivory/70 hover:text-ivory hover:bg-white/5'
            }`}
          >
            {curr.label}
          </button>
        );
      })}
    </div>
  );
}

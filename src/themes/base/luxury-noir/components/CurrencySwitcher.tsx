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
            className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-sans font-medium rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-gold/20 text-[#FCF6BA] border border-gold/60 font-bold shadow-[0_0_12px_rgba(201,168,76,0.35)]'
                : 'text-ivory/60 hover:text-ivory hover:bg-white/5 border border-transparent'
            }`}
          >
            {curr.label}
          </button>
        );
      })}
    </div>
  );
}

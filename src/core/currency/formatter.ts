/**
 * SAMIQ Currency Engine
 * Resilient multi-currency formatting tailored for Yemen:
 * Supports YER (ريال يمني), SAR (ريال سعودي), and USD (دولار)
 */

export type CurrencyCode = 'YER' | 'SAR' | 'USD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbolAr: string;
  symbolEn: string;
  decimals: number;
  rateToUsd: number; // 1 USD = X Currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  YER: {
    code: 'YER',
    symbolAr: 'ر.ي',
    symbolEn: 'YER',
    decimals: 0,
    rateToUsd: 535, // Sanaa peg benchmark
  },
  SAR: {
    code: 'SAR',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    decimals: 0,
    rateToUsd: 3.75,
  },
  USD: {
    code: 'USD',
    symbolAr: '$',
    symbolEn: '$',
    decimals: 2,
    rateToUsd: 1,
  },
};

/**
 * Formats a numerical amount with the appropriate currency symbol in Arabic RTL context
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'YER',
  options?: { showDecimals?: boolean; tabular?: boolean }
): string {
  const config = CURRENCIES[currency] || CURRENCIES.YER;
  const decimals = options?.showDecimals !== undefined
    ? (options.showDecimals ? config.decimals : 0)
    : config.decimals;

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return `${formattedNumber} ${config.symbolAr}`;
}

/**
 * Converts price from one currency to another using reference parity
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  const fromConfig = CURRENCIES[from] || CURRENCIES.YER;
  const toConfig = CURRENCIES[to] || CURRENCIES.YER;

  // Convert to USD first, then to target currency
  const inUsd = amount / fromConfig.rateToUsd;
  const converted = inUsd * toConfig.rateToUsd;

  return toConfig.decimals === 0 ? Math.round(converted) : Number(converted.toFixed(toConfig.decimals));
}

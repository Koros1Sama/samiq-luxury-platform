import { ThemeId, isValidThemeId } from '@/themes/contract';

export interface BrandPalette {
  isCustomPalette?: boolean;
  primaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
}

export interface ResolvedThemePalette {
  themeId: ThemeId;
  background: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  isLight: boolean;
}

export const THEME_DEFAULT_PALETTES: Record<ThemeId, ResolvedThemePalette> = {
  'luxury-noir': {
    themeId: 'luxury-noir',
    background: '#0B0B0C',
    surface: '#121214',
    text: '#F4EFE6',
    muted: '#A39E93',
    accent: '#D4AF37',
    border: 'rgba(212, 175, 55, 0.2)',
    isLight: false,
  },
  'ivory-journal': {
    themeId: 'ivory-journal',
    background: '#FAF7F2',
    surface: '#FFFFFF',
    text: '#1C1917',
    muted: '#655E57',
    accent: '#8C5E3C',
    border: '#E8E2D8',
    isLight: true,
  },
  'clinic-lab': {
    themeId: 'clinic-lab',
    background: '#F4F8F7',
    surface: '#FFFFFF',
    text: '#0D2625',
    muted: '#4A6664',
    accent: '#0F4C4A',
    border: '#E2ECE9',
    isLight: true,
  },
};

export function isColorLight(hexColor?: string): boolean {
  if (!hexColor) return false;
  try {
    const hex = hexColor.replace('#', '').trim();
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 130;
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 130;
    }
  } catch {
    // fallback
  }
  return false;
}

export function resolveThemePalette(
  themeId: ThemeId,
  customPalette?: BrandPalette | null
): ResolvedThemePalette {
  const base = THEME_DEFAULT_PALETTES[themeId] || THEME_DEFAULT_PALETTES['luxury-noir'];

  if (customPalette?.isCustomPalette) {
    const bg = customPalette.backgroundColor || base.background;
    const isLight = isColorLight(bg);
    return {
      themeId,
      background: bg,
      surface: customPalette.surfaceColor || (isLight ? '#FFFFFF' : '#141418'),
      text: customPalette.textColor || (isLight ? '#1A1815' : '#F5F2EB'),
      muted: isLight ? '#66615B' : '#A5A096',
      accent: customPalette.primaryColor || base.accent,
      border: isLight ? '#E5DFD5' : 'rgba(255, 255, 255, 0.1)',
      isLight,
    };
  }

  return base;
}

export function getClientActiveTheme(fallback: ThemeId = 'luxury-noir'): ThemeId {
  if (typeof window === 'undefined') return fallback;
  try {
    const params = new URLSearchParams(window.location.search);
    const qTheme = params.get('theme');
    if (qTheme && isValidThemeId(qTheme)) {
      return qTheme;
    }
    const saved = localStorage.getItem('samiq_demo_theme');
    if (saved && isValidThemeId(saved)) {
      return saved;
    }
  } catch {
    // fallback
  }
  return fallback;
}

export function getClientCustomPalette(): BrandPalette | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('samiq_custom_palette');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // fallback
  }
  return null;
}

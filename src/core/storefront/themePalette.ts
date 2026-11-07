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
  backgroundHex?: string;
  surfaceHex?: string;
  textHex?: string;
  mutedHex?: string;
  accentHex?: string;
  borderHex?: string;
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
    backgroundHex: '#0B0B0C',
    surfaceHex: '#121214',
    textHex: '#F4EFE6',
    mutedHex: '#A39E93',
    accentHex: '#D4AF37',
    borderHex: 'rgba(212, 175, 55, 0.2)',
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
    backgroundHex: '#FAF7F2',
    surfaceHex: '#FFFFFF',
    textHex: '#1C1917',
    mutedHex: '#655E57',
    accentHex: '#8C5E3C',
    borderHex: '#E8E2D8',
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
    backgroundHex: '#F4F8F7',
    surfaceHex: '#FFFFFF',
    textHex: '#0D2625',
    mutedHex: '#4A6664',
    accentHex: '#0F4C4A',
    borderHex: '#E2ECE9',
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
    const surf = customPalette.surfaceColor || (isLight ? '#FFFFFF' : '#141418');
    const txt = customPalette.textColor || (isLight ? '#1A1815' : '#F5F2EB');
    const mut = isLight ? '#66615B' : '#A5A096';
    const acc = customPalette.primaryColor || base.accent;
    const bor = isLight ? '#E5DFD5' : 'rgba(255, 255, 255, 0.1)';
    return {
      themeId,
      background: bg,
      surface: surf,
      text: txt,
      muted: mut,
      accent: acc,
      border: bor,
      isLight,
      backgroundHex: bg,
      surfaceHex: surf,
      textHex: txt,
      mutedHex: mut,
      accentHex: acc,
      borderHex: bor,
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
      try {
        localStorage.setItem('samiq_demo_theme', qTheme);
        localStorage.setItem('samiq_active_theme', qTheme);
        document.cookie = `samiq_active_theme=${qTheme}; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `samiq_demo_theme=${qTheme}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
      return qTheme as ThemeId;
    }
    const saved = localStorage.getItem('samiq_demo_theme') || localStorage.getItem('samiq_active_theme');
    if (saved && isValidThemeId(saved)) {
      try {
        document.cookie = `samiq_active_theme=${saved}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
      return saved as ThemeId;
    }
    // Check cookies as fallback
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)samiq_active_theme=([^;]+)/);
      if (match && isValidThemeId(match[1])) {
        return match[1] as ThemeId;
      }
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

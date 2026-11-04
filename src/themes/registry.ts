import React from 'react';
import { ThemeId, ThemeMeta, ThemeLayoutProps, SAMIQ_THEMES } from './contract';

export interface ThemeRegistryEntry {
  meta: ThemeMeta;
  load: () => Promise<{ default: React.ComponentType<ThemeLayoutProps> }>;
}

export const THEMES: Record<ThemeId, ThemeRegistryEntry> = {
  'luxury-noir': {
    meta: SAMIQ_THEMES['luxury-noir'],
    load: () => import('./base/luxury-noir').then((m) => ({ default: m.LuxuryNoirTheme })),
  },
  'ivory-journal': {
    meta: SAMIQ_THEMES['ivory-journal'],
    load: () => import('./base/ivory-journal').then((m) => ({ default: m.IvoryJournalStubLayout })),
  },
};

export const DEFAULT_THEME_ID: ThemeId = 'luxury-noir';

export function isValidThemeId(themeId: string): themeId is ThemeId {
  return themeId in THEMES;
}

export function resolveThemeId(requestedThemeId?: string | null): ThemeId {
  if (requestedThemeId && isValidThemeId(requestedThemeId)) {
    return requestedThemeId;
  }
  return DEFAULT_THEME_ID;
}

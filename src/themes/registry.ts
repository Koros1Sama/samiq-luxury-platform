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
  'clinic-lab': {
    meta: SAMIQ_THEMES['clinic-lab'],
    load: () => import('./base/clinic-lab').then((m) => ({ default: m.ClinicLabTheme })),
  },
};

export { DEFAULT_THEME_ID, isValidThemeId, resolveThemeId } from './contract';

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeId } from './contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';

const LuxuryNoirTheme = dynamic(
  () => import(/* webpackChunkName: "theme-luxury" */ './base/luxury-noir'),
  { ssr: false }
);
const IvoryJournalTheme = dynamic(
  () => import(/* webpackChunkName: "theme-ivory" */ './base/ivory-journal'),
  { ssr: false }
);
const ClinicLabTheme = dynamic(
  () => import(/* webpackChunkName: "theme-clinic" */ './base/clinic-lab'),
  { ssr: false }
);

export function ThemeHost({ themeId }: { themeId: ThemeId }) {
  const sf = useStorefront();
  const effectiveTheme = sf.activeTheme || themeId;

  if (effectiveTheme === 'ivory-journal') {
    return <IvoryJournalTheme />;
  }
  if (effectiveTheme === 'clinic-lab') {
    return <ClinicLabTheme />;
  }
  return <LuxuryNoirTheme />;
}

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ThemeId } from './contract';

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
  if (themeId === 'ivory-journal') {
    return <IvoryJournalTheme />;
  }
  if (themeId === 'clinic-lab') {
    return <ClinicLabTheme />;
  }
  return <LuxuryNoirTheme />;
}

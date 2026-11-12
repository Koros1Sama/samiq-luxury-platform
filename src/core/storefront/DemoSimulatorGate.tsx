'use client';

import dynamic from 'next/dynamic';

const FeatureTierSimulator = dynamic(
  () =>
    import('@/themes/base/luxury-noir/components/FeatureTierSimulator').then(
      (m) => m.FeatureTierSimulator
    ),
  { ssr: false }
);

/**
 * Client-only host that keeps FeatureTierSimulator (and the features registry)
 * out of the cold `/` JS payload until explicitly rendered on `?demo=panel`.
 */
export function DemoSimulatorGate() {
  return <FeatureTierSimulator />;
}

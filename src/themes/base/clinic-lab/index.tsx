'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SectionRenderers, ThemeLayoutProps } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionsOutlet } from '@/core/storefront/SectionsOutlet';
import { withDeferredMount, DeferredMount } from '@/core/ui/DeferredMount';
import { ClinicHeader } from './components/ClinicHeader';
import { ClinicNavTabs } from './components/ClinicNavTabs';
import { ClinicHero } from './components/ClinicHero';
import { ClinicProductSection } from './components/ClinicProductSection';
import { ClinicAdvisorModalProps } from './components/ClinicAdvisorModal';
import { MobileAppTabBar } from '@/core/storefront/MobileAppTabBar';

const ClinicCategories = withDeferredMount(
  dynamic(
    () => import('./components/ClinicCategories').then((m) => m.ClinicCategories),
    { ssr: false }
  ),
  240
);
const ClinicContactSection = withDeferredMount(
  dynamic(
    () => import('./components/ClinicContactSection').then((m) => m.ClinicContactSection),
    { ssr: false }
  ),
  280,
  'contact'
);
const ClinicFooter = withDeferredMount(
  dynamic(
    () => import('./components/ClinicFooter').then((m) => m.ClinicFooter),
    { ssr: false }
  ),
  200
);

const ClinicBatchVerifier = dynamic(
  () => import('./components/ClinicBatchVerifier').then((m) => m.ClinicBatchVerifier),
  { ssr: false }
);
const ClinicCompareSlider = dynamic(
  () => import('./components/ClinicCompareSlider').then((m) => m.ClinicCompareSlider),
  { ssr: false }
);
const ClinicRoutineSteps = withDeferredMount(
  dynamic(
    () => import('./components/ClinicRoutineSteps').then((m) => m.ClinicRoutineSteps),
    { ssr: false }
  ),
  300,
  'routine'
);
const PwaInstallPrompt = withDeferredMount(
  dynamic(
    () => import('../luxury-noir/components/PwaInstallPrompt').then((m) => m.PwaInstallPrompt),
    { ssr: false }
  ),
  0
);
const ClinicFeatureStrip = withDeferredMount(
  dynamic(
    () => import('./components/ClinicGenericSections').then((m) => m.ClinicFeatureStrip),
    { ssr: false }
  ),
  160
);
const ClinicRichText = withDeferredMount(
  dynamic(
    () => import('./components/ClinicGenericSections').then((m) => m.ClinicRichText),
    { ssr: false }
  ),
  180
);
const ClinicFaq = withDeferredMount(
  dynamic(
    () => import('./components/ClinicGenericSections').then((m) => m.ClinicFaq),
    { ssr: false }
  ),
  220
);
const ClinicCta = withDeferredMount(
  dynamic(
    () => import('./components/ClinicGenericSections').then((m) => m.ClinicCta),
    { ssr: false }
  ),
  180
);
const ClinicTestimonials = withDeferredMount(
  dynamic(
    () => import('./components/ClinicGenericSections').then((m) => m.ClinicTestimonials),
    { ssr: false }
  ),
  220
);

// Strongly-typed on-demand drawer loaders to defer off-screen bundles and keep cold First Load JS under 150 kB
function OnDemandCartDrawer({
  loader,
}: {
  loader: () => Promise<{ default: React.ComponentType<Record<string, never>> }>;
}) {
  const [Component, setComponent] = useState<React.ComponentType<Record<string, never>> | null>(null);

  useEffect(() => {
    let isMounted = true;
    loader().then((mod) => {
      if (isMounted) setComponent(() => mod.default);
    });
    return () => {
      isMounted = false;
    };
  }, [loader]);

  if (!Component) return null;
  return <Component />;
}

function OnDemandAdvisorModal({
  loader,
  isOpen,
  onClose,
}: {
  loader: () => Promise<{ default: React.ComponentType<ClinicAdvisorModalProps> }>;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [Component, setComponent] = useState<React.ComponentType<ClinicAdvisorModalProps> | null>(null);

  useEffect(() => {
    let isMounted = true;
    loader().then((mod) => {
      if (isMounted) setComponent(() => mod.default);
    });
    return () => {
      isMounted = false;
    };
  }, [loader]);

  if (!Component) return null;
  return <Component isOpen={isOpen} onClose={onClose} />;
}

export const clinicLabRenderers: SectionRenderers = {
  hero: (_props) => <ClinicHero />,
  'product-grid': (props) => <ClinicProductSection {...props} />,
  'category-grid': (_props) => <ClinicCategories />,
  'feature-strip': (props) => <ClinicFeatureStrip {...props} />,
  'rich-text': (props) => <ClinicRichText {...props} />,
  faq: (props) => <ClinicFaq {...props} />,
  cta: (props) => <ClinicCta {...props} />,
  testimonials: (props) => <ClinicTestimonials {...props} />,
  contact: (_props) => <ClinicContactSection />,
  blocks: {
    'authenticity-compare': ({ data }) => (
      <section id="authenticity" className="w-full py-8 sm:py-12 bg-white border-t border-[#E2ECE9]">
        <DeferredMount minHeight={360}>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
            <ClinicBatchVerifier />
            <ClinicCompareSlider guideData={data as any} />
          </div>
        </DeferredMount>
      </section>
    ),
    'skin-routine': ({ data: _data }) => <ClinicRoutineSteps />,
  },
};

export function ClinicLabTheme(_props: ThemeLayoutProps) {
  const { features, cart } = useStorefront();
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-white text-[#0F4C4A] font-sans selection:bg-[#CFE8E1] selection:text-[#0F4C4A] antialiased pb-20 md:pb-0">
      {/* 1. Clinical Header (Sticky compact row on Mobile, Search + Logo on Desktop) */}
      <ClinicHeader
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenCart={cart.open}
      />

      {/* 2. Scrollable Section Tabs Under Header (Desktop) */}
      <div className="hidden md:block">
        <ClinicNavTabs />
      </div>

      {/* 3. Sections Dynamic Outlet */}
      <main>
        <SectionsOutlet renderers={clinicLabRenderers} />
      </main>

      {/* 4. Dedicated Clinical Footer (Footer Parity) */}
      <ClinicFooter />

      {/* 4. WhatsApp & Direct Clinical Cart Drawer (Loaded strictly on-demand when user opens cart) */}
      {features.cart_whatsapp && cart.isOpen && (
        <OnDemandCartDrawer
          loader={() =>
            import('./components/ClinicCartDrawer').then((m) => ({
              default: m.ClinicCartDrawer,
            }))
          }
        />
      )}

      {/* 5. Clinical Advisor Chat Modal (Loaded strictly on-demand when user opens advisor) */}
      {features.ai_chatbot && isAdvisorOpen && (
        <OnDemandAdvisorModal
          loader={() =>
            import('./components/ClinicAdvisorModal').then((m) => ({
              default: m.ClinicAdvisorModal,
            }))
          }
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
        />
      )}

      {/* PWA App Install Button */}
      <PwaInstallPrompt className="fixed bottom-20 end-4 z-40" />

      {/* Mobile App Bottom Bar */}
      <MobileAppTabBar />
    </div>
  );
}

export default ClinicLabTheme;

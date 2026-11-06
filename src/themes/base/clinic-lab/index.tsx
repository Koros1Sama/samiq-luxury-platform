'use client';

import React, { useState, useEffect } from 'react';
import { SectionRenderers, ThemeLayoutProps } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionsOutlet } from '@/core/storefront/SectionsOutlet';
import { ClinicHeader } from './components/ClinicHeader';
import { ClinicNavTabs } from './components/ClinicNavTabs';
import { ClinicHero } from './components/ClinicHero';
import { ClinicProductSection } from './components/ClinicProductSection';
import { ClinicCategories } from './components/ClinicCategories';
import { ClinicBatchVerifier } from './components/ClinicBatchVerifier';
import { ClinicCompareSlider } from './components/ClinicCompareSlider';
import { ClinicRoutineSteps } from './components/ClinicRoutineSteps';
import { ClinicContactSection } from './components/ClinicContactSection';
import { ClinicAdvisorModalProps } from './components/ClinicAdvisorModal';
import { PwaInstallPrompt } from '../luxury-noir/components/PwaInstallPrompt';
import { MobileAppTabBar } from '@/core/storefront/MobileAppTabBar';
import {
  ClinicFeatureStrip,
  ClinicRichText,
  ClinicFaq,
  ClinicCta,
  ClinicTestimonials,
} from './components/ClinicGenericSections';

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
          <ClinicBatchVerifier />
          <ClinicCompareSlider guideData={data as any} />
        </div>
      </section>
    ),
    'skin-routine': ({ data: _data }) => <ClinicRoutineSteps />,
  },
};

export function ClinicLabTheme(_props: ThemeLayoutProps) {
  const { features, cart } = useStorefront();
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-white text-[#0F4C4A] font-sans selection:bg-[#CFE8E1] selection:text-[#0F4C4A] antialiased pb-14 md:pb-0">
      {/* 1. Clinical Header (Sticky: Logo row + Always-Visible Search Field, Total ~104px) */}
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

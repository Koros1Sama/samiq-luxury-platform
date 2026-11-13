'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SectionRenderers, ThemeLayoutProps } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionsOutlet } from '@/core/storefront/SectionsOutlet';
import { LuxuryHeader } from './components/LuxuryHeader';
import { HeroShowcase } from './components/HeroShowcase';
import { ProductShowcase } from './components/ProductShowcase';
import { QuickCategoryStoriesBar } from './components/QuickCategoryStoriesBar';
import { MobileAppBottomNav } from './components/MobileAppBottomNav';
import { withDeferredMount } from '@/core/ui/DeferredMount';

const BrandBentoGrid = withDeferredMount(
  dynamic(
    () => import('./components/BrandBentoGrid').then((m) => m.BrandBentoGrid),
    { ssr: false }
  ),
  280,
  'categories-bento'
);
const StoreLocationAndSocial = withDeferredMount(
  dynamic(
    () => import('./components/StoreLocationAndSocial').then((m) => m.StoreLocationAndSocial),
    { ssr: false }
  ),
  280,
  'store-location'
);
const TrustFooterBar = withDeferredMount(
  dynamic(
    () => import('./components/TrustFooterBar').then((m) => m.TrustFooterBar),
    { ssr: false }
  ),
  180
);

const PwaInstallPrompt = withDeferredMount(
  dynamic(
    () => import('./components/PwaInstallPrompt').then((m) => m.PwaInstallPrompt),
    { ssr: false }
  ),
  0
);
const LuxuryFeatureStrip = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryFeatureStrip),
    { ssr: false }
  ),
  160
);
const LuxuryRichText = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryRichText),
    { ssr: false }
  ),
  180
);
const LuxuryFaq = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryFaq),
    { ssr: false }
  ),
  220
);
const LuxuryTestimonials = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryTestimonials),
    { ssr: false }
  ),
  220
);
const LuxuryCta = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryCta),
    { ssr: false }
  ),
  180
);
const LuxuryGallery = withDeferredMount(
  dynamic(
    () => import('./components/LuxuryGenericSections').then((m) => m.LuxuryGallery),
    { ssr: false }
  ),
  260
);

const AuthenticityCompareSlider = withDeferredMount(
  dynamic(
    () => import('./components/AuthenticityCompareSlider').then((m) => m.AuthenticityCompareSlider),
    { ssr: false }
  ),
  360,
  'authenticity-lab'
);
const SkinRoutineAndIngredients = withDeferredMount(
  dynamic(
    () => import('./components/SkinRoutineAndIngredients').then((m) => m.SkinRoutineAndIngredients),
    { ssr: false }
  ),
  300,
  'skin-routine'
);

// On-demand loader to defer heavy drawer/modal chunks strictly until user interaction
function OnDemandSection({
  loader,
  props,
}: {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  props?: any;
}) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

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
  return <Component {...props} />;
}

export const luxuryNoirRenderers: SectionRenderers = {
  hero: (props) => <HeroShowcase {...props} />,
  'product-grid': (props) => <ProductShowcase {...props} />,
  'category-grid': (props) => <BrandBentoGrid {...props} />,
  'feature-strip': (props) => <LuxuryFeatureStrip {...props} />,
  'rich-text': (props) => <LuxuryRichText {...props} />,
  gallery: (props) => <LuxuryGallery {...props} />,
  testimonials: (props) => <LuxuryTestimonials {...props} />,
  faq: (props) => <LuxuryFaq {...props} />,
  cta: (props) => <LuxuryCta {...props} />,
  contact: (props) => <StoreLocationAndSocial {...props} />,
  blocks: {
    'authenticity-compare': ({ data }) => (
      <AuthenticityCompareSlider guideData={data as any} />
    ),
    'skin-routine': ({ data }) => (
      <SkinRoutineAndIngredients skinData={data as any} />
    ),
  },
};

export function LuxuryNoirTheme(_props: ThemeLayoutProps) {
  const { features, activeCategory, setActiveCategory, cart } = useStorefront();
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#070709] text-ivory font-sans selection:bg-gold selection:text-obsidian-dark antialiased pb-20 md:pb-0">
      {/* 1. Header (Sticky 56px on Mobile, 64px on Desktop - Utility strip deleted) */}
      <LuxuryHeader onOpenAdvisor={() => setIsAdvisorOpen(true)} />

      {/* 2. Category Chips Row on Desktop */}
      {features.tier_3_catalog && (
        <div className="hidden md:block">
          <QuickCategoryStoriesBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      )}

      {/* 3. Dynamic Sections Outlet */}
      <main>
        <SectionsOutlet renderers={luxuryNoirRenderers} />
      </main>

      {/* 4. Footer Trust & Brand Info on Desktop */}
      <div className="hidden md:block">
        <TrustFooterBar />
      </div>

      {/* 5. Native Mobile App Bottom Navigation Bar (56px, opaque #0A0A0D) */}
      <MobileAppBottomNav />

      {/* PWA App Install Button */}
      <PwaInstallPrompt className="fixed bottom-20 end-4 z-40" />

      {/* 6. WhatsApp Cart Drawer (Loaded strictly on-demand when user opens cart) */}
      {features.cart_whatsapp && cart.isOpen && (
        <OnDemandSection
          loader={() =>
            import('./components/WhatsAppCartDrawer').then((m) => ({
              default: m.WhatsAppCartDrawer,
            }))
          }
        />
      )}

      {/* 7. AI Beauty Advisor Bottom Sheet (Loaded strictly on-demand when user opens advisor) */}
      {features.ai_chatbot && isAdvisorOpen && (
        <OnDemandSection
          loader={() =>
            import('./components/AiBeautyAdvisor').then((m) => ({
              default: m.AiBeautyAdvisor,
            }))
          }
          props={{
            isOpen: isAdvisorOpen,
            onClose: () => setIsAdvisorOpen(false),
          }}
        />
      )}
    </div>
  );
}

export default LuxuryNoirTheme;

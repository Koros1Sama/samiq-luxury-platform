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
import { TrustFooterBar } from './components/TrustFooterBar';
import { MobileAppBottomNav } from './components/MobileAppBottomNav';
import { BrandBentoGrid } from './components/BrandBentoGrid';
import { StoreLocationAndSocial } from './components/StoreLocationAndSocial';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

const AuthenticityCompareSlider = dynamic(
  () => import('./components/AuthenticityCompareSlider').then((m) => m.AuthenticityCompareSlider),
  { ssr: false }
);
const SkinRoutineAndIngredients = dynamic(
  () => import('./components/SkinRoutineAndIngredients').then((m) => m.SkinRoutineAndIngredients),
  { ssr: false }
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
  'feature-strip': (props) => (
    <QuickCategoryStoriesBar
      activeCategory=""
      onSelectCategory={() => {}}
      {...props}
    />
  ),
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
    <div className="min-h-[100dvh] bg-[#070709] text-ivory font-sans selection:bg-gold selection:text-obsidian-dark antialiased pb-14 md:pb-0">
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

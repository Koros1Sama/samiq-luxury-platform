'use client';

import React, { useState, useEffect } from 'react';
import { SectionRenderers, ThemeLayoutProps } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionsOutlet } from '@/core/storefront/SectionsOutlet';
import { LuxuryHeader } from './components/LuxuryHeader';
import { HeroShowcase } from './components/HeroShowcase';
import { ProductShowcase } from './components/ProductShowcase';
import { BrandBentoGrid } from './components/BrandBentoGrid';
import { QuickCategoryStoriesBar } from './components/QuickCategoryStoriesBar';
import { AuthenticityCompareSlider } from './components/AuthenticityCompareSlider';
import { SkinRoutineAndIngredients } from './components/SkinRoutineAndIngredients';
import { StoreLocationAndSocial } from './components/StoreLocationAndSocial';
import { TrustFooterBar } from './components/TrustFooterBar';
import { MobileAppBottomNav } from './components/MobileAppBottomNav';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { AiBeautyAdvisor } from './components/AiBeautyAdvisor';
import { FeatureTierSimulator } from './components/FeatureTierSimulator';

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
  const { features, activeCategory, setActiveCategory } = useStorefront();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDemo(params.get('demo') === '1');
    }
  }, []);

  return (
    <div className="min-h-[100dvh] bg-obsidian text-ivory font-sans selection:bg-gold selection:text-obsidian-dark antialiased pb-16 md:pb-0">
      {/* 1. Header (Desktop & Mobile) */}
      <LuxuryHeader />

      {/* 2. Platform Feature Simulator (Rendered ONLY in demo=1 mode as top inline strip) */}
      {isDemo && <FeatureTierSimulator />}

      {/* 3. Quick Category Filter Bar */}
      <QuickCategoryStoriesBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 4. Dynamic Sections Outlet */}
      <main>
        <SectionsOutlet renderers={luxuryNoirRenderers} />
      </main>

      {/* 5. Footer Trust Dock */}
      <TrustFooterBar />

      {/* 6. Native Mobile App Bottom Navigation Bar (md:hidden) */}
      <MobileAppBottomNav />

      {/* 7. WhatsApp Cart Drawer */}
      {features.cart_whatsapp && <WhatsAppCartDrawer />}

      {/* 8. AI Beauty Advisor Bot */}
      {features.ai_chatbot && <AiBeautyAdvisor />}
    </div>
  );
}

export default LuxuryNoirTheme;

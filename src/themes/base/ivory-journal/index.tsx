'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { SectionRenderers, ThemeLayoutProps, ProductCardData } from '../../contract';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { SectionsOutlet } from '@/core/storefront/SectionsOutlet';

// Direct Below-the-Fold and Critical In-Fold Section Components
import { IvoryHeader } from './components/IvoryHeader';
import { IvoryHero } from './components/IvoryHero';
import { IvoryProductMosaic } from './components/IvoryProductMosaic';
import { IvoryCartPill } from './components/IvoryCartPill';
import { IvoryCategoryIndex } from './components/IvoryCategoryIndex';
import { IvoryEditorialQuote } from './components/IvoryEditorialQuote';
import { IvoryAuthenticityCard } from './components/IvoryAuthenticityCard';
import { IvoryColophonContact } from './components/IvoryColophonContact';
import {
  IvoryFeatureStrip,
  IvoryGallery,
  IvoryTestimonials,
  IvoryFaq,
  IvoryCta,
  IvorySkinRoutineBlock,
} from './components/IvoryGenericSections';
import { PwaInstallPrompt } from '../luxury-noir/components/PwaInstallPrompt';
import { MobileAppTabBar } from '@/core/storefront/MobileAppTabBar';

// Interactive Overlays & Modals ONLY (loaded on demand / user interaction)
const IvoryQuickViewSheet = dynamic(
  () => import('./components/IvoryQuickViewSheet').then((m) => m.IvoryQuickViewSheet),
  { ssr: false }
);

const IvoryCartDrawer = dynamic(
  () => import('./components/IvoryCartDrawer').then((m) => m.IvoryCartDrawer),
  { ssr: false }
);

const IvorySearchModal = dynamic(
  () => import('./components/IvorySearchModal').then((m) => m.IvorySearchModal),
  { ssr: false }
);

const IvoryAdvisorChat = dynamic(
  () => import('./components/IvoryAdvisorChat').then((m) => m.IvoryAdvisorChat),
  { ssr: false }
);

/**
 * Editorial Section Renderers for Ivory Journal
 * Implements EVERY generic section type in the SAMIQ contract
 * plus modular block overrides for authenticity and skin routine.
 */
export const createIvoryRenderers = (
  onSelectProduct?: (product: ProductCardData) => void
): SectionRenderers => ({
  hero: (props) => <IvoryHero {...props} />,
  'product-grid': (props) => (
    <IvoryProductMosaic onSelectProduct={onSelectProduct} {...props} />
  ),
  'category-grid': (props) => <IvoryCategoryIndex {...props} />,
  'feature-strip': (props) => <IvoryFeatureStrip {...props} />,
  'rich-text': (props) => <IvoryEditorialQuote {...props} />,
  gallery: (props) => <IvoryGallery {...props} />,
  testimonials: (props) => <IvoryTestimonials {...props} />,
  faq: (props) => <IvoryFaq {...props} />,
  contact: (props) => <IvoryColophonContact {...props} />,
  cta: (props) => <IvoryCta {...props} />,
  blocks: {
    'authenticity-compare': () => <IvoryAuthenticityCard />,
    'skin-routine': (props) => <IvorySkinRoutineBlock {...props} />,
  },
});

export function IvoryJournalTheme(_props: ThemeLayoutProps) {
  const { features, cart } = useStorefront();

  // Modals & Sheets State
  const [selectedProduct, setSelectedProduct] = useState<ProductCardData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const renderers = createIvoryRenderers((product) => setSelectedProduct(product));

  return (
    <div className="min-h-[100dvh] bg-[#FAF7F2] text-[#1B1612] font-sans selection:bg-[#B89B5E]/30 selection:text-[#1B1612] antialiased overflow-x-hidden flex flex-col justify-between pb-14 md:pb-0">
      {/* 1. Sticky Editorial Header (52px, Hamburger, Wordmark, Bag) */}
      <IvoryHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
      />

      {/* 2. Dynamic Sections Outlet */}
      <main className="w-full flex-1">
        <SectionsOutlet renderers={renderers} />
      </main>

      {/* 3. Navigation Pattern: Slim Bottom Cart Pill on Desktop, Mobile App Tab Bar on Mobile */}
      {features.cart_whatsapp && (
        <div className="hidden md:block">
          <IvoryCartPill />
        </div>
      )}

      {/* Mobile App Bottom Bar */}
      <MobileAppTabBar />

      {/* PWA App Install Button */}
      <PwaInstallPrompt className="fixed bottom-20 end-4 z-40" />

      {/* 4. Quick-View Bottom Sheet for Product Detail */}
      {selectedProduct && (
        <IvoryQuickViewSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 5. Cart Drawer UI using useCheckout() */}
      {features.cart_whatsapp && cart.isOpen && <IvoryCartDrawer />}

      {/* 6. Magazine Search Modal UI */}
      {isSearchOpen && (
        <IvorySearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}

      {/* 7. Beauty Advisor Chat UI */}
      {features.ai_chatbot && isAdvisorOpen && (
        <IvoryAdvisorChat
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      )}
    </div>
  );
}

// Export aliases for contract & registry backwards compatibility
export { IvoryJournalTheme as IvoryJournalStubLayout };
export default IvoryJournalTheme;

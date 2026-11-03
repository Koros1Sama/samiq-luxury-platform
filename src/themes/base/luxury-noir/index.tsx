'use client';

import React, { useState } from 'react';
import { StorefrontProps, ThemeCurrencyCode, ProductCardData, CartItem, FeatureFlags } from '../../contract';
import { LuxuryHeader } from './components/LuxuryHeader';
import { QuickCategoryStoriesBar } from './components/QuickCategoryStoriesBar';
import { HeroShowcase } from './components/HeroShowcase';
import { ProductShowcase } from './components/ProductShowcase';
import { AuthenticityCompareSlider } from './components/AuthenticityCompareSlider';
import { BrandBentoGrid } from './components/BrandBentoGrid';
import { SkinRoutineAndIngredients } from './components/SkinRoutineAndIngredients';
import { StoreLocationAndSocial } from './components/StoreLocationAndSocial';
import { TrustFooterBar } from './components/TrustFooterBar';
import { MobileAppBottomNav } from './components/MobileAppBottomNav';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { AiBeautyAdvisor } from './components/AiBeautyAdvisor';
import { FeatureTierSimulator } from './components/FeatureTierSimulator';

export function LuxuryNoirTheme({
  tenant,
  features,
  initialCurrency = 'YER',
  products,
  categories,
  authenticityGuide,
  skinRoutine,
}: StorefrontProps) {
  // Live State
  const [currentCurrency, setCurrentCurrency] = useState<ThemeCurrencyCode>(initialCurrency);
  const [activeFeatures, setActiveFeatures] = useState<FeatureFlags>(features);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product: ProductCardData, variantId?: string) => {
    setCartItems((prev) => {
      const existingKey = `${product.id}-${variantId || 'default'}`;
      const existingIdx = prev.findIndex((i) => i.id === existingKey);

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }

      const variant = product.variants?.find((v) => v.id === variantId);
      const newItem: CartItem = {
        id: existingKey,
        productId: product.id,
        variantId,
        title: product.title,
        variantTitle: variant?.title,
        unitPrice: product.prices,
        quantity: 1,
        image: product.image,
      };
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDirectWhatsApp = (product: ProductCardData) => {
    const priceFormatted = `${product.prices[currentCurrency]} ${currentCurrency}`;
    const text = encodeURIComponent(
      `مرحباً مفتاح الجمال، أود طلب المنتج الأصلي:\n*${product.title}*\nالسعر: ${priceFormatted}\nهل متوفر تسليم فوري مع فحص الباركود؟`
    );
    window.open(`https://wa.me/${tenant.whatsapp}?text=${text}`, '_blank');
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-[100dvh] bg-obsidian text-ivory font-sans selection:bg-gold selection:text-obsidian-dark antialiased pb-16 md:pb-0">
      {/* 1. Header (with Top Utility Micro-Bar & Slim Mobile Height) */}
      <LuxuryHeader
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        features={activeFeatures}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Quick Category Stories Bar (Mobile & Desktop) */}
      <QuickCategoryStoriesBar
        activeCategory={activeCategoryFilter}
        onSelectCategory={setActiveCategoryFilter}
      />

      <main>
        {/* 3. Compact Visual Hero Section */}
        <HeroShowcase
          onCtaClick={() => {
            const el = document.getElementById('products-catalog');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Product Catalog (Brought Immediately Above the Fold!) */}
        <ProductShowcase
          products={products}
          currentCurrency={currentCurrency}
          onAddToCart={handleAddToCart}
          onDirectWhatsApp={handleDirectWhatsApp}
          activeFilter={activeCategoryFilter}
        />

        {/* 5. Authenticity Comparison Slider (مختبر لكشف المقلد) */}
        {activeFeatures.authenticity_guide && (
          <AuthenticityCompareSlider guideData={authenticityGuide} />
        )}

        {/* 6. Brand Bento Grid */}
        <BrandBentoGrid categories={categories} />

        {/* 7. Skin Routine & Active Ingredients Map */}
        {activeFeatures.skin_routine_advisor && (
          <SkinRoutineAndIngredients skinData={skinRoutine} />
        )}

        {/* 8. Store Location & Official Channels (Google Maps & 4 Socials) */}
        <StoreLocationAndSocial />
      </main>

      {/* 9. Footer & Trust Dock */}
      <TrustFooterBar />

      {/* 10. Native Mobile App Bottom Navigation Bar (md:hidden) */}
      <MobileAppBottomNav
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 11. WhatsApp Cart Drawer */}
      {activeFeatures.cart_whatsapp && (
        <WhatsAppCartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          currentCurrency={currentCurrency}
          whatsappNumber={tenant.whatsapp}
        />
      )}

      {/* 12. AI Beauty Advisor Bot (Elevated on mobile to bottom-20) */}
      {activeFeatures.ai_chatbot && <AiBeautyAdvisor />}

      {/* 13. Platform Package Simulator (Elevated on mobile to bottom-20) */}
      <FeatureTierSimulator
        currentFeatures={activeFeatures}
        onFeaturesUpdate={setActiveFeatures}
      />
    </div>
  );
}

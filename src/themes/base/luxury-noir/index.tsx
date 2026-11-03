'use client';

import React, { useState } from 'react';
import { StorefrontProps, ThemeCurrencyCode, ProductCardData, CartItem, FeatureFlags } from '../../contract';
import { LuxuryHeader } from './components/LuxuryHeader';
import { HeroShowcase } from './components/HeroShowcase';
import { AuthenticityCompareSlider } from './components/AuthenticityCompareSlider';
import { SkinRoutineAndIngredients } from './components/SkinRoutineAndIngredients';
import { BrandBentoGrid } from './components/BrandBentoGrid';
import { ProductShowcase } from './components/ProductShowcase';
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer';
import { AiBeautyAdvisor } from './components/AiBeautyAdvisor';
import { TrustFooterBar } from './components/TrustFooterBar';
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

    // Auto open cart drawer
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleDirectWhatsApp = (product: ProductCardData) => {
    const price = product.prices[currentCurrency] || product.prices.YER;
    const msg = `مرحباً متجر مفتاح الجمال، أود الاستفسار وطلب منتج: *${product.title}* (${product.brand}) بسعر تقريبي: ${price} ${currentCurrency}، مع التأكد من رقم الدفعة الموثق.`;
    const cleanPhone = tenant.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-[100dvh] bg-obsidian text-ivory font-sans selection:bg-gold selection:text-obsidian-dark antialiased">
      {/* 1. Header */}
      <LuxuryHeader
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        features={activeFeatures}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        {/* 2. Hero Section */}
        <HeroShowcase
          onCtaClick={() => {
            const el = document.getElementById('featured-products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Authenticity Comparison Slider (Gated by feature) */}
        {activeFeatures.authenticity_guide && (
          <AuthenticityCompareSlider guideData={authenticityGuide} />
        )}

        {/* 4. Skin Routine & Active Ingredients Map (Gated by feature) */}
        {activeFeatures.skin_routine_advisor && (
          <SkinRoutineAndIngredients skinData={skinRoutine} />
        )}

        {/* 5. Brand Bento Grid */}
        <BrandBentoGrid categories={categories} />

        {/* 6. Product Showcase */}
        <ProductShowcase
          products={products}
          currentCurrency={currentCurrency}
          onAddToCart={handleAddToCart}
          onDirectWhatsApp={handleDirectWhatsApp}
        />
      </main>

      {/* 7. Footer & Trust Dock */}
      <TrustFooterBar />

      {/* 8. WhatsApp Cart Drawer (Gated by cart_whatsapp feature) */}
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

      {/* 9. AI Beauty Advisor Bot (Gated by ai_chatbot feature) */}
      {activeFeatures.ai_chatbot && <AiBeautyAdvisor />}

      {/* 10. Platform Live Package Simulator */}
      <FeatureTierSimulator
        currentFeatures={activeFeatures}
        onFeaturesUpdate={setActiveFeatures}
      />
    </div>
  );
}

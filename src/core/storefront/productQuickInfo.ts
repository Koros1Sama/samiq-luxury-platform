import { ProductCardData, ThemeCurrencyCode, CategoryBentoItem } from '@/themes/contract';
import { formatCurrency } from '@/core/currency/formatter';

export function matchesProductCategory(
  product: ProductCardData,
  activeCategory?: string | null,
  categories?: CategoryBentoItem[]
): boolean {
  if (!activeCategory || activeCategory === 'all' || activeCategory === '') {
    return true;
  }
  const prodCat = (product.categorySlug || '').trim().toLowerCase();
  const target = activeCategory.trim().toLowerCase();
  if (prodCat === target || product.id === activeCategory) {
    return true;
  }
  if (categories && categories.length > 0) {
    const matchedCat = categories.find(
      (c) =>
        c.id.toLowerCase() === target ||
        c.title.trim().toLowerCase() === target ||
        (c.href ? c.href.replace(/^#/, '').trim().toLowerCase() === target : false)
    );
    if (matchedCat) {
      const catSlug = matchedCat.href ? matchedCat.href.replace(/^#/, '').trim().toLowerCase() : '';
      return (
        prodCat === matchedCat.id.toLowerCase() ||
        prodCat === matchedCat.title.trim().toLowerCase() ||
        (Boolean(catSlug) && prodCat === catSlug)
      );
    }
  }
  return false;
}

export interface ProductQuickInfo {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  categorySlug: string;
  image: string;
  price: number;
  formattedPrice: string;
  comparePrice?: number;
  formattedComparePrice?: string;
  discountPercentage?: number;
  hasDiscount: boolean;
  badge?: string;
  isAuthenticGuaranteed: boolean;
  isFeatured: boolean;
  concentration?: string;
  ingredients?: string[];
  inStock: boolean;
  variantCount: number;
}

export function getProductQuickInfo(
  product: ProductCardData,
  currency: ThemeCurrencyCode = 'YER'
): ProductQuickInfo {
  const price = product.prices[currency] ?? product.prices.YER ?? 0;
  const comparePrice = product.comparePrices ? product.comparePrices[currency] : undefined;

  let discountPercentage: number | undefined;
  let hasDiscount = false;
  if (comparePrice && comparePrice > price && price > 0) {
    discountPercentage = Math.round(((comparePrice - price) / comparePrice) * 100);
    hasDiscount = discountPercentage > 0;
  }

  // Extract concentration if present (e.g. 10%, 10% + 1%, etc.)
  let concentration: string | undefined;
  const fullText = `${product.title} ${product.subtitle || ''}`;
  const concMatch = fullText.match(/\b(\d+%\s*(\+\s*\w+\s*\d+%)?|\d+%\s*\+?\s*\d*%?)/);
  if (concMatch) {
    concentration = concMatch[0].trim();
  }

  // Extract active ingredients keywords
  const ingredients: string[] = [];
  if (/فيتامين\s*سي|vitamin\s*c/i.test(fullText)) ingredients.push('فيتامين سي');
  if (/نياسيناميد|niacinamide/i.test(fullText)) ingredients.push('نياسيناميد');
  if (/هيالورونيك|hyaluronic/i.test(fullText)) ingredients.push('حمض الهيالورونيك');
  if (/سيراميد|ceramide/i.test(fullText)) ingredients.push('سيراميدات ثلاثية');
  if (/زنك|zinc/i.test(fullText)) ingredients.push('زنك 1%');
  if (/ساليسيليك|salicylic/i.test(fullText)) ingredients.push('حمض الساليسيليك');

  const variants = product.variants || [];
  const inStock = variants.length > 0 ? variants.some((v) => v.inStock) : true;

  return {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle,
    brand: product.brand,
    categorySlug: product.categorySlug,
    image: product.image,
    price,
    formattedPrice: formatCurrency(price, currency),
    comparePrice,
    formattedComparePrice: comparePrice ? formatCurrency(comparePrice, currency) : undefined,
    discountPercentage,
    hasDiscount,
    badge: product.badge,
    isAuthenticGuaranteed: Boolean(product.isAuthenticGuaranteed),
    isFeatured: Boolean(product.isFeatured),
    concentration,
    ingredients: ingredients.length > 0 ? ingredients : undefined,
    inStock,
    variantCount: variants.length,
  };
}

/**
 * SAMIQ Modular Blocks Types
 * Industry-specific block structures (Skincare, Authenticity, Clinics, etc.)
 * These are decoupled from the core storefront contract.
 */

export interface AuthenticityCheckPoint {
  title: string;
  originalFeature: string;
  fakeRisk: string;
}

export interface AuthenticityComparisonData {
  productId: string;
  productTitle: string;
  brand: string;
  original: {
    title: string;
    image: string;
    batchCode: string;
    formulaNotes: string;
    packagingNotes: string;
  };
  counterfeit: {
    title: string;
    image: string;
    batchCode: string;
    formulaNotes: string;
    packagingNotes: string;
  };
  checklist: AuthenticityCheckPoint[];
  videoUrl?: string;
}

export interface SkinTypeRoutine {
  id: 'oily' | 'dry' | 'sensitive';
  label: string;
  icon: string;
  tagline: string;
  routineDescription: string;
  steps: string[];
  recommendedProductIds: string[];
  activeIngredientIds: string[];
}

export interface ActiveIngredientDetail {
  id: string;
  nameEn: string;
  nameAr: string;
  iconType: 'citrus' | 'drop' | 'molecule';
  benefitsAr: string;
  concentration: string;
}

export interface SkinRoutineData {
  title: string;
  subtitle: string;
  skinTypes: SkinTypeRoutine[];
  ingredients: ActiveIngredientDetail[];
}

export interface BlockDefinition<T = unknown> {
  key: string;
  requiresFeature?: string;
  loadData?: (db: any, props?: Record<string, unknown>) => T;
  DefaultRenderer: React.ComponentType<{
    blockKey: string;
    data?: T;
    props?: Record<string, unknown>;
  }>;
}

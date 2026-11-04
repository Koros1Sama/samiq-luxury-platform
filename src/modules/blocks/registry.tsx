import React from 'react';
import { BlockDefinition } from './types';

// Default Neutral Fallback Renderer for Authenticity Compare
function DefaultAuthenticityRenderer({ data }: { data?: any }) {
  if (!data) return null;
  return (
    <div className="my-8 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 max-w-5xl mx-auto">
      <h3 className="text-xl font-bold mb-2">دليل المطابقة والتحقق ({data.productTitle || data.productId})</h3>
      <p className="text-sm text-neutral-400 mb-4">{data.brand}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700">
          <span className="text-xs font-semibold text-emerald-400 block mb-1">المنتج الأصلي</span>
          <p className="text-xs text-neutral-300">{data.original?.packagingNotes || data.original?.title}</p>
        </div>
        <div className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700">
          <span className="text-xs font-semibold text-rose-400 block mb-1">المغشوش والمقلد</span>
          <p className="text-xs text-neutral-300">{data.counterfeit?.packagingNotes || data.counterfeit?.title}</p>
        </div>
      </div>
    </div>
  );
}

// Default Neutral Fallback Renderer for Skin Routine
function DefaultSkinRoutineRenderer({ data }: { data?: any }) {
  if (!data) return null;
  return (
    <div className="my-8 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 max-w-5xl mx-auto">
      <h3 className="text-xl font-bold mb-1">{data.title || 'دليل الروتين والمكونات'}</h3>
      <p className="text-sm text-neutral-400 mb-4">{data.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {data.skinTypes?.map((t: any) => (
          <div key={t.id} className="p-3.5 rounded-xl bg-neutral-800/60 border border-neutral-700">
            <h4 className="text-sm font-semibold text-neutral-200">{t.label}</h4>
            <p className="text-xs text-neutral-400 mt-1">{t.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const BLOCKS_REGISTRY: Record<string, BlockDefinition<any>> = {
  'authenticity-compare': {
    key: 'authenticity-compare',
    requiresFeature: 'authenticity_guide',
    loadData: (db, props) => {
      const guideKey = (props?.productId as string) || 'prod-1';
      return (
        db.content?.blocks?.['authenticity-compare']?.[guideKey] ||
        db.authenticityGuides?.[guideKey] ||
        Object.values(db.authenticityGuides || {})[0] ||
        null
      );
    },
    DefaultRenderer: DefaultAuthenticityRenderer,
  },
  'skin-routine': {
    key: 'skin-routine',
    requiresFeature: 'skin_routine_advisor',
    loadData: (db) => {
      return db.content?.blocks?.['skin-routine'] || null;
    },
    DefaultRenderer: DefaultSkinRoutineRenderer,
  },
};

export function getBlock(key: string): BlockDefinition<any> | undefined {
  return BLOCKS_REGISTRY[key];
}

export function loadAllBlocksData(db: any): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, block] of Object.entries(BLOCKS_REGISTRY)) {
    if (block.loadData) {
      result[key] = block.loadData(db);
    }
  }
  return result;
}

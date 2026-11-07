import React from 'react';
import { BlockDefinition } from './types';

// Default Neutral Fallback Renderer for Authenticity Compare
function DefaultAuthenticityRenderer({ data }: { data?: any }) {
  if (!data) return null;
  return (
    <div
      className="my-8 p-6 rounded-2xl border max-w-5xl mx-auto shadow-sm transition-colors"
      style={{
        backgroundColor: 'var(--samiq-surface, #121214)',
        borderColor: 'var(--samiq-border, rgba(255, 255, 255, 0.1))',
        color: 'var(--samiq-text, #F4EFE6)',
      }}
    >
      <h3 className="text-xl font-bold mb-2">دليل المطابقة والتحقق ({data.productTitle || data.productId})</h3>
      <p className="text-sm mb-4 opacity-75">{data.brand}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--samiq-bg, #0B0B0C)',
            borderColor: 'var(--samiq-border, rgba(255, 255, 255, 0.1))',
          }}
        >
          <span className="text-xs font-semibold text-emerald-400 block mb-1">المنتج الأصلي</span>
          <p className="text-xs opacity-90">{data.original?.packagingNotes || data.original?.title}</p>
        </div>
        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: 'var(--samiq-bg, #0B0B0C)',
            borderColor: 'var(--samiq-border, rgba(255, 255, 255, 0.1))',
          }}
        >
          <span className="text-xs font-semibold text-rose-400 block mb-1">المغشوش والمقلد</span>
          <p className="text-xs opacity-90">{data.counterfeit?.packagingNotes || data.counterfeit?.title}</p>
        </div>
      </div>
    </div>
  );
}

// Default Neutral Fallback Renderer for Skin Routine
function DefaultSkinRoutineRenderer({ data }: { data?: any }) {
  if (!data) return null;
  return (
    <div
      className="my-8 p-6 rounded-2xl border max-w-5xl mx-auto shadow-sm transition-colors"
      style={{
        backgroundColor: 'var(--samiq-surface, #121214)',
        borderColor: 'var(--samiq-border, rgba(255, 255, 255, 0.1))',
        color: 'var(--samiq-text, #F4EFE6)',
      }}
    >
      <h3 className="text-xl font-bold mb-1">{data.title || 'دليل الروتين والمكونات'}</h3>
      <p className="text-sm mb-4 opacity-75">{data.subtitle}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {data.skinTypes?.map((t: any) => (
          <div
            key={t.id}
            className="p-3.5 rounded-xl border"
            style={{
              backgroundColor: 'var(--samiq-bg, #0B0B0C)',
              borderColor: 'var(--samiq-border, rgba(255, 255, 255, 0.1))',
            }}
          >
            <h4 className="text-sm font-semibold opacity-90">{t.label}</h4>
            <p className="text-xs opacity-70 mt-1">{t.tagline}</p>
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

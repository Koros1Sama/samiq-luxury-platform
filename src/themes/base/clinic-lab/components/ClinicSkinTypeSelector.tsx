'use client';

import React from 'react';

export type SkinTypeId = 'all' | 'oily' | 'dry' | 'sensitive';

interface SkinTypeOption {
  id: SkinTypeId;
  label: string;
}

const SKIN_TYPES: SkinTypeOption[] = [
  { id: 'all', label: 'الكل' },
  { id: 'oily', label: 'دهنية' },
  { id: 'dry', label: 'جافة' },
  { id: 'sensitive', label: 'حساسة' },
];

interface ClinicSkinTypeSelectorProps {
  selectedSkinType: SkinTypeId;
  onSelectSkinType: (type: SkinTypeId) => void;
  resultCount?: number;
}

export function ClinicSkinTypeSelector({
  selectedSkinType,
  onSelectSkinType,
  resultCount,
}: ClinicSkinTypeSelectorProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 border-b border-[#E2ECE9]">
      {/* Label & Active Count */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-bold text-[#0F4C4A] shrink-0">
          نوع بشرتك:
        </span>
        {resultCount !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#CFE8E1] text-[#0F4C4A] font-semibold">
            {resultCount} منتجات موصوفة
          </span>
        )}
      </div>

      {/* Segmented Selector Buttons */}
      <div
        role="group"
        aria-label="تحديد نوع البشرة"
        className="inline-flex items-center p-1 rounded-xl bg-[#F2F7F5] border border-[#D4E5E0] self-start sm:self-auto"
      >
        {SKIN_TYPES.map((type) => {
          const isActive = selectedSkinType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectSkinType(type.id)}
              className={`min-h-[40px] min-w-[56px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0F4C4A] ${
                isActive
                  ? 'bg-white text-[#0F4C4A] shadow-xs border border-[#0F4C4A]/30'
                  : 'text-[#4A5568] hover:text-[#0F4C4A]'
              }`}
              aria-pressed={isActive}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

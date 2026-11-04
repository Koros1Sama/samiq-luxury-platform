'use client';

import React from 'react';
import { SmartImage } from '@/core/ui/SmartImage';
import { useStorefront } from '@/core/storefront/StorefrontProvider';
import { getProductQuickInfo } from '@/core/storefront/productQuickInfo';
import { ProductCardData } from '@/themes/contract';
import { CloseIcon, SearchIcon, PlusIcon, ArrowIcon } from './IvoryIcons';

interface IvorySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: ProductCardData) => void;
}

export function IvorySearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: IvorySearchModalProps) {
  const { search, currency, cart } = useStorefront();

  if (!isOpen) return null;

  const quickQueries = ['فيتامين سي', 'غسول', 'نياسيناميد', 'مرطب', 'سيروم'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-8 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] shadow-2xl overflow-hidden mt-8 sm:mt-16 flex flex-col max-h-[80dvh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E8E2D8] flex items-center gap-3">
          <SearchIcon size={22} color="#5E6B5A" />
          <input
            type="text"
            autoFocus
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            placeholder="ابحثي عن مستحضر، مكون فعال، أو قسم..."
            className="flex-1 bg-transparent font-serif text-lg sm:text-xl text-[#1B1612] placeholder:text-[#A0988E] focus:outline-none"
          />
          {search.query && (
            <button
              type="button"
              aria-label="مسح البحث"
              onClick={() => search.setQuery('')}
              className="w-8 h-8 flex items-center justify-center text-[#877E75] hover:text-[#1B1612]"
            >
              <CloseIcon size={16} />
            </button>
          )}
          <button
            type="button"
            aria-label="إغلاق البحث"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1B1612] hover:text-[#5E6B5A] transition-colors rounded-full border border-[#1B1612]/10"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!search.query && (
          <div className="p-4 sm:p-6 border-b border-[#E8E2D8]/60 bg-[#F7F4ED]">
            <span className="text-xs font-sans font-semibold text-[#554D46] block mb-2">
              عمليات بحث شائعة في المجلة:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickQueries.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => search.setQuery(q)}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-full border border-[#E8E2D8] bg-[#FAF7F2] text-[#1B1612] text-xs font-sans hover:border-[#5E6B5A] hover:text-[#5E6B5A] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#E8E2D8]">
          {search.query && search.results.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm font-sans text-[#554D46]">
              لم نعثر على نتائج مطابقة لـ &ldquo;{search.query}&rdquo;. جربي البحث باسم المكون أو القسم.
            </div>
          ) : (
            search.results.map((product) => {
              const info = getProductQuickInfo(product, currency);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (onSelectProduct) onSelectProduct(product);
                    onClose();
                  }}
                  className="py-3 sm:py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F4ED] p-2 rounded transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded bg-[#EFEAE1] border border-[#E8E2D8] overflow-hidden flex-shrink-0">
                      <SmartImage
                        src={product.image}
                        alt={product.title}
                        priority={false}
                        sizes="56px"
                        className="object-cover object-center w-full h-full mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#1B1612] group-hover:text-[#5E6B5A] transition-colors">
                        {product.title}
                      </h4>
                      <span className="font-sans font-bold text-xs sm:text-sm text-[#1B1612] block">
                        {info.formattedPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="أضف إلى الحقيبة"
                      onClick={(e) => {
                        e.stopPropagation();
                        cart.add(product);
                      }}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#1B1612]/20 hover:border-[#1B1612] bg-[#FAF7F2] hover:bg-[#1B1612] text-[#1B1612] hover:text-[#FAF7F2] rounded-full transition-colors"
                    >
                      <PlusIcon size={16} color="currentColor" />
                    </button>
                    <span className="rtl:-scale-x-100 text-[#877E75] group-hover:text-[#1B1612]">
                      <ArrowIcon size={18} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

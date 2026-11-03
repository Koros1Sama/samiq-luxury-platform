'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductCardData, ThemeCurrencyCode } from '../../../contract';
import { formatCurrency } from '@/core/currency/formatter';
import { CloseIcon, VerifiedCheckIcon } from './LuxuryIcons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: ThemeCurrencyCode;
}

export function SearchModal({ isOpen, onClose, currentCurrency }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/store/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.results || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const quickTags = ['فيتامين سي', 'سيرافي', 'نياسيناميد', 'بشرة دهنية', 'تصبغات', 'أحمر شفاه'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface border border-gold/40 shadow-2xl overflow-hidden text-ivory">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 bg-obsidian border-b border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>

          <input
            type="text"
            autoFocus
            placeholder="ابحثي عن منتج، ماركة، مكون فعال، أو مشكلة جلدية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-ivory placeholder-muted-lux outline-none"
          />

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux text-xs"
          >
            <CloseIcon size={16} color="#9A968E" />
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="p-3 bg-obsidian/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-muted-lux font-sans whitespace-nowrap">مقترحات:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="text-xs font-sans px-2.5 py-1 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/30 text-champagne whitespace-nowrap transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="p-4 sm:p-5 max-h-[450px] overflow-y-auto space-y-3">
          {loading && (
            <div className="py-8 text-center text-xs text-muted-lux font-sans">
              جاري البحث في كتالوج المنتجات الموثقة...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-serif text-ivory">لا توجد نتائج مطابقة لبحثك</p>
              <p className="text-xs text-muted-lux font-sans">
                جربي البحث باسم الماركة (مثل CeraVe أو The Ordinary) أو نوع المشكلة (تصبغات، مسامات).
              </p>
            </div>
          )}

          {!loading &&
            results.map((product) => {
              const price = product.prices[currentCurrency] || product.prices.YER;
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/40 flex items-center justify-between gap-4 transition group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 bg-white/5">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-sans text-gold font-semibold block">
                        {product.brand}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-ivory group-hover:text-champagne transition line-clamp-1">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-serif font-bold text-champagne">
                          {formatCurrency(price, currentCurrency)}
                        </span>
                        {product.isAuthenticGuaranteed && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-sans">
                            <VerifiedCheckIcon size={10} color="#34D399" />
                            <span>أصلي 100%</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-sans font-bold text-gold group-hover:-translate-x-1 transition-transform">
                    عرض التفاصيل ←
                  </span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

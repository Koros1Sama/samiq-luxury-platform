'use client';

import React from 'react';
import { PlayVideoIcon, CloseIcon } from './LuxuryIcons';

interface VideoVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoVerificationModal({ isOpen, onClose }: VideoVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0E0E12] border border-gold/40 shadow-2xl p-5 sm:p-6 text-ivory space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <PlayVideoIcon size={20} color="#C9A84C" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-ivory">
              فيديو فحص وتدقيق سيروم الأصلي مقابل التقليد
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-lux hover:text-ivory"
            aria-label="إغلاق"
          >
            <CloseIcon size={18} color="#9A968E" />
          </button>
        </div>

        <div className="rounded-2xl bg-black aspect-video flex flex-col items-center justify-center relative overflow-hidden border border-white/10 p-4">
          <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/60 flex items-center justify-center text-gold shadow-[0_0_25px_rgba(201,168,76,0.5)]">
            <PlayVideoIcon size={26} color="#C9A84C" />
          </div>
          <p className="text-xs sm:text-sm text-champagne mt-4 font-sans font-semibold text-center">
            شرح عملي من خبراء متجر مفتاح الجمال (صنعاء)
          </p>
          <p className="text-xs text-muted-lux mt-1 text-center font-sans">
            رقم الباتش الموثق: 54U700 — تجربة القوام الفوري على ظهر اليد
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 rounded-xl bg-gold text-obsidian-dark font-sans font-bold text-xs hover:brightness-110 transition"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}

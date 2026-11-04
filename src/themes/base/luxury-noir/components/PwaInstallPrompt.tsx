'use client';

import React, { useState, useEffect } from 'react';
import { CloseIcon } from './LuxuryIcons';

interface PwaInstallPromptProps {
  className?: string;
  isCompact?: boolean;
}

export function PwaInstallPrompt({ className = '', isCompact = false }: PwaInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  if (!isInstallable && !deferredPrompt) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="تثبيت التطبيق على هاتفك"
        className={`min-w-[40px] min-h-[40px] flex items-center justify-center gap-2 px-3.5 py-2 rounded-full bg-gold/10 hover:bg-gold/20 text-champagne border border-gold/30 text-xs font-sans font-semibold transition ${className}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {!isCompact && <span>تثبيت التطبيق</span>}
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-surface border border-gold/40 shadow-2xl space-y-4 text-ivory text-xs font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-sm font-serif font-bold text-champagne">تثبيت التطبيق</h4>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-lux hover:text-ivory"
                aria-label="إغلاق"
              >
                <CloseIcon size={16} color="#9A968E" />
              </button>
            </div>

            <p className="text-muted-lux leading-relaxed">
              لتثبيت المتجر كتطبيق فوري على شاشة هاتفك الرئيسية:
            </p>

            <div className="space-y-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span className="leading-relaxed">اضغطي على زر المشاركة (Share) أسفل المتصفح (Safari أو Chrome).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span className="leading-relaxed">اختاري &quot;إضافة إلى الصفحة الرئيسية&quot; (Add to Home Screen).</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-gold/15 text-gold border border-gold/30 font-bold hover:bg-gold/25 transition text-xs"
            >
              تم الفهم
            </button>
          </div>
        </div>
      )}
    </>
  );
}

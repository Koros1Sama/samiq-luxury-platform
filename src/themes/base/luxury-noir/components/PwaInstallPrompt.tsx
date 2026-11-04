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
    // Only intercept if the app intends to prompt the user
    const handleBeforeInstall = (e: Event) => {
      // Store event for custom install prompt
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Detect if already installed / in standalone mode
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

  // If not installable and no manual trigger needed, stay unobtrusive
  if (!isInstallable && !deferredPrompt) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="تثبيت التطبيق على هاتفك"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gold/10 hover:bg-gold/20 text-champagne border border-gold/30 text-xs font-semibold transition ${className}`}
      >
        <svg
          width="14"
          height="14"
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
        {!isCompact && <span className="text-[11px] font-sans">تثبيت التطبيق</span>}
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
                className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-muted-lux hover:text-ivory"
              >
                <CloseIcon size={14} color="#9A968E" />
              </button>
            </div>

            <p className="text-muted-lux leading-relaxed">
              لتثبيت المتجر كتطبيق فوري على شاشة هاتفك الرئيسية:
            </p>

            <div className="space-y-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>اضغطي على زر المشاركة (Share) أسفل المتصفح (Safari أو Chrome).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>اختاري &quot;إضافة إلى الصفحة الرئيسية&quot; (Add to Home Screen).</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-gold/15 text-gold border border-gold/30 font-bold hover:bg-gold/25 transition"
            >
              تم الفهم
            </button>
          </div>
        </div>
      )}
    </>
  );
}

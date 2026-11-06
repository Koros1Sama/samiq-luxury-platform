import React from 'react';

interface MiftahLogoSvgProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function MiftahLogoSvg({
  className = '',
  size = 48,
  showText = true,
}: MiftahLogoSvgProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Golden Emblem Badge */}
      <div
        className="relative shrink-0 flex items-center justify-center rounded-full p-[2px] bg-gradient-to-tr from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-[0_0_15px_rgba(201,168,76,0.35)]"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-[#0E0E12] flex items-center justify-center p-1 relative overflow-hidden">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="50%" stopColor="#FCF6BA" />
                <stop offset="100%" stopColor="#B38728" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
            <circle cx="50" cy="50" r="39" stroke="url(#goldGrad)" strokeWidth="0.8" />

            {/* Profile silhouette & Monogram */}
            <path
              d="M38 28C42 22 52 22 57 26C62 30 63 36 62 42C60 49 53 53 48 57C45 59.5 44 63 43 67"
              stroke="url(#goldGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path d="M40 38C38 38 35 39 34 42C33 44 35 45.5 37 46C34.5 47.5 34 49 35.5 50.5C37 52 40 53 42 53" stroke="url(#goldGrad)" strokeWidth="1.6" strokeLinecap="round" />

            <text
              x="62"
              y="74"
              fill="url(#goldGrad)"
              fontSize="22"
              fontWeight="bold"
              fontFamily="var(--font-amiri), serif"
              textAnchor="middle"
            >
              مـج
            </text>
          </svg>
        </div>
      </div>

      {/* Brand Name & Authenticity Slogan */}
      {showText && (
        <div className="flex flex-col text-start min-w-0 leading-tight">
          <span className="font-serif text-sm sm:text-2xl font-bold bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(201,168,76,0.3)] truncate max-w-[125px] sm:max-w-none">
            مفتاح الجمال
          </span>
          <span className="hidden sm:block text-xs text-champagne font-sans font-medium truncate max-w-[125px] sm:max-w-none mt-0.5">
            لكشف المقلد
          </span>
        </div>
      )}
    </div>
  );
}

import React from 'react';

interface MiftahLogoSvgProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function MiftahLogoSvg({
  className = '',
  size = 54,
  showText = true,
}: MiftahLogoSvgProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Golden Emblem Badge */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center rounded-full p-[2px] bg-gradient-to-tr from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-[0_0_20px_rgba(201,168,76,0.35)]"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-[#0E0E12] flex items-center justify-center p-1 relative overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BF953F" />
                <stop offset="35%" stopColor="#FCF6BA" />
                <stop offset="70%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#B38728" />
              </linearGradient>
              <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#FFF2A3" />
              </linearGradient>
            </defs>

            {/* Inner concentric ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#goldGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.7"
            />
            <circle
              cx="50"
              cy="50"
              r="41"
              stroke="url(#goldGrad)"
              strokeWidth="0.75"
              opacity="0.9"
            />

            {/* Elegant Woman Silhouette Profile (Facing left/RTL) */}
            <path
              d="M38 28C42 22 52 22 57 26C62 30 63 36 62 42C60 49 53 53 48 57C45 59.5 44 63 43 67C42 71 39 74 35 76"
              stroke="url(#goldGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Eyelash & Nose & Lips Silhouette */}
            <path
              d="M40 38C38 38 35 39 34 42C33 44 35 45.5 37 46C34.5 47.5 34 49 35.5 50.5C37 52 40 53 42 53"
              stroke="url(#goldGrad)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Botanical Leaf Filigree in Hair */}
            <path
              d="M52 25C54 20 61 18 64 21C67 24 64 29 60 30C56 31 53 29 52 25Z"
              fill="url(#leafGrad)"
              opacity="0.85"
            />
            <path
              d="M59 30C63 27 69 28 70 32C71 36 67 39 63 39C60 39 58 35 59 30Z"
              fill="url(#leafGrad)"
              opacity="0.75"
            />
            <path
              d="M62 40C66 38 71 40 72 44C73 48 69 51 65 51C62 51 61 46 62 40Z"
              fill="url(#leafGrad)"
              opacity="0.65"
            />

            {/* Monogram Ligature "م ج" (Miftah Jamal) */}
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
        <div className="flex flex-col text-start whitespace-nowrap min-w-0 leading-tight">
          <span className="font-serif text-base sm:text-2xl font-bold bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(201,168,76,0.3)] whitespace-nowrap">
            مفتاح الجمال
          </span>
          <span className="text-[10px] sm:text-xs text-champagne font-sans font-medium whitespace-nowrap mt-0.5">
            لكشف المقلد
          </span>
        </div>
      )}
    </div>
  );
}

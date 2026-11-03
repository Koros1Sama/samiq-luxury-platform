import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Bespoke Ultra-Thin Monoline Icons for SAMIQ Luxury Noir
 * Standard strokeWidth: 1.25, Color: #C9A84C (Gold) or currentColor
 * Replaces 100% of emojis with high-fashion agency vector art.
 */

// 1. Drop Skin Icon (for Oily Skin: monoline drop with 3 micro-dots beneath)
export function DropSkinIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 2.5C12 2.5 5.5 10 5.5 14.5C5.5 18.09 8.41 21 12 21C15.59 21 18.5 18.09 18.5 14.5C18.5 10 12 2.5 12 2.5Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="15.5" r="0.75" fill={color} />
      <circle cx="12" cy="16.5" r="0.75" fill={color} />
      <circle cx="14.5" cy="15.5" r="0.75" fill={color} />
    </svg>
  );
}

// 2. Wave Skin Icon (for Dry Skin: triple gentle undulating waves)
export function WaveSkinIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M3 8C5.5 6.5 8.5 6.5 11 8C13.5 9.5 16.5 9.5 19 8C20 7.4 20.8 7 21 7"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 13C5.5 11.5 8.5 11.5 11 13C13.5 14.5 16.5 14.5 19 13C20 12.4 20.8 12 21 12"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18C5.5 16.5 8.5 16.5 11 18C13.5 19.5 16.5 19.5 19 18C20 17.4 20.8 17 21 17"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Feather Skin Icon (for Sensitive Skin: delicate monoline leaf/quill)
export function FeatherSkinIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M20.24 3.76C17.5 3 13 4.5 9.5 8C5.5 12 4 17 4 19.5C6.5 19.5 11.5 18 15.5 14C19 10.5 20.5 6 19.74 3.26"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 19.5L12 11.5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9C13 9.5 11 11 11 11"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M17 6.5C15.5 7 13.5 8.5 13.5 8.5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4. Citrus Ingredient Icon (Vitamin C: geometric radial citrus wheel)
export function CitrusIngredientIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <circle cx="12" cy="12" r="9" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="7.5" strokeWidth={0.75} strokeDasharray="1.5 1.5" />
      <circle cx="12" cy="12" r="1.5" strokeWidth={strokeWidth} />
      <line x1="12" y1="4.5" x2="12" y2="10.5" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="12" y1="13.5" x2="12" y2="19.5" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4.5" y1="12" x2="10.5" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="13.5" y1="12" x2="19.5" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="6.7" y1="6.7" x2="10.9" y2="10.9" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="13.1" y1="13.1" x2="17.3" y2="17.3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="6.7" y1="17.3" x2="10.9" y2="13.1" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="13.1" y1="10.9" x2="17.3" y2="6.7" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 5. Hydra Drop Ingredient Icon (Hyaluronic Acid: delicate double contour hydration drop)
export function HydraDropIngredientIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 3C12 3 6 10.5 6 15C6 18.31 8.69 21 12 21C15.31 21 18 18.31 18 15C18 10.5 12 3 12 3Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7C12 7 8.5 12 8.5 15C8.5 16.93 10.07 18.5 12 18.5"
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </svg>
  );
}

// 6. Hex Molecule Ingredient Icon (Niacinamide: geometric hexagon benzoid ring)
export function HexMoleculeIngredientIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 3L19 7V15L12 19L5 15V7L12 3Z"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="3" r="1.5" fill={color} />
      <circle cx="19" cy="7" r="1.5" fill={color} />
      <circle cx="19" cy="15" r="1.5" fill={color} />
      <circle cx="12" cy="19" r="1.5" fill={color} />
      <circle cx="5" cy="15" r="1.5" fill={color} />
      <circle cx="5" cy="7" r="1.5" fill={color} />
      <circle cx="12" cy="11" r="2.5" strokeWidth={0.75} />
    </svg>
  );
}

// 7. Shield Check Icon (ضمان الأصالة)
export function ShieldCheckIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 3L4 6.5V12C4 16.5 7.5 20.5 12 21.5C16.5 20.5 20 16.5 20 12V6.5L12 3Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 8. Delivery Van Icon (شحن سريع)
export function DeliveryVanIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <rect x="2" y="6" width="13" height="11" rx="1.5" strokeWidth={strokeWidth} />
      <path d="M15 9H19.5L22 12.5V17H15V9Z" strokeWidth={strokeWidth} strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="2" strokeWidth={strokeWidth} />
      <circle cx="17.5" cy="18" r="2" strokeWidth={strokeWidth} />
      <line x1="8.5" y1="18" x2="15.5" y2="18" strokeWidth={strokeWidth} />
    </svg>
  );
}

// 9. Concierge Headset Icon (دعم متخصص)
export function ConciergeHeadsetIcon({ className = '', size = 22, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M4 13C4 8.58 7.58 5 12 5C16.42 5 20 8.58 20 13V17C20 18.1 19.1 19 18 19H17V13H19"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <rect x="3" y="12" width="3" height="6" rx="1.5" strokeWidth={strokeWidth} />
      <path
        d="M17 19C17 20.1 16.1 21 15 21H12"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// 10. Verified Check Icon (الأصلي المضمون)
export function VerifiedCheckIcon({ className = '', size = 18, strokeWidth = 1.5, color = '#34D399' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path d="M20 6L9 17L4 12" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 11. Cross Warning Icon (التقليد المغشوش)
export function CrossWarningIcon({ className = '', size = 18, strokeWidth = 1.5, color = '#FB7185' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path d="M18 6L6 18M6 6L18 18" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 12. Sparkle Star Icon (Monoline luxury star)
export function SparkleStarIcon({ className = '', size = 18, strokeWidth = 1.25, color = '#C9A84C' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 2L13.8 8.2C14.4 10.3 16 11.9 18.1 12.5L24 14L18.1 15.5C16 16.1 14.4 17.7 13.8 19.8L12 26L10.2 19.8C9.6 17.7 8 16.1 5.9 15.5L0 14L5.9 12.5C8 11.9 9.6 10.3 10.2 8.2L12 2Z"
        transform="scale(0.8) translate(3, 1)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 13. Shopping Bag Icon
export function BagCartIcon({ className = '', size = 20, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M6 7V5C6 3.34 7.34 2 9 2H15C16.66 2 18 3.34 18 5V7"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <rect x="4" y="7" width="16" height="14" rx="2" strokeWidth={strokeWidth} />
      <circle cx="10" cy="11" r="1" fill={color} />
      <circle cx="14" cy="11" r="1" fill={color} />
    </svg>
  );
}

// 14. WhatsApp Monoline Icon
export function WhatsAppIcon({ className = '', size = 20, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M21 11.5C21 16.19 17.19 20 12.5 20C10.96 20 9.51 19.59 8.25 18.88L3 20.5L4.65 15.34C3.89 14.07 3.5 12.58 3.5 11.5C3.5 6.81 7.31 3 12 3C16.69 3 21 6.81 21 11.5Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.5C9.2 8 8.8 8 8.5 8C8.2 8 8 8.2 7.8 8.4C7.5 8.7 7 9.2 7 10.2C7 11.2 7.7 12.2 8 12.5C8.3 12.8 9.8 15.2 12.2 16.1C14.1 16.8 14.5 16.6 14.9 16.5C15.4 16.4 16.3 15.8 16.5 15.2C16.7 14.6 16.7 14.1 16.6 14C16.5 13.9 16.2 13.8 15.8 13.6C15.4 13.4 13.5 12.4 13.2 12.3C12.9 12.2 12.7 12.1 12.5 12.4C12.2 12.8 11.6 13.6 11.4 13.8C11.2 14 11 14 10.6 13.8C10.2 13.6 9 13.2 8.2 12.5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// 15. Play Video Icon
export function PlayVideoIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <polygon points="6,3 20,12 6,21" strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
}

// 16. Trash Icon
export function TrashIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 17. Tuning / Controls Icon (for Simulator)
export function TuningSliderIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="4" y1="21" x2="4" y2="14" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="10" x2="4" y2="3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="12" y1="21" x2="12" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="12" y1="8" x2="12" y2="3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="20" y1="21" x2="20" y2="16" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="20" y1="12" x2="20" y2="3" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="4" cy="12" r="2" strokeWidth={strokeWidth} />
      <circle cx="12" cy="10" r="2" strokeWidth={strokeWidth} />
      <circle cx="20" cy="14" r="2" strokeWidth={strokeWidth} />
    </svg>
  );
}

// 18. Close Icon
export function CloseIcon({ className = '', size = 16, strokeWidth = 1.5, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path d="M18 6L6 18M6 6L18 18" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 19. Star Rating Icon
export function StarIcon({ className = '', size = 14, strokeWidth = 1.25, color = 'currentColor', fill = 'none' }: IconProps & { fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className} stroke={color}>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 20. TikTok Monoline Icon
export function TikTokIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 21. Instagram Monoline Icon
export function InstagramIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={strokeWidth} />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth={strokeWidth} />
      <circle cx="17.5" cy="6.5" r="1" fill={color} />
    </svg>
  );
}

// 22. Facebook Monoline Icon
export function FacebookIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 23. Map Pin Monoline Icon
export function MapPinIcon({ className = '', size = 18, strokeWidth = 1.25, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" strokeWidth={strokeWidth} />
    </svg>
  );
}





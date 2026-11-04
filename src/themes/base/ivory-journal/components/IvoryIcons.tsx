import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Editorial Monoline SVG Icons for Ivory Journal
 * Aesthetic: Restrained, luxury magazine typography & vector art
 * Stroke: 1.25 to 1.5, Colors: #1B1612 (espresso), #5E6B5A (sage), #B89B5E (champagne)
 * ZERO emojis anywhere in the system.
 */

// 1. Hamburger Menu (minimalist two uneven editorial rules)
export function MenuIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="3" y1="8" x2="21" y2="8" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="3" y1="16" x2="15" y2="16" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 2. Close (X)
export function CloseIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 3. Magazine Shopping Bag
export function BagIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M6 8V6.5C6 4.567 7.567 3 9.5 3H14.5C16.433 3 18 4.567 18 6.5V8"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <rect x="4" y="8" width="16" height="13" rx="1.5" strokeWidth={strokeWidth} />
      <circle cx="12" cy="13" r="1.5" strokeWidth={strokeWidth} />
    </svg>
  );
}

// 4. Search Loupe
export function SearchIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <circle cx="11" cy="11" r="7" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 5. Plus (+)
export function PlusIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="12" y1="5" x2="12" y2="19" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 6. Minus (-)
export function MinusIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="5" y1="12" x2="19" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// 7. Arrow / Directional Indicator (RTL compatible with rtl:-scale-x-100)
export function ArrowIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <line x1="5" y1="12" x2="19" y2="12" strokeWidth={strokeWidth} strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 8. Chevron Down
export function ChevronDownIcon({ className = '', size = 18, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <polyline points="6 9 12 15 18 9" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 9. Verified Certificate / Stamp
export function VerifiedStampIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <circle cx="12" cy="12" r="9" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="7" strokeWidth={strokeWidth} strokeDasharray="2 2" />
      <polyline points="9 12 11 14 15 10" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Beauty Advisor Star
export function AdvisorStarIcon({ className = '', size = 22, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 2L14.3 8.7L21 11L14.3 13.3L12 20L9.7 13.3L3 11L9.7 8.7L12 2Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="5" r="1" fill={color} />
      <circle cx="6" cy="18" r="1" fill={color} />
    </svg>
  );
}

// 11. Trash / Remove
export function TrashIcon({ className = '', size = 18, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <polyline points="3 6 5 6 21 6" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path d="M10 11V16" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M14 11V16" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M9 6V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V6" strokeWidth={strokeWidth} />
    </svg>
  );
}

// 12. WhatsApp Monoline
export function WhatsAppIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M20.5 11.8C20.5 16.5 16.6 20.4 11.8 20.4C10.2 20.4 8.7 19.9 7.4 19.1L3.5 20.5L4.9 16.7C3.9 15.3 3.3 13.6 3.3 11.8C3.3 7.1 7.2 3.2 11.9 3.2C16.6 3.2 20.5 7.1 20.5 11.8Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.5C9.2 8 8.8 8 8.4 8C8.1 8 7.7 8.1 7.5 8.4C7.1 8.8 6.3 9.6 6.3 11.2C6.3 12.8 7.5 14.3 7.7 14.5C7.9 14.7 10 18 13.3 19.2C16 20.2 16.6 19.8 17.2 19.7C17.9 19.5 19.1 18.7 19.4 17.8C19.7 16.9 19.7 16.2 19.6 16C19.5 15.8 19.2 15.7 18.7 15.4C18.2 15.2 16.1 14.1 15.7 14C15.3 13.9 15 13.8 14.7 14.3C14.4 14.7 13.7 15.6 13.4 15.9C13.2 16.1 13 16.2 12.6 16C12.1 15.7 10.7 15.2 9.7 14.3C8.9 13.6 8.4 12.7 8.2 12.4C8.1 12 8.2 11.8 8.4 11.6C8.6 11.4 8.8 11.1 9 10.9C9.2 10.7 9.3 10.5 9.4 10.3C9.5 10.1 9.4 9.9 9.3 9.7C9.2 9.5 8.7 8.3 8.5 7.9"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 13. Location Pin
export function LocationPinIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 21C16 16.5 19 13.5 19 9.5C19 5.634 15.866 2.5 12 2.5C8.134 2.5 5 5.634 5 9.5C5 13.5 8 16.5 12 21Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.5" strokeWidth={strokeWidth} />
    </svg>
  );
}

// 14. Phone
export function PhoneIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M5 4H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L20 15V19C20 19.5523 19.5523 20 19 20C10.7157 20 4 13.2843 4 5C4 4.44772 4.44772 4 5 4Z"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 15. Instagram
export function InstagramIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="4" strokeWidth={strokeWidth} />
      <circle cx="17.5" cy="6.5" r="1" fill={color} />
    </svg>
  );
}

// 16. TikTok
export function TikTokIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
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

// 17. Facebook
export function FacebookIcon({ className = '', size = 20, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
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

// 18. Check
export function CheckIcon({ className = '', size = 18, strokeWidth = 1.5, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <polyline points="20 6 9 17 4 12" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 19. Sparkle / Editorial Accent
export function EditorialSparkleIcon({ className = '', size = 18, strokeWidth = 1.35, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke={color}>
      <path
        d="M12 3V21M3 12H21M5.636 5.636L18.364 18.364M5.636 18.364L18.364 5.636"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

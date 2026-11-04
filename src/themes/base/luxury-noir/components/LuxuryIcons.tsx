import React from 'react';

export interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
}

function Svg({
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.25,
  className = '',
  viewBox = '0 0 24 24',
  fill = 'none',
  children,
}: IconProps & { viewBox?: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      className={className}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function DropSkinIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <path d="M12 7v5" strokeDasharray="1 1" />
    </Svg>
  );
}

export function WaveSkinIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M2 12c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" />
      <path d="M2 7c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" opacity="0.6" />
      <path d="M2 17c2.5-3 5.5-3 8 0s5.5 3 8 0 5.5-3 8 0" opacity="0.6" />
    </Svg>
  );
}

export function FeatherSkinIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </Svg>
  );
}

export function CitrusIngredientIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12L7.5 7.5M12 12l4.5-4.5M12 12v6.5M12 12H5.5M12 12h6.5" />
    </Svg>
  );
}

export function HydraDropIngredientIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <circle cx="12" cy="14" r="2.5" />
    </Svg>
  );
}

export function HexMoleculeIngredientIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M12 2l7.5 4.33v8.66L12 22l-7.5-4.33V6.33z" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  );
}

export function ShieldCheckIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeWidth={p.strokeWidth || 1.5} />
    </Svg>
  );
}

export function DeliveryVanIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <rect x="1" y="4" width="13" height="13" rx="2" />
      <path d="M14 9h4l3 3v5h-7V9z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </Svg>
  );
}

export function ConciergeHeadsetIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 22}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </Svg>
  );
}

export function VerifiedCheckIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18} color={p.color || '#34D399'} strokeWidth={p.strokeWidth || 1.5}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

export function CrossWarningIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18} color={p.color || '#FB7185'} strokeWidth={p.strokeWidth || 1.5}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </Svg>
  );
}

export function SparkleStarIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18} color={p.color || '#C9A84C'}>
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
    </Svg>
  );
}

export function BagCartIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 20}>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </Svg>
  );
}

export function WhatsAppIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 20} viewBox="0 0 24 24">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Svg>
  );
}

export function PlayVideoIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </Svg>
  );
}

export function TrashIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

export function TuningSliderIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </Svg>
  );
}

export function CloseIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 16} strokeWidth={p.strokeWidth || 1.5}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

export function StarIcon({ fill = 'none', ...p }: IconProps) {
  return (
    <Svg {...p} size={p.size || 14} fill={fill}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function TikTokIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </Svg>
  );
}

export function InstagramIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </Svg>
  );
}

export function FacebookIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Svg>
  );
}

export function MapPinIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function PhoneCallIcon(p: IconProps) {
  return (
    <Svg {...p} size={p.size || 18}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

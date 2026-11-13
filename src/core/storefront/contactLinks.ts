import { TenantBrandInfo } from '@/themes/contract';

export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook';

const DEFAULT_WHATSAPP_DIGITS = '967775234989';

/**
 * Normalizes a Yemeni or international phone string into clean `wa.me` digits.
 */
export function formatWhatsAppDigits(rawNumber?: string | null): string {
  const digits = (rawNumber || '').replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_DIGITS;
  if (digits.length === 9 && digits.startsWith('7')) {
    return `967${digits}`;
  }
  return digits;
}

/**
 * Formats WhatsApp digits for human-readable LTR display (`+967 775 234 989`).
 */
export function formatWhatsAppDisplay(rawNumber?: string | null): string {
  const digits = formatWhatsAppDigits(rawNumber);
  if (digits.startsWith('967') && digits.length === 12) {
    return `+967 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)}`;
  }
  return `+${digits}`;
}

/**
 * Resolves a merchant social handle or URL into an external HTTPS URL and display label.
 */
export function resolveSocialChannel(
  tenant: Partial<TenantBrandInfo> | undefined,
  platform: SocialPlatform
): { url: string; handle: string } | null {
  const rawValue = (
    tenant?.contact?.social?.[platform] ||
    tenant?.[platform] ||
    ''
  ).trim();

  if (!rawValue || rawValue === '#') return null;

  if (/^https?:\/\//i.test(rawValue)) {
    const cleanHandle = rawValue
      .replace(/^https?:\/\/(www\.)?(instagram\.com|tiktok\.com|facebook\.com)\//i, '')
      .replace(/\/+$/, '');
    const prefix = cleanHandle.startsWith('@') ? cleanHandle : `@${cleanHandle}`;
    return {
      url: rawValue,
      handle: cleanHandle ? prefix : rawValue,
    };
  }

  const stripped = rawValue.replace(/^@+/, '').trim();
  if (!stripped) return null;

  const urlByPlatform: Record<SocialPlatform, string> = {
    instagram: `https://instagram.com/${stripped}`,
    tiktok: `https://tiktok.com/@${stripped}`,
    facebook: `https://facebook.com/${stripped}`,
  };

  return {
    url: urlByPlatform[platform],
    handle: `@${stripped}`,
  };
}

/**
 * Resolves a complete contact object with normalized URLs and WhatsApp digits.
 */
export function resolveTenantContact(tenant?: Partial<TenantBrandInfo>) {
  const ig = resolveSocialChannel(tenant, 'instagram');
  const tk = resolveSocialChannel(tenant, 'tiktok');
  const fb = resolveSocialChannel(tenant, 'facebook');
  const rawWa = tenant?.contact?.whatsapp || tenant?.whatsapp || '775234989';

  return {
    whatsapp: formatWhatsAppDigits(rawWa),
    phone: tenant?.contact?.phone || tenant?.phone || '775234989',
    social: {
      instagram: ig?.url,
      tiktok: tk?.url,
      facebook: fb?.url,
      instagramHandle: tenant?.contact?.social?.instagramHandle || ig?.handle,
      tiktokHandle: tenant?.contact?.social?.tiktokHandle || tk?.handle,
    },
    map: {
      url: tenant?.contact?.map?.url || tenant?.googleMaps || 'https://maps.app.goo.gl/DxsZTHrv2r386bXa9',
      label: tenant?.contact?.map?.label || 'فرع صنعاء الرئيسي (حدة)',
      city: tenant?.contact?.map?.city || tenant?.city || 'صنعاء',
    },
  };
}

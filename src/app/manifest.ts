import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مفتاح الجمال — أصلي وتقليد',
    short_name: 'مفتاح الجمال',
    description: 'المتجر الرائد لمستحضرات التجميل والعناية بالبشرة الموثوقة مع فحص الأصالة ومقارنة الدفعات',
    start_url: '/',
    display: 'standalone',
    background_color: '#070709',
    theme_color: '#070709',
    dir: 'rtl',
    lang: 'ar',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

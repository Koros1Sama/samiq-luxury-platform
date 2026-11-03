import type { Metadata, Viewport } from 'next';
import { Amiri, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مفتاح الجمال — أصلي وتقليد | منصة سَامِق الفاخرة',
  description: 'المتجر الرائد في اليمن لمستحضرات العناية بالبشرة والمكياج والعطور العالمية الأصلية الموثقة مع مقارن بصري للأصلي والتقليد.',
  robots: {
    index: false, // Respect pilot rule: noindex = true
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#070709',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${ibmPlexArabic.variable}`}>
      <body className="bg-obsidian text-ivory font-sans min-h-[100dvh]">
        {children}
      </body>
    </html>
  );
}

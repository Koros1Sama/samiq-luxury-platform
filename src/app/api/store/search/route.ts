import { NextResponse } from 'next/server';
import { getPublishedProducts } from '@/core/db/store';
import {
  checkRateLimit,
  getClientIp,
  sanitizeText,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`search:${ip}`, 60, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'تجاوزت الحد المسموح من عمليات البحث' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = sanitizeText(searchParams.get('q') || '', 100).toLowerCase();

  const products = getPublishedProducts();
  if (!q) {
    return NextResponse.json({ success: true, count: products.length, results: products });
  }

  // Concern synonym dictionary
  const concernMap: Record<string, string[]> = {
    'حب شباب': ['niacinamide', 'salicylic', 'cleansers'],
    'مسامات': ['niacinamide', 'zinc', 'serums'],
    'تصبغات': ['vitamin c', 'pure', 'serums'],
    'جفاف': ['moisturizing', 'hyaluronic', 'ceramides'],
    'نضارة': ['vitamin c', 'serum', 'glow'],
    'شفايف': ['rouge', 'lipstick', 'couture'],
  };

  const matchingKeys = [q];
  Object.keys(concernMap).forEach((concern) => {
    if (q.includes(concern)) {
      matchingKeys.push(...concernMap[concern]);
    }
  });

  const results = products.filter((p) => {
    const text = `${p.title} ${p.subtitle || ''} ${p.brand} ${p.categorySlug} ${p.badge || ''}`.toLowerCase();
    return matchingKeys.some((k) => text.includes(k.toLowerCase()));
  });

  return NextResponse.json({
    success: true,
    query: q,
    count: results.length,
    results,
  });
}

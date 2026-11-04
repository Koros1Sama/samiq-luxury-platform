import { NextResponse } from 'next/server';
import { getAllProducts } from '@/core/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const products = getAllProducts();
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

  let matchingKeys = [q];
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

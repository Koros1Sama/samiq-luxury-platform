import { NextResponse } from 'next/server';
import { getAllProducts, saveProduct, deleteProduct } from '@/core/db/store';
import { ProductCardData } from '@/themes/contract';

export async function GET() {
  const products = getAllProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.brand || !body.prices) {
      return NextResponse.json(
        { success: false, message: 'بيانات المنتج غير مكتملة' },
        { status: 400 }
      );
    }

    const product: ProductCardData = {
      id: body.id || `prod-${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle || '',
      brand: body.brand,
      categorySlug: body.categorySlug || 'skincare',
      image: body.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      prices: body.prices,
      comparePrices: body.comparePrices,
      isAuthenticGuaranteed: body.isAuthenticGuaranteed !== false,
      isFeatured: !!body.isFeatured,
      badge: body.badge,
      variants: body.variants || [],
      description: body.description,
    };

    const saved = saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حفظ المنتج' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف المنتج مفقود' }, { status: 400 });
    }
    const deleted = deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل حذف المنتج' }, { status: 500 });
  }
}

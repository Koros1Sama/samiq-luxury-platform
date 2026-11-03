import { NextResponse } from 'next/server';
import { getCustomerByEmailOrPhone, saveCustomer, toggleWishlist, CustomerRecord } from '@/core/db/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get('identifier');
  if (!identifier) {
    return NextResponse.json({ success: false, message: 'المعرف مفقود' }, { status: 400 });
  }
  const customer = getCustomerByEmailOrPhone(identifier);
  if (!customer) {
    return NextResponse.json({ success: false, message: 'الحساب غير موجود' }, { status: 404 });
  }
  return NextResponse.json({ success: true, customer });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || 'register';

    if (action === 'toggle_wishlist') {
      const { customerId, productId } = body;
      if (!customerId || !productId) {
        return NextResponse.json({ success: false, message: 'بيانات المفضلة غير مكتملة' }, { status: 400 });
      }
      const updatedWishlist = toggleWishlist(customerId, productId);
      return NextResponse.json({ success: true, wishlist: updatedWishlist });
    }

    if (action === 'login') {
      const { emailOrPhone } = body;
      const customer = getCustomerByEmailOrPhone(emailOrPhone || '');
      if (!customer) {
        return NextResponse.json({ success: false, message: 'رقم الهاتف أو البريد غير مسجل' }, { status: 401 });
      }
      return NextResponse.json({ success: true, customer });
    }

    // Register action
    const { fullName, phone, email, city, defaultAddress } = body;
    if (!fullName || !phone) {
      return NextResponse.json({ success: false, message: 'الاسم ورقم الهاتف مطلوبان' }, { status: 400 });
    }

    const existing = getCustomerByEmailOrPhone(phone) || (email ? getCustomerByEmailOrPhone(email) : null);
    if (existing) {
      return NextResponse.json({ success: true, customer: existing, message: 'مرحباً بعودتك مجدداً' });
    }

    const newCustomer: CustomerRecord = {
      id: `cust-${Date.now()}`,
      tenantId: '11111111-1111-1111-1111-111111111111',
      fullName,
      phone,
      email: email || `${phone}@miftah-customer.ye`,
      city: city || 'صنعاء',
      defaultAddress: defaultAddress || 'صنعاء',
      loyaltyPoints: 50, // Welcome points
      wishlistProductIds: [],
      createdAt: new Date().toISOString(),
    };

    saveCustomer(newCustomer);
    return NextResponse.json({ success: true, customer: newCustomer });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في معالجة طلب الحساب' }, { status: 500 });
  }
}

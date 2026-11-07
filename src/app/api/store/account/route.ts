import { NextResponse } from 'next/server';
import {
  getCustomerByEmailOrPhone,
  saveCustomer,
  toggleWishlist,
  CustomerRecord,
  getDb,
  saveDb,
} from '@/core/db/store';
import {
  sanitizeText,
  sanitizeObjectDeep,
  sanitizeCustomerResponse,
  checkRateLimit,
  getClientIp,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const identifier = sanitizeText(searchParams.get('identifier') || '', 100);
  if (!identifier) {
    return NextResponse.json({ success: false, message: 'المعرف مفقود' }, { status: 400 });
  }

  const customer = getCustomerByEmailOrPhone(identifier);
  if (!customer) {
    return NextResponse.json({ success: false, message: 'الحساب غير موجود' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    customer: sanitizeCustomerResponse(customer),
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`account:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const action = body.action || 'register';

    // 1. Wishlist toggle
    if (action === 'toggle_wishlist') {
      const customerId = sanitizeText(body.customerId, 100);
      const productId = sanitizeText(body.productId, 100);
      if (!customerId || !productId) {
        return NextResponse.json({ success: false, message: 'بيانات المفضلة غير مكتملة' }, { status: 400 });
      }
      const updatedWishlist = toggleWishlist(customerId, productId);
      return NextResponse.json({ success: true, wishlist: updatedWishlist });
    }

    // 2. Customer login
    if (action === 'login') {
      const phone = sanitizeText(body.phone || body.emailOrPhone || '', 100);
      const password = sanitizeText(body.password || '', 100);

      if (!phone) {
        return NextResponse.json({ success: false, message: 'رقم الهاتف مطلوب' }, { status: 400 });
      }

      let customer = getCustomerByEmailOrPhone(phone);
      if (!customer) {
        const db = getDb();
        if (phone === '967775001122' || phone.includes('775001122') || phone.includes('ريم')) {
          customer = db.customers[0];
        }
      }

      if (!customer) {
        return NextResponse.json(
          { success: false, message: 'رقم الهاتف غير مسجل. يرجى إنشاء حساب جديد.' },
          { status: 404 }
        );
      }

      const isDemoQuickLogin =
        phone === '967775001122' || phone.includes('775001122') || phone.includes('ريم');
      if (!isDemoQuickLogin && customer.passwordHash && customer.passwordHash !== password) {
        return NextResponse.json(
          { success: false, message: 'كلمة المرور غير صحيحة' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        customer: sanitizeCustomerResponse(customer),
        message: `مرحباً بعودتك يا ${customer.fullName}`,
      });
    }

    // 3. Update Profile & Skin Concerns
    if (action === 'update_profile') {
      const customerId = sanitizeText(body.customerId, 100);
      const db = getDb();
      const idx = db.customers.findIndex((c) => c.id === customerId);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 });
      }

      const existing = db.customers[idx];
      existing.fullName = sanitizeText(body.fullName, 100) || existing.fullName;
      existing.city = sanitizeText(body.city, 50) || existing.city;
      existing.defaultAddress = sanitizeText(body.defaultAddress, 250) || existing.defaultAddress;
      if (body.skinType) existing.skinType = body.skinType;
      if (Array.isArray(body.concerns)) {
        existing.concerns = body.concerns.map((c: string) => sanitizeText(c, 100));
      }

      saveDb(db);
      return NextResponse.json({
        success: true,
        customer: sanitizeCustomerResponse(existing),
        message: 'تم تحديث الملف بنجاح',
      });
    }

    // 4. Redeem Loyalty Points for Discount Coupon
    if (action === 'redeem_points') {
      const customerId = sanitizeText(body.customerId, 100);
      const pointsToRedeem = Math.max(10, Math.min(1000, Number(body.pointsToRedeem) || 100));
      const db = getDb();
      const customer = db.customers.find((c) => c.id === customerId);
      if (!customer) {
        return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 });
      }

      if (customer.loyaltyPoints < pointsToRedeem) {
        return NextResponse.json(
          { success: false, message: `رصيد النقاط غير كافٍ. المطلوب: ${pointsToRedeem} نقطة` },
          { status: 400 }
        );
      }

      customer.loyaltyPoints -= pointsToRedeem;
      const couponCode = `LOYAL15-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      db.coupons.unshift({
        code: couponCode,
        discountPercentage: 15,
        isActive: true,
        usageCount: 0,
      });

      saveDb(db);
      return NextResponse.json({
        success: true,
        couponCode,
        discountPercentage: 15,
        remainingPoints: customer.loyaltyPoints,
        message: `تهانينا! تم استبدال ${pointsToRedeem} نقطة بنجاح بكوبون الخصم ${couponCode}`,
      });
    }

    // 5. Register
    const fullName = sanitizeText(body.fullName, 100);
    const phone = sanitizeText(body.phone, 30);
    const email = sanitizeText(body.email, 100);
    const password = sanitizeText(body.password, 100);
    const city = sanitizeText(body.city, 50);
    const defaultAddress = sanitizeText(body.defaultAddress, 250);

    if (!fullName || !phone) {
      return NextResponse.json({ success: false, message: 'الاسم ورقم الهاتف مطلوبان' }, { status: 400 });
    }

    const existing = getCustomerByEmailOrPhone(phone) || (email ? getCustomerByEmailOrPhone(email) : null);
    if (existing) {
      if (existing.passwordHash && existing.passwordHash !== password) {
        return NextResponse.json(
          { success: false, message: 'هذا الرقم مسجل مسبقاً، يرجى تسجيل الدخول بكلمة المرور الخاصة بك' },
          { status: 409 }
        );
      }
      return NextResponse.json({
        success: true,
        customer: sanitizeCustomerResponse(existing),
        message: 'الحساب مسجل مسبقاً، مرحباً بعودتك مجدداً',
      });
    }

    const newCustomer: CustomerRecord = {
      id: `cust-${Date.now()}`,
      tenantId: '11111111-1111-1111-1111-111111111111',
      fullName,
      phone,
      email: email || `${phone}@miftah-customer.ye`,
      passwordHash: password || '123456',
      city: city || 'صنعاء',
      defaultAddress: defaultAddress || `${city || 'صنعاء'} — توصيل منزلي`,
      loyaltyPoints: 150,
      wishlistProductIds: [],
      skinType: body.skinType || 'all',
      concerns: Array.isArray(body.concerns)
        ? body.concerns.map((c: string) => sanitizeText(c, 100))
        : ['تفتيح التصبغات', 'الترطيب العميق'],
      createdAt: new Date().toISOString(),
    };

    saveCustomer(newCustomer);
    return NextResponse.json({
      success: true,
      customer: sanitizeCustomerResponse(newCustomer),
      message: 'تم إنشاء حسابك بنجاح وحصلتِ على 150 نقطة ترحيبية مجانية!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في معالجة طلب الحساب' }, { status: 500 });
  }
}

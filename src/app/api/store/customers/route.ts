import { NextResponse } from 'next/server';
import {
  getCustomerByEmailOrPhone,
  saveCustomer,
  toggleWishlist,
  CustomerRecord,
  getDb,
  saveDb,
} from '@/core/db/store';

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

    // 1. Admin login verification
    if (action === 'admin_login') {
      const { passcode } = body;
      const validCodes = ['miftah2026', 'admin2026', 'samiq2026', 'owner2026', '1234'];
      if (passcode && validCodes.includes(passcode.trim())) {
        const isOwner = passcode.trim() === 'samiq2026' || passcode.trim() === 'owner2026';
        return NextResponse.json({
          success: true,
          role: isOwner ? 'owner' : 'admin',
          message: 'تم التحقق من صلاحيات الإدارة بنجاح',
        });
      }
      return NextResponse.json(
        { success: false, message: 'رمز الدخول الإداري غير صحيح' },
        { status: 401 }
      );
    }

    // 2. Wishlist toggle
    if (action === 'toggle_wishlist') {
      const { customerId, productId } = body;
      if (!customerId || !productId) {
        return NextResponse.json({ success: false, message: 'بيانات المفضلة غير مكتملة' }, { status: 400 });
      }
      const updatedWishlist = toggleWishlist(customerId, productId);
      return NextResponse.json({ success: true, wishlist: updatedWishlist });
    }

    // 3. Customer login
    if (action === 'login') {
      const { phone, password } = body;
      const identifier = phone || body.emailOrPhone || '';
      if (!identifier) {
        return NextResponse.json({ success: false, message: 'رقم الهاتف مطلوب' }, { status: 400 });
      }

      let customer = getCustomerByEmailOrPhone(identifier);
      if (!customer) {
        // If demo phone, find the first customer in database
        const db = getDb();
        if (identifier === '967775001122' || identifier.includes('775001122') || identifier.includes('ريم')) {
          customer = db.customers[0];
        }
      }

      if (!customer) {
        return NextResponse.json(
          { success: false, message: 'رقم الهاتف غير مسجل. يرجى إنشاء حساب جديد.' },
          { status: 404 }
        );
      }

      // If customer has password and one was provided
      if (customer.passwordHash && password && customer.passwordHash !== password) {
        return NextResponse.json(
          { success: false, message: 'كلمة المرور غير صحيحة' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        customer,
        message: `مرحباً بعودتك يا ${customer.fullName}`,
      });
    }

    // 4. Update Profile & Skin Concerns
    if (action === 'update_profile') {
      const { customerId, fullName, city, skinType, concerns, defaultAddress } = body;
      const db = getDb();
      const idx = db.customers.findIndex((c) => c.id === customerId);
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'المستخدم غير موجود' }, { status: 404 });
      }

      const existing = db.customers[idx];
      existing.fullName = fullName || existing.fullName;
      existing.city = city || existing.city;
      existing.defaultAddress = defaultAddress || existing.defaultAddress;
      if (skinType) existing.skinType = skinType;
      if (Array.isArray(concerns)) existing.concerns = concerns;

      saveDb(db);
      return NextResponse.json({ success: true, customer: existing, message: 'تم تحديث ملف البشرة بنجاح' });
    }

    // 5. Redeem Loyalty Points for Discount Coupon
    if (action === 'redeem_points') {
      const { customerId, pointsToRedeem = 100 } = body;
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

      // Insert new active coupon into database
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

    // 6. Register action
    const { fullName, phone, password, email, city, skinType, concerns, defaultAddress } = body;
    if (!fullName || !phone) {
      return NextResponse.json({ success: false, message: 'الاسم ورقم الهاتف مطلوبان' }, { status: 400 });
    }

    const existing = getCustomerByEmailOrPhone(phone) || (email ? getCustomerByEmailOrPhone(email) : null);
    if (existing) {
      return NextResponse.json({
        success: true,
        customer: existing,
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
      loyaltyPoints: 150, // 150 welcome loyalty points
      wishlistProductIds: [],
      skinType: skinType || 'all',
      concerns: Array.isArray(concerns) ? concerns : ['تفتيح التصبغات', 'الترطيب العميق'],
      createdAt: new Date().toISOString(),
    };

    saveCustomer(newCustomer);
    return NextResponse.json({
      success: true,
      customer: newCustomer,
      message: 'تم إنشاء حسابك بنجاح وحصلتِ على 150 نقطة ترحيبية مجانية!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في معالجة طلب الحساب' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  CustomerRecord,
  getCustomerByEmailOrPhone,
  getDb,
  saveCustomer,
  saveDb,
  toggleWishlist,
} from '@/core/db/store';
import {
  checkRateLimit,
  getClientIp,
  sanitizeCustomerResponse,
  sanitizeObjectDeep,
  sanitizeText,
  setAdminSessionCookie,
  VALID_ADMIN_PASSCODES,
} from '@/core/security/guard';

function isDemoCustomerIdentifier(identifier: string): boolean {
  return (
    identifier === '967775001122' ||
    identifier.includes('775001122') ||
    identifier.includes('ريم')
  );
}

/**
 * Shared GET handler for looking up a sanitized customer profile.
 */
export function handleCustomerGet(req: Request): NextResponse {
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

function handleAdminLogin(body: Record<string, unknown>): NextResponse {
  const passcode = sanitizeText(body.passcode || '', 50);
  if (passcode && VALID_ADMIN_PASSCODES.has(passcode)) {
    const isOwner = passcode === 'samiq2026' || passcode === 'owner2026';
    const response = NextResponse.json({
      success: true,
      role: isOwner ? 'owner' : 'admin',
      message: 'تم التحقق من صلاحيات الإدارة بنجاح',
    });
    setAdminSessionCookie(response);
    return response;
  }
  return NextResponse.json(
    { success: false, message: 'رمز الدخول الإداري غير صحيح' },
    { status: 401 }
  );
}

function handleCustomerLogin(body: Record<string, unknown>): NextResponse {
  const identifier = sanitizeText(body.phone || body.emailOrPhone || '', 100);
  const password = sanitizeText(body.password || '', 100);
  if (!identifier) {
    return NextResponse.json({ success: false, message: 'رقم الهاتف مطلوب' }, { status: 400 });
  }

  let customer = getCustomerByEmailOrPhone(identifier);
  if (!customer && isDemoCustomerIdentifier(identifier)) {
    customer = getDb().customers[0];
  }

  if (!customer) {
    return NextResponse.json(
      { success: false, message: 'رقم الهاتف غير مسجل. يرجى إنشاء حساب جديد.' },
      { status: 404 }
    );
  }

  if (
    !isDemoCustomerIdentifier(identifier) &&
    customer.passwordHash &&
    customer.passwordHash !== password
  ) {
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

function handleProfileUpdate(body: Record<string, unknown>): NextResponse {
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
  if (body.skinType) existing.skinType = body.skinType as CustomerRecord['skinType'];
  if (Array.isArray(body.concerns)) {
    existing.concerns = body.concerns.map((c) => sanitizeText(c, 100)).filter(Boolean);
  }

  saveDb(db);
  return NextResponse.json({
    success: true,
    customer: sanitizeCustomerResponse(existing),
    message: 'تم تحديث ملف البشرة بنجاح',
  });
}

function handleRedeemPoints(body: Record<string, unknown>): NextResponse {
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

function handleCustomerRegister(body: Record<string, unknown>): NextResponse {
  const fullName = sanitizeText(body.fullName, 100);
  const phone = sanitizeText(body.phone, 30);
  const email = sanitizeText(body.email, 100);
  const password = sanitizeText(body.password, 100);
  const city = sanitizeText(body.city, 50);
  const defaultAddress = sanitizeText(body.defaultAddress, 250);

  if (!fullName || !phone) {
    return NextResponse.json({ success: false, message: 'الاسم ورقم الهاتف مطلوبان' }, { status: 400 });
  }

  const existing =
    getCustomerByEmailOrPhone(phone) || (email ? getCustomerByEmailOrPhone(email) : null);
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
    skinType: (body.skinType as CustomerRecord['skinType']) || 'all',
    concerns: Array.isArray(body.concerns)
      ? body.concerns.map((c) => sanitizeText(c, 100)).filter(Boolean)
      : ['تفتيح التصبغات', 'الترطيب العميق'],
    createdAt: new Date().toISOString(),
  };

  saveCustomer(newCustomer);
  return NextResponse.json({
    success: true,
    customer: sanitizeCustomerResponse(newCustomer),
    message: 'تم إنشاء حسابك بنجاح وحصلتِ على 150 نقطة ترحيبية مجانية!',
  });
}

/**
 * Shared POST dispatcher for customer account actions.
 */
export async function handleCustomerPost(
  req: Request,
  options: { rateKeyPrefix: string; allowAdminLogin: boolean }
): Promise<NextResponse> {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`${options.rateKeyPrefix}:${ip}`, 30, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const body = sanitizeObjectDeep((await req.json()) as Record<string, unknown>);
    const action = typeof body.action === 'string' ? body.action : 'register';

    if (options.allowAdminLogin && action === 'admin_login') {
      return handleAdminLogin(body);
    }
    if (action === 'toggle_wishlist') {
      const customerId = sanitizeText(body.customerId, 100);
      const productId = sanitizeText(body.productId, 100);
      if (!customerId || !productId) {
        return NextResponse.json({ success: false, message: 'بيانات المفضلة غير مكتملة' }, { status: 400 });
      }
      return NextResponse.json({ success: true, wishlist: toggleWishlist(customerId, productId) });
    }
    if (action === 'login') return handleCustomerLogin(body);
    if (action === 'update_profile') return handleProfileUpdate(body);
    if (action === 'redeem_points') return handleRedeemPoints(body);

    return handleCustomerRegister(body);
  } catch {
    return NextResponse.json({ success: false, message: 'خطأ في معالجة طلب الحساب' }, { status: 500 });
  }
}

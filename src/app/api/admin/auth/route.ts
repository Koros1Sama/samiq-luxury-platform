import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  verifyAdminAuth,
  VALID_ADMIN_PASSCODES,
  sanitizeText,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const auth = verifyAdminAuth(req);
  return NextResponse.json({
    authenticated: auth.authorized,
    role: auth.authorized ? 'admin' : 'guest',
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate limit: max 10 auth requests per minute per IP
    const allowed = checkRateLimit(`auth:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز عدد محاولات الدخول المسموح بها، يرجى الانتظار دقيقة' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const action = body.action || 'login';

    // 1. Logout action
    if (action === 'logout') {
      const response = NextResponse.json({
        success: true,
        authenticated: false,
        message: 'تم تسجيل الخروج بنجاح',
      });
      clearAdminSessionCookie(response);
      return response;
    }

    // 2. Check session action
    if (action === 'check') {
      const auth = verifyAdminAuth(req);
      return NextResponse.json({
        success: true,
        authenticated: auth.authorized,
        role: auth.authorized ? 'admin' : 'guest',
      });
    }

    // 3. Login verification
    const passcode = sanitizeText(body.passcode || '', 50);

    if (passcode && VALID_ADMIN_PASSCODES.has(passcode)) {
      const isOwner = passcode === 'samiq2026' || passcode === 'owner2026';
      const response = NextResponse.json({
        success: true,
        authenticated: true,
        role: isOwner ? 'owner' : 'admin',
        message: 'تم التحقق من صلاحيات الإدارة بنجاح',
      });

      // Set HttpOnly session cookie
      setAdminSessionCookie(response);
      return response;
    }

    return NextResponse.json(
      { success: false, authenticated: false, message: 'رمز الدخول الإداري غير صحيح' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في معالجة طلب المصادقة' },
      { status: 500 }
    );
  }
}

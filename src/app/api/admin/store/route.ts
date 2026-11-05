import { NextResponse } from 'next/server';
import {
  getDb,
  updateTenant,
  updateShippingZones,
  updateBranches,
  moderateReview,
  getAllReviews,
  getAllBranches,
  ShippingZoneRecord,
  BranchRecord,
} from '@/core/db/store';
import { CLIENT_INDUSTRY_PRESETS } from '@/core/tenant/presets';
import {
  verifyAdminAuth,
  maskSensitiveTenantSecrets,
  checkRateLimit,
  getClientIp,
  sanitizeObjectDeep,
  sanitizeText,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const auth = verifyAdminAuth(req);
  const db = getDb();

  return NextResponse.json({
    success: true,
    tenant: maskSensitiveTenantSecrets(db.tenant, auth.authorized),
    shippingZones: db.shippingZones || [],
    branches: getAllBranches(),
    reviews: getAllReviews(),
    presets: Object.keys(CLIENT_INDUSTRY_PRESETS),
    isAdmin: auth.authorized,
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`admin_store:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من الطلبات، يرجى الانتظار قليلاً' },
        { status: 429 }
      );
    }

    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتنفيذ هذه العملية الإدارية' },
        { status: 401 }
      );
    }

    const rawBody = await req.json();
    const body = sanitizeObjectDeep(rawBody);
    const action = body.action;

    if (action === 'update_tenant') {
      const tenantData = body.tenant || {};
      // Never allow overriding system passcode via update_tenant
      delete tenantData.passcode;
      delete tenantData.adminPasscode;

      if (tenantData.notificationConfig) {
        const isMasked = (s?: string) => !s || s.startsWith('•') || s.startsWith('*');
        const existingNc = getDb().tenant.notificationConfig || {};
        if (isMasked(tenantData.notificationConfig.geminiApiKey)) {
          tenantData.notificationConfig.geminiApiKey = existingNc.geminiApiKey;
        }
        if (isMasked(tenantData.notificationConfig.telegramBotToken)) {
          tenantData.notificationConfig.telegramBotToken = existingNc.telegramBotToken;
        }
      }

      const updated = updateTenant(tenantData);
      return NextResponse.json({
        success: true,
        tenant: maskSensitiveTenantSecrets(updated, true),
      });
    }

    if (action === 'apply_client_preset') {
      const presetKey = sanitizeText(body.presetKey || '', 100);
      const presetData = CLIENT_INDUSTRY_PRESETS[presetKey];
      if (!presetData) {
        return NextResponse.json({ success: false, message: 'النمط المختار غير معروف' }, { status: 400 });
      }

      const updated = updateTenant(presetData);
      return NextResponse.json({
        success: true,
        tenant: maskSensitiveTenantSecrets(updated, true),
        preset: presetKey,
      });
    }

    if (action === 'save_shipping_zones') {
      const zones = body.shippingZones as ShippingZoneRecord[];
      if (!Array.isArray(zones)) {
        return NextResponse.json({ success: false, message: 'بيانات المناطق غير صحيحة' }, { status: 400 });
      }
      updateShippingZones(zones);
      return NextResponse.json({ success: true, shippingZones: zones });
    }

    if (action === 'save_branches') {
      const branches = body.branches as BranchRecord[];
      if (!Array.isArray(branches)) {
        return NextResponse.json({ success: false, message: 'بيانات الفروع غير صحيحة' }, { status: 400 });
      }
      updateBranches(branches);
      return NextResponse.json({ success: true, branches });
    }

    if (action === 'moderate_review') {
      const reviewId = sanitizeText(body.reviewId || '', 100);
      const operation = body.operation;
      if (!reviewId || !['delete', 'toggle_approve'].includes(operation)) {
        return NextResponse.json({ success: false, message: 'معاملات المراجعة غير مكتملة' }, { status: 400 });
      }
      const success = moderateReview(reviewId, operation as 'delete' | 'toggle_approve');
      const reviews = getAllReviews();
      return NextResponse.json({ success, reviews });
    }

    return NextResponse.json({ success: false, message: 'الإجراء غير مدعوم' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ في معالجة الطلب' }, { status: 500 });
  }
}

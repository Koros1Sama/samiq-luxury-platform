import { NextResponse } from 'next/server';
import {
  getDb,
  saveDb,
  updateTenant,
  updateShippingZones,
  updateBranches,
  moderateReview,
  getAllReviews,
  getAllBranches,
  ShippingZoneRecord,
  BranchRecord,
  TenantConfig,
} from '@/core/db/store';

import { CLIENT_INDUSTRY_PRESETS } from '@/core/tenant/presets';

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    success: true,
    tenant: db.tenant,
    shippingZones: db.shippingZones || [],
    branches: getAllBranches(),
    reviews: getAllReviews(),
    presets: Object.keys(CLIENT_INDUSTRY_PRESETS),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action;

    if (action === 'update_tenant') {
      const tenantData = body.tenant || {};
      const updated = updateTenant(tenantData);
      return NextResponse.json({ success: true, tenant: updated });
    }

    if (action === 'apply_client_preset') {
      const presetKey = body.presetKey as string;
      const presetData = CLIENT_INDUSTRY_PRESETS[presetKey];
      if (!presetData) {
        return NextResponse.json({ success: false, message: 'النمط المختار غير معروف' }, { status: 400 });
      }

      const updated = updateTenant(presetData);
      return NextResponse.json({ success: true, tenant: updated, preset: presetKey });
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
      const { reviewId, operation } = body;
      if (!reviewId || !['delete', 'toggle_approve'].includes(operation)) {
        return NextResponse.json({ success: false, message: 'معاملات المراجعة غير مكتملة' }, { status: 400 });
      }
      const success = moderateReview(reviewId, operation);
      const reviews = getAllReviews();
      return NextResponse.json({ success, reviews });
    }

    return NextResponse.json({ success: false, message: 'الإجراء غير مدعوم' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ في معالجة الطلب' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/core/db/store';
import { ThemeId, isValidThemeId, FeatureFlags, PlatformMeta } from '@/themes/contract';
import { MOCK_PLATFORM_META } from '@/core/store/mockData';
import { FEATURES_REGISTRY } from '@/core/features/registry';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      success: true,
      tenant: db.tenant,
      features: db.features,
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
      themeId: db.tenant.themeId || 'luxury-noir',
      productsCount: db.products ? db.products.length : 0,
      ordersCount: db.orders ? db.orders.length : 0,
      bookingsCount: db.bookings ? db.bookings.length : 0,
      customersCount: db.customers ? db.customers.length : 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل استرجاع تكوين المنصة' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = getDb();

    // 1. Update active theme
    if (body.themeId && typeof body.themeId === 'string' && isValidThemeId(body.themeId)) {
      db.tenant.themeId = body.themeId as ThemeId;
    }

    // 2. Update feature flags
    if (body.features) {
      if (Array.isArray(body.features)) {
        // If an array of active feature IDs is passed
        const activeSet = new Set<string>(body.features);
        const nextFeatures: FeatureFlags = {
          tier_1_static: activeSet.has('tier_1_static'),
          tier_2_editable: activeSet.has('tier_2_editable'),
          tier_3_catalog: activeSet.has('tier_3_catalog'),
          cart_whatsapp: activeSet.has('cart_whatsapp'),
          customer_accounts: activeSet.has('customer_accounts'),
          payment_gateways: activeSet.has('payment_gateways'),
          ai_chatbot: activeSet.has('ai_chatbot'),
          whatsapp_channel: activeSet.has('whatsapp_channel'),
          telegram_channel: activeSet.has('telegram_channel'),
          authenticity_guide: activeSet.has('authenticity_guide'),
          skin_routine_advisor: activeSet.has('skin_routine_advisor'),
          smart_tags_ai: activeSet.has('smart_tags_ai'),
        };
        db.features = nextFeatures;
      } else if (typeof body.features === 'object') {
        db.features = {
          ...db.features,
          ...body.features,
        };
      }
    }

    // 3. Update tenant metadata
    if (body.tenant && typeof body.tenant === 'object') {
      db.tenant = {
        ...db.tenant,
        ...body.tenant,
      };
      if (body.tenant.name) db.tenant.name = body.tenant.name;
      if (body.tenant.tagline) db.tenant.tagline = body.tenant.tagline;
      if (body.tenant.whatsapp) {
        db.tenant.whatsapp = body.tenant.whatsapp;
        if (db.tenant.contact) db.tenant.contact.whatsapp = body.tenant.whatsapp;
      }
      if (body.tenant.city) db.tenant.city = body.tenant.city;
      if (typeof body.tenant.noindex === 'boolean') db.tenant.noindex = body.tenant.noindex;
    }

    // 4. Update platform & developer metadata
    if (body.platformMeta && typeof body.platformMeta === 'object') {
      db.platformMeta = {
        ...(db.platformMeta || MOCK_PLATFORM_META),
        ...body.platformMeta,
      };
    }

    // Save directly to samiq-db.json
    saveDb(db);

    return NextResponse.json({
      success: true,
      message: 'تم حفظ تكوين المنصة والقالب وقاعدة البيانات بنجاح',
      tenant: db.tenant,
      features: db.features,
      themeId: db.tenant.themeId,
      platformMeta: db.platformMeta || MOCK_PLATFORM_META,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'حدث خطأ أثناء حفظ تكوين المنصة' }, { status: 500 });
  }
}

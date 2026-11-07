import { NextResponse } from 'next/server';
import { getDb } from '@/core/db/store';

export async function GET() {
  try {
    const db = getDb();
    const safeTenant = db.tenant
      ? {
          ...db.tenant,
          notificationConfig: undefined,
        }
      : undefined;
    return NextResponse.json({
      success: true,
      features: db.features,
      currency: db.tenant?.currency || 'YER',
      tenant: safeTenant,
      shippingZones: db.shippingZones || [],
    });
  } catch {
    return NextResponse.json({ success: false, features: {} }, { status: 500 });
  }
}

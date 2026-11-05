import { NextResponse } from 'next/server';
import { getDb } from '@/core/db/store';

export async function GET() {
  try {
    const db = getDb();
    return NextResponse.json({
      success: true,
      features: db.features,
    });
  } catch {
    return NextResponse.json({ success: false, features: {} }, { status: 500 });
  }
}

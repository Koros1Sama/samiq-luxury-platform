import { NextResponse } from 'next/server';
import { getAllBookings, createBooking, getAllBranches } from '@/core/db/store';

export async function GET() {
  const bookings = getAllBookings();
  const branches = getAllBranches();
  return NextResponse.json({ success: true, bookings, branches });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone || !body.bookingDate || !body.serviceType) {
      return NextResponse.json(
        { success: false, message: 'يرجى استكمال بيانات الحجز كاملة' },
        { status: 400 }
      );
    }

    const booking = createBooking({
      tenantId: '11111111-1111-1111-1111-111111111111',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      serviceType: body.serviceType,
      branchId: body.branchId || 'branch-sanaa',
      bookingDate: body.bookingDate,
      bookingTime: body.bookingTime || '04:00 PM',
      notes: body.notes,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل إتمام الحجز' }, { status: 500 });
  }
}

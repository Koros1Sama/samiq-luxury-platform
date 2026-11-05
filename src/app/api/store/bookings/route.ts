import { NextResponse } from 'next/server';
import {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getAllBranches,
  BookingRecord,
} from '@/core/db/store';

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || body.bookingId;
    const status = body.status as BookingRecord['status'];

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: 'معرف الحجز والحالة مطلوبان' },
        { status: 400 }
      );
    }

    const updated = updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'الحجز غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل تعديل حالة الحجز' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الحجز مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteBooking(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف الحجز' },
      { status: 500 }
    );
  }
}

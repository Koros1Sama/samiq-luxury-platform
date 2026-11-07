import { NextResponse } from 'next/server';
import {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getAllBranches,
  BookingRecord,
} from '@/core/db/store';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = sanitizeText(searchParams.get('phone') || '', 50);
  const auth = verifyAdminAuth(req);
  const allBookings = getAllBookings();
  const branches = getAllBranches();

  if (auth.authorized) {
    return NextResponse.json({ success: true, bookings: allBookings, branches, isAdmin: true });
  }

  if (phone) {
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length >= 7) {
      const customerBookings = allBookings.filter((b) => {
        const bDigits = (b.customerPhone || '').replace(/\D/g, '');
        return b.customerPhone === phone || (bDigits && bDigits.endsWith(cleanDigits.slice(-7)));
      });
      return NextResponse.json({ success: true, bookings: customerBookings, branches, isAdmin: false });
    }
  }

  // Public visitors only receive active branches list, not private patient bookings
  return NextResponse.json({ success: true, bookings: [], branches, isAdmin: false });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`bookings_post:${ip}`, 15, 300_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من طلبات الحجز، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const customerName = sanitizeText(body.customerName, 100);
    const customerPhone = sanitizeText(body.customerPhone, 30);
    const serviceType = sanitizeText(body.serviceType, 50) as BookingRecord['serviceType'];
    const branchId = sanitizeText(body.branchId || 'branch-sanaa', 50);
    const bookingDate = sanitizeText(body.bookingDate, 30);
    const bookingTime = sanitizeText(body.bookingTime || '04:00 PM', 30);
    const notes = sanitizeText(body.notes, 500);

    if (!customerName || !customerPhone || !bookingDate || !serviceType) {
      return NextResponse.json(
        { success: false, message: 'يرجى استكمال بيانات الحجز كاملة' },
        { status: 400 }
      );
    }

    const booking = createBooking({
      tenantId: '11111111-1111-1111-1111-111111111111',
      customerName,
      customerPhone,
      serviceType,
      branchId,
      bookingDate,
      bookingTime,
      notes: notes || undefined,
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'فشل إتمام الحجز' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتعديل الحجز' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const id = sanitizeText(body.id || body.bookingId || '', 100);
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
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف الحجز' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || '', 100);
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

import { NextResponse } from 'next/server';
import {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  OrderRecord,
  getDb,
} from '@/core/db/store';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeNumber,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = sanitizeText(searchParams.get('phone') || '', 50);
  const allOrders = getAllOrders();

  // If a specific customer is checking their order history
  if (phone) {
    const customerOrders = allOrders.filter(
      (o) => o.customerPhone === phone || o.customerPhone.includes(phone)
    );
    return NextResponse.json({ success: true, count: customerOrders.length, orders: customerOrders });
  }

  // Admin access or full list
  const auth = verifyAdminAuth(req);
  return NextResponse.json({
    success: true,
    count: allOrders.length,
    orders: allOrders,
    isAdmin: auth.authorized,
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Rate limiting: max 20 order creations per 5 minutes per IP
    if (!checkRateLimit(`orders_post:${ip}`, 20, 300_000)) {
      return NextResponse.json(
        { success: false, message: 'تم تجاوز الحد المسموح من الطلبات، يرجى الانتظار قليلاً' },
        { status: 429 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);

    const customerName = sanitizeText(body.customerName, 100);
    const customerPhone = sanitizeText(body.customerPhone, 30);
    const customerEmail = sanitizeText(body.customerEmail, 100);
    const city = sanitizeText(body.city || 'صنعاء', 50);
    const address = sanitizeText(body.address || 'صنعاء', 250);
    const notes = sanitizeText(body.notes, 500);
    const appliedCoupon = sanitizeText(body.appliedCoupon, 30).toUpperCase();
    const paymentMethod = sanitizeText(body.paymentMethod || 'whatsapp', 50) as OrderRecord['paymentMethod'];
    const paymentReference = sanitizeText(body.paymentReference, 100);

    if (!customerName || !customerPhone || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      );
    }

    // Sanitize and validate items list
    const validatedItems = body.items.map((item: any) => ({
      productId: sanitizeText(item.productId, 100),
      title: sanitizeText(item.title, 150),
      variantTitle: sanitizeText(item.variantTitle, 100),
      quantity: sanitizeNumber(item.quantity, 1, 1, 1000),
      unitPrice: {
        YER: sanitizeNumber(item.unitPrice?.YER, 0, 0, 100_000_000),
        SAR: sanitizeNumber(item.unitPrice?.SAR, 0, 0, 1_000_000),
        USD: sanitizeNumber(item.unitPrice?.USD, 0, 0, 500_000),
      },
    }));

    const subtotalYer = sanitizeNumber(body.subtotalYer, 0, 0, 500_000_000);
    const shippingFeeYer = sanitizeNumber(body.shippingFeeYer, 0, 0, 100_000_000);
    const discountYer = sanitizeNumber(body.discountYer, 0, 0, subtotalYer);
    const totalYer = sanitizeNumber(body.totalYer, Math.max(0, subtotalYer + shippingFeeYer - discountYer), 0, 600_000_000);

    const initialStatus = (body.status === 'confirmed' ? 'confirmed' : 'pending') as OrderRecord['status'];

    const newOrder = createOrder({
      tenantId: '11111111-1111-1111-1111-111111111111',
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      city,
      address,
      items: validatedItems,
      subtotalYer,
      shippingFeeYer,
      discountYer,
      totalYer,
      currency: 'YER',
      appliedCoupon: appliedCoupon || undefined,
      paymentMethod,
      paymentReference: paymentReference || undefined,
      status: initialStatus,
      notes: notes || undefined,
    });

    // Optional Telegram notification if bot token configured
    const db = getDb();
    const botToken = db.tenant?.notificationConfig?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = db.tenant?.notificationConfig?.telegramChatId || process.env.TELEGRAM_OWNER_CHAT_ID;
    if (botToken && chatId) {
      const storeName = db.tenant?.name || 'مفتاح الجمال';
      const text = `طلب جديد في متجر ${storeName}:
رقم الطلب: ${newOrder.orderNumber}
العميل: ${newOrder.customerName} (${newOrder.customerPhone})
المدينة: ${newOrder.city} - ${newOrder.address}
الإجمالي: ${newOrder.totalYer} ريال يمني
طريقة الدفع: ${newOrder.paymentMethod}`;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      }).catch((err) => console.error('Telegram notification error:', err));
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء حفظ الطلب' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بتحديث حالة الطلب' },
        { status: 401 }
      );
    }

    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const orderId = sanitizeText(body.id || body.orderId || '', 100);
    const status = body.status as OrderRecord['status'];

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب والحالة مطلوبان' },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل تحديث حالة الطلب' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك بحذف الطلب' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = sanitizeText(searchParams.get('id') || '', 100);
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    const deleted = deleteOrder(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'فشل حذف الطلب' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getAllOrders, createOrder, updateOrderStatus, deleteOrder, OrderRecord } from '@/core/db/store';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      );
    }

    const initialStatus = body.status || 'pending';

    const newOrder = createOrder({
      tenantId: '11111111-1111-1111-1111-111111111111',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      city: body.city || 'صنعاء',
      address: body.address || 'صنعاء',
      items: body.items,
      subtotalYer: Number(body.subtotalYer) || 0,
      shippingFeeYer: Number(body.shippingFeeYer) || 0,
      discountYer: Number(body.discountYer) || 0,
      totalYer: Number(body.totalYer) || 0,
      currency: body.currency || 'YER',
      appliedCoupon: body.appliedCoupon,
      paymentMethod: body.paymentMethod || 'whatsapp',
      paymentReference: body.paymentReference,
      status: initialStatus,
      notes: body.notes,
    });

    // Optional Telegram notification if bot token configured
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_OWNER_CHAT_ID;
    if (botToken && chatId) {
      const text = `طلب جديد في متجر مفتاح الجمال:
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
    const body = await req.json();
    const orderId = body.id || body.orderId;
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
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

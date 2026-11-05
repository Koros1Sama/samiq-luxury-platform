import { NextResponse } from 'next/server';
import {
  getAllConversations,
  getConversationById,
  addMessageToConversation,
  toggleBotStatus,
} from '@/core/db/store';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
  sanitizeText,
  sanitizeObjectDeep,
} from '@/core/security/guard';

export async function GET(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    const conversations = getAllConversations();
    return NextResponse.json({
      success: true,
      conversations,
      isAdmin: auth.authorized,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'فشل استرجاع المحادثات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const body = sanitizeObjectDeep(raw);
    const { action, conversationId, text, isBotActive, senderName } = body;

    const convId = sanitizeText(conversationId, 50);
    if (!convId) {
      return NextResponse.json({ success: false, error: 'معرف المحادثة مطلوب' }, { status: 400 });
    }

    // 1. Toggle bot status requires admin
    if (action === 'toggle_bot') {
      const auth = verifyAdminAuth(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: 'غير مصرح لك بتغيير حالة المستشار الآلي' }, { status: 401 });
      }

      const updated = toggleBotStatus(convId, Boolean(isBotActive));
      return NextResponse.json({ success: true, conversation: updated });
    }

    // 2. Admin agent reply requires admin
    if (action === 'reply') {
      const auth = verifyAdminAuth(req);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, error: 'غير مصرح لك بإرسال رد الموظف' }, { status: 401 });
      }

      const cleanText = sanitizeText(text, 1000);
      if (!cleanText) {
        return NextResponse.json({ success: false, error: 'نص الرسالة مطلوب' }, { status: 400 });
      }

      const updated = addMessageToConversation(convId, {
        sender: 'agent',
        senderName: sanitizeText(senderName || 'فريق خدمة العملاء', 50),
        text: cleanText,
      });
      return NextResponse.json({ success: true, conversation: updated });
    }

    // 3. Customer message
    if (action === 'customer_msg') {
      const ip = getClientIp(req);
      if (!checkRateLimit(`inbox_msg:${ip}`, 20, 60_000)) {
        return NextResponse.json({ success: false, error: 'تجاوزت عدد الرسائل المسموح بها' }, { status: 429 });
      }

      const cleanText = sanitizeText(text, 1000);
      if (!cleanText) {
        return NextResponse.json({ success: false, error: 'نص الرسالة مطلوب' }, { status: 400 });
      }

      const updated = addMessageToConversation(convId, {
        sender: 'customer',
        senderName: sanitizeText(senderName || 'العميل', 50),
        text: cleanText,
      });
      return NextResponse.json({ success: true, conversation: updated });
    }

    return NextResponse.json({ success: false, error: 'الإجراء غير صالح' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'فشل معالجة الطلب' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  getAllConversations,
  getConversationById,
  addMessageToConversation,
  toggleBotStatus,
} from '@/core/db/store';

export async function GET() {
  try {
    const conversations = getAllConversations();
    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, conversationId, text, isBotActive, senderName } = body;

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'conversationId is required' }, { status: 400 });
    }

    if (action === 'toggle_bot') {
      const updated = toggleBotStatus(conversationId, Boolean(isBotActive));
      return NextResponse.json({ success: true, conversation: updated });
    }

    if (action === 'reply') {
      if (!text || !text.trim()) {
        return NextResponse.json({ success: false, error: 'text is required' }, { status: 400 });
      }
      const updated = addMessageToConversation(conversationId, {
        sender: 'agent',
        senderName: senderName || 'فريق خدمة العملاء',
        text: text.trim(),
      });
      return NextResponse.json({ success: true, conversation: updated });
    }

    if (action === 'customer_msg') {
      if (!text || !text.trim()) {
        return NextResponse.json({ success: false, error: 'text is required' }, { status: 400 });
      }
      const updated = addMessageToConversation(conversationId, {
        sender: 'customer',
        senderName: senderName || 'العميل',
        text: text.trim(),
      });
      return NextResponse.json({ success: true, conversation: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 });
  }
}

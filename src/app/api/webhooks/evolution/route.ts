import { NextResponse } from 'next/server';

/**
 * Evolution API & Meta Cloud API Coexistence Webhook
 * Handles WhatsApp QR Code and Meta API payloads
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body?.event;
    const data = body?.data;

    // Acknowledge receipt
    return NextResponse.json({
      status: 'success',
      receivedEvent: event || 'messages.upsert',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Meta webhook verification challenge
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === (process.env.META_VERIFY_TOKEN || 'samiq_secret_token')) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ status: 'active', platform: 'SAMIQ WhatsApp Evolution Gateway' });
}

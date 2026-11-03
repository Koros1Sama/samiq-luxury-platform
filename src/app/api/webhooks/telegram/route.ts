import { NextResponse } from 'next/server';
import { getAllProducts } from '@/core/db/store';

/**
 * Telegram Bot Webhook
 * Handles /start, /catalog, /authenticity queries
 */
export async function POST(req: Request) {
  try {
    const update = await req.json();
    const message = update?.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    let responseText = 'أهلاً بك في بوت متجر مفتاح الجمال (أصلي وتقليد). يمكنك كتابة /catalog لعرض المنتجات أو /authenticity لفحص الأصالة.';

    if (text === '/start') {
      responseText = 'مرحباً بك في مفتاح الجمال. بوابتك الموثوقة لعالم الجمال في صنعاء واليمن. نوفر لك أرقى مستحضرات التجميل والعناية الأصلية 100% مع ضمان فحص الباركود.';
    } else if (text === '/catalog' || text.includes('منتجات')) {
      const products = getAllProducts();
      responseText = 'كتالوج مفتاح الجمال الأكثر طلباً:\n\n';
      products.forEach((p, idx) => {
        responseText += `${idx + 1}. ${p.title} - ${p.prices.YER} ر.ي\n`;
      });
      responseText += '\nللتسوق بالكامل ومقارنة الأصلي والتقليد:\nhttps://miftah.samiq.ye';
    } else if (text === '/authenticity' || text.includes('أصلي')) {
      responseText = 'دليل فحص الأصالة المعتمد:\n- فحص كود الباتش أسفل الزجاجة بواسطة الليزر.\n- التأكد من نقاء القوام وخلوه من الرغوة البيضاء.\n- مطابقة الباركود مع الوكالة الدولية.';
    }

    if (botToken) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Telegram processing error' }, { status: 500 });
  }
}

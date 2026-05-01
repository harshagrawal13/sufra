export const runtime = 'nodejs';

function buildMessage(order) {
  const { simranName, address, when, phone, items, totalItems } = order;
  const whenLabel = ({
    asap: 'ASAP',
    'study-break': 'After this chapter',
    late: 'Late-night, post-cram',
  })[when] || when;

  const lines = [];
  lines.push('🍽️ *New Sufra order*');
  lines.push('');
  lines.push(`*From:* ${simranName}`);
  lines.push(`*Drop-off:* ${address}`);
  lines.push(`*When:* ${whenLabel}`);
  if (phone) lines.push(`*Phone:* ${phone}`);
  lines.push('');
  lines.push('*Items:*');
  for (const it of items) {
    lines.push(`• ${it.name}${it.qty > 1 ? ` × ${it.qty}` : ''} — _${it.priceShort}_`);
    if (it.note) lines.push(`   ↳ note: ${it.note}`);
  }
  lines.push('');
  lines.push(`*Total:* ${totalItems} ${totalItems === 1 ? 'favor' : 'favors'}`);
  lines.push('');
  lines.push('— sent from sufra.app');
  return lines.join('\n');
}

async function sendViaWhatsAppCloud(message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_RECIPIENT;
  if (!token || !phoneId || !to) return null;

  const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message, preview_url: false },
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`WhatsApp Cloud API error: ${res.status} ${errText}`);
  }
  return await res.json();
}

async function sendViaTwilio(message) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = process.env.TWILIO_TO;
  if (!sid || !token || !from || !to) return null;

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const body = new URLSearchParams({ From: from, To: to, Body: message });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Twilio error: ${res.status} ${errText}`);
  }
  return await res.json();
}

export async function POST(req) {
  let order;
  try {
    order = await req.json();
  } catch {
    return Response.json({ error: 'Bad payload' }, { status: 400 });
  }

  if (!order?.items?.length) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const message = buildMessage(order);

  try {
    const cloud = await sendViaWhatsAppCloud(message);
    if (cloud) return Response.json({ ok: true, via: 'whatsapp-cloud' });

    const twilio = await sendViaTwilio(message);
    if (twilio) return Response.json({ ok: true, via: 'twilio' });

    // No provider configured — log the message so order isn't silently lost
    console.log('[sufra order — no WhatsApp provider configured]\n' + message);
    return Response.json({ ok: true, via: 'console' });
  } catch (e) {
    console.error('Sufra order send failed:', e);
    return Response.json({ error: e.message || 'Send failed' }, { status: 502 });
  }
}

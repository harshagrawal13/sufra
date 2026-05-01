export const runtime = 'nodejs';

function buildText(order) {
  const { simranName, address, when, phone, items, totalItems } = order;
  const whenLabel = ({
    asap: 'ASAP',
    'study-break': 'After this chapter',
    late: 'Late-night, post-cram',
  })[when] || when;

  const lines = [];
  lines.push('New Sufra order');
  lines.push('');
  lines.push(`From:     ${simranName}`);
  lines.push(`Drop-off: ${address}`);
  lines.push(`When:     ${whenLabel}`);
  if (phone) lines.push(`Phone:    ${phone}`);
  lines.push('');
  lines.push('Items:');
  for (const it of items) {
    lines.push(`  • ${it.name}${it.qty > 1 ? ` × ${it.qty}` : ''} — ${it.priceShort}`);
    if (it.note) lines.push(`      note: ${it.note}`);
  }
  lines.push('');
  lines.push(`Total: ${totalItems} ${totalItems === 1 ? 'favor' : 'favors'}`);
  lines.push('');
  lines.push('— sufra');
  return lines.join('\n');
}

function buildHtml(order) {
  const { simranName, address, when, phone, items, totalItems } = order;
  const whenLabel = ({
    asap: 'ASAP',
    'study-break': 'After this chapter',
    late: 'Late-night, post-cram',
  })[when] || when;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

  const itemRows = items.map(it => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px dashed #ddd;">
        <div style="font-family:Georgia,serif;font-size:16px;color:#1c1a16;">${esc(it.name)}${it.qty > 1 ? ` × ${it.qty}` : ''}</div>
        <div style="font-family:Georgia,serif;font-style:italic;color:#c0392b;font-size:14px;">${esc(it.priceShort)}</div>
        ${it.note ? `<div style="font-size:12px;color:#6b665c;margin-top:4px;">note: ${esc(it.note)}</div>` : ''}
      </td>
    </tr>`).join('');

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f0e8;font-family:-apple-system,Inter,Helvetica,Arial,sans-serif;color:#1c1a16;">
    <div style="max-width:560px;margin:0 auto;background:#faf7f0;padding:32px;border:0.5px solid #1c1a1622;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:24px;margin-bottom:4px;">Sufra<span style="color:#c0392b;">.</span></div>
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b665c;margin-bottom:24px;">New order · For Chef Harsh</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#6b665c;width:90px;">From</td><td>${esc(simranName)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b665c;">Drop-off</td><td>${esc(address)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b665c;">When</td><td>${esc(whenLabel)}</td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#6b665c;">Phone</td><td>${esc(phone)}</td></tr>` : ''}
      </table>
      <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#6b665c;margin:24px 0 8px;">Items</div>
      <table style="width:100%;border-collapse:collapse;">${itemRows}</table>
      <div style="margin-top:24px;padding-top:16px;border-top:1px dashed #1c1a1622;display:flex;justify-content:space-between;">
        <span style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b665c;">Total</span>
        <span style="font-family:Georgia,serif;font-style:italic;color:#c0392b;font-size:18px;">${totalItems} ${totalItems === 1 ? 'favor' : 'favors'}</span>
      </div>
    </div>
  </body></html>`;
}

async function sendViaResend({ subject, text, html }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL_TO;
  const from = process.env.ORDER_EMAIL_FROM || 'Sufra <onboarding@resend.dev>';
  if (!key || !to) return null;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text, html }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend error: ${res.status} ${errText}`);
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

  const subject = `Sufra · new order from ${order.simranName} (${order.totalItems} ${order.totalItems === 1 ? 'favor' : 'favors'})`;
  const text = buildText(order);
  const html = buildHtml(order);

  try {
    const sent = await sendViaResend({ subject, text, html });
    if (sent) return Response.json({ ok: true, via: 'resend' });

    console.log('[sufra order — no email provider configured]\n' + text);
    return Response.json({ ok: true, via: 'console' });
  } catch (e) {
    console.error('Sufra order send failed:', e);
    return Response.json({ error: e.message || 'Send failed' }, { status: 502 });
  }
}

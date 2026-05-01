export const runtime = 'nodejs';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const expected = process.env.SITE_PASSWORD || 'iamalittlebitch';
  if (typeof password === 'string' && password === expected) {
    return Response.json({ ok: true });
  }
  return new Response(JSON.stringify({ ok: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

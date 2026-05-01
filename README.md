# Sufra — a private menu for Simran

A one-night-only food ordering page. Simran picks dishes; the order lands in Harsh's inbox.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in Resend key
npm run dev
```

Visit http://localhost:3000. Password: `iamalittlebitch`.

## Deploy to Vercel

1. Push this repo to GitHub (already done: https://github.com/harshagrawal13/sufra).
2. Import into Vercel (https://vercel.com/new).
3. Set the env vars below in **Project → Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

### Required env vars

| Var | What |
|---|---|
| `SITE_PASSWORD` | Page password (defaults to `iamalittlebitch` if unset) |
| `RESEND_API_KEY` | API key from https://resend.com/api-keys |
| `ORDER_EMAIL_TO` | Where orders are sent (e.g. `harshagrawal.1312@gmail.com`) |
| `ORDER_EMAIL_FROM` | *Optional.* Defaults to `Sufra <onboarding@resend.dev>` (Resend's free test sender). Change once you verify a custom domain. |

### Resend setup (≈2 minutes)

1. Sign up at https://resend.com (free tier: 3,000 emails/month, 100/day).
2. **API Keys → Create** → copy the key, paste as `RESEND_API_KEY` in Vercel.
3. That's it — using the default `onboarding@resend.dev` sender, emails will land in your inbox immediately. (To send from your own domain later, verify it under Resend → Domains and update `ORDER_EMAIL_FROM`.)

If `RESEND_API_KEY` is missing, the order endpoint logs the order to Vercel function logs instead of crashing — so nothing is lost while you're setting things up.

## What's where

- `app/page.js` — main router (menu / cart / checkout / confirm / track)
- `app/api/auth/route.js` — password check
- `app/api/order/route.js` — sends the order email via Resend
- `components/` — Gate, Header, MenuReceipt, Cart, Checkout, Confirm, Track, ui primitives
- `lib/data.js` — dish list and palette

## Notes on the design

The original Claude Design bundle in `sufra/` shipped three layouts (Editorial, Cards, Receipt) and three palettes. This implementation uses the **Receipt** layout and **Editorial** palette as the defaults from the design.

To change which dishes Simran sees, edit `lib/data.js`.

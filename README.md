# Sufra — a private menu for Simran

A one-night-only food ordering page. Simran picks dishes; the order lands on Harsh's WhatsApp.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in WhatsApp creds
npm run dev
```

Visit http://localhost:3000. Password: `iamalittlebitch`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel (https://vercel.com/new).
3. Set the env vars below in **Project → Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

### Required env vars

| Var | What | Where to get |
|---|---|---|
| `SITE_PASSWORD` | Page password (defaults to `iamalittlebitch` if unset) | You pick |
| `WHATSAPP_TOKEN` | Bearer token for WhatsApp Cloud API | https://developers.facebook.com/apps → WhatsApp → API Setup |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone-number ID from the same screen | WhatsApp → API Setup |
| `WHATSAPP_RECIPIENT` | Your number in international format, no `+` (e.g. `919876543210`) | Your phone |

### Setting up WhatsApp Cloud API (the free Meta route)

1. Go to https://developers.facebook.com/apps → **Create App** → "Business" → name it whatever.
2. Add the **WhatsApp** product. Meta gives you a free test sender number.
3. From **WhatsApp → API Setup**, copy the temporary access token (24h) and the Phone Number ID.
4. Add **your own** WhatsApp number under "To" recipients and verify it (Meta sends a code).
5. For long-term: generate a System User permanent token (Business Settings → System Users → Generate Token, scopes `whatsapp_business_messaging` + `whatsapp_business_management`). Use that as `WHATSAPP_TOKEN`.
6. Outside the 24-hour conversation window, plain text messages won't deliver — you'd need a pre-approved template. For order pings from a page Simran just used, you'll be inside the window because she'll have replied via the test environment OR you can switch to Twilio (below) which handles templating differently.

### Twilio fallback (alternative)

If you'd rather use Twilio's WhatsApp sandbox, set instead:

- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM` (e.g. `whatsapp:+14155238886`)
- `TWILIO_TO` (your number, e.g. `whatsapp:+919876543210`)

The order endpoint tries WhatsApp Cloud API first, falls back to Twilio, and as a last resort logs the order to the Vercel function logs (so nothing is lost while you're setting things up).

## What's where

- `app/page.js` — main router (menu / cart / checkout / confirm / track)
- `app/api/auth/route.js` — password check
- `app/api/order/route.js` — sends the order to your WhatsApp
- `components/` — Gate, Header, MenuReceipt, Cart, Checkout, Confirm, Track, ui primitives
- `lib/data.js` — dish list and palette

## Notes on the design

The original Claude Design bundle in `sufra/` shipped three layouts (Editorial, Cards, Receipt) and three palettes. This implementation uses the **Receipt** layout and **Editorial** palette as the defaults from the design, since this is for real use rather than design iteration.

To change which dishes Simran sees, edit `lib/data.js`.

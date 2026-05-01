'use client';
import React from 'react';
import { DishSwatch } from './ui';

export default function MenuReceipt({ palette, dishes, cart, addToCart, simranName }) {
  const [eggOpen, setEggOpen] = React.useState(false);
  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: '100vh' }}>
      <div className="sufra-receipt-wrap" style={{ maxWidth: 640, margin: '0 auto', padding: '64px 32px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: palette.muted, marginBottom: 24,
          }}>
            ── Harsh's Kitchen · Est. tonight ──
          </div>
          <h1 className="sufra-h1" style={{
            fontFamily: '"Fraunces", serif', fontWeight: 300,
            fontSize: 'clamp(40px, 9vw, 64px)', lineHeight: 1, letterSpacing: '-0.03em',
            margin: 0, fontStyle: 'italic',
          }}>
            For {simranName}, with Love & Cheese.
          </h1>
          <p style={{
            marginTop: 28, fontSize: 14, lineHeight: 1.7,
            color: palette.muted, maxWidth: '40ch',
            margin: '28px auto 0',
          }}>
            You better order something if I've spent so much time making this website.
          </p>
        </div>

        <div style={{
          background: palette.surface,
          border: `0.5px solid ${palette.line}`,
          padding: '40px 28px',
        }}>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: palette.muted, textAlign: 'center', marginBottom: 28,
            paddingBottom: 16, borderBottom: `0.5px dashed ${palette.line}`,
          }}>
            Order #042 · Chef Harsh · {simranName.toUpperCase()}
          </div>

          {dishes.map((d, i) => (
            <ReceiptDish key={d.id} dish={d} palette={palette}
                         qty={cart[d.id] || 0}
                         onAdd={() => addToCart(d.id)}
                         last={i === dishes.length - 1} />
          ))}

          <div style={{
            marginTop: 24, paddingTop: 16,
            borderTop: `0.5px dashed ${palette.line}`,
            textAlign: 'center',
            fontFamily: 'ui-monospace, monospace', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: palette.muted,
          }}>
            ── Simran, you cutie{' '}
            <span
              role="button"
              tabIndex={0}
              onClick={() => setEggOpen(v => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setEggOpen(v => !v); }}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              aria-label="A little something"
            >
              🩷
            </span>{' '}──
          </div>
          <div
            style={{
              maxHeight: eggOpen ? 200 : 0,
              opacity: eggOpen ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.5s ease, opacity 0.5s ease',
              textAlign: 'center',
            }}
            aria-hidden={!eggOpen}
          >
            <p style={{
              fontFamily: '"Fraunces", serif', fontStyle: 'italic',
              fontSize: 16, lineHeight: 1.5, color: palette.ink,
              margin: '20px auto 0', maxWidth: '32ch',
            }}>
              Just so you know, I will never stop trying to <span style={{ color: palette.accent }}>impress you</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptDish({ dish, palette, qty, onAdd, last }) {
  return (
    <div className="sufra-receipt-row" style={{
      display: 'grid', gridTemplateColumns: '110px 1fr auto',
      gap: 18, alignItems: 'center',
      padding: '20px 0',
      borderBottom: last ? 'none' : `0.5px dashed ${palette.line}`,
    }}>
      <DishSwatch a={dish.swatchA} b={dish.swatchB} image={dish.image} label={dish.name} small />
      <div>
        <h3 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 400,
          fontSize: 18, margin: '0 0 4px 0', letterSpacing: '-0.005em',
        }}>{dish.name}</h3>
        <div style={{
          fontFamily: '"Fraunces", serif', fontStyle: 'italic',
          fontSize: 14, color: palette.accent,
        }}>💲 {dish.price}</div>
      </div>
      <button onClick={onAdd} style={{
        appearance: 'none', border: `0.5px solid ${palette.ink}`,
        background: qty > 0 ? palette.ink : 'transparent',
        color: qty > 0 ? palette.surface : palette.ink,
        padding: '10px 14px', fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer',
        minWidth: 76,
      }}>
        {qty > 0 ? `· ${qty}` : 'Add'}
      </button>
    </div>
  );
}

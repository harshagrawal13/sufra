'use client';
import React from 'react';
import { DishSwatch, QtyStepper, PrimaryButton } from './ui';

export default function CartScreen({ palette, dishes, cart, setCart, notes, setNotes, onPlace, onNav, matcha, setMatcha, simranName }) {
  const [matchaOpen, setMatchaOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const placeOrder = async (matchaAnswer) => {
    setSubmitting(true);
    setError(null);
    try {
      const itemList = dishes.filter(d => cart[d.id] > 0).map(d => ({
        id: d.id, name: d.name, qty: cart[d.id],
        price: d.price, priceShort: d.priceShort,
        note: notes[d.id] || '',
      }));
      const totalItems = itemList.reduce((s, it) => s + it.qty, 0);
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simranName,
          address: 'See chef notes / Find My',
          when: 'asap',
          phone: '',
          items: itemList,
          totalItems,
          matcha: matchaAnswer === true ? 'yes' : matchaAnswer === false ? 'no' : 'not asked',
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Couldn't reach the chef");
      }
      onPlace();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };
  const items = dishes.filter(d => cart[d.id] > 0);
  const totalItems = items.reduce((s, d) => s + cart[d.id], 0);

  if (items.length === 0) {
    return (
      <div style={{
        background: palette.bg, color: palette.ink, minHeight: 'calc(100vh - 89px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{
            fontFamily: '"Fraunces", serif', fontStyle: 'italic',
            fontWeight: 300, fontSize: 'clamp(36px, 9vw, 56px)', margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
          }}>
            Your cart is <span style={{ color: palette.accent }}>empty</span>.
          </h2>
          <p style={{ color: palette.muted, fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
            Simran kuch toh order karle.
          </p>
          <PrimaryButton palette={palette} onClick={() => onNav('menu')}>
            Browse the menu
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: 'calc(100vh - 89px)' }}>
      <div className="sufra-page" style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 100px' }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 16,
        }}>Your order</div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300,
          fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 1,
          letterSpacing: '-0.02em', margin: '0 0 40px 0',
        }}>
          Cart, <em style={{ fontStyle: 'italic', color: palette.accent }}>tabulated.</em>
        </h1>

        <div className="sufra-cart-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 320px',
          gap: 48, alignItems: 'start',
        }}>
          <div>
            {items.map((d, i) => (
              <div key={d.id} className="sufra-cart-row" style={{
                display: 'grid', gridTemplateColumns: '120px 1fr auto',
                gap: 20, padding: '24px 0',
                borderTop: i === 0 ? `0.5px solid ${palette.line}` : 'none',
                borderBottom: `0.5px solid ${palette.line}`,
                alignItems: 'start',
              }}>
                <DishSwatch a={d.swatchA} b={d.swatchB} image={d.image} label={d.name} square />
                <div style={{ minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: '"Fraunces", serif', fontWeight: 400,
                    fontSize: 20, margin: '0 0 6px 0', letterSpacing: '-0.01em',
                  }}>{d.name}</h3>
                  <div style={{
                    fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                    fontSize: 15, color: palette.accent, marginBottom: 14,
                  }}>💲 {d.price} <span style={{ color: palette.muted, fontStyle: 'normal', fontFamily: 'inherit', fontSize: 12 }}>· per dish</span></div>
                  <textarea
                    value={notes[d.id] || ''}
                    onChange={(e) => setNotes({ ...notes, [d.id]: e.target.value })}
                    placeholder="Note to chef · spice level, allergies, secret request…"
                    style={{
                      width: '100%', minHeight: 36, padding: '10px 12px',
                      border: `0.5px solid ${palette.line}`,
                      background: palette.surface, color: palette.ink,
                      fontFamily: 'inherit', fontSize: 13, lineHeight: 1.5,
                      resize: 'vertical', borderRadius: 0, outline: 'none',
                    }}
                    onFocus={(e) => e.target.style.borderColor = palette.ink}
                    onBlur={(e) => e.target.style.borderColor = palette.line}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <QtyStepper
                    qty={cart[d.id]}
                    onInc={() => setCart({ ...cart, [d.id]: cart[d.id] + 1 })}
                    onDec={() => {
                      const next = { ...cart };
                      if (next[d.id] > 1) next[d.id]--;
                      else delete next[d.id];
                      setCart(next);
                    }}
                    palette={palette}
                  />
                  <button
                    onClick={() => {
                      const next = { ...cart }; delete next[d.id];
                      setCart(next);
                    }}
                    style={{
                      background: 'none', border: 'none',
                      color: palette.muted, fontSize: 11,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      cursor: 'pointer', fontFamily: 'inherit', padding: 0,
                    }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="sufra-summary" style={{
            background: palette.surface,
            border: `0.5px solid ${palette.line}`,
            padding: '32px 28px',
            position: 'sticky', top: 24,
          }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: palette.muted, marginBottom: 20,
            }}>The bill</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {items.map(d => (
                <div key={d.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 13, gap: 12,
                }}>
                  <span style={{ color: palette.ink }}>
                    {d.name} <span style={{ color: palette.muted }}>× {cart[d.id]}</span>
                  </span>
                  <span style={{
                    fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                    color: palette.accent, fontSize: 13, textAlign: 'right',
                    flex: '0 0 auto', maxWidth: '60%',
                  }}>
                    💲 {cart[d.id] > 1 ? `${cart[d.id]} × ${d.priceShort}` : d.priceShort}
                  </span>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: `0.5px dashed ${palette.line}`, paddingTop: 20,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 28,
            }}>
              <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.muted }}>
                Total due
              </span>
              <span style={{
                fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                fontSize: 22, color: palette.accent, fontWeight: 400,
              }}>
                {totalItems} {totalItems === 1 ? 'favor' : 'favors'}
              </span>
            </div>
            {error && (
              <div style={{
                fontSize: 12, color: palette.accent, marginBottom: 12,
                lineHeight: 1.5,
              }}>{error}</div>
            )}
            <PrimaryButton
              palette={palette}
              disabled={submitting}
              onClick={() => {
                if (matcha === null || matcha === undefined) setMatchaOpen(true);
                else placeOrder(matcha);
              }}
              fullWidth
            >
              {submitting ? 'Sending…' : 'Send to chef →'}
            </PrimaryButton>
            <p style={{
              fontSize: 11, color: palette.muted, marginTop: 16,
              lineHeight: 1.5, textAlign: 'center',
            }}>
              Free delivery only for you 🙄
            </p>
          </aside>
        </div>
      </div>

      {matchaOpen && (
        <MatchaModal
          palette={palette}
          onPick={(yes) => {
            setMatcha(yes);
            setMatchaOpen(false);
            placeOrder(yes);
          }}
          onClose={() => setMatchaOpen(false)}
        />
      )}
    </div>
  );
}

function MatchaModal({ palette, onPick, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(28,26,22,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: palette.surface, color: palette.ink,
          border: `0.5px solid ${palette.line}`,
          maxWidth: 420, width: '100%',
          padding: '36px 28px', textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 16,
        }}>
          One quick thing
        </div>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🍵</div>
        <h3 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: 26, lineHeight: 1.2, margin: '0 0 24px 0', letterSpacing: '-0.01em',
        }}>
          Want Harsh to pick up a <span style={{ color: palette.accent }}>matcha</span> for you on the way?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            onClick={() => onPick(false)}
            style={{
              appearance: 'none', border: `0.5px solid ${palette.ink}`,
              background: 'transparent', color: palette.ink,
              padding: '14px 18px', fontSize: 12, letterSpacing: '0.1em',
              textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            No thanks
          </button>
          <button
            onClick={() => onPick(true)}
            style={{
              appearance: 'none', border: 'none',
              background: palette.ink, color: palette.surface,
              padding: '14px 18px', fontSize: 12, letterSpacing: '0.1em',
              textTransform: 'uppercase', fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            Yes please
          </button>
        </div>
      </div>
    </div>
  );
}

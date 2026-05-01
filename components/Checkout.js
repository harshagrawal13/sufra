'use client';
import React from 'react';
import { PrimaryButton } from './ui';

export default function CheckoutScreen({ palette, dishes, cart, notes, matcha, simranName, onPlaced, onBack }) {
  const items = dishes.filter(d => cart[d.id] > 0);
  const totalItems = items.reduce((s, d) => s + cart[d.id], 0);
  const [address, setAddress] = React.useState('Hostel Block C, Room 214');
  const [when, setWhen] = React.useState('asap');
  const [phone, setPhone] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    border: `0.5px solid ${palette.line}`,
    background: palette.surface, color: palette.ink,
    fontFamily: 'inherit', fontSize: 16, borderRadius: 0,
    outline: 'none',
  };
  const labelStyle = {
    fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: palette.muted, marginBottom: 8, display: 'block',
  };

  const place = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simranName,
          address,
          when,
          phone,
          items: items.map(d => ({
            id: d.id, name: d.name, qty: cart[d.id],
            price: d.price, priceShort: d.priceShort,
            note: notes[d.id] || '',
          })),
          totalItems,
          matcha: matcha === true ? 'yes' : matcha === false ? 'no' : 'not asked',
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Could not reach the chef');
      }
      onPlaced();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: 'calc(100vh - 89px)' }}>
      <div className="sufra-page" style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 100px' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: palette.muted,
          fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: 16,
        }}>← Back to cart</button>
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 16,
        }}>Step 02 / 03 · Checkout</div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300,
          fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 1,
          letterSpacing: '-0.02em', margin: '0 0 40px 0',
        }}>
          Where do I <em style={{ fontStyle: 'italic', color: palette.accent }}>find you?</em>
        </h1>

        <div className="sufra-cart-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 320px',
          gap: 48, alignItems: 'start',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={simranName} disabled />
            </div>
            <div>
              <label style={labelStyle}>Drop-off address</label>
              <input style={inputStyle} value={address}
                     onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Phone (so I can knock)</label>
              <input style={inputStyle} value={phone} placeholder="optional"
                     onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>When</label>
              <div className="sufra-when" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { k: 'asap', label: 'ASAP' },
                  { k: 'study-break', label: 'After this chapter' },
                  { k: 'late', label: 'Late-night, post-cram' },
                ].map(opt => (
                  <button key={opt.k} onClick={() => setWhen(opt.k)} style={{
                    appearance: 'none',
                    border: `0.5px solid ${when === opt.k ? palette.ink : palette.line}`,
                    background: when === opt.k ? palette.ink : 'transparent',
                    color: when === opt.k ? palette.surface : palette.ink,
                    padding: '14px 12px', fontSize: 12, fontFamily: 'inherit',
                    cursor: 'pointer', letterSpacing: '0.04em', borderRadius: 0,
                    transition: 'all 0.15s',
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Payment method</label>
              <div style={{
                padding: '14px 16px',
                border: `0.5px solid ${palette.line}`,
                background: palette.surface,
                fontSize: 14, color: palette.ink, lineHeight: 1.5,
              }}>
                <span style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', color: palette.accent }}>
                  Favors only.
                </span>{' '}
                <span style={{ color: palette.muted }}>
                  Settle up after dinner. Trust system.
                </span>
              </div>
            </div>
          </div>

          <aside className="sufra-summary" style={{
            background: palette.surface,
            border: `0.5px solid ${palette.line}`,
            padding: '32px 28px', position: 'sticky', top: 24,
          }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: palette.muted, marginBottom: 20,
            }}>Final summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {items.map(d => (
                <div key={d.id} style={{ fontSize: 13, lineHeight: 1.4 }}>
                  <div style={{ color: palette.ink }}>
                    {d.name} {cart[d.id] > 1 && <span style={{ color: palette.muted }}>× {cart[d.id]}</span>}
                  </div>
                  <div style={{
                    fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                    color: palette.accent, fontSize: 12,
                  }}>
                    💲 {cart[d.id] > 1 ? `${cart[d.id]} × ${d.priceShort}` : d.priceShort}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              borderTop: `0.5px dashed ${palette.line}`, paddingTop: 16,
              marginBottom: 24, display: 'flex',
              justifyContent: 'space-between', alignItems: 'baseline',
            }}>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: palette.muted }}>Total</span>
              <span style={{
                fontFamily: '"Fraunces", serif', fontStyle: 'italic',
                fontSize: 20, color: palette.accent,
              }}>{totalItems} {totalItems === 1 ? 'favor' : 'favors'}</span>
            </div>
            {error && (
              <div style={{
                fontSize: 12, color: palette.accent, marginBottom: 12,
                lineHeight: 1.5,
              }}>{error}</div>
            )}
            <PrimaryButton palette={palette} onClick={place} fullWidth disabled={submitting}>
              {submitting ? 'Sending…' : 'Place order'}
            </PrimaryButton>
          </aside>
        </div>
      </div>
    </div>
  );
}

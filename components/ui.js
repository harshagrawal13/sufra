'use client';
import React from 'react';

export function DishSwatch({ a, b, label, height = 220, square = false, small = false }) {
  const id = React.useId().replace(/[:]/g, '');
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: square ? '1 / 1' : (small ? '1 / 1' : 'auto'),
      height: square || small ? undefined : height,
      overflow: 'hidden',
      background: a,
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="none"
           style={{ position: 'absolute', inset: 0, display: 'block' }}>
        <defs>
          <pattern id={`p${id}`} width="14" height="14" patternUnits="userSpaceOnUse"
                   patternTransform="rotate(45)">
            <rect width="14" height="14" fill={a} />
            <rect width="7" height="14" fill={b} opacity="0.55" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p${id})`} />
      </svg>
      <div style={{
        position: 'absolute',
        left: small ? 8 : 12,
        bottom: small ? 8 : 12,
        right: small ? 8 : 12,
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: small ? 9 : 10,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.92)',
        mixBlendMode: 'difference',
        lineHeight: 1.3,
      }}>
        {label}
      </div>
    </div>
  );
}

export function QtyStepper({ qty, onInc, onDec, palette }) {
  const btn = {
    width: 30, height: 30, border: 'none',
    background: 'transparent', color: palette.ink,
    fontSize: 18, lineHeight: 1, cursor: 'pointer',
    fontFamily: 'inherit', padding: 0,
  };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      border: `0.5px solid ${palette.line}`, borderRadius: 999,
      padding: '2px 6px', background: palette.surface,
    }}>
      <button style={btn} onClick={onDec} aria-label="decrease">−</button>
      <span style={{
        minWidth: 16, textAlign: 'center', fontSize: 13,
        fontVariantNumeric: 'tabular-nums', color: palette.ink,
      }}>{qty}</span>
      <button style={btn} onClick={onInc} aria-label="increase">+</button>
    </div>
  );
}

export function PrimaryButton({ children, onClick, palette, disabled, fullWidth, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        appearance: 'none',
        border: 'none',
        background: disabled ? palette.muted : palette.ink,
        color: palette.surface,
        padding: '14px 22px',
        fontSize: 13,
        fontFamily: 'inherit',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 0,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export function Header({ palette, onNav, route, cartCount }) {
  const link = (active) => ({
    fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
    color: active ? palette.ink : palette.muted,
    cursor: 'pointer', background: 'none', border: 'none',
    padding: 0, fontFamily: 'inherit',
    borderBottom: active ? `1px solid ${palette.ink}` : '1px solid transparent',
    paddingBottom: 2,
  });
  return (
    <header
      className="sufra-header"
      style={{
        padding: '24px 48px',
        borderBottom: `0.5px solid ${palette.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: palette.bg,
        gap: 16,
      }}
    >
      <button onClick={() => onNav('menu')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400,
        fontStyle: 'italic', color: palette.ink, letterSpacing: '-0.01em',
        padding: 0,
      }}>
        Harsh's Kitchen<span style={{ color: palette.accent }}>.</span>
      </button>
      <nav style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={link(route === 'menu')} onClick={() => onNav('menu')}>Menu</button>
        <button style={link(route === 'cart')} onClick={() => onNav('cart')}>
          Cart{cartCount > 0 && ` (${cartCount})`}
        </button>
        <button style={link(route === 'track')} onClick={() => onNav('track')}>Track</button>
      </nav>
    </header>
  );
}

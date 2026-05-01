'use client';
import React from 'react';
import { PALETTE } from '@/lib/data';
import { PrimaryButton } from './ui';

export default function Gate({ onPass }) {
  const palette = PALETTE;
  const [pwd, setPwd] = React.useState('');
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('sufra-ok') === '1') {
      onPass();
    }
  }, [onPass]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        sessionStorage.setItem('sufra-ok', '1');
        onPass();
      } else {
        setError("That's not it. Try again.");
      }
    } catch {
      setError('Network hiccup. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      background: palette.bg, color: palette.ink,
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <form onSubmit={submit} style={{
        width: '100%', maxWidth: 420, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: '"Fraunces", serif', fontSize: 28,
          fontStyle: 'italic', color: palette.ink, marginBottom: 8,
          letterSpacing: '-0.01em',
        }}>
          Sufra<span style={{ color: palette.accent }}>.</span>
        </div>
        <div style={{
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 32,
        }}>
          A private menu · Members only
        </div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300,
          fontSize: 'clamp(36px, 9vw, 56px)', lineHeight: 1.05,
          letterSpacing: '-0.02em', margin: '0 0 24px 0',
        }}>
          Whisper the <em style={{ fontStyle: 'italic', color: palette.accent }}>magic word.</em>
        </h1>
        <p style={{
          color: palette.muted, fontSize: 14, lineHeight: 1.6,
          margin: '0 auto 32px', maxWidth: '36ch',
        }}>
          You know it. He told you, exactly once, with a smirk.
        </p>

        <input
          type="password"
          autoFocus
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
          style={{
            width: '100%', padding: '16px 18px',
            border: `0.5px solid ${palette.line}`,
            background: palette.surface, color: palette.ink,
            fontFamily: 'inherit', fontSize: 16, borderRadius: 0,
            outline: 'none', textAlign: 'center', letterSpacing: '0.04em',
            marginBottom: 16,
          }}
          onFocus={(e) => e.target.style.borderColor = palette.ink}
          onBlur={(e) => e.target.style.borderColor = palette.line}
        />

        {error && (
          <div style={{
            fontSize: 12, color: palette.accent, marginBottom: 16,
            fontFamily: '"Fraunces", serif', fontStyle: 'italic',
          }}>{error}</div>
        )}

        <PrimaryButton palette={palette} type="submit" disabled={busy || !pwd} fullWidth>
          {busy ? 'Checking…' : 'Enter'}
        </PrimaryButton>
      </form>
    </div>
  );
}

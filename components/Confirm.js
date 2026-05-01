'use client';
import { PrimaryButton } from './ui';

export default function ConfirmScreen({ palette, simranName, onTrack }) {
  return (
    <div style={{
      background: palette.bg, color: palette.ink,
      minHeight: 'calc(100vh - 89px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center',
    }}>
      <div style={{ maxWidth: 560 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: palette.accent, color: palette.surface,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Fraunces", serif', fontStyle: 'italic',
          fontSize: 26, margin: '0 auto 32px',
        }}>✓</div>
        <div style={{
          fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 20,
        }}>Order confirmed</div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300,
          fontSize: 'clamp(36px, 8vw, 68px)', lineHeight: 1.05,
          letterSpacing: '-0.02em', margin: '0 0 28px 0',
        }}>
          Stove's on, <em style={{ fontStyle: 'italic', color: palette.accent }}>{simranName.toLowerCase()}.</em>
        </h1>
        <p style={{
          fontSize: 16, lineHeight: 1.65, color: palette.muted,
          maxWidth: '46ch', margin: '0 auto 40px',
        }}>
          Our company policy is payment first. Gone were the days when you could
          back down from dancing on <span style={{ color: palette.accent, fontFamily: '"Fraunces", serif', fontStyle: 'italic' }}>Baby Doll</span> ;)
        </p>
        <PrimaryButton palette={palette} onClick={onTrack}>
          Track the chef →
        </PrimaryButton>
      </div>
    </div>
  );
}

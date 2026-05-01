'use client';
import { PrimaryButton } from './ui';

export default function TrackScreen({ palette, simranName, onReset, dishes, cart }) {
  const items = dishes.filter(d => cart[d.id] > 0);
  const STAGES = [
    { k: 'received', label: 'Order received', sub: 'Chef is reading your note.' },
    { k: 'cooking',  label: 'In the kitchen', sub: 'Pans hot. Music on.' },
    { k: 'plating',  label: 'Plating up',     sub: 'Tasting, garnishing, swearing softly.' },
    { k: 'enroute',  label: 'On the way',     sub: 'Chef is walking briskly with takeaway containers.' },
    { k: 'arrived',  label: 'At your door',   sub: "Open the door. Don't make him knock twice." },
  ];
  const progress = 0;
  const stageIdx = 0;

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: 'calc(100vh - 89px)' }}>
      <div className="sufra-page" style={{ maxWidth: 880, margin: '0 auto', padding: '48px 24px 100px' }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 16,
        }}>Live · Order #042</div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontWeight: 300,
          fontSize: 'clamp(40px, 8vw, 80px)', lineHeight: 1,
          letterSpacing: '-0.025em', margin: '0 0 40px 0',
        }}>
          Chef arrives in <em style={{ fontStyle: 'italic', color: palette.accent }}>
            5 days
          </em>
        </h1>

        <div style={{
          background: palette.surface,
          border: `0.5px solid ${palette.line}`,
          padding: '32px 24px', marginBottom: 24,
        }}>
          <div style={{
            position: 'relative', height: 4, background: palette.line,
            marginBottom: 32, overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, right: 'auto',
              width: `${progress * 100}%`,
              background: palette.accent, transition: 'width 1s linear',
            }} />
          </div>
          <div className="sufra-stages" style={{
            display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
            gap: 12,
          }}>
            {STAGES.map((s, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <div key={s.k} style={{
                  opacity: done || active ? 1 : 0.4,
                  textAlign: 'left',
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: done || active ? palette.accent : palette.line,
                    marginBottom: 10,
                    boxShadow: active ? `0 0 0 4px ${palette.accent}22` : 'none',
                    transition: 'all 0.3s',
                  }} />
                  <div style={{
                    fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: palette.ink, fontWeight: 500, marginBottom: 4,
                  }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: palette.muted, lineHeight: 1.4 }}>
                    {active ? s.sub : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          background: palette.surface,
          border: `0.5px solid ${palette.line}`,
          padding: '40px 28px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: palette.muted, marginBottom: 16,
          }}>
            Tracker
          </div>
          <p style={{
            fontFamily: '"Fraunces", serif', fontStyle: 'italic',
            fontSize: 'clamp(20px, 4vw, 28px)', lineHeight: 1.4,
            color: palette.ink, margin: 0, letterSpacing: '-0.005em',
          }}>
            You already have my <span style={{ color: palette.accent }}>find my</span> ;)
          </p>
        </div>

        {stageIdx === STAGES.length - 1 && (
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <PrimaryButton palette={palette} onClick={onReset}>
              Order again
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

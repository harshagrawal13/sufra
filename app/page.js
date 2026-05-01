'use client';
import React from 'react';
import { MENU, PALETTE } from '@/lib/data';
import { Header } from '@/components/ui';
import Gate from '@/components/Gate';
import MenuReceipt from '@/components/MenuReceipt';
import CartScreen from '@/components/Cart';
import ConfirmScreen from '@/components/Confirm';
import TrackScreen from '@/components/Track';

const SIMRAN_NAME = 'Simran';

export default function Page() {
  const [authed, setAuthed] = React.useState(false);
  const [route, setRoute] = React.useState('menu');
  const [cart, setCart] = React.useState({});
  const [notes, setNotes] = React.useState({});
  const [matcha, setMatcha] = React.useState(null);
  const palette = PALETTE;

  if (!authed) return <Gate onPass={() => setAuthed(true)} />;

  const cartCount = Object.values(cart).reduce((s, n) => s + n, 0);
  const addToCart = (id) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const onPlaced = () => setRoute('confirm');
  const onReset = () => { setCart({}); setNotes({}); setMatcha(null); setRoute('menu'); };

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: '100vh' }}>
      <Header palette={palette} route={route} onNav={setRoute} cartCount={cartCount} />

      {route === 'menu' && (
        <MenuReceipt palette={palette} dishes={MENU} cart={cart}
                     addToCart={addToCart} simranName={SIMRAN_NAME} />
      )}
      {route === 'cart' && (
        <CartScreen palette={palette} dishes={MENU} cart={cart} setCart={setCart}
                    notes={notes} setNotes={setNotes}
                    matcha={matcha} setMatcha={setMatcha}
                    simranName={SIMRAN_NAME}
                    onPlace={onPlaced} onNav={setRoute} />
      )}
      {route === 'confirm' && (
        <ConfirmScreen palette={palette} simranName={SIMRAN_NAME}
                       onTrack={() => setRoute('track')} />
      )}
      {route === 'track' && (
        <TrackScreen palette={palette} simranName={SIMRAN_NAME}
                     dishes={MENU} cart={cart} onReset={onReset} />
      )}

      <footer className="sufra-footer" style={{
        padding: '32px 48px', borderTop: `0.5px solid ${palette.line}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: palette.muted, gap: 12, flexWrap: 'wrap',
      }}>
        <span>From Chef Harsh &lt;&gt; Exclusively for Simran's Finals</span>
        <span>Made with love, butter & mild panic.</span>
      </footer>
    </div>
  );
}

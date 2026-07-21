import { useState } from 'react';

export default function Header({ onConnect, connected, address }) {
  const [busy, setBusy] = useState(false);

  const handleConnect = async () => {
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onConnect?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-5 max-w-md mx-auto w-full">
      <span className="text-[1.28rem] font-extrabold tracking-tight">🍣 SushiMobile</span>
      <button
        className={`py-2 px-5 rounded-xl font-semibold text-sm transition ${
          connected
            ? 'bg-black/20 border border-neon text-neon'
            : 'bg-neon text-white hover:bg-pink-700'
        }`}
        onClick={handleConnect}
        disabled={busy}
        aria-busy={busy}
        aria-label={connected ? 'Disconnect Wallet' : 'Connect Wallet'}
      >
        {connected ? `${address.slice(0, 6)}…${address.slice(-4)}` : busy ? 'Connecting…' : 'Connect'}
      </button>
    </header>
  );
}
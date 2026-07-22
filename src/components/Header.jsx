import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAppContext } from '../main';

export default function Header({ onOpenWallet }) {
  const { address, isConnected } = useAccount();
  const { hasPrivy } = useAppContext();
  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center py-3 px-4 mx-auto" style={{ maxWidth: 480 }}>
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#FF007A" strokeWidth="1.5" fill="rgba(255,0,122,0.08)" />
            <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#FF007A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M10 16c0 3.3 2.7 6 6 6" stroke="#FF007A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2" fill="#FF007A" />
          </svg>
          <span className="text-base font-bold text-white">Sushi<span className="text-neon">Mobile</span></span>
        </div>
        <button
          onClick={onOpenWallet}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
            isConnected ? 'bg-white/5 border border-white/10 text-neon' : 'bg-neon text-white'
          }`}
        >
          {isConnected ? shortAddr : 'Connect'}
        </button>
      </div>
    </header>
  );
}

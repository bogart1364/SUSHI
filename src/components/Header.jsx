import { useAccount } from 'wagmi';

export default function Header({ onOpenWallet }) {
  const { address, isConnected } = useAccount();

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

  return (
    <header className="flex justify-between items-center py-4 px-5 max-w-md mx-auto w-full">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="#FF007A" strokeWidth="1.5" fill="rgba(255,0,122,0.08)" />
            <circle cx="16" cy="16" r="10" stroke="#FF007A" strokeWidth="0.8" fill="none" opacity="0.3" />
            <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#FF007A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M10 16c0 3.3 2.7 6 6 6" stroke="#FF007A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2" fill="#FF007A" />
            <circle cx="12" cy="14" r="1" fill="#FF007A" opacity="0.5" />
            <circle cx="20" cy="18" r="1" fill="#FF007A" opacity="0.5" />
          </svg>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-neon rounded-full animate-pulse-glow" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-white">Sushi</span>
          <span className="text-lg font-bold tracking-tight neon-text">Mobile</span>
        </div>
      </div>
      {isConnected ? (
        <button
          className="glass-sushi py-2 px-4 rounded-xl font-semibold text-sm text-neon transition-all duration-300 hover:shadow-neon active:scale-95"
          onClick={onOpenWallet}
          aria-label="Wallet"
        >
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            {shortAddr}
          </span>
        </button>
      ) : (
        <button
          className="bg-neon text-white py-2 px-5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-pink-600 hover:shadow-neon active:scale-95"
          onClick={onOpenWallet}
          aria-label="Connect Wallet"
        >
          Connect
        </button>
      )}
    </header>
  );
}

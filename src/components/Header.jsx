import { useAccount } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';

export default function Header({ onOpenWallet }) {
  const { address, isConnected } = useAccount();
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
      <div className="flex justify-between items-center py-3 px-4 mx-auto" style={{ maxWidth: 480 }}>
        <span className="text-base font-bold text-white">Sushi<span className="text-neon">Mobile</span></span>
        <button onClick={onOpenWallet} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${isConnected ? 'bg-white/5 border border-white/10 text-neon' : 'bg-neon text-white'}`}>
          {isConnected ? short : 'Connect'}
        </button>
      </div>
    </header>
  );
}

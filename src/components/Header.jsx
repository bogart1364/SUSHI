import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { getTokenPrice } from '../services/dexScreener';
import { formatPrice } from '../utils/format';

export default function Header({ onOpenWallet }) {
  const { address, isConnected } = useAccount();
  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await getTokenPrice('ETH');
        if (mounted && p > 0) setEthPrice(p);
      } catch { /* silent */ }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
      <div className="flex justify-between items-center py-3 px-4 mx-auto" style={{ maxWidth: 480 }}>
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="SushiFi" className="w-7 h-7" />
          <div>
            <span className="text-base font-bold text-white">Sushi<span className="text-neon">Fi</span></span>
            {ethPrice > 0 && (
              <div className="flex items-center gap-1 -mt-0.5">
                <span className="text-[8px] text-gray-600">ETH</span>
                <span className="text-[9px] text-success font-medium">{formatPrice(ethPrice)}</span>
              </div>
            )}
          </div>
        </div>
        <button onClick={onOpenWallet} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${isConnected ? 'bg-white/5 border border-white/10 text-neon' : 'bg-neon text-white shadow-neon'}`}>
          {isConnected ? short : 'Connect'}
        </button>
      </div>
    </header>
  );
}

import { useAccount } from 'wagmi';
import { useState } from 'react';

const POOLS = [
  { pair: 'ETH/SUSHI', apr: '12.5%', tvl: '$4.2M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { pair: 'ETH/USDT', apr: '8.3%', tvl: '$12.8M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { pair: 'SUSHI/USDT', apr: '18.7%', tvl: '$1.1M', logo1: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

export default function Earn() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState('pools');

  if (!isConnected) {
    return (
      <div className="w-full px-3">
        <div className="glass-sushi rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm">Connect wallet to view farms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        {['pools', 'farms'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`py-2 rounded-lg font-semibold text-[11px] transition active:scale-95 ${tab === t ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
            {t === 'pools' ? 'Pools' : 'Farms'}
          </button>
        ))}
      </div>

      {tab === 'pools' && (
        <div className="space-y-2">
          {POOLS.map((pool) => (
            <div key={pool.pair} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex -space-x-1.5">
                  <img src={pool.logo1} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
                  <img src={pool.logo2} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
                </div>
                <span className="text-white font-bold text-xs">{pool.pair}</span>
              </div>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-gray-500">APR: <span className="text-success">{pool.apr}</span></span>
                <span className="text-gray-500">TVL: <span className="text-gray-400">{pool.tvl}</span></span>
              </div>
              <button className="w-full py-1.5 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-[10px] active:scale-95 transition">
                Add Liquidity
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'farms' && (
        <div className="glass-sushi rounded-2xl p-5 text-center">
          <p className="text-gray-500 text-xs">No active farms yet</p>
        </div>
      )}
    </div>
  );
}

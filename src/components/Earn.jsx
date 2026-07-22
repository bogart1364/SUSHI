import { useAccount, useBalance } from 'wagmi';
import { useState } from 'react';

const POOLS = [
  { pair: 'ETH/SUSHI', token1: 'ETH', token2: 'SUSHI', apr: '12.5%', tvl: '$4.2M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { pair: 'ETH/USDT', token1: 'ETH', token2: 'USDT', apr: '8.3%', tvl: '$12.8M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { pair: 'SUSHI/USDT', token1: 'SUSHI', token2: 'USDT', apr: '18.7%', tvl: '$1.1M', logo1: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

export default function Earn() {
  const { isConnected } = useAccount();
  const [tab, setTab] = useState('pools');

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto w-full px-4 pt-2">
        <div className="glass-sushi rounded-2xl p-8 text-center">
          <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4c4 8 12 14 20 16-8 2-16 8-20 16-4-8-12-14-20-16 8-2 16-8 20-16z" stroke="#FF007A" strokeWidth="2" fill="none" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-400 text-sm">Connect your wallet to view farms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="flex gap-2 mb-5">
        <button
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition active:scale-95 ${tab === 'pools' ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}
          onClick={() => setTab('pools')}
        >
          Pools
        </button>
        <button
          className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition active:scale-95 ${tab === 'farms' ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}
          onClick={() => setTab('farms')}
        >
          Farms
        </button>
      </div>

      {tab === 'pools' && (
        <>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Liquidity Pools</p>
          <div className="space-y-2">
            {POOLS.map((pool) => (
              <div key={pool.pair} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    <img src={pool.logo1} alt="" className="w-7 h-7 rounded-full border-2 border-[#141420]" />
                    <img src={pool.logo2} alt="" className="w-7 h-7 rounded-full border-2 border-[#141420]" />
                  </div>
                  <span className="text-white font-bold text-sm">{pool.pair}</span>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-500">APR: <span className="text-success">{pool.apr}</span></span>
                  <span className="text-gray-500">TVL: <span className="text-gray-400">{pool.tvl}</span></span>
                </div>
                <button className="w-full py-2 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-xs active:scale-95 transition">
                  Add Liquidity
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'farms' && (
        <>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Your Farms</p>
          <div className="glass-sushi rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-sm">No active farms yet</p>
            <p className="text-gray-600 text-xs mt-1">Add liquidity to pools to start farming</p>
          </div>
        </>
      )}
    </div>
  );
}

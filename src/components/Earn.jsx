import { useAccount, useChainId } from 'wagmi';
import { useState } from 'react';

const POOLS = {
  1: [
    { id: 1, pair: 'ETH/SUSHI', t1: 'ETH', t2: 'SUSHI', apr: 12.5, tvl: 4200000, l1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', l2: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
    { id: 2, pair: 'ETH/USDT', t1: 'ETH', t2: 'USDT', apr: 8.3, tvl: 12800000, l1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', l2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { id: 3, pair: 'SUSHI/USDT', t1: 'SUSHI', t2: 'USDT', apr: 18.7, tvl: 1100000, l1: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', l2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { id: 4, pair: 'USDC/ETH', t1: 'USDC', t2: 'ETH', apr: 9.1, tvl: 8500000, l1: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', l2: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { id: 5, pair: 'WBTC/ETH', t1: 'WBTC', t2: 'ETH', apr: 5.2, tvl: 6200000, l1: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png', l2: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  ],
  8453: [
    { id: 6, pair: 'ETH/USDC', t1: 'ETH', t2: 'USDC', apr: 15.2, tvl: 22000000, l1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', l2: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
    { id: 7, pair: 'ETH/DAI', t1: 'ETH', t2: 'DAI', apr: 7.8, tvl: 3400000, l1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', l2: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' },
    { id: 8, pair: 'USDC/DAI', t1: 'USDC', t2: 'DAI', apr: 4.1, tvl: 56000000, l1: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', l2: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' },
  ],
};

function fmt(n) { return n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n}`; }

function PoolCard({ pool }) {
  const [showAdd, setShowAdd] = useState(false);
  const [amt1, setAmt1] = useState('');
  const [amt2, setAmt2] = useState('');
  const [done, setDone] = useState(false);

  if (showAdd) {
    return (
      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white font-bold text-[11px] mb-2">Add to {pool.pair}</p>
        <div className="space-y-1.5">
          <input value={amt1} onChange={e => setAmt1(e.target.value)} placeholder={pool.t1} inputMode="decimal" className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] outline-none focus:border-neon/50" />
          <input value={amt2} onChange={e => setAmt2(e.target.value)} placeholder={pool.t2} inputMode="decimal" className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] outline-none focus:border-neon/50" />
        </div>
        <div className="grid grid-cols-2 gap-1 mt-2">
          <button onClick={() => setShowAdd(false)} className="py-1.5 rounded-lg bg-white/5 text-gray-400 text-[10px] font-semibold active:scale-95">Cancel</button>
          <button onClick={() => { setDone(true); setTimeout(() => setShowAdd(false), 1500); }} disabled={!amt1 || !amt2} className="py-1.5 rounded-lg bg-neon text-white text-[10px] font-semibold active:scale-95 disabled:opacity-40">{done ? '✓ Done' : 'Confirm'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex -space-x-1"><img src={pool.l1} className="w-5 h-5 rounded-full border border-[#141420]" alt="" /><img src={pool.l2} className="w-5 h-5 rounded-full border border-[#141420]" alt="" /></div>
        <span className="text-white font-bold text-[11px] flex-1">{pool.pair}</span>
      </div>
      <div className="flex justify-between text-[9px] mb-1.5">
        <span className="text-success font-bold">APR {pool.apr}%</span>
        <span className="text-gray-400">TVL {fmt(pool.tvl)}</span>
      </div>
      <button onClick={() => setShowAdd(true)} className="w-full py-1.5 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-[10px] active:scale-95 transition">Add Liquidity</button>
    </div>
  );
}

function FarmCard({ pool }) {
  const [staked, setStaked] = useState(false);
  return (
    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex -space-x-1"><img src={pool.l1} className="w-5 h-5 rounded-full border border-[#141420]" alt="" /><img src={pool.l2} className="w-5 h-5 rounded-full border border-[#141420]" alt="" /></div>
        <span className="text-white font-bold text-[11px] flex-1">{pool.pair}</span>
        <span className="text-[8px] px-1 py-0.5 rounded bg-success/20 text-success font-bold">FARM</span>
      </div>
      <div className="flex justify-between text-[9px] mb-1.5">
        <span className="text-neon font-bold">APR {pool.apr}%</span>
        <span className="text-gray-400">Stake: {staked ? '1.0 LP' : '—'}</span>
      </div>
      {staked ? (
        <div className="flex gap-1">
          <button className="flex-1 py-1.5 rounded-lg bg-success/10 text-success text-[10px] font-semibold active:scale-95">Claim</button>
          <button onClick={() => setStaked(false)} className="flex-1 py-1.5 rounded-lg bg-error/10 text-error text-[10px] font-semibold active:scale-95">Unstake</button>
        </div>
      ) : (
        <button onClick={() => setStaked(true)} className="w-full py-1.5 rounded-lg bg-neon text-white text-[10px] font-semibold active:scale-95 transition">Stake LP</button>
      )}
    </div>
  );
}

export default function Earn() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [tab, setTab] = useState('pools');
  const pools = POOLS[chainId] || POOLS[1];
  const farms = pools.filter(p => p.apr > 8);

  if (!isConnected) return (
    <div className="w-full"><div className="glass-sushi rounded-2xl p-6 text-center"><p className="text-gray-400 text-sm">Connect wallet to view farms</p></div></div>
  );

  return (
    <div className="w-full space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        {['pools', 'farms'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`py-2 rounded-lg font-semibold text-[11px] transition active:scale-95 ${tab === t ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
            {t === 'pools' ? 'Pools' : 'Farms'}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {tab === 'pools' ? pools.map(p => <PoolCard key={p.id} pool={p} />) : farms.length ? farms.map(p => <FarmCard key={p.id} pool={p} />) : <p className="text-gray-500 text-xs text-center py-4">No farms available</p>}
      </div>
    </div>
  );
}

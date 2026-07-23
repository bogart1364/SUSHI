import { useAccount, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { fetchRobinhoodTokens } from '../services/dexScreener';

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
  4663: [],
};

function fmt(n) { return n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n}`; }

function PoolCard({ pool }) {
  const [showAdd, setShowAdd] = useState(false);
  const [amt1, setAmt1] = useState('');
  const [amt2, setAmt2] = useState('');
  const [done, setDone] = useState(false);

  if (showAdd) {
    return (
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
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
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex -space-x-1">
          <img src={pool.l1} className="w-5 h-5 rounded-full border-2 border-[#0e0e18]" alt="" />
          <img src={pool.l2} className="w-5 h-5 rounded-full border-2 border-[#0e0e18]" alt="" />
        </div>
        <span className="text-white font-bold text-[11px] flex-1">{pool.pair}</span>
        {pool.apr > 10 && <span className="text-[8px] px-1 py-0.5 rounded bg-success/20 text-success font-bold">HOT</span>}
      </div>
      <div className="flex justify-between text-[9px] mb-2">
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
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex -space-x-1">
          <img src={pool.l1} className="w-5 h-5 rounded-full border-2 border-[#0e0e18]" alt="" />
          <img src={pool.l2} className="w-5 h-5 rounded-full border-2 border-[#0e0e18]" alt="" />
        </div>
        <span className="text-white font-bold text-[11px] flex-1">{pool.pair}</span>
        <span className="text-[8px] px-1 py-0.5 rounded bg-success/20 text-success font-bold">FARM</span>
      </div>
      <div className="flex justify-between text-[9px] mb-2">
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

function LivePoolCard({ token }) {
  const pairName = `${token.symbol}/${token.quoteSymbol}`;
  return (
    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <div className="flex items-center gap-2 mb-2">
        {token.logo ? (
          <img src={token.logo} className="w-5 h-5 rounded-full border-2 border-[#0e0e18]" alt="" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-[8px] text-gray-500">{token.symbol[0]}</span>
          </div>
        )}
        <span className="text-white font-bold text-[11px] flex-1">{pairName}</span>
        {token.change24h > 0 && <span className="text-success text-[9px] font-medium">+{token.change24h?.toFixed(1)}%</span>}
        {token.change24h < 0 && <span className="text-error text-[9px] font-medium">{token.change24h?.toFixed(1)}%</span>}
      </div>
      <div className="flex justify-between text-[9px] mb-2">
        <span className="text-gray-400">Liq {fmt(token.liquidity)}</span>
        <span className="text-gray-400">Vol {fmt(token.volume24h)}</span>
      </div>
      <a
        href={token.pairUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-1.5 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-[10px] text-center active:scale-95 transition"
      >
        Trade on SushiSwap
      </a>
    </div>
  );
}

export default function Earn() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [tab, setTab] = useState('pools');
  const [livePools, setLivePools] = useState([]);

  const pools = POOLS[chainId] || POOLS[1];
  const farms = pools.filter(p => p.apr > 8);

  useEffect(() => {
    if (chainId !== 4663) return;
    let mounted = true;
    async function load() {
      try {
        const tokens = await fetchRobinhoodTokens();
        if (mounted) setLivePools(tokens.slice(0, 6));
      } catch { /* silent */ }
    }
    load();
    return () => { mounted = false; };
  }, [chainId]);

  if (!isConnected) return (
    <div className="w-full">
      <div className="glass-sushi rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <path d="M4 18c2-6 8-12 16-14-2 8-8 14-16 14z" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Connect wallet to view pools</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        {['pools', 'farms'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`py-2 rounded-xl font-semibold text-[11px] transition active:scale-95 ${tab === t ? 'bg-neon text-white shadow-neon' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
            {t === 'pools' ? 'Pools' : 'Farms'}
          </button>
        ))}
      </div>

      {chainId === 4663 && livePools.length > 0 && (
        <div>
          <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-1.5">Live Robinhood Chain Pools</p>
          <div className="space-y-1.5">
            {livePools.map(t => <LivePoolCard key={t.pairAddress} token={t} />)}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {tab === 'pools'
          ? pools.map(p => <PoolCard key={p.id} pool={p} />)
          : farms.length
            ? farms.map(p => <FarmCard key={p.id} pool={p} />)
            : <p className="text-gray-500 text-xs text-center py-4">No farms available</p>
        }
      </div>
    </div>
  );
}

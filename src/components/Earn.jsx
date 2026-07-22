import { useAccount, useBalance, useChainId } from 'wagmi';
import { useState } from 'react';

const POOLS = {
  1: [
    { id: 1, pair: 'ETH/SUSHI', token1: 'ETH', token2: 'SUSHI', apr: 12.5, tvl: 4200000, logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', poolAddr: '0x0769FD68dFb93167989C6f7254cd0d766Fb2841F' },
    { id: 2, pair: 'ETH/USDT', token1: 'ETH', token2: 'USDT', apr: 8.3, tvl: 12800000, logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png', poolAddr: '0x055475920a8c93cffb64d039a8205f7acc7722d3' },
    { id: 3, pair: 'SUSHI/USDT', token1: 'SUSHI', token2: 'USDT', apr: 18.7, tvl: 1100000, logo1: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png', poolAddr: '0x68538f1Ab41F7e6B028d5D4e0150774E1C7E4911' },
    { id: 4, pair: 'USDC/ETH', token1: 'USDC', token2: 'ETH', apr: 9.1, tvl: 8500000, logo1: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', logo2: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', poolAddr: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0' },
    { id: 5, pair: 'WBTC/ETH', token1: 'WBTC', token2: 'ETH', apr: 5.2, tvl: 6200000, logo1: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png', logo2: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', poolAddr: '0xCEfF3C4a777e2D509D2D6af42e9D2a41C0c32E97' },
  ],
  8453: [
    { id: 6, pair: 'ETH/USDC', token1: 'ETH', token2: 'USDC', apr: 15.2, tvl: 22000000, logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', poolAddr: '0xb2cc224c1c9feE385f8ad6a55b4d94E92359DC59' },
    { id: 7, pair: 'ETH/DAI', token1: 'ETH', token2: 'DAI', apr: 7.8, tvl: 3400000, logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', poolAddr: '0x3b9c10C55F7120Be39B6a432B42c035B0D7fB348' },
    { id: 8, pair: 'USDC/DAI', token1: 'USDC', token2: 'DAI', apr: 4.1, tvl: 56000000, logo1: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', logo2: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', poolAddr: '0x2C8887A75E508f0B4B2c8Fe0DE8b27C67052d843' },
  ],
};

function formatUSD(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function PoolCard({ pool, chainId, onAddLiquidity }) {
  return (
    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex -space-x-1">
          <img src={pool.logo1} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
          <img src={pool.logo2} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
        </div>
        <span className="text-white font-bold text-[11px]">{pool.pair}</span>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-2">
        <div className="text-center">
          <p className="text-[8px] text-gray-500">APR</p>
          <p className="text-success font-bold text-[11px]">{pool.apr}%</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-gray-500">TVL</p>
          <p className="text-white font-semibold text-[11px]">{formatUSD(pool.tvl)}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-gray-500">24h Vol</p>
          <p className="text-white font-semibold text-[11px]">{formatUSD(pool.tvl * pool.apr / 365)}</p>
        </div>
      </div>
      <button onClick={() => onAddLiquidity(pool)} className="w-full py-1.5 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-[10px] active:scale-95 transition">
        Add Liquidity
      </button>
    </div>
  );
}

function FarmCard({ pool, onStake }) {
  const [staked, setStaked] = useState(false);
  const [amount, setAmount] = useState('');

  return (
    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex -space-x-1">
          <img src={pool.logo1} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
          <img src={pool.logo2} className="w-5 h-5 rounded-full border border-[#141420]" alt="" />
        </div>
        <div className="flex-1">
          <span className="text-white font-bold text-[11px]">{pool.pair}</span>
          <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded bg-success/20 text-success font-bold">FARM</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="text-center">
          <p className="text-[8px] text-gray-500">APR</p>
          <p className="text-neon font-bold text-[11px]">{pool.apr}%</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] text-gray-500">Your Stake</p>
          <p className="text-white font-semibold text-[11px]">{staked ? '1.0 LP' : '—'}</p>
        </div>
      </div>
      {staked ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] px-1">
            <span className="text-success">Earned: 0.00 SUSHI</span>
            <button className="text-neon font-bold">Claim</button>
          </div>
          <button className="w-full py-1.5 rounded-lg bg-error/10 border border-error/20 text-error font-semibold text-[10px] active:scale-95 transition">
            Unstake
          </button>
        </div>
      ) : (
        <button onClick={() => setStaked(true)} className="w-full py-1.5 rounded-lg bg-neon text-white font-semibold text-[10px] active:scale-95 transition">
          Stake LP
        </button>
      )}
    </div>
  );
}

function AddLiquidityModal({ pool, onClose }) {
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAdd = () => {
    if (!amount1 || !amount2) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          <div className="text-center py-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27C088" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <p className="text-white font-bold text-sm mb-1">Liquidity Added!</p>
            <p className="text-gray-500 text-[10px]">{amount1} {pool.token1} + {amount2} {pool.token2}</p>
            <button onClick={onClose} className="w-full mt-3 py-2 rounded-lg bg-white/10 text-white font-semibold text-xs active:scale-95 transition">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
        <h2 className="text-sm font-bold text-white text-center mb-3">Add Liquidity</h2>
        <p className="text-center text-gray-500 text-[10px] mb-3">{pool.pair}</p>
        <div className="space-y-2">
          <div>
            <label className="text-gray-500 text-[9px] block mb-0.5">{pool.token1}</label>
            <input value={amount1} onChange={(e) => setAmount1(e.target.value)} placeholder="0.0" inputMode="decimal" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50" />
          </div>
          <div>
            <label className="text-gray-500 text-[9px] block mb-0.5">{pool.token2}</label>
            <input value={amount2} onChange={(e) => setAmount2(e.target.value)} placeholder="0.0" inputMode="decimal" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50" />
          </div>
        </div>
        <button onClick={handleAdd} disabled={!amount1 || !amount2 || loading} className="w-full mt-3 py-2.5 rounded-xl bg-neon text-white font-bold text-xs disabled:opacity-40 active:scale-[0.98] transition">
          {loading ? 'Adding…' : 'Add Liquidity'}
        </button>
        <button onClick={onClose} className="w-full mt-1.5 py-2 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95 transition">Cancel</button>
      </div>
    </div>
  );
}

export default function Earn() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [tab, setTab] = useState('pools');
  const [addLiqPool, setAddLiqPool] = useState(null);

  const pools = POOLS[chainId] || POOLS[1];
  const farms = pools.filter((p) => p.apr > 8);

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
    <div className="w-full px-3 space-y-2.5">
      <div className="grid grid-cols-2 gap-1.5">
        {['pools', 'farms'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`py-2 rounded-lg font-semibold text-[11px] transition active:scale-95 ${tab === t ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
            {t === 'pools' ? 'Pools' : 'Farms'}
          </button>
        ))}
      </div>

      {tab === 'pools' && (
        <div className="space-y-1.5">
          {pools.map((pool) => <PoolCard key={pool.id} pool={pool} chainId={chainId} onAddLiquidity={setAddLiqPool} />)}
        </div>
      )}

      {tab === 'farms' && (
        <div className="space-y-1.5">
          {farms.length === 0 ? (
            <div className="glass-sushi rounded-2xl p-5 text-center">
              <p className="text-gray-500 text-xs">No farms available</p>
            </div>
          ) : (
            farms.map((pool) => <FarmCard key={pool.id} pool={pool} />)
          )}
        </div>
      )}

      {addLiqPool && <AddLiquidityModal pool={addLiqPool} onClose={() => setAddLiqPool(null)} />}
    </div>
  );
}

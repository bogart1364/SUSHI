import { useAccount, useBalance, useChainId } from 'wagmi';
import { useState, useEffect, useMemo } from 'react';
import { getTokenPrice } from '../services/dexScreener';

const BASE_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' },
  { symbol: 'cbETH', name: 'Coinbase Wrapped Staked ETH', address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
];

const ETH_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'SUSHI', name: 'SushiToken', address: '0x6B3595068778dd592e39A122f4f5a5cF09C90fE2', decimals: 18, logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png' },
];

const CHAIN_NAMES = { 1: 'Ethereum', 8453: 'Base', 4663: 'Robinhood' };

function TokenRow({ token, address, chainId, prices }) {
  const { data, isLoading } = useBalance({ address, token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address, chainId, watch: true });
  const balance = data ? Number(data.formatted) : 0;
  const price = prices[token.symbol] || 0;
  const usdValue = balance * price;

  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
      <img src={token.logo} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-[11px]">{token.symbol}</p>
        <p className="text-gray-600 text-[9px]">{token.name}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold text-[11px]">{isLoading ? '…' : balance.toFixed(token.decimals > 4 ? 4 : token.decimals)}</p>
        {price > 0 && <p className="text-gray-600 text-[9px]">${usdValue.toFixed(2)}</p>}
      </div>
    </div>
  );
}

function TxHistory({ address, chainId }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!address) return;
    setLoading(true);
    const api = chainId === 8453 ? 'https://api.basescan.org/api' : 'https://api.etherscan.io/api';
    const key = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    fetch(`${api}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc${key ? `&apikey=${key}` : ''}`)
      .then(r => r.json()).then(d => {
        if (d.status === '1' && d.result) setTxs(d.result.map(tx => ({ hash: tx.hash, value: (Number(tx.value) / 1e18).toFixed(4), ts: Number(tx.timeStamp), dir: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in' })));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [address, chainId]);

  if (loading) return <div className="space-y-1">{[1,2,3].map(i => <div key={i} className="h-10 bg-white/[0.03] rounded-xl animate-pulse" />)}</div>;
  if (!txs.length) return <p className="text-gray-600 text-[10px] text-center py-3">No transactions yet</p>;
  const ex = chainId === 8453 ? 'https://basescan.org' : 'https://etherscan.io';
  return (
    <div className="space-y-1">
      {txs.map(tx => (
        <a key={tx.hash} href={`${ex}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${tx.dir === 'in' ? 'bg-success/10' : 'bg-error/10'}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={tx.dir === 'in' ? '#27C088' : '#FF4D4F'} strokeWidth="2.5" strokeLinecap="round">
              {tx.dir === 'in' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[10px] font-medium">{tx.dir === 'in' ? 'Received' : 'Sent'}</p>
            <p className="text-gray-600 text-[8px] font-mono truncate">{tx.hash.slice(0, 10)}…</p>
          </div>
          <p className={`font-semibold text-[10px] ${tx.dir === 'in' ? 'text-success' : 'text-error'}`}>{tx.dir === 'in' ? '+' : '-'}{tx.value}</p>
        </a>
      ))}
    </div>
  );
}

export default function Portfolio({ onOpenSend, onOpenReceive, onOpenBuy }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ethBalance, isLoading } = useBalance({ address, watch: true });
  const tokens = chainId === 8453 ? BASE_TOKENS : ETH_TOKENS;

  const [prices, setPrices] = useState({});
  useEffect(() => {
    async function loadPrices() {
      try {
        const syms = ['ETH', 'SUSHI', 'USDC', 'USDT', 'WBTC', 'DAI', 'cbETH', 'WETH'];
        const entries = await Promise.allSettled(syms.map(async s => [s, await getTokenPrice(s)]));
        const p = {};
        entries.forEach(e => { if (e.status === 'fulfilled' && e.value[1] > 0) p[e.value[0]] = e.value[1]; });
        if (Object.keys(p).length) setPrices(prev => ({ ...prev, ...p }));
      } catch { /* silent */ }
    }
    loadPrices();
    const id = setInterval(loadPrices, 60_000);
    return () => clearInterval(id);
  }, []);

  const ethPrice = prices.ETH || 0;
  const totalUSD = useMemo(() => {
    const ethBal = ethBalance ? Number(ethBalance.formatted) : 0;
    return ethBal * ethPrice;
  }, [ethBalance, ethPrice]);

  if (!isConnected) return (
    <div className="w-full">
      <div className="glass-sushi rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
            <rect x="2" y="6" width="20" height="14" rx="3" />
            <path d="M2 10h20" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Connect wallet to view portfolio</p>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3">
      {/* Balance card */}
      <div className="glass-sushi rounded-2xl p-4">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">Total Balance · {CHAIN_NAMES[chainId]}</p>
        <p className="text-2xl font-bold text-white">{isLoading ? '…' : `$${totalUSD.toFixed(2)}`}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-500 text-[10px]">{ethBalance ? Number(ethBalance.formatted).toFixed(4) : '0'} ETH</p>
          {ethPrice > 0 && <span className="text-gray-600 text-[9px]">· ${ethPrice.toFixed(0)}/ETH</span>}
        </div>
        <p className="text-gray-600 text-[9px] font-mono mt-0.5">{address?.slice(0, 6)}…{address?.slice(-4)}</p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onOpenBuy} className="py-2.5 rounded-xl bg-neon text-white font-semibold text-[10px] active:scale-95 transition shadow-neon">Buy</button>
        <button onClick={onOpenSend} className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-[10px] active:scale-95 transition">Send</button>
        <button onClick={onOpenReceive} className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-[10px] active:scale-95 transition">Receive</button>
      </div>

      {/* Tokens */}
      <div>
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-1.5">Tokens</p>
        <div className="space-y-1">
          {tokens.map(t => <TokenRow key={`${chainId}-${t.symbol}`} token={t} address={address} chainId={chainId} prices={prices} />)}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-1.5">Transactions</p>
        <TxHistory address={address} chainId={chainId} />
      </div>
    </div>
  );
}

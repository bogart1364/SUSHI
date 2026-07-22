import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'SUSHI', name: 'SushiToken', address: '0x6B3595068778dd592e39A122f4f5a5cF09C90fE2', decimals: 18, logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png' },
];

function TokenBalance({ token, address }) {
  const { data, isLoading } = useBalance({ address, token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address, watch: true });
  const balance = data ? Number(data.formatted).toFixed(token.decimals > 4 ? 4 : token.decimals) : '0';
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
      <img src={token.logo} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-xs">{token.symbol}</p>
      </div>
      <p className="text-white font-semibold text-xs flex-shrink-0">
        {isLoading ? <span className="inline-block w-10 h-3 bg-white/10 rounded animate-pulse" /> : balance}
      </p>
    </div>
  );
}

function TxHistory({ address }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === '1' && d.result) {
          setTxs(d.result.map((tx) => ({
            hash: tx.hash, value: (Number(tx.value) / 1e18).toFixed(4), timestamp: Number(tx.timeStamp),
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
          })));
        } else setError('Could not load');
        setLoading(false);
      })
      .catch(() => { setError('Network error'); setLoading(false); });
  }, [address]);

  if (loading) return <div className="space-y-1.5">{[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />)}</div>;
  if (error) return <p className="text-error text-[10px] text-center py-3">{error}</p>;
  if (!txs.length) return <p className="text-gray-600 text-[11px] text-center py-3">No transactions yet</p>;

  return (
    <div className="space-y-1.5">
      {txs.map((tx) => (
        <a key={tx.hash} href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-success/20' : 'bg-error/20'}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={tx.type === 'in' ? '#27C088' : '#FF4D4F'} strokeWidth="2.5" strokeLinecap="round">
              {tx.type === 'in' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-medium">{tx.type === 'in' ? 'Received' : 'Sent'}</p>
            <p className="text-gray-600 text-[9px] font-mono truncate">{tx.hash.slice(0, 10)}…</p>
          </div>
          <p className={`font-semibold text-[11px] ${tx.type === 'in' ? 'text-success' : 'text-error'}`}>
            {tx.type === 'in' ? '+' : '-'}{tx.value}
          </p>
        </a>
      ))}
    </div>
  );
}

export default function Portfolio({ onOpenSend, onOpenReceive, onOpenBuy }) {
  const { address, isConnected } = useAccount();
  const { data: ethBalance, isLoading } = useBalance({ address, watch: true });

  if (!isConnected) {
    return (
      <div className="w-full px-3">
        <div className="glass-sushi rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm">Connect wallet to view portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-3 space-y-3">
      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-0.5">Total Balance</p>
        <p className="text-2xl font-bold text-white">
          {isLoading ? <span className="inline-block w-24 h-6 bg-white/10 rounded animate-pulse" /> : `${Number(ethBalance?.formatted || 0).toFixed(4)} ETH`}
        </p>
        <p className="text-gray-600 text-[10px] font-mono mt-0.5">{address?.slice(0, 6)}…{address?.slice(-4)}</p>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onOpenBuy} className="py-2 rounded-lg bg-neon text-white font-semibold text-[11px] active:scale-95 transition">Buy</button>
        <button onClick={onOpenSend} className="py-2 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-[11px] active:scale-95 transition">Send</button>
        <button onClick={onOpenReceive} className="py-2 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-[11px] active:scale-95 transition">Receive</button>
      </div>

      <div>
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-1.5">Tokens</p>
        <div className="space-y-1.5">
          {TOKENS.map((token) => <TokenBalance key={token.symbol} token={token} address={address} />)}
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-1.5">Transactions</p>
        <TxHistory address={address} />
      </div>
    </div>
  );
}

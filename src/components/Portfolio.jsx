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
  const { data, isLoading } = useBalance({
    address,
    token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address,
    watch: true,
  });
  const balance = data ? Number(data.formatted).toFixed(token.decimals > 4 ? 4 : token.decimals) : '0';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <img src={token.logo} alt={token.symbol} className="w-9 h-9 rounded-full" />
      <div className="flex-1">
        <p className="text-white font-semibold text-sm">{token.symbol}</p>
        <p className="text-gray-500 text-xs">{token.name}</p>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold text-sm">
          {isLoading ? <span className="inline-block w-12 h-4 bg-white/10 rounded animate-pulse" /> : balance}
        </p>
      </div>
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
    setError('');
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === '1' && d.result) {
          setTxs(d.result.map((tx) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (Number(tx.value) / 1e18).toFixed(4),
            timestamp: Number(tx.timeStamp),
            isError: tx.isError === '1',
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in',
          })));
        } else {
          setError('Could not load transactions');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, [address]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-error text-xs text-center py-4">{error}</p>;
  }

  if (txs.length === 0) {
    return <p className="text-gray-600 text-sm text-center py-4">No transactions yet</p>;
  }

  return (
    <div className="space-y-2">
      {txs.map((tx) => (
        <a
          key={tx.hash}
          href={`https://etherscan.io/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-success/20' : 'bg-error/20'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tx.type === 'in' ? '#27C088' : '#FF4D4F'} strokeWidth="2.5" strokeLinecap="round">
              {tx.type === 'in' ? <path d="M12 19V5M5 12l7-7 7 7" /> : <path d="M12 5v14M19 12l-7 7-7-7" />}
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{tx.type === 'in' ? 'Received' : 'Sent'} ETH</p>
            <p className="text-gray-500 text-[10px] font-mono">{tx.hash.slice(0, 10)}…</p>
          </div>
          <div className="text-right">
            <p className={`font-semibold text-sm ${tx.type === 'in' ? 'text-success' : 'text-error'}`}>
              {tx.type === 'in' ? '+' : '-'}{tx.value}
            </p>
            <p className="text-gray-600 text-[10px]">
              {new Date(tx.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
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
      <div className="max-w-md mx-auto w-full px-4 pt-2">
        <div className="glass-sushi rounded-2xl p-8 text-center">
          <svg className="mx-auto mb-3" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="12" width="40" height="28" rx="4" stroke="#FF007A" strokeWidth="2" fill="none" />
            <circle cx="36" cy="26" r="4" stroke="#FF007A" strokeWidth="1.5" fill="none" />
            <path d="M12 20h12" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-gray-400 text-sm">Connect your wallet to view portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="glass-sushi rounded-2xl p-5 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Balance</p>
        <p className="text-3xl font-bold text-white">
          {isLoading ? <span className="inline-block w-32 h-8 bg-white/10 rounded animate-pulse" /> : `${Number(ethBalance?.formatted || 0).toFixed(4)} ETH`}
        </p>
        <p className="text-gray-500 text-xs mt-1">{address?.slice(0, 6)}…{address?.slice(-4)}</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button onClick={onOpenBuy} className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition">Buy</button>
        <button onClick={onOpenSend} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">Send</button>
        <button onClick={onOpenReceive} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">Receive</button>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Tokens</p>
      <div className="space-y-2 mb-6">
        {TOKENS.map((token) => (
          <TokenBalance key={token.symbol} token={token} address={address} />
        ))}
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Recent Transactions</p>
      <TxHistory address={address} />
    </div>
  );
}

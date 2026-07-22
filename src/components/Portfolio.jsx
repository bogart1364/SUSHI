import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', color: '#627EEA' },
  { symbol: 'SUSHI', name: 'SushiToken', address: '0x6B3595068778dd592e39A122f4f5a5cF09C90fE2', decimals: 18, logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', color: '#FF007A' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', color: '#26A17B' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', color: '#2775CA' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png', color: '#F7931A' },
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
          {isLoading ? (
            <span className="inline-block w-12 h-4 bg-white/10 rounded animate-pulse" />
          ) : (
            balance
          )}
        </p>
        <p className="text-gray-600 text-xs">{token.symbol}</p>
      </div>
    </div>
  );
}

export default function Portfolio() {
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
          {isLoading ? (
            <span className="inline-block w-32 h-8 bg-white/10 rounded animate-pulse" />
          ) : (
            `${Number(ethBalance?.formatted || 0).toFixed(4)} ETH`
          )}
        </p>
        <p className="text-gray-500 text-xs mt-1">{address?.slice(0, 6)}…{address?.slice(-4)}</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition">
          Buy
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">
          Send
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">
          Receive
        </button>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Tokens</p>

      <div className="space-y-2">
        {TOKENS.map((token) => (
          <TokenBalance key={token.symbol} token={token} address={address} />
        ))}
      </div>
    </div>
  );
}

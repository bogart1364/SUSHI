import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSwapState } from '../hooks/useSwapState';
import { ROBINHOOD_CHAIN } from '../utils/robinhoodTokens';
import { formatPrice, formatChange, formatCompact } from '../utils/format';

export default function TokenDetail({ token, open, onClose, onTrade }) {
  const { isConnected } = useAccount();
  const swap = useSwapState();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!open || !token) return null;

  const handleTrade = () => {
    if (token.symbol === 'SUSHI' || token.type === 'stock' || token.type === 'etf') return;
    swap.setToToken({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      chainId: 4663,
      decimals: token.decimals,
      logo: token.logo,
    });
    onTrade?.();
    onClose();
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(token.address);
      setCopied(true);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = token.address;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
    }
  };

  const isStock = token.type === 'stock' || token.type === 'etf';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6 max-h-[85vh] overflow-y-auto scroll-area" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <img
            src={token.logo}
            alt={token.symbol}
            className="w-12 h-12 rounded-full"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-lg">{token.symbol}</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-neon/20 text-neon">
                Robinhood Chain
              </span>
            </div>
            <p className="text-gray-500 text-xs">{token.name}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-white font-bold text-2xl">{formatPrice(token.price)}</p>
          <p className={`text-sm font-semibold ${(token.change24h || 0) >= 0 ? 'text-success' : 'text-error'}`}>
            {formatChange(token.change24h)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Market Cap</p>
            <p className="text-white font-semibold text-xs">{formatCompact(token.marketCap)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">24h Volume</p>
            <p className="text-white font-semibold text-xs">{formatCompact(token.volume24h)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Chain</p>
            <p className="text-white font-semibold text-xs">Robinhood (4663)</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Type</p>
            <p className="text-white font-semibold text-xs capitalize">{token.type}</p>
          </div>
        </div>

        {token.address && token.address !== '0x0000000000000000000000000000000000000000' && (
          <div className="mb-4">
            <p className="text-gray-500 text-[10px] mb-2">Contract Address</p>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <p className="text-white text-[10px] font-mono flex-1 truncate">{token.address}</p>
              <button
                onClick={copyAddress}
                className="px-2 py-1 rounded text-[9px] font-medium bg-white/10 text-gray-400 hover:bg-white/20 transition"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-500 text-[10px] mb-2">About {token.name}</p>
          <p className="text-gray-400 text-[11px] leading-relaxed">{token.description}</p>
        </div>

        {isStock && (
          <div className="mb-4 p-3 rounded-lg bg-neon/5 border border-neon/20">
            <p className="text-neon text-[10px] font-medium mb-1">Tokenized Stock</p>
            <p className="text-gray-400 text-[9px] leading-relaxed">
              This is a tokenized debt security issued by Robinhood Assets (Jersey) Limited.
              It provides economic exposure to the underlying stock but does not confer voting rights
              or legal ownership. Available for trading 24/7 on Robinhood Chain.
            </p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-500 text-[10px] mb-2">Network Details</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Network</span>
              <span className="text-white text-[10px] font-medium">{ROBINHOOD_CHAIN.name}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Chain ID</span>
              <span className="text-white text-[10px] font-medium">{ROBINHOOD_CHAIN.chainId}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Gas Token</span>
              <span className="text-white text-[10px] font-medium">ETH</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">RPC</span>
              <span className="text-white text-[10px] font-medium truncate ml-2">rpc.mainnet.chain.robinhood.com</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {!isStock && token.symbol !== 'SUSHI' ? (
            <button
              onClick={handleTrade}
              className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm active:scale-[0.98] transition"
            >
              Trade {token.symbol} with SUSHI
            </button>
          ) : isStock ? (
            <a
              href={`https://wallet.robinhood.com/chain`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm text-center active:scale-[0.98] transition block"
            >
              Trade on Robinhood Wallet
            </a>
          ) : (
            <div className="w-full py-3 rounded-xl bg-white/5 text-gray-500 text-xs text-center font-medium">
              You are viewing SUSHI
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`${ROBINHOOD_CHAIN.blockExplorer}/address/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
            >
              Blockscout
            </a>
            {!isStock && token.coingeckoId ? (
              <a
                href={`https://www.coingecko.com/en/coins/${token.coingeckoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
              >
                CoinGecko
              </a>
            ) : (
              <a
                href={`https://robinhood.com/us/en/about/crypto/${token.symbol.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
              >
                Robinhood
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

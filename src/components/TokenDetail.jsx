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
    swap.setToToken({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      chainId: 4663,
      decimals: 18,
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

  const ageText = token.createdAt
    ? formatAge(Date.now() - token.createdAt)
    : null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6 max-h-[85vh] overflow-y-auto scroll-area" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Token header */}
        <div className="flex items-center gap-3 mb-4">
          {token.logo ? (
            <img
              src={token.logo}
              alt={token.symbol}
              className="w-12 h-12 rounded-full"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-lg text-gray-500">{token.symbol?.[0]}</span>
            </div>
          )}
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

        {/* Price + change */}
        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-white font-bold text-2xl">{formatPrice(token.price)}</p>
          <p className={`text-sm font-semibold ${(token.change24h ?? 0) >= 0 ? 'text-success' : 'text-error'}`}>
            {formatChange(token.change24h)}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Market Cap</p>
            <p className="text-white font-semibold text-xs">{formatCompact(token.marketCap)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Liquidity</p>
            <p className="text-white font-semibold text-xs">{formatCompact(token.liquidity)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">24h Volume</p>
            <p className="text-white font-semibold text-xs">{formatCompact(token.volume24h)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">24h Txns</p>
            <p className="text-white font-semibold text-xs">{(token.txns24h || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Contract address */}
        {token.address && (
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

        {/* Age */}
        {ageText && (
          <div className="mb-4 p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-[9px]">Age</span>
              <span className="text-white text-[10px] font-medium">{ageText}</span>
            </div>
          </div>
        )}

        {/* Network details */}
        <div className="mb-4">
          <p className="text-gray-500 text-[10px] mb-2">Network</p>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Chain</span>
              <span className="text-white text-[10px] font-medium">{ROBINHOOD_CHAIN.name}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Chain ID</span>
              <span className="text-white text-[10px] font-medium">{ROBINHOOD_CHAIN.chainId}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">DEX</span>
              <span className="text-white text-[10px] font-medium">SushiSwap V3</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
              <span className="text-gray-500 text-[9px]">Pair</span>
              <span className="text-white text-[10px] font-medium">{token.symbol}/{token.quoteSymbol}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleTrade}
            className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm active:scale-[0.98] transition"
          >
            Trade {token.symbol} with SUSHI
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={token.pairUrl || `${ROBINHOOD_CHAIN.blockExplorer}/address/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
            >
              DexScreener
            </a>
            <a
              href={`${ROBINHOOD_CHAIN.blockExplorer}/address/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
            >
              Blockscout
            </a>
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

function formatAge(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

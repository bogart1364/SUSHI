import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useSwapState } from '../hooks/useSwapState';
import { ROBINHOOD_CHAIN } from '../utils/robinhoodTokens';
import { formatPrice, formatChange, formatCompact } from '../utils/format';

function MiniSparkline({ change1h, change6h, change24h }) {
  const points = useMemo(() => {
    const vals = [
      change1h || 0,
      (change6h || 0) * 0.6,
      (change6h || 0) * 0.8,
      (change24h || 0) * 0.5,
      (change24h || 0) * 0.7,
      (change24h || 0) * 0.9,
      change24h || 0,
    ];
    const min = Math.min(...vals, 0);
    const max = Math.max(...vals, 0);
    const range = max - min || 1;
    return vals.map((v, i) => ({
      x: (i / (vals.length - 1)) * 100,
      y: 30 - ((v - min) / range) * 28,
    }));
  }, [change1h, change6h, change24h]);

  const isPositive = (change24h || 0) >= 0;
  const color = isPositive ? '#27C088' : '#FF4D4F';

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L 100 30 L 0 30 Z`;

  return (
    <div className="w-full h-[30px] relative">
      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-${isPositive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#spark-${isPositive ? 'up' : 'down'})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={points[points.length - 1]?.x} cy={points[points.length - 1]?.y} r="2" fill={color} />
      </svg>
    </div>
  );
}

function StatBox({ label, value, sub }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
      <p className="text-gray-600 text-[8px] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-white font-semibold text-[11px]">{value}</p>
      {sub && <p className="text-gray-600 text-[8px] mt-0.5">{sub}</p>}
    </div>
  );
}

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

  const isPositive = (token.change24h ?? 0) >= 0;
  const buyRatio = token.txns24h > 0 ? ((token.buys24h || 0) / token.txns24h * 100).toFixed(0) : '50';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#0e0e18] rounded-t-2xl border-t border-white/10 max-h-[90vh] overflow-y-auto scroll-area" style={{ maxWidth: 480 }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-4 pb-6">
          {/* Token header */}
          <div className="flex items-center gap-3 mb-3">
            {token.logo ? (
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-12 h-12 rounded-full ring-2 ring-white/10"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                <span className="text-lg text-gray-500">{token.symbol?.[0]}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg">{token.symbol}</h2>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon/20 text-neon">
                  RH Chain
                </span>
              </div>
              <p className="text-gray-500 text-[11px]">{token.name}</p>
            </div>
          </div>

          {/* Price section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-3">
              <p className="text-white font-bold text-2xl">{formatPrice(token.price)}</p>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                    {isPositive
                      ? <path d="M6 2l4 5H2z" fill="currentColor" />
                      : <path d="M6 10l4-5H2z" fill="currentColor" />
                    }
                  </svg>
                  {formatChange(token.change24h)}
                </span>
                <span className="text-gray-600 text-[9px]">24h</span>
              </div>
            </div>
            <p className="text-gray-600 text-[10px] mt-1">
              {formatPrice(token.priceNative)} ETH
            </p>
          </div>

          {/* Mini sparkline */}
          <div className="mb-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <MiniSparkline change1h={token.change1h} change6h={token.change6h} change24h={token.change24h} />
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-gray-600">1h</span>
              <span className="text-[8px] text-gray-600">6h</span>
              <span className="text-[8px] text-gray-600">24h</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <StatBox label="Market Cap" value={formatCompact(token.marketCap)} />
            <StatBox label="Liquidity" value={formatCompact(token.liquidity)} />
            <StatBox label="24h Volume" value={formatCompact(token.volume24h)} sub={`${formatCompact(token.volume1h)} last 1h`} />
            <StatBox label="24h Txns" value={(token.txns24h || 0).toLocaleString()} sub={`${buyRatio}% buys`} />
          </div>

          {/* Buy/Sell pressure */}
          {token.txns24h > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-success text-[9px] font-medium">{token.buys24h || 0} buys</span>
                <span className="text-error text-[9px] font-medium">{token.sells24h || 0} sells</span>
              </div>
              <div className="h-1.5 rounded-full bg-error/20 overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all"
                  style={{ width: `${buyRatio}%` }}
                />
              </div>
            </div>
          )}

          {/* Contract address */}
          {token.address && (
            <div className="mb-3">
              <p className="text-gray-600 text-[9px] mb-1.5 uppercase tracking-wider">Contract</p>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <p className="text-white text-[10px] font-mono flex-1 truncate">{token.address}</p>
                <button
                  onClick={copyAddress}
                  className="px-2 py-1 rounded text-[9px] font-medium bg-white/10 text-gray-400 hover:bg-white/20 transition flex-shrink-0"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Age */}
          {ageText && (
            <div className="mb-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-[9px]">Pair Age</span>
                <span className="text-white text-[10px] font-medium">{ageText}</span>
              </div>
            </div>
          )}

          {/* Network */}
          <div className="mb-4">
            <p className="text-gray-600 text-[9px] mb-1.5 uppercase tracking-wider">Network</p>
            <div className="space-y-1">
              {[
                ['Chain', ROBINHOOD_CHAIN.name],
                ['Chain ID', String(ROBINHOOD_CHAIN.chainId)],
                ['DEX', 'SushiSwap V3'],
                ['Pair', `${token.symbol}/${token.quoteSymbol}`],
                ['Fee Tier', '0.3% / 1%'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-2 rounded-lg bg-white/[0.02]">
                  <span className="text-gray-600 text-[9px]">{k}</span>
                  <span className="text-white text-[10px] font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleTrade}
              className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm shadow-neon active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Trade {token.symbol}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={token.pairUrl || `${ROBINHOOD_CHAIN.blockExplorer}/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 text-[10px] font-medium text-center active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                DexScreener
              </a>
              <a
                href={`${ROBINHOOD_CHAIN.blockExplorer}/address/${token.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 text-[10px] font-medium text-center active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                Blockscout
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-white/[0.03] text-gray-400 font-semibold text-xs active:scale-95 transition"
            >
              Close
            </button>
          </div>
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
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

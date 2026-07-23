import { useState, useMemo, useEffect, useRef } from 'react';
import { TOKEN_CATEGORIES } from '../utils/robinhoodTokens';
import { useMarketTokens } from '../hooks/useMarketTokens';
import { formatPrice, formatChange, formatCompact } from '../utils/format';

function TimeSince({ ts }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!ts) return null;
  const sec = Math.floor((now - ts) / 1000);
  if (sec < 5) return <span className="text-success">Live</span>;
  if (sec < 60) return <span className="text-gray-500">{sec}s ago</span>;
  return <span className="text-gray-500">{Math.floor(sec / 60)}m ago</span>;
}

function Countdown({ interval, onTick }) {
  const [remaining, setRemaining] = useState(interval / 1000);
  useEffect(() => {
    setRemaining(interval / 1000);
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          onTick?.();
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [interval, onTick]);

  const pct = (remaining / (interval / 1000)) * 100;
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-8 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-neon/40 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[8px] text-gray-600 font-mono">{remaining}s</span>
    </div>
  );
}

export default function Market({ onSelectToken }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('marketCap');
  const [showStats, setShowStats] = useState(false);

  const { loading, error, getFilteredTokens, refetch, forceRefresh, lastUpdated, refreshing, tokens } = useMarketTokens();

  const filteredTokens = useMemo(
    () => getFilteredTokens({ query: search, category: activeCategory, sortBy }),
    [search, activeCategory, sortBy, getFilteredTokens]
  );

  const stats = useMemo(() => {
    const totalMC = tokens.reduce((s, t) => s + (t.marketCap || 0), 0);
    const totalVol = tokens.reduce((s, t) => s + (t.volume24h || 0), 0);
    const totalLiq = tokens.reduce((s, t) => s + (t.liquidity || 0), 0);
    const gainers = tokens.filter(t => (t.change24h || 0) > 0).length;
    const losers = tokens.filter(t => (t.change24h || 0) < 0).length;
    return { totalMC, totalVol, totalLiq, gainers, losers, count: tokens.length };
  }, [tokens]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-bold text-white">Market</h1>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon/20 text-neon">Robinhood</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-[10px]">SushiSwap V3 · Chain 4663</p>
            <TimeSince ts={lastUpdated} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Countdown interval={30000} onTick={refetch} />
          <button
            onClick={forceRefresh}
            disabled={refreshing}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 active:scale-95 transition disabled:opacity-40"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={refreshing ? 'animate-spin' : ''}>
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats toggle */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="w-full mb-3 p-2.5 rounded-xl bg-white/5 border border-white/5 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div>
              <p className="text-[8px] text-gray-600 uppercase">MCap</p>
              <p className="text-white text-[10px] font-semibold">{formatCompact(stats.totalMC)}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-600 uppercase">24h Vol</p>
              <p className="text-white text-[10px] font-semibold">{formatCompact(stats.totalVol)}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-600 uppercase">Liq</p>
              <p className="text-white text-[10px] font-semibold">{formatCompact(stats.totalLiq)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px]">
              <span className="text-success">{stats.gainers}</span>
              <span className="text-gray-600"> / </span>
              <span className="text-error">{stats.losers}</span>
            </span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`text-gray-600 transition-transform ${showStats ? 'rotate-180' : ''}`}>
              <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        {showStats && (
          <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[8px] text-gray-600">Tokens</p>
              <p className="text-white text-[10px] font-semibold">{stats.count}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-600">Gainers</p>
              <p className="text-success text-[10px] font-semibold">{stats.gainers}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-600">Losers</p>
              <p className="text-error text-[10px] font-semibold">{stats.losers}</p>
            </div>
          </div>
        )}
      </button>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens..."
          className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50 placeholder-gray-600"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs hover:text-gray-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filters */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {TOKEN_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-neon/20 text-neon border border-neon/30'
                : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      <div className="flex gap-1 mb-3">
        {[
          { key: 'marketCap', label: 'MC' },
          { key: 'price', label: 'Price' },
          { key: 'change', label: '24h%' },
          { key: 'volume', label: 'Vol' },
          { key: 'liquidity', label: 'Liq' },
          { key: 'buys', label: 'Buys' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`px-2 py-1 rounded text-[9px] font-medium transition-all ${
              sortBy === s.key ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Column headers */}
      {!loading && filteredTokens.length > 0 && (
        <div className="flex items-center px-1 mb-1.5">
          <span className="flex-1 text-[8px] text-gray-600 uppercase">Token</span>
          <span className="w-16 text-right text-[8px] text-gray-600 uppercase">Price</span>
          <span className="w-14 text-right text-[8px] text-gray-600 uppercase">24h</span>
          <span className="w-14 text-right text-[8px] text-gray-600 uppercase">MCap</span>
        </div>
      )}

      {/* Loading state — skeleton */}
      {loading && (
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 animate-pulse"
            >
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="h-3 w-16 bg-white/10 rounded mb-1" />
                <div className="h-2.5 w-24 bg-white/5 rounded" />
              </div>
              <div className="text-right">
                <div className="h-3 w-14 bg-white/10 rounded mb-1 ml-auto" />
                <div className="h-2.5 w-10 bg-white/5 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center py-6">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D4F" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="text-error text-xs mb-1">Failed to load tokens</p>
          <p className="text-gray-600 text-[10px] mb-3">{error}</p>
          <button
            onClick={forceRefresh}
            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium active:scale-95 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Token list */}
      {!loading && (
        <div className="space-y-1">
          {filteredTokens.map((token, idx) => (
            <button
              key={token.pairAddress || token.address}
              onClick={() => onSelectToken(token)}
              className="w-full flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all active:scale-[0.98]"
            >
              <div className="relative flex-shrink-0">
                {token.logo ? (
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="w-9 h-9 rounded-full"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-gray-500">{token.symbol?.[0]}</span>
                  </div>
                )}
                {idx < 3 && (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-neon flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">{idx + 1}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-semibold text-[11px]">{token.symbol}</p>
                  <span className="text-gray-600 text-[8px]">/ {token.quoteSymbol}</span>
                </div>
                <p className="text-gray-600 text-[9px] truncate">{token.name}</p>
              </div>
              <div className="w-16 text-right">
                <p className="text-white font-semibold text-[11px]">
                  {formatPrice(token.price)}
                </p>
                <p className="text-gray-600 text-[8px]">
                  {formatCompact(token.volume24h)} vol
                </p>
              </div>
              <div className="w-14 text-right">
                <p className={`text-[11px] font-semibold ${(token.change24h ?? 0) >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatChange(token.change24h)}
                </p>
                <p className="text-gray-600 text-[8px]">
                  {formatCompact(token.marketCap)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTokens.length === 0 && !error && (
        <div className="text-center py-8">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-gray-500 text-xs">
            {search ? `No tokens matching "${search}"` : 'No tokens found'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-neon text-[10px] font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      {!loading && (
        <div className="mt-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.03]">
          <p className="text-gray-600 text-[9px] text-center">
            {filteredTokens.length} tokens · SushiSwap V3 · Robinhood Chain (4663) · DexScreener API
          </p>
        </div>
      )}
    </div>
  );
}

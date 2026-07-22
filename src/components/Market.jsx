import { useState, useMemo } from 'react';
import { TOKEN_CATEGORIES } from '../utils/robinhoodTokens';
import { useMarketTokens } from '../hooks/useMarketTokens';
import { formatPrice, formatChange, formatCompact } from '../utils/format';

export default function Market({ onSelectToken }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('marketCap');

  const { loading, error, getFilteredTokens, refetch } = useMarketTokens();

  const filteredTokens = useMemo(
    () => getFilteredTokens({ query: search, category: activeCategory, sortBy }),
    [search, activeCategory, sortBy, getFilteredTokens]
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-bold text-white">SushiSwap</h1>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon/20 text-neon">Robinhood</span>
        </div>
        <p className="text-gray-500 text-[10px]">Chain ID: 4663 · Live data from DexScreener</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens by name, symbol, or address..."
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50 placeholder-gray-600"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs"
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
      <div className="flex gap-2 mb-3">
        {[
          { key: 'marketCap', label: 'MC' },
          { key: 'price', label: 'Price' },
          { key: 'change', label: 'Change' },
          { key: 'volume', label: 'Vol' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`px-2 py-1 rounded text-[9px] font-medium transition-all ${
              sortBy === s.key ? 'bg-white/10 text-white' : 'text-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Loading state — skeleton */}
      {loading && (
        <div className="space-y-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <p className="text-error text-xs mb-2">Failed to load tokens</p>
          <p className="text-gray-600 text-[10px] mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium active:scale-95 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Token list */}
      {!loading && (
        <div className="space-y-1.5">
          {filteredTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => onSelectToken(token)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]"
            >
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-[10px] text-gray-500">{token.symbol[0]}</span>
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-semibold text-xs">{token.symbol}</p>
                  <span className="text-gray-600 text-[9px]">/ {token.quoteSymbol}</span>
                </div>
                <p className="text-gray-500 text-[10px] truncate">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-xs">
                  {formatPrice(token.price)}
                </p>
                <p
                  className={`text-[10px] font-medium ${
                    (token.change24h ?? 0) >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {formatChange(token.change24h)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTokens.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xs">
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
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-gray-500 text-[9px] text-center">
            {filteredTokens.length} tokens on SushiSwap · Robinhood Chain (ID: 4663)
          </p>
        </div>
      )}
    </div>
  );
}

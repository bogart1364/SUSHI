import { useState, useMemo } from 'react';
import { ROBINHOOD_TOKENS, TOKEN_CATEGORIES, filterRobinhoodTokens, getTokensByCategory } from '../utils/robinhoodTokens';
import { useRobinhoodPrices, useStockPrices } from '../hooks/useRobinhoodPrices';

function formatPrice(price) {
  if (!price && price !== 0) return '—';
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function formatChange(change) {
  if (!change && change !== 0) return '—';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function formatMarketCap(cap) {
  if (!cap) return '—';
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
}

export default function Market({ onSelectToken }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('marketCap');

  const { prices: cryptoPrices, loading: cryptoLoading } = useRobinhoodPrices();
  const { stockPrices, loading: stockLoading } = useStockPrices();

  const filteredTokens = useMemo(() => {
    let tokens = activeCategory === 'all'
      ? filterRobinhoodTokens(search)
      : getTokensByCategory(activeCategory).filter(t =>
          t.symbol.toLowerCase().includes(search.toLowerCase()) ||
          t.name.toLowerCase().includes(search.toLowerCase())
        );

    return [...tokens].sort((a, b) => {
      const priceA = getTokenData(a).price || 0;
      const priceB = getTokenData(b).price || 0;
      const capA = getTokenData(a).marketCap || 0;
      const capB = getTokenData(b).marketCap || 0;
      const changeA = Math.abs(getTokenData(a).change24h || 0);
      const changeB = Math.abs(getTokenData(b).change24h || 0);

      switch (sortBy) {
        case 'price': return priceB - priceA;
        case 'change': return changeB - changeA;
        case 'name': return a.name.localeCompare(b.name);
        default: return capB - capA;
      }
    });
  }, [search, activeCategory, sortBy, cryptoPrices, stockPrices]);

  function getTokenData(token) {
    if (token.coingeckoId && cryptoPrices[token.symbol]) {
      return cryptoPrices[token.symbol];
    }
    if (token.stockTicker && stockPrices[token.stockTicker]) {
      return stockPrices[token.stockTicker];
    }
    return { price: null, change24h: null, marketCap: null };
  }

  const isLoading = cryptoLoading || stockLoading;

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-bold text-white">Robinhood Chain</h1>
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon/20 text-neon">L2</span>
        </div>
        <p className="text-gray-500 text-[10px]">Chain ID: 4663 • ETH Gas • Real-time prices</p>
      </div>

      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens, stocks, ETFs..."
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50 placeholder-gray-600"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">✕</button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
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

      <div className="flex gap-2 mb-3">
        {[
          { key: 'marketCap', label: 'Market Cap' },
          { key: 'price', label: 'Price' },
          { key: 'change', label: 'Change' },
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

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-[10px]">Loading prices...</p>
        </div>
      )}

      <div className="space-y-1.5">
        {filteredTokens.map((token) => {
          const data = getTokenData(token);
          return (
            <button
              key={token.symbol}
              onClick={() => onSelectToken({ ...token, ...data })}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98]"
            >
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-semibold text-xs">{token.symbol}</p>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-white/10 text-gray-400">
                    {token.type === 'stock' ? 'STOCK' : token.type === 'etf' ? 'ETF' : token.type === 'meme' ? 'MEME' : token.category}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] truncate">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-xs">{formatPrice(data.price)}</p>
                <p className={`text-[10px] font-medium ${(data.change24h || 0) >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatChange(data.change24h)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xs">No tokens found</p>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-gray-500 text-[9px] text-center">
          {filteredTokens.length} tokens on Robinhood Chain (ID: 4663)
        </p>
      </div>
    </div>
  );
}

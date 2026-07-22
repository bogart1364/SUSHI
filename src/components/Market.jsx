import { useState, useMemo } from 'react';
import { ROBINHOOD_TOKENS, TOKEN_CATEGORIES, filterRobinhoodTokens, getTokensByCategory } from '../utils/robinhoodTokens';

function formatPrice(price) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function formatChange(change) {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export default function Market({ onSelectToken }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('marketCap');

  const filteredTokens = useMemo(() => {
    let tokens = activeCategory === 'all'
      ? filterRobinhoodTokens(search)
      : getTokensByCategory(activeCategory).filter(t =>
          t.symbol.toLowerCase().includes(search.toLowerCase()) ||
          t.name.toLowerCase().includes(search.toLowerCase())
        );

    return [...tokens].sort((a, b) => {
      switch (sortBy) {
        case 'price': return b.price - a.price;
        case 'change': return Math.abs(b.change24h) - Math.abs(a.change24h);
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [search, activeCategory, sortBy]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-white mb-1">Robinhood Market</h1>
        <p className="text-gray-500 text-[10px]">Trade tokens available on Robinhood with SUSHI</p>
      </div>

      <div className="relative mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tokens..."
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

      <div className="space-y-1.5">
        {filteredTokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => onSelectToken(token)}
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
                <span className="px-1.5 py-0.5 rounded text-[8px] font-medium bg-white/10 text-gray-400">{token.category}</span>
              </div>
              <p className="text-gray-500 text-[10px] truncate">{token.name}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-xs">{formatPrice(token.price)}</p>
              <p className={`text-[10px] font-medium ${token.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                {formatChange(token.change24h)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-xs">No tokens found</p>
        </div>
      )}

      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5">
        <p className="text-gray-500 text-[9px] text-center">
          {filteredTokens.length} tokens available on Robinhood • Trade with SUSHI
        </p>
      </div>
    </div>
  );
}

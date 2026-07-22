import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchRobinhoodTokens } from '../services/dexScreener';

// ─── Sorting comparators ──────────────────────────────────────────────────────

const comparators = {
  marketCap: (a, b) => (b.marketCap || 0) - (a.marketCap || 0),
  price: (a, b) => (b.price || 0) - (a.price || 0),
  change: (a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0),
  volume: (a, b) => (b.volume24h || 0) - (a.volume24h || 0),
  liquidity: (a, b) => (b.liquidity || 0) - (a.liquidity || 0),
  name: (a, b) => a.name.localeCompare(b.name),
  age: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
};

// ─── Category filter functions ────────────────────────────────────────────────

function filterByCategory(tokens, category) {
  if (category === 'all') return tokens;
  if (category === 'gainers') return tokens.filter(t => (t.change24h || 0) > 0);
  if (category === 'losers') return tokens.filter(t => (t.change24h || 0) < 0);
  if (category === 'new') {
    const oneDayAgo = Date.now() - 86400000;
    return tokens.filter(t => t.createdAt > oneDayAgo);
  }
  if (category === 'volume') return tokens.filter(t => (t.volume24h || 0) > 1000);
  if (category === 'liquidity') return tokens.filter(t => (t.liquidity || 0) > 1000);
  return tokens;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const POLL_INTERVAL = 30_000; // 30 seconds

export function useMarketTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchRobinhoodTokens();
      setTokens(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load tokens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  // Filter + sort helper
  const getFilteredTokens = useCallback(
    ({ query, category, sortBy }) => {
      let list = filterByCategory(tokens, category);

      // Search filter
      const q = (query || '').trim().toLowerCase();
      if (q) {
        list = list.filter(
          t =>
            t.symbol.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q) ||
            t.address.toLowerCase().includes(q)
        );
      }

      // Sort
      const cmp = comparators[sortBy] || comparators.marketCap;
      return [...list].sort(cmp);
    },
    [tokens]
  );

  return {
    tokens,
    loading,
    error,
    getFilteredTokens,
    refetch: load,
  };
}

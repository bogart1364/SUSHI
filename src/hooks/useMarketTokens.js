import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchRobinhoodTokens } from '../services/dexScreener';

// ─── Sorting comparators ──────────────────────────────────────────────────────

const comparators = {
  marketCap: (a, b) => (b.marketCap || 0) - (a.marketCap || 0),
  price: (a, b) => (b.price || 0) - (a.price || 0),
  change: (a, b) => (b.change24h || 0) - (a.change24h || 0),
  volume: (a, b) => (b.volume24h || 0) - (a.volume24h || 0),
  liquidity: (a, b) => (b.liquidity || 0) - (a.liquidity || 0),
  name: (a, b) => a.name.localeCompare(b.name),
  age: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
  buys: (a, b) => (b.buys24h || 0) - (a.buys24h || 0),
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

const POLL_INTERVAL = 30_000;

export function useMarketTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await fetchRobinhoodTokens();
      setTokens(data);
      setError(null);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message || 'Failed to load tokens');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => load(false), POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  const refetch = useCallback(() => {
    load(true);
  }, [load]);

  // Force refresh (clear cache + fetch)
  const forceRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      localStorage.removeItem('dexscreener_rh_sushi');
      const data = await fetchRobinhoodTokens();
      setTokens(data);
      setError(null);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err.message || 'Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getFilteredTokens = useCallback(
    ({ query, category, sortBy }) => {
      let list = filterByCategory(tokens, category);

      const q = (query || '').trim().toLowerCase();
      if (q) {
        list = list.filter(
          t =>
            t.symbol.toLowerCase().includes(q) ||
            t.name.toLowerCase().includes(q) ||
            t.address.toLowerCase().includes(q)
        );
      }

      const cmp = comparators[sortBy] || comparators.marketCap;
      return [...list].sort(cmp);
    },
    [tokens]
  );

  // Get price map for quick lookups
  const priceMap = useMemo(() => {
    const map = {};
    tokens.forEach(t => { map[t.symbol] = t.price; });
    return map;
  }, [tokens]);

  return {
    tokens,
    loading,
    error,
    lastUpdated,
    refreshing,
    getFilteredTokens,
    refetch,
    forceRefresh,
    priceMap,
  };
}

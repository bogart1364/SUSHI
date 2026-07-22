import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ROBINHOOD_TOKENS,
  filterRobinhoodTokens,
  getTokensByCategory,
} from '../utils/robinhoodTokens';
import { fetchAllPrices } from '../services/priceService';

// ─── Data normalization ───────────────────────────────────────────────────────
// Merges static registry data with live price data into a single MarketToken.

function normalizeToken(registryEntry, priceData) {
  return {
    // Registry fields
    symbol: registryEntry.symbol,
    name: registryEntry.name,
    address: registryEntry.address,
    chainId: registryEntry.chainId,
    decimals: registryEntry.decimals,
    type: registryEntry.type,
    logo: registryEntry.logo,
    description: registryEntry.description,
    coingeckoId: registryEntry.coingeckoId || null,
    stockTicker: registryEntry.stockTicker || null,

    // Live price fields (null if unavailable)
    price: priceData?.price ?? null,
    change24h: priceData?.change24h ?? null,
    marketCap: priceData?.marketCap ?? null,
    volume24h: priceData?.volume24h ?? null,

    // Extra stock data
    dayHigh: priceData?.dayHigh ?? null,
    dayLow: priceData?.dayLow ?? null,
    previousClose: priceData?.previousClose ?? null,
  };
}

// ─── Sorting comparators ──────────────────────────────────────────────────────

const comparators = {
  marketCap: (a, b) => (b.marketCap || 0) - (a.marketCap || 0),
  price: (a, b) => (b.price || 0) - (a.price || 0),
  change: (a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0),
  name: (a, b) => a.name.localeCompare(b.name),
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const POLL_INTERVAL = 60_000;

export function useMarketTokens() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchAllPrices(ROBINHOOD_TOKENS);
      setPrices(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  // Normalized token list with live prices merged in
  const tokens = useMemo(() => {
    return ROBINHOOD_TOKENS.map(t => normalizeToken(t, prices[t.symbol]));
  }, [prices]);

  // Filter + sort helper
  const getFilteredTokens = useCallback(
    ({ query, category, sortBy }) => {
      let list =
        category === 'all'
          ? filterRobinhoodTokens(query)
          : getTokensByCategory(category).filter(
              t =>
                t.symbol.toLowerCase().includes((query || '').toLowerCase()) ||
                t.name.toLowerCase().includes((query || '').toLowerCase())
            );

      // Normalize with current prices
      const normalized = list.map(t => normalizeToken(t, prices[t.symbol]));

      // Sort
      const cmp = comparators[sortBy] || comparators.marketCap;
      return [...normalized].sort(cmp);
    },
    [prices]
  );

  return {
    tokens,
    loading,
    error,
    getFilteredTokens,
    refetch: load,
  };
}

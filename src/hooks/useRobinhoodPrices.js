import { useState, useEffect, useCallback } from 'react';
import { getCryptoTokens, getStockTokens } from '../utils/robinhoodTokens';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_KEY = 'robinhood_prices';
const CACHE_DURATION = 60000;

function getCachedPrices() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) return data;
    }
  } catch {}
  return null;
}

function setCachedPrices(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function useRobinhoodPrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async () => {
    const cached = getCachedPrices();
    if (cached) {
      setPrices(cached);
      setLoading(false);
      return;
    }

    try {
      const cryptoTokens = getCryptoTokens();
      const ids = cryptoTokens.map(t => t.coingeckoId).join(',');

      if (!ids) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );

      if (!response.ok) throw new Error('Failed to fetch prices');

      const data = await response.json();
      const priceMap = {};

      cryptoTokens.forEach(token => {
        const coinData = data[token.coingeckoId];
        if (coinData) {
          priceMap[token.symbol] = {
            price: coinData.usd,
            change24h: coinData.usd_24h_change || 0,
            marketCap: coinData.usd_market_cap,
            volume24h: coinData.usd_24h_vol,
          };
        }
      });

      setPrices(priceMap);
      setCachedPrices(priceMap);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getTokenPrice = useCallback((symbol) => {
    return prices[symbol] || null;
  }, [prices]);

  return { prices, loading, error, getTokenPrice, refetch: fetchPrices };
}

export function useStockPrices() {
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const stockTokens = getStockTokens();
        const tickers = stockTokens.map(t => t.stockTicker).join(',');

        const response = await fetch(
          `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers}`
        );

        if (!response.ok) throw new Error('Failed to fetch stock prices');

        const data = await response.json();
        const priceMap = {};

        data.quoteResponse.result.forEach(quote => {
          priceMap[quote.symbol] = {
            price: quote.regularMarketPrice,
            change24h: quote.regularMarketChangePercent || 0,
            marketCap: quote.marketCap,
            volume24h: quote.regularMarketVolume,
            previousClose: quote.regularMarketPreviousClose,
            dayHigh: quote.regularMarketDayHigh,
            dayLow: quote.regularMarketDayLow,
          };
        });

        setStockPrices(priceMap);
      } catch {
        const stockTokens = getStockTokens();
        const mockPrices = {};
        stockTokens.forEach(token => {
          mockPrices[token.stockTicker] = {
            price: 0,
            change24h: 0,
            marketCap: 0,
            volume24h: 0,
          };
        });
        setStockPrices(mockPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 300000);
    return () => clearInterval(interval);
  }, []);

  const getStockPrice = useCallback((ticker) => {
    return stockPrices[ticker] || null;
  }, [stockPrices]);

  return { stockPrices, loading, getStockPrice };
}

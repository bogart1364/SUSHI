// ──────────────────────────────────────────────────────────────────────────────
// Price Service Layer
//
// Fetches live prices for Robinhood Chain tokens from external APIs.
// Each adapter normalizes its source into a common PriceData shape.
//
// PriceData shape:
//   { price: number|null, change24h: number|null, marketCap: number|null, volume24h: number|null }
//
// Missing API keys or failed fetches return null values — never fake data.
// ──────────────────────────────────────────────────────────────────────────────

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const CACHE_PREFIX = 'rh_price_';
const CACHE_TTL = 60_000; // 60 seconds

// ─── Cache helpers ────────────────────────────────────────────────────────────

function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota exceeded — ignore */ }
}

// ─── CoinGecko adapter ────────────────────────────────────────────────────────
// Fetches crypto prices. Free tier: ~10-30 req/min, no key needed.
// Returns map keyed by coingeckoId.

export async function fetchCryptoPrices(coingeckoIds) {
  if (!coingeckoIds.length) return {};

  const cacheKey = `cg_${coingeckoIds.sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const ids = coingeckoIds.join(',');
    const res = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );

    if (!res.ok) {
      // Rate limited or error — return empty, don't throw
      return {};
    }

    const data = await res.json();
    const result = {};

    for (const id of coingeckoIds) {
      const coin = data[id];
      if (coin) {
        result[id] = {
          price: coin.usd ?? null,
          change24h: coin.usd_24h_change ?? null,
          marketCap: coin.usd_market_cap ?? null,
          volume24h: coin.usd_24h_vol ?? null,
        };
      }
    }

    setCache(cacheKey, result);
    return result;
  } catch {
    return {};
  }
}

// ─── Yahoo Finance adapter ────────────────────────────────────────────────────
// Fetches US stock/ETF prices. Unofficial API — may be blocked or rate-limited.
// Returns map keyed by stock ticker.

export async function fetchStockPrices(tickers) {
  if (!tickers.length) return {};

  const cacheKey = `yf_${tickers.sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const symbols = tickers.join(',');
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
    );

    if (!res.ok) return {};

    const data = await res.json();
    const result = {};

    for (const quote of data.quoteResponse?.result || []) {
      result[quote.symbol] = {
        price: quote.regularMarketPrice ?? null,
        change24h: quote.regularMarketChangePercent ?? null,
        marketCap: quote.marketCap ?? null,
        volume24h: quote.regularMarketVolume ?? null,
        dayHigh: quote.regularMarketDayHigh ?? null,
        dayLow: quote.regularMarketDayLow ?? null,
        previousClose: quote.regularMarketPreviousClose ?? null,
      };
    }

    setCache(cacheKey, result);
    return result;
  } catch {
    return {};
  }
}

// ─── Unified fetcher ──────────────────────────────────────────────────────────
// Takes token registry entries, fetches prices from appropriate adapters,
// and returns a merged map keyed by token symbol.

export async function fetchAllPrices(tokens) {
  const cryptoTokens = tokens.filter(t => t.coingeckoId);
  const stockTokens = tokens.filter(t => t.stockTicker);

  const [cryptoPrices, stockPrices] = await Promise.all([
    fetchCryptoPrices(cryptoTokens.map(t => t.coingeckoId)),
    fetchStockPrices(stockTokens.map(t => t.stockTicker)),
  ]);

  const merged = {};

  for (const token of tokens) {
    if (token.coingeckoId && cryptoPrices[token.coingeckoId]) {
      merged[token.symbol] = cryptoPrices[token.coingeckoId];
    } else if (token.stockTicker && stockPrices[token.stockTicker]) {
      merged[token.symbol] = stockPrices[token.stockTicker];
    }
    // If no price data available, token is absent from merged map
  }

  return merged;
}

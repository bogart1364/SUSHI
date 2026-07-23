// ──────────────────────────────────────────────────────────────────────────────
// DexScreener Service
//
// Fetches real token pairs from SushiSwap on Robinhood Chain via DexScreener API.
// All data comes from https://dexscreener.com/robinhood/sushiswap
//
// API docs: https://docs.dexscreener.com/api/reference
// Rate limits: 300 req/min (free tier)
// ──────────────────────────────────────────────────────────────────────────────

import { PAIR_ADDRESSES } from '../utils/robinhoodTokens';

const DEXSCREENER_API = 'https://api.dexscreener.com';
const ROBINHOOD_CHAIN = 'robinhood';
const SUSHISWAP_DEX = 'sushiswap';
const CACHE_KEY = 'dexscreener_rh_sushi';
const CACHE_TTL = 30_000;

// ─── Cache helpers ────────────────────────────────────────────────────────────

function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* ignore */ }
}

// ─── Fetch pairs from DexScreener ─────────────────────────────────────────────

async function fetchPairsBatch(addresses) {
  const csv = addresses.join(',');
  const res = await fetch(`${DEXSCREENER_API}/latest/dex/pairs/robinhood/${csv}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.pairs || []).filter(
    p => p.chainId === ROBINHOOD_CHAIN && p.dexId === SUSHISWAP_DEX
  );
}

// ─── Normalize DexScreener pair → MarketToken ─────────────────────────────────

function normalizePair(pair) {
  const base = pair.baseToken || {};
  const quote = pair.quoteToken || {};
  const price = parseFloat(pair.priceUsd) || 0;
  const change24h = pair.priceChange?.h24 ?? null;
  const change1h = pair.priceChange?.h1 ?? null;
  const change6h = pair.priceChange?.h6 ?? null;
  const marketCap = pair.marketCap || pair.fdv || 0;
  const volume24h = pair.volume?.h24 ?? 0;
  const volume1h = pair.volume?.h1 ?? 0;
  const liquidity = pair.liquidity?.usd ?? 0;
  const txns24h = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0);
  const buys24h = pair.txns?.h24?.buys || 0;
  const sells24h = pair.txns?.h24?.sells || 0;

  return {
    symbol: base.symbol || '???',
    name: base.name || base.symbol || 'Unknown',
    address: base.address || '',
    chainId: 4663,
    decimals: 18,
    price,
    priceNative: parseFloat(pair.priceNative) || 0,
    change24h,
    change1h,
    change6h,
    marketCap,
    volume24h,
    volume1h,
    liquidity,
    txns24h,
    buys24h,
    sells24h,
    pairAddress: pair.pairAddress || '',
    quoteSymbol: quote.symbol || 'WETH',
    logo: pair.info?.imageUrl || null,
    header: pair.info?.header || null,
    pairUrl: pair.url || '',
    createdAt: pair.pairCreatedAt || 0,
    websites: pair.info?.websites || [],
    socials: pair.info?.socials || [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch all SushiSwap tokens on Robinhood Chain from DexScreener.
 * Returns normalized MarketToken[] sorted by market cap descending.
 */
export async function fetchRobinhoodTokens() {
  const cached = getCache();
  if (cached) return cached;

  try {
    const batches = [];
    for (let i = 0; i < PAIR_ADDRESSES.length; i += 10) {
      batches.push(PAIR_ADDRESSES.slice(i, i + 10));
    }

    const allPairs = [];
    for (let i = 0; i < batches.length; i++) {
      const pairs = await fetchPairsBatch(batches[i]);
      allPairs.push(...pairs);
      if (i < batches.length - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    const tokens = allPairs
      .map(normalizePair)
      .filter(t => t.address && t.symbol)
      .sort((a, b) => b.marketCap - a.marketCap);

    setCache(tokens);
    return tokens;
  } catch {
    return getCache() || [];
  }
}

/**
 * Get a single token by address from cached data.
 */
export async function getTokenByAddress(address) {
  const tokens = await fetchRobinhoodTokens();
  return tokens.find(t => t.address.toLowerCase() === address.toLowerCase()) || null;
}

/**
 * Get WETH price in USD from cached data.
 */
export async function getWETHPrice() {
  const tokens = await fetchRobinhoodTokens();
  const wethPair = tokens.find(t => t.symbol === 'WETH' && t.quoteSymbol === 'USDG');
  return wethPair?.price || 0;
}

/**
 * Get price for a token symbol.
 */
export async function getTokenPrice(symbol) {
  const tokens = await fetchRobinhoodTokens();
  const token = tokens.find(t => t.symbol.toUpperCase() === symbol.toUpperCase());
  return token?.price || 0;
}

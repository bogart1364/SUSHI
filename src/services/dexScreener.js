// ──────────────────────────────────────────────────────────────────────────────
// DexScreener Service
//
// Fetches real token pairs from SushiSwap on Robinhood Chain via DexScreener API.
// All data comes from https://dexscreener.com/robinhood/sushiswap
//
// API docs: https://docs.dexscreener.com/api/reference
// Rate limits: 300 req/min (free tier)
// ──────────────────────────────────────────────────────────────────────────────

const DEXSCREENER_API = 'https://api.dexscreener.com';
const ROBINHOOD_CHAIN = 'robinhood';
const SUSHISWAP_DEX = 'sushiswap';
const CACHE_KEY = 'dexscreener_rh_sushi';
const CACHE_TTL = 30_000; // 30 seconds — prices change fast

// ─── Known pair addresses from DexScreener (SushiSwap on Robinhood) ───────────
// These are the pair contract addresses visible on dexscreener.com/robinhood/sushiswap
// We fetch in batches of 10 (API limit per request).

const PAIR_ADDRESSES = [
  '0xEb5b094eA5024902968422336180eaF64CfbfcB2', // HBNK/WETH
  '0xf3874d01082bf62023166A7585Fed0d902b2C971', // YAM/WETH
  '0xab730D68a5Ee19E54bEb62f6d661D7D3e68a1486', // FROTH/WETH
  '0x5b3B3c29e7647c35623679DfF881145B21E3c522', // LUCKY/WETH
  '0x7dC033904f62a335dB8981Ce94dB03Ba67a7113C', // KEK/WETH
  '0xBDF204827660Da5263Ea2103B11c5AA564F7d95c', // Nomi/WETH
  '0x057e8269Ab1AEcc03045d8f1f0E9857f3a6bBed0', // Meowshi/WETH
  '0x30085C0e3973ceBcF3D54714d8c3d5bddBc59bEE', // SushiSZN/WETH
  '0xD47F1932da6E0d71a0A05dD3670905525f43332e', // CAESAR/WETH
  '0x42A72e59c00eb787eA11f42b942EEb9691AA9D07', // SUSHIDOG/WETH
  '0xd9eec4ac4ead352d3da6974db1b517103ce2eded', // KATSU/WETH
  '0xda3247adb6af1f25163708c871f66e702b0d8300', // SABI/WETH
  '0x978a4152bd016b8c268c70b382df97ba625617cc', // ASTEROID/WETH
  '0xd6477607cc76c6cc3dd808bb6d50748de68e5a4d', // Decidueye/WETH
  '0xe586f71fde88b11329782c0a55494d35d4a2a19a', // BENTO/WETH
  '0x641a7820aff738ef973012234f477266850a2bcf', // Sushimi/WETH
  '0x68546e1f5180387ce8cf8cc5673622880880825f', // GEMUSUTOPPU/WETH
  '0xb37f2e5e2ee835ab9a23283b17f12a25ac5c43ea', // RevSUSHI/WETH
  '0x6e3263f4447066de83a356053b5852fa8408bb5a', // FOMOZA/WETH
  '0x0FA4c2caa673Ee94D700D0DdEa662080548e4E27', // SUSHICAT/WETH
  '0xe794b4b550c0dc4eda55cfa9a1690e0b8233c9b1', // TOFU/WETH
  '0xc5a01c57b2851202dcf8507a0f2bd08a8025e2c8', // USDG/WETH
  '0x7fff70d5748390779e573a1995952c3dddf57a9c', // SUSHI/WETH
];

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
  const marketCap = pair.marketCap || pair.fdv || 0;
  const volume24h = pair.volume?.h24 ?? 0;
  const liquidity = pair.liquidity?.usd ?? 0;
  const txns24h = (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0);

  return {
    symbol: base.symbol || '???',
    name: base.name || base.symbol || 'Unknown',
    address: base.address || '',
    chainId: 4663,
    decimals: 18,
    price,
    change24h,
    marketCap,
    volume24h,
    liquidity,
    txns24h,
    pairAddress: pair.pairAddress || '',
    quoteSymbol: quote.symbol || 'WETH',
    logo: pair.info?.imageUrl || null,
    pairUrl: pair.url || '',
    createdAt: pair.pairCreatedAt || 0,
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
    // Fetch in batches of 10 (DexScreener API limit)
    const batches = [];
    for (let i = 0; i < PAIR_ADDRESSES.length; i += 10) {
      batches.push(PAIR_ADDRESSES.slice(i, i + 10));
    }

    const allPairs = [];
    for (const batch of batches) {
      const pairs = await fetchPairsBatch(batch);
      allPairs.push(...pairs);
      // Small delay between batches to respect rate limits
      if (batches.indexOf(batch) < batches.length - 1) {
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

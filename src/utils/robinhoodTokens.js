// ──────────────────────────────────────────────────────────────────────────────
// Robinhood Chain Configuration
//
// Chain ID: 4663 (Ethereum L2, Arbitrum Orbit stack)
// RPC: https://rpc.mainnet.chain.robinhood.com
// Explorer: https://robinhoodchain.blockscout.com
//
// Token data is fetched live from DexScreener API:
//   https://dexscreener.com/robinhood/sushiswap
//   https://api.dexscreener.com/latest/dex/pairs/robinhood/{pairAddresses}
//
// This file only contains chain config and category definitions.
// Token list → src/services/dexScreener.js
// Token fetching → src/hooks/useMarketTokens.js
// ──────────────────────────────────────────────────────────────────────────────

export const ROBINHOOD_CHAIN = {
  chainId: 4663,
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  blockExplorer: 'https://robinhoodchain.blockscout.com',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

// ─── Category definitions for the filter bar ──────────────────────────────────

export const TOKEN_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'gainers', name: 'Gainers', icon: '📈' },
  { id: 'losers', name: 'Losers', icon: '📉' },
  { id: 'new', name: 'New', icon: '🆕' },
  { id: 'volume', name: 'Top Volume', icon: '📊' },
  { id: 'liquidity', name: 'Top Liquidity', icon: '💧' },
];

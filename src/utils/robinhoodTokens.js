// ──────────────────────────────────────────────────────────────────────────────
// Robinhood Chain Token Registry
// Chain ID: 4663 (Ethereum L2, Arbitrum Orbit stack)
// RPC: https://rpc.mainnet.chain.robinhood.com
// Explorer: https://robinhoodchain.blockscout.com
//
// Data sources:
//   - WETH, USDG: https://docs.robinhood.com/chain/contracts/
//   - Stock Tokens: https://sqd.dev/learn/robinhood-tokenized-stocks/
//   - CASHCAT: https://robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4
//
// All addresses below are verified against official documentation or Blockscout.
// Tokens marked TODO need their on-chain addresses discovered via Blockscout
// or the Robinhood docs token table (which loads dynamically).
// ──────────────────────────────────────────────────────────────────────────────

export const ROBINHOOD_CHAIN = {
  chainId: 4663,
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  blockExplorer: 'https://robinhoodchain.blockscout.com',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

/**
 * Token type enum.
 * 'crypto'     – native/wrapped crypto (ETH, WETH)
 * 'stablecoin' – USD-pegged stablecoins (USDG)
 * 'stock'      – tokenized equities issued by Robinhood
 * 'etf'        – tokenized ETFs issued by Robinhood
 * 'defi'       – DeFi governance/utility tokens
 * 'meme'       – community memecoins
 */
export const TokenType = {
  CRYPTO: 'crypto',
  STABLECOIN: 'stablecoin',
  STOCK: 'stock',
  ETF: 'etf',
  DEFI: 'defi',
  MEME: 'meme',
};

// ─── Verified tokens (addresses confirmed on Blockscout / official docs) ─────

export const ROBINHOOD_TOKENS = [
  // ── Crypto / Stablecoin ──────────────────────────────────────────────────
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73',
    chainId: 4663,
    decimals: 18,
    type: TokenType.CRYPTO,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    coingeckoId: 'wrapped-ether',
    description: 'Wrapped Ether on Robinhood Chain. ETH is the native gas token used for all transactions.',
    // Verified: docs.robinhood.com/chain/contracts/
  },
  {
    symbol: 'USDG',
    name: 'Global Dollar',
    address: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STABLECOIN,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    coingeckoId: 'usdg',
    description: 'USDG is a US dollar-backed stablecoin issued by a Paxos-led consortium. Used in Robinhood Earn for lending at ~7% APY.',
    // Verified: docs.robinhood.com/chain/contracts/
  },

  // ── Tokenized Stock Tokens (Robinhood-issued debt securities) ────────────
  {
    symbol: 'TSLA',
    name: 'Tesla',
    address: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/tesla.com',
    stockTicker: 'TSLA',
    description: 'Tokenized Tesla stock. Provides economic exposure to TSLA shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    address: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/nvidia.com',
    stockTicker: 'NVDA',
    description: 'Tokenized NVIDIA stock. Provides economic exposure to NVDA shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    address: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/apple.com',
    stockTicker: 'AAPL',
    description: 'Tokenized Apple stock. Provides economic exposure to AAPL shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    address: '0xe93237C50D904957Cf27E7B1133b510C669c2e74',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/microsoft.com',
    stockTicker: 'MSFT',
    description: 'Tokenized Microsoft stock. Provides economic exposure to MSFT shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'AMZN',
    name: 'Amazon',
    address: '0x12f190a9F9d7D37a250758b26824B97CE941bF54',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/amazon.com',
    stockTicker: 'AMZN',
    description: 'Tokenized Amazon stock. Provides economic exposure to AMZN shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet',
    address: '0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/google.com',
    stockTicker: 'GOOGL',
    description: 'Tokenized Alphabet (Google) stock. Provides economic exposure to GOOGL shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    address: '0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/meta.com',
    stockTicker: 'META',
    description: 'Tokenized Meta Platforms stock. Provides economic exposure to META shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'COIN',
    name: 'Coinbase',
    address: '0x6330D8C3178a418788dF01a47479c0ce7CCF450b',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/coinbase.com',
    stockTicker: 'COIN',
    description: 'Tokenized Coinbase stock. Provides economic exposure to COIN shares. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'SPCX',
    name: 'SpaceX',
    address: '0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa',
    chainId: 4663,
    decimals: 18,
    type: TokenType.STOCK,
    logo: 'https://logo.clearbit.com/spacex.com',
    stockTicker: 'SPCX',
    description: 'Tokenized SpaceX (private company). Provides economic exposure to SpaceX. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },

  // ── Tokenized ETFs ───────────────────────────────────────────────────────
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    address: '0x117cc2133c37B721F49dE2A7a74833232B3B4C0C',
    chainId: 4663,
    decimals: 18,
    type: TokenType.ETF,
    logo: 'https://logo.clearbit.com/spdr.com',
    stockTicker: 'SPY',
    description: 'Tokenized SPDR S&P 500 ETF. Tracks the S&P 500 index. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ',
    address: '0xD5f3879160bc7c32ebb4dC785F8a4F505888de68',
    chainId: 4663,
    decimals: 18,
    type: TokenType.ETF,
    logo: 'https://logo.clearbit.com/invesco.com',
    stockTicker: 'QQQ',
    description: 'Tokenized Invesco QQQ Trust. Tracks the Nasdaq-100 index. 24/7 trading on Robinhood Chain.',
    // Verified: sqd.dev/learn/robinhood-tokenized-stocks/
  },

  // ── Meme Coins (community-deployed, no Robinhood affiliation) ────────────
  {
    symbol: 'CASHCAT',
    name: 'Cash Cat',
    address: '0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    chainId: 4663,
    decimals: 18,
    type: TokenType.MEME,
    logo: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    coingeckoId: 'cash-cat-robinhood',
    description: 'Community memecoin on Robinhood Chain. Named after Robinhood\'s former mascot. No affiliation with Robinhood.',
    // Verified: robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4
  },

  // ── DeFi tokens (known to operate on Robinhood Chain, addresses TODO) ────
  // These protocols are confirmed on Robinhood Chain per official docs and news,
  // but their on-chain token contract addresses on chain 4663 need to be
  // discovered via Blockscout token list or the Robinhood docs token table.
  //
  // TODO: Look up addresses from https://robinhoodchain.blockscout.com/tokens
  //       or https://docs.robinhood.com/chain/contracts/ (dynamic table)
  //
  // {
  //   symbol: 'UNI',
  //   name: 'Uniswap',
  //   address: 'TODO',  // Primary DEX on Robinhood Chain
  //   chainId: 4663,
  //   decimals: 18,
  //   type: TokenType.DEFI,
  //   logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  //   coingeckoId: 'uniswap',
  //   description: 'Uniswap is the primary DEX on Robinhood Chain.',
  // },
  // {
  //   symbol: 'ARB',
  //   name: 'Arbitrum',
  //   address: 'TODO',  // L2 technology powering Robinhood Chain
  //   chainId: 4663,
  //   decimals: 18,
  //   type: TokenType.DEFI,
  //   logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
  //   coingeckoId: 'arbitrum',
  //   description: 'Arbitrum is the L2 technology powering Robinhood Chain.',
  // },
  // {
  //   symbol: 'MORPHO',
  //   name: 'Morpho',
  //   address: 'TODO',  // Powers Robinhood Earn lending
  //   chainId: 4663,
  //   decimals: 18,
  //   type: TokenType.DEFI,
  //   logo: 'https://cryptologos.cc/logos/morpho-logo.png',
  //   coingeckoId: 'morpho',
  //   description: 'Morpho powers Robinhood Earn lending (~$194M TVL).',
  // },
  // {
  //   symbol: 'LIT',
  //   name: 'Lighter',
  //   address: 'TODO',  // Perpetuals exchange on Robinhood Chain
  //   chainId: 4663,
  //   decimals: 18,
  //   type: TokenType.DEFI,
  //   logo: 'https://cryptologos.cc/logos/lighter-lit-logo.png',
  //   coingeckoId: 'lighter',
  //   description: 'Lighter is the perpetual futures exchange on Robinhood Chain.',
  // },
];

// ─── Category definitions for the filter bar ──────────────────────────────────

export const TOKEN_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: TokenType.STOCK, name: 'Stocks', icon: '📈' },
  { id: TokenType.ETF, name: 'ETFs', icon: '📊' },
  { id: TokenType.CRYPTO, name: 'Crypto', icon: '₿' },
  { id: TokenType.STABLECOIN, name: 'Stablecoins', icon: '💵' },
  { id: TokenType.MEME, name: 'Meme', icon: '🐸' },
  // DeFi category shown but empty until token addresses are added
  { id: TokenType.DEFI, name: 'DeFi', icon: '🏦' },
];

// ─── Registry helpers ─────────────────────────────────────────────────────────

export function getTokenBySymbol(symbol) {
  return ROBINHOOD_TOKENS.find(t => t.symbol === symbol);
}

export function filterRobinhoodTokens(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return ROBINHOOD_TOKENS;
  return ROBINHOOD_TOKENS.filter(
    t =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
  );
}

export function getTokensByCategory(category) {
  if (category === 'all') return ROBINHOOD_TOKENS;
  return ROBINHOOD_TOKENS.filter(t => t.type === category);
}

export function getCryptoTokens() {
  return ROBINHOOD_TOKENS.filter(t => t.coingeckoId);
}

export function getStockTokens() {
  return ROBINHOOD_TOKENS.filter(t => t.type === TokenType.STOCK || t.type === TokenType.ETF);
}

export const ROBINHOOD_CHAIN = {
  chainId: 4663,
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  blockExplorer: 'https://robinhoodchain.blockscout.com',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

export const ROBINHOOD_TOKENS = [
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73',
    chainId: 4663,
    decimals: 18,
    type: 'crypto',
    category: 'Layer 1',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    coingeckoId: 'wrapped-ether',
    description: 'Wrapped Ether on Robinhood Chain. ETH is the native gas token.',
  },
  {
    symbol: 'USDG',
    name: 'Global Dollar',
    address: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
    chainId: 4663,
    decimals: 18,
    type: 'stablecoin',
    category: 'Stablecoin',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    coingeckoId: 'usdg',
    description: 'USDG is a US dollar-backed stablecoin issued by Paxos-led consortium. Used in Robinhood Earn for lending at ~7% APY.',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla • Robinhood Token',
    address: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/tesla.com',
    stockTicker: 'TSLA',
    description: 'Tokenized Tesla stock on Robinhood Chain. Provides economic exposure to TSLA shares. Available 24/7 for trading.',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA • Robinhood Token',
    address: '0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/nvidia.com',
    stockTicker: 'NVDA',
    description: 'Tokenized NVIDIA stock on Robinhood Chain. Provides economic exposure to NVDA shares. Available 24/7 for trading.',
  },
  {
    symbol: 'AAPL',
    name: 'Apple • Robinhood Token',
    address: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/apple.com',
    stockTicker: 'AAPL',
    description: 'Tokenized Apple stock on Robinhood Chain. Provides economic exposure to AAPL shares. Available 24/7 for trading.',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft • Robinhood Token',
    address: '0xe93237C50D904957Cf27E7B1133b510C669c2e74',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/microsoft.com',
    stockTicker: 'MSFT',
    description: 'Tokenized Microsoft stock on Robinhood Chain. Provides economic exposure to MSFT shares. Available 24/7 for trading.',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon • Robinhood Token',
    address: '0x12f190a9F9d7D37a250758b26824B97CE941bF54',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/amazon.com',
    stockTicker: 'AMZN',
    description: 'Tokenized Amazon stock on Robinhood Chain. Provides economic exposure to AMZN shares. Available 24/7 for trading.',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet • Robinhood Token',
    address: '0x2e0847E8910a9732eB3fb1bb4b70a580ADAD4FE3',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/google.com',
    stockTicker: 'GOOGL',
    description: 'Tokenized Alphabet (Google) stock on Robinhood Chain. Provides economic exposure to GOOGL shares. Available 24/7 for trading.',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms • Robinhood Token',
    address: '0xc0D6457C16Cc70d6790Dd43521C899C87ce02f35',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/meta.com',
    stockTicker: 'META',
    description: 'Tokenized Meta Platforms stock on Robinhood Chain. Provides economic exposure to META shares. Available 24/7 for trading.',
  },
  {
    symbol: 'COIN',
    name: 'Coinbase • Robinhood Token',
    address: '0x6330D8C3178a418788dF01a47479c0ce7CCF450b',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/coinbase.com',
    stockTicker: 'COIN',
    description: 'Tokenized Coinbase stock on Robinhood Chain. Provides economic exposure to COIN shares. Available 24/7 for trading.',
  },
  {
    symbol: 'SPCX',
    name: 'SpaceX • Robinhood Token',
    address: '0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa',
    chainId: 4663,
    decimals: 18,
    type: 'stock',
    category: 'Stock Token',
    logo: 'https://logo.clearbit.com/spacex.com',
    stockTicker: 'SPCX',
    description: 'Tokenized SpaceX (private company) on Robinhood Chain. Provides economic exposure to SpaceX. Available 24/7 for trading.',
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF • Robinhood Token',
    address: '0x117cc2133c37B721F49dE2A7a74833232B3B4C0C',
    chainId: 4663,
    decimals: 18,
    type: 'etf',
    category: 'ETF Token',
    logo: 'https://logo.clearbit.com/spdr.com',
    stockTicker: 'SPY',
    description: 'Tokenized SPDR S&P 500 ETF on Robinhood Chain. Tracks the S&P 500 index. Available 24/7 for trading.',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ • Robinhood Token',
    address: '0xD5f3879160bc7c32ebb4dC785F8a4F505888de68',
    chainId: 4663,
    decimals: 18,
    type: 'etf',
    category: 'ETF Token',
    logo: 'https://logo.clearbit.com/invesco.com',
    stockTicker: 'QQQ',
    description: 'Tokenized Invesco QQQ Trust on Robinhood Chain. Tracks the Nasdaq-100 index. Available 24/7 for trading.',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 4663,
    decimals: 18,
    type: 'defi',
    category: 'DeFi',
    logo: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    coingeckoId: 'uniswap',
    description: 'Uniswap is the primary DEX on Robinhood Chain. Over $1B in weekly volume. UNI is the governance token.',
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 4663,
    decimals: 18,
    type: 'defi',
    category: 'Layer 2',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png',
    coingeckoId: 'arbitrum',
    description: 'Arbitrum is the L2 technology powering Robinhood Chain. ARB is the governance token.',
  },
  {
    symbol: 'MORPHO',
    name: 'Morpho',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 4663,
    decimals: 18,
    type: 'defi',
    category: 'DeFi',
    logo: 'https://cryptologos.cc/logos/morpho-logo.png',
    coingeckoId: 'morpho',
    description: 'Morpho powers Robinhood Earn lending. ~$194M TVL on Robinhood Chain. Enables ~7% APY on USDG deposits.',
  },
  {
    symbol: 'LIT',
    name: 'Lighter',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 4663,
    decimals: 18,
    type: 'defi',
    category: 'DeFi',
    logo: 'https://cryptologos.cc/logos/lighter-lit-logo.png',
    coingeckoId: 'lighter',
    description: 'Lighter is the perpetual futures exchange on Robinhood Chain. $11M LIT committed to Robinhood community.',
  },
  {
    symbol: 'CASHCAT',
    name: 'Cash Cat',
    address: '0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    chainId: 4663,
    decimals: 18,
    type: 'meme',
    category: 'Meme Coin',
    logo: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    coingeckoId: 'cash-cat',
    description: 'CASHCAT is a community memecoin on Robinhood Chain. Named after Robinhood\'s former mascot. No affiliation with Robinhood.',
  },
];

export const TOKEN_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'stock', name: 'Stocks', icon: '📈' },
  { id: 'etf', name: 'ETFs', icon: '📊' },
  { id: 'crypto', name: 'Crypto', icon: '₿' },
  { id: 'defi', name: 'DeFi', icon: '🏦' },
  { id: 'stablecoin', name: 'Stablecoins', icon: '💵' },
  { id: 'meme', name: 'Meme', icon: '🐸' },
];

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
      t.category.toLowerCase().includes(q)
  );
}

export function getTokensByCategory(category) {
  if (category === 'all') return ROBINHOOD_TOKENS;
  return ROBINHOOD_TOKENS.filter(t => t.category === category || t.type === category);
}

export function getCryptoTokens() {
  return ROBINHOOD_TOKENS.filter(t => t.coingeckoId);
}

export function getStockTokens() {
  return ROBINHOOD_TOKENS.filter(t => t.type === 'stock' || t.type === 'etf');
}

export const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    decimals: 18,
    tags: ['L1', 'base'],
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'SUSHI',
    name: 'SushiToken',
    address: '0x6B3595068778dd592e39A122f4f5a5cF09C90fE2',
    chainId: 1,
    decimals: 18,
    tags: ['dex', 'gov'],
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    tags: ['stable'],
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    tags: ['stable'],
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: 1,
    decimals: 8,
    tags: ['btc'],
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png'
  },
];

export const filterTokens = (q, excludeSymbol) => {
  const s = (q || '').trim().toLowerCase();
  return TOKENS.filter(
    (t) =>
      t.symbol !== excludeSymbol &&
      (s === '' ||
        t.symbol.toLowerCase().includes(s) ||
        t.name.toLowerCase().includes(s) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(s)))
  );
};

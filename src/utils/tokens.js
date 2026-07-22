export const ETH_TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'SUSHI',
    name: 'SushiToken',
    address: '0x6B3595068778dd592e39A122f4f5a5cF09C90fE2',
    chainId: 1,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chainId: 1,
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    chainId: 1,
    decimals: 8,
    logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png'
  },
];

export const BASE_TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 8453,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    chainId: 8453,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    chainId: 8453,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    chainId: 8453,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
];

export const TOKENS_BY_CHAIN = {
  1: ETH_TOKENS,
  8453: BASE_TOKENS,
};

export const TOKENS = ETH_TOKENS;

export const filterTokens = (q, excludeSymbol) => {
  const s = (q || '').trim().toLowerCase();
  return TOKENS.filter(
    (t) =>
      t.symbol !== excludeSymbol &&
      (s === '' ||
        t.symbol.toLowerCase().includes(s) ||
        t.name.toLowerCase().includes(s))
  );
};

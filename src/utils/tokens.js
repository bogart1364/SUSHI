export const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x000000',
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
  }
];

export const filterTokens = (q) => {
  const s = (q || '').trim().toLowerCase();
  if (!s) return TOKENS;
  return TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(s) ||
      t.name.toLowerCase().includes(s) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(s))
  );
};
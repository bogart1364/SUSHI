// ──────────────────────────────────────────────────────────────────────────────
// Robinhood Chain Configuration & Token List
//
// Chain ID: 4663 (Ethereum L2, Arbitrum Orbit stack)
// RPC: https://rpc.mainnet.chain.robinhood.com
// Explorer: https://robinhoodchain.blockscout.com
//
// Real contract addresses verified via Blockscout:
//   WETH:    0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73
//   Router:  0xaA912C63D3BEe8efC800794934e3F092FBbD4596
//   Adapter: 0x6F6B1962191785Babc87DB4B37FcbEd8D5b6BE34
//   Permit2: 0x000000000022D473030F116dDEE9F6B43aC78BA3
//
// Live pair data from DexScreener:
//   https://dexscreener.com/robinhood/sushiswap
// ──────────────────────────────────────────────────────────────────────────────

export const ROBINHOOD_CHAIN = {
  chainId: 4663,
  name: 'Robinhood Chain',
  rpcUrl: 'https://rpc.mainnet.chain.robinhood.com',
  blockExplorer: 'https://robinhoodchain.blockscout.com',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
};

export const ROBINHOOD_CONTRACTS = {
  WETH: '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73',
  SUSHI_V3_ROUTER: '0xaA912C63D3BEe8efC800794934e3F092FBbD4596',
  SUSHI_V3_ADAPTER: '0x6F6B1962191785Babc87DB4B37FcbEd8D5b6BE34',
  PERMIT2: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
};

// ─── Token list with real contract addresses ───────────────────────────────

export const ROBINHOOD_TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ether',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    chainId: 4663,
    decimals: 18,
    isNative: true,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73',
    chainId: 4663,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
];

// ─── Pair addresses for DexScreener batch fetch ───────────────────────────

export const PAIR_ADDRESSES = [
  '0xEb5b094eA5024902968422336180eaF64CfbfcB2',
  '0xf3874d01082bf62023166A7585Fed0d902b2C971',
  '0xab730D68a5Ee19E54bEb62f6d661D7D3e68a1486',
  '0x5b3B3c29e7647c35623679DfF881145B21E3c522',
  '0x7dC033904f62a335dB8981Ce94dB03Ba67a7113C',
  '0xBDF204827660Da5263Ea2103B11c5AA564F7d95c',
  '0x057e8269Ab1AEcc03045d8f1f0E9857f3a6bBed0',
  '0x30085C0e3973ceBcF3D54714d8c3d5bddBc59bEE',
  '0xD47F1932da6E0d71a0A05dD3670905525f43332e',
  '0x42A72e59c00eb787eA11f42b942EEb9691AA9D07',
  '0xd9eec4ac4ead352d3da6974db1b517103ce2eded',
  '0xda3247adb6af1f25163708c871f66e702b0d8300',
  '0x978a4152bd016b8c268c70b382df97ba625617cc',
  '0xd6477607cc76c6cc3dd808bb6d50748de68e5a4d',
  '0xe586f71fde88b11329782c0a55494d35d4a2a19a',
  '0x641a7820aff738ef973012234f477266850a2bcf',
  '0x68546e1f5180387ce8cf8cc5673622880880825f',
  '0xb37f2e5e2ee835ab9a23283b17f12a25ac5c43ea',
  '0x6e3263f4447066de83a356053b5852fa8408bb5a',
  '0x0FA4c2caa673Ee94D700D0DdEa662080548e4E27',
  '0xe794b4b550c0dc4eda55cfa9a1690e0b8233c9b1',
  '0xc5a01c57b2851202dcf8507a0f2bd08a8025e2c8',
  '0x7fff70d5748390779e573a1995952c3dddf57a9c',
];

// ─── Category definitions for the filter bar ──────────────────────────────

export const TOKEN_CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔥' },
  { id: 'gainers', name: 'Gainers', icon: '📈' },
  { id: 'losers', name: 'Losers', icon: '📉' },
  { id: 'new', name: 'New', icon: '🆕' },
  { id: 'volume', name: 'Top Volume', icon: '📊' },
  { id: 'liquidity', name: 'Top Liquidity', icon: '💧' },
];

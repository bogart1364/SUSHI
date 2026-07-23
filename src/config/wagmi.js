import { http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { createConfig } from '@privy-io/wagmi';

const robinhoodChain = {
  id: 4663,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.chain.robinhood.com'] },
    public: { http: ['https://rpc.mainnet.chain.robinhood.com'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://robinhoodchain.blockscout.com' },
  },
};

export const config = createConfig({
  chains: [mainnet, base, robinhoodChain],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [robinhoodChain.id]: http('https://rpc.mainnet.chain.robinhood.com'),
  },
});

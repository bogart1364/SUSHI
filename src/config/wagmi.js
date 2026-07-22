import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'e8997e2a094c7c278e54c5e68b7f3a4e';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId,
      metadata: {
        name: 'SushiMobile',
        description: 'SushiSwap Mobile DEX',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: ['https://cryptologos.cc/logos/sushiswap-sushi-logo.png'],
      },
    }),
    coinbaseWallet({ appName: 'SushiMobile', appLogoUrl: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({ projectId: 'e8997e2a094c7c278e54c5e68b7f3a4e', metadata: { name: 'SushiMobile', description: 'SushiSwap Mobile', url: window.location.origin, icons: ['https://cryptologos.cc/logos/sushiswap-sushi-logo.png'] } }),
    coinbaseWallet({ appName: 'SushiMobile', appLogoUrl: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

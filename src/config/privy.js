import { mainnet, base } from 'viem/chains';

export const privyConfig = {
  loginMethods: ['wallet', 'email', 'sms'],
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: false,
    showWalletUIs: true,
  },
  appearance: {
    showWalletLoginFirst: true,
    theme: 'dark',
    accentColor: '#FF007A',
    logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png',
    walletList: [
      'metamask',
      'walletconnect',
      'coinbase_wallet',
      'rainbow',
      'trust',
      'argent',
      'phantom',
    ],
  },
  supportedChains: [mainnet, base],
};

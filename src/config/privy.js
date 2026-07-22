export const privyConfig = {
  loginMethods: ['wallet'],
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
  },
};

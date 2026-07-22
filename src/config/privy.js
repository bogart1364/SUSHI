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
  },
};

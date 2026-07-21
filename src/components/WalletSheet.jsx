import { useConnect } from 'wagmi';

const MetaMaskLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#1B1B1B" />
    <path d="M26.2 8.5L20 13l1.8 6.5h-7.6L16 13l-6.2-4.5 12.8 17.5h5.6L26.2 8.5z" fill="#E2761B" stroke="#E2761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8 8.5L16 13l-2 6.5-5.2-11z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 24l-2 3-6.2.3 6.2-3.3z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25.2 27l-6.2-.3-5.4-3.4 7.4 3.7z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.8 29.5l3.4-1.7-3-2.5z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21.6 27.8l-3.4 1.7.6-3.7z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 19.5H12l-1.5 5.5 7.4.3h7.6l-1.5-5.8z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.8 13l2 6.5h-4l2-6.5z" fill="#E4761B" stroke="#E4761B" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletConnectLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#1B1B1B" />
    <path d="M12.5 14.5c3-3 8-3 11 0l.5.5c.15.15.15.4 0 .55l-1.3 1.3c-.08.08-.2.08-.28 0l-.5-.5c-2.1-2.1-5.5-2.1-7.6 0l-.55.55c-.08.08-.08-.2 0-.28l-1.3-1.3c-.15-.15-.15-.4 0-.55l.6-.5z" fill="#3B99FC"/>
    <path d="M16.5 18.5l-.5.5c-.08.08-.2.08-.28 0l-1.3-1.3c-.15-.15-.15-.4 0-.55l2.5-2.5c.08-.08.2-.08.28 0l2.5 2.5c.15.15.15.4 0 .55l-1.3 1.3c-.08.08-.2.08-.28 0l-.6-.7z" fill="#3B99FC"/>
    <path d="M23.5 14.5c3 3 3 8 0 11l-.5.5c-.15.15-.4.15-.55 0l-1.3-1.3c-.08-.08-.08-.2 0-.28l.5-.5c2.1-2.1 2.1-5.5 0-7.6l-.55-.55c-.08-.08-.08-.2 0-.28l1.3-1.3c.15-.15.4-.15.55 0l.5.5z" fill="#3B99FC"/>
  </svg>
);

const CoinbaseLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#1B1B1B" />
    <rect x="10" y="10" width="16" height="16" rx="4" fill="#0052FF" />
    <path d="M18 14v8M14 18h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SafeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#1B1B1B" />
    <path d="M18 8l8 4v5c0 5-3 8-8 9-5-1-8-4-8-9v-5l8-4z" fill="#12FF88" opacity="0.2" stroke="#12FF88" strokeWidth="1.5"/>
    <path d="M14 18l3 3 5-6" stroke="#12FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();

  if (!open) return null;

  const walletData = {
    'injected': { name: 'Browser Wallet', desc: 'MetaMask, Brave, or installed wallet', icon: <MetaMaskLogo /> },
    'walletConnect': { name: 'WalletConnect', desc: 'Scan QR code with mobile wallet', icon: <WalletConnectLogo /> },
    'coinbaseWalletSDK': { name: 'Coinbase Wallet', desc: 'Connect with Coinbase Wallet', icon: <CoinbaseLogo /> },
    'safe': { name: 'Safe', desc: 'Connect with Safe multisig', icon: <SafeLogo /> },
  };

  return (
    <>
      <button
        aria-label="Close wallet selector"
        className="fixed inset-0 z-40 bg-black/70"
        onClick={onClose}
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-50 bg-[#12121a] rounded-t-3xl border-t border-neon/20 max-w-md mx-auto flex flex-col"
        style={{ height: '50vh' }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full">✕</button>
        </div>

        <div className="overflow-y-auto px-6 pb-6 flex-1">
          <div className="space-y-3">
            {connectors.map((connector) => {
              const data = walletData[connector.id] || {
                name: connector.name || 'Wallet',
                desc: 'Connect wallet',
                icon: (
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect width="36" height="36" rx="10" fill="#1B1B1B" />
                    <circle cx="18" cy="18" r="8" stroke="#FF007A" strokeWidth="1.5" fill="none" />
                  </svg>
                ),
              };
              return (
                <button
                  key={connector.id}
                  disabled={isPending}
                  className="flex w-full items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon/30 transition-all duration-200 active:scale-[0.98]"
                  onClick={() => {
                    connect({ connector });
                    onClose();
                  }}
                >
                  <div className="flex-shrink-0">
                    {data.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-sm">{data.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{data.desc}</p>
                  </div>
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
                      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            New to Ethereum?{' '}
            <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-neon">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

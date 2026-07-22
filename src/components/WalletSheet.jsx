import { useConnect } from 'wagmi';

const WALLET_LOGOS = {
  'injected': 'https://raw.githubusercontent.com/nickmetsch/walletconnect-logo/main/metamask-fox.svg',
  'walletConnect': 'https://raw.githubusercontent.com/nickmetsch/walletconnect-logo/main/walletconnect-circle-blue.svg',
  'coinbaseWalletSDK': 'https://raw.githubusercontent.com/nickmetsch/coinbase-wallet-logo/main/coinbase-wallet-logo.svg',
};

const FALLBACK_ICONS = {
  'injected': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#F6851B"/>
      <path d="M20 8l8 4.5v9c0 5.5-3.5 9-8 10-4.5-1-8-4.5-8-10v-9l8-4.5z" fill="#E2761B"/>
      <path d="M20 12c2.5 0 4.5 1.5 5.5 4h-11c1-2.5 3-4 5.5-4z" fill="#E2761B"/>
      <path d="M14.5 17h11c.3 1 .5 2 .5 3-2.5 4-6 5.5-6 5.5s-3.5-1.5-6-5.5c0-1 .2-2 .5-3z" fill="#CD6116"/>
      <path d="M15 22l-1 4.5 6-.5-5-4z" fill="#E4761B"/>
      <path d="M25 22l1 4.5-6-.5 5-4z" fill="#E4761B"/>
      <path d="M25.5 17h-11c-.2-.7-.5-1.3-.8-2h12.6c-.3.7-.6 1.3-.8 2z" fill="#E4761B"/>
    </svg>
  ),
  'walletConnect': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#3B99FC"/>
      <circle cx="15" cy="16" r="3.5" fill="white"/>
      <circle cx="25" cy="16" r="3.5" fill="white"/>
      <path d="M12 22c3 4.5 10 4.5 16 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M15 28c2 2.5 8 2.5 10 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  'coinbaseWalletSDK': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#0052FF"/>
      <circle cx="20" cy="20" r="8" fill="white" opacity="0.3"/>
      <path d="M20 14v12M14 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'safe': (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#12FF88"/>
      <path d="M20 8l10 5v6c0 6-4 10-10 11-6-1-10-5-10-11v-6l10-5z" fill="white" opacity="0.2"/>
      <path d="M15 20l4 4 6-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
};

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();

  if (!open) return null;

  const walletData = {
    'injected': { name: 'MetaMask', desc: 'Connect with MetaMask extension' },
    'walletConnect': { name: 'WalletConnect', desc: 'Scan QR code with any wallet' },
    'coinbaseWalletSDK': { name: 'Coinbase Wallet', desc: 'Connect with Coinbase' },
    'safe': { name: 'Safe', desc: 'Connect with Safe multisig' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[90%] max-w-sm p-5 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition">✕</button>
        </div>

        <div className="space-y-2">
          {connectors.map((connector) => {
            const data = walletData[connector.id] || { name: connector.name || 'Wallet', desc: 'Connect' };
            const fallbackIcon = FALLBACK_ICONS[connector.id];
            const logoUrl = WALLET_LOGOS[connector.id];

            return (
              <button
                key={connector.id}
                disabled={isPending}
                className="flex w-full items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                onClick={() => {
                  connect({ connector });
                  onClose();
                }}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={data.name}
                      className="w-10 h-10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={logoUrl ? 'hidden' : 'flex'} style={logoUrl ? { display: 'none' } : {}}>
                    {fallbackIcon}
                  </div>
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm">{data.name}</p>
                  <p className="text-gray-500 text-xs">{data.desc}</p>
                </div>
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          No wallet?{' '}
          <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-neon">
            Get one
          </a>
        </p>
      </div>
    </div>
  );
}

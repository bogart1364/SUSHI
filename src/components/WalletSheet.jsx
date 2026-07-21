import { useConnect } from 'wagmi';

const walletIcons = {
  'injected': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#F6851B" />
      <text x="16" y="22" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">M</text>
    </svg>
  ),
  'walletConnect': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#3B99FC" />
      <circle cx="12" cy="13" r="3" fill="white" />
      <circle cx="20" cy="13" r="3" fill="white" />
      <path d="M12 16c0 2 1 4 4 4s4-2 4-4" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  ),
  'coinbaseWallet': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#0052FF" />
      <rect x="10" y="10" width="12" height="12" rx="2" fill="white" />
    </svg>
  ),
  'safe': (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#12FF88" />
      <path d="M16 6l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10v-6l8-4z" fill="white" />
    </svg>
  ),
};

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();

  if (!open) return null;

  const getWalletName = (connector) => {
    if (connector.id === 'injected') return 'Browser Wallet';
    if (connector.id === 'walletConnect') return 'WalletConnect';
    if (connector.id === 'coinbaseWalletSDK') return 'Coinbase Wallet';
    if (connector.id === 'safe') return 'Safe';
    return connector.name || 'Unknown Wallet';
  };

  const getIcon = (connector) => {
    if (walletIcons[connector.id]) return walletIcons[connector.id];
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#333" />
        <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    );
  };

  return (
    <>
      <button
        aria-label="Close wallet selector"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-glass rounded-t-3xl p-6 pb-8 backdrop-blur-md max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold tracking-tight text-white">Connect Wallet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              disabled={isPending}
              className="flex w-full items-center gap-4 p-4 bg-black/30 border border-border rounded-2xl transition hover:bg-white/5 hover:border-neon/30 disabled:opacity-50"
              onClick={() => {
                connect({ connector });
                onClose();
              }}
            >
              <div className="flex-shrink-0">
                {getIcon(connector)}
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">{getWalletName(connector)}</p>
                <p className="text-gray-500 text-xs">Connect using {getWalletName(connector)}</p>
              </div>
              {isPending && (
                <div className="ml-auto">
                  <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By connecting, you agree to our Terms of Service
        </p>
      </div>
    </>
  );
}

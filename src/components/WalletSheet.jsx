import { useConnect } from 'wagmi';

const WalletIcon = ({ id, name }) => {
  const icons = {
    'injected': (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="rgba(246,133,27,0.15)" stroke="#F6851B" strokeWidth="1" />
        <path d="M18 8l6 3.5v7c0 4-2.5 7-6 8-3.5-1-6-4-6-8v-7l6-3.5z" stroke="#F6851B" strokeWidth="1.5" fill="none" />
        <path d="M18 14v4" stroke="#F6851B" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 16h8" stroke="#F6851B" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    'walletConnect': (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="rgba(59,153,252,0.15)" stroke="#3B99FC" strokeWidth="1" />
        <circle cx="13" cy="14" r="3" stroke="#3B99FC" strokeWidth="1.5" fill="none" />
        <circle cx="23" cy="14" r="3" stroke="#3B99FC" strokeWidth="1.5" fill="none" />
        <path d="M16 14c1-1.5 3-1.5 4 0" stroke="#3B99FC" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M13 17v2c0 2 2 3 5 3s5-1 5-3v-2" stroke="#3B99FC" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    'coinbaseWalletSDK': (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="rgba(0,82,255,0.15)" stroke="#0052FF" strokeWidth="1" />
        <rect x="11" y="11" width="14" height="14" rx="3" stroke="#0052FF" strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="18" r="3" fill="#0052FF" opacity="0.5" />
      </svg>
    ),
    'safe': (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="10" fill="rgba(18,255,136,0.15)" stroke="#12FF88" strokeWidth="1" />
        <path d="M18 8l8 4v5c0 5-3 8-8 9-5-1-8-4-8-9v-5l8-4z" stroke="#12FF88" strokeWidth="1.5" fill="none" />
        <path d="M14 18l3 3 5-6" stroke="#12FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  };

  return icons[id] || (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="rgba(255,0,122,0.1)" stroke="#FF007A" strokeWidth="1" />
      <circle cx="18" cy="18" r="6" stroke="#FF007A" strokeWidth="1.5" fill="none" />
      <path d="M18 14v8M14 18h8" stroke="#FF007A" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
};

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();

  if (!open) return null;

  const getWalletName = (connector) => {
    if (connector.id === 'injected') return 'Browser Wallet';
    if (connector.id === 'walletConnect') return 'WalletConnect';
    if (connector.id === 'coinbaseWalletSDK') return 'Coinbase Wallet';
    if (connector.id === 'safe') return 'Safe';
    return connector.name || 'Wallet';
  };

  const getWalletDesc = (connector) => {
    if (connector.id === 'injected') return 'MetaMask, Brave, or installed wallet';
    if (connector.id === 'walletConnect') return 'Scan with mobile wallet';
    if (connector.id === 'coinbaseWalletSDK') return 'Connect with Coinbase';
    if (connector.id === 'safe') return 'Connect with Safe multisig';
    return 'Connect wallet';
  };

  return (
    <>
      <button
        aria-label="Close wallet selector"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 glass-sushi rounded-t-3xl p-6 pb-8 max-w-md mx-auto shadow-neon-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="14" rx="3" stroke="#FF007A" strokeWidth="1.5" fill="rgba(255,0,122,0.08)" />
              <circle cx="17" cy="13" r="2.5" stroke="#FF007A" strokeWidth="1.2" fill="none" />
              <path d="M6 10h4" stroke="#FF007A" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <h2 className="text-lg font-bold tracking-tight text-white">Connect Wallet</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-neon transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-neon/10">✕</button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              disabled={isPending}
              className="flex w-full items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-neon/5 neon-border hover:shadow-neon active:scale-[0.98] disabled:opacity-50 group"
              onClick={() => {
                connect({ connector });
                onClose();
              }}
            >
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <WalletIcon id={connector.id} name={connector.name} />
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">{getWalletName(connector)}</p>
                <p className="text-gray-500 text-xs mt-0.5">{getWalletDesc(connector)}</p>
              </div>
              {isPending ? (
                <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600 group-hover:text-neon transition-colors">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-neon/10">
          <p className="text-center text-gray-600 text-xs">
            New to Ethereum wallets?{' '}
            <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-neon hover:text-neonLight transition-colors">
              Learn more
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

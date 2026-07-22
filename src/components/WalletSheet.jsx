import { useConnect, useAccount, useDisconnect } from 'wagmi';

const WALLET_LOGOS = {
  'injected': (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#F6851B"/>
      <path d="M20 8l8 4.5v9c0 5.5-3.5 9-8 10-4.5-1-8-4.5-8-10v-9l8-4.5z" fill="#E2761B"/>
      <path d="M20 12c2.5 0 4.5 1.5 5.5 4h-11c1-2.5 3-4 5.5-4z" fill="#E2761B"/>
      <path d="M14.5 17h11c.3 1 .5 2 .5 3-2.5 4-6 5.5-6 5.5s-3.5-1.5-6-5.5c0-1 .2-2 .5-3z" fill="#CD6116"/>
      <path d="M15 22l-1 4.5 6-.5-5-4z" fill="#E4761B"/>
      <path d="M25 22l1 4.5-6-.5 5-4z" fill="#E4761B"/>
    </svg>
  ),
  'walletConnect': (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#3B99FC"/>
      <circle cx="15" cy="16" r="3.5" fill="white"/>
      <circle cx="25" cy="16" r="3.5" fill="white"/>
      <path d="M12 22c3 4.5 10 4.5 16 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M15 28c2 2.5 8 2.5 10 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  'coinbaseWalletSDK': (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#0052FF"/>
      <circle cx="20" cy="20" r="8" fill="white" opacity="0.3"/>
      <path d="M20 14v12M14 20h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'safe': (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="12" fill="#12FF88"/>
      <path d="M20 8l10 5v6c0 6-4 10-10 11-6-1-10-5-10-11v-6l10-5z" fill="white" opacity="0.2"/>
      <path d="M15 20l4 4 6-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
};

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!open) return null;

  const walletData = {
    'injected': { name: 'MetaMask', desc: 'Browser extension' },
    'walletConnect': { name: 'WalletConnect', desc: 'Scan QR code' },
    'coinbaseWalletSDK': { name: 'Coinbase Wallet', desc: 'Coinbase app' },
    'safe': { name: 'Safe', desc: 'Multisig wallet' },
  };

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  if (isConnected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10 overflow-hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-success rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Connected</p>
                <p className="text-gray-500 text-xs">{shortAddr}</p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition active:scale-[0.98]"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
              >
                Copy Address
              </button>
              <button
                className="w-full py-3 rounded-xl bg-error/10 border border-error/20 text-error font-semibold text-sm hover:bg-error/20 transition active:scale-[0.98]"
                onClick={() => {
                  disconnect();
                  onClose();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10 overflow-hidden">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
        <div className="p-5">
          <h2 className="text-lg font-bold text-white text-center mb-4">Connect Wallet</h2>

          <div className="space-y-2">
            {connectors.map((connector) => {
              const data = walletData[connector.id] || { name: connector.name || 'Wallet', desc: 'Connect' };
              return (
                <button
                  key={connector.id}
                  disabled={isPending}
                  className="flex w-full items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98]"
                  onClick={() => {
                    connect({ connector });
                    onClose();
                  }}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                    {WALLET_LOGOS[connector.id] || (
                      <div className="w-9 h-9 rounded-lg bg-neon/20 flex items-center justify-center">
                        <span className="text-neon text-lg font-bold">W</span>
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-sm">{data.name}</p>
                    <p className="text-gray-500 text-[11px]">{data.desc}</p>
                  </div>
                  {isPending && <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

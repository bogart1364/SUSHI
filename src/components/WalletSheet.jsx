import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useAppContext } from '../main';

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
  document.body.removeChild(ta); return Promise.resolve();
}

const WALLET_ICONS = {
  injected: { name: 'MetaMask', color: '#F6851B', icon: 'M' },
  coinbaseWalletSDK: { name: 'Coinbase', color: '#0052FF', icon: 'C' },
  walletConnect: { name: 'WalletConnect', color: '#3B99FC', icon: 'W' },
};

function WagmiWalletList({ onClose }) {
  const { connectors, connect, isPending } = useConnect();
  const [connectingId, setConnectingId] = useState(null);
  const [error, setError] = useState('');

  const seen = new Set();
  const uniqueConnectors = connectors.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const handleConnect = async (connector) => {
    setConnectingId(connector.id);
    setError('');
    try {
      await connect({ connector });
      onClose();
    } catch (e) {
      setError(e?.shortMessage || e?.message || 'Connection failed');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        {uniqueConnectors.map((connector) => {
          const data = WALLET_ICONS[connector.id] || { name: connector.name || 'Wallet', color: '#333', icon: '?' };
          const isLoading = connectingId === connector.id;
          return (
            <button
              key={connector.id}
              disabled={isPending || isLoading}
              className="flex w-full items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98] disabled:opacity-50"
              onClick={() => handleConnect(connector)}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: data.color }}>{data.icon}</div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-xs">{data.name}</p>
              </div>
              {isLoading && <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
            </button>
          );
        })}
      </div>
      {error && <div className="mt-2 p-2 rounded-lg bg-error/10 border border-error/20"><p className="text-error text-[10px] text-center">{error}</p></div>}
    </>
  );
}

function ConnectedSheet({ address, onClose }) {
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;

  const handleCopy = async () => {
    try { await copyToClipboard(address); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 bg-success rounded-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-bold text-sm leading-tight">Connected</p>
          <p className="text-gray-500 text-[11px] font-mono truncate">{shortAddr}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        <button onClick={handleCopy} className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-xs active:scale-[0.98] transition">
          {copied ? '✓ Copied!' : 'Copy Address'}
        </button>
        <button onClick={() => { disconnect(); onClose(); }} className="w-full py-2.5 rounded-lg bg-error/10 border border-error/20 text-error font-semibold text-xs active:scale-[0.98] transition">
          Disconnect
        </button>
      </div>
    </>
  );
}

export default function WalletSheet({ open, onClose }) {
  const { address, isConnected } = useAccount();
  const { hasPrivy } = useAppContext();
  const [privyLogin, setPrivyLogin] = useState(null);
  const [privyLoading, setPrivyLoading] = useState(false);
  const [privyError, setPrivyError] = useState(false);

  useEffect(() => {
    if (!open) { setPrivyLogin(null); setPrivyLoading(false); setPrivyError(false); }
  }, [open]);

  useEffect(() => {
    if (open && hasPrivy && !privyLogin && !privyError && !isConnected) {
      setPrivyLoading(true);
      import('@privy-io/react-auth').then((m) => {
        setPrivyLogin(() => m.usePrivy);
        setPrivyLoading(false);
      }).catch(() => {
        setPrivyError(true);
        setPrivyLoading(false);
      });
    }
  }, [open, hasPrivy]);

  if (!open) return null;

  const sheetContent = (
    <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
      <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
      <h2 className="text-sm font-bold text-white text-center mb-3">
        {isConnected ? 'Your Wallet' : 'Connect Wallet'}
      </h2>

      {isConnected && address ? (
        <ConnectedSheet address={address} onClose={onClose} />
      ) : privyLoading ? (
        <div className="flex flex-col items-center py-6">
          <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-400 text-xs">Loading wallets…</p>
        </div>
      ) : (
        <WagmiWalletList onClose={onClose} />
      )}

      <button onClick={onClose} className="w-full mt-3 py-2 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95 transition">Cancel</button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      {sheetContent}
    </div>
  );
}

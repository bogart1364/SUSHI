import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

const WALLET_OPTIONS = [
  { id: 'injected', name: 'MetaMask', desc: 'Browser extension / In-app browser', bg: '#F6851B' },
  { id: 'coinbaseWalletSDK', name: 'Coinbase Wallet', desc: 'Coinbase app', bg: '#0052FF' },
];

export default function WalletSheet({ open, onClose }) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [connectError, setConnectError] = useState('');

  useEffect(() => {
    if (!open) {
      setCopied(false);
      setConnectingId(null);
      setConnectError('');
    }
  }, [open]);

  if (!open) return null;

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

  const handleConnect = async (connector) => {
    setConnectingId(connector.id);
    setConnectError('');
    try {
      await connect({ connector });
      onClose();
    } catch (e) {
      console.error('Connect error:', e);
      setConnectError(e?.shortMessage || e?.message || 'Connection failed. Try again.');
    } finally {
      setConnectingId(null);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      disconnect();
    } catch (e) {
      console.error('Disconnect error:', e);
    } finally {
      onClose();
    }
  };

  if (isConnected && address) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div className="absolute bottom-0 left-0 right-0 bg-[#141420] rounded-t-3xl border-t border-white/10 max-w-md mx-auto p-5 pb-8">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 bg-success rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm">Connected</p>
              <p className="text-gray-500 text-xs font-mono truncate">{shortAddr}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-[0.98] transition" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Address'}
            </button>
            <button className="w-full py-3 rounded-xl bg-error/10 border border-error/20 text-error font-semibold text-sm active:scale-[0.98] transition" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  const seen = new Set();
  const uniqueConnectors = connectors.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const getConnectorData = (c) => {
    if (c.id === 'injected') return WALLET_OPTIONS[0];
    if (c.id === 'coinbaseWalletSDK') return WALLET_OPTIONS[1];
    return { id: c.id, name: c.name || 'Wallet', desc: 'Connect', bg: '#333' };
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#141420] rounded-t-3xl border-t border-white/10 max-w-md mx-auto p-5 pb-8">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white text-center mb-5">Connect Wallet</h2>

        <div className="space-y-2">
          {uniqueConnectors.map((connector) => {
            const data = getConnectorData(connector);
            const isLoading = connectingId === connector.id;
            return (
              <button
                key={connector.id}
                disabled={isPending || isLoading}
                className="flex w-full items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98] disabled:opacity-50"
                onClick={() => handleConnect(connector)}
              >
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: data.bg }}>
                  {data.id === 'injected' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M21.2 6.2c-.5-.5-1.2-.8-2-.8H4.8c-.8 0-1.5.3-2 .8-.5.5-.8 1.2-.8 2v8c0 .8.3 1.5.8 2 .5.5 1.2.8 2 .8h14.4c.8 0 1.5-.3 2-.8.5-.5.8-1.2.8-2v-8c0-.8-.3-1.5-.8-2zM12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.5-6H7.5v-1h9v1z"/></svg>
                  )}
                  {data.id === 'coinbaseWalletSDK' && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.64c.09 1.71 1.37 2.66 2.7 2.97V19h2.12v-1.67c1.52-.29 2.72-1.16 2.72-2.74 0-2.07-1.71-2.85-3.74-3.42z"/></svg>
                  )}
                </div>
                <div className="text-left flex-1">
                  <p className="text-white font-semibold text-sm">{data.name}</p>
                  <p className="text-gray-500 text-[11px]">{data.desc}</p>
                </div>
                {isLoading && <div className="w-5 h-5 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
              </button>
            );
          })}
        </div>

        {connectError && (
          <div className="mt-3 p-2.5 rounded-lg bg-error/10 border border-error/20">
            <p className="text-error text-xs text-center">{connectError}</p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-4 py-2.5 rounded-xl bg-white/5 text-gray-400 font-semibold text-sm active:scale-95 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

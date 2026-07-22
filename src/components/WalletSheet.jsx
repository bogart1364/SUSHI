import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useDisconnect } from 'wagmi';

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

export default function WalletSheet({ open, onClose }) {
  const { ready, authenticated, user, login, connectWallet, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [connectError, setConnectError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (!open) {
      setConnectError('');
      setCopied(false);
      setIsLogging(false);
    }
  }, [open]);

  if (!open) return null;

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

  const handleConnectWallet = async () => {
    setConnectError('');
    setIsLogging(true);
    try {
      await connectWallet();
      onClose();
    } catch (e) {
      setConnectError(e?.message || 'Connection failed');
    } finally {
      setIsLogging(false);
    }
  };

  const handleLoginEmail = async () => {
    setConnectError('');
    setIsLogging(true);
    try {
      await login();
      onClose();
    } catch (e) {
      setConnectError(e?.message || 'Login failed');
    } finally {
      setIsLogging(false);
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
      await logout();
      if (isConnected) disconnect();
      onClose();
    } catch {
      onClose();
    }
  };

  if (isConnected && address) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-success rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Connected</p>
                <p className="text-gray-500 text-xs font-mono">{shortAddr}</p>
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
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
        <div className="p-5">
          <h2 className="text-lg font-bold text-white text-center mb-4">Connect Wallet</h2>

          <div className="space-y-2">
            <button
              disabled={!ready || isLogging}
              className="flex w-full items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98] disabled:opacity-50"
              onClick={handleConnectWallet}
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#F6851B' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M21.2 6.2c-.5-.5-1.2-.8-2-.8H4.8c-.8 0-1.5.3-2 .8-.5.5-.8 1.2-.8 2v8c0 .8.3 1.5.8 2 .5.5 1.2.8 2 .8h14.4c.8 0 1.5-.3 2-.8.5-.5.8-1.2.8-2v-8c0-.8-.3-1.5-.8-2zM12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.5-6H7.5v-1h9v1z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">MetaMask</p>
                <p className="text-gray-500 text-[11px]">Browser extension</p>
              </div>
              {isLogging && <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
            </button>

            <button
              disabled={!ready || isLogging}
              className="flex w-full items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98] disabled:opacity-50"
              onClick={handleLoginEmail}
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#FF007A' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">Email / SMS</p>
                <p className="text-gray-500 text-[11px]">Login without wallet</p>
              </div>
              {isLogging && <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
            </button>
          </div>

          {connectError && (
            <div className="mt-3 p-2.5 rounded-lg bg-error/10 border border-error/20">
              <p className="text-error text-xs text-center">{connectError}</p>
            </div>
          )}

          <p className="text-center text-gray-600 text-[11px] mt-3">
            No wallet? <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-neon">Get one</a>
          </p>
        </div>
      </div>
    </div>
  );
}

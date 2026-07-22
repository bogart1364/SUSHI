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
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && ready && !isConnected) {
      login();
    }
  }, [open, ready]);

  if (!open) return null;

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

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

  return null;
}

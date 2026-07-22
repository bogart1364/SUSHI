import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
  document.body.removeChild(ta); return Promise.resolve();
}

export default function WalletSheet({ open, onClose }) {
  const { address, isConnected } = useAccount();
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open || !isConnected || !address) return null;

  const shortAddr = `${address.slice(0, 6)}…${address.slice(-4)}`;

  const handleCopy = async () => {
    try { await copyToClipboard(address); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const handleDisconnect = async () => {
    try { await logout(); } catch {}
    try { disconnect(); } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
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
          <button onClick={handleDisconnect} className="w-full py-2.5 rounded-lg bg-error/10 border border-error/20 text-error font-semibold text-xs active:scale-[0.98] transition">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}

import { useAccount } from 'wagmi';
import { useState } from 'react';

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
  document.body.removeChild(ta); return Promise.resolve();
}

export default function ReceiveModal({ open, onClose }) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  if (!open || !address) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`;

  const handleCopy = async () => {
    try { await copyToClipboard(address); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
        <h2 className="text-sm font-bold text-white text-center mb-3">Receive ETH</h2>
        <div className="flex justify-center mb-3">
          <div className="bg-white rounded-xl p-2">
            <img src={qrUrl} width="120" height="120" className="rounded-lg" alt="QR" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 mb-3">
          <p className="text-white text-[10px] font-mono text-center break-all">{address}</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={handleCopy} className="py-2 rounded-lg bg-neon text-white font-semibold text-xs active:scale-95 transition">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button onClick={onClose} className="py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-semibold text-xs active:scale-95 transition">Close</button>
        </div>
        <p className="text-center text-gray-600 text-[9px] mt-2">Only send Ethereum (ERC-20) tokens</p>
      </div>
    </div>
  );
}

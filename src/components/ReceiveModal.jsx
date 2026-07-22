import { useAccount } from 'wagmi';
import { useState } from 'react';

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

export default function ReceiveModal({ open, onClose }) {
  const { address } = useAccount();
  const [copied, setCopied] = useState(false);

  if (!open || !address) return null;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;

  const handleCopy = async () => {
    try {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My ETH Address', text: address });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10 p-5">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-4" />
        <h2 className="text-lg font-bold text-white text-center mb-4">Receive ETH</h2>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-2xl p-3">
            <img
              src={qrUrl}
              alt="QR Code"
              width="160"
              height="160"
              className="rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<div style="width:160px;height:160px;display:flex;align-items:center;justify-center;color:#666;font-size:12px">QR unavailable</div>'; }}
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 mb-4">
          <p className="text-gray-500 text-[10px] mb-1 text-center">Your Address</p>
          <p className="text-white text-xs font-mono text-center break-all">{address}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition">
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button onClick={handleShare} className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm active:scale-95 transition">
            Share
          </button>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-3">
          Only send Ethereum (ERC-20) tokens to this address
        </p>
      </div>
    </div>
  );
}

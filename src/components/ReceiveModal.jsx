import { useAccount } from 'wagmi';

export default function ReceiveModal({ open, onClose }) {
  const { address } = useAccount();

  if (!open || !address) return null;

  const shortAddr = `${address.slice(0, 8)}…${address.slice(-6)}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10 p-5">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-4" />
        <h2 className="text-lg font-bold text-white text-center mb-4">Receive ETH</h2>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-2xl p-3">
            <img src={qrUrl} alt="QR Code" width="160" height="160" className="rounded-lg" />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 mb-4">
          <p className="text-gray-500 text-[10px] mb-1 text-center">Your Address</p>
          <p className="text-white text-xs font-mono text-center break-all">{address}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(address)}
            className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition"
          >
            Copy
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'My ETH Address', text: address });
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm active:scale-95 transition"
          >
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

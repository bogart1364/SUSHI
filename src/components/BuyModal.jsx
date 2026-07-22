import { useAccount } from 'wagmi';

const onRamps = [
  { name: 'MoonPay', desc: 'Credit/Debit Card', url: 'https://moonpay.com', color: '#0075EB', icon: 'M' },
  { name: 'Ramp', desc: 'Bank Transfer', url: 'https://ramp.network', color: '#81E9A0', icon: 'R' },
  { name: 'Transak', desc: 'Apple Pay / Google Pay', url: 'https://transak.com', color: '#6C5CE7', icon: 'T' },
  { name: 'Coinbase', desc: 'Buy with Coinbase', url: 'https://coinbase.com', color: '#0052FF', icon: 'C' },
];

export default function BuyModal({ open, onClose }) {
  const { address } = useAccount();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-sm z-10 p-5">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-4" />
        <h2 className="text-lg font-bold text-white text-center mb-4">Buy Crypto</h2>

        <div className="space-y-2 mb-4">
          {onRamps.map((ramp) => (
            <a
              key={ramp.name}
              href={`${ramp.url}?wallet=${address}&currency=ETH`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98]"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: ramp.color }}>
                {ramp.icon}
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">{ramp.name}</p>
                <p className="text-gray-500 text-[11px]">{ramp.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-600">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-white/5 text-gray-400 font-semibold text-sm active:scale-95 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

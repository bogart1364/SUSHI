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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
        <h2 className="text-sm font-bold text-white text-center mb-3">Buy Crypto</h2>
        <div className="space-y-1.5 mb-3">
          {onRamps.map((ramp) => (
            <a key={ramp.name} href={`${ramp.url}?wallet=${address}&currency=ETH`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] transition">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: ramp.color }}>{ramp.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-xs">{ramp.name}</p>
                <p className="text-gray-500 text-[9px]">{ramp.desc}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-gray-600 flex-shrink-0"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-2 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95 transition">Cancel</button>
      </div>
    </div>
  );
}

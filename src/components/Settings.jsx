import { useState, useEffect } from 'react';

export default function Settings({ slippage, setSlippage, deadline, setDeadline }) {
  const [ls, setLs] = useState(String(slippage));
  const [ld, setLd] = useState(String(deadline));
  useEffect(() => { setLs(String(slippage)); setLd(String(deadline)); }, [slippage, deadline]);

  return (
    <div className="w-full space-y-2.5">
      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">Slippage Tolerance</p>
        <div className="flex gap-1.5 mb-2">
          {['0.1', '0.5', '1.0'].map(opt => (
            <button key={opt} onClick={() => { setLs(opt); setSlippage(parseFloat(opt)); }} className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition active:scale-95 ${ls === opt ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>{opt}%</button>
          ))}
          <input value={ls} onChange={e => { setLs(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n) && n >= 0 && n <= 50) setSlippage(n); }} className="w-14 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-[11px] outline-none focus:border-neon/50" placeholder="%" />
        </div>
      </div>
      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">Transaction Deadline</p>
        <div className="flex items-center gap-1.5">
          <input value={ld} onChange={e => { setLd(e.target.value); const n = parseInt(e.target.value, 10); if (!isNaN(n) && n >= 1 && n <= 180) setDeadline(n); }} className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-[11px] outline-none focus:border-neon/50" />
          <span className="text-gray-500 text-[11px]">min</span>
        </div>
      </div>
      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">About</p>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-gray-400">Version</span><span className="text-white">2.0.0</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Networks</span><span className="text-success">ETH / Base / Robinhood</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Slippage</span><span className="text-neon">{slippage}%</span></div>
        </div>
      </div>
    </div>
  );
}

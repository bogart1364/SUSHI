import { useState, useEffect } from 'react';

export default function Settings({ slippage, setSlippage, deadline, setDeadline }) {
  const [localSlippage, setLocalSlippage] = useState(String(slippage));
  const [localDeadline, setLocalDeadline] = useState(String(deadline));

  useEffect(() => { setLocalSlippage(String(slippage)); setLocalDeadline(String(deadline)); }, [slippage, deadline]);

  const handleSlippage = (val) => {
    setLocalSlippage(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 50) setSlippage(num);
  };

  const handleDeadline = (val) => {
    setLocalDeadline(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 180) setDeadline(num);
  };

  return (
    <div className="w-full px-3 space-y-3">
      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">Slippage Tolerance</p>
        <div className="flex gap-1.5 mb-2">
          {['0.1', '0.5', '1.0'].map((opt) => (
            <button key={opt} onClick={() => handleSlippage(opt)} className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition active:scale-95 ${localSlippage === opt ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}>
              {opt}%
            </button>
          ))}
          <input value={localSlippage} onChange={(e) => handleSlippage(e.target.value)} className="w-14 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-[11px] outline-none focus:border-neon/50" placeholder="%" />
        </div>
      </div>

      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">Transaction Deadline</p>
        <div className="flex items-center gap-1.5">
          <input value={localDeadline} onChange={(e) => handleDeadline(e.target.value)} className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-center text-[11px] outline-none focus:border-neon/50" />
          <span className="text-gray-500 text-[11px]">minutes</span>
        </div>
      </div>

      <div className="glass-sushi rounded-2xl p-3.5">
        <p className="text-gray-500 text-[9px] uppercase tracking-wider mb-2">About</p>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-gray-400">Version</span><span className="text-white">1.1.0</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Network</span><span className="text-success">Ethereum</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Slippage</span><span className="text-neon">{slippage}%</span></div>
        </div>
      </div>
    </div>
  );
}

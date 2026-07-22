import { useState, useEffect } from 'react';

const SLIPPAGE_OPTIONS = ['0.1', '0.5', '1.0'];

export default function Settings({ slippage, setSlippage, deadline, setDeadline }) {
  const [localSlippage, setLocalSlippage] = useState(String(slippage));
  const [localDeadline, setLocalDeadline] = useState(String(deadline));

  useEffect(() => {
    setLocalSlippage(String(slippage));
    setLocalDeadline(String(deadline));
  }, [slippage, deadline]);

  const handleSlippageChange = (val) => {
    setLocalSlippage(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 50) {
      setSlippage(num);
    }
  };

  const handleDeadlineChange = (val) => {
    setLocalDeadline(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 180) {
      setDeadline(num);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="glass-sushi rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Slippage Tolerance</p>
        <div className="flex gap-2 mb-3">
          {SLIPPAGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 ${
                localSlippage === opt ? 'bg-neon text-white' : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
              onClick={() => handleSlippageChange(opt)}
            >
              {opt}%
            </button>
          ))}
          <input
            value={localSlippage}
            onChange={(e) => handleSlippageChange(e.target.value)}
            className="w-16 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm outline-none focus:border-neon/50 transition"
            placeholder="%"
          />
        </div>
        <p className="text-gray-600 text-[11px]">Your transaction will revert if the price changes by more than this.</p>
      </div>

      <div className="glass-sushi rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Transaction Deadline</p>
        <div className="flex items-center gap-2">
          <input
            value={localDeadline}
            onChange={(e) => handleDeadlineChange(e.target.value)}
            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm outline-none focus:border-neon/50 transition"
          />
          <span className="text-gray-500 text-sm">minutes</span>
        </div>
        <p className="text-gray-600 text-[11px] mt-2">Your transaction will revert if pending longer than this.</p>
      </div>

      <div className="glass-sushi rounded-2xl p-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">About</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Version</span>
            <span className="text-white">1.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network</span>
            <span className="text-success">Ethereum</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Slippage</span>
            <span className="text-neon">{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Deadline</span>
            <span className="text-neon">{deadline} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

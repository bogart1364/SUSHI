import { useState } from 'react';

export default function Settings() {
  const [slippage, setSlippage] = useState('0.5');
  const [deadline, setDeadline] = useState('30');

  const slippageOptions = ['0.1', '0.5', '1.0'];

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="glass-sushi rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Slippage Tolerance</p>
        <div className="flex gap-2 mb-3">
          {slippageOptions.map((opt) => (
            <button
              key={opt}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 ${
                slippage === opt
                  ? 'bg-neon text-white'
                  : 'bg-white/5 border border-white/10 text-gray-400'
              }`}
              onClick={() => setSlippage(opt)}
            >
              {opt}%
            </button>
          ))}
          <input
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="w-16 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm outline-none focus:border-neon/50 transition"
            placeholder="%"
          />
        </div>
        <p className="text-gray-600 text-[11px]">Your transaction will revert if the price changes unfavorably by more than this percentage.</p>
      </div>

      <div className="glass-sushi rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Transaction Deadline</p>
        <div className="flex items-center gap-2">
          <input
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-sm outline-none focus:border-neon/50 transition"
          />
          <span className="text-gray-500 text-sm">minutes</span>
        </div>
        <p className="text-gray-600 text-[11px] mt-2">Your transaction will revert if it is pending for longer than this time.</p>
      </div>

      <div className="glass-sushi rounded-2xl p-4 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Interface Settings</p>

        <div className="flex items-center justify-between py-2">
          <span className="text-white text-sm">Dark Mode</span>
          <div className="w-10 h-6 bg-neon rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition" />
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-white/5">
          <span className="text-white text-sm">Show Testnets</span>
          <div className="w-10 h-6 bg-white/20 rounded-full relative cursor-pointer">
            <div className="w-5 h-5 bg-gray-400 rounded-full absolute left-0.5 top-0.5 transition" />
          </div>
        </div>
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
            <span className="text-success">Ethereum Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

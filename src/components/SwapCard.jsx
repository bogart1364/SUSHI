import { sanitizeNumeric, fmt } from '../utils/format';
import { useUIStore } from '../state/uiStore';

export default function SwapCard({
  fromToken, toToken, amount, setAmount, balances, switching, swapTokens, loading, executeSwap, getConversion, txHash, setTxHash, error, canSwap, networkFeeUSD, onOpenTokenSheet, isConnected,
}) {
  const pushToast = useUIStore((s) => s.pushToast);

  if (!isConnected) {
    return (
      <div className="w-full mx-auto px-3">
        <div className="glass-sushi rounded-2xl p-6 text-center">
          <svg className="mx-auto mb-2" width="36" height="36" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="12" width="40" height="28" rx="4" stroke="#FF007A" strokeWidth="2" fill="none" />
            <circle cx="36" cy="26" r="4" stroke="#FF007A" strokeWidth="1.5" fill="none" />
            <path d="M12 20h12" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-gray-400 text-sm">Connect wallet to swap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-3">
      <div className="glass-sushi rounded-2xl p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Swap</span>
          <span className="text-[10px] text-gray-600">0.5%</span>
        </div>

        <div className="bg-white/5 rounded-xl p-3 mb-2">
          <div className="flex gap-2 items-center">
            <button onClick={() => onOpenTokenSheet('from')} className="flex items-center gap-1 bg-neon/10 px-2 py-1.5 rounded-lg neon-border active:scale-95 flex-shrink-0">
              <img src={fromToken.logo} className="w-4 h-4 rounded-full" alt="" />
              <span className="font-bold text-[11px] text-white">{fromToken.symbol}</span>
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <input
              className="bg-transparent text-right text-xl outline-none w-full font-bold text-white placeholder-gray-700"
              value={amount}
              onChange={(e) => { setAmount(sanitizeNumeric(e.target.value)); setTxHash(null); }}
              placeholder="0.00"
              inputMode="decimal"
              type="text"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-gray-500">Bal: {fmt(balances[fromToken.symbol])}</span>
            <button onClick={() => { setAmount(String(balances[fromToken.symbol] ?? 0)); setTxHash(null); }} className="text-[9px] font-bold text-neon px-1.5 py-0.5 rounded hover:bg-neon/10">
              MAX
            </button>
          </div>
        </div>

        <div className="flex justify-center -my-1.5 relative z-10">
          <button disabled={switching || loading} onClick={swapTokens} className={`p-1 rounded-lg bg-[#141420] neon-border text-neon transition-all hover:scale-110 active:scale-95 ${(switching || loading) && 'opacity-40'}`}>
            <svg viewBox="0 0 20 20" width="12" height="12">
              <path d="M6 4l-3 3 3 3" stroke="#FF007A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 7h10a3 3 0 0 1 0 6h-1" stroke="#FF007A" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-3 mt-2">
          <div className="flex gap-2 items-center">
            <button onClick={() => onOpenTokenSheet('to')} className="flex items-center gap-1 bg-neon/10 px-2 py-1.5 rounded-lg neon-border active:scale-95 flex-shrink-0">
              <img src={toToken.logo} className="w-4 h-4 rounded-full" alt="" />
              <span className="font-bold text-[11px] text-white">{toToken.symbol}</span>
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <input
              className="bg-transparent text-right text-xl outline-none w-full font-bold text-gray-400 select-none placeholder-gray-700"
              disabled
              value={amount ? (Number(amount) * getConversion()).toFixed(4) : ''}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] text-gray-500 px-0.5">
          <span>1 {fromToken.symbol} ≈ {getConversion().toFixed(4)} {toToken.symbol}</span>
          <span>Fee: ~${networkFeeUSD.toFixed(2)}</span>
        </div>

        {error && <div className="mt-1.5 text-[10px] text-center text-error px-2 py-1 rounded-lg bg-error/10 border border-error/20">{error}</div>}
        {txHash && <div className="mt-1.5 text-[10px] text-center text-success px-2 py-1 rounded-lg bg-success/10 border border-success/20">Success! <span className="font-mono text-[8px]">{txHash.slice(0, 10)}…</span></div>}

        <button
          className={`mt-2.5 w-full py-2 rounded-xl text-xs font-bold transition-all ${!canSwap || loading ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-neon text-white shadow-neon active:scale-[0.98]'}`}
          disabled={!canSwap || loading}
          onClick={async () => { await executeSwap(); if (!error) pushToast({ type: 'success', message: 'Swap submitted.', ttl: 2500 }); }}
        >
          {loading ? 'Swapping…' : !canSwap ? 'Enter amount' : 'Swap'}
        </button>
      </div>
    </div>
  );
}

import GlassContainer from './GlassContainer';
import Loader from './Loader';
import { sanitizeNumeric, fmt } from '../utils/format';
import { useUIStore } from '../state/uiStore';

export default function SwapCard({
  fromToken,
  toToken,
  setFromToken,
  setToToken,
  amount,
  setAmount,
  balances,
  switching,
  swapTokens,
  loading,
  executeSwap,
  getConversion,
  txHash,
  setTxHash,
  error,
  canSwap,
  networkFeeUSD,
  onOpenTokenSheet,
  isConnected,
}) {
  const pushToast = useUIStore((s) => s.pushToast);

  const onAmountChange = (e) => {
    const v = sanitizeNumeric(e.target.value);
    setAmount(v);
    setTxHash(null);
  };

  const onMax = () => {
    const b = balances[fromToken.symbol] ?? 0;
    setAmount(String(b));
    setTxHash(null);
  };

  if (!isConnected) {
    return (
      <GlassContainer className="w-full max-w-md mx-auto px-4 py-6 relative z-20" ariaLabel="Swap section">
        <div className="text-center py-4">
          <svg className="mx-auto mb-2" width="40" height="40" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="12" width="40" height="28" rx="4" stroke="#FF007A" strokeWidth="2" fill="none" />
            <circle cx="36" cy="26" r="4" stroke="#FF007A" strokeWidth="1.5" fill="none" />
            <path d="M12 20h12" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-gray-400 text-sm">Connect wallet to swap</p>
        </div>
      </GlassContainer>
    );
  }

  return (
    <GlassContainer className="w-full max-w-md mx-auto px-4 py-4 relative z-20" ariaLabel="Swap section">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">Swap</span>
        <span className="text-[10px] text-gray-600">0.5%</span>
      </div>

      <div className="bg-white/5 rounded-xl p-3.5 mb-3">
        <div className="flex gap-2 items-center">
          <button
            aria-label="Select from token"
            onClick={() => onOpenTokenSheet('from')}
            className="flex items-center gap-1.5 bg-neon/10 px-2.5 py-1.5 rounded-lg cursor-pointer neon-border active:scale-95"
          >
            <img src={fromToken.logo} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-xs text-white">{fromToken.symbol}</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            className="bg-transparent text-right text-2xl outline-none w-full px-0 font-bold text-white placeholder-gray-700"
            value={amount}
            onChange={onAmountChange}
            placeholder="0.00"
            inputMode="decimal"
            type="text"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-gray-500">Bal: {fmt(balances[fromToken.symbol])}</span>
          <button onClick={onMax} className="text-[10px] font-bold text-neon px-1.5 py-0.5 rounded hover:bg-neon/10">
            MAX
          </button>
        </div>
      </div>

      <div className="flex justify-center my-3 relative z-10">
        <button
          aria-label="Switch tokens"
          disabled={switching || loading}
          onClick={swapTokens}
          className={`p-1.5 rounded-lg bg-[#141420] neon-border text-neon transition-all hover:scale-110 active:scale-95 ${
            (switching || loading) && 'opacity-40 pointer-events-none'
          }`}
        >
          <svg viewBox="0 0 20 20" width={14} height={14}>
            <path d="M6 4l-3 3 3 3" stroke="#FF007A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 7h10a3 3 0 0 1 0 6h-1" stroke="#FF007A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-3.5 mt-3">
        <div className="flex gap-2 items-center">
          <button
            aria-label="Select to token"
            onClick={() => onOpenTokenSheet('to')}
            className="flex items-center gap-1.5 bg-neon/10 px-2.5 py-1.5 rounded-lg cursor-pointer neon-border active:scale-95"
          >
            <img src={toToken.logo} alt={toToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-xs text-white">{toToken.symbol}</span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            className="bg-transparent text-right text-2xl outline-none w-full px-0 font-bold text-gray-400 select-none placeholder-gray-700"
            disabled
            value={amount ? (Number(amount) * getConversion()).toFixed(4) : ''}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500 px-0.5">
        <span>1 {fromToken.symbol} ≈ {getConversion().toFixed(4)} {toToken.symbol}</span>
        <span>Fee: ~${networkFeeUSD.toFixed(2)}</span>
      </div>

      {error && (
        <div className="mt-2 text-[11px] text-center text-error px-2 py-1.5 rounded-lg bg-error/10 border border-error/20">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mt-2 text-[11px] text-center text-success px-2 py-1.5 rounded-lg bg-success/10 border border-success/20">
          Success! <span className="font-mono text-[9px]">{txHash.slice(0, 10)}…</span>
        </div>
      )}

      <button
        className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          !canSwap || loading
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-neon text-white shadow-neon hover:bg-pink-600 active:scale-[0.98]'
        }`}
        disabled={!canSwap || loading}
        onClick={async () => {
          await executeSwap();
          if (!error) {
            pushToast({ type: 'success', message: 'Swap submitted.', ttl: 2500 });
          }
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Swapping…</span>
          </div>
        ) : !canSwap ? (
          'Enter amount'
        ) : (
          'Swap'
        )}
      </button>
    </GlassContainer>
  );
}

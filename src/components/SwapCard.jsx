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
  onOpenTokenSheet
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

  return (
    <GlassContainer className="w-full max-w-md mx-auto px-4 pt-5 pb-6 relative z-20" ariaLabel="Swap section">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Swap</span>
        <span className="text-xs text-gray-600">Slippage: 0.5%</span>
      </div>

      <div className="glass-sushi rounded-2xl p-4 mb-2">
        <div className="flex gap-3 items-center">
          <button
            aria-label="Select from token"
            onClick={() => onOpenTokenSheet('from')}
            className="flex items-center gap-2 bg-neon/10 px-3 py-2 rounded-xl cursor-pointer neon-border hover:shadow-neon transition-all duration-300 active:scale-95"
          >
            <img src={fromToken.logo} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
            <span className="font-bold text-sm text-white">{fromToken.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
            aria-label="Amount to swap"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">Balance: <span className="text-gray-400">{fmt(balances[fromToken.symbol])}</span></span>
          <button onClick={onMax} className="text-xs font-bold text-neon px-2 py-0.5 rounded-md hover:bg-neon/10 transition-colors">
            MAX
          </button>
        </div>
      </div>

      <div className="flex justify-center my-1">
        <button
          aria-label="Switch tokens"
          disabled={switching || loading}
          onClick={swapTokens}
          className={`p-2.5 rounded-xl glass-sushi neon-border text-neon transition-all duration-300 hover:shadow-neon hover:scale-110 active:scale-95 ${
            (switching || loading) && 'opacity-40 pointer-events-none'
          }`}
        >
          <svg viewBox="0 0 20 20" width={18} height={18} aria-hidden="true">
            <path d="M6 4l-3 3 3 3" stroke="#FF007A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 7h10a3 3 0 0 1 0 6h-1" stroke="#FF007A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      </div>

      <div className="glass-sushi rounded-2xl p-4 mt-2">
        <div className="flex gap-3 items-center">
          <button
            aria-label="Select to token"
            onClick={() => onOpenTokenSheet('to')}
            className="flex items-center gap-2 bg-neon/10 px-3 py-2 rounded-xl cursor-pointer neon-border hover:shadow-neon transition-all duration-300 active:scale-95"
          >
            <img src={toToken.logo} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
            <span className="font-bold text-sm text-white">{toToken.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5l3 3 3-3" stroke="#FF007A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <input
            className="bg-transparent text-right text-2xl outline-none w-full px-0 font-bold text-gray-400 select-none placeholder-gray-700"
            disabled
            value={
              amount ? (Number(amount) * getConversion()).toFixed(4) : ''
            }
            placeholder="0.00"
            aria-label="Estimated receive amount"
          />
        </div>
      </div>

      <div className="mt-3 px-1 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Rate</span>
          <span className="text-gray-400">1 {fromToken.symbol} ≈ {getConversion().toFixed(4)} {toToken.symbol}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Network Fee</span>
          <span className="text-gray-400">~ ${networkFeeUSD.toFixed(2)}</span>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-xs text-center text-error px-3 py-2 rounded-xl bg-error/10 border border-error/20">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mt-3 text-xs text-center text-success px-3 py-2 rounded-xl bg-success/10 border border-success/20">
          Swap Success! <span className="font-mono text-[10px]">{txHash.slice(0, 10)}…</span>
        </div>
      )}

      <button
        className={`mt-4 w-full py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ${
          !canSwap || loading
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-neon text-white shadow-neon hover:shadow-neon-lg hover:bg-pink-600 active:scale-[0.98]'
        }`}
        disabled={!canSwap || loading}
        onClick={async () => {
          await executeSwap();
          if (!error) {
            pushToast({ type: 'success', message: 'Swap submitted to network.', ttl: 2500 });
          }
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Swapping…</span>
          </div>
        ) : !canSwap ? (
          'Enter an amount'
        ) : (
          'Swap'
        )}
      </button>
    </GlassContainer>
  );
}

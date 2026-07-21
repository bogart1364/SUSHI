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
    <GlassContainer className="w-full max-w-md mx-auto px-4 pt-4 pb-6 relative z-20" ariaLabel="Swap section">
      <div className="flex gap-2 mb-4">
        <button
          aria-label="Select from token"
          onClick={() => onOpenTokenSheet('from')}
          className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl cursor-pointer border border-border"
        >
          <img src={fromToken.logo} alt={fromToken.symbol} className="w-7 h-7 rounded-full" />
          <span className="font-semibold">{fromToken.symbol}</span>
        </button>
        <input
          className="bg-transparent text-right text-2xl outline-none w-full px-0 font-bold"
          value={amount}
          onChange={onAmountChange}
          placeholder="0.00"
          inputMode="decimal"
          type="text"
          aria-label="Amount to swap"
        />
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
        <span>Balance: {fmt(balances[fromToken.symbol])}</span>
        <button onClick={onMax} className="text-neon px-2 py-1 rounded hover:bg-neon/10">
          MAX
        </button>
      </div>

      <div className="flex justify-center my-2">
        <button
          aria-label="Switch tokens"
          disabled={switching || loading}
          onClick={swapTokens}
          className={`p-2 rounded-full bg-glass border border-border text-neon transition \${
            (switching || loading) && 'opacity-40 pointer-events-none'
          }`}
        >
          <svg viewBox="0 0 22 22" width={22} height={22} aria-hidden="true">
            <path
              d="M5 12l-3 3 3 3"
              stroke="#FF007A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 15h12a4 4 0 0 0 4-4V4"
              stroke="#FF007A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mt-2 mb-3">
        <button
          aria-label="Select to token"
          onClick={() => onOpenTokenSheet('to')}
          className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl cursor-pointer border border-border"
        >
          <img src={toToken.logo} alt={toToken.symbol} className="w-7 h-7 rounded-full" />
          <span className="font-semibold">{toToken.symbol}</span>
        </button>
        <input
          className="bg-transparent text-right text-2xl outline-none w-full px-0 text-gray-500 select-none"
          disabled
          value={
            amount ? (Number(amount) * getConversion()).toFixed(4) : ''
          }
          placeholder="—"
          aria-label="Estimated receive amount"
        />
      </div>

      <div className="mb-2 text-center text-sm text-gray-500">
        {fromToken && toToken && <>1 {fromToken.symbol} ≈ {getConversion().toFixed(4)} {toToken.symbol}</>}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
        <span>Network Fee</span>
        <span>~ \${networkFeeUSD.toFixed(2)} USD</span>
      </div>

      {error && (
        <div className="mt-2 text-xs text-center text-[#ffb3b3]">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mt-3 text-xs text-center text-success">
          Swap Success! Tx: <span className="font-mono">{txHash}</span>
        </div>
      )}

      <button
        className={`mt-4 w-full py-3 rounded-xl text-lg font-bold bg-neon transition text-white shadow-xl \${
          !canSwap || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-pink-700'
        }`}
        disabled={!canSwap || loading}
        onClick={async () => {
          await executeSwap();
          if (!error) {
            pushToast({ type: 'success', message: 'Swap submitted to network.', ttl: 2500 });
          }
        }}
      >
        {loading ? <Loader /> : 'Swap'}
      </button>
    </GlassContainer>
  );
}
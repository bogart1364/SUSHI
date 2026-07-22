import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, isAddress } from 'viem';
import { sanitizeNumeric } from '../utils/format';

export default function SendModal({ open, onClose }) {
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const { data: txHash, sendTransaction, isPending, error: txError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (!open) return null;

  const handleSend = () => {
    setError('');
    if (!to || !isAddress(to)) {
      setError('Invalid Ethereum address');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (Number(amount) > Number(ethBalance?.formatted || 0)) {
      setError('Insufficient balance');
      return;
    }
    try {
      sendTransaction({ to, value: parseEther(amount) });
    } catch {
      setError('Transaction failed to send');
    }
  };

  const handleClose = () => {
    setTo('');
    setAmount('');
    setError('');
    onClose();
  };

  const displayError = txError?.shortMessage || txError?.message || error;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
        <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[90%] max-w-sm z-10 p-5">
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#27C088" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="text-white font-bold text-lg mb-1">Sent!</p>
            <p className="text-gray-500 text-sm mb-3">{amount} ETH</p>
            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-neon text-xs">
              View on Etherscan →
            </a>
            <button onClick={handleClose} className="w-full mt-4 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm active:scale-95 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[90%] max-w-sm z-10 p-5">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-4" />
        <h2 className="text-lg font-bold text-white text-center mb-4">Send ETH</h2>

        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">To Address</label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-neon/50 transition font-mono"
            />
            {to && !isAddress(to) && <p className="text-error text-[10px] mt-1">Invalid address</p>}
          </div>

          <div>
            <label className="text-gray-500 text-xs mb-1 block">Amount (ETH)</label>
            <div className="relative">
              <input
                value={amount}
                onChange={(e) => setAmount(sanitizeNumeric(e.target.value))}
                placeholder="0.0"
                type="text"
                inputMode="decimal"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-neon/50 transition"
              />
              <button
                onClick={() => setAmount(String(Math.max(0, Number(ethBalance?.formatted || 0) - 0.001)))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neon text-xs font-bold px-2 py-1 rounded bg-neon/10"
              >
                MAX
              </button>
            </div>
            <p className="text-gray-600 text-[10px] mt-1">Balance: {Number(ethBalance?.formatted || 0).toFixed(6)} ETH</p>
          </div>
        </div>

        {displayError && (
          <div className="mt-3 p-2 rounded-lg bg-error/10 border border-error/20">
            <p className="text-error text-xs text-center">{displayError}</p>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={isPending || isConfirming || !to || !amount}
          className="w-full mt-4 py-3 rounded-xl bg-neon text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition"
        >
          {isPending ? 'Confirm in wallet…' : isConfirming ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}

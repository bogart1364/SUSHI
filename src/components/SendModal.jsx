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

  const handleClose = () => { setTo(''); setAmount(''); setError(''); onClose(); };
  const displayError = txError?.shortMessage || txError?.message || error;

  const handleSend = () => {
    setError('');
    if (!to || !isAddress(to)) { setError('Invalid address'); return; }
    if (!amount || Number(amount) <= 0) { setError('Enter amount'); return; }
    if (Number(amount) > Number(ethBalance?.formatted || 0)) { setError('Insufficient balance'); return; }
    sendTransaction({ to, value: parseEther(amount) });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-3" />
        <h2 className="text-sm font-bold text-white text-center mb-3">Send ETH</h2>

        {isSuccess ? (
          <div className="text-center py-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27C088" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <p className="text-white font-bold text-sm mb-1">Sent!</p>
            <p className="text-gray-500 text-xs mb-2">{amount} ETH</p>
            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-neon text-[11px]">View on Etherscan</a>
            <button onClick={handleClose} className="w-full mt-3 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs active:scale-95 transition">Close</button>
          </div>
        ) : (
          <>
            <div className="space-y-2.5">
              <div>
                <label className="text-gray-500 text-[10px] mb-0.5 block">To Address</label>
                <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50 font-mono" />
                {to && !isAddress(to) && <p className="text-error text-[9px] mt-0.5">Invalid address</p>}
              </div>
              <div>
                <label className="text-gray-500 text-[10px] mb-0.5 block">Amount (ETH)</label>
                <div className="relative">
                  <input value={amount} onChange={(e) => setAmount(sanitizeNumeric(e.target.value))} placeholder="0.0" inputMode="decimal" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-neon/50" />
                  <button onClick={() => setAmount(String(Math.max(0, Number(ethBalance?.formatted || 0) - 0.001)))} className="absolute right-2 top-1/2 -translate-y-1/2 text-neon text-[9px] font-bold px-1.5 py-0.5 rounded bg-neon/10">MAX</button>
                </div>
                <p className="text-gray-600 text-[9px] mt-0.5">Balance: {Number(ethBalance?.formatted || 0).toFixed(6)} ETH</p>
              </div>
            </div>
            {displayError && <div className="mt-2 p-1.5 rounded-lg bg-error/10 border border-error/20"><p className="text-error text-[10px] text-center">{displayError}</p></div>}
            <button onClick={handleSend} disabled={isPending || isConfirming || !to || !amount} className="w-full mt-3 py-2.5 rounded-xl bg-neon text-white font-bold text-xs disabled:opacity-40 active:scale-[0.98] transition">
              {isPending ? 'Confirm in wallet…' : isConfirming ? 'Sending…' : 'Send'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

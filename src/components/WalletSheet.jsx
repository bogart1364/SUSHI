import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';

export default function WalletSheet({ open, onClose }) {
  const { address, isConnected } = useAccount();
  const { connectWallet, logout } = usePrivy();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
      onClose();
    } catch {
      // Silent fail - wallet connection errors are expected
    }
    setLoading(false);
  };

  const handleDisconnect = async () => {
    try { await logout(); } catch {}
    try { disconnect(); } catch {}
    onClose();
  };

  const short = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        {isConnected && address ? (
          <>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center"><div className="w-2.5 h-2.5 bg-success rounded-full" /></div>
              <div><p className="text-white font-bold text-sm">Connected</p><p className="text-gray-500 text-[11px] font-mono">{short}</p></div>
            </div>
            <button onClick={handleDisconnect} className="w-full py-2.5 rounded-lg bg-error/10 border border-error/20 text-error font-semibold text-xs active:scale-[0.98]">Disconnect</button>
          </>
        ) : (
          <button onClick={handleConnect} disabled={loading} className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm disabled:opacity-50 active:scale-[0.98]">
            {loading ? 'Connecting…' : 'Connect Wallet'}
          </button>
        )}

        <button onClick={onClose} className="w-full mt-2 py-2 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95">Cancel</button>
      </div>
    </div>
  );
}

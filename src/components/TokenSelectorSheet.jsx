import { useState } from 'react';
import { useBalance, useAccount } from 'wagmi';
import { filterTokens, TOKENS } from '../utils/tokens';
import useDebounce from '../hooks/useDebounce';

function TokenRow({ token, address, onSelect }) {
  const { data } = useBalance({
    address,
    token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address,
  });
  const balance = data ? Number(data.formatted).toFixed(token.decimals > 4 ? 4 : token.decimals) : '0';

  return (
    <button
      className="flex w-full items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-neon/5 border border-transparent hover:border-white/10 active:scale-[0.98]"
      onClick={() => onSelect(token)}
    >
      <img src={token.logo} className="w-9 h-9 rounded-full" alt={token.symbol} />
      <div className="text-left flex-1">
        <p className="font-bold text-white text-sm">{token.symbol}</p>
        <p className="text-gray-500 text-xs">{token.name}</p>
      </div>
      <div className="text-right">
        <p className="text-white text-sm font-semibold">{balance}</p>
        <p className="text-gray-600 text-[10px]">{token.decimals} decimals</p>
      </div>
    </button>
  );
}

export default function TokenSelectorSheet({ open, onSelect, onClose, excludeSymbol }) {
  const [q, setQ] = useState('');
  const qd = useDebounce(q, 200);
  const list = filterTokens(qd, excludeSymbol);
  const { address } = useAccount();

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Close token selector"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-[#12121a] rounded-t-3xl border-t border-white/10 max-w-md mx-auto flex flex-col" style={{ height: '70vh' }}>
        <div className="flex items-center justify-between p-6 pb-3 flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Select Token</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full">✕</button>
        </div>
        <div className="px-6 pb-3 flex-shrink-0">
          <input
            autoFocus
            placeholder="Search token…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-600 outline-none focus:border-neon/50 transition"
            aria-label="Search tokens"
          />
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1">
          {list.map((token) => (
            <TokenRow key={token.symbol} token={token} address={address} onSelect={(t) => { onSelect(t); onClose(); }} />
          ))}
          {list.length === 0 && (
            <div className="text-center text-gray-600 py-8 text-sm">No tokens found.</div>
          )}
        </div>
      </div>
    </>
  );
}

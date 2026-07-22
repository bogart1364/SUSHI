import { useState } from 'react';
import { useBalance, useAccount, useChainId } from 'wagmi';
import { TOKENS_BY_CHAIN } from '../utils/tokens';
import useDebounce from '../hooks/useDebounce';

function TokenRow({ token, address, onSelect, chainId }) {
  const { data } = useBalance({
    address,
    token: token.address === '0x0000000000000000000000000000000000000000' ? undefined : token.address,
    chainId,
  });
  const balance = data ? Number(data.formatted).toFixed(token.decimals > 4 ? 4 : token.decimals) : '0';

  return (
    <button
      className="flex w-full items-center gap-2 p-2.5 rounded-xl transition-all hover:bg-neon/5 border border-transparent hover:border-white/10 active:scale-[0.98]"
      onClick={() => onSelect(token)}
    >
      <img src={token.logo} className="w-7 h-7 rounded-full" alt={token.symbol} />
      <div className="text-left flex-1 min-w-0">
        <p className="font-bold text-white text-xs">{token.symbol}</p>
        <p className="text-gray-500 text-[9px] truncate">{token.name}</p>
      </div>
      <p className="text-white text-xs font-semibold flex-shrink-0">{balance}</p>
    </button>
  );
}

export default function TokenSelectorSheet({ open, onSelect, onClose, excludeSymbol }) {
  const [q, setQ] = useState('');
  const qd = useDebounce(q, 200);
  const { address } = useAccount();
  const chainId = useChainId();
  const tokens = TOKENS_BY_CHAIN[chainId] || TOKENS_BY_CHAIN[1];

  const list = tokens.filter((t) => {
    if (t.symbol === excludeSymbol) return false;
    const s = (qd || '').trim().toLowerCase();
    if (!s) return true;
    return t.symbol.toLowerCase().includes(s) || t.name.toLowerCase().includes(s);
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 flex flex-col" style={{ maxWidth: 480, height: '65vh' }}>
        <div className="flex items-center justify-between p-3 border-b border-white/5 flex-shrink-0">
          <h2 className="text-sm font-bold text-white">Select Token</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg w-7 h-7 flex items-center justify-center rounded-full">✕</button>
        </div>
        <div className="px-3 pt-2 pb-1 flex-shrink-0">
          <input autoFocus placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-gray-600 outline-none focus:border-neon/50" />
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,0,122,0.2) transparent' }}>
          {list.map((token) => (
            <TokenRow key={token.symbol} token={token} address={address} chainId={chainId} onSelect={(t) => { onSelect(t); onClose(); }} />
          ))}
          {list.length === 0 && <div className="text-center text-gray-600 py-6 text-xs">No tokens found.</div>}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { filterTokens } from '../utils/tokens';
import useDebounce from '../hooks/useDebounce';

export default function TokenSelectorSheet({ open, onSelect, onClose }) {
  const [q, setQ] = useState('');
  const qd = useDebounce(q, 200);
  const list = filterTokens(qd);

  if (!open) return null;

  return (
    <>
      <button
        aria-label="Close token selector"
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 glass-sushi rounded-t-3xl backdrop-blur-xl max-w-md mx-auto shadow-neon-lg flex flex-col" style={{ height: '70vh' }}>
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke="#FF007A" strokeWidth="1.5" fill="rgba(255,0,122,0.08)" />
              <circle cx="11" cy="11" r="5" stroke="#FF007A" strokeWidth="1" fill="none" opacity="0.5" />
              <circle cx="11" cy="11" r="2" fill="#FF007A" />
            </svg>
            <h2 className="text-lg font-bold tracking-tight text-white">Select Token</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-neon transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-neon/10">✕</button>
        </div>
        <div className="px-6 pb-3 flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              placeholder="Search token…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-sushi neon-border text-sm text-white placeholder-gray-600 outline-none focus:shadow-neon transition-all duration-300"
              aria-label="Search tokens"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1">
          {list.map((token) => (
            <button
              key={token.symbol}
              className="flex w-full items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-neon/5 neon-border hover:shadow-neon active:scale-[0.98] group"
              onClick={() => {
                onSelect(token);
                onClose();
              }}
            >
              <img src={token.logo} className="w-9 h-9 rounded-full ring-1 ring-neon/20" alt={token.symbol} />
              <div className="text-left flex-1">
                <p className="font-bold text-white text-sm">{token.symbol}</p>
                <p className="text-gray-500 text-xs">{token.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">18 decimals</p>
              </div>
            </button>
          ))}
          {list.length === 0 && (
            <div className="text-center text-gray-600 py-8 text-sm">No tokens found.</div>
          )}
        </div>
      </div>
    </>
  );
}

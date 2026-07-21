import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { filterTokens } from '../utils/tokens';
import useDebounce from '../hooks/useDebounce';

export default function TokenSelectorSheet({ open, onSelect, onClose }) {
  const [q, setQ] = useState('');
  const qd = useDebounce(q, 200);
  const list = filterTokens(qd);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close token selector"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Select a token"
            className="fixed left-0 right-0 bottom-0 z-50 bg-glass rounded-t-3xl p-6 pb-8 backdrop-blur-md max-w-md mx-auto"
            initial={{ y: 400 }}
            animate={{ y: 0 }}
            exit={{ y: 400 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold tracking-tight text-white">Select a Token</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <input
              autoFocus
              placeholder="Search by symbol, name, or tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/20 border border-border outline-none"
              aria-label="Search tokens"
            />
            <div className="max-h-[50vh] overflow-y-auto pr-1">
              {list.map((token) => (
                <button
                  key={token.symbol}
                  className="flex w-full items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition"
                  onClick={() => {
                    onSelect(token);
                    onClose();
                  }}
                >
                  <img src={token.logo} className="w-8 h-8 rounded-full" alt={token.symbol} />
                  <span className="font-bold text-white">{token.symbol}</span>
                  <span className="ml-auto text-gray-400">{token.name}</span>
                </button>
              ))}
              {list.length === 0 && (
                <div className="text-center text-gray-400 py-6 text-sm">No tokens found.</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
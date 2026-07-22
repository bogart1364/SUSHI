import { useAccount } from 'wagmi';
import { useSwapState } from '../hooks/useSwapState';

function formatPrice(price) {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function formatChange(change) {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export default function TokenDetail({ token, open, onClose, onTrade }) {
  const { isConnected } = useAccount();
  const swap = useSwapState();

  if (!open || !token) return null;

  const handleTrade = () => {
    if (token.symbol === 'SUSHI') return;
    swap.setToToken({
      symbol: token.symbol,
      name: token.name,
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      decimals: 18,
      logo: token.logo,
    });
    onTrade?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 mx-auto bg-[#141420] rounded-t-2xl border-t border-white/10 p-4 pb-6 max-h-[85vh] overflow-y-auto scroll-area" style={{ maxWidth: 480 }}>
        <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center gap-3 mb-4">
          <img
            src={token.logo}
            alt={token.symbol}
            className="w-12 h-12 rounded-full"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-lg">{token.symbol}</h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-white/10 text-gray-400">{token.category}</span>
            </div>
            <p className="text-gray-500 text-xs">{token.name}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <p className="text-white font-bold text-2xl">{formatPrice(token.price)}</p>
          <p className={`text-sm font-semibold ${token.change24h >= 0 ? 'text-success' : 'text-error'}`}>
            {formatChange(token.change24h)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Market Cap</p>
            <p className="text-white font-semibold text-xs">{token.marketCap}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">24h Volume</p>
            <p className="text-white font-semibold text-xs">{token.volume24h}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">Circulating Supply</p>
            <p className="text-white font-semibold text-xs">{token.supply}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-gray-500 text-[9px] mb-0.5">52W Range</p>
            <p className="text-white font-semibold text-xs">{token.low52w} - {token.high52w}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-[10px] mb-2">About {token.name}</p>
          <p className="text-gray-400 text-[11px] leading-relaxed">{token.description}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-[10px] mb-2">Price Chart (24h)</p>
          <div className="h-24 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
            <div className="flex items-end gap-0.5 h-16">
              {[35, 42, 38, 55, 48, 62, 58, 72, 65, 78, 70, 85, 82, 88, 80, 92, 85, 95, 88, 92].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-sm ${token.change24h >= 0 ? 'bg-success/60' : 'bg-error/60'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {token.symbol !== 'SUSHI' ? (
            <button
              onClick={handleTrade}
              className="w-full py-3 rounded-xl bg-neon text-white font-bold text-sm active:scale-[0.98] transition"
            >
              Trade {token.symbol} with SUSHI
            </button>
          ) : (
            <div className="w-full py-3 rounded-xl bg-white/5 text-gray-500 text-xs text-center font-medium">
              You are viewing SUSHI
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://robinhood.com/us/en/about/crypto/${token.symbol.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
            >
              View on Robinhood
            </a>
            <a
              href={`https://www.coingecko.com/en/coins/${token.name.toLowerCase().replace(/\s+/g, '-')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium text-center active:scale-95 transition"
            >
              CoinGecko
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/5 text-gray-400 font-semibold text-xs active:scale-95 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

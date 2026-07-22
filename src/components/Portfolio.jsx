import { useAccount } from 'wagmi';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', balance: '1.4521', value: '$4,647.52', change: '+2.3%', color: '#627EEA', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'SUSHI', name: 'SushiToken', balance: '1,250.00', value: '$1,250.00', change: '-1.2%', color: '#FF007A', logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { symbol: 'USDT', name: 'Tether USD', balance: '729.50', value: '$729.50', change: '+0.01%', color: '#26A17B', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

export default function Portfolio() {
  const { isConnected } = useAccount();

  const totalValue = '$6,627.02';

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="glass-sushi rounded-2xl p-5 mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Balance</p>
        <p className="text-3xl font-bold text-white">{totalValue}</p>
        <p className="text-success text-sm mt-1">+$142.30 (2.18%) today</p>
      </div>

      <div className="flex gap-2 mb-5">
        <button className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition">
          Buy
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">
          Send
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">
          Receive
        </button>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Assets</p>

      <div className="space-y-2">
        {tokens.map((token) => (
          <div key={token.symbol} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <img src={token.logo} alt={token.symbol} className="w-9 h-9 rounded-full" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{token.symbol}</p>
              <p className="text-gray-500 text-xs">{token.name}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-sm">{token.balance}</p>
              <p className={`text-xs ${token.change.startsWith('+') ? 'text-success' : 'text-error'}`}>{token.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

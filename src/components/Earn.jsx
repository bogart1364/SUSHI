const pools = [
  { pair: 'ETH/SUSHI', apr: '12.5%', tvl: '$4.2M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
  { pair: 'ETH/USDT', apr: '8.3%', tvl: '$12.8M', logo1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { pair: 'SUSHI/USDT', apr: '18.7%', tvl: '$1.1M', logo1: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', logo2: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

const farms = [
  { token: 'SUSHI', apr: '25.4%', earned: '42.5', staked: '500', logo: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png' },
];

export default function Earn() {
  return (
    <div className="max-w-md mx-auto w-full px-4 pt-2">
      <div className="flex gap-2 mb-5">
        <button className="flex-1 py-2.5 rounded-xl bg-neon text-white font-semibold text-sm active:scale-95 transition">
          Pools
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-95 transition">
          Farms
        </button>
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Liquidity Pools</p>

      <div className="space-y-2 mb-6">
        {pools.map((pool) => (
          <div key={pool.pair} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <img src={pool.logo1} alt="" className="w-7 h-7 rounded-full border-2 border-[#141420]" />
                <img src={pool.logo2} alt="" className="w-7 h-7 rounded-full border-2 border-[#141420]" />
              </div>
              <span className="text-white font-bold text-sm">{pool.pair}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">APR: <span className="text-success">{pool.apr}</span></span>
              <span className="text-gray-500">TVL: <span className="text-gray-400">{pool.tvl}</span></span>
            </div>
            <button className="w-full mt-2.5 py-2 rounded-lg bg-neon/10 border border-neon/20 text-neon font-semibold text-xs active:scale-95 transition">
              Add Liquidity
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Your Farms</p>

      <div className="space-y-2">
        {farms.map((farm) => (
          <div key={farm.token} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <img src={farm.logo} alt={farm.token} className="w-7 h-7 rounded-full" />
              <span className="text-white font-bold text-sm">{farm.token}</span>
              <span className="ml-auto text-success text-xs font-semibold">APR {farm.apr}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-gray-500">Earned</p>
                <p className="text-white font-semibold">{farm.earned} SUSHI</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2">
                <p className="text-gray-500">Staked</p>
                <p className="text-white font-semibold">{farm.staked} SUSHI</p>
              </div>
            </div>
            <button className="w-full mt-2.5 py-2 rounded-lg bg-neon text-white font-semibold text-xs active:scale-95 transition">
              Harvest
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

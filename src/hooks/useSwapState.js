import { useCallback, useMemo, useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { TOKENS_BY_CHAIN } from '../utils/tokens';
import { getTokenPrice } from '../services/dexScreener';

export function useSwapState() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const tokens = TOKENS_BY_CHAIN[chainId] || TOKENS_BY_CHAIN[1];

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amount, setAmount] = useState('');
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);
  const [prices, setPrices] = useState({});

  // Fetch real prices from DexScreener
  useEffect(() => {
    async function loadPrices() {
      try {
        const priceSymbols = ['ETH', 'WETH', 'SUSHI', 'USDC', 'USDT', 'WBTC', 'DAI'];
        const entries = await Promise.allSettled(
          priceSymbols.map(async (sym) => {
            const price = await getTokenPrice(sym);
            return [sym, price];
          })
        );
        const newPrices = {};
        entries.forEach(e => {
          if (e.status === 'fulfilled' && e.value[1] > 0) {
            newPrices[e.value[0]] = e.value[1];
          }
        });
        if (Object.keys(newPrices).length > 0) {
          setPrices(prev => ({ ...prev, ...newPrices }));
        }
      } catch { /* silent */ }
    }
    loadPrices();
    const id = setInterval(loadPrices, 60_000);
    return () => clearInterval(id);
  }, []);

  const { data: ethBalance } = useBalance({ address, watch: true, enabled: !!address });
  const { data: token2Balance } = useBalance({ address, token: tokens[1]?.address === '0x0000000000000000000000000000000000000000' ? undefined : tokens[1]?.address, watch: true, enabled: !!address });
  const { data: token3Balance } = useBalance({ address, token: tokens[2]?.address === '0x0000000000000000000000000000000000000000' ? undefined : tokens[2]?.address, watch: true, enabled: !!address });
  const { data: token4Balance } = useBalance({ address, token: tokens[3]?.address === '0x0000000000000000000000000000000000000000' ? undefined : tokens[3]?.address, watch: true, enabled: !!address });
  const { data: token5Balance } = useBalance({ address, token: tokens[4]?.address === '0x0000000000000000000000000000000000000000' ? undefined : tokens[4]?.address, watch: true, enabled: !!address });

  const balances = useMemo(() => ({
    [tokens[0]?.symbol]: ethBalance ? Number(ethBalance.formatted) : 0,
    [tokens[1]?.symbol]: token2Balance ? Number(token2Balance.formatted) : 0,
    [tokens[2]?.symbol]: token3Balance ? Number(token3Balance.formatted) : 0,
    [tokens[3]?.symbol]: token4Balance ? Number(token4Balance.formatted) : 0,
    [tokens[4]?.symbol]: token5Balance ? Number(token5Balance.formatted) : 0,
  }), [ethBalance, token2Balance, token3Balance, token4Balance, token5Balance, tokens]);

  const getConversion = useCallback(() => {
    const from = fromToken.symbol;
    const to = toToken.symbol;

    if (from === to) return 1;

    // Same underlying asset (ETH/WETH)
    if ((from === 'ETH' && to === 'WETH') || (from === 'WETH' && to === 'ETH')) return 1;

    // Get prices from DexScreener
    const fromPrice = prices[from] || 0;
    const toPrice = prices[to] || 0;

    if (fromPrice > 0 && toPrice > 0) {
      return fromPrice / toPrice;
    }

    // Fallback: hardcoded rates
    const fallbackRates = {
      'ETH->USDC': 3200, 'ETH->USDT': 3200, 'ETH->DAI': 3200,
      'ETH->SUSHI': 12.3, 'ETH->WBTC': 0.000031,
      'USDC->ETH': 1 / 3200, 'USDT->ETH': 1 / 3200, 'DAI->ETH': 1 / 3200,
      'SUSHI->ETH': 1 / 12.3, 'WBTC->ETH': 32000,
      'USDC->USDT': 1, 'USDC->DAI': 1, 'USDT->DAI': 1,
    };

    return fallbackRates[`${from}->${to}`] || 1;
  }, [fromToken.symbol, toToken.symbol, prices]);

  const maxAmount = useMemo(() => {
    const bal = balances[fromToken.symbol] ?? 0;
    return fromToken.symbol === 'ETH' ? Math.max(0, bal - 0.001) : bal;
  }, [balances, fromToken.symbol]);

  const canSwap = useMemo(() => {
    if (!isConnected) return false;
    const a = Number(amount || 0);
    if (!amount || Number.isNaN(a) || a < 0.00001 || a > maxAmount) return false;
    if (fromToken.symbol === toToken.symbol) return false;
    return true;
  }, [amount, maxAmount, fromToken.symbol, toToken.symbol, isConnected]);

  const swapTokens = () => {
    if (loading) return;
    setSwitching(true);
    setTimeout(() => {
      setFromToken(toToken);
      setToToken(fromToken);
      setAmount('');
      setError('');
      setTxHash(null);
      setSwitching(false);
    }, 300);
  };

  const executeSwap = async () => {
    setError('');
    if (!canSwap) { setError('Invalid amount or same token pair.'); return false; }
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 350 + Math.random() * 1200));
      const fakeHash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
      setTxHash(fakeHash);
      setAmount('');
      setLoading(false);
      return true;
    } catch {
      setError('Swap failed. Please try again.');
      setLoading(false);
      return false;
    }
  };

  const networkFeeUSD = useMemo(() => {
    const ethPrice = prices.ETH || 3200;
    return 0.0001 * ethPrice;
  }, [prices]);

  return { fromToken, toToken, setFromToken, setToToken, amount, setAmount, balances, switching, swapTokens, loading, executeSwap, getConversion, txHash, setTxHash, error, canSwap, networkFeeUSD, isConnected, slippage, setSlippage, deadline, setDeadline, prices };
}

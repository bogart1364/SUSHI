import { useCallback, useMemo, useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { TOKENS } from '../utils/tokens';

const GAS_USD = 0.35;

function useTokenBalance(symbol, address) {
  const isETH = symbol === 'ETH';
  const token = TOKENS.find((t) => t.symbol === symbol);
  const { data } = useBalance({
    address,
    token: isETH ? undefined : token?.address,
    watch: true,
    enabled: !!address,
  });
  return data ? Number(data.formatted) : 0;
}

export function useSwapState() {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');

  const ethBalance = useTokenBalance('ETH', address);
  const sushiBalance = useTokenBalance('SUSHI', address);
  const usdtBalance = useTokenBalance('USDT', address);

  const balances = useMemo(() => ({
    ETH: ethBalance,
    SUSHI: sushiBalance,
    USDT: usdtBalance,
  }), [ethBalance, sushiBalance, usdtBalance]);

  const getConversion = useCallback(() => {
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'SUSHI') return 12.3;
    if (fromToken.symbol === 'SUSHI' && toToken.symbol === 'ETH') return 1 / 12.3;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDT') return 3200;
    if (fromToken.symbol === 'USDT' && toToken.symbol === 'ETH') return 1 / 3200;
    return 1;
  }, [fromToken.symbol, toToken.symbol]);

  const minAmount = 0.00001;
  const maxAmount = useMemo(() => balances[fromToken.symbol] ?? 0, [balances, fromToken.symbol]);

  const canSwap = useMemo(() => {
    if (!isConnected) return false;
    const a = Number(amount || 0);
    if (!amount || Number.isNaN(a)) return false;
    if (a < minAmount) return false;
    if (a > maxAmount) return false;
    if (fromToken.symbol === toToken.symbol) return false;
    return true;
  }, [amount, maxAmount, fromToken.symbol, toToken.symbol, isConnected]);

  const networkFeeUSD = GAS_USD;

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
    if (!canSwap) {
      setError('Invalid amount or same token pair.');
      return;
    }
    const a = Number(amount);
    if (a > (balances[fromToken.symbol] ?? 0)) {
      setError('Insufficient balance.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 350 + Math.random() * 1200));
      const out = a * getConversion();
      setTxHash('0x' + crypto.getRandomValues(new Uint32Array(4)).join(''));
      setAmount('');
    } catch (e) {
      setError('Swap failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    amount,
    setAmount,
    balances,
    switching,
    swapTokens,
    loading,
    executeSwap,
    getConversion,
    txHash,
    setTxHash,
    error,
    canSwap,
    networkFeeUSD,
    isConnected,
  };
}

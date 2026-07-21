import { useCallback, useMemo, useState } from 'react';
import { TOKENS } from '../utils/tokens';

const GAS_USD = 0.35;

export function useSwapState() {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [balances, setBalances] = useState({ ETH: 1.4, SUSHI: 1000, USDT: 729 });
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');

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
    const a = Number(amount || 0);
    if (!amount || Number.isNaN(a)) return false;
    if (a < minAmount) return false;
    if (a > maxAmount) return false;
    if (fromToken.symbol === toToken.symbol) return false;
    return true;
  }, [amount, maxAmount, fromToken.symbol, toToken.symbol]);

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
      setBalances((prev) => ({
        ...prev,
        [fromToken.symbol]: Number((prev[fromToken.symbol] - a).toFixed(8)),
        [toToken.symbol]: Number((prev[toToken.symbol] + out).toFixed(8))
      }));
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
    networkFeeUSD
  };
}
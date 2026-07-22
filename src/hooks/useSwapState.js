import { useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { TOKENS } from '../utils/tokens';

const GAS_USD = 0.35;

export function useSwapState() {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(30);

  const { data: ethBalance } = useBalance({
    address,
    watch: true,
    enabled: !!address,
  });

  const { data: sushiBalance } = useBalance({
    address,
    token: TOKENS[1].address,
    watch: true,
    enabled: !!address,
  });

  const { data: usdtBalance } = useBalance({
    address,
    token: TOKENS[2].address,
    watch: true,
    enabled: !!address,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: TOKENS[3].address,
    watch: true,
    enabled: !!address,
  });

  const { data: wbtcBalance } = useBalance({
    address,
    token: TOKENS[4].address,
    watch: true,
    enabled: !!address,
  });

  const balances = useMemo(() => ({
    ETH: ethBalance ? Number(ethBalance.formatted) : 0,
    SUSHI: sushiBalance ? Number(sushiBalance.formatted) : 0,
    USDT: usdtBalance ? Number(usdtBalance.formatted) : 0,
    USDC: usdcBalance ? Number(usdcBalance.formatted) : 0,
    WBTC: wbtcBalance ? Number(wbtcBalance.formatted) : 0,
  }), [ethBalance, sushiBalance, usdtBalance, usdcBalance, wbtcBalance]);

  const getConversion = useCallback(() => {
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'SUSHI') return 12.3;
    if (fromToken.symbol === 'SUSHI' && toToken.symbol === 'ETH') return 1 / 12.3;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDT') return 3200;
    if (fromToken.symbol === 'USDT' && toToken.symbol === 'ETH') return 1 / 3200;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDC') return 3200;
    if (fromToken.symbol === 'USDC' && toToken.symbol === 'ETH') return 1 / 3200;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'WBTC') return 0.000031;
    if (fromToken.symbol === 'WBTC' && toToken.symbol === 'ETH') return 32000;
    return 1;
  }, [fromToken.symbol, toToken.symbol]);

  const minAmount = 0.00001;
  const maxAmount = useMemo(() => {
    const bal = balances[fromToken.symbol] ?? 0;
    if (fromToken.symbol === 'ETH') {
      return Math.max(0, bal - 0.001);
    }
    return bal;
  }, [balances, fromToken.symbol]);

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
      return false;
    }
    const a = Number(amount);
    if (a > (balances[fromToken.symbol] ?? 0)) {
      setError('Insufficient balance.');
      return false;
    }
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 350 + Math.random() * 1200));
      const fakeHash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
      setTxHash(fakeHash);
      setAmount('');
      setLoading(false);
      return true;
    } catch (e) {
      setError('Swap failed. Please try again.');
      setLoading(false);
      return false;
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
    slippage,
    setSlippage,
    deadline,
    setDeadline,
  };
}

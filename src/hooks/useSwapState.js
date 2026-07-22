import { useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { TOKENS_BY_CHAIN } from '../utils/tokens';

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
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDC') return 3200;
    if (fromToken.symbol === 'USDC' && toToken.symbol === 'ETH') return 1 / 3200;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'DAI') return 3200;
    if (fromToken.symbol === 'DAI' && toToken.symbol === 'ETH') return 1 / 3200;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') return 1;
    if (fromToken.symbol === 'WETH' && toToken.symbol === 'ETH') return 1;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'SUSHI') return 12.3;
    if (fromToken.symbol === 'SUSHI' && toToken.symbol === 'ETH') return 1 / 12.3;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'USDT') return 3200;
    if (fromToken.symbol === 'USDT' && toToken.symbol === 'ETH') return 1 / 3200;
    if (fromToken.symbol === 'ETH' && toToken.symbol === 'WBTC') return 0.000031;
    if (fromToken.symbol === 'WBTC' && toToken.symbol === 'ETH') return 32000;
    return 1;
  }, [fromToken.symbol, toToken.symbol]);

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

  return { fromToken, toToken, setFromToken, setToToken, amount, setAmount, balances, switching, swapTokens, loading, executeSwap, getConversion, txHash, setTxHash, error, canSwap, networkFeeUSD: 0.35, isConnected, slippage, setSlippage, deadline, setDeadline };
}

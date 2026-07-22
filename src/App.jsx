import './index.css';
import { useState, useEffect } from 'react';
import { useSwapState } from './hooks/useSwapState';
import SwapCard from './components/SwapCard';
import TokenSelectorSheet from './components/TokenSelectorSheet';
import WalletSheet from './components/WalletSheet';
import SendModal from './components/SendModal';
import ReceiveModal from './components/ReceiveModal';
import BuyModal from './components/BuyModal';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import Portfolio from './components/Portfolio';
import Earn from './components/Earn';
import Settings from './components/Settings';
import { useUIStore } from './state/uiStore';

function App() {
  const swap = useSwapState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState('from');
  const [walletOpen, setWalletOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);

  const active = useUIStore((s) => s.activeTab);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [active]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-apple flex flex-col">
      <Header onOpenWallet={() => setWalletOpen(true)} />

      <main className="flex-1 flex flex-col items-center pt-3 pb-20 overflow-y-auto">
        {active === 'Swap' && <SwapCard {...swap} onOpenTokenSheet={(t) => { setSheetType(t); setSheetOpen(true); }} />}
        {active === 'Portfolio' && <Portfolio onOpenSend={() => setSendOpen(true)} onOpenReceive={() => setReceiveOpen(true)} onOpenBuy={() => setBuyOpen(true)} />}
        {active === 'Earn' && <Earn />}
        {active === 'Settings' && <Settings slippage={swap.slippage} setSlippage={swap.setSlippage} deadline={swap.deadline} setDeadline={swap.setDeadline} />}
      </main>

      <TokenSelectorSheet open={sheetOpen} onSelect={(t) => { if (sheetType === 'from') swap.setFromToken(t); else swap.setToToken(t); }} onClose={() => setSheetOpen(false)} excludeSymbol={sheetType === 'from' ? swap.toToken.symbol : swap.fromToken.symbol} />
      <WalletSheet open={walletOpen} onClose={() => setWalletOpen(false)} />
      <SendModal open={sendOpen} onClose={() => setSendOpen(false)} />
      <ReceiveModal open={receiveOpen} onClose={() => setReceiveOpen(false)} />
      <BuyModal open={buyOpen} onClose={() => setBuyOpen(false)} />

      <BottomNav />
      <Toast />
    </div>
  );
}

export default App;

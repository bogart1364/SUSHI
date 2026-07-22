import './index.css';
import { useState } from 'react';
import { useSwapState } from './hooks/useSwapState';
import SwapCard from './components/SwapCard';
import TokenSelectorSheet from './components/TokenSelectorSheet';
import WalletSheet from './components/WalletSheet';
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

  const active = useUIStore((s) => s.activeTab);

  const handleOpenSheet = (type) => {
    setSheetType(type);
    setSheetOpen(true);
  };

  const handleSelectToken = (token) => {
    if (sheetType === 'from') swap.setFromToken(token);
    else swap.setToToken(token);
  };

  return (
    <div className="bg-primary min-h-screen font-apple flex flex-col items-center bg-radial-glow">
      <Header onOpenWallet={() => setWalletOpen(true)} />

      <main className="flex-1 w-full flex flex-col justify-start px-3 gap-7 max-w-md mx-auto pt-4 pb-28">
        {active === 'Swap' && <SwapCard {...swap} onOpenTokenSheet={handleOpenSheet} />}
        {active === 'Portfolio' && <Portfolio />}
        {active === 'Earn' && <Earn />}
        {active === 'Settings' && <Settings />}
      </main>

      <TokenSelectorSheet open={sheetOpen} onSelect={handleSelectToken} onClose={() => setSheetOpen(false)} />
      <WalletSheet open={walletOpen} onClose={() => setWalletOpen(false)} />

      <BottomNav />
      <Toast />
    </div>
  );
}

export default App;

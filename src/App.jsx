import './index.css';
import { useState } from 'react';
import { useSwapState } from './hooks/useSwapState';
import SwapCard from './components/SwapCard';
import TokenSelectorSheet from './components/TokenSelectorSheet';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import { useUIStore } from './state/uiStore';

function Placeholder({ title }) {
  return (
    <div className="max-w-md mx-auto w-full pt-12">
      <div className="text-center text-gray-400">{title} — Coming Soon</div>
    </div>
  );
}

function App() {
  const swap = useSwapState();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetType, setSheetType] = useState('from');

  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('0xaF7F2B3C9d12f19bE2F8');

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
    <div
      className="bg-primary min-h-screen font-apple flex flex-col items-center bg-radial-glow"
      style={{ paddingBottom: '80px' }}
    >
      <Header connected={connected} address={address} onConnect={() => setConnected(!connected)} />

      <main className="flex-1 w-full flex flex-col justify-center px-3 gap-7 max-w-md mx-auto pb-6">
        {active === 'Swap' && <SwapCard {...swap} onOpenTokenSheet={handleOpenSheet} />}
        {active !== 'Swap' && <Placeholder title={active} />}
      </main>

      <TokenSelectorSheet open={sheetOpen} onSelect={handleSelectToken} onClose={() => setSheetOpen(false)} />

      <BottomNav />
      <Toast />
    </div>
  );
}

export default App;
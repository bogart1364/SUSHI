import { useUIStore } from '../state/uiStore';

const SwapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const PoolIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="12" r="5" />
    <circle cx="16" cy="12" r="5" />
    <path d="M11 10c1-1 3-1 4 0M11 14c1 1 3 1 4 0" />
  </svg>
);

const FarmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18c2-6 8-12 16-14-2 8-8 14-16 14z" />
    <circle cx="16" cy="6" r="1.5" fill="currentColor" />
  </svg>
);

const SettingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

const items = [
  { icon: SwapIcon, text: 'Swap', id: 'Swap' },
  { icon: PoolIcon, text: 'Liquidity', id: 'Portfolio' },
  { icon: FarmIcon, text: 'Earn', id: 'Earn' },
  { icon: SettingIcon, text: 'Settings', id: 'Settings' },
];

export default function BottomNav() {
  const active = useUIStore((s) => s.activeTab);
  const setActive = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-5 left-0 right-0 z-50 max-w-md mx-auto flex justify-around items-center px-6">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center gap-0.5 transition-all duration-200 px-3 py-1.5 rounded-xl ${
              isActive ? 'text-neon bg-neon/10' : 'text-gray-600'
            }`}
          >
            <Icon />
            <span className={`text-[9px] font-semibold tracking-wide ${isActive ? 'text-neon' : ''}`}>
              {item.text}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

import { useUIStore } from '../state/uiStore';

const SwapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const PortfolioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 10h20" />
    <path d="M12 4v16" />
  </svg>
);

const EarnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9.5c0-1.38 1.34-2.5 3-2.5s3 1.12 3 2.5-1.34 2.5-3 2.5-3 1.12-3 2.5 1.34 2.5 3 2.5" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const items = [
  { icon: SwapIcon, text: 'Swap' },
  { icon: PortfolioIcon, text: 'Portfolio' },
  { icon: EarnIcon, text: 'Earn' },
  { icon: SettingsIcon, text: 'Settings' }
];

export default function BottomNav() {
  const active = useUIStore((s) => s.activeTab);
  const setActive = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto flex bg-black/60 border-t border-border backdrop-blur-md shadow-xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.text}
            onClick={() => setActive(item.text)}
            className={`flex-1 py-3 flex flex-col items-center font-medium transition ${
              active === item.text ? 'text-neon' : 'text-gray-400'
            }`}
            aria-current={active === item.text ? 'page' : undefined}
          >
            <span className="mb-1">
              <Icon />
            </span>
            <span className="text-xs">{item.text}</span>
          </button>
        );
      })}
    </nav>
  );
}

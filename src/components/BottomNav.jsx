import { useUIStore } from '../state/uiStore';

const SushiSwapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M11 9.5c1.5-1 3.5-1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 14.5c1.5 1 3.5 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const BentoBoxIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="3" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const SashimiIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 18c2-6 8-12 16-14-2 8-8 14-16 14z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <circle cx="16" cy="6" r="1" fill="currentColor" opacity="0.5" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const items = [
  { icon: SushiSwapIcon, text: 'Swap' },
  { icon: BentoBoxIcon, text: 'Portfolio' },
  { icon: SashimiIcon, text: 'Earn' },
  { icon: SettingsIcon, text: 'Settings' }
];

export default function BottomNav() {
  const active = useUIStore((s) => s.activeTab);
  const setActive = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 max-w-md mx-auto flex justify-around items-center px-8">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.text;
        return (
          <button
            key={item.text}
            onClick={() => setActive(item.text)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-neon scale-110' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon />
            <span className="text-[10px] font-medium">{item.text}</span>
          </button>
        );
      })}
    </nav>
  );
}

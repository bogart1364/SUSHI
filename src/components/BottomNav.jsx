import { useUIStore } from '../state/uiStore';

const SushiSwapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M11 9.5c1.5-1 3.5-1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 14.5c1.5 1 3.5 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="6" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
  </svg>
);

const BentoBoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="3" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="7.5" cy="7.5" r="2" fill="currentColor" opacity="0.4" />
    <rect x="14" y="5" width="5" height="4" rx="1" fill="currentColor" opacity="0.3" />
    <path d="M5 14h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <path d="M14 14c0 3 2 4 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
  </svg>
);

const SashimiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 18c2-6 8-12 16-14-2 8-8 14-16 14z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    <path d="M8 14c2-3 5-6 8-8" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <circle cx="16" cy="6" r="1" fill="currentColor" opacity="0.5" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto flex bg-sushiCard/90 border-t border-neon/10 backdrop-blur-xl shadow-neon">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.text;
        return (
          <button
            key={item.text}
            onClick={() => setActive(item.text)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive
                ? 'text-neon'
                : 'text-gray-500 hover:text-gray-300'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,0,122,0.5)]' : ''}`}>
              <Icon />
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'neon-text' : ''}`}>
              {item.text}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

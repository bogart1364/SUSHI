import { useUIStore } from '../state/uiStore';

const icons = {
  Swap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M11 9.5c1.5-1 3.5-1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 14.5c1.5 1 3.5 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  Portfolio: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="3" y1="12" x2="12" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  Earn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 18c2-6 8-12 16-14-2 8-8 14-16 14z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  Settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
};

export default function BottomNav() {
  const active = useUIStore((s) => s.activeTab);
  const setActive = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div className="mx-auto flex justify-around items-center py-2 bg-[#12121a]/95 backdrop-blur-xl rounded-xl border border-white/5" style={{ maxWidth: 480 }}>
        {Object.keys(icons).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${active === key ? 'text-neon' : 'text-gray-600'}`}
          >
            {icons[key]}
            <span className="text-[9px] font-medium">{key}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

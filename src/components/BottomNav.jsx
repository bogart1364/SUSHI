import { useUIStore } from '../state/uiStore';

const items = [
  { icon: '🔄', text: 'Swap' },
  { icon: '💼', text: 'Portfolio' },
  { icon: '💰', text: 'Earn' },
  { icon: '⚙️', text: 'Settings' }
];

export default function BottomNav() {
  const active = useUIStore((s) => s.activeTab);
  const setActive = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto flex bg-black/60 border-t border-border backdrop-blur-md shadow-xl">
      {items.map((item) => (
        <button
          key={item.text}
          onClick={() => setActive(item.text)}
          className={`flex-1 py-3 flex flex-col items-center font-medium transition \${
            active === item.text ? 'text-neon' : 'text-gray-400'
          }`}
          aria-current={active === item.text ? 'page' : undefined}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs">{item.text}</span>
        </button>
      ))}
    </nav>
  );
}
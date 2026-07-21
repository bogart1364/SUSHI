import { useEffect } from 'react';
import { useUIStore } from '../state/uiStore';

export default function Toast() {
  const toasts = useUIStore((s) => s.toasts);
  const remove = useUIStore((s) => s.removeToast);

  useEffect(() => {
    const timers = toasts.map((t) => setTimeout(() => remove(t.id), t.ttl ?? 3000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] space-y-2 w-[90%] max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg ${
            t.type === 'error' ? 'bg-[#2b0b10]/80 border-[#ff4d4f]/30' : 'bg-glass border-border'
          }`}
        >
          <p className="text-sm">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
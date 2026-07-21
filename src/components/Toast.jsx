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
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] space-y-2 w-[90%] max-w-md pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`px-4 py-3 rounded-2xl glass-sushi shadow-neon animate-fade-in ${
            t.type === 'error'
              ? 'neon-border border-error/30'
              : 'neon-border'
          }`}
        >
          <p className="text-sm text-white">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

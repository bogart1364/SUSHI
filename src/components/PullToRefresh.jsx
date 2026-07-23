import { useState, useRef, useCallback } from 'react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);
    if (refreshing) return;
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  }, [pulling, refreshing, onRefresh]);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto scroll-area"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {(pulling || refreshing) && (
        <div className="flex justify-center py-2">
          <div className={`w-5 h-5 border-2 border-neon/30 border-t-neon rounded-full ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      )}
      {children}
    </div>
  );
}

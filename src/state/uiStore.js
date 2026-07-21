import { create } from 'zustand';

export const useUIStore = create((set) => ({
  activeTab: 'Swap',
  setActiveTab: (t) => set({ activeTab: t }),
  toasts: [],
  pushToast: (toast) =>
    set((s) => ({ toasts: [...s.toasts, { id: crypto.randomUUID(), ...toast }] })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
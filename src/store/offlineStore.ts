import { create } from 'zustand';
import type { TransactionType } from '../types';

interface PendingTransaction {
  id: string;
  amount: string;
  type: TransactionType;
  category: string;
  description?: string;
  date: string;
}

interface OfflineState {
  pendingTransactions: PendingTransaction[];
  isOnline: boolean;
  addPendingTransaction: (transaction: Omit<PendingTransaction, 'id'>) => void;
  removePendingTransaction: (id: string) => void;
  clearPendingTransactions: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
}

/**
 * Zustand store for offline-first functionality
 * Stores pending transactions when offline
 */
export const useOfflineStore = create<OfflineState>((set) => ({
  pendingTransactions: [],
  isOnline: navigator.onLine,
  
  addPendingTransaction: (transaction) =>
    set((state) => ({
      pendingTransactions: [
        ...state.pendingTransactions,
        { ...transaction, id: crypto.randomUUID() },
      ],
    })),
  
  removePendingTransaction: (id) =>
    set((state) => ({
      pendingTransactions: state.pendingTransactions.filter((t) => t.id !== id),
    })),
  
  clearPendingTransactions: () => set({ pendingTransactions: [] }),
  
  setOnlineStatus: (isOnline) => set({ isOnline }),
}));

// Listen to online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useOfflineStore.getState().setOnlineStatus(true));
  window.addEventListener('offline', () => useOfflineStore.getState().setOnlineStatus(false));
}

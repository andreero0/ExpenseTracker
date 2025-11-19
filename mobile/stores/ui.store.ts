/**
 * UI Store (Zustand)
 * Manages global UI state (modals, toasts, loading states, etc.)
 */

import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

interface UIState {
  // State
  isLoading: boolean;
  toasts: Toast[];
  modals: Modal[];
  activeModal: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

/**
 * UI Store
 * Global UI state management
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isLoading: false,
  toasts: [],
  modals: [],
  activeModal: null,

  // Set global loading state
  setLoading: (loading) => set({ isLoading: loading }),

  // Show a toast notification
  showToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-hide toast after duration (default 3 seconds)
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  // Hide a specific toast
  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  // Clear all toasts
  clearToasts: () => set({ toasts: [] }),

  // Open a modal
  openModal: (modal) => {
    const id = Date.now().toString();
    const newModal = { ...modal, id };

    set((state) => ({
      modals: [...state.modals, newModal],
      activeModal: id,
    }));

    return id;
  },

  // Close a specific modal
  closeModal: (id) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
      activeModal:
        state.activeModal === id
          ? state.modals[state.modals.length - 2]?.id ?? null
          : state.activeModal,
    })),

  // Close all modals
  closeAllModals: () =>
    set({
      modals: [],
      activeModal: null,
    }),
}));

export default useUIStore;

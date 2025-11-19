/**
 * Auth Store (Zustand)
 * Manages authentication state across the app
 */

import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
}

/**
 * Auth Store
 * Central state management for authentication
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  loading: true,
  initialized: false,

  // Set user
  setUser: (user) => set({ user }),

  // Set session
  setSession: (session) => {
    set({ session });
    if (session) {
      set({ user: session.user });
    } else {
      set({ user: null });
    }
  },

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Initialize auth state
  initialize: async () => {
    try {
      set({ loading: true });

      // Get current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        set({ user: null, session: null });
      } else {
        set({ user: session?.user ?? null, session });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });

      set({ initialized: true });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, session: null });
    } finally {
      set({ loading: false });
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Reset state
  reset: () => {
    set({
      user: null,
      session: null,
      loading: false,
      initialized: false,
    });
  },
}));

export default useAuthStore;

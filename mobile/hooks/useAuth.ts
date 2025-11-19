/**
 * useAuth Hook
 * Central hook for authentication operations
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export function useAuth() {
  const { user, session, setSession, signOut: storeSignOut } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sign up with email and password
   */
  const signUp = async ({ email, password, name }: SignUpData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'Please check your email to confirm your account',
        };
      }

      return {
        success: true,
        requiresEmailConfirmation: false,
        user: data.user,
      };
    } catch (err: any) {
      const message = err.message || 'Failed to sign up';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async ({ email, password }: SignInData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSession(data.session);

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (err: any) {
      const message = err.message || 'Failed to sign in';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      await storeSignOut();

      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Failed to sign out';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password reset email sent. Please check your inbox.',
      };
    } catch (err: any) {
      const message = err.message || 'Failed to send reset email';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update password
   */
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (err: any) {
      const message = err.message || 'Failed to update password';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with OAuth provider
   */
  const signInWithProvider = async (
    provider: 'google' | 'apple' | 'github' | 'facebook'
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'myapp://auth/callback',
        },
      });

      if (error) throw error;

      return { success: true, data };
    } catch (err: any) {
      const message = err.message || `Failed to sign in with ${provider}`;
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,

    // Actions
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    clearError: () => setError(null),
  };
}

export default useAuth;

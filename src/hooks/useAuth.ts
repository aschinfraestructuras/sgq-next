'use client';

import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/types';
import { login, logout, register, updateUserProfile } from '@/services/auth';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { FirebaseError } from 'firebase/app';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const user = await login(email, password);
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const user = await register(email, password, name);
      set({ user, isAuthenticated: true });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await logout();
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfile: async (data: Partial<User>) => {
    try {
      set({ loading: true, error: null });
      const updatedUser = await updateUserProfile(data);
      set({ user: updatedUser });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}));

// Initialize auth state listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: 'user',
        active: true,
        createdAt: new Date(firebaseUser.metadata.creationTime || ''),
        lastLogin: new Date(firebaseUser.metadata.lastSignInTime || ''),
        avatar: firebaseUser.photoURL || undefined
      };
      useAuth.setState({ 
        user,
        isAuthenticated: true,
        loading: false
      });
    } else {
      useAuth.setState({ 
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  });
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const handleAuthError = (error: unknown): never => {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  };

  const login = async (email: string, password: string) => {
    try {
      await context.login(email, password);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await context.register(email, password);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    try {
      await context.logout();
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await context.resetPassword(email);
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  return {
    user: context.user,
    loading: context.loading,
    login,
    register,
    logout,
    resetPassword
  };
}
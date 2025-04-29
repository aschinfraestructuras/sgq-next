'use client';

import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { User } from '@/types/firebase';
import { handleFirebaseError } from '@/lib/firebase/utils';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: handleFirebaseError(error) });
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
    } catch (error: any) {
      set({ error: handleFirebaseError(error) });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
    } catch (error: any) {
      set({ error: handleFirebaseError(error) });
    } finally {
      set({ loading: false });
    }
  },

  updateUserProfile: async (displayName: string) => {
    try {
      set({ loading: true, error: null });
      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateProfile(currentUser, { displayName });
        set({ user: auth.currentUser as User });
      }
    } catch (error: any) {
      set({ error: handleFirebaseError(error) });
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error })
}));

// Initialize auth state listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    useAuth.setState({ 
      user: user as User | null,
      isAuthenticated: !!user,
      loading: false
    });
  });
}
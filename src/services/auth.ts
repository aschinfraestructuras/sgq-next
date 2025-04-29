import { auth } from '@/lib/firebase/config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import type { User } from '@/types';
import { FirebaseError } from 'firebase/app';

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  name: firebaseUser.displayName || '',
  role: 'user',
  active: true,
  createdAt: new Date(firebaseUser.metadata.creationTime || ''),
  lastLogin: new Date(firebaseUser.metadata.lastSignInTime || ''),
  avatar: firebaseUser.photoURL || undefined
});

export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

export async function login(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to login');
  }
}

export async function register(email: string, password: string): Promise<void> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to register');
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to logout');
  }
}

export async function updateUserProfile(user: FirebaseUser, data: { displayName?: string; photoURL?: string }): Promise<void> {
  try {
    await updateProfile(user, data);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update profile');
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(error.message);
    }
    throw new Error('Failed to send password reset email');
  }
} 
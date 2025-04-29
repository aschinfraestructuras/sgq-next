import { auth } from '@/lib/firebase';
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

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      if (!firebaseUser) {
        resolve(null);
        return;
      }
      resolve(mapFirebaseUserToUser(firebaseUser));
    });
  });
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUserToUser(result.user);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function register(email: string, password: string, name: string): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return {
      id: result.user.uid,
      email: result.user.email || '',
      name: name,
      role: 'user',
      active: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      avatar: result.user.photoURL || undefined
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  if (!auth.currentUser) throw new Error('No user logged in');

  try {
    await updateProfile(auth.currentUser, {
      displayName: data.name,
      photoURL: data.avatar
    });

    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('Failed to get updated user');
    
    return {
      ...currentUser,
      ...data
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
} 
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

export function getUserProfile(user: User) {
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
} 
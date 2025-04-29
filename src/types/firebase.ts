import type { User as FirebaseUser } from 'firebase/auth';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
  firebaseUser: FirebaseUser;
}

export type { FirebaseUser }; 
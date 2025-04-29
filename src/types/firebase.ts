import { User as FirebaseUser } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';

export interface User extends FirebaseUser {
  role?: 'admin' | 'user';
  active?: boolean;
  createdAt?: Date;
  lastLogin?: Date;
  avatar?: string | null;
}

export interface FirestoreDocument extends DocumentData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirebaseError {
  code: string;
  message: string;
} 
'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';

export class AuthService {
  static async login(email: string, password: string): Promise<{ user: User }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user: User = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || '',
        role: 'user', // Você pode armazenar a role no custom claims do Firebase
        active: true,
        createdAt: new Date(result.user.metadata.creationTime || ''),
        lastLogin: new Date(result.user.metadata.lastSignInTime || ''),
        avatar: result.user.photoURL || undefined
      };
      return { user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async register(email: string, password: string, name: string): Promise<{ user: User }> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      const user: User = {
        id: result.user.uid,
        email: result.user.email || '',
        name: name,
        role: 'user',
        active: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      return { user };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    return {
      id: currentUser.uid,
      email: currentUser.email || '',
      name: currentUser.displayName || '',
      role: 'user',
      active: true,
      createdAt: new Date(currentUser.metadata.creationTime || ''),
      lastLogin: new Date(currentUser.metadata.lastSignInTime || ''),
      avatar: currentUser.photoURL || undefined
    };
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    if (!auth.currentUser) throw new Error('No user logged in');

    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: data.avatar
      });

      return {
        ...(await this.getCurrentUser())!,
        ...data
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // This method is not provided in the new implementation
    throw new Error('Method not implemented');
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    // This method is not provided in the new implementation
    throw new Error('Method not implemented');
  }
} 
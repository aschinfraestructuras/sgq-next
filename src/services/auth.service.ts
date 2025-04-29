'use client';

import { User } from '@/types';
import api from './api';

export class AuthService {
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/password', { currentPassword, newPassword });
  }

  static async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/password/reset', { email });
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/password/reset/confirm', { token, newPassword });
  }
} 
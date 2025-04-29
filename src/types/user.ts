export type UserRole = 'admin' | 'user' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
} 
// Enterprise POS System - User Management Store
// Shared state for user accounts and credentials

import { create } from 'zustand';
import type { SystemUser } from '@/types';
import { ALL_PERMISSIONS } from '@/types';

interface UserManagementState {
  users: SystemUser[];
  credentials: Record<string, string>; // email (lowercase) → password

  // User CRUD
  addUser: (user: SystemUser, password: string) => void;
  updateUser: (id: string, updates: Partial<SystemUser>) => void;
  removeUser: (id: string) => void;

  // Credential management
  updateCredential: (email: string, password: string) => void;
  removeCredential: (email: string) => void;
}

// Start with one admin user
const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr_001',
    name: 'Admin',
    email: 'admin@mybusiness.com',
    phone: '',
    role: 'admin',
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    branchId: 'br_001',
    branchName: 'Main Branch',
    mfaEnabled: false,
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_CREDENTIALS: Record<string, string> = {
  'admin@mybusiness.com': 'admin123',
};

export const useUserStore = create<UserManagementState>((set) => ({
  users: [...INITIAL_USERS],
  credentials: { ...INITIAL_CREDENTIALS },

  addUser: (user, password) =>
    set((s) => ({
      users: [...s.users, user],
      credentials: {
        ...s.credentials,
        [user.email.toLowerCase().trim()]: password,
      },
    })),

  updateUser: (id, updates) =>
    set((s) => ({
      users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  removeUser: (id) =>
    set((s) => {
      const user = s.users.find((u) => u.id === id);
      const newCreds = { ...s.credentials };
      if (user) delete newCreds[user.email.toLowerCase().trim()];
      return {
        users: s.users.filter((u) => u.id !== id),
        credentials: newCreds,
      };
    }),

  updateCredential: (email, password) =>
    set((s) => ({
      credentials: {
        ...s.credentials,
        [email.toLowerCase().trim()]: password,
      },
    })),

  removeCredential: (email) =>
    set((s) => {
      const newCreds = { ...s.credentials };
      delete newCreds[email.toLowerCase().trim()];
      return { credentials: newCreds };
    }),
}));

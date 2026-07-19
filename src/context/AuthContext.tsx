'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, setToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  name: string;
  role: number;
  role_label?: string;
}

const ROLE_MAP: Record<number, string> = {
  0: 'admin',
  1: 'kasir_billiard',
  2: 'kasir_cafe',
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function enrichUser(u: User): User {
  return { ...u, role_label: ROLE_MAP[u.role] ?? 'staff' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      if (token && userJson) {
        setToken(token);
        setUser(enrichUser(JSON.parse(userJson)));
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: loggedInUser } = await apiLogin(username, password);
      setToken(token);
      const enriched = enrichUser(loggedInUser);
      setUser(enriched);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
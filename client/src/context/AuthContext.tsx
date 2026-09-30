import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/advisory';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (username: string, password?: string) => Promise<boolean>;
  register: (username: string, email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  chaosTolerance: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agro_token') || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username: string, password: string = 'password123'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('agro_user', JSON.stringify(data.user));
        localStorage.setItem('agro_token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('[Auth] Login error:', err);
      // Fallback local session
      const fallbackUser: UserProfile = {
        id: '00000000-0000-0000-0000-000000000001',
        username: username || 'existential_farmer_99',
        chaos_tolerance_score: 42,
      };
      setUser(fallbackUser);
      setToken('mock-token-fallback');
      localStorage.setItem('agro_user', JSON.stringify(fallbackUser));
      localStorage.setItem('agro_token', 'mock-token-fallback');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email?: string, password: string = 'password123'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('agro_user', JSON.stringify(data.user));
        localStorage.setItem('agro_token', data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agro_user');
    localStorage.removeItem('agro_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        chaosTolerance: user?.chaos_tolerance_score ?? 100,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

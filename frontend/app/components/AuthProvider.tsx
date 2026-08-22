'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  major?: string;
  school?: string;
  joinedAt?: string;
  provider: 'google' | 'github' | 'email' | 'guest';
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  major?: string;
  school?: string;
}

interface AuthContextType {
  user: AuthUser;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: AuthUser) => void;
  loginWithCredentials: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: 'google' | 'github' | 'microsoft', customEmail?: string, customName?: string) => Promise<AuthUser>;
  sendMagicLink: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const DEFAULT_GUEST: AuthUser = {
  id: 'usr_guest',
  name: 'Student Scholar',
  email: 'student.guest@university.edu',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
  major: 'General Studies',
  school: 'University',
  joinedAt: '2026-08-12',
  provider: 'guest',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_GUEST,
  isAuthenticated: false,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: () => {},
  loginWithCredentials: async () => ({ success: false }),
  registerUser: async () => ({ success: false }),
  socialLogin: async () => DEFAULT_GUEST,
  sendMagicLink: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(DEFAULT_GUEST);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Restore active server session from HTTP-only cookie on mount
  useEffect(() => {
    async function checkServerSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (data.success && data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          try {
            localStorage.setItem('nexus_auth_user', JSON.stringify(data.user));
          } catch {}
          return;
        }

        // LocalStorage fallback if server cookie not found
        const savedAuth = localStorage.getItem('nexus_auth_user');
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          setUser(parsed);
          setIsAuthenticated(parsed.provider !== 'guest');
        }
      } catch {
        // Offline / SSR fallback
      }
    }
    checkServerSession();
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    setIsAuthenticated(newUser.provider !== 'guest');
    try {
      localStorage.setItem('nexus_auth_user', JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const loginWithCredentials = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server connection error.' };
    }
  };

  const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();

      if (resData.success && resData.user) {
        login(resData.user);
        return { success: true };
      }
      return { success: false, error: resData.error || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Server error during registration.' };
    }
  };

  const socialLogin = async (provider: 'google' | 'github' | 'microsoft', customEmail?: string, customName?: string): Promise<AuthUser> => {
    const defaultEmail = provider === 'google' ? 'student.scholar@gmail.com' : 'student.scholar@github.com';
    const emailToUse = customEmail || defaultEmail;
    const nameToUse = customName || (provider === 'google' ? 'Google Scholar Student' : 'GitHub Developer Student');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email: emailToUse, name: nameToUse }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        return data.user;
      }
    } catch {}

    const fallbackUser: AuthUser = {
      id: `usr_${provider}_${Date.now()}`,
      name: nameToUse,
      email: emailToUse,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nameToUse)}`,
      major: 'Computer Science',
      school: 'University',
      provider: provider === 'microsoft' ? 'email' : provider,
    };
    login(fallbackUser);
    return fallbackUser;
  };

  const sendMagicLink = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        return true;
      }
    } catch {}
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(DEFAULT_GUEST);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('nexus_auth_user');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        loginWithCredentials,
        registerUser,
        socialLogin,
        sendMagicLink,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

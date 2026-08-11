'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github' | 'email' | 'guest';
}

interface AuthContextType {
  user: AuthUser;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const DEFAULT_GUEST: AuthUser = {
  id: 'usr_alex_vance',
  name: 'Alex Vance',
  email: 'alex.vance@mit.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'guest',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_GUEST,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(DEFAULT_GUEST);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('nexus_auth_user');
      if (savedAuth) {
        setUser(JSON.parse(savedAuth));
      }
    } catch {
      // SSR fallback
    }
  }, []);

  const login = (newUser: AuthUser) => {
    setUser(newUser);
    try {
      localStorage.setItem('nexus_auth_user', JSON.stringify(newUser));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(DEFAULT_GUEST);
    try {
      localStorage.removeItem('nexus_auth_user');
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

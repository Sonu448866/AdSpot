import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  fastDemoLogin: (role: 'advertiser' | 'space_owner' | 'admin') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'otp';
  authModalRole: 'advertiser' | 'space_owner';
  openAuthModal: (tab?: 'login' | 'register' | 'otp', initialRole?: 'advertiser' | 'space_owner') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('adspot_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'otp'>('login');
  const [authModalRole, setAuthModalRole] = useState<'advertiser' | 'space_owner'>('advertiser');

  const openAuthModal = (
    tab: 'login' | 'register' | 'otp' = 'login',
    initialRole: 'advertiser' | 'space_owner' = 'advertiser'
  ) => {
    setAuthModalTab(tab);
    setAuthModalRole(initialRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('adspot_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.warn('[Auth] Session expired or invalid, logging out.');
      localStorage.removeItem('adspot_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('adspot_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    closeAuthModal();
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('adspot_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    closeAuthModal();
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    const res = await api.post('/auth/otp/verify', { phone, otp });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('adspot_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    closeAuthModal();
  };

  const fastDemoLogin = async (demoRole: 'advertiser' | 'space_owner' | 'admin') => {
    let email = 'advertiser@adspot.com';
    let pass = 'Advertiser@123456';
    if (demoRole === 'space_owner') {
      email = 'owner@adspot.com';
      pass = 'Owner@123456';
    } else if (demoRole === 'admin') {
      email = 'admin@adspot.com';
      pass = 'Admin@123456';
    }
    await login(email, pass);
  };

  const logout = () => {
    localStorage.removeItem('adspot_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        loginWithOtp,
        fastDemoLogin,
        logout,
        refreshUser,
        updateUser,
        isAuthModalOpen,
        authModalTab,
        authModalRole,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

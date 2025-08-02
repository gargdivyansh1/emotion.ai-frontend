import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const authAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  const fetchUser = useCallback(async (token: string) => {
    try {
      const response = await authAxios.get('/auth/me');
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Failed to fetch user data", error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      await fetchUser(token);
    } catch (error) {
      console.error("Authentication check failed", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAxios.post(
        '/auth/login',
        new URLSearchParams({ username, password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      localStorage.setItem('token', response.data.access_token);
      await fetchUser(response.data.access_token);
    } catch (error) {
      console.error("Login failed", error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete authAxios.defaults.headers.common['Authorization'];
  };

  const refreshAuth = async () => {
    if (!localStorage.getItem('token')) return;
    await checkAuth();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      isLoading, 
      isAuthenticated,
      login, 
      logout,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

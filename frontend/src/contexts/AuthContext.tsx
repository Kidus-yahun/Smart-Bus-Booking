import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { authApi, type LoginData, type RegisterData, type User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartbus_token');
    if (token) {
      authApi
        .getMe()
        .then(setUser)
        .catch(() => {
          authApi.logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password } as LoginData);
      setUser(response.user);
      localStorage.setItem('smartbus_user', JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ email, password, name, phone } as RegisterData);
      setUser(response.user);
      localStorage.setItem('smartbus_user', JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    localStorage.removeItem('smartbus_user');
  };

  const updateProfile = async (_data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    setIsLoading(true);
    try {
      const response = await authApi.getMe();
      setUser(response);
      localStorage.setItem('smartbus_user', JSON.stringify(response));
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

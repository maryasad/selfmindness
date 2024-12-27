import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { AuthResponse, LoginCredentials, RegisterCredentials } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      setUser(user);
    } catch (err) {
      console.error('Error loading user from storage:', err);
      setError('Error loading user session');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  const login = async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setError(null);
    try {
      const response = await authService.register(credentials);
      setUser(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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

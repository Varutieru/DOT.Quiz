import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginFormData, RegisterFormData, StoredUser } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'quiz_users',
  CURRENT_USER: 'quiz_current_user',
} as const;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (data.password !== data.confirmPassword) {
        throw new Error('Password mismatch!');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long!');
      }

      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      if (users.some(u => u.email === data.email)) {
        throw new Error('Email already registered!');
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const foundUser = users.find(
        u => u.email === data.email && u.password === data.password
      );

      if (!foundUser) {
        throw new Error('Email or password is incorrect!');
      }

      const { password, ...userWithoutPassword } = foundUser;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
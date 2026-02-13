import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '../types/auth.types';

export function useAuth() {
  const { login: contextLogin, register: contextRegister, isLoading: contextLoading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginFormData) => {
    setError(null);
    try {
      await contextLogin(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login gagal!';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (data: RegisterFormData) => {
    setError(null);
    try {
      await contextRegister(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrasi gagal!';
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    register,
    error,
    clearError,
    isLoading: contextLoading,
  };
}
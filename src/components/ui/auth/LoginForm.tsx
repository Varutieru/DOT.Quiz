import { useState, FormEvent, ChangeEvent } from 'react';
import { LoginFormData } from '@/types/auth.types';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login, error, clearError, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(formData);
      onSuccess?.();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <section className="flex justify-center items-center flex-col md:flex-row-reverse h-fit w-[50vw] gap-5">
      {/* GLASSMORPHIC CARD */}
      <section className="w-full md:w-fit h-fit px-[2vw] py-[2vw]
                          bg-[#C5EBF1]/10 backdrop-blur-lg rounded-[50px] gap-2">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-3">
          
          {error && (
            <div className="w-full md:max-w-[30vw] px-4 py-3 bg-[#EF767A]/20 text-[#EF767A] font-chillax rounded-full text-center text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Input your email"
            required
            disabled={isLoading}
            className="w-full md:max-w-[30vw] px-4 py-3 bg-[#F2F2F9] text-[#141121] font-chillax placeholder:text-[#141121]/50 rounded-full focus:outline-none focus:ring-2 focus:ring-[#23F0C7]"
          />

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Input your password"
            required
            disabled={isLoading}
            className="w-full md:max-w-[30vw] px-4 py-3 bg-[#F2F2F9] text-[#141121] font-chillax placeholder:text-[#141121]/50 rounded-full focus:outline-none focus:ring-2 focus:ring-[#EF767A]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:max-w-[30vw] mt-4 px-4 py-3 bg-linear-to-r from-[#F2F2F9] to-[#E5E4F2] text-[#141121] font-chillax rounded-full hover:bg-[#7D7ABC] transition-colors duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="font-chillax text-[#F2F2F9]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
              className="font-chillax-semibold text-[#F2F2F9] hover:underline-offset-1 hover:underline"
            >
              Sign up here
            </button>
          </p>
        </form>
      </section>
    </section>
  );
}
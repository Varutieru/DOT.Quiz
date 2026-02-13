"use client";

import { useState } from 'react';
import { AuthProvider, useAuthContext } from '@/contexts/AuthContext';

import Hero from "@/components/pages/Hero";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";

type AuthView = 'login' | 'register';

function AppContent() {
  const { isAuthenticated, user, logout, isLoading } = useAuthContext();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-[#141121] to-[#7D7ABC]">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner animation */}
          <div className="w-16 h-16 border-4 border-[#F2F2F9]/20 border-t-[#23F0C7] rounded-full animate-spin"></div>
          <p className="text-[#F2F2F9] font-chillax text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <main className="w-screen min-h-screen overflow-hidden">
      <Hero />
    </main>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
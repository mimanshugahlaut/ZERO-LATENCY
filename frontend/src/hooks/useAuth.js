import { useState } from 'react';

// Generates a mock user ID for simulated registration/login
const generateUserId = () => `user_${Math.random().toString(36).slice(2, 11)}`;

function loadSession() {
  try {
    const raw = localStorage.getItem('chainvote_auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(loadSession);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async (identifier, method = 'email') => {
    setIsLoading(true);

    // Simulate network delay for OTP verification
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sessionUser = {
      id: generateUserId(),
      identifier,
      method,
      sessionToken: `tk_${Math.random().toString(36).slice(2, 14)}`,
    };

    setUser(sessionUser);
    localStorage.setItem('chainvote_auth', JSON.stringify(sessionUser));
    setIsLoading(false);
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chainvote_auth');
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
  };
}

import { useState, useEffect } from 'react';

// Generates a mock user ID for simulated registration/login
const generateUserId = () => 'user_' + Math.random().toString(36).substr(2, 9);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('chainvote_auth');
    if (session) {
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier, method = 'email') => {
    setIsLoading(true);
    // Simulate network delay for OTP verification
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create session
    const sessionUser = {
      id: generateUserId(),
      identifier, // The email or phone number
      method,
      sessionToken: 'tk_' + Math.random().toString(36).substr(2, 12)
    };

    setUser(sessionUser);
    localStorage.setItem('chainvote_auth', JSON.stringify(sessionUser));
    setIsLoading(false);
    return sessionUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chainvote_auth');
    // Also clear any vote receipts they might have stored locally if necessary
    // But for a true hackathon demo, we might want to keep the receipt. 
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen
  };
}

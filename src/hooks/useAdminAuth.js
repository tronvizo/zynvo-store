import { useState, useEffect } from 'react';
import { onAuthChange, loginAdmin, logoutAdmin } from '../services/authService';

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    login: loginAdmin,
    logout: logoutAdmin,
    isAuthenticated: !!user
  };
}

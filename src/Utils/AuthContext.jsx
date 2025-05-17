import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';
import { storageService } from './storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.addAuthStateListener((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) authService.removeAuthStateListener(unsubscribe);
    };
  }, []);

  const value = {
    user,
    loading,
    signup: authService.signup,
    login: authService.login,
    logout: authService.logout,
    switchToTryMode: authService.switchToTryMode,
    isAuthenticated: authService.isAuthenticated(),
    saveData: storageService.saveData.bind(storageService),
    getData: storageService.getData.bind(storageService),
    migrateFromTryMode: storageService.migrateFromTryMode.bind(storageService)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
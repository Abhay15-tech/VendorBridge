import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'Admin' | 'Vendor' | 'Officer' | 'Manager';

type AuthContextType = {
  isAuthenticated: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vendorbridge-auth') === 'true';
  });
  
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('vendorbridge-role') as UserRole) || 'Admin';
  });

  const login = (selectedRole: UserRole = 'Admin') => {
    setIsAuthenticated(true);
    setRole(selectedRole);
    localStorage.setItem('vendorbridge-auth', 'true');
    localStorage.setItem('vendorbridge-role', selectedRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vendorbridge-auth');
    localStorage.removeItem('vendorbridge-role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

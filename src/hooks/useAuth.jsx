import { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/db.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('college_app_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    const defaultUser = initialData.users.find(u => u.role === role);
    setUser(defaultUser);
    localStorage.setItem('college_app_user', JSON.stringify(defaultUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('college_app_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

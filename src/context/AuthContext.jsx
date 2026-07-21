import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';
import { PERMISSIONS } from './permissions';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ems_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password, remember, adminOnly = false) => {
    const user = mockUsers.find(u => u.email === username && u.password === password);
    if (!user) throw new Error('Invalid username or password');
    
    if (adminOnly && user.role !== 'admin' && user.role !== 'super_admin') {
      throw new Error('Access Denied: You do not have Administrator privileges.');
    }

    setCurrentUser(user);
    if (remember) localStorage.setItem('ems_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ems_user');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    const perms = PERMISSIONS[currentUser.role] || [];
    return perms.includes(permission) || perms.includes('*');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Re-export for backwards compatibility
export { PERMISSIONS } from './permissions';

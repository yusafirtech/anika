import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, PermissionResource, PermissionAction, RolePermissions } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
}

const DEFAULT_PERMISSIONS: RolePermissions = {
  admin: {
    dashboard: ['view', 'create', 'edit', 'delete'],
    pages: ['view', 'create', 'edit', 'delete'],
    products: ['view', 'create', 'edit', 'delete'],
    projects: ['view', 'create', 'edit', 'delete'],
    leads: ['view', 'create', 'edit', 'delete'],
    hero: ['view', 'create', 'edit', 'delete'],
    team: ['view', 'create', 'edit', 'delete'],
    partners: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete'],
    settings: ['view', 'create', 'edit', 'delete'],
  },
  manager: {
    dashboard: ['view'],
    pages: ['view', 'create', 'edit', 'delete'],
    products: ['view', 'create', 'edit', 'delete'],
    projects: ['view', 'create', 'edit', 'delete'],
    leads: ['view', 'edit', 'delete'],
    hero: ['view', 'create', 'edit'],
    team: ['view', 'create', 'edit'],
    partners: ['view', 'create', 'edit', 'delete'],
    users: ['view'],
    settings: ['view'],
  },
  editor: {
    dashboard: ['view'],
    pages: ['view', 'create', 'edit'],
    products: ['view', 'create', 'edit'],
    projects: ['view', 'create', 'edit'],
    leads: ['view'],
    hero: ['view', 'create', 'edit'],
    team: ['view', 'edit'],
    partners: ['view', 'edit'],
    users: [],
    settings: [],
  },
  viewer: {
    dashboard: ['view'],
    pages: ['view'],
    products: ['view'],
    projects: ['view'],
    leads: ['view'],
    hero: ['view'],
    team: ['view'],
    partners: ['view'],
    users: [],
    settings: [],
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'Managing Director',
  email: 'admin@anikatrading.com',
  role: 'admin',
  department: 'Executive Leadership',
  status: 'active',
  lastActive: 'Just now',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Automatically provide default admin session for demo preview if empty
        setUser(DEFAULT_ADMIN_USER);
        localStorage.setItem('accessToken', 'demo-token-anika-trading');
        localStorage.setItem('authUser', JSON.stringify(DEFAULT_ADMIN_USER));
      }
    } catch (e) {
      console.error('Auth initialization error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, customRole: UserRole = 'admin'): Promise<boolean> => {
    setIsLoading(true);
    // Simulate auth latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    const authenticatedUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: customRole,
      department: customRole === 'admin' ? 'Executive Board' : 'Operations',
      status: 'active',
      lastActive: 'Just now',
    };

    setUser(authenticatedUser);
    localStorage.setItem('accessToken', `token-${Date.now()}`);
    localStorage.setItem('authUser', JSON.stringify(authenticatedUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const hasPermission = useCallback(
    (resource: PermissionResource, action: PermissionAction): boolean => {
      if (!user) return false;
      const role = user.role;
      const allowedActions = DEFAULT_PERMISSIONS[role]?.[resource] || [];
      return allowedActions.includes(action);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, PermissionResource, PermissionAction, RolePermissions } from '../types';
import { backendApi } from '../api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateCurrentUser: (user: User) => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
}

const DEFAULT_PERMISSIONS: RolePermissions = {
  admin: {
    dashboard: ['view', 'create', 'edit', 'delete'],
    pages: ['view', 'create', 'edit', 'delete'],
    leads: ['view', 'create', 'edit', 'delete'],
    clients: ['view', 'create', 'edit', 'delete'],
    partners: ['view', 'create', 'edit', 'delete'],
    users: ['view', 'create', 'edit', 'delete'],
    settings: ['view', 'create', 'edit', 'delete'],
  },
  manager: {
    dashboard: ['view'],
    pages: ['view', 'create', 'edit', 'delete'],
    leads: ['view', 'edit', 'delete'],
    clients: ['view', 'create', 'edit', 'delete'],
    partners: ['view', 'create', 'edit', 'delete'],
    users: ['view'],
    settings: ['view'],
  },
  editor: {
    dashboard: ['view'],
    pages: ['view', 'create', 'edit'],
    leads: ['view'],
    clients: ['view', 'edit'],
    partners: ['view', 'edit'],
    users: [],
    settings: [],
  },
  viewer: {
    dashboard: ['view'],
    pages: ['view'],
    leads: ['view'],
    clients: ['view'],
    partners: ['view'],
    users: [],
    settings: [],
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Auth initialization error', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const { token, user: authenticatedUser } = await backendApi.auth.login(username, password);
      setUser(authenticatedUser);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('authUser', JSON.stringify(authenticatedUser));
      return true;
    } catch (err: any) {
      setLoginError(err?.response?.data?.error || 'Invalid username or password.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  // Called after a successful self-service profile/password update so the
  // rest of the app (topbar, sidebar, etc.) reflects the change immediately.
  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
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
        loginError,
        login,
        logout,
        updateCurrentUser,
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

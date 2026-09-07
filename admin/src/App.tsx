import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PermissionGuard } from './components/PermissionGuard';
import { Layout } from './components/Layout';

// Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { HeroSectionManager } from './pages/HeroSectionManager';
import { LeadApplicationsManager } from './pages/LeadApplicationsManager';
import { UserManager } from './pages/UserManager';
import {
  ExportProductsPage,
  ProjectsPage,
  TeamPage,
  PartnersPage,
} from './pages/EntityCrudPages';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Console Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route
              index
              element={
                <PermissionGuard resource="dashboard" action="view">
                  <AdminDashboard />
                </PermissionGuard>
              }
            />

            {/* Content Management Modules */}
            <Route
              path="products"
              element={
                <PermissionGuard resource="products" action="view">
                  <ExportProductsPage />
                </PermissionGuard>
              }
            />
            <Route
              path="projects"
              element={
                <PermissionGuard resource="projects" action="view">
                  <ProjectsPage />
                </PermissionGuard>
              }
            />
            <Route
              path="hero"
              element={
                <PermissionGuard resource="hero" action="view">
                  <HeroSectionManager />
                </PermissionGuard>
              }
            />
            <Route
              path="team"
              element={
                <PermissionGuard resource="team" action="view">
                  <TeamPage />
                </PermissionGuard>
              }
            />
            <Route
              path="partners"
              element={
                <PermissionGuard resource="partners" action="view">
                  <PartnersPage />
                </PermissionGuard>
              }
            />

            {/* Operations Modules */}
            <Route
              path="leads"
              element={
                <PermissionGuard resource="leads" action="view">
                  <LeadApplicationsManager />
                </PermissionGuard>
              }
            />

            {/* System & Security Modules */}
            <Route
              path="users"
              element={
                <PermissionGuard resource="users" action="view">
                  <UserManager />
                </PermissionGuard>
              }
            />
            <Route
              path="settings"
              element={
                <PermissionGuard resource="settings" action="view">
                  <SettingsPage />
                </PermissionGuard>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

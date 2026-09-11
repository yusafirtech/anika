import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PermissionGuard } from './components/PermissionGuard';
import { Layout } from './components/Layout';

// Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { LeadApplicationsManager } from './pages/LeadApplicationsManager';
import { UserManager } from './pages/UserManager';
import { PartnersPage } from './pages/EntityCrudPages';
import { ClientManager } from './pages/ClientManager';
import { InsightsManager } from './pages/InsightsManager';
import { SettingsPage } from './pages/SettingsPage';

// Page Content Managers (Full CMS)
import { HomePageManager } from './pages/managers/HomePageManager';
import { AboutPageManager } from './pages/managers/AboutPageManager';
import { BusinessPageManager } from './pages/managers/BusinessPageManager';
import { ProjectsPageManager } from './pages/managers/ProjectsPageManager';
import { ExportPageManager } from './pages/managers/ExportPageManager';
import { TeamPageManager } from './pages/managers/TeamPageManager';
import { ContactPageManager } from './pages/managers/ContactPageManager';
import { SiteGlobalManager } from './pages/managers/SiteGlobalManager';

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

            {/* Website Pages Managers (Full CMS) */}
            <Route
              path="pages/home"
              element={
                <PermissionGuard resource="pages" action="view">
                  <HomePageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/about"
              element={
                <PermissionGuard resource="pages" action="view">
                  <AboutPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/business"
              element={
                <PermissionGuard resource="pages" action="view">
                  <BusinessPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/projects"
              element={
                <PermissionGuard resource="pages" action="view">
                  <ProjectsPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/export"
              element={
                <PermissionGuard resource="pages" action="view">
                  <ExportPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/team"
              element={
                <PermissionGuard resource="pages" action="view">
                  <TeamPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/contact"
              element={
                <PermissionGuard resource="pages" action="view">
                  <ContactPageManager />
                </PermissionGuard>
              }
            />
            <Route
              path="pages/site"
              element={
                <PermissionGuard resource="pages" action="view">
                  <SiteGlobalManager />
                </PermissionGuard>
              }
            />

            {/* Content Management Modules */}
            <Route
              path="insights"
              element={
                <PermissionGuard resource="insights" action="view">
                  <InsightsManager />
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
            <Route
              path="clients"
              element={
                <PermissionGuard resource="clients" action="view">
                  <ClientManager />
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

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Fixed Top Bar */}
      <Topbar
        onOpenMobile={() => setMobileOpen(true)}
        collapsed={collapsed}
      />

      {/* Main Content Area */}
      <main
        className={`pt-20 pb-16 px-6 transition-all duration-300 ${
          collapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

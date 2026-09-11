import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockDb } from '../api';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Handshake,
  UserCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  Info,
  Building2,
  FolderKanban,
  Globe2,
  PhoneCall,
  Compass,
  Newspaper,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const leads = mockDb.getLeads();
  const pendingLeadsCount = leads.filter((l) => l.status === 'Pending').length;

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          label: 'Dashboard',
          to: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'Website Pages (Full CMS)',
      items: [
        {
          label: 'Homepage',
          to: '/pages/home',
          icon: Home,
          badge: 'Dynamic',
          badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
        },
        {
          label: 'About Page',
          to: '/pages/about',
          icon: Info,
        },
        {
          label: 'Business Page',
          to: '/pages/business',
          icon: Building2,
        },
        {
          label: 'Projects Page',
          to: '/pages/projects',
          icon: FolderKanban,
        },
        {
          label: 'Export Division',
          to: '/pages/export',
          icon: Globe2,
          badge: 'Galleries',
          badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
        },
        {
          label: 'Leadership & Team',
          to: '/pages/team',
          icon: Users,
        },
        {
          label: 'Contact Page',
          to: '/pages/contact',
          icon: PhoneCall,
        },
        {
          label: 'Header & Footer',
          to: '/pages/site',
          icon: Compass,
        },
      ],
    },
    {
      label: 'Content Management',
      items: [
        {
          label: 'Insights & News',
          to: '/insights',
          icon: Newspaper,
        },
        {
          label: 'Global Partners',
          to: '/partners',
          icon: Handshake,
        },
      ],
    },
    {
      label: 'Operations',
      items: [
        {
          label: 'Lead Inquiries',
          to: '/leads',
          icon: FileText,
          badge: pendingLeadsCount > 0 ? `${pendingLeadsCount} new` : undefined,
          badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        },
        {
          label: 'Clients',
          to: '/clients',
          icon: Briefcase,
        },
      ],
    },
    {
      label: 'System & Settings',
      items: [
        {
          label: 'RBAC Users',
          to: '/users',
          icon: UserCheck,
        },
        {
          label: 'Settings',
          to: '/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm font-bold text-sm tracking-wider">
                AT
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-sm tracking-tight text-slate-900 block truncate">
                  ANIKA TRADING
                </span>
                <span className="text-[10px] tracking-widest text-teal-600 block font-semibold">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-sm">
              AT
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {!collapsed && (
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </span>
              )}
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }: { isActive: boolean }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        } ${collapsed ? 'justify-center px-2' : ''}`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                            item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Logout Bottom */}
        <div className="border-t border-slate-100 p-3">
          <div
            className={`flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80 ${
              collapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="h-9 w-9 shrink-0 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold text-teal-700 text-xs">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'U'
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-800">{user?.name}</span>
                <span className="inline-flex items-center gap-1 rounded bg-teal-50 px-1.5 py-0.2 text-[9px] font-semibold uppercase text-teal-700 border border-teal-200">
                  <Shield className="h-2 w-2" />
                  {user?.role}
                </span>
              </div>
            )}

            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, FileSignature, CheckSquare, 
  ShoppingCart, Receipt, ActivitySquare, PieChart, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap, Sun, Moon
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const navSections = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Procurement',
    items: [
      { name: 'Vendors', path: '/vendors', icon: Users },
      { name: 'RFQs', path: '/rfqs', icon: FileText },
      { name: 'Quotations', path: '/quotations', icon: FileSignature },
      { name: 'Approvals', path: '/approvals', icon: CheckSquare, badge: '8' },
      { name: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart },
      { name: 'Invoices', path: '/invoices', icon: Receipt },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Activity Logs', path: '/activity', icon: ActivitySquare },
      { name: 'Reports', path: '/reports', icon: PieChart },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out",
        "bg-surface-900 dark:bg-surface-950 border-r border-white/5",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center border-b border-white/5 px-4 flex-shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-glow">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-base tracking-tight">VendorBridge</span>
            <p className="text-gray-500 text-[10px] font-medium tracking-widest uppercase">Procurement OS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-3 mb-2">
                {section.label}
              </p>
            )}
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-xl text-sm font-medium transition-all duration-150 group",
                        collapsed ? "justify-center px-0 py-2.5 mx-0" : "gap-3 px-3 py-2.5",
                        isActive
                          ? "bg-primary-600 text-white shadow-sm shadow-primary-900/50"
                          : "text-gray-400 hover:text-gray-100 hover:bg-white/8"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={cn("h-[18px] w-[18px] flex-shrink-0", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-200")} />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {(item as any).badge && (
                              <span className="text-[10px] bg-rose-500 text-white rounded-full px-1.5 py-0.5 font-semibold leading-none">
                                {(item as any).badge}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="p-3 border-t border-white/5 space-y-1 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            "w-full flex items-center rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-white/8 transition-all duration-150",
            collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px] flex-shrink-0 text-gray-500" /> : <Moon className="h-[18px] w-[18px] flex-shrink-0 text-gray-500" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center rounded-xl text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150",
            collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center rounded-xl text-sm font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-150",
            collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          {collapsed ? <ChevronRight className="h-[18px] w-[18px]" /> : (
            <>
              <ChevronLeft className="h-[18px] w-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

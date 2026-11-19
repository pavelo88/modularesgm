'use client';

import React from 'react';
import {
  LineChart,
  Users,
  Settings,
  Palette,
  LayoutGrid,
  ShoppingBag,
  Zap,
  MessageSquare,
  FileCode,
  Handshake,
} from 'lucide-react';
import type { AdminTab } from './admin-header-utils';
import { cn } from '@/lib/utils';

export const ADMIN_MOBILE_NAV_ITEMS: {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'analytics', label: 'Analítica', icon: LineChart },
  { id: 'leads', label: 'Leads', icon: MessageSquare },
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'orders', label: 'Órdenes', icon: FileCode },
  { id: 'general', label: 'Inicio', icon: Settings },
];

interface AdminMobileBottomNavProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCmsEditableTab?: boolean;
}

export function AdminMobileBottomNav({
  activeTab,
  setActiveTab,
}: AdminMobileBottomNavProps) {
  return (
    <nav
      aria-label="Navegación móvil del panel"
      className="md:hidden fixed z-40 bottom-0 left-0 right-0 border-t border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/95 dark:bg-[#0c0e12]/95 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {ADMIN_MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-xl transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-stone-500 hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-primary/15 text-primary shadow-xs'
                    : 'bg-transparent text-stone-500'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive && 'text-primary')} />
              </div>
              <span className="text-[10px] tracking-tight leading-none truncate max-w-[58px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

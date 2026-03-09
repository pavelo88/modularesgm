'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileCode,
  LayoutGrid,
  List,
  LogOut,
  MessageSquare,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { SiteContent } from '@/lib/types';
import { CmsGeneralForm } from './cms-general-form';
import { CmsServicesForm } from './cms-services-form';
import { CmsProductsForm } from './cms-products-form';
import { CmsBrandsStatsForm } from './cms-brands-stats-form';
import { LeadsManager } from './leads-manager';
import { OrdersManager } from './orders-manager';
import { logout } from '@/lib/actions';
import { defaultSiteContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import logo from '@/app/logo.jpg';
import logo2 from '@/app/logo2.jpg';

type AdminTab = 'general' | 'services' | 'products' | 'brands' | 'leads' | 'orders';

const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General & SEO', icon: <Settings /> },
  { id: 'services', label: 'Servicios', icon: <LayoutGrid /> },
  { id: 'products', label: 'Productos Tienda', icon: <ShoppingBag /> },
  { id: 'brands', label: 'Marcas & Stats', icon: <List /> },
  { id: 'leads', label: 'Leads (Contactos)', icon: <MessageSquare /> },
  { id: 'orders', label: 'Órdenes de Compra', icon: <FileCode /> },
];

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  // Temporarily using defaultSiteContent to allow the admin panel to load.
  // Data saving will not work until the Firebase connection is restored.
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(false);

  // NOTE: Firebase fetching logic removed to prevent app crash due to permission errors.
  // The admin panel will load with local default data.
  // Any changes made will not be saved until the DB connection is fixed.

  const renderContent = () => {
    if (loading || !siteContent) {
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        );
    }
    
    const setSiteContentWrapper = (value: React.SetStateAction<SiteContent>) => {
        setSiteContent(prev => {
            if (typeof value === 'function') {
                return value(prev || defaultSiteContent);
            }
            return value;
        });
    };

    switch (activeTab) {
      case 'general':
        return <CmsGeneralForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
      case 'services':
        return <CmsServicesForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
      case 'products':
        return <CmsProductsForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
      case 'brands':
        return <CmsBrandsStatsForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
      case 'leads':
        return <LeadsManager />;
      case 'orders':
        return <OrdersManager />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Image src={logo} alt="Modulares GM Logo" width={32} height={32} className="rounded-md dark:hidden"/>
            <Image src={logo2} alt="Modulares GM Logo" width={32} height={32} className="rounded-md hidden dark:block"/>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-bold">Modulares GM</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => setActiveTab(item.id)}
                  isActive={activeTab === item.id}
                  tooltip={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <form action={logout} className="w-full">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Cerrar Sesión" type="submit">
                  <LogOut />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur-sm">
           <SidebarTrigger />
           <h1 className="text-xl font-semibold">
              {menuItems.find(item => item.id === activeTab)?.label}
           </h1>
        </header>
        <main className="p-4 md:p-6">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

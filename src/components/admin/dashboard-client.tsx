'use client';

import { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { appId } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteContent() {
      try {
        const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
        const docSnap = await getDoc(contentRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteContent;
          setSiteContent({
            ...defaultSiteContent,
            ...data,
            services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
            brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
            stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
            products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
            seo: data.seo ? { ...defaultSiteContent.seo, ...data.seo } : defaultSiteContent.seo,
            socialUrls: data.socialUrls ? { ...defaultSiteContent.socialUrls, ...data.socialUrls } : defaultSiteContent.socialUrls,
          });
        } else {
          setSiteContent(defaultSiteContent);
        }
      } catch (error) {
        console.error("Error fetching site content, returning default.", error);
        setSiteContent(defaultSiteContent);
      } finally {
        setLoading(false);
      }
    }
    fetchSiteContent();
  }, []);

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
          <div className="flex items-center gap-2 p-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
              <span className="font-bold text-lg">GM</span>
            </div>
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

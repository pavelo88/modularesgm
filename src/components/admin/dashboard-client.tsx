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
  Zap,
  Palette,
  Handshake,
  LineChart,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  useSidebar,
} from '@/components/ui/sidebar';
import type { SiteContent } from '@/lib/types';
import { CmsGeneralForm } from './cms-general-form';
import { CmsServicesForm } from './cms-services-form';
import { CmsProductsForm } from './cms-products-form';
import { CmsBrandsStatsForm } from './cms-brands-stats-form';
import { CmsThemeForm } from './cms-theme-form';
import { LeadsManager } from './leads-manager';
import { OrdersManager } from './orders-manager';
import { AffiliatesManager } from './affiliates-manager';
import { AnalyticsDashboard } from './analytics-dashboard';
import { UsersManager } from './users-manager';
import { logout } from '@/lib/actions';
import { defaultSiteContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';

type AdminTab =
  | 'analytics'
  | 'users'
  | 'general'
  | 'theme'
  | 'services'
  | 'products'
  | 'brands'
  | 'leads'
  | 'orders'
  | 'affiliates';

const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'analytics', label: 'Analítica', icon: <LineChart className="h-4 w-4" /> },
  { id: 'users', label: 'Usuarios y Roles', icon: <Users className="h-4 w-4" /> },
  { id: 'general', label: 'Inicio y Contacto', icon: <Settings className="h-4 w-4" /> },
  { id: 'theme', label: 'Apariencia y Colores', icon: <Palette className="h-4 w-4" /> },
  { id: 'services', label: 'Servicios', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'products', label: 'Tienda Online', icon: <ShoppingBag className="h-4 w-4" /> },
  { id: 'brands', label: 'Marcas y Experiencia (Stats)', icon: <Zap className="h-4 w-4" /> },
  { id: 'leads', label: 'Leads (Contactos)', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'orders', label: 'Órdenes de Compra', icon: <FileCode className="h-4 w-4" /> },
  { id: 'affiliates', label: 'Afiliados', icon: <Handshake className="h-4 w-4" /> },
];

function NavItem({ item, activeTab, setActiveTab }: { item: any, activeTab: AdminTab, setActiveTab: (tab: AdminTab) => void }) {
  const { setOpenMobile } = useSidebar();
  const isActive = activeTab === item.id;
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => {
          setActiveTab(item.id);
          setOpenMobile(false);
        }}
        isActive={isActive}
        tooltip={item.label}
        className={cn(
          "rounded-2xl transition-all duration-200 active:scale-95 text-xs font-semibold py-2.5 px-3",
          isActive
            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md shadow-black/5 dark:shadow-white/5 font-bold"
            : "text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
        )}
      >
        {item.icon}
        <span className="truncate">{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Las reglas de Firestore exigen sesión de Firebase: sin ella volvemos al login.
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/admin');
      else setAuthReady(true);
    });
  }, [router]);

  useEffect(() => {
    const contentRef = doc(db, 'siteContent', 'main');
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteContent;
        setSiteContent({
          ...defaultSiteContent,
          ...data,
          services: data.services && data.services.length > 0 ? data.services : defaultSiteContent.services,
          brands: data.brands && data.brands.length > 0 ? data.brands : defaultSiteContent.brands,
          stats: data.stats && data.stats.length > 0 ? data.stats : defaultSiteContent.stats,
          products: data.products && data.products.length > 0 ? data.products : defaultSiteContent.products,
          theme: data.theme ? { ...defaultSiteContent.theme, ...data.theme } : defaultSiteContent.theme,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading admin content:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (loading || !authReady) {
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full" />
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
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <UsersManager />;
      case 'general':
        return <CmsGeneralForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
      case 'theme':
        return <CmsThemeForm siteContent={siteContent} setSiteContent={setSiteContentWrapper} />;
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
      case 'affiliates':
        return <AffiliatesManager />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#0c0e12]/70 backdrop-blur-2xl">
        <SidebarHeader className="p-4 border-b border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center gap-3 p-1">
            <div className="relative w-9 h-9 overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-1 shadow-sm shrink-0">
              <Image src="/logo.png" alt="Modulares GM" fill className="object-contain p-1" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-stone-950 dark:text-white font-headline">Modulares GM</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">HQ</span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">Panel Administrativo</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-3">
          <SidebarMenu className="space-y-1">
            {menuItems.map((item) => (
              <NavItem key={item.id} item={item} activeTab={activeTab} setActiveTab={setActiveTab} />
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t border-stone-200/60 dark:border-stone-800/60">
          <form action={logout} onSubmit={() => { signOut(auth); }} className="w-full">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Cerrar Sesión"
                  type="submit"
                  className="rounded-2xl text-xs font-semibold py-2.5 px-3 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 transition-colors active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-[#FAF8F5]/60 dark:bg-[#080a0d]/60 overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-stone-200/80 dark:border-stone-800/80 bg-background/80 backdrop-blur-xl transition-colors">
           <div className="flex items-center gap-3">
             <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors" />
             <div>
               <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-headline">
                  {menuItems.find(item => item.id === activeTab)?.label}
               </h1>
             </div>
           </div>
           {mounted && (
             <Button
               variant="outline"
               size="sm"
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-background/80 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-95 shadow-sm"
               title="Alternar Modo Claro / Oscuro"
             >
               {theme === 'dark' ? (
                 <>
                   <Sun className="h-3.5 w-3.5 text-amber-500" />
                   <span className="hidden sm:inline">Modo Claro</span>
                 </>
               ) : (
                 <>
                   <Moon className="h-3.5 w-3.5 text-slate-700" />
                   <span className="hidden sm:inline">Modo Oscuro</span>
                 </>
               )}
             </Button>
           )}
        </header>
        {/* Apple Style Main Area */}
        <main className="h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            {renderContent()}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
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
  UserPlus,
  Plus,
  Save,
  RotateCcw,
  Loader2,
  Search,
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
import type { SiteContent, Service, Product, Brand, Stat } from '@/lib/types';
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
import { logout, saveSiteContent } from '@/lib/actions';
import { defaultSiteContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { AnalyticsDays } from '@/lib/ga-report';
import {
  type AdminTab,
  ANALYTICS_PERIODS,
  getTabHeaderInfo,
  findJumpMatch,
} from './admin-header-utils';
import { restoreTabDefaults } from './admin-restore-utils';

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
  const [analyticsDays, setAnalyticsDays] = useState<AnalyticsDays>(28);
  const [isSaving, startSaving] = useTransition();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  // Trigger para abrir el modal de crear usuario desde la barra superior
  const openCreateUserModalRef = useRef<(() => void) | null>(null);

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

  const setSiteContentWrapper = (value: React.SetStateAction<SiteContent>) => {
    setSiteContent((prev) => {
      if (typeof value === 'function') {
        return value(prev || defaultSiteContent);
      }
      return value;
    });
  };

  const isCmsEditableTab = ['general', 'theme', 'services', 'products', 'brands'].includes(activeTab);

  const handleGlobalSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Cambios guardados correctamente en la web.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleGlobalRestore = () => {
    const didRestore = restoreTabDefaults(activeTab, setSiteContentWrapper);
    if (didRestore) {
      toast({ title: 'Valores restablecidos', description: 'Guarda los cambios para aplicarlos en vivo.' });
    }
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now(),
      title: 'Nuevo Servicio',
      desc: 'Descripción del nuevo servicio...',
      imgUrl: defaultSiteContent.services[0]?.imgUrl || '',
      icon: 'Grid',
      catalogUrl: ''
    };
    setSiteContent(prev => ({
      ...prev,
      services: [newService, ...prev.services]
    }));
    toast({
      title: "Servicio añadido",
      description: "Edita sus datos y guarda los cambios para publicarlo.",
    });
  };

  const [adminSearch, setAdminSearch] = useState('');

  const handleGlobalContentSearch = (query: string) => {
    setAdminSearch(query);
    const match = findJumpMatch(query);
    if (!match) return;

    setActiveTab(match.tab);
    if (match.elementId) {
      setTimeout(() => {
        const el = document.getElementById(match.elementId!);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement)?.focus?.();
      }, 150);
    }
    toast({ title: 'Sección localizada', description: match.feedback });
  };

  const headerInfo = getTabHeaderInfo(activeTab, siteContent.services.length, siteContent.products.length);

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
    
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard days={analyticsDays} setDays={setAnalyticsDays} />;
      case 'users':
        return (
          <UsersManager
            onRegisterCreateUserTrigger={(trigger) => {
              openCreateUserModalRef.current = trigger;
            }}
          />
        );
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
        <SidebarHeader className="h-16 px-4 py-0 border-b border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center">
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-8 h-8 overflow-hidden rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-1 shadow-sm shrink-0">
              <Image src="/logo.png" alt="Modulares GM" fill className="object-contain p-0.5" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-tight text-stone-950 dark:text-white font-headline">Modulares GM</span>
                <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300">HQ</span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium mt-0.5">Panel Administrativo</span>
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
      <SidebarInset className="bg-[#FAF8F5]/60 dark:bg-[#080a0d]/60 flex flex-col h-screen overflow-hidden">
        {/* Único Header Superior 100% FIJO */}
        <header className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] data-[collapsed=true]:md:left-[var(--sidebar-width-icon)] z-40 flex items-center justify-between h-16 px-4 sm:px-6 border-b border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/95 dark:bg-[#0c0e12]/95 backdrop-blur-2xl transition-[left] duration-200 gap-3">
           <div className="flex items-center gap-3 min-w-0">
             <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors shrink-0" />
             <div className="min-w-0">
               <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-foreground font-headline truncate leading-tight">
                  {headerInfo.title}
               </h1>
               <p className="text-[11px] sm:text-xs text-muted-foreground truncate leading-tight mt-0.5 max-w-xl">
                  {headerInfo.desc}
               </p>
             </div>
           </div>

           <div className="flex items-center gap-2.5 shrink-0">
             {/* Buscador inteligente de contenidos y textos */}
             <div className="relative hidden lg:block w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
               <input
                 type="text"
                 placeholder="Pegar texto (ej. Tranquilidad absoluta...)"
                 value={adminSearch}
                 onChange={(e) => handleGlobalContentSearch(e.target.value)}
                 className="w-full h-9 pl-9 pr-3 rounded-xl text-xs bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-foreground placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
               />
             </div>
             {/* Controles contextuales por pestaña */}
             {activeTab === 'analytics' && (
               <div role="group" aria-label="Periodo de analítica" className="inline-flex rounded-xl border border-stone-200 dark:border-stone-800 bg-background/80 p-0.5 shadow-xs">
                 {ANALYTICS_PERIODS.map((p) => (
                   <button
                     key={p.days}
                     type="button"
                     onClick={() => setAnalyticsDays(p.days)}
                     aria-pressed={analyticsDays === p.days}
                     className={cn(
                       'rounded-lg px-2.5 py-1 text-xs font-semibold transition-all active:scale-95',
                       analyticsDays === p.days
                         ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-xs'
                         : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
                     )}
                   >
                     {p.label}
                   </button>
                 ))}
               </div>
             )}

             {activeTab === 'users' && (
               <Button
                 size="sm"
                 onClick={() => {
                   if (openCreateUserModalRef.current) {
                     openCreateUserModalRef.current();
                   }
                 }}
                 className="rounded-full text-xs font-bold h-9 px-3.5 bg-stone-900 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-100 shadow-sm gap-1.5 active:scale-95"
               >
                 <UserPlus className="h-3.5 w-3.5" />
                 <span className="hidden sm:inline">+ Añadir Usuario</span>
                 <span className="sm:hidden">Añadir</span>
               </Button>
             )}

             {activeTab === 'services' && (
               <Button
                 size="sm"
                 variant="outline"
                 onClick={handleAddService}
                 className="rounded-full text-xs font-bold h-9 px-3.5 border-stone-300 dark:border-stone-700 bg-background/80 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-sm gap-1.5 active:scale-95"
               >
                 <Plus className="h-3.5 w-3.5" />
                 <span>+ Añadir</span>
               </Button>
             )}

             {/* Acciones de guardado rápido en cabecera para pestañas editables */}
             {isCmsEditableTab && (
               <div className="flex items-center gap-1.5">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={handleGlobalRestore}
                   title="Restaurar valores de esta sección"
                   className="hidden md:inline-flex rounded-full text-xs font-medium h-9 px-3 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95"
                 >
                   <RotateCcw className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                   <span>Restaurar</span>
                 </Button>
                 <Button
                   size="sm"
                   onClick={handleGlobalSave}
                   disabled={isSaving}
                   className="rounded-full text-xs font-bold h-9 px-3.5 bg-stone-900 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-100 shadow-sm gap-1.5 active:scale-95"
                 >
                   {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                   <span>Guardar</span>
                 </Button>
               </div>
             )}

             {/* Botón Circular Modo Claro / Oscuro (sin texto) */}
             {mounted && (
               <Button
                 variant="outline"
                 size="icon"
                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 className="h-9 w-9 rounded-full border border-stone-300 dark:border-stone-700 bg-background/80 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active:scale-95 shadow-sm shrink-0"
                 title="Alternar Modo Claro / Oscuro"
                 aria-label="Alternar modo claro u oscuro"
               >
                 {theme === 'dark' ? (
                   <Sun className="h-4 w-4 text-amber-500" />
                 ) : (
                   <Moon className="h-4 w-4 text-slate-700" />
                 )}
               </Button>
             )}
           </div>
        </header>

        {/* Apple Style Main Area */}
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pb-32">
            {renderContent()}
          </div>
        </main>

        {/* Barra de guardado/acciones de TODO EL ANCHO fija en la parte inferior */}
        {isCmsEditableTab && (
          <footer
            aria-label="Barra de acciones persistente"
            className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-width)] z-40 h-16 border-t border-stone-200/90 dark:border-stone-800/90 bg-[#FAF8F5]/95 dark:bg-[#0c0e12]/95 backdrop-blur-2xl transition-[left] duration-200 px-4 sm:px-8 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline font-medium">Cambios en {headerInfo.title}:</span>
              <span className="text-[11px] text-stone-500">Recuerda guardar para publicar en la web en vivo.</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGlobalRestore}
                className="h-10 px-4 rounded-xl text-xs font-semibold border-stone-300 dark:border-stone-700 bg-background/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 active:scale-95 transition-all shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-stone-500" />
                <span>Restaurar</span>
              </Button>
              <Button
                size="sm"
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="h-10 px-6 rounded-xl text-xs font-bold bg-stone-900 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-100 shadow-md active:scale-95 transition-all gap-1.5"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Guardar Cambios</span>
              </Button>
            </div>
          </footer>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}


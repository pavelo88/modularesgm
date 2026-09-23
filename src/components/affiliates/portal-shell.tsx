'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Banknote,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Moon,
  Network,
  Sun,
  TrendingUp,
  UserCircle,
} from 'lucide-react';
import { AffiliateSessionProvider, affiliateSignOut, useAffiliateSession } from '@/context/affiliate-session';
import { ForcePasswordModal } from '@/components/affiliates/force-password-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/afiliados/portal', label: 'Resumen', icon: LayoutDashboard },
  { href: '/afiliados/portal/ganancias', label: 'Ganancias', icon: TrendingUp },
  { href: '/afiliados/portal/red', label: 'Mi red', icon: Network },
  { href: '/afiliados/portal/retiros', label: 'Retiros', icon: Banknote },
  { href: '/afiliados/portal/recursos', label: 'Recursos', icon: BookOpen },
  { href: '/afiliados/portal/perfil', label: 'Perfil', icon: UserCircle },
];

function PortalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { theme, setTheme } = useTheme();
  const { status, user, affiliate } = useAffiliateSession();

  // Guardas: sin sesión, sin perfil o suspendido → de vuelta al formulario con un motivo genérico.
  useEffect(() => {
    if (status === 'anon') router.replace('/afiliados/acceso');
    if (status === 'no_profile' || status === 'suspended') {
      affiliateSignOut().finally(() =>
        router.replace(`/afiliados/acceso?error=${status === 'suspended' ? 'suspended' : 'not_found'}`)
      );
    }
  }, [status, router]);

  if (status !== 'ready' || !affiliate || !user) {
    return (
      <div className="min-h-screen p-8 space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      <aside className="md:w-64 md:min-h-screen md:sticky md:top-0 md:self-start bg-card border-b md:border-b-0 md:border-r">
        <div className="p-5 flex items-center gap-3">
          <Image src="/logo.png" alt="Modulares GM" width={40} height={40} className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <p className="font-bold text-sm">Portal de afiliados</p>
            <p className="text-xs text-muted-foreground truncate max-w-[9rem]">@{affiliate.username}</p>
          </div>
        </div>
        <nav aria-label="Portal" className="px-3 pb-3 flex md:flex-col gap-1 overflow-x-auto">
          {nav.map((item) => {
            const active = item.href === '/afiliados/portal' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex p-3 mt-4 gap-2 border-t">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Cambiar tema"
            className="rounded-lg p-2.5 text-muted-foreground hover:bg-muted"
          >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="dark:hidden" />
          </button>
          <button
            type="button"
            onClick={() => affiliateSignOut().then(() => router.push('/afiliados'))}
            className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-10 max-w-6xl">{children}</main>
      {affiliate.forcePasswordChange && <ForcePasswordModal user={user} />}
    </div>
  );
}

export function PortalShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AffiliateSessionProvider>
      <PortalShell>{children}</PortalShell>
    </AffiliateSessionProvider>
  );
}

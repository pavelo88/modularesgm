'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Banknote, BookOpen, ChevronDown, ExternalLink, LayoutDashboard, LogOut, Network, TrendingUp, UserCircle } from 'lucide-react';
import { AffiliateSessionProvider, affiliateSignOut, useAffiliateSession } from '@/context/affiliate-session';
import { PasswordSetupDialog } from '@/components/affiliates/password-setup-dialog';
import { Initials, StatusPill } from '@/components/affiliates/portal-ui';
import { ThemeToggle, usePortalTheme } from '@/components/affiliates/portal-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/afiliados/portal', label: 'Resumen', short: 'Resumen', icon: LayoutDashboard },
  { href: '/afiliados/portal/ganancias', label: 'Ganancias', short: 'Ganancias', icon: TrendingUp },
  { href: '/afiliados/portal/red', label: 'Mi red', short: 'Red', icon: Network },
  { href: '/afiliados/portal/retiros', label: 'Retiros', short: 'Retiros', icon: Banknote },
  { href: '/afiliados/portal/recursos', label: 'Recursos', short: 'Recursos', icon: BookOpen },
  { href: '/afiliados/portal/perfil', label: 'Perfil', short: 'Perfil', icon: UserCircle },
];

const isActive = (href: string, pathname: string) => (href === '/afiliados/portal' ? pathname === href : pathname.startsWith(href));

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/afiliados/portal" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Image src="/logo.png" alt="Modulares GM" width={40} height={40} className="h-10 w-10 object-contain" priority />
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight">Modulares GM</span>
        {!compact && <span className="block text-[11px] text-muted-foreground">Portal de afiliados</span>}
      </span>
    </Link>
  );
}

function PortalShell({ children }: { children: React.ReactNode }) {
  usePortalTheme();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { status, user, affiliate } = useAffiliateSession();
  // Se guarda aparte: al cambiar la clave el perfil se actualiza al instante y, sin esto, el cuadro
  // se desmontaría antes de mostrar la confirmación.
  const [pwOpen, setPwOpen] = useState(false);
  useEffect(() => {
    if (affiliate?.forcePasswordChange) setPwOpen(true);
  }, [affiliate?.forcePasswordChange]);

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
      <div className="mx-auto max-w-5xl space-y-4 p-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const current = nav.find((n) => isActive(n.href, pathname)) ?? nav[0];
  const signOut = () => affiliateSignOut().then(() => router.push('/afiliados'));
  const firstName = affiliate.name.split(' ')[0];

  return (
    <>
      {/* ───────── Menú lateral (escritorio) ───────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col bg-card/70 shadow-[1px_0_0_hsl(var(--border)/0.85)] backdrop-blur-xl lg:flex">
        <div className="px-5 pb-4 pt-6">
          <Brand />
        </div>

        <nav aria-label="Portal" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {nav.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium',
                  'transition-[background-color,color,transform] duration-150 ease-emil-out active:scale-[0.98] motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'bg-primary/10 text-primary before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 space-y-2 rounded-2xl bg-muted/60 p-3 shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
          <div className="flex items-center gap-3">
            <Initials name={affiliate.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">{affiliate.name}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">@{affiliate.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <StatusPill tone="brand">{affiliate.rank}</StatusPill>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-background hover:text-foreground active:scale-95"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[17rem]">
        {/* ───────── Encabezado (todas las pantallas) ───────── */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/80 px-4 shadow-[0_1px_0_hsl(var(--border)/0.85)] backdrop-blur-xl md:px-8">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <div className="hidden items-center gap-2 text-sm lg:flex">
            <span className="text-muted-foreground">Portal</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-semibold">{current.label}</span>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <a
              href="/store"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-95 sm:flex"
            >
              Ver tienda <ExternalLink size={13} />
            </a>
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Menú de tu cuenta"
                className="ml-1 flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-[background-color,transform] duration-150 hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Initials name={affiliate.name} size={34} />
                <span className="hidden max-w-[7rem] truncate text-sm font-medium md:block">{firstName}</span>
                <ChevronDown size={15} className="hidden text-muted-foreground md:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-xl p-1.5">
                <DropdownMenuLabel className="px-2.5 py-2">
                  <p className="truncate text-sm font-semibold">{affiliate.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{affiliate.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2">
                  <Link href="/afiliados/portal/perfil">
                    <UserCircle size={16} className="mr-2" /> Mi perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-2.5 py-2">
                  <a href="/store" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} className="mr-2" /> Ver tienda
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut} className="cursor-pointer rounded-lg px-2.5 py-2 text-destructive focus:text-destructive">
                  <LogOut size={16} className="mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 md:px-8 md:py-10 lg:pb-14">{children}</main>
      </div>

      {/* ───────── Barra inferior (celular y tablet) ───────── */}
      <nav
        aria-label="Portal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 bg-background/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_0_hsl(var(--border)/0.85)] backdrop-blur-xl lg:hidden"
      >
        {nav.map((item) => {
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[10px] font-medium',
                'transition-[color,transform] duration-150 ease-emil-out active:scale-95 motion-reduce:transition-none',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-5 top-0 h-[3px] origin-center rounded-b-full bg-primary transition-transform duration-200 ease-emil-out motion-reduce:transition-none',
                  active ? 'scale-x-100' : 'scale-x-0'
                )}
              />
              <item.icon size={20} strokeWidth={active ? 2.3 : 1.9} />
              {item.short}
            </Link>
          );
        })}
      </nav>

      <PasswordSetupDialog open={pwOpen} user={user} askCurrent onDone={() => setPwOpen(false)} />
    </>
  );
}

export function PortalShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AffiliateSessionProvider>
      <PortalShell>{children}</PortalShell>
    </AffiliateSessionProvider>
  );
}

export { PortalShell };

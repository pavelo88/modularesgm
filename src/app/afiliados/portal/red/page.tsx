'use client';

import { useMemo } from 'react';
import { Network, UserPlus, Users } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { SITE_BASE } from '@/lib/site';
import type { AffiliateAccount } from '@/lib/affiliate-core';
import {
  EmptyState,
  Initials,
  LinkField,
  PageHeader,
  SectionTitle,
  StatCard,
  StatusPill,
  enter,
  money,
  shortDate,
  surface,
  useUserDocs,
} from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

type Member = AffiliateAccount & { id: string };

/** Nombre + inicial del apellido: la red no expone datos personales completos. */
const displayName = (full: string) => {
  const [first, ...rest] = full.trim().split(/\s+/);
  return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
};

export default function NetworkPage() {
  const { affiliate, settings } = useAffiliateAccount();
  const children = useUserDocs<Member>('affiliates', 'parentId', affiliate.username);
  const grandchildren = useUserDocs<Member>('affiliates', 'granId', affiliate.username);

  const level1 = useMemo(() => children.docs.filter((m) => m.username !== affiliate.username), [children.docs, affiliate.username]);
  const level2 = useMemo(
    () => grandchildren.docs.filter((m) => m.username !== affiliate.username && m.parentId !== affiliate.username),
    [grandchildren.docs, affiliate.username]
  );
  const inviteLink = `${SITE_BASE}/afiliados/acceso?tab=registro&sponsor=${affiliate.username}`;

  const levelPanel = (title: string, members: Member[], loading: boolean, bonus: number, delay: number) => (
    <section style={{ animationDelay: `${delay}ms` }} className={cn(surface, enter, 'overflow-hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 shadow-[0_1px_0_hsl(var(--border)/0.7)]">
        <h2 className="font-semibold">{title}</h2>
        <StatusPill tone="brand">Ganas {bonus}% de sus ventas</StatusPill>
      </div>

      {loading ? (
        <p className="px-5 py-12 text-center text-sm text-muted-foreground">Cargando…</p>
      ) : members.length === 0 ? (
        <EmptyState icon={Users}>Aún no tienes personas en este nivel.</EmptyState>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-3">Afiliado</th>
                  <th className="px-3 py-3">Usuario</th>
                  <th className="px-3 py-3 text-right">Ventas</th>
                  <th className="px-3 py-3 text-right">Volumen</th>
                  <th className="px-5 py-3">Ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {members.map((m) => (
                  <tr key={m.username} className="transition-colors duration-150 hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Initials name={m.name} size={34} />
                        <span className="font-medium">{displayName(m.name)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 font-mono text-xs text-muted-foreground">@{m.username}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{m.salesCount}</td>
                    <td className="px-3 py-3.5 text-right tabular-nums">{money(m.cumulativePersonalVolume)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{shortDate(m.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-border/60 md:hidden">
            {members.map((m) => (
              <li key={m.username} className="flex items-center gap-3 px-4 py-3.5">
                <Initials name={m.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{displayName(m.name)}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">@{m.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold tabular-nums">{money(m.cumulativePersonalVolume)}</p>
                  <p className="text-xs text-muted-foreground">{m.salesCount} ventas</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );

  return (
    <>
      <PageHeader eyebrow="Equipo" title="Mi red" subtitle="Las personas que invitaste y las que ellas invitaron. Ganas una parte de sus ventas." />

      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:gap-4 lg:grid-cols-3">
        <StatCard tone="primary" delay={60} icon={Users} label="Directos (nivel 1)" value={String(level1.length)} />
        <StatCard delay={100} icon={Network} label="Nivel 2" value={String(level2.length)} />
        <StatCard delay={140} icon={UserPlus} label="Volumen de tu red" value={money(affiliate.networkVolume)} className="col-span-2 lg:col-span-1" />
      </div>

      <section style={{ animationDelay: '160ms' }} className={cn(surface, enter, 'relative mb-6 overflow-hidden p-5 md:mb-8 md:p-6')}>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="relative">
          <SectionTitle icon={UserPlus} title="Invita a otros afiliados" hint="Quien se registre con este enlace queda en tu red." />
          <LinkField value={inviteLink} label="Copiar invitación" />
        </div>
      </section>

      <div className="space-y-6 md:space-y-8">
        {levelPanel('Nivel 1 · Tus referidos directos', level1, children.loading, settings.parentRate, 200)}
        {levelPanel('Nivel 2 · Referidos de tus referidos', level2, grandchildren.loading, settings.grandparentRate, 240)}
      </div>
    </>
  );
}

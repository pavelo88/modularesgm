'use client';

import { useMemo } from 'react';
import { Network, UserPlus, Users } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { SITE_BASE } from '@/lib/site';
import type { AffiliateAccount } from '@/lib/affiliate-core';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CopyButton, EmptyState, PageHeader, StatCard, money, shortDate, useUserDocs } from '@/components/affiliates/portal-ui';

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

  const table = (title: string, members: Member[], loading: boolean, bonus: number) => (
    <Card className="rounded-2xl overflow-hidden">
      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Badge variant="outline">Ganas {bonus}% de sus ventas</Badge>
      </div>
      {loading ? (
        <EmptyState>Cargando…</EmptyState>
      ) : members.length === 0 ? (
        <EmptyState>Aún no tienes personas en este nivel.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
              <tr>
                <th className="text-left p-3">Afiliado</th>
                <th className="text-left p-3">Usuario</th>
                <th className="text-right p-3">Ventas</th>
                <th className="text-right p-3">Volumen</th>
                <th className="text-left p-3">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.username} className="border-t">
                  <td className="p-3 font-medium">{displayName(m.name)}</td>
                  <td className="p-3 text-muted-foreground">@{m.username}</td>
                  <td className="p-3 text-right">{m.salesCount}</td>
                  <td className="p-3 text-right">{money(m.cumulativePersonalVolume)}</td>
                  <td className="p-3 whitespace-nowrap">{shortDate(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  return (
    <>
      <PageHeader eyebrow="Equipo" title="Mi red" />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Users} label="Directos (nivel 1)" value={String(level1.length)} />
        <StatCard icon={Network} label="Nivel 2" value={String(level2.length)} />
        <StatCard icon={UserPlus} label="Volumen de tu red" value={money(affiliate.networkVolume)} />
      </div>

      <Card className="p-6 rounded-2xl mb-8">
        <h2 className="font-bold mb-1">Invita a otros afiliados</h2>
        <p className="text-sm text-muted-foreground mb-4">Quien se registre con este enlace queda en tu red.</p>
        <p className="font-mono text-xs md:text-sm break-all rounded-lg bg-muted px-4 py-3 mb-3">{inviteLink}</p>
        <CopyButton text={inviteLink} label="Copiar enlace de invitación" />
      </Card>

      <div className="space-y-8">
        {table('Nivel 1 · Tus referidos directos', level1, children.loading, settings.parentRate)}
        {table('Nivel 2 · Referidos de tus referidos', level2, grandchildren.loading, settings.grandparentRate)}
      </div>
    </>
  );
}

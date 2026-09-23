'use client';

import { useMemo } from 'react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState, PageHeader, StatCard, money, shortDate, useUserDocs } from '@/components/affiliates/portal-ui';
import { PiggyBank, Undo2, Wallet } from 'lucide-react';

interface Commission {
  id: string;
  orderId: string;
  createdAt: string;
  role: string;
  level: number;
  percentage: number;
  saleAmount: number;
  commissionAmount: number;
  customerFirstName?: string;
  status: 'credited' | 'reversed';
}

export default function EarningsPage() {
  const { affiliate } = useAffiliateAccount();
  const { docs, loading } = useUserDocs<Commission>('affiliate_commissions', 'affiliateUsername', affiliate.username);
  const rows = useMemo(() => [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [docs]);
  const credited = rows.filter((r) => r.status === 'credited').reduce((t, r) => t + r.commissionAmount, 0);
  const reversed = rows.filter((r) => r.status === 'reversed').reduce((t, r) => t + r.commissionAmount, 0);

  return (
    <>
      <PageHeader eyebrow="Finanzas" title="Mis ganancias" />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={PiggyBank} label="Comisiones acreditadas" value={money(credited)} />
        <StatCard icon={Wallet} label="Disponible ahora" value={money(affiliate.availableBalance)} />
        <StatCard icon={Undo2} label="Revertidas" value={money(reversed)} />
      </div>
      <Card className="rounded-2xl overflow-hidden">
        {loading ? (
          <EmptyState>Cargando…</EmptyState>
        ) : rows.length === 0 ? (
          <EmptyState>Todavía no hay movimientos.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Concepto</th>
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-right p-3">Venta</th>
                  <th className="text-right p-3">%</th>
                  <th className="text-right p-3">Comisión</th>
                  <th className="text-left p-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 whitespace-nowrap">{shortDate(r.createdAt)}</td>
                    <td className="p-3">{r.role}</td>
                    <td className="p-3">{r.customerFirstName || '—'}</td>
                    <td className="p-3 text-right">{money(r.saleAmount)}</td>
                    <td className="p-3 text-right">{r.percentage}%</td>
                    <td className="p-3 text-right font-bold">{money(r.commissionAmount)}</td>
                    <td className="p-3">
                      <Badge variant={r.status === 'credited' ? 'default' : 'destructive'}>
                        {r.status === 'credited' ? 'Acreditada' : 'Revertida'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

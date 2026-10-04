'use client';

import { useMemo, useState } from 'react';
import { PiggyBank, Receipt, Undo2, Wallet } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import {
  EmptyState,
  Initials,
  PageHeader,
  Segmented,
  StatCard,
  StatusPill,
  enter,
  money,
  shortDate,
  surface,
  useUserDocs,
} from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

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
  kind?: string;
  status: 'credited' | 'reversed';
}

type Filter = 'all' | 'credited' | 'reversed';

export default function EarningsPage() {
  const { affiliate } = useAffiliateAccount();
  const { docs, loading } = useUserDocs<Commission>('affiliate_commissions', 'affiliateUsername', affiliate.username);
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [docs]);
  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  const credited = rows.filter((r) => r.status === 'credited').reduce((t, r) => t + r.commissionAmount, 0);
  const reversed = rows.filter((r) => r.status === 'reversed').reduce((t, r) => t + r.commissionAmount, 0);

  return (
    <>
      <PageHeader eyebrow="Finanzas" title="Mis ganancias" subtitle="Cada comisión que generan tus ventas y las de tu red, en tiempo real." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 md:mb-8 md:gap-4">
        <StatCard tone="primary" delay={60} icon={Wallet} label="Disponible ahora" value={money(affiliate.availableBalance)} />
        <StatCard delay={100} icon={PiggyBank} label="Comisiones acreditadas" value={money(credited)} />
        <StatCard delay={140} icon={Undo2} label="Revertidas" value={money(reversed)} hint="Pedidos cancelados o devueltos" />
      </div>

      <section style={{ animationDelay: '180ms' }} className={cn(surface, enter, 'overflow-hidden')}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 shadow-[0_1px_0_hsl(var(--border)/0.7)]">
          <h2 className="font-semibold">Movimientos</h2>
          <Segmented
            label="Filtrar movimientos"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'credited', label: 'Acreditadas' },
              { value: 'reversed', label: 'Revertidas' },
            ]}
          />
        </div>

        {loading ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">Cargando…</p>
        ) : shown.length === 0 ? (
          <EmptyState icon={Receipt}>
            {rows.length === 0 ? 'Todavía no hay movimientos. Cuando tus ventas se paguen, aparecerán aquí.' : 'No hay movimientos con este filtro.'}
          </EmptyState>
        ) : (
          <>
            {/* Escritorio: tabla */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-5 py-3">Fecha</th>
                    <th className="px-3 py-3">Concepto</th>
                    <th className="px-3 py-3">Cliente</th>
                    <th className="px-3 py-3 text-right">Venta</th>
                    <th className="px-3 py-3 text-right">%</th>
                    <th className="px-3 py-3 text-right">Comisión</th>
                    <th className="px-5 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {shown.map((r) => (
                    <tr key={r.id} className="transition-colors duration-150 hover:bg-muted/40">
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{shortDate(r.createdAt)}</td>
                      <td className="px-3 py-3.5 font-medium">{r.role}</td>
                      <td className="px-3 py-3.5 text-muted-foreground">{r.customerFirstName || '—'}</td>
                      <td className="px-3 py-3.5 text-right tabular-nums">{r.kind === 'pool' ? '—' : money(r.saleAmount)}</td>
                      <td className="px-3 py-3.5 text-right tabular-nums text-muted-foreground">{r.percentage}%</td>
                      <td className="px-3 py-3.5 text-right font-bold tabular-nums">{money(r.commissionAmount)}</td>
                      <td className="px-5 py-3.5">
                        <StatusPill tone={r.status === 'credited' ? 'success' : 'danger'}>{r.status === 'credited' ? 'Acreditada' : 'Revertida'}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Celular: lista */}
            <ul className="divide-y divide-border/60 md:hidden">
              {shown.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3.5">
                  <Initials name={r.customerFirstName || 'Venta'} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.role}</p>
                    <p className="text-xs text-muted-foreground">
                      {shortDate(r.createdAt)}
                      {r.customerFirstName ? ` · ${r.customerFirstName}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className={cn('text-sm font-bold tabular-nums', r.status === 'credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground line-through')}>
                      +{money(r.commissionAmount)}
                    </p>
                    <StatusPill tone={r.status === 'credited' ? 'success' : 'danger'}>{r.status === 'credited' ? 'Acreditada' : 'Revertida'}</StatusPill>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}

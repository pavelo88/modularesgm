'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Ban, Check, Download, Loader2, Wallet, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { DEFAULT_AFFILIATE_SETTINGS, ROOT_USERNAME, roundMoney, type AffiliateAccount, type AffiliateSettings } from '@/lib/affiliate-core';
import { processWithdrawal, saveAffiliateSettings, setAffiliateStatus } from '@/lib/affiliate-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Order } from '@/lib/types';

const money = (n: number) => `$${n.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const day = (v: string | number) => new Date(v).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
const PAID = ['Pago Verificado', 'En proceso', 'Enviado', 'Completado'];

interface Commission {
  id: string;
  orderId: string;
  affiliateUsername: string;
  level: number;
  commissionAmount: number;
  status: 'credited' | 'reversed';
}
interface Withdrawal {
  id: string;
  affiliateUsername: string;
  affiliateName: string;
  amountUsd: number;
  method: string;
  accountDetails: string;
  status: 'pending' | 'paid' | 'rejected';
  createdAt: string;
}

function useLive<T>(name: string) {
  const [rows, setRows] = useState<T[]>([]);
  useEffect(
    () =>
      onSnapshot(
        collection(db, name),
        (s) => setRows(s.docs.map((d) => ({ id: d.id, ...d.data() }) as T)),
        (e) => console.error(`[admin] ${name}`, e)
      ),
    [name]
  );
  return rows;
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

const Kpi = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Card>
    <CardContent className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </CardContent>
  </Card>
);

export function AffiliatesManager() {
  const { toast } = useToast();
  const orders = useLive<Order & { id: string }>('orders');
  const affiliates = useLive<AffiliateAccount>('affiliates');
  const commissions = useLive<Commission>('affiliate_commissions');
  const withdrawals = useLive<Withdrawal>('affiliate_withdrawals');
  const [settings, setSettings] = useState<AffiliateSettings>(DEFAULT_AFFILIATE_SETTINGS);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    getDoc(doc(db, 'siteContent', 'affiliate'))
      .then((s) => s.exists() && setSettings({ ...DEFAULT_AFFILIATE_SETTINGS, ...(s.data() as Partial<AffiliateSettings>) }))
      .catch(() => {});
  }, []);

  const summary = useMemo(() => {
    const paidOrders = orders.filter((o) => PAID.includes(o.status));
    const revenue = roundMoney(paidOrders.reduce((t, o) => t + o.total, 0));
    const affiliated = paidOrders.filter((o) => o.affiliateCode);
    const credited = commissions.filter((c) => c.status === 'credited');
    const totalCommissions = roundMoney(credited.reduce((t, c) => t + c.commissionAmount, 0));
    const toPay = roundMoney(affiliates.reduce((t, a) => t + (a.availableBalance || 0) + (a.pendingBalance || 0), 0));
    const byOrder = new Map<string, number>();
    credited.forEach((c) => byOrder.set(c.orderId, roundMoney((byOrder.get(c.orderId) || 0) + c.commissionAmount)));
    const rootEarnings = roundMoney(credited.filter((c) => c.affiliateUsername === ROOT_USERNAME).reduce((t, c) => t + c.commissionAmount, 0));
    return {
      revenue,
      paidCount: paidOrders.length,
      affiliatedRevenue: roundMoney(affiliated.reduce((t, o) => t + o.total, 0)),
      organicRevenue: roundMoney(revenue - affiliated.reduce((t, o) => t + o.total, 0)),
      totalCommissions,
      toPay,
      byOrder,
      rootEarnings,
    };
  }, [orders, commissions, affiliates]);

  const run = (fn: () => Promise<{ success: boolean; error?: string }>, ok: string) =>
    startTransition(async () => {
      const r = await fn();
      toast(r.success ? { title: ok } : { variant: 'destructive', title: 'Error', description: r.error });
    });

  const field = (key: keyof AffiliateSettings, label: string, suffix: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input type="number" min={0} step="0.5" value={settings[key]} onChange={(e) => setSettings((p) => ({ ...p, [key]: Number(e.target.value) }))} />
        <span className="text-sm text-muted-foreground w-10">{suffix}</span>
      </div>
    </div>
  );

  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending').length;

  return (
    <Tabs defaultValue="ventas" className="space-y-6">
      <TabsList>
        <TabsTrigger value="ventas">Ventas y comisiones</TabsTrigger>
        <TabsTrigger value="afiliados">Afiliados ({affiliates.length})</TabsTrigger>
        <TabsTrigger value="retiros">Retiros{pendingWithdrawals ? ` (${pendingWithdrawals})` : ''}</TabsTrigger>
        <TabsTrigger value="reglas">Reglas del plan</TabsTrigger>
      </TabsList>

      <TabsContent value="ventas" className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi label="Ventas pagadas" value={money(summary.revenue)} hint={`${summary.paidCount} pedidos`} />
          <Kpi label="Por afiliados" value={money(summary.affiliatedRevenue)} hint={`Orgánicas ${money(summary.organicRevenue)}`} />
          <Kpi label="Comisiones generadas" value={money(summary.totalCommissions)} hint={`Tuyas (fundador) ${money(summary.rootEarnings)}`} />
          <Kpi label="Por pagar a afiliados" value={money(summary.toPay)} hint="Disponible + en retiro" />
        </div>

        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle>Pedidos y su comisión</CardTitle>
              <CardDescription>Las comisiones se acreditan al verificar el pago y se revierten si el pedido se cancela.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsv('ventas-comisiones.csv', [
                  ['Fecha', 'Pedido', 'Cliente', 'Total', 'Descuento', 'Estado', 'Afiliado', 'Comisiones'],
                  ...sortedOrders.map((o) => [day(o.createdAt), o.id, o.name, o.total, o.discountAmount || 0, o.status, o.affiliateCode || 'orgánica', summary.byOrder.get(o.id) || 0]),
                ])
              }
            >
              <Download size={14} className="mr-2" /> CSV
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Fecha</th>
                  <th className="text-left py-2">Cliente</th>
                  <th className="text-right py-2">Total</th>
                  <th className="text-left py-2 pl-4">Estado</th>
                  <th className="text-left py-2">Origen</th>
                  <th className="text-right py-2">Comisiones</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.slice(0, 100).map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2.5 whitespace-nowrap">{day(o.createdAt)}</td>
                    <td className="py-2.5">{o.name}</td>
                    <td className="py-2.5 text-right">{money(o.total)}</td>
                    <td className="py-2.5 pl-4"><Badge variant="outline">{o.status}</Badge></td>
                    <td className="py-2.5">{o.affiliateCode ? <Badge>@{o.affiliateCode}</Badge> : <span className="text-muted-foreground">Orgánica</span>}</td>
                    <td className="py-2.5 text-right font-medium">{summary.byOrder.has(o.id) ? money(summary.byOrder.get(o.id)!) : '—'}</td>
                  </tr>
                ))}
                {sortedOrders.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Aún no hay pedidos.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="afiliados">
        <Card>
          <CardContent className="overflow-x-auto pt-6">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Afiliado</th>
                  <th className="text-left py-2">Patrocinador</th>
                  <th className="text-right py-2">Ventas</th>
                  <th className="text-right py-2">Disponible</th>
                  <th className="text-right py-2">Total ganado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[...affiliates].sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0)).map((a) => (
                  <tr key={a.username} className="border-t">
                    <td className="py-3">
                      <p className="font-bold">{a.name} {a.status === 'suspended' && <Badge variant="destructive">Suspendido</Badge>}</p>
                      <p className="text-xs text-muted-foreground">@{a.username} · {a.email} · {a.phone}</p>
                    </td>
                    <td className="py-3 text-muted-foreground">{a.parentId === a.username ? '—' : `@${a.parentId}`}</td>
                    <td className="py-3 text-right">{a.salesCount || 0}</td>
                    <td className="py-3 text-right">{money(a.availableBalance || 0)}</td>
                    <td className="py-3 text-right font-bold">{money(a.totalEarnings || 0)}</td>
                    <td className="py-3 text-right">
                      {a.username !== ROOT_USERNAME && (
                        <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => setAffiliateStatus(a.username, a.status === 'suspended' ? 'active' : 'suspended'), 'Estado actualizado')}>
                          <Ban size={14} className="mr-1" /> {a.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {affiliates.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">Aún no hay afiliados registrados.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="retiros">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de retiro</CardTitle>
            <CardDescription>Haz la transferencia y luego marca la solicitud como pagada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...withdrawals].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((w) => (
              <div key={w.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
                <div className="min-w-0">
                  <p className="font-bold flex items-center gap-2"><Wallet size={16} /> {money(w.amountUsd)} <span className="font-normal text-muted-foreground">· {w.affiliateName} (@{w.affiliateUsername})</span></p>
                  <p className="text-xs text-muted-foreground mt-1">{day(w.createdAt)} · {w.method} · {w.accountDetails}</p>
                </div>
                {w.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="sm" disabled={pending} onClick={() => run(() => processWithdrawal(w.id, 'paid'), 'Retiro marcado como pagado')}><Check size={14} className="mr-1" /> Pagado</Button>
                    <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => processWithdrawal(w.id, 'rejected'), 'Retiro rechazado; el saldo volvió al afiliado')}><X size={14} className="mr-1" /> Rechazar</Button>
                  </div>
                ) : (
                  <Badge variant={w.status === 'paid' ? 'default' : 'destructive'}>{w.status === 'paid' ? 'Pagado' : 'Rechazado'}</Badge>
                )}
              </div>
            ))}
            {withdrawals.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No hay solicitudes.</p>}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reglas">
        <Card>
          <CardHeader>
            <CardTitle>Reglas del plan 8-2-1</CardTitle>
            <CardDescription>Se aplican a las ventas nuevas. Estos porcentajes no se muestran en el sitio público.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {field('sellerRate', 'Vendedor directo', '%')}
              {field('parentRate', 'Patrocinador (nivel 1)', '%')}
              {field('grandparentRate', 'Nivel 2', '%')}
              {field('customerDiscount', 'Descuento al cliente', '%')}
              {field('cookieDays', 'Vigencia del enlace', 'días')}
              {field('minWithdrawal', 'Retiro mínimo', 'USD')}
            </div>
            <p className="text-xs text-muted-foreground">Total repartido por venta: {settings.sellerRate + settings.parentRate + settings.grandparentRate}% del valor cobrado. Lo que no tenga beneficiario en la cadena se acredita al fundador.</p>
            <Button disabled={pending} onClick={() => run(() => saveAffiliateSettings(settings), 'Reglas guardadas')}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar reglas
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

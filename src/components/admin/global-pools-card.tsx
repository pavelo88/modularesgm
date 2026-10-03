'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { payGlobalPoolsAction, previewGlobalPoolsAction } from '@/lib/affiliate-actions';
import type { PoolPlan } from '@/lib/affiliate-server';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const money = (n: number) => `$${n.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Mes anterior en formato AAAA-MM: los fondos se reparten con el mes ya cerrado. */
function previousMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function GlobalPoolsCard() {
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [month, setMonth] = useState(previousMonth);
  const [plan, setPlan] = useState<PoolPlan | null>(null);

  const calculate = () =>
    startTransition(async () => {
      setPlan(null);
      const r = await previewGlobalPoolsAction(month);
      if (!r.success) {
        toast({ variant: 'destructive', title: 'No se pudo calcular', description: r.error });
        return;
      }
      setPlan(r.plan);
    });

  const pay = () => {
    if (!plan) return;
    const total = plan.rows.reduce((s, r) => s + r.amountUsd, 0);
    if (!window.confirm(`Vas a acreditar ${money(total)} en saldos de afiliados por los fondos de ${plan.month}.\n\nSolo se puede hacer una vez por mes. ¿Continuar?`)) return;
    startTransition(async () => {
      const r = await payGlobalPoolsAction(plan.month);
      if (!r.success) {
        toast({ variant: 'destructive', title: 'No se pagó', description: r.error });
        if (r.plan) setPlan(r.plan);
        return;
      }
      toast({ title: `Fondos de ${plan.month} acreditados` });
      setPlan({ ...r.plan, alreadyRun: true });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fondos globales mensuales (6%)</CardTitle>
        <CardDescription>
          El 2% de las ventas del mes alimenta cada piscina. Se gana 1 acción por cada $3.000 (Negocio), $7.000 (Líder) o $15.000 (Premium) de volumen
          propio + de tu red en el mes. Si nadie califica, el fondo pasa al fundador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="pool-month">Mes</Label>
            <Input id="pool-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-44" />
          </div>
          <Button variant="outline" disabled={pending || !month} onClick={calculate}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Calcular vista previa
          </Button>
        </div>

        {plan && (
          <div className="space-y-4">
            <p className="text-sm">
              Ventas acreditadas en {plan.month}: <strong>{money(plan.totalSales)}</strong>
            </p>
            {plan.alreadyRun && (
              <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Los fondos de este mes ya fueron distribuidos. Abajo ves el cálculo, pero no se puede pagar de nuevo.
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              {plan.budgets.map((b) => (
                <div key={b.pool} className="rounded-lg border p-3 text-sm">
                  <p className="font-semibold">{b.poolName}</p>
                  <p className="text-muted-foreground">Fondo: {money(b.budgetUsd)}</p>
                  <p className="text-muted-foreground">
                    {b.totalShares} acciones · 1 por {money(b.target)}
                  </p>
                </div>
              ))}
            </div>

            {plan.rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay ventas acreditadas en este mes: nada que repartir.</p>
            ) : (
              <div className="divide-y rounded-lg border text-sm">
                {plan.rows.map((r) => (
                  <div key={`${r.pool}-${r.username}`} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <span>
                      <strong>@{r.username}</strong> · {r.poolName}
                      {r.shares > 0 && ` · ${r.shares} acc.`}
                      {r.note && <span className="text-muted-foreground"> · {r.note}</span>}
                    </span>
                    <span className="font-semibold">{money(r.amountUsd)}</span>
                  </div>
                ))}
              </div>
            )}

            {!plan.alreadyRun && plan.rows.length > 0 && (
              <Button disabled={pending} onClick={pay}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Pagar fondos de {plan.month}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

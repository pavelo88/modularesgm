'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Clock, Loader2, Wallet } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { requestWithdrawal } from '@/lib/affiliate-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState, PageHeader, StatCard, money, shortDate, useUserDocs } from '@/components/affiliates/portal-ui';

interface Withdrawal {
  id: string;
  createdAt: string;
  amountUsd: number;
  method: string;
  status: 'pending' | 'paid' | 'rejected';
  note?: string;
}

const METHODS = ['Transferencia bancaria', 'PayPal', 'Efectivo en oficina'] as const;
const STATUS_LABEL = { pending: 'En revisión', paid: 'Pagado', rejected: 'Rechazado' } as const;

export default function WithdrawalsPage() {
  const { affiliate, settings, user } = useAffiliateAccount();
  const { docs, loading } = useUserDocs<Withdrawal>('affiliate_withdrawals', 'affiliateUsername', affiliate.username);
  const rows = useMemo(() => [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [docs]);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<(typeof METHODS)[number]>('Transferencia bancaria');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSent(false);
    const value = Number(amount);
    if (!value || value < settings.minWithdrawal) return setError(`El retiro mínimo es ${money(settings.minWithdrawal)}.`);
    if (value > affiliate.availableBalance) return setError('El monto supera tu balance disponible.');
    setBusy(true);
    try {
      const res = await requestWithdrawal(await user.getIdToken(), { amount: value, method, details });
      if (res.success) {
        setSent(true);
        setAmount('');
        setDetails('');
      } else setError(res.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Finanzas" title="Retiros" />
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <StatCard tone="primary" icon={Wallet} label="Disponible para retirar" value={money(affiliate.availableBalance)} />
        <StatCard icon={Clock} label="En revisión" value={money(affiliate.pendingBalance)} />
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 p-6 rounded-2xl self-start">
          <h2 className="font-bold mb-4">Solicitar retiro</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="w-amount">Monto (USD)</Label>
              <Input id="w-amount" type="number" inputMode="decimal" min={settings.minWithdrawal} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Mínimo ${settings.minWithdrawal}`} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="w-method">Método</Label>
              <select id="w-method" value={method} onChange={(e) => setMethod(e.target.value as (typeof METHODS)[number])} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="w-details">Datos para el pago</Label>
              <Input id="w-details" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Banco, tipo y número de cuenta, titular" required />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            {sent && <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle2 size={16} /> Solicitud enviada. La revisaremos pronto.</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Solicitar retiro
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-3 rounded-2xl overflow-hidden self-start">
          <div className="p-5 border-b"><h2 className="font-bold">Historial</h2></div>
          {loading ? (
            <EmptyState>Cargando…</EmptyState>
          ) : rows.length === 0 ? (
            <EmptyState>Aún no has solicitado retiros.</EmptyState>
          ) : (
            <ul className="divide-y">
              {rows.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <div>
                    <p className="font-medium">{w.method}</p>
                    <p className="text-xs text-muted-foreground">{shortDate(w.createdAt)}{w.note ? ` · ${w.note}` : ''}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold">{money(w.amountUsd)}</p>
                    <Badge variant={w.status === 'paid' ? 'default' : w.status === 'rejected' ? 'destructive' : 'secondary'}>{STATUS_LABEL[w.status]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

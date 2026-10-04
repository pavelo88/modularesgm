'use client';

import { useMemo, useState } from 'react';
import { ArrowDownToLine, CheckCircle2, Clock, History, Loader2, Wallet, XCircle } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { requestWithdrawal } from '@/lib/affiliate-actions';
import { Button } from '@/components/ui/button';
import {
  EmptyState,
  PageHeader,
  Segmented,
  SectionTitle,
  StatCard,
  StatusPill,
  TextField,
  enter,
  fieldLabel,
  money,
  shortDate,
  surface,
  useUserDocs,
} from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

interface Withdrawal {
  id: string;
  createdAt: string;
  amountUsd: number;
  method: string;
  status: 'pending' | 'paid' | 'rejected';
  note?: string;
}

const METHODS = ['Transferencia bancaria', 'PayPal', 'Efectivo en oficina'] as const;
type Method = (typeof METHODS)[number];

const STATUS = {
  pending: { label: 'En revisión', tone: 'warn', icon: Clock },
  paid: { label: 'Pagado', tone: 'success', icon: CheckCircle2 },
  rejected: { label: 'Rechazado', tone: 'danger', icon: XCircle },
} as const;

const DETAIL_HINT: Record<Method, { label: string; placeholder: string }> = {
  'Transferencia bancaria': { label: 'Datos de la cuenta', placeholder: 'Banco, tipo y número de cuenta, titular' },
  PayPal: { label: 'Correo de PayPal', placeholder: 'tu-correo@ejemplo.com' },
  'Efectivo en oficina': { label: 'Quién retira', placeholder: 'Nombre y cédula de quien retirará' },
};

export default function WithdrawalsPage() {
  const { affiliate, settings, user } = useAffiliateAccount();
  const { docs, loading } = useUserDocs<Withdrawal>('affiliate_withdrawals', 'affiliateUsername', affiliate.username);
  const rows = useMemo(() => [...docs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [docs]);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Method>('Transferencia bancaria');
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
      <PageHeader eyebrow="Finanzas" title="Retiros" subtitle={`Retira tus ganancias cuando quieras. El mínimo es ${money(settings.minWithdrawal)}.`} />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 md:mb-8 md:gap-4">
        <StatCard tone="primary" delay={60} icon={Wallet} label="Disponible para retirar" value={money(affiliate.availableBalance)} />
        <StatCard delay={100} icon={Clock} label="En revisión" value={money(affiliate.pendingBalance)} hint="Solicitudes pendientes de pago" />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <section style={{ animationDelay: '140ms' }} className={cn(surface, enter, 'min-w-0 p-5 md:p-6 lg:col-span-2')}>
          <SectionTitle icon={ArrowDownToLine} title="Solicitar retiro" hint="Revisamos cada solicitud y te avisamos al pagarla." />
          <form onSubmit={submit} className="space-y-4">
            <TextField
              label="Monto (USD)"
              type="number"
              inputMode="decimal"
              min={settings.minWithdrawal}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Mínimo ${settings.minWithdrawal}`}
              required
            />
            <div className="space-y-1.5">
              <span className={fieldLabel}>Método</span>
              <div>
                <Segmented label="Método de pago" value={method} onChange={setMethod} options={METHODS.map((m) => ({ value: m, label: m.split(' ')[0] }))} />
              </div>
              <p className="text-xs text-muted-foreground">{method}</p>
            </div>
            <TextField
              label={DETAIL_HINT[method].label}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={DETAIL_HINT[method].placeholder}
              required
            />
            {error && (
              <p role="alert" className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-[13px] leading-snug text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)]">
                {error}
              </p>
            )}
            {sent && (
              <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-[13px] leading-snug text-emerald-700 shadow-[inset_0_0_0_1px_hsl(152_60%_40%/0.25)] dark:text-emerald-300">
                <CheckCircle2 size={16} className="shrink-0" /> Solicitud enviada. La revisaremos pronto.
              </p>
            )}
            <Button type="submit" className="h-11 w-full rounded-xl text-[15px] font-semibold" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {busy ? 'Enviando…' : 'Solicitar retiro'}
            </Button>
          </form>
        </section>

        <section style={{ animationDelay: '180ms' }} className={cn(surface, enter, 'min-w-0 overflow-hidden lg:col-span-3')}>
          <div className="flex items-center gap-2.5 px-5 py-4 shadow-[0_1px_0_hsl(var(--border)/0.7)]">
            <History size={16} className="text-primary" />
            <h2 className="font-semibold">Historial</h2>
          </div>
          {loading ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">Cargando…</p>
          ) : rows.length === 0 ? (
            <EmptyState icon={ArrowDownToLine}>Aún no has solicitado retiros.</EmptyState>
          ) : (
            <ul className="divide-y divide-border/60">
              {rows.map((w) => {
                const st = STATUS[w.status];
                return (
                  <li key={w.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 hover:bg-muted/40">
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                        w.status === 'paid' && 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400',
                        w.status === 'pending' && 'bg-amber-500/14 text-amber-700 dark:text-amber-400',
                        w.status === 'rejected' && 'bg-red-500/12 text-red-600 dark:text-red-400'
                      )}
                    >
                      <st.icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{w.method}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {shortDate(w.createdAt)}
                        {w.note ? ` · ${w.note}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm font-bold tabular-nums">{money(w.amountUsd)}</p>
                      <StatusPill tone={st.tone}>{st.label}</StatusPill>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

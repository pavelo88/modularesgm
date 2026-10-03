'use client';

import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { CalendarDays, Fingerprint, KeyRound, Loader2, Mail, Network, Phone, UserRound } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { Button } from '@/components/ui/button';
import { PageHeader, shortDate } from '@/components/affiliates/portal-ui';
import { PasswordField, StrengthMeter } from '@/components/affiliates/password-setup-dialog';
import { UsernameEditor } from '@/components/affiliates/username-editor';
import { cn } from '@/lib/utils';

/** Tarjeta con sombra translúcida (en vez de borde duro) y entrada suave. */
const panel =
  'min-w-0 rounded-2xl bg-card p-6 shadow-[0_0_0_1px_hsl(var(--border)/0.7),0_10px_30px_-18px_rgb(0_0_0/0.5)] ' +
  'animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-emil-out motion-reduce:animate-none';

function SectionTitle({ icon: Icon, title, hint }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; hint?: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]">
        <Icon size={17} />
      </span>
      <div>
        <h2 className="font-semibold leading-tight">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { affiliate, user } = useAffiliateAccount();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const initials = affiliate.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const hasMovements = (affiliate.salesCount || 0) > 0 || (affiliate.totalEarnings || 0) > 0 || (affiliate.pendingBalance || 0) > 0;

  const details: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }[] = [
    { icon: Mail, label: 'Correo', value: affiliate.email },
    { icon: Phone, label: 'Teléfono', value: affiliate.phone || '—' },
    { icon: Fingerprint, label: 'Cédula / ID', value: affiliate.cedula.replace(/.(?=.{3})/g, '•') },
    { icon: CalendarDays, label: 'Miembro desde', value: shortDate(affiliate.createdAt) },
    { icon: Network, label: 'Patrocinador', value: affiliate.parentId === affiliate.username ? '—' : `@${affiliate.parentId}` },
  ];

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) return setMsg({ ok: false, text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    if (next === current) return setMsg({ ok: false, text: 'La nueva contraseña debe ser distinta a la actual.' });
    setBusy(true);
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email || '', current));
      await updatePassword(user, next);
      setCurrent('');
      setNext('');
      setMsg({ ok: true, text: 'Contraseña actualizada correctamente.' });
    } catch {
      setMsg({ ok: false, text: 'No se pudo cambiar. Verifica tu contraseña actual.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Cuenta" title="Mi perfil" />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Identidad */}
        <section className={panel}>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 font-headline text-2xl font-bold text-primary-foreground shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.6)]">
              {initials || <UserRound size={26} />}
            </span>
            <div className="min-w-0">
              <p className="truncate font-headline text-xl font-bold leading-tight">{affiliate.name}</p>
              <p className="truncate font-mono text-sm text-muted-foreground">@{affiliate.username}</p>
              <span className="mt-2 inline-flex rounded-full bg-primary/12 px-2.5 py-0.5 text-[11px] font-semibold text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
                {affiliate.rank}
              </span>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-border/60">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 text-sm">
                <Icon size={16} className="shrink-0 text-muted-foreground" />
                <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 break-words text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">Para corregir nombre, correo o cédula escribe a soporte.</p>
        </section>

        <div className="min-w-0 space-y-6">
          {/* Usuario */}
          <section className={cn(panel, 'delay-75')}>
            <SectionTitle icon={UserRound} title="Tu usuario" hint="Es el nombre de tu enlace de referidos y tu código de descuento." />
            <UsernameEditor current={affiliate.username} user={user} locked={hasMovements} />
          </section>

          {/* Contraseña */}
          <section className={cn(panel, 'delay-100')}>
            <SectionTitle icon={KeyRound} title="Cambiar contraseña" hint="Usa una clave que no repitas en otros sitios." />
            <form onSubmit={changePassword} className="space-y-4">
              <PasswordField label="Contraseña actual" value={current} onChange={setCurrent} autoComplete="current-password" />
              <PasswordField label="Nueva contraseña" value={next} onChange={setNext} autoComplete="new-password" placeholder="Mínimo 8 caracteres" />
              <StrengthMeter value={next} />
              {msg && (
                <p
                  role="status"
                  className={cn(
                    'rounded-xl px-3.5 py-2.5 text-[13px] leading-snug',
                    msg.ok
                      ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_hsl(152_60%_45%/0.25)]'
                      : 'bg-destructive/10 text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)]'
                  )}
                >
                  {msg.text}
                </p>
              )}
              <Button type="submit" disabled={busy || !current || !next} className="h-11 rounded-xl px-6 font-semibold">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {busy ? 'Guardando…' : 'Actualizar contraseña'}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

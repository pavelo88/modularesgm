'use client';

import { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { CalendarDays, Fingerprint, KeyRound, Loader2, Mail, Network, Phone, UserRound } from 'lucide-react';
import { useAffiliateAccount } from '@/context/affiliate-session';
import { Button } from '@/components/ui/button';
import { Initials, PageHeader, SectionTitle, StatusPill, enter, shortDate, surface } from '@/components/affiliates/portal-ui';
import { PasswordField, StrengthMeter } from '@/components/affiliates/password-setup-dialog';
import { UsernameEditor } from '@/components/affiliates/username-editor';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { affiliate, user } = useAffiliateAccount();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

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
      <PageHeader eyebrow="Cuenta" title="Mi perfil" subtitle="Tus datos, tu usuario y la seguridad de tu cuenta." />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Identidad */}
        <section style={{ animationDelay: '60ms' }} className={cn(surface, enter, 'relative min-w-0 overflow-hidden p-5 md:p-6')}>
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <Initials name={affiliate.name} size={68} />
            <div className="min-w-0">
              <p className="truncate font-headline text-xl font-bold leading-tight">{affiliate.name}</p>
              <p className="truncate font-mono text-sm text-muted-foreground">@{affiliate.username}</p>
              <StatusPill tone="brand" className="mt-2">
                {affiliate.rank}
              </StatusPill>
            </div>
          </div>

          <dl className="relative mt-6 divide-y divide-border/60">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3 text-sm">
                <Icon size={16} className="shrink-0 text-muted-foreground" />
                <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 break-words text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="relative mt-4 text-xs text-muted-foreground">Para corregir nombre, correo o cédula escribe a soporte.</p>
        </section>

        <div className="min-w-0 space-y-6">
          {/* Usuario */}
          <section style={{ animationDelay: '100ms' }} className={cn(surface, enter, 'min-w-0 p-5 md:p-6')}>
            <SectionTitle icon={UserRound} title="Tu usuario" hint="Es el nombre de tu enlace de referidos y tu código de descuento." />
            <UsernameEditor current={affiliate.username} user={user} changedAt={affiliate.usernameChangedAt} />
          </section>

          {/* Contraseña */}
          <section style={{ animationDelay: '140ms' }} className={cn(surface, enter, 'min-w-0 p-5 md:p-6')}>
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
                      ? 'bg-emerald-500/10 text-emerald-700 shadow-[inset_0_0_0_1px_hsl(152_60%_40%/0.25)] dark:text-emerald-300'
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

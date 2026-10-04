'use client';

import { useEffect, useId, useState } from 'react';
import type { User } from 'firebase/auth';
import { AlertCircle, ArrowRight, AtSign, Check, Link2, Loader2, Lock, ShieldAlert } from 'lucide-react';
import { changeAffiliateUsername, isUsernameAvailable } from '@/lib/affiliate-actions';
import { buildAffiliateLink, normalizeUsername } from '@/lib/affiliate-core';
import { Button } from '@/components/ui/button';
import { fieldClass, fieldLabel, shortDate } from '@/components/affiliates/portal-ui';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'short' | 'same' | 'checking' | 'available' | 'taken';

/**
 * Elegir un usuario propio. Reglas: se puede cambiar UNA sola vez, debe estar libre y se confirma
 * antes de aplicar. Se normaliza al escribir y se comprueba la disponibilidad en vivo; el servidor
 * vuelve a validar todo (nunca confiar en el cliente).
 */
export function UsernameEditor({ current, user, changedAt }: { current: string; user: User; changedAt?: string }) {
  const inputId = useId();
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    if (!value) return setStatus('idle');
    if (value === current) return setStatus('same');
    if (value.length < 3) return setStatus('short');
    setStatus('checking');
    let cancelled = false;
    const t = setTimeout(() => {
      isUsernameAvailable(value)
        .then((ok) => !cancelled && setStatus(ok ? 'available' : 'taken'))
        .catch(() => !cancelled && setStatus('idle'));
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value, current]);

  const apply = async () => {
    if (status !== 'available' || busy) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await changeAffiliateUsername(await user.getIdToken(), value);
      if (res.success) {
        setJustChanged(true);
        setResult({ ok: true, text: `Listo: ahora eres @${res.username}. Tus enlaces anteriores seguirán funcionando.` });
        setValue('');
      } else {
        setResult({ ok: false, text: res.error });
      }
    } catch {
      setResult({ ok: false, text: 'No se pudo cambiar el usuario. Intenta nuevamente.' });
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  };

  // Ya lo usó (o lo acaba de usar): solo se informa.
  if (changedAt || justChanged) {
    return (
      <div className="space-y-3">
        <div className="flex gap-3 rounded-xl bg-muted/50 p-4 text-sm shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
          <Lock size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
          <p className="leading-relaxed text-muted-foreground">
            Ya usaste tu cambio de usuario{changedAt ? ` el ${shortDate(changedAt)}` : ''}. Solo se puede hacer una vez; si necesitas otro, escribe a soporte.
          </p>
        </div>
        {result && (
          <p role="status" className="rounded-xl bg-emerald-500/10 px-3.5 py-2.5 text-[13px] leading-snug text-emerald-700 shadow-[inset_0_0_0_1px_hsl(152_60%_40%/0.25)] dark:text-emerald-300">
            {result.text}
          </p>
        )}
      </div>
    );
  }

  const hint: Record<Status, { text: string; tone: string } | null> = {
    idle: null,
    short: { text: 'Mínimo 3 caracteres.', tone: 'text-muted-foreground' },
    same: { text: 'Ese ya es tu usuario actual.', tone: 'text-muted-foreground' },
    checking: { text: 'Comprobando disponibilidad…', tone: 'text-muted-foreground' },
    available: { text: `@${value} está disponible.`, tone: 'text-emerald-600 dark:text-emerald-400' },
    taken: { text: `@${value} ya está en uso. Prueba con otro.`, tone: 'text-destructive' },
  };
  const h = hint[status];
  const previewUser = value && status === 'available' ? value : current;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={inputId} className={fieldLabel}>
          Nuevo usuario
        </label>
        <div className="relative">
          <AtSign size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id={inputId}
            value={value}
            onChange={(e) => {
              setResult(null);
              setConfirming(false);
              setValue(normalizeUsername(e.target.value));
            }}
            maxLength={24}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={current}
            aria-describedby={`${inputId}-hint`}
            className={cn(
              fieldClass,
              'pl-9 pr-10 font-mono',
              status === 'taken' && 'shadow-[0_0_0_1px_hsl(var(--destructive))] focus:shadow-[0_0_0_2px_hsl(var(--destructive))]',
              status === 'available' && 'shadow-[0_0_0_1px_hsl(152_60%_40%/0.8)] focus:shadow-[0_0_0_2px_hsl(152_60%_40%)]'
            )}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden>
            {status === 'checking' && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
            {status === 'available' && <Check size={16} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />}
            {status === 'taken' && <AlertCircle size={16} className="text-destructive" />}
          </span>
        </div>
        <p id={`${inputId}-hint`} aria-live="polite" className={cn('min-h-[1.1rem] text-xs', h?.tone ?? 'text-muted-foreground')}>
          {h?.text ?? 'Letras, números, punto, guion o guion bajo. Se guarda en minúsculas.'}
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3.5 py-2.5 text-xs shadow-[inset_0_0_0_1px_hsl(var(--border)/0.5)]">
        <Link2 size={14} className="shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground">{buildAffiliateLink(previewUser)}</span>
      </div>

      {result && !result.ok && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-[13px] leading-snug text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)]">
          {result.text}
        </p>
      )}

      {confirming && status === 'available' ? (
        <div className="space-y-3 rounded-xl bg-amber-500/10 p-4 shadow-[inset_0_0_0_1px_hsl(38_90%_45%/0.3)] animate-in fade-in-0 zoom-in-95 duration-200 ease-emil-out motion-reduce:animate-none">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-900 dark:text-amber-200">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <span>
              Vas a cambiar <strong>@{current}</strong> <ArrowRight size={12} className="mx-0.5 inline" /> <strong>@{value}</strong>. Solo puedes hacerlo{' '}
              <strong>una vez</strong>. Tus enlaces anteriores seguirán funcionando.
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={apply} disabled={busy} className="h-10 rounded-xl px-5 font-semibold">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {busy ? 'Aplicando…' : 'Sí, cambiar mi usuario'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)} disabled={busy} className="h-10 rounded-xl px-4">
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Button onClick={() => setConfirming(true)} disabled={status !== 'available'} className="h-11 rounded-xl px-6 font-semibold">
            Guardar usuario
          </Button>
          <p className="text-xs text-muted-foreground">Puedes cambiarlo una sola vez.</p>
        </div>
      )}
    </div>
  );
}

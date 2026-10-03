'use client';

import { useEffect, useId, useState } from 'react';
import type { User } from 'firebase/auth';
import { AlertCircle, AtSign, Check, Link2, Loader2, Lock } from 'lucide-react';
import { changeAffiliateUsername, isUsernameAvailable } from '@/lib/affiliate-actions';
import { buildAffiliateLink, normalizeUsername } from '@/lib/affiliate-core';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'short' | 'same' | 'checking' | 'available' | 'taken';

/**
 * Permite elegir un usuario propio: se normaliza al escribir, se comprueba en vivo que esté libre
 * y solo entonces se habilita el botón. El servidor vuelve a validar todo (nunca confiar en el cliente).
 */
export function UsernameEditor({ current, user, locked }: { current: string; user: User; locked: boolean }) {
  const inputId = useId();
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

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

  const save = async () => {
    if (status !== 'available' || busy) return;
    if (
      !window.confirm(
        `Tu usuario pasará de @${current} a @${value}.\n\nTu enlace anterior dejará de funcionar y deberás compartir el nuevo. ¿Continuar?`
      )
    )
      return;
    setBusy(true);
    setResult(null);
    try {
      const res = await changeAffiliateUsername(await user.getIdToken(), value);
      if (res.success) {
        setResult({ ok: true, text: `Listo: ahora eres @${res.username}. Tu nuevo enlace ya está activo.` });
        setValue('');
      } else {
        setResult({ ok: false, text: res.error });
      }
    } catch {
      setResult({ ok: false, text: 'No se pudo cambiar el usuario. Intenta nuevamente.' });
    } finally {
      setBusy(false);
    }
  };

  const hint: Record<Status, { text: string; tone: string } | null> = {
    idle: null,
    short: { text: 'Mínimo 3 caracteres.', tone: 'text-muted-foreground' },
    same: { text: 'Ese ya es tu usuario actual.', tone: 'text-muted-foreground' },
    checking: { text: 'Comprobando disponibilidad…', tone: 'text-muted-foreground' },
    available: { text: `@${value} está disponible.`, tone: 'text-emerald-400' },
    taken: { text: `@${value} ya está en uso. Prueba con otro.`, tone: 'text-destructive' },
  };
  const h = hint[status];
  const previewUser = value && status === 'available' ? value : current;

  if (locked) {
    return (
      <div className="flex gap-3 rounded-xl bg-muted/40 p-4 text-sm shadow-[inset_0_0_0_1px_hsl(var(--border)/0.6)]">
        <Lock size={18} className="mt-0.5 shrink-0 text-muted-foreground" />
        <p className="leading-relaxed text-muted-foreground">
          Tu usuario ya tiene ventas, comisiones o retiros asociados, así que no se puede cambiar sin afectar tu historial. Si necesitas un cambio,
          escribe a soporte.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Nuevo usuario
        </label>
        <div className="relative">
          <AtSign size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id={inputId}
            value={value}
            onChange={(e) => {
              setResult(null);
              setValue(normalizeUsername(e.target.value));
            }}
            maxLength={24}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={current}
            aria-describedby={`${inputId}-hint`}
            className={cn(
              'h-11 w-full rounded-xl bg-background/60 pl-9 pr-10 font-mono text-sm outline-none transition-shadow duration-150',
              'shadow-[0_0_0_1px_hsl(var(--border))] placeholder:text-muted-foreground/50 focus:shadow-[0_0_0_2px_hsl(var(--primary))]',
              status === 'taken' && 'shadow-[0_0_0_1px_hsl(var(--destructive))] focus:shadow-[0_0_0_2px_hsl(var(--destructive))]',
              status === 'available' && 'shadow-[0_0_0_1px_hsl(152_60%_45%/0.7)] focus:shadow-[0_0_0_2px_hsl(152_60%_45%)]'
            )}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden>
            {status === 'checking' && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
            {status === 'available' && <Check size={16} strokeWidth={3} className="text-emerald-400" />}
            {status === 'taken' && <AlertCircle size={16} className="text-destructive" />}
          </span>
        </div>
        <p id={`${inputId}-hint`} aria-live="polite" className={cn('min-h-[1.1rem] text-xs', h?.tone ?? 'text-muted-foreground')}>
          {h?.text ?? 'Letras, números, punto, guion o guion bajo. Se guarda en minúsculas.'}
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3.5 py-2.5 text-xs shadow-[inset_0_0_0_1px_hsl(var(--border)/0.5)]">
        <Link2 size={14} className="shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground">{buildAffiliateLink(previewUser)}</span>
      </div>

      {result && (
        <p
          role="status"
          className={cn(
            'rounded-xl px-3.5 py-2.5 text-[13px] leading-snug',
            result.ok
              ? 'bg-emerald-500/10 text-emerald-400 shadow-[inset_0_0_0_1px_hsl(152_60%_45%/0.25)]'
              : 'bg-destructive/10 text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)]'
          )}
        >
          {result.text}
        </p>
      )}

      <Button onClick={save} disabled={status !== 'available' || busy} className="h-11 rounded-xl px-6 font-semibold">
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {busy ? 'Guardando…' : 'Guardar usuario'}
      </Button>
    </div>
  );
}
